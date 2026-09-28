import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// "Stay logged in" support: when checked at login, the session is written to
// localStorage (survives closing the browser). When unchecked, it's written
// to sessionStorage (cleared once the tab/browser is closed).
const REMEMBER_KEY = 'echobyld_remember'

const dynamicStorage = {
  getItem: key => {
    const store = localStorage.getItem(REMEMBER_KEY) === 'false' ? sessionStorage : localStorage
    return store.getItem(key)
  },
  setItem: (key, value) => {
    const store = localStorage.getItem(REMEMBER_KEY) === 'false' ? sessionStorage : localStorage
    store.setItem(key, value)
  },
  removeItem: key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { storage: dynamicStorage, persistSession: true, autoRefreshToken: true },
})
