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
  user_id: string | null
  user_email: string | null
  user_name: string | null
  driver_id: string | null
  driver_email: string | null
  driver_name: string | null
  car_id: string | null
  car_make: string | null
  car_model: string | null
  car_plate: string | null
}

async function fetchTrips() {
  const { data, error } = await supabase.rpc('admin_list_trips')
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
                  <td className="px-2 py-2">{t.user_name || t.user_email || '—'}</td>
                  <td className="px-2 py-2">{t.driver_name || t.driver_email || '—'}</td>
                  <td className="px-2 py-2">{t.car_make || t.car_model ? `${t.car_make ?? ''} ${t.car_model ?? ''}${t.car_plate ? ` (${t.car_plate})` : ''}`.trim() : '—'}</td>
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
