import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface AuthUserRow {
  id: string
  email: string | null
  phone: string | null
  created_at: string | null
  last_sign_in_at: string | null
  raw_user_meta_data?: any
  app_metadata?: any
}

async function fetchAuthUsers() {
  const { data, error } = await supabase.rpc('admin_list_auth_users')
  if (error) throw error
  return (data || []) as AuthUserRow[]
}

export default function Users() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAuthUsers,
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">All Registered Users</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Last Sign-in</th>
                <th className="px-2 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-2 py-2">{u.email || '—'}</td>
                  <td className="px-2 py-2">{u.phone || '—'}</td>
                  <td className="px-2 py-2">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : '—'}</td>
                  <td className="px-2 py-2">{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
