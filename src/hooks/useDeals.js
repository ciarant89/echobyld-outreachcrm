import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useContactDeals(contactId) {
  const { data: deals, isLoading } = useDeals()
  return { data: contactId ? deals.filter(d => d.contact_id === contactId) : [], isLoading }
}

export function useDeals() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetch = async () => {
      const { data: rows } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    fetch()

    const channel = supabase
      .channel('deals-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, fetch)
      .subscribe()

    return () => { active = false; supabase.removeChannel(channel) }
  }, [])

  return { data, isLoading }
}

export function useCreateDeal() {
  return {
    mutate: async (deal, opts = {}) => {
      const { data, error } = await supabase.from('deals').insert(deal).select().single()
      if (error) opts.onError?.(error)
      else opts.onSuccess?.(data)
    },
    isPending: false,
  }
}

export function useUpdateDeal() {
  return {
    mutate: async ({ id, ...updates }, opts = {}) => {
      const { error } = await supabase.from('deals').update(updates).eq('id', id)
      if (error) opts.onError?.(error)
      else opts.onSuccess?.()
    },
    isPending: false,
  }
}

export function useDeleteDeal() {
  return {
    mutate: async (id, opts = {}) => {
      const { error } = await supabase.from('deals').delete().eq('id', id)
      if (error) opts.onError?.(error)
      else opts.onSuccess?.()
    },
    isPending: false,
  }
}
