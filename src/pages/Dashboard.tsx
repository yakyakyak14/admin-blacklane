import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

async function fetchCount(table: string) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
  if (error) return null
  return count ?? 0
}

async function fetchTripsSeries() {
  const { data, error } = await supabase.from('trips').select('id, created_at').order('created_at', { ascending: true }).limit(200)
  if (error || !data) return [] as Array<{ month: string; trips: number }>
  const map = new Map<string, number>()
  for (const t of data as Array<{ created_at: string }>) {
    if (!t.created_at) continue
    const d = new Date(t.created_at)
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(m, (map.get(m) || 0) + 1)
  }
  const series = Array.from(map.entries()).sort(([a], [b]) => (a > b ? 1 : -1)).map(([month, trips]) => ({ month, trips }))
  return series
}

export default function Dashboard() {
  const { data: usersCount } = useQuery({ queryKey: ['count', 'users'], queryFn: () => fetchCount('users') })
  const { data: driversCount } = useQuery({ queryKey: ['count', 'drivers'], queryFn: () => fetchCount('drivers') })
  const { data: tripsCount } = useQuery({ queryKey: ['count', 'trips'], queryFn: () => fetchCount('trips') })
  const { data: payoutsCount } = useQuery({ queryKey: ['count', 'payouts'], queryFn: () => fetchCount('payouts') })
  const { data: tripsSeries } = useQuery({ queryKey: ['series', 'trips'], queryFn: fetchTripsSeries })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-500">Total Trips</div>
          <div className="text-2xl font-semibold">{tripsCount ?? '—'}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-500">Drivers</div>
          <div className="text-2xl font-semibold">{driversCount ?? '—'}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-semibold">{usersCount ?? '—'}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-gray-500">Pending Payouts</div>
          <div className="text-2xl font-semibold">{payoutsCount ?? '—'}</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded border bg-white p-4 h-80">
          <div className="mb-2 font-semibold">Trips over time</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tripsSeries || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="#111" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded border bg-white p-4 h-80">Revenue Chart (coming soon)</div>
      </div>
    </div>
  )
}
