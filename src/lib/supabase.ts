import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function isValidUrl(url: string | undefined) {
  return !!url && /^https?:\/\/.+/.test(url)
}

function isValidKey(key: string | undefined) {
  return !!key && key.length >= 20
}

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

if (!isValidUrl(SUPABASE_URL) || !isValidKey(SUPABASE_ANON_KEY)) {
  throw new Error('Configuração do Supabase inválida: verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

// Helper to map profile row to app User type
export function mapProfileToUser(profile: any) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name ?? '',
    fullName: profile.full_name ?? '',
    oab: profile.oab ?? undefined,
    phone: profile.phone ?? undefined,
    plan: (profile.plan ?? 'common') as 'common' | 'pro',
    role: profile.role ?? undefined,
    avatar: profile.avatar ?? undefined,
    document: profile.document ?? undefined,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }
}