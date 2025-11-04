/**
 * Create Jason Dixon's contractor account
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/supabase/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function createJasonAccount() {
  console.log('🔧 Creating Jason Dixon\'s Account...\n')

  // Step 1: Create auth user
  console.log('1️⃣  Creating authentication user...')
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'jason@thebesthardwoodfloor.com',
    password: 'TempPassword123!',  // Jason should change this after first login
    email_confirm: true,
    user_metadata: {
      full_name: 'Jason Dixon',
      company: 'The Best Hardwood Flooring Co.'
    }
  })

  if (authError) {
    console.error('   ❌ Error creating auth user:', authError.message)

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existing = existingUsers?.users.find(u => u.email === 'jason@thebesthardwoodfloor.com')

    if (existing) {
      console.log('   ℹ️  User already exists, using existing ID:', existing.id)
      await createContractorRecord(existing.id)
    }
    return
  }

  console.log('   ✅ Auth user created!')
  console.log('   📧 Email: jason@thebesthardwoodfloor.com')
  console.log('   🔑 Temp Password: TempPassword123!')
  console.log('   🆔 User ID:', authData.user.id)

  // Step 2: Create contractor record
  await createContractorRecord(authData.user.id)
}

async function createContractorRecord(userId: string) {
  console.log('\n2️⃣  Creating contractor record...')

  const { data, error } = await supabase
    .from('contractors')
    .insert({
      id: userId,
      company_name: 'The Best Hardwood Flooring Co.',
      contact_name: 'Jason Dixon',
      email: 'jason@thebesthardwoodfloor.com',
      phone: '708-762-1003',
      address: '1307 Blanchard St',
      city: 'Downers Grove',
      state: 'IL',
      zip_code: '60515',
      subscription_plan: 'professional',
      is_active: true
    })
    .select()

  if (error) {
    console.error('   ❌ Error creating contractor:', error.message)
    return
  }

  console.log('   ✅ Contractor record created!')
  console.log('\n' + '='.repeat(60))
  console.log('✅ Jason\'s account is ready!')
  console.log('\nLogin credentials:')
  console.log('   Email: jason@thebesthardwoodfloor.com')
  console.log('   Password: TempPassword123!')
  console.log('\n⚠️  Jason should change his password after first login')
  console.log('='.repeat(60))
}

createJasonAccount()
