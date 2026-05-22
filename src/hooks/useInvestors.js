import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useInvestors() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetch = async () => {
      const { data: rows } = await supabase
        .from('investors')
        .select('*')
        .order('created_at', { ascending: false })
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    fetch()

    const channel = supabase
      .channel('investors-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investors' }, fetch)
      .subscribe()

    return () => { active = false; supabase.removeChannel(channel) }
  }, [])

  return { data, isLoading }
}

export function useInvestor(id) {
  const { data: investors, isLoading } = useInvestors()
  return { data: investors.find(i => i.id === id) ?? null, isLoading }
}

export function useCreateInvestor() {
  return {
    mutate: async (investor, opts = {}) => {
      const { data, error } = await supabase.from('investors').insert(investor).select().single()
      if (error) opts.onError?.(error)
      else opts.onSuccess?.(data)
    },
    isPending: false,
  }
}

export function useUpdateInvestor() {
  return {
    mutate: async ({ id, ...updates }, opts = {}) => {
      const { error } = await supabase.from('investors').update(updates).eq('id', id)
      if (error) opts.onError?.(error)
      else opts.onSuccess?.()
    },
    isPending: false,
  }
}

export function useDeleteInvestor() {
  return {
    mutate: async (id, opts = {}) => {
      const { error } = await supabase.from('investors').delete().eq('id', id)
      if (error) opts.onError?.(error)
      else opts.onSuccess?.()
    },
    isPending: false,
  }
}

export function useInvestorActivities(investorId) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetch = async () => {
      let query = supabase
        .from('investor_activities')
        .select('*')
        .order('occurred_at', { ascending: false })
      if (investorId) query = query.eq('investor_id', investorId)
      const { data: rows } = await query
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    fetch()

    const channel = supabase
      .channel('inv-activities-' + (investorId || 'all') + '-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investor_activities' }, fetch)
      .subscribe()

    return () => { active = false; supabase.removeChannel(channel) }
  }, [investorId])

  return { data, isLoading }
}

export function useCreateInvestorActivity() {
  return {
    mutate: async (activity, opts = {}) => {
      const { data, error } = await supabase.from('investor_activities').insert(activity).select().single()
      if (error) opts.onError?.(error)
      else opts.onSuccess?.(data)
    },
    isPending: false,
  }
}
