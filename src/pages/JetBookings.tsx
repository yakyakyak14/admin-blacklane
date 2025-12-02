import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface JetBookingRow {
  id: string
  user_id: string | null
  user_email: string | null
  jet_id: string | null
  jet_make: string | null
  jet_model: string | null
  from_airport: string | null
  to_airport: string | null
  dep_time: string | null
  pax_count: number | null
  notes: string | null
  status: string | null
  price_estimate: number | null
  created_at: string | null
}

async function fetchJetBookings() {
  const { data, error } = await supabase.rpc('admin_list_jet_bookings')
  if (error) throw error
  return (data || []) as JetBookingRow[]
}

export default function JetBookings() {
  const { data: bookings, isLoading, error } = useQuery({ queryKey: ['jet_bookings_admin'], queryFn: fetchJetBookings })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Jet Bookings</h1>
      <div className="rounded border bg-white p-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Jet</th>
                <th className="px-2 py-2">From</th>
                <th className="px-2 py-2">To</th>
                <th className="px-2 py-2">Departure</th>
                <th className="px-2 py-2">Pax</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="px-2 py-2">{b.created_at ? new Date(b.created_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{b.user_email || b.user_id || '—'}</td>
                  <td className="px-2 py-2">{b.jet_make || b.jet_model ? `${b.jet_make ?? ''} ${b.jet_model ?? ''}`.trim() : (b.jet_id || '—')}</td>
                  <td className="px-2 py-2">{b.from_airport || '—'}</td>
                  <td className="px-2 py-2">{b.to_airport || '—'}</td>
                  <td className="px-2 py-2">{b.dep_time ? new Date(b.dep_time).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{b.pax_count ?? '—'}</td>
                  <td className="px-2 py-2">{b.status || 'pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
