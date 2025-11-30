import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextType {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ session: null, user: null, isAdmin: false, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function init() {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      if (!active) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        const { data: rpcData } = await supabase.rpc('is_admin')
        if (active) setIsAdmin(Boolean(rpcData))
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess)
      setUser(sess?.user ?? null)
      if (sess?.user) {
        const { data: rpcData } = await supabase.rpc('is_admin')
        setIsAdmin(Boolean(rpcData))
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, user, isAdmin, loading }), [session, user, isAdmin, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
