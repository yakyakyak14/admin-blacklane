import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface Car {
  id: string
  created_at?: string
  make: string
  model: string
  year: number
  plate?: string
  seats?: number
  rate?: number
  status?: string
  image_url?: string
}

const BUCKET = 'cars'

async function fetchCars() {
  const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Car[]
}

export default function Cars() {
  const qc = useQueryClient()
  const [form, setForm] = useState<{ [k: string]: any }>({ make: '', model: '', year: new Date().getFullYear(), plate: '', seats: 4, rate: 0, status: 'available' })
  const [file, setFile] = useState<File | null>(null)

  const { data: cars, isLoading, error } = useQuery({ queryKey: ['cars'], queryFn: fetchCars })

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
      const payload: Omit<Car, 'id'> = {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        plate: form.plate,
        seats: Number(form.seats),
        rate: Number(form.rate),
        status: form.status,
        image_url,
      }
      const { error: insErr } = await supabase.from('cars').insert(payload)
      if (insErr) throw insErr
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars'] })
      setForm({ make: '', model: '', year: new Date().getFullYear(), plate: '', seats: 4, rate: 0, status: 'available' })
      setFile(null)
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cars</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Add New Car</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="rounded border px-3 py-2 text-sm" placeholder="Make" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Year" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Plate" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Seats" type="number" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Rate (NGN)" type="number" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <input className="rounded border px-3 py-2 text-sm" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        <button className="mt-3 rounded bg-black px-3 py-2 text-white text-sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Saving...' : 'Save Car'}
        </button>
        {createMutation.error && <div className="text-sm text-red-600 mt-2">{(createMutation.error as any).message}</div>}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">All Cars</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Make</th>
                <th className="px-2 py-2">Model</th>
                <th className="px-2 py-2">Year</th>
                <th className="px-2 py-2">Plate</th>
                <th className="px-2 py-2">Seats</th>
                <th className="px-2 py-2">Rate</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {cars?.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="px-2 py-2">
                    {c.image_url ? <img src={c.image_url} alt="car" className="w-16 h-12 object-cover rounded" /> : <span className="text-gray-400">No image</span>}
                  </td>
                  <td className="px-2 py-2">{c.make}</td>
                  <td className="px-2 py-2">{c.model}</td>
                  <td className="px-2 py-2">{c.year}</td>
                  <td className="px-2 py-2">{c.plate}</td>
                  <td className="px-2 py-2">{c.seats}</td>
                  <td className="px-2 py-2">{c.rate}</td>
                  <td className="px-2 py-2">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
