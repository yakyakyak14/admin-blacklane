import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface TripRow {
  id: string
  created_at: string | null
  status: string | null
  price: number | null
  pickup: string | null
  dropoff: string | null
  scheduled_at: string | null
  users?: { name: string | null; full_name: string | null; email: string | null } | null
  drivers?: { name: string | null; email: string | null } | null
  cars?: { make: string; model: string; plate: string | null } | null
}

async function fetchTrips() {
  const { data, error } = await supabase
    .from('trips')
    .select('id, created_at, status, price, pickup, dropoff, scheduled_at, users:user_id(name, full_name, email), drivers:driver_id(name, email), cars:car_id(make, model, plate)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as TripRow[]
}

export default function Trips() {
  const { data: trips, isLoading, error } = useQuery({ queryKey: ['trips'], queryFn: fetchTrips })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Car Bookings</h1>
      <div className="rounded border bg-white p-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Driver</th>
                <th className="px-2 py-2">Car</th>
                <th className="px-2 py-2">Pickup</th>
                <th className="px-2 py-2">Dropoff</th>
                <th className="px-2 py-2">Scheduled</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {trips?.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-2 py-2">{t.created_at ? new Date(t.created_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{t.users?.full_name || t.users?.name || t.users?.email || '—'}</td>
                  <td className="px-2 py-2">{t.drivers?.name || t.drivers?.email || '—'}</td>
                  <td className="px-2 py-2">{t.cars ? `${t.cars.make} ${t.cars.model}${t.cars.plate ? ` (${t.cars.plate})` : ''}` : '—'}</td>
                  <td className="px-2 py-2">{t.pickup || '—'}</td>
                  <td className="px-2 py-2">{t.dropoff || '—'}</td>
                  <td className="px-2 py-2">{t.scheduled_at ? new Date(t.scheduled_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{t.status || 'pending'}</td>
                  <td className="px-2 py-2">{typeof t.price === 'number' ? t.price : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
