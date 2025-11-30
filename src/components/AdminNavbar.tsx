export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="font-semibold">Admin</div>
        <div className="flex items-center gap-3">
          <input className="hidden md:block w-64 rounded border px-3 py-2 text-sm" placeholder="Search" />
        </div>
      </div>
    </header>
  )
}
