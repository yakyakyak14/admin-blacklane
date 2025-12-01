import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'jets'

type FileItem = {
  name: string
  id?: string
  created_at?: string
  updated_at?: string
  last_accessed_at?: string
  metadata?: { size?: number; mimetype?: string }
}

type Jet = { id: string; make: string; model: string | null; image_url: string | null }

async function listObjects() {
  const { data, error } = await supabase.storage.from(BUCKET).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
  if (error) throw error
  return (data || []) as FileItem[]
}

async function listJets() {
  const { data, error } = await supabase.from('jets').select('id, make, model, image_url').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as Jet[]
}

export default function JetImages() {
  const qc = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [renameFrom, setRenameFrom] = useState<string | null>(null)
  const [renameTo, setRenameTo] = useState<string>('')
  const { data: files, isLoading, error } = useQuery({ queryKey: ['storage', BUCKET], queryFn: listObjects })
  const { data: jets } = useQuery({ queryKey: ['jets', 'basic'], queryFn: listJets })

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) return
      const path = file.name
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
      if (error) throw error
    },
    onSuccess: () => {
      setFile(null)
      qc.invalidateQueries({ queryKey: ['storage', BUCKET] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.storage.from(BUCKET).remove([name])
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storage', BUCKET] })
    },
  })

  const moveMutation = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      if (!to || from === to) return
      const { error } = await supabase.storage.from(BUCKET).move(from, to)
      if (error) throw error
    },
    onSuccess: () => {
      setRenameFrom(null)
      setRenameTo('')
      qc.invalidateQueries({ queryKey: ['storage', BUCKET] })
    },
  })

  const assignMutation = useMutation({
    mutationFn: async ({ jetId, name }: { jetId: string; name: string }) => {
      const pub = supabase.storage.from(BUCKET).getPublicUrl(name)
      const image_url = pub.data.publicUrl
      const { error } = await supabase.from('jets').update({ image_url }).eq('id', jetId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jets', 'basic'] })
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Jet Images</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Upload to Bucket</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button onClick={() => uploadMutation.mutate()} disabled={!file || uploadMutation.isPending} className="rounded bg-black px-3 py-2 text-white text-sm">
            {uploadMutation.isPending ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        {uploadMutation.error && <div className="text-red-600 text-sm mt-2">{(uploadMutation.error as any).message}</div>}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Bucket Files</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files?.map((f) => {
            const pub = supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl
            const sizeKB = f.metadata?.size ? Math.round((f.metadata.size / 1024) * 10) / 10 : null
            return (
              <div key={f.name} className="rounded border overflow-hidden bg-white">
                <div className="aspect-video bg-gray-100">
                  <img src={pub} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-2 text-sm">
                  <div className="font-medium break-words">{f.name}</div>
                  <div className="text-gray-600">{sizeKB ? `${sizeKB} KB` : '—'} • {f.updated_at ? new Date(f.updated_at).toLocaleString() : ''}</div>

                  <div className="flex items-center gap-2">
                    <button className="rounded border px-2 py-1" onClick={() => navigator.clipboard.writeText(pub)}>Copy URL</button>
                    <button className="rounded border px-2 py-1" onClick={() => { setRenameFrom(f.name); setRenameTo(f.name) }}>Rename</button>
                    <button className="rounded border px-2 py-1 text-red-600" onClick={() => deleteMutation.mutate(f.name)}>Delete</button>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-1">Assign to Jet</div>
                    <div className="flex gap-2">
                      <select className="rounded border px-2 py-1 flex-1 text-sm" defaultValue="" onChange={(e) => e.target.value && assignMutation.mutate({ jetId: e.target.value, name: f.name })}>
                        <option value="" disabled>Select a jet…</option>
                        {jets?.map(j => (
                          <option key={j.id} value={j.id}>{j.make} {j.model ?? ''}</option>
                        ))}
                      </select>
                      <a className="rounded border px-2 py-1 text-xs" href={pub} target="_blank" rel="noreferrer">Open</a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {renameFrom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded bg-white p-4 space-y-3">
            <div className="font-semibold">Rename file</div>
            <input className="w-full rounded border px-3 py-2 text-sm" value={renameTo} onChange={(e) => setRenameTo(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button className="rounded border px-3 py-2 text-sm" onClick={() => { setRenameFrom(null); setRenameTo('') }}>Cancel</button>
              <button className="rounded bg-black px-3 py-2 text-white text-sm" onClick={() => moveMutation.mutate({ from: renameFrom, to: renameTo })} disabled={moveMutation.isPending}>
                {moveMutation.isPending ? 'Renaming…' : 'Rename'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
