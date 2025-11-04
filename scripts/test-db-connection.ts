/**
 * Database Connection Test Script
 *
 * Run this to verify Supabase connection and check if tables exist
 *
 * Usage: npx tsx scripts/test-db-connection.ts
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/supabase/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔌 Testing Supabase Connection...\n')
  console.log(`📍 URL: ${supabaseUrl}\n`)

  try {
    // Test 1: Check contractors table
    console.log('1️⃣  Testing contractors table...')
    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .select('*')
      .limit(5)

    if (contractorsError) {
      console.error('   ❌ Error:', contractorsError.message)
      if (contractorsError.message.includes('relation') || contractorsError.message.includes('does not exist')) {
        console.error('   💡 Tables not created yet! Run the migration first.')
        console.error('   📖 See: documentation/database-setup-instructions.md')
      }
    } else {
      console.log(`   ✅ Success! Found ${contractors.length} contractor(s)`)
      if (contractors.length > 0) {
        contractors.forEach(c => {
          console.log(`      - ${c.company_name} (${c.contact_name})`)
        })
      }
    }

    // Test 2: Check customers table
    console.log('\n2️⃣  Testing customers table...')
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5)

    if (customersError) {
      console.error('   ❌ Error:', customersError.message)
    } else {
      console.log(`   ✅ Success! Found ${customers.length} customer(s)`)
    }

    // Test 3: Check projects table
    console.log('\n3️⃣  Testing projects table...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5)

    if (projectsError) {
      console.error('   ❌ Error:', projectsError.message)
    } else {
      console.log(`   ✅ Success! Found ${projects.length} project(s)`)
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    if (!contractorsError && !customersError && !projectsError) {
      console.log('✅ All tests passed! Database is ready.')
      if (contractors.length === 0) {
        console.log('\n💡 Next step: Create Jason\'s contractor account')
        console.log('   See: documentation/database-setup-instructions.md (Step 3)')
      }
    } else {
      console.log('❌ Some tests failed. Check errors above.')
    }
    console.log('='.repeat(50))

  } catch (error) {
    console.error('\n❌ Unexpected error:', error)
  }
}

testConnection()
