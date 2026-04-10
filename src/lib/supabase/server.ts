import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { getSupabaseAnonKey, getSupabaseUrl } from './env'

// Server-side Supabase client for App Router.
// Call within a server component / route handler so Next's request cookies() are available.
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll: () => {
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }))
      },
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options })
          })
        } catch {
          // Server Components cannot mutate cookies during render.
          // Middleware / Route Handlers will persist auth cookies.
        }
      },
    },
  })
}

