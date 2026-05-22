import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ─── Shared singleton store ───────────────────────────────────────────────────
// One fetch, one array, all components see the same data in real time.

let _data = []
let _loading = true
let _listeners = new Set()
let _fetched = false

function broadcast() {
  _listeners.forEach(fn => fn(_data, _loading))
}

async function fetchContacts() {
  const { data: rows, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  _data = rows || []
  _loading = false
  _fetched = true
  broadcast()
}

// Kick off the initial fetch immediately when this module loads
fetchContacts()

// ─── Public helpers ───────────────────────────────────────────────────────────
export function invalidateContacts() {
  fetchContacts()
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
export function useContacts() {
  const [data, setData]       = useState(_data)
  const [isLoading, setLoad]  = useState(_loading)

  useEffect(() => {
    // Subscribe to store updates
    const listener = (d, l) => { setData(d); setLoad(l) }
    _listeners.add(listener)

    // If data already fetched, use it; otherwise it will arrive via broadcast
    if (_fetched) { setData(_data); setLoad(false) }

    // Always re-fetch on mount to catch any changes since last fetch
    fetchContacts()

    // Re-fetch when tab becomes visible again
    const onVisible = () => { if (document.visibilityState === 'visible') fetchContacts() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      _listeners.delete(listener)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return { data, isLoading }
}

export function useContact(id) {
  const { data: contacts, isLoading } = useContacts()
  return { data: contacts.find(c => c.id === id) ?? null, isLoading }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

const clean = (obj) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
)

export function useCreateContact() {
  return {
    mutate: async (contact, opts = {}) => {
      const { data, error } = await supabase.from('contacts').insert(clean(contact)).select().single()
      if (error) {
        opts.onError?.(error)
      } else {
        // Optimistically prepend then do a real fetch
        _data = [data, ..._data]
        _loading = false
        broadcast()
        fetchContacts() // reconcile with server
        opts.onSuccess?.(data)
      }
    },
    isPending: false,
  }
}

export function useUpdateContact() {
  return {
    mutate: async ({ id, ...updates }, opts = {}) => {
      const { error } = await supabase.from('contacts').update(clean(updates)).eq('id', id)
      if (error) {
        opts.onError?.(error)
      } else {
        fetchContacts()
        opts.onSuccess?.()
      }
    },
    isPending: false,
  }
}

export function useDeleteContact() {
  return {
    mutate: async (id, opts = {}) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) {
        opts.onError?.(error)
      } else {
        _data = _data.filter(c => c.id !== id)
        broadcast()
        opts.onSuccess?.()
      }
    },
    isPending: false,
  }
}
