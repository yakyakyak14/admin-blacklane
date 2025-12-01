import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface Jet {
  id: string
  make: string
  model: string
  capacity: number | null
  range_nm: number | null
  hourly_rate: number | null
  status: string | null
  image_url?: string | null
  created_at?: string
}

const BUCKET = 'jets'

async function fetchJets() {
  const { data, error } = await supabase.from('jets').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Jet[]
}

export default function Jets() {
  const qc = useQueryClient()
  const [form, setForm] = useState<any>({ make: '', model: '', capacity: 6, range_nm: 2000, hourly_rate: 0, status: 'available' })
  const [file, setFile] = useState<File | null>(null)

  const { data: jets, isLoading, error } = useQuery({ queryKey: ['jets'], queryFn: fetchJets })

  const createMutation = useMutation({
    mutationFn: async () => {
      let image_url: string | undefined
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${ext}`
        const upload = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
        if (upload.error) throw upload.error
        const pub = supabase.storage.from(BUCKET).getPublicUrl(path)
        image_url = pub.data.publicUrl
      }
      const payload = {
        make: form.make,
        model: form.model,
        capacity: form.capacity ? Number(form.capacity) : null,
        range_nm: form.range_nm ? Number(form.range_nm) : null,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        status: form.status,
        image_url,
      }
      const { error: insErr } = await supabase.from('jets').insert(payload)
      if (insErr) throw insErr
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jets'] })
      setForm({ make: '', model: '', capacity: 6, range_nm: 2000, hourly_rate: 0, status: 'available' })
      setFile(null)
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Jets</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Add Jet</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="rounded border px-3 py-2 text-sm" placeholder="Make" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Capacity" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Range (nm)" type="number" value={form.range_nm} onChange={e => setForm({ ...form, range_nm: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Hourly Rate (NGN)" type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <input className="rounded border px-3 py-2 text-sm" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        <button className="mt-3 rounded bg-black px-3 py-2 text-white text-sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving...' : 'Save Jet'}
        </button>
        {createMutation.error && <div className="text-sm text-red-600 mt-2">{(createMutation.error as any).message}</div>}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">All Jets</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Make</th>
                <th className="px-2 py-2">Model</th>
                <th className="px-2 py-2">Capacity</th>
                <th className="px-2 py-2">Range (nm)</th>
                <th className="px-2 py-2">Hourly Rate</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jets?.map((j) => (
                <tr key={j.id} className="border-b">
                  <td className="px-2 py-2">{j.image_url ? <img src={j.image_url} alt="jet" className="w-16 h-12 object-cover rounded" /> : <span className="text-gray-400">No image</span>}</td>
                  <td className="px-2 py-2">{j.make}</td>
                  <td className="px-2 py-2">{j.model}</td>
                  <td className="px-2 py-2">{j.capacity ?? '—'}</td>
                  <td className="px-2 py-2">{j.range_nm ?? '—'}</td>
                  <td className="px-2 py-2">{j.hourly_rate ?? '—'}</td>
                  <td className="px-2 py-2">{j.status ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
