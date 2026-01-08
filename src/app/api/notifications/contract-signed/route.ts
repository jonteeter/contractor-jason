import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import ContractSignedEmail from '@/emails/ContractSignedEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contractorEmail, contractorName, customerName, projectName, signedAt } = body

    if (!contractorEmail || !customerName || !projectName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dashboardUrl = `${process.env.NEXT_PUBLIC_URL || 'https://tary.app'}/projects`

    const { data, error } = await resend.emails.send({
      from: 'Tary <notifications@tary.app>',
      to: contractorEmail,
      subject: `🎉 ${customerName} signed the contract for ${projectName}`,
      react: ContractSignedEmail({
        contractorName: contractorName || 'there',
        customerName,
        projectName,
        signedAt: signedAt || new Date().toISOString(),
        dashboardUrl,
      }),
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Notification error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
