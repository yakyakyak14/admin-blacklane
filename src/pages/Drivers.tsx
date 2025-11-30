import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface DriverRow {
  id: string
  created_at?: string
  email?: string
  name?: string
  phone?: string
  vehicle?: string
  verified?: boolean
  status?: string
  kyc_status?: string
}

async function fetchDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as DriverRow[]
}

export default function Drivers() {
  const qc = useQueryClient()
  const [query, setQuery] = useState('')
  const { data: drivers, isLoading, error } = useQuery({ queryKey: ['drivers'], queryFn: fetchDrivers })

  const verifyMutation = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: boolean }) => {
      const { error } = await supabase.from('drivers').update({ verified: next }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drivers'] })
    },
  })

  const filtered = (drivers || []).filter((d) => {
    const q = query.toLowerCase()
    return (
      !q ||
      d.email?.toLowerCase().includes(q) ||
      d.name?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.vehicle?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Drivers</h1>
        <input
          className="w-64 rounded border px-3 py-2 text-sm"
          placeholder="Search by name, email, phone, vehicle"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded border bg-white p-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Vehicle</th>
                <th className="px-2 py-2">Verified</th>
                <th className="px-2 py-2">KYC</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="px-2 py-2">{d.name || '—'}</td>
                  <td className="px-2 py-2">{d.email || '—'}</td>
                  <td className="px-2 py-2">{d.phone || '—'}</td>
                  <td className="px-2 py-2">{d.vehicle || '—'}</td>
                  <td className="px-2 py-2">{d.verified ? 'Yes' : 'No'}</td>
                  <td className="px-2 py-2">{d.kyc_status || 'pending'}</td>
                  <td className="px-2 py-2">{d.status || 'active'}</td>
                  <td className="px-2 py-2">
                    <button
                      className={`rounded px-2 py-1 text-xs ${d.verified ? 'bg-gray-200' : 'bg-black text-white'}`}
                      disabled={verifyMutation.isPending}
                      onClick={() => verifyMutation.mutate({ id: d.id, next: !d.verified })}
                    >
                      {d.verified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
