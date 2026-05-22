import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useActivities(contactId) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetch = async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .order('occurred_at', { ascending: false })
      if (contactId) query = query.eq('contact_id', contactId)
      const { data: rows } = await query
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    fetch()

    const channel = supabase
      .channel('activities-' + (contactId || 'all') + '-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetch)
      .subscribe()

    return () => { active = false; supabase.removeChannel(channel) }
  }, [contactId])

  return { data, isLoading }
}

export function useAllActivities() {
  return useActivities(null)
}

export function useCreateActivity() {
  return {
    mutate: async (activity, opts = {}) => {
      const { data, error } = await supabase.from('activities').insert(activity).select().single()
      if (error) opts.onError?.(error)
      else opts.onSuccess?.(data)
    },
    isPending: false,
  }
}
