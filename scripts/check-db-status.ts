/**
 * Check current database status and show all data
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/supabase/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function checkStatus() {
  console.log('📊 Current Database Status\n')

  // Get all contractors
  const { data: contractors } = await supabase
    .from('contractors')
    .select('*')

  console.log('👔 CONTRACTORS:')
  console.log(JSON.stringify(contractors, null, 2))

  // Get all customers
  const { data: customers } = await supabase
    .from('customers')
    .select('*')

  console.log('\n👥 CUSTOMERS:')
  console.log(JSON.stringify(customers, null, 2))

  // Get all projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')

  console.log('\n📋 PROJECTS:')
  console.log(JSON.stringify(projects, null, 2))
}

checkStatus()
