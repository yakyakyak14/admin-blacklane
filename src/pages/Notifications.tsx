import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface EventRow {
  id: string
  type: string | null
  entity_type: string | null
  entity_id: string | null
  payload: any
  created_at: string | null
}

async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return (data || []) as EventRow[]
}

export default function Notifications() {
  const { data: events, isLoading, error } = useQuery({ queryKey: ['events'], queryFn: fetchEvents })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="rounded border bg-white p-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="divide-y">
          {events?.map((e) => (
            <div key={e.id} className="py-3 flex items-start gap-3">
              <div className="text-xs text-gray-500 w-40 shrink-0">{e.created_at ? new Date(e.created_at).toLocaleString() : '—'}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{e.type} on {e.entity_type}</div>
                <div className="text-xs text-gray-600 break-all">{e.entity_id}</div>
                {e.payload && (
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(e.payload, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
          {!events?.length && !isLoading && <div className="text-sm text-gray-500">No events yet.</div>}
        </div>
      </div>
    </div>
  )
}
