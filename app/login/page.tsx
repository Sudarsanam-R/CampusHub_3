'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CustomCheckbox from '@/components/CustomCheckbox'
import { Check, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import PasswordCaret from '@/components/PasswordCaret'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import SplashCursor from '@/components/SplashCursor'
import ClickSpark from '@/components/ClickSpark'
import ShinyText from '@/components/ShinyText'
import Ribbons from '@/components/Ribbons'
import TurnstileWidget from '@/components/TurnstileWidget'

const MAX_PASSWORD_LENGTH = 12

const validatePassword = (password: string) => {
  return (
    password.length === MAX_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export default function LoginPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      toast.success(`Welcome back, ${session.user?.name?.split(' ')[0] || 'user'}!`)
      router.push('/')
    }
  }, [status, session, router])

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.classList.add('custom-cursor')
    document.body.appendChild(cursor)

    const move = (e: MouseEvent) => {
      cursor.style.display = ''
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const clickable = t.closest('button, a, input[type="checkbox"], label, [role="button"], .clickable')
      cursor.classList.toggle('cursor-hover', !!clickable)
      document.body.style.cursor = 'none'
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    
    // Hide cursor when leaving window
    const hideCursor = () => {
      cursor.style.display = 'none'
      cursor.style.left = '-9999px'
      cursor.style.top = '-9999px'
      document.body.style.cursor = ''
    }
    const showCursor = () => {
      cursor.style.display = ''
      document.body.style.cursor = 'none'
    }
    window.addEventListener('mouseleave', hideCursor)
    window.addEventListener('mouseenter', showCursor)
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || (e.relatedTarget as HTMLElement).nodeName === 'HTML') {
        hideCursor()
      }
    })

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      window.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('mouseenter', showCursor)
      cursor.remove()
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <SplashCursor />
      <ClickSpark />
      <style>{`
        .custom-cursor {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          background-color: white;
          transform: translate(-50%, -50%);
          transition: width 0.2s ease, height 0.2s ease;
        }
        .custom-cursor.cursor-hover {
          width: 25px;
          height: 25px;
        }
      `}</style>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition relative overflow-hidden">
        <Ribbons
          baseThickness={30}
          colors={['#ffffff']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={true}
        />

        <div className="absolute top-4 right-4 flex gap-3 z-30">
          <button
            onClick={toggleTheme}
            className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full shadow hover:scale-105 transition"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        
          <div className="relative w-[98vw] max-w-xs sm:max-w-sm md:max-w-md rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_0_30px_rgba(99,102,241,0.4)] dark:shadow-[0_0_30px_rgba(99,102,241,0.3)] p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">
              Login to CampusHub
            </h1>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline cursor-pointer">Sign up</a>
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div className="relative">
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 pr-12 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="username"
                />
                {isEmailValid && <Check className="absolute right-24 top-1/2 -translate-y-1/2 text-green-500" size={20} />}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-16 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-transparent"
                  maxLength={MAX_PASSWORD_LENGTH}
                  autoComplete="current-password"
                  required
                />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400 mr-6">
                  {password.length}/{MAX_PASSWORD_LENGTH}
                </span>
                {!passwordVisible && (
                  <PasswordCaret
                    caretIndex={passwordInputRef.current?.selectionStart ?? password.length}
                    fillPercent={password.length / MAX_PASSWORD_LENGTH}
                  />
                )}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title={passwordVisible ? 'Hide Password' : 'Show Password'}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Remember me */}
              <div className="flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400 px-1">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-400">
                  <CustomCheckbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} label={<span className="text-black dark:text-white">Remember me</span>} />
                </div>
                <a href="/forgot-password" className="text-indigo-600 hover:underline cursor-pointer">Forgot password?</a>
              </div>

              <div className="flex justify-center my-2">
                <TurnstileWidget
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                  theme={theme === 'dark' ? 'dark' : 'light'}
                  onVerify={setCaptchaToken}
                />
              </div>
              <button
                className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold overflow-hidden relative"
                onClick={async (e) => {
                  e.preventDefault();
                  if (!isEmailValid) {
                    toast.error('Please enter a valid email address.');
                    return;
                  }
                  if (!validatePassword(password)) {
                    toast.error('Password does not meet requirements.');
                    return;
                  }
                  if (!captchaToken) {
                    toast.error('Please complete the captcha.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/login-user', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email,
                        password
                      })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      toast.error(data.error || 'Login failed');
                      return;
                    }
                    toast.success('Login successful! Redirecting...');
                    setTimeout(() => router.push('/'), 1500);
                  } catch (err) {
                    toast.error('Something went wrong. Please try again.');
                  }
                }}
              >
                Login
              </button>
            </div>

            {/* OAuth Section */}
            <div className="mt-8">
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-4">Or sign in with</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <OAuthButton icon="/google.svg" name="Google" />
                <OAuthButton icon="/facebook.svg" name="Facebook" />
                <OAuthButton icon="/github-light.svg" darkIcon="/github-dark.svg" name="GitHub" />
              </div>
            </div>
          </div>
        
      </main>
    </>
  )
}

function OAuthButton({ icon, darkIcon, name, iconComponent }: {
  icon?: string; darkIcon?: string; name: string; iconComponent?: React.ReactNode
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => signIn(name.toLowerCase())}
      className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition text-zinc-800 dark:text-white w-[80vw] max-w-[8rem] sm:max-w-[10rem] md:max-w-[12rem] lg:max-w-[14rem] xl:max-w-[16rem] mx-auto"
    >
      {iconComponent ? iconComponent : (
        <Image
          src={isDark && darkIcon ? darkIcon : icon ?? ''}
          alt={`${name} logo`}
          width={16}
          height={16}
        />
      )}
      <ShinyText text={name} className={isDark ? '' : 'shinyLight'} />
    </button>
  )
}
