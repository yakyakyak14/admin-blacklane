import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  async function requestCode() {
    setError('')
    setMessage('')
    if (!email) {
      setError('Enter your admin email.')
      return
    }
    setSending(true)
    try {
      const { data: allowed, error: rpcErr } = await supabase.rpc('is_admin_email', { p_email: email })
      if (rpcErr) throw rpcErr
      if (!allowed) {
        setError('This email is not authorized for admin access.')
        return
      }
      const { error: otpErr } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.origin } })
      if (otpErr) throw otpErr
      setMessage('We sent a one-time code to your email. Enter it below to sign in.')
      setStep('verify')
    } catch (e: any) {
      setError(e?.message || 'Could not send code. Try again.')
    } finally {
      setSending(false)
    }
  }

  async function verifyCode() {
    setError('')
    setMessage('')
    if (!email || !code) {
      setError('Enter the email and the code you received.')
      return
    }
    setVerifying(true)
    try {
      const { error: vErr } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
      if (vErr) throw vErr
      setMessage('Signed in. Redirecting...')
      // AuthContext will update session and isAdmin, Navigate below will redirect
    } catch (e: any) {
      setError(e?.message || 'Invalid or expired code.')
    } finally {
      setVerifying(false)
    }
  }

  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        {step === 'request' && (
          <>
            <p className="text-sm text-gray-600 text-center">Enter your admin email to receive a one-time login code.</p>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button onClick={requestCode} disabled={sending} className="w-full rounded bg-black px-3 py-2 text-white text-sm">
              {sending ? 'Sending…' : 'Send Code'}
            </button>
          </>
        )}
        {step === 'verify' && (
          <>
            <p className="text-sm text-gray-600 text-center">Enter the code sent to <span className="font-medium">{email}</span>.</p>
            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button onClick={verifyCode} disabled={verifying} className="w-full rounded bg-black px-3 py-2 text-white text-sm">
              {verifying ? 'Verifying…' : 'Verify and Sign In'}
            </button>
            <button onClick={() => setStep('request')} className="w-full rounded border px-3 py-2 text-sm">
              Use a different email
            </button>
          </>
        )}
        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
        {(!loading && user && !isAdmin) && (
          <div className="text-red-600 text-sm text-center">Your account is not authorized for admin access.</div>
        )}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      </div>
    </div>
  )
}
