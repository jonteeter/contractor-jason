import { supabaseAdmin } from '../src/lib/supabase/server'

async function addFields() {
  console.log('Adding contract fields to projects table...')

  try {
    // First, check if columns exist by trying to select them
    const { data: testData, error: testError } = await supabaseAdmin
      .from('projects')
      .select('work_description, intro_message, estimated_days, start_date, completion_date')
      .limit(1)

    if (testError && testError.message.includes('column')) {
      console.log('Columns don\'t exist yet - they need to be added via Supabase dashboard SQL editor')
      console.log('\nPlease run this SQL in your Supabase SQL Editor:')
      console.log('\n' + `
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS work_description TEXT,
ADD COLUMN IF NOT EXISTS intro_message TEXT DEFAULT 'Thank you for choosing The Best Hardwood Flooring Co. for your flooring and home improvement needs. Below is a breakdown of the work as we discussed. Please review the information and let me know if I missed anything.',
ADD COLUMN IF NOT EXISTS estimated_days INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS completion_date DATE;
      `.trim())
      console.log('\n')
    } else {
      console.log('✓ Columns already exist or were added successfully!')
    }
  } catch (err) {
    console.error('Error checking columns:', err)
  }
}

addFields()
