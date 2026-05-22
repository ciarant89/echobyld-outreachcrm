import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EVENT  = 'crm:contacts'
const LS_KEY = 'crm:contacts:ts'

// Persists across unmount/remount — set whenever a mutation fires
let pendingRefresh = false

const notify = () => {
  pendingRefresh = true
  window.dispatchEvent(new CustomEvent(EVENT))
  try { localStorage.setItem(LS_KEY, String(Date.now())) } catch (_) {}
}

export { notify as notifyContacts }

const clean = (obj) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
)

export function useContacts() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const doFetch = async () => {
      const { data: rows } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      if (active) { setData(rows || []); setIsLoading(false) }
    }

    // Fetch immediately on mount
    doFetch()

    // If a mutation fired while this component was unmounted, fetch again
    // after a short delay to guarantee we pick up the latest data
    let refreshTimer = null
    if (pendingRefresh) {
      pendingRefresh = false
      refreshTimer = setTimeout(doFetch, 400)
    }

    const onEvent   = () => doFetch()
    const onVisible = () => { if (document.visibilityState === 'visible') doFetch() }
    const onStorage = (e) => { if (e.key === LS_KEY) doFetch() } // cross-tab sync

    window.addEventListener(EVENT, onEvent)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('storage', onStorage)

    const channel = supabase
      .channel('contacts-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, doFetch)
      .subscribe()

    return () => {
      active = false
      if (refreshTimer) clearTimeout(refreshTimer)
      window.removeEventListener(EVENT, onEvent)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('storage', onStorage)
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
