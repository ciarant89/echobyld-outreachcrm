import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EVENT = 'crm:contacts'
const notify = () => window.dispatchEvent(new CustomEvent(EVENT))

const clean = (obj) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
)

export function useContacts() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetch = async () => {
      const { data: rows } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    const onVisible = () => { if (document.visibilityState === 'visible') fetch() }

    fetch()
    window.addEventListener(EVENT, fetch)
    document.addEventListener('visibilitychange', onVisible)

    const channel = supabase
      .channel('contacts-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, fetch)
      .subscribe()

    return () => {
      active = false
      window.removeEventListener(EVENT, fetch)
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, isLoading }
}

export function useContact(id) {
  const { data: contacts, isLoading } = useContacts()
  return { data: contacts.find(c => c.id === id) ?? null, isLoading }
}

export function useCreateContact() {
  return {
    mutate: async (contact, opts = {}) => {
      const { data, error } = await supabase.from('contacts').insert(clean(contact)).select().single()
      if (error) opts.onError?.(error)
      else { notify(); opts.onSuccess?.(data) }
    },
    isPending: false,
  }
}

export function useUpdateContact() {
  return {
    mutate: async ({ id, ...updates }, opts = {}) => {
      const { error } = await supabase.from('contacts').update(clean(updates)).eq('id', id)
      if (error) opts.onError?.(error)
      else { notify(); opts.onSuccess?.() }
    },
    isPending: false,
  }
}

export function useDeleteContact() {
  return {
    mutate: async (id, opts = {}) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) opts.onError?.(error)
      else { notify(); opts.onSuccess?.() }
    },
    isPending: false,
  }
}
