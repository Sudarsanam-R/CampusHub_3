'use client'

import { useState } from 'react'
import RequireAuth from '@/components/RequireAuth'

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [otp, setOtp] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending OTP
    setStep('otp')
  }

  const handleVerify = () => {
    alert(`OTP "${otp}" verified successfully! 🎉`)
  }

  return (
    <RequireAuth>
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-6 max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white">
          <h1 className="text-2xl font-bold mb-4">Register for an Event</h1>

        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 text-center text-xl rounded bg-zinc-100 dark:bg-zinc-800"
                  onChange={(e) =>
                    setOtp((prev) =>
                      prev.substring(0, i) + e.target.value + prev.substring(i + 1)
                    )
                  }
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </main>
  </RequireAuth>
  )
}
