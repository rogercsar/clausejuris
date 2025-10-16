import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin'
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'Administrador do Sistema'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log('Creating admin user via Supabase Admin API...')
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { name: ADMIN_NAME },
  })
  if (createError) {
    console.error('Error creating user:', createError)
    process.exit(1)
  }

  const userId = created.user?.id
  if (!userId) {
    console.error('No user id returned from admin.createUser')
    process.exit(1)
  }

  console.log('Inserting profile row for admin...')
  const { error: insertError } = await supabase.from('profiles').insert({
    id: userId,
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    full_name: ADMIN_FULL_NAME,
    plan: 'pro',
    role: 'admin',
  })

  if (insertError) {
    console.error('Error inserting profile:', insertError)
    process.exit(1)
  }

  console.log('Admin user created successfully:')
  console.log({ id: userId, email: ADMIN_EMAIL, role: 'admin' })
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})