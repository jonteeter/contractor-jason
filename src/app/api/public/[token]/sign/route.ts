import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidToken } from '@/lib/tokens'

// Use service role to bypass RLS for public signature
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST - Save customer signature via public token
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Validate token format
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { signature } = body

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature is required' },
        { status: 400 }
      )
    }

    // Get the project to verify it exists and get contractor info
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        project_name,
        customer_signature,
        contractor_id,
        customer:customers(name, email),
        contractor:contractors(email, contact_name, company_name)
      `)
      .eq('public_token', token)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if already signed
    if (project.customer_signature) {
      return NextResponse.json(
        { error: 'This contract has already been signed' },
        { status: 400 }
      )
    }

    // Update project with signature
    const now = new Date().toISOString()
    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        customer_signature: signature,
        customer_signature_date: now,
        customer_signed_at: now,
        status: 'approved'
      })
      .eq('public_token', token)

    if (updateError) {
      console.error('Signature save error:', updateError)
      return NextResponse.json(
        { error: 'Failed to save signature' },
        { status: 500 }
      )
    }

    // Send email notification to contractor
    // Supabase returns single relation as object, but TypeScript infers array
    const customerData = project.customer as unknown as { name: string; email: string } | null
    const contractorData = project.contractor as unknown as { email: string; contact_name: string; company_name: string } | null

    if (contractorData?.email) {
      try {
        // Use the existing email API pattern
        await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/notifications/contract-signed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractorEmail: contractorData.email,
            contractorName: contractorData.contact_name,
            customerName: customerData?.name || 'Customer',
            projectName: project.project_name,
            signedAt: now
          })
        })
      } catch (emailError) {
        // Don't fail the signature if email fails
        console.error('Failed to send notification email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contract signed successfully'
    })
  } catch (err) {
    console.error('Signature error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
