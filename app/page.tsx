'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EventCard from '@/components/EventCard'
import SplashCursor from '@/components/SplashCursor'

const events = [
  {
    title: 'HackMIT 2025',
    date: 'May 12, 2025',
    time: '10:00 AM',
    location: 'MIT, Cambridge',
    tags: ['Hackathon', 'AI'],
    description: 'Build innovative projects with students from around the world.',
  },
  {
    title: 'CodeFest NIT',
    date: 'June 4, 2025',
    time: '2:00 PM',
    location: 'NIT Trichy',
    tags: ['Coding', 'Tech Talk'],
    description: 'Workshops, coding rounds, and more at CodeFest 2025.',
  },
  {
    title: 'TechSpark 2025',
    date: 'July 1, 2025',
    time: '11:00 AM',
    location: 'IIT Bombay',
    tags: ['Startup', 'Innovation'],
    description: 'A celebration of ideas, startups, and student entrepreneurship.',
  },
]

export default function Home() {
  return (
    <>
      <SplashCursor />
      <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
        <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="text-center mb-20">
          <h1 className="text-3xl font-bold mb-4">
            Discover Events & Hackathons on CampusHub 🎓
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Stay in the loop with student tech, innovation, and culture events.
          </p>
        </section>

        <section id="events" className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
    </>
  )
}
