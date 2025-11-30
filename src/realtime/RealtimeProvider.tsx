import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useQueryClient } from '@tanstack/react-query'

export default function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase.channel('db-changes')

    const tables = ['cars', 'users', 'drivers', 'trips', 'payouts', 'tickets']
    tables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          // Invalidate list queries on any change
          qc.invalidateQueries({ queryKey: [table] })
          // Also invalidate generic counts/series used on dashboard
          qc.invalidateQueries({ queryKey: ['count', table] })
          qc.invalidateQueries({ queryKey: ['series', 'trips'] })
        }
      )
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc])

  return <>{children}</>
}
