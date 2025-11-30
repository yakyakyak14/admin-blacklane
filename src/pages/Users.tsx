import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface UserRow {
  id: string
  created_at?: string
  email?: string
  name?: string
  full_name?: string
  role?: string
  status?: string
}

async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as UserRow[]
}

export default function Users() {
  const { data: users, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">All Users</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-600 text-sm">{(error as any).message}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-2 py-2">{u.email || '—'}</td>
                  <td className="px-2 py-2">{u.name || u.full_name || '—'}</td>
                  <td className="px-2 py-2">{u.role || 'user'}</td>
                  <td className="px-2 py-2">{u.status || 'active'}</td>
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
