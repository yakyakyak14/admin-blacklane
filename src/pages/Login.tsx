import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'
  const [email, setEmail] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  async function loginWithCode() {
    setError('')
    setMessage('')
    const emailTrim = email.trim().toLowerCase()
    if (!emailTrim) {
      setError('Enter your admin email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError('Enter a valid email address.')
      return
    }
    if (accessCode.trim() !== '24681012') {
      setError('Invalid passcode.')
      return
    }
    try {
      setSubmitting(true)
      const { data: allowed } = await supabase.rpc('is_admin_email', { p_email: emailTrim })
      if (!allowed) {
        setError('This email does not have admin permission.')
        return
      }
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: emailTrim,
        options: { emailRedirectTo: window.location.origin },
      })
      if (signInError) throw signInError
      setMessage('Check your email for a sign-in link to continue.')
    } catch (e: any) {
      setError(e?.message || 'Failed to initiate sign-in.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!loading && (user && isAdmin)) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <p className="text-sm text-gray-600 text-center">Enter your admin email and passcode to continue.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Passcode"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <button onClick={loginWithCode} className="w-full rounded bg-black px-3 py-2 text-white text-sm" disabled={submitting}>
          {submitting ? 'Please wait…' : 'Continue'}
        </button>
        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      </div>
    </div>
  )
}
