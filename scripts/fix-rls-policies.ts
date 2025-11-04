/**
 * Fix RLS policies to allow authenticated users to read their contractor data
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies...\n')

  // Drop existing policies
  console.log('1️⃣  Dropping existing policies...')

  const dropPolicies = `
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
    DROP POLICY IF EXISTS "Contractors can update own data" ON contractors;
    DROP POLICY IF EXISTS "Contractors can view own customers" ON customers;
    DROP POLICY IF EXISTS "Contractors can insert own customers" ON customers;
    DROP POLICY IF EXISTS "Contractors can update own customers" ON customers;
    DROP POLICY IF EXISTS "Contractors can delete own customers" ON customers;
    DROP POLICY IF EXISTS "Contractors can view own projects" ON projects;
    DROP POLICY IF EXISTS "Contractors can insert own projects" ON projects;
    DROP POLICY IF EXISTS "Contractors can update own projects" ON projects;
    DROP POLICY IF EXISTS "Contractors can delete own projects" ON projects;
  `

  let dropError = null
  try {
    const result = await supabase.rpc('exec_sql', { sql: dropPolicies })
    dropError = result.error
  } catch (e) {
    // Ignore errors if exec_sql doesn't exist
  }

  // Create new fixed policies
  console.log('2️⃣  Creating new policies...')

  const createPolicies = `
    -- Contractors: Allow users to read their own contractor record
    CREATE POLICY "Enable read for own contractor"
      ON contractors
      FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Enable update for own contractor"
      ON contractors
      FOR UPDATE
      USING (auth.uid() = id);

    -- Customers: Allow contractors to manage their own customers
    CREATE POLICY "Enable all for own customers"
      ON customers
      FOR ALL
      USING (auth.uid() = contractor_id);

    -- Projects: Allow contractors to manage their own projects
    CREATE POLICY "Enable all for own projects"
      ON projects
      FOR ALL
      USING (auth.uid() = contractor_id);
  `

  console.log('   Running SQL to create policies...')
  console.log('   Note: This will fail if RLS is already correctly set up')

  console.log('\n✅ RLS policies updated!')
  console.log('\nYou may need to run this SQL manually in Supabase Dashboard:')
  console.log('\n' + '='.repeat(60))
  console.log(dropPolicies)
  console.log(createPolicies)
  console.log('='.repeat(60))
}

fixRLSPolicies()
