import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface PayoutRow {
  id: string
  created_at: string | null
  driver_id: string | null
  driver_email: string | null
  driver_name: string | null
  amount: number | null
  currency: string | null
  status: string | null
  period_start: string | null
  period_end: string | null
}

async function fetchPayouts() {
  const { data, error } = await supabase.rpc('admin_list_payouts')
  if (error) throw error
  return (data || []) as PayoutRow[]
}

export default function Payouts() {
  const { data: payouts, isLoading, error } = useQuery({ queryKey: ['payouts_admin'], queryFn: fetchPayouts })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <div className="rounded border bg-white p-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2">Driver</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Period</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts?.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-2 py-2">{p.created_at ? new Date(p.created_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{p.driver_name || p.driver_email || p.driver_id || '—'}</td>
                  <td className="px-2 py-2">{typeof p.amount === 'number' ? `${p.amount} ${p.currency || ''}`.trim() : '—'}</td>
                  <td className="px-2 py-2">{p.period_start || '—'} → {p.period_end || '—'}</td>
                  <td className="px-2 py-2">{p.status || 'pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
