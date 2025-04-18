'use client'

import { useEffect, useRef } from 'react'

export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sparks: any[] = []
    const count = 8
    const duration = 400

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const easeOut = (t: number) => t * (2 - t)

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const isDark = document.documentElement.classList.contains('dark')
      const sparkColor = isDark ? '#fff' : '#000'

      const now = Date.now()
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        const elapsed = now - s.start
        if (elapsed > duration) {
          sparks.splice(i, 1)
          continue
        }

        const t = elapsed / duration
        const eased = easeOut(t)
        const dist = eased * 15
        const len = 10 * (1 - eased)

        const x1 = s.x + dist * Math.cos(s.angle)
        const y1 = s.y + dist * Math.sin(s.angle)
        const x2 = s.x + (dist + len) * Math.cos(s.angle)
        const y2 = s.y + (dist + len) * Math.sin(s.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      requestAnimationFrame(draw)
    }

    const clickHandler = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const now = Date.now()
      for (let i = 0; i < count; i++) {
        sparks.push({
          x,
          y,
          angle: (2 * Math.PI * i) / count,
          start: now
        })
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('click', clickHandler)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('click', clickHandler)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  )
}
