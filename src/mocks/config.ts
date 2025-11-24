import { hasSupabaseConfig } from '@/lib/supabase'

export const MSW_CONFIG = {
  // Disable MSW when Supabase is configured (prefer real data)
  // Enable mocks only if explicitly set to 'true' AND Supabase is not configured
  enabled:
    !hasSupabaseConfig &&
    (typeof import.meta.env.VITE_USE_MSW !== 'undefined'
      ? String(import.meta.env.VITE_USE_MSW) === 'true'
      : import.meta.env.DEV),
  onUnhandledRequest: 'bypass' as const,
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
}

