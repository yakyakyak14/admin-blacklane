import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export default function RealtimeProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jet_bookings' }, () => {
        qc.invalidateQueries({ queryKey: ['jet_bookings'] })
        qc.invalidateQueries({ queryKey: ['count', 'jet_bookings'] })
        qc.invalidateQueries({ queryKey: ['events'] })
        qc.invalidateQueries({ queryKey: ['count', 'events'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
        qc.invalidateQueries({ queryKey: ['trips'] })
        qc.invalidateQueries({ queryKey: ['count', 'trips'] })
        qc.invalidateQueries({ queryKey: ['events'] })
        qc.invalidateQueries({ queryKey: ['count', 'events'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        qc.invalidateQueries({ queryKey: ['events'] })
        qc.invalidateQueries({ queryKey: ['count', 'events'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jets' }, () => {
        qc.invalidateQueries({ queryKey: ['count', 'jets'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, () => {
        qc.invalidateQueries({ queryKey: ['count', 'cars'] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc])

  return <>{children}</>
}
