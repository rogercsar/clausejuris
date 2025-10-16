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
  console.log('Creating or updating admin user via Supabase Admin API...')
  let userId

  // Try to create; if already exists, update instead
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { name: ADMIN_NAME },
  })

  if (createError) {
    if (createError.status === 422 || createError.code === 'email_exists') {
      console.log('User already exists, updating password and confirming email...')
      const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
      if (listError) {
        console.error('Error listing users:', listError)
        process.exit(1)
      }
      const existing = list.users.find(u => (u.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase())
      if (!existing) {
        console.error('User exists but could not be found via listUsers')
        process.exit(1)
      }
      userId = existing.id
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { name: ADMIN_NAME },
      })
      if (updateError) {
        console.error('Error updating existing user:', updateError)
        process.exit(1)
      }
      console.log('Existing user updated successfully')
    } else {
      console.error('Error creating user:', createError)
      process.exit(1)
    }
  } else {
    userId = created.user?.id
    if (!userId) {
      console.error('No user id returned from admin.createUser')
      process.exit(1)
    }
    console.log('User created successfully')
  }

  console.log('Upserting profile row for admin...')
  const { error: upsertError } = await supabase.from('profiles').upsert({
    id: userId,
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    full_name: ADMIN_FULL_NAME,
    plan: 'pro',
    role: 'admin',
  }, { onConflict: 'id' })

  if (upsertError) {
    console.error('Error upserting profile:', upsertError)
    console.error('Ensure your database schema has column "role" and table "profiles" as per supabase/schema.sql.')
    process.exit(1)
  }

  console.log('Admin user ready:')
  console.log({ id: userId, email: ADMIN_EMAIL, role: 'admin' })
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})