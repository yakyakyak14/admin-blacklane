import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded border bg-white p-6 space-y-4 text-center">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="text-sm text-gray-600">Sign in with Google. Only approved admin accounts can access.</p>
        <button onClick={signInWithGoogle} className="w-full rounded bg-black px-3 py-2 text-white text-sm">
          Continue with Google
        </button>
        {!loading && user && !isAdmin && (
          <div className="text-red-600 text-sm">Your account is not authorized for admin access.</div>
        )}
      </div>
    </div>
  )
}
