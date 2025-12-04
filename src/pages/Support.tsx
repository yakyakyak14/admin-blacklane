import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface TicketRow {
  id: string
  created_at: string | null
  user_id: string | null
  user_email: string | null
  user_name: string | null
  driver_id: string | null
  driver_email: string | null
  driver_name: string | null
  subject: string | null
  priority: string | null
  status: string | null
}

async function fetchTickets() {
  const { data, error } = await supabase.rpc('admin_list_tickets')
  if (error) throw error
  return (data || []) as TicketRow[]
}

export default function Support() {
  const { data: tickets, isLoading, error } = useQuery({ queryKey: ['tickets_admin'], queryFn: fetchTickets })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Support</h1>
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
                <th className="px-2 py-2">Subject</th>
                <th className="px-2 py-2">Priority</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-2 py-2">{t.created_at ? new Date(t.created_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{t.user_name || t.user_email || t.user_id || '—'}</td>
                  <td className="px-2 py-2">{t.driver_name || t.driver_email || t.driver_id || '—'}</td>
                  <td className="px-2 py-2">{t.subject || '—'}</td>
                  <td className="px-2 py-2">{t.priority || 'normal'}</td>
                  <td className="px-2 py-2">{t.status || 'open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
