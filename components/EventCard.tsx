'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface EventProps {
  event: {
    title: string
    date: string
    time: string
    location: string
    tags: string[]
    description: string
  }
}

export default function EventCard({ event }: EventProps) {
  return (
    <motion.div
      className="rounded-xl shadow-md p-5 bg-white dark:bg-zinc-900 transition-all border border-zinc-200 dark:border-zinc-700"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
        {event.title}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {event.date} • {event.time}
      </p>
      <p className="text-sm mt-1 text-zinc-700 dark:text-zinc-300">{event.location}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-white text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm mt-3 text-zinc-700 dark:text-zinc-300">{event.description}</p>
      <Link
        href="/register"
        className="mt-4 block text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Register
      </Link>
    </motion.div>
  )
}
