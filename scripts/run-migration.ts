import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sql = fs.readFileSync('supabase/migrations/002_add_contract_fields.sql', 'utf8')

// Split by semicolon and execute each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

async function runMigration() {
  console.log(`Running ${statements.length} SQL statements...`)

  for (const statement of statements) {
    try {
      console.log('Executing:', statement.substring(0, 80) + '...')
      const { error } = await supabase.rpc('exec_sql', { sql_string: statement })

      if (error) {
        console.error('Error:', error)
      } else {
        console.log('✓ Success')
      }
    } catch (err) {
      console.error('Exception:', err)
    }
  }

  console.log('Migration completed')
}

runMigration()
