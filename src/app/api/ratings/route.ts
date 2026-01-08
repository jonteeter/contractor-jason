import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET - Get all ratings for contractor's customers
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user (contractor)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all ratings for this contractor
    const { data: ratings, error } = await supabase
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
        customer:customers(id, name)
      `)
      .eq('contractor_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ratings fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ratings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ratings: ratings || [] })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * POST - Contractor rates a customer
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user (contractor)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Verify project belongs to contractor and get customer ID
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, customer_id, status')
      .eq('id', projectId)
      .eq('contractor_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Only allow rating completed projects
    if (project.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rate completed projects' },
        { status: 400 }
      )
    }

    // Create or update rating
    const { data: ratingData, error: ratingError } = await supabase
      .from('ratings')
      .upsert({
        project_id: projectId,
        contractor_id: user.id,
        customer_id: project.customer_id,
        rating_type: 'contractor_rates_customer',
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

    // Update customer's average rating
    const { data: customerRatings } = await supabase
      .from('ratings')
      .select('rating')
      .eq('customer_id', project.customer_id)
      .eq('rating_type', 'contractor_rates_customer')

    if (customerRatings && customerRatings.length > 0) {
      const avg = customerRatings.reduce((sum, r) => sum + r.rating, 0) / customerRatings.length
      await supabase
        .from('customers')
        .update({
          average_rating: Math.round(avg * 10) / 10,
          total_ratings: customerRatings.length
        })
        .eq('id', project.customer_id)
    }

    return NextResponse.json({
      success: true,
      rating: ratingData
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
