'use client'

import { signOut, useSession } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">
          CampusHub
        </h1>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#events" className="hover:text-indigo-500 transition">Events</a>

          {status === 'authenticated' ? (
            <>
              <span className="text-zinc-600 dark:text-zinc-300">
                Hello, {session.user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="text-indigo-600 hover:text-indigo-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-indigo-500 transition">
              Login
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
