import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import logoPng from '../../blacklane-logo.png'
import { MessageCircle } from 'lucide-react'

async function fetchCount(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
  if (error) return 0
  return count ?? 0
}

export function AdminNavbar() {
  const homeUrl = (import.meta as any).env?.VITE_MAIN_APP_URL || '/'
  const logoUrl = logoPng

  const { data: jetCount } = useQuery({ queryKey: ['count', 'jet_bookings'], queryFn: () => fetchCount('jet_bookings') })
  const { data: tripCount } = useQuery({ queryKey: ['count', 'trips'], queryFn: () => fetchCount('trips') })
  const { data: notifCount } = useQuery({ queryKey: ['count', 'events'], queryFn: () => fetchCount('events') })

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="font-semibold hidden md:block">Admin</div>
          <input className="hidden lg:block w-64 rounded border px-3 py-2 text-sm" placeholder="Search" />
        </div>

        {/* Center brand logo as homepage button */}
        <div className="flex items-center justify-center">
          <a href={homeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            <img src={logoUrl} alt="Blacklane" className="h-8 w-auto object-contain" />
          </a>
        </div>

        {/* Right quick links with counts */}
        <nav className="flex items-center justify-end gap-3 text-sm">
          <a href="/jet-bookings" className="rounded border px-2 py-1 bg-white hover:bg-gray-50">
            Jet Bookings <span className="ml-1 inline-block rounded bg-black text-white px-1">{jetCount ?? 0}</span>
          </a>
          <a href="/trips" className="rounded border px-2 py-1 bg-white hover:bg-gray-50">
            Car Bookings <span className="ml-1 inline-block rounded bg-black text-white px-1">{tripCount ?? 0}</span>
          </a>
          <a href="/notifications" className="rounded border px-2 py-1 bg-white hover:bg-gray-50">
            Notifications <span className="ml-1 inline-block rounded bg-black text-white px-1">{notifCount ?? 0}</span>
          </a>
          <a href="https://wa.me/2348108971777" target="_blank" rel="noreferrer" className="rounded border px-2 py-1 bg-white hover:bg-gray-50 inline-flex items-center gap-1">
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
