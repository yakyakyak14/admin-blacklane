import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'
  const [accessCode, setAccessCode] = useState('')
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  function loginWithCode() {
    setError('')
    setMessage('')
    if (accessCode.trim() === '24681012') {
      try {
        window.localStorage.setItem('admin_override', 'true')
        setMessage('Access granted. Redirecting...')
      } catch {}
    } else {
      setError('Invalid access code.')
    }
  }

  const override = typeof window !== 'undefined' && window.localStorage.getItem('admin_override') === 'true'
  if (!loading && (override || (user && isAdmin))) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <p className="text-sm text-gray-600 text-center">Enter your access code to continue.</p>
        <input
          type="password"
          placeholder="Access code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <button onClick={loginWithCode} className="w-full rounded bg-black px-3 py-2 text-white text-sm">
          Continue
        </button>
        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      </div>
    </div>
  )
}
