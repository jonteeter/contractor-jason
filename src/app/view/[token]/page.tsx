'use client'

import { useState, useEffect, use, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import {
  User,
  Phone,
  MapPin,
  Mail,
  Palette,
  Ruler,
  DollarSign,
  CheckCircle,
  FileText,
  Building2,
  Calendar,
  PenTool,
  X,
  RotateCcw,
  Loader2
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface Contractor {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  logo_url: string | null
}

interface Project {
  id: string
  project_name: string
  floor_type: string
  floor_size: string
  finish_type: string
  stain_type: string | null
  total_square_feet: number
  estimated_cost: number
  status: string
  room_1_name: string | null
  room_1_length: number | null
  room_1_width: number | null
  room_2_name: string | null
  room_2_length: number | null
  room_2_width: number | null
  room_3_name: string | null
  room_3_length: number | null
  room_3_width: number | null
  stair_treads: number
  stair_risers: number
  contract_terms: string | null
  customer_signature: string | null
  customer_signed_at: string | null
  created_at: string
  customer: Customer
  contractor: Contractor
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function PublicEstimatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSignModal, setShowSignModal] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signError, setSignError] = useState('')
  const [signSuccess, setSignSuccess] = useState(false)
  const sigCanvas = useRef<SignatureCanvas>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/public/${token}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Estimate not found')
        }

        setProject(result.project)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load estimate')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [token])

  const clearSignature = () => {
    sigCanvas.current?.clear()
    setSignError('')
  }

  const handleSignContract = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      setSignError('Please provide your signature')
      return
    }

    setSigning(true)
    setSignError('')

    try {
      const signatureData = sigCanvas.current.toDataURL('image/png')

      const response = await fetch(`/api/public/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureData })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save signature')
      }

      setSignSuccess(true)
      setShowSignModal(false)

      // Update local project state to show signed status
      if (project) {
        setProject({
          ...project,
          customer_signature: signatureData,
          customer_signed_at: new Date().toISOString(),
          status: 'approved'
        })
      }
    } catch (err) {
      setSignError(err instanceof Error ? err.message : 'Failed to save signature')
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading estimate...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Estimate Not Found</h1>
          <p className="text-slate-600">
            This estimate link may have expired or is invalid. Please contact the contractor for a new link.
          </p>
        </div>
      </div>
    )
  }

  const rooms = [
    { name: project.room_1_name || 'Room 1', length: project.room_1_length, width: project.room_1_width },
    { name: project.room_2_name || 'Room 2', length: project.room_2_length, width: project.room_2_width },
    { name: project.room_3_name || 'Room 3', length: project.room_3_length, width: project.room_3_width },
  ].filter(room => room.length && room.width)

  const hasStairs = project.stair_treads > 0 || project.stair_risers > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with contractor branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {project.contractor.logo_url ? (
              <img
                src={project.contractor.logo_url}
                alt={project.contractor.company_name}
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-semibold text-slate-900">
                {project.contractor.company_name}
              </h1>
              <p className="text-sm text-slate-500">
                {project.contractor.contact_name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        {project.customer_signature && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Contract Signed</p>
              <p className="text-sm text-green-700">
                Signed on {project.customer_signed_at ? formatDate(project.customer_signed_at) : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Customer Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Estimate For
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{project.customer.name}</span>
            </div>
            {project.customer.address && (
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span>{project.customer.address}</span>
              </div>
            )}
            {project.customer.phone && (
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${project.customer.phone}`} className="hover:text-amber-600">
                  {project.customer.phone}
                </a>
              </div>
            )}
            {project.customer.email && (
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${project.customer.email}`} className="hover:text-amber-600">
                  {project.customer.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Project Specifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Project Specifications
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Floor Type</p>
                <p className="font-medium text-slate-900">{project.floor_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Plank Size</p>
                <p className="font-medium text-slate-900">{project.floor_size}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Finish</p>
                <p className="font-medium text-slate-900">{project.finish_type}</p>
              </div>
              {project.stain_type && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Stain</p>
                  <p className="font-medium text-slate-900">{project.stain_type}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Room Measurements */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Measurements
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {rooms.map((room, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-700">{room.name}</span>
                <div className="text-right">
                  <span className="font-medium text-slate-900">
                    {room.length}&apos; x {room.width}&apos;
                  </span>
                  <span className="text-slate-500 text-sm ml-2">
                    ({((room.length || 0) * (room.width || 0)).toFixed(0)} sq ft)
                  </span>
                </div>
              </div>
            ))}

            {hasStairs && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-700">Stair Treads</span>
                  <span className="font-medium text-slate-900">{project.stair_treads}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-700">Stair Risers</span>
                  <span className="font-medium text-slate-900">{project.stair_risers}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t-2 border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Total Area</span>
                <span className="font-bold text-lg text-slate-900">
                  {project.total_square_feet.toFixed(0)} sq ft
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm uppercase tracking-wide mb-1">Estimated Total</p>
              <p className="text-4xl font-bold">{formatCurrency(project.estimated_cost)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Contract Terms (if available) */}
        {project.contract_terms && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contract Terms
              </h2>
            </div>
            <div className="p-5">
              <div className="prose prose-sm prose-slate max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
                  {project.contract_terms}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Sign Contract CTA - only show if not signed */}
        {!project.customer_signature && (
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to proceed?</h3>
                <p className="text-amber-100 text-sm">
                  Sign this contract to approve the estimate and schedule your project.
                </p>
              </div>
              <button
                onClick={() => setShowSignModal(true)}
                className="flex items-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors shadow-md"
              >
                <PenTool className="w-5 h-5" />
                Sign Contract
              </button>
            </div>
          </div>
        )}

        {/* Success Message after signing */}
        {signSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Thank you for signing!</p>
              <p className="text-sm text-green-700">
                {project.contractor.company_name} has been notified and will be in touch soon.
              </p>
            </div>
          </div>
        )}

        {/* Contact Contractor */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Questions?</h3>
          <div className="space-y-3">
            <a
              href={`tel:${project.contractor.phone}`}
              className="flex items-center gap-3 text-slate-700 hover:text-amber-600 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Call us</p>
                <p className="font-medium">{project.contractor.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${project.contractor.email}`}
              className="flex items-center gap-3 text-slate-700 hover:text-amber-600 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email us</p>
                <p className="font-medium">{project.contractor.email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-slate-500">
          <p>Estimate created {formatDate(project.created_at)}</p>
          <p className="mt-1">Powered by Tary</p>
        </div>
      </main>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Sign Contract
              </h2>
              <button
                onClick={() => {
                  setShowSignModal(false)
                  setSignError('')
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="text-sm text-slate-600">
                <p className="mb-2">
                  By signing below, you agree to the estimate of{' '}
                  <strong className="text-slate-900">
                    {formatCurrency(project.estimated_cost)}
                  </strong>{' '}
                  for the described flooring work.
                </p>
                <p className="text-slate-500">
                  Please use your finger or mouse to sign in the box below.
                </p>
              </div>

              {/* Signature Pad */}
              <div className="relative">
                <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      className: 'w-full h-48',
                      style: { width: '100%', height: '192px' }
                    }}
                  />
                </div>
                <button
                  onClick={clearSignature}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                  title="Clear signature"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {signError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {signError}
                </p>
              )}

              {/* Signer Info */}
              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <p>Signing as: <strong className="text-slate-700">{project.customer.name}</strong></p>
                <p>Date: <strong className="text-slate-700">{new Date().toLocaleDateString()}</strong></p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
              <button
                onClick={() => {
                  setShowSignModal(false)
                  setSignError('')
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                disabled={signing}
              >
                Cancel
              </button>
              <button
                onClick={handleSignContract}
                disabled={signing}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm &amp; Sign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
