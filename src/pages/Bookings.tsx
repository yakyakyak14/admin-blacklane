import { useState } from 'react'
import Trips from './Trips'
import JetBookings from './JetBookings'

export default function Bookings() {
  const [tab, setTab] = useState<'cars' | 'jets'>('cars')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bookings</h1>

      <div className="rounded border bg-white p-2">
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-2 rounded text-sm ${tab === 'cars' ? 'bg-black text-white' : 'border'}`}
            onClick={() => setTab('cars')}
          >
            Cars
          </button>
          <button
            className={`px-3 py-2 rounded text-sm ${tab === 'jets' ? 'bg-black text-white' : 'border'}`}
            onClick={() => setTab('jets')}
          >
            Jets
          </button>
        </div>
      </div>

      <div>
        {tab === 'cars' ? <Trips /> : <JetBookings />}
      </div>
    </div>
  )
}
