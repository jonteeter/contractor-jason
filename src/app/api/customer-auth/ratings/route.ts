import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET - Get customer's ratings
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('customer_auth')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get customer by auth token
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, auth_token_expires_at')
      .eq('auth_token', authToken)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get ratings for this customer
    const { data: ratings, error: ratingsError } = await supabaseAdmin
      .from('ratings')
      .select(`
        id,
        rating_type,
        rating,
        review,
        response,
        response_at,
        created_at,
        project:projects(id, project_name),
        contractor:contractors(company_name, contact_name)
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })

    if (ratingsError) {
      console.error('Ratings fetch error:', ratingsError)
      return NextResponse.json(
        { error: 'Failed to fetch ratings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ratings: ratings || [] })
  } catch (err) {
    console.error('Ratings error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * POST - Customer rates contractor
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('customer_auth')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get customer by auth token
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, contractor_id, auth_token_expires_at')
      .eq('auth_token', authToken)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { projectId, rating, review } = body

    if (!projectId || !rating) {
      return NextResponse.json(
        { error: 'Project ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify project belongs to customer
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, contractor_id, status')
      .eq('id', projectId)
      .eq('customer_id', customer.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Only allow rating completed or approved projects
    if (!['completed', 'approved'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Can only rate completed projects' },
        { status: 400 }
      )
    }

    // Create or update rating
    const { data: ratingData, error: ratingError } = await supabaseAdmin
      .from('ratings')
      .upsert({
        project_id: projectId,
        contractor_id: project.contractor_id,
        customer_id: customer.id,
        rating_type: 'customer_rates_contractor',
        rating,
        review: review || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id,rating_type'
      })
      .select()
      .single()

    if (ratingError) {
      console.error('Rating creation error:', ratingError)
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      )
    }

    // Update contractor's average rating
    const { data: contractorRatings } = await supabaseAdmin
      .from('ratings')
      .select('rating')
      .eq('contractor_id', project.contractor_id)
      .eq('rating_type', 'customer_rates_contractor')

    if (contractorRatings && contractorRatings.length > 0) {
      const avg = contractorRatings.reduce((sum, r) => sum + r.rating, 0) / contractorRatings.length
      await supabaseAdmin
        .from('contractors')
        .update({
          average_rating: Math.round(avg * 10) / 10,
          total_ratings: contractorRatings.length
        })
        .eq('id', project.contractor_id)
    }

    return NextResponse.json({
      success: true,
      rating: ratingData
    })
  } catch (err) {
    console.error('Rating error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
