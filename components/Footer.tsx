export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 dark:border-zinc-800 text-sm text-center py-8 text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4">
        <p>© 2025 CampusHub. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-6">
          <a href="#" className="hover:text-indigo-500 transition">About</a>
          <a href="#" className="hover:text-indigo-500 transition">Contact</a>
          <a href="#" className="hover:text-indigo-500 transition">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
