import { useEffect, useRef } from 'react'
import { Renderer, Transform, Vec3, Vec2, Color, Polyline, Camera } from 'ogl'
import styles from '../styles/Ribbons.module.css'

const Ribbons = ({
  colors = ['#FC8EAC'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create renderer and attach canvas
    const renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true })
    const gl = renderer.gl

    // Set clear color (if backgroundColor is a valid array)
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(
        backgroundColor[0],
        backgroundColor[1],
        backgroundColor[2],
        backgroundColor[3]
      )
    } else {
      gl.clearColor(0, 0, 0, 0)
    }

    gl.canvas.style.position = 'absolute'
    gl.canvas.style.top = '0'
    gl.canvas.style.left = '0'
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    container.appendChild(gl.canvas)

    // Create scene and camera
    const scene = new Transform()
    const camera = new Camera(gl, { fov: 45 })
    camera.position.z = 800

    // Array to hold our line data
    const lines: any[] = []

    // Full vertex shader – note that it expects uResolution and uDPR
    const vertex = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `

    // Full fragment shader
    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `

    // Update the renderer and shader uniforms on resize
    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      // Update uResolution & uDPR for each line’s shader
      lines.forEach(line => {
        line.polyline.resize()
        line.polyline.mesh.program.uniforms.uResolution.value.set(width, height)
        line.polyline.mesh.program.uniforms.uDPR.value = window.devicePixelRatio || 2
      })
    }
    window.addEventListener('resize', resize)

    const center = (colors.length - 1) / 2
    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.05
      const friction = baseFriction + (Math.random() - 0.5) * 0.05
      const thickness = baseThickness + (Math.random() - 0.5) * 3
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.1,
        0
      )

      const points = Array.from({ length: pointCount }, () => new Vec3())

      // IMPORTANT: Supply uResolution and uDPR uniforms!
      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
          uResolution: { value: new Vec2(container.clientWidth, container.clientHeight) },
          uDPR: { value: window.devicePixelRatio || 2 },
        },
      })

      polyline.mesh.setParent(scene)

      lines.push({
        spring,
        friction,
        mouseVelocity: new Vec3(),
        mouseOffset,
        points,
        polyline,
      })
    })

    resize()

    const mouse = new Vec3()
    const updateMouse = (e: any) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top
      mouse.set((x / container.clientWidth) * 2 - 1, (y / container.clientHeight) * -2 + 1, 0)
    }
    container.addEventListener('mousemove', updateMouse)
    container.addEventListener('touchstart', updateMouse)
    container.addEventListener('touchmove', updateMouse)

    const tmp = new Vec3()
    let lastTime = performance.now()
    let frameId: number

    const update = () => {
      frameId = requestAnimationFrame(update)
      const currentTime = performance.now()
      const dt = currentTime - lastTime
      lastTime = currentTime

      if (!lines.length) return

      lines.forEach(line => {
        tmp.copy(mouse)
          .add(line.mouseOffset)
          .sub(line.points[0])
          .multiply(line.spring)
        line.mouseVelocity.add(tmp).multiply(line.friction)
        line.points[0].add(line.mouseVelocity)

        for (let i = 1; i < line.points.length; i++) {
          const alpha = Math.min(1, (dt * speedMultiplier) / (maxAge / (line.points.length - 1)))
          line.points[i].lerp(line.points[i - 1], alpha)
        }

        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001
        }

        line.polyline.updateGeometry()
      })

      renderer.render({ scene, camera })
    }

    update()

    return () => {
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', updateMouse)
      container.removeEventListener('touchstart', updateMouse)
      container.removeEventListener('touchmove', updateMouse)
      cancelAnimationFrame(frameId)
      if (gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas)
      }
    }
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor,
  ])

  return <div ref={containerRef} className={styles.ribbonsContainer} />
}

export default Ribbons
