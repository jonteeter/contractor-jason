'use client'

import { useState, useEffect, use } from 'react'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle,
  Loader2,
  MessageSquare
} from 'lucide-react'

interface Contractor {
  company_name: string
  contact_name: string
  phone: string
  email: string
  logo_url: string | null
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  preferred_contact: string
  customer_notes: string
  intake_completed_at: string | null
  contractor: Contractor
}

export default function CustomerIntakePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    preferred_contact: 'phone',
    customer_notes: ''
  })

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/intake/${token}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Form not found')
        }

        setCustomer(result.customer)

        // Pre-fill form with existing data
        setFormData({
          name: result.customer.name === 'New Customer' ? '' : result.customer.name || '',
          email: result.customer.email || '',
          phone: result.customer.phone || '',
          address: result.customer.address || '',
          city: result.customer.city || '',
          state: result.customer.state || '',
          zip_code: result.customer.zip_code || '',
          preferred_contact: result.customer.preferred_contact || 'phone',
          customer_notes: result.customer.customer_notes || ''
        })

        // Check if already completed
        if (result.customer.intake_completed_at) {
          setSubmitted(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/intake/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Form Not Found</h1>
          <p className="text-slate-600">
            This form link may have expired or is invalid. Please contact your contractor for a new link.
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {customer.contractor.logo_url ? (
                <img
                  src={customer.contractor.logo_url}
                  alt={customer.contractor.company_name}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-slate-900">
                  {customer.contractor.company_name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Thank You!</h2>
            <p className="text-slate-600 mb-8">
              Your information has been submitted. {customer.contractor.contact_name} will be in touch soon to discuss your project.
            </p>
            <div className="bg-slate-100 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Questions?</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${customer.contractor.phone}`}
                  className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700"
                >
                  <Phone className="w-5 h-5" />
                  {customer.contractor.phone}
                </a>
                <a
                  href={`mailto:${customer.contractor.email}`}
                  className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700"
                >
                  <Mail className="w-5 h-5" />
                  {customer.contractor.email}
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {customer.contractor.logo_url ? (
              <img
                src={customer.contractor.logo_url}
                alt={customer.contractor.company_name}
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-semibold text-slate-900">
                {customer.contractor.company_name}
              </h1>
              <p className="text-sm text-slate-500">Customer Information Form</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Your Information</h2>
            <p className="text-amber-100 text-sm">Please fill out your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <MapPin className="w-4 h-4 inline mr-2" />
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="123 Main Street"
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Chicago"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="IL"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="60601"
                />
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Contact Method
              </label>
              <select
                name="preferred_contact"
                value={formData.preferred_contact}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="phone">Phone Call</option>
                <option value="text">Text Message</option>
                <option value="email">Email</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Additional Notes
              </label>
              <textarea
                name="customer_notes"
                value={formData.customer_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Anything else you'd like us to know about your project..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Information
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-slate-500">
          <p>Powered by Tary</p>
        </div>
      </main>
    </div>
  )
}
