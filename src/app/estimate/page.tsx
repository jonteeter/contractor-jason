'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ContractEditor from '@/components/contracts/ContractEditor'
import ContractTemplate from '@/components/contracts/ContractTemplate'
import SignatureModal from '@/components/signatures/SignatureModal'
import ProjectDetailsEditor from '@/components/estimate/ProjectDetailsEditor'
import MeasurementsEditor from '@/components/estimate/MeasurementsEditor'
import PaymentTracker from '@/components/payments/PaymentTracker'
import { downloadEstimatePDF } from '@/lib/pdf/generateEstimatePDF'
import { downloadContractPDF } from '@/lib/pdf/generateContractPDF'
import {
  ArrowLeft,
  Download,
  CheckCircle,
  DollarSign,
  Edit2,
  Save,
  X,
  FileText,
  User,
  Phone,
  MapPin,
  Palette,
  Ruler,
  Mail
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
}

interface Project {
  id: string
  project_name: string
  floor_type: string
  floor_size: string
  finish_type: string
  stain_type: string | null
  stair_treads: number
  stair_risers: number
  room_1_name?: string | null
  room_1_length: number | null
  room_1_width: number | null
  room_2_name?: string | null
  room_2_length: number | null
  room_2_width: number | null
  room_3_name?: string | null
  room_3_length: number | null
  room_3_width: number | null
  total_square_feet: number
  estimated_cost: number
  status: string
  created_at: string
  work_description: string | null
  intro_message: string | null
  estimated_days: number | null
  start_date: string | null
  completion_date: string | null
  customer_signature: string | null
  customer_signature_date: string | null
  contractor_signature: string | null
  contractor_signature_date: string | null
  payment_schedule: '60_30_10' | '50_50' | '100_upfront' | 'custom'
  deposit_amount: number
  deposit_paid: boolean
  deposit_paid_date: string | null
  deposit_payment_method: string | null
  progress_payment_amount: number
  progress_payment_paid: boolean
  progress_payment_paid_date: string | null
  progress_payment_method: string | null
  final_payment_amount: number
  final_payment_paid: boolean
  final_payment_paid_date: string | null
  final_payment_method: string | null
  total_paid: number
  balance_due: number
  payment_notes: string | null
  customer: Customer
}

function EstimatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projectId, setProjectId] = useState<string | null | undefined>(undefined)

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'estimate' | 'contract'>('estimate')
  const [editing, setEditing] = useState(false)
  const [editingContract, setEditingContract] = useState(false)
  const [editedCost, setEditedCost] = useState('')
  const [editedIntro, setEditedIntro] = useState('')
  const [editedWorkDescription, setEditedWorkDescription] = useState('')
  const [editedDays, setEditedDays] = useState('')
  const [editedStartDate, setEditedStartDate] = useState('')
  const [editedCompletionDate, setEditedCompletionDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [showCustomerSignature, setShowCustomerSignature] = useState(false)
  const [showContractorSignature, setShowContractorSignature] = useState(false)
  const [savingSignature, setSavingSignature] = useState(false)

  // Get project ID from URL or localStorage (client-side only)
  useEffect(() => {
    const urlProjectId = searchParams.get('projectId')
    const storedProjectId = typeof window !== 'undefined' ? localStorage.getItem('currentProjectId') : null
    setProjectId(urlProjectId || storedProjectId)
  }, [searchParams])

  useEffect(() => {
    if (projectId) {
      loadProject()
    } else if (projectId === null) {
      // Only set error if we've checked and found no project ID (null means we checked, undefined means we haven't checked yet)
      setError('No project ID provided')
      setLoading(false)
    }
  }, [projectId])

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load project')
      }

      setProject(result.project)
      setEditedCost(result.project.estimated_cost.toString())
      setEditedIntro(result.project.intro_message || 'Thank you for choosing The Best Hardwood Flooring Co. for your flooring and home improvement needs. Below is a breakdown of the work as we discussed. Please review the information and let me know if I missed anything.')
      setEditedWorkDescription(result.project.work_description || '')
      setEditedDays(result.project.estimated_days?.toString() || '')
      setEditedStartDate(result.project.start_date || '')
      setEditedCompletionDate(result.project.completion_date || '')
    } catch (err) {
      console.error('Load project error:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCost = async () => {
    if (!project) return

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimated_cost: parseFloat(editedCost)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update cost')
      }

      setProject({ ...project, estimated_cost: parseFloat(editedCost) })
      setEditing(false)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContractDetails = async () => {
    if (!project) return

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intro_message: editedIntro,
          work_description: editedWorkDescription,
          estimated_days: editedDays ? parseInt(editedDays) : null,
          start_date: editedStartDate || null,
          completion_date: editedCompletionDate || null,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update contract details')
      }

      const result = await response.json()
      setProject(result.project)
      setEditingContract(false)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProjectDetails = async (details: {
    floor_type: string
    floor_size: string
    finish_type: string
    stain_type: string | null
  }) => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })

      if (!response.ok) {
        throw new Error('Failed to update project details')
      }

      const result = await response.json()
      setProject(result.project)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save project details')
      throw err
    }
  }

  const handleSaveMeasurements = async (measurements: {
    room_1_name?: string | null
    room_1_length?: number | null
    room_1_width?: number | null
    room_2_name?: string | null
    room_2_length?: number | null
    room_2_width?: number | null
    room_3_name?: string | null
    room_3_length?: number | null
    room_3_width?: number | null
    stair_treads: number
    stair_risers: number
  }) => {
    if (!project) return

    try {
      // Calculate new total square feet
      let totalSqft = 0
      if (measurements.room_1_length && measurements.room_1_width) {
        totalSqft += measurements.room_1_length * measurements.room_1_width
      }
      if (measurements.room_2_length && measurements.room_2_width) {
        totalSqft += measurements.room_2_length * measurements.room_2_width
      }
      if (measurements.room_3_length && measurements.room_3_width) {
        totalSqft += measurements.room_3_length * measurements.room_3_width
      }
      totalSqft += (measurements.stair_treads * 3) + (measurements.stair_risers * 1.5)

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...measurements,
          total_square_feet: totalSqft
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update measurements')
      }

      const result = await response.json()
      setProject(result.project)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save measurements')
      throw err
    }
  }

  const handleSavePayments = async (payments: Partial<Project>) => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payments)
      })

      if (!response.ok) {
        throw new Error('Failed to update payments')
      }

      const result = await response.json()
      setProject(result.project)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save payment information')
      throw err
    }
  }

  const handleSendEmail = async () => {
    if (!project) return

    setSendingEmail(true)
    setEmailSuccess(false)
    try {
      const response = await fetch(`/api/projects/${project.id}/send-estimate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send email')
      }

      const result = await response.json()
      setEmailSuccess(true)

      // Update project status to 'sent'
      setProject({ ...project, status: 'sent' })

      // Show success message for 3 seconds
      setTimeout(() => setEmailSuccess(false), 3000)
    } catch (err) {
      console.error('Send email error:', err)
      alert(`Failed to send email: ${(err as Error).message}`)
    } finally {
      setSendingEmail(false)
    }
  }

  const handleSaveSignature = async (signatureData: string, signatureType: 'customer' | 'contractor') => {
    if (!project) return

    setSavingSignature(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/signatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType,
          signatureData,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save signature')
      }

      const result = await response.json()
      setProject(result.project)

      // Close the modal
      if (signatureType === 'customer') {
        setShowCustomerSignature(false)
      } else {
        setShowContractorSignature(false)
      }
    } catch (err) {
      console.error('Save signature error:', err)
      alert('Failed to save signature')
    } finally {
      setSavingSignature(false)
    }
  }

  const handleDownloadPDF = () => {
    if (!project) return

    const rooms = [
      project.room_1_length && project.room_1_width ? {
        name: project.room_1_name || 'Room 1',
        length: project.room_1_length,
        width: project.room_1_width,
        sqft: project.room_1_length * project.room_1_width
      } : null,
      project.room_2_length && project.room_2_width ? {
        name: project.room_2_name || 'Room 2',
        length: project.room_2_length,
        width: project.room_2_width,
        sqft: project.room_2_length * project.room_2_width
      } : null,
      project.room_3_length && project.room_3_width ? {
        name: project.room_3_name || 'Room 3',
        length: project.room_3_length,
        width: project.room_3_width,
        sqft: project.room_3_length * project.room_3_width
      } : null,
    ].filter((room): room is NonNullable<typeof room> => room !== null)

    if (activeTab === 'estimate') {
      // Download Estimate PDF
      downloadEstimatePDF({
        contractorName: 'Jason W. Dixon',
        contractorCompany: 'The Best Hardwood Flooring Co.',
        contractorPhone: '708-762-1003',
        contractorEmail: 'jason@thebesthardwoodfloor.com',
        customerName: project.customer.name,
        customerEmail: project.customer.email,
        customerPhone: project.customer.phone,
        customerAddress: project.customer.address,
        customerCity: project.customer.city,
        customerState: project.customer.state,
        customerZip: project.customer.zip_code,
        projectName: project.project_name,
        floorType: getFloorTypeLabel(project.floor_type),
        floorSize: getFloorSizeLabel(project.floor_size),
        finishType: getFinishTypeLabel(project.finish_type),
        stainType: project.stain_type ? getStainTypeLabel(project.stain_type) : undefined,
        rooms: rooms,
        stairTreads: project.stair_treads,
        stairRisers: project.stair_risers,
        totalSquareFeet: project.total_square_feet,
        estimatedCost: project.estimated_cost,
        createdAt: project.created_at,
      })
    } else {
      // Download Contract PDF
      downloadContractPDF({
        contractorName: 'Jason W. Dixon',
        contractorCompany: 'The Best Hardwood Flooring Co.',
        contractorPhone: '708-762-1003',
        contractorEmail: 'jason@thebesthardwoodfloor.com',
        customerName: project.customer.name,
        customerEmail: project.customer.email,
        customerPhone: project.customer.phone,
        customerAddress: project.customer.address,
        customerCity: project.customer.city,
        customerState: project.customer.state,
        customerZip: project.customer.zip_code,
        projectName: project.project_name,
        floorType: getFloorTypeLabel(project.floor_type),
        floorSize: getFloorSizeLabel(project.floor_size),
        finishType: getFinishTypeLabel(project.finish_type),
        stainType: project.stain_type ? getStainTypeLabel(project.stain_type) : undefined,
        rooms: rooms,
        stairTreads: project.stair_treads,
        stairRisers: project.stair_risers,
        totalSquareFeet: project.total_square_feet,
        estimatedCost: project.estimated_cost,
        introMessage: project.intro_message || undefined,
        workDescription: project.work_description || undefined,
        estimatedDays: project.estimated_days || undefined,
        startDate: project.start_date || undefined,
        completionDate: project.completion_date || undefined,
        customerSignature: project.customer_signature || undefined,
        customerSignatureDate: project.customer_signature_date || undefined,
        contractorSignature: project.contractor_signature || undefined,
        contractorSignatureDate: project.contractor_signature_date || undefined,
        createdAt: project.created_at,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getFloorTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      red_oak: 'Red Oak',
      white_oak: 'White Oak',
      linoleum: 'Linoleum'
    }
    return labels[type] || type
  }

  const getFloorSizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      '2_inch': '2"',
      '2_5_inch': '2.5"',
      '3_inch': '3"'
    }
    return labels[size] || size
  }

  const getFinishTypeLabel = (finish: string) => {
    const labels: Record<string, string> = {
      stain: 'Stain',
      gloss: 'Gloss',
      semi_gloss: 'Semi-Gloss',
      option: 'Custom Option'
    }
    return labels[finish] || finish
  }

  const getStainTypeLabel = (stain: string | null) => {
    if (!stain) return 'None'
    const labels: Record<string, string> = {
      natural: 'Natural',
      golden_oak: 'Golden Oak',
      spice_brown: 'Spice Brown'
    }
    return labels[stain] || stain
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading estimate...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Estimate</h2>
          <p className="text-slate-600 mb-6">{error || 'Project not found'}</p>
          <Button onClick={() => router.push('/projects')} className="bg-amber-500 hover:bg-amber-600">
            View All Projects
          </Button>
        </div>
      </div>
    )
  }

  const rooms = [
    project.room_1_length && project.room_1_width ? {
      name: project.room_1_name || 'Room 1',
      length: project.room_1_length,
      width: project.room_1_width,
      sqft: project.room_1_length * project.room_1_width
    } : null,
    project.room_2_length && project.room_2_width ? {
      name: project.room_2_name || 'Room 2',
      length: project.room_2_length,
      width: project.room_2_width,
      sqft: project.room_2_length * project.room_2_width
    } : null,
    project.room_3_length && project.room_3_width ? {
      name: project.room_3_name || 'Room 3',
      length: project.room_3_length,
      width: project.room_3_width,
      sqft: project.room_3_length * project.room_3_width
    } : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 w-full">
              <button
                onClick={() => router.push('/projects')}
                className="touch-target p-2 hover:bg-slate-100 active:scale-95 rounded-lg transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Project Estimate</h1>
                <p className="text-xs sm:text-sm text-slate-600 truncate">{project.customer.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Button
                onClick={() => setActiveTab('estimate')}
                variant={activeTab === 'estimate' ? 'default' : 'outline'}
                className={`touch-target text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0 active:scale-95 transition-transform ${activeTab === 'estimate' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              >
                Estimate
              </Button>
              <Button
                onClick={() => setActiveTab('contract')}
                variant={activeTab === 'contract' ? 'default' : 'outline'}
                className={`touch-target text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0 active:scale-95 transition-transform ${activeTab === 'contract' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              >
                Contract
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail || emailSuccess}
                variant="outline"
                className={`touch-target text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0 active:scale-95 transition-transform ${
                  emailSuccess
                    ? 'text-green-600 border-green-600 bg-green-50'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                }`}
              >
                {sendingEmail ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin sm:mr-2"></div>
                    <span className="hidden sm:inline">Sending...</span>
                  </>
                ) : emailSuccess ? (
                  <>
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sent!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send Email</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="touch-target text-xs sm:text-sm px-3 sm:px-4 py-2 text-amber-600 border-amber-600 hover:bg-amber-50 active:scale-95 transition-transform flex-shrink-0"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 safe-area-bottom">
        {activeTab === 'estimate' ? (
          <div className="bg-white rounded-xl shadow-lg">
            {/* Estimate Header */}
            <div className="border-b border-slate-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    The Best Hardwood Flooring Co.
                  </h2>
                  <p className="text-slate-600">Jason W. Dixon</p>
                  <p className="text-slate-600">708-762-1003</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Estimate Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-amber-500" />
                    Customer Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-slate-900">{project.customer.name}</p>
                    <p className="text-slate-600">{project.customer.email}</p>
                    <p className="text-slate-600">{project.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                    Project Address
                  </h3>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>{project.customer.address}</p>
                    <p>{project.customer.city}, {project.customer.state} {project.customer.zip_code}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details - Editable */}
            <ProjectDetailsEditor
              projectDetails={{
                floor_type: project.floor_type,
                floor_size: project.floor_size,
                finish_type: project.finish_type,
                stain_type: project.stain_type
              }}
              onSave={handleSaveProjectDetails}
              getFloorTypeLabel={getFloorTypeLabel}
              getFloorSizeLabel={getFloorSizeLabel}
              getFinishTypeLabel={getFinishTypeLabel}
              getStainTypeLabel={getStainTypeLabel}
            />

            {/* Measurements - Editable */}
            <MeasurementsEditor
              measurements={{
                room_1_name: project.room_1_name,
                room_1_length: project.room_1_length,
                room_1_width: project.room_1_width,
                room_2_name: project.room_2_name,
                room_2_length: project.room_2_length,
                room_2_width: project.room_2_width,
                room_3_name: project.room_3_name,
                room_3_length: project.room_3_length,
                room_3_width: project.room_3_width,
                stair_treads: project.stair_treads,
                stair_risers: project.stair_risers
              }}
              onSave={handleSaveMeasurements}
            />

            {/* Cost Summary */}
            <div className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">Materials & Labor</span>
                  <span className="font-semibold text-slate-900">Included</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-700">Total Square Footage</span>
                  <span className="font-semibold text-slate-900">{project.total_square_feet.toFixed(1)} sq ft</span>
                </div>

                <div className="flex items-center justify-between py-4 bg-gradient-to-r from-amber-50 to-amber-100 px-6 rounded-lg mt-4">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-amber-600 mr-2" />
                    <span className="text-lg font-bold text-slate-900">Total Project Cost</span>
                  </div>
                  {editing ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-amber-600">$</span>
                      <input
                        type="number"
                        value={editedCost}
                        onChange={(e) => setEditedCost(e.target.value)}
                        className="w-32 px-3 py-2 border border-amber-300 rounded-lg text-lg font-bold text-amber-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        step="0.01"
                      />
                      <Button
                        onClick={handleSaveCost}
                        disabled={saving}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditing(false)
                          setEditedCost(project.estimated_cost.toString())
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-amber-600">
                        {formatCurrency(project.estimated_cost)}
                      </span>
                      <Button
                        onClick={() => setEditing(true)}
                        size="sm"
                        variant="ghost"
                        className="text-amber-600 hover:bg-amber-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is an estimate. Final pricing may vary based on site conditions and any additional work required.
                </p>
              </div>
            </div>

            {/* Payment Tracking */}
            <PaymentTracker
              payments={{
                payment_schedule: project.payment_schedule || '60_30_10',
                estimated_cost: project.estimated_cost,
                deposit_amount: project.deposit_amount || 0,
                deposit_paid: project.deposit_paid || false,
                deposit_paid_date: project.deposit_paid_date,
                deposit_payment_method: project.deposit_payment_method,
                progress_payment_amount: project.progress_payment_amount || 0,
                progress_payment_paid: project.progress_payment_paid || false,
                progress_payment_paid_date: project.progress_payment_paid_date,
                progress_payment_method: project.progress_payment_method,
                final_payment_amount: project.final_payment_amount || 0,
                final_payment_paid: project.final_payment_paid || false,
                final_payment_paid_date: project.final_payment_paid_date,
                final_payment_method: project.final_payment_method,
                total_paid: project.total_paid || 0,
                balance_due: project.balance_due || project.estimated_cost,
                payment_notes: project.payment_notes
              }}
              onSave={handleSavePayments}
            />
          </div>
        ) : (
          <div>
            {!editingContract ? (
              <div>
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={() => setEditingContract(true)}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Contract Details
                  </Button>
                </div>
                <ContractTemplate
                  customer={{
                    name: project.customer.name,
                    address: project.customer.address,
                    city: project.customer.city,
                    state: project.customer.state
                  }}
                  introMessage={project.intro_message || 'Thank you for choosing The Best Hardwood Flooring Co. for your flooring and home improvement needs. Below is a breakdown of the work as we discussed. Please review the information and let me know if I missed anything.'}
                  workDescription={project.work_description || ''}
                  estimatedCost={project.estimated_cost}
                  estimatedDays={project.estimated_days}
                  startDate={project.start_date}
                  completionDate={project.completion_date}
                />

                {/* Signature Section */}
                <div className="border-t border-slate-200 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Digital Signatures</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Signature */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Customer Signature
                      </label>
                      {project.customer_signature ? (
                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <img
                            src={project.customer_signature}
                            alt="Customer Signature"
                            className="h-20 w-full object-contain"
                          />
                          <p className="text-xs text-slate-600 mt-2">
                            Signed: {new Date(project.customer_signature_date!).toLocaleDateString()}
                          </p>
                          <Button
                            onClick={() => setShowCustomerSignature(true)}
                            variant="outline"
                            className="mt-2 w-full text-xs"
                          >
                            Update Signature
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowCustomerSignature(true)}
                          variant="outline"
                          className="w-full border-2 border-dashed border-slate-300 h-24 text-slate-600 hover:border-amber-500 hover:text-amber-600"
                        >
                          + Add Customer Signature
                        </Button>
                      )}
                    </div>

                    {/* Contractor Signature */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contractor Signature
                      </label>
                      {project.contractor_signature ? (
                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <img
                            src={project.contractor_signature}
                            alt="Contractor Signature"
                            className="h-20 w-full object-contain"
                          />
                          <p className="text-xs text-slate-600 mt-2">
                            Signed: {new Date(project.contractor_signature_date!).toLocaleDateString()}
                          </p>
                          <Button
                            onClick={() => setShowContractorSignature(true)}
                            variant="outline"
                            className="mt-2 w-full text-xs"
                          >
                            Update Signature
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowContractorSignature(true)}
                          variant="outline"
                          className="w-full border-2 border-dashed border-slate-300 h-24 text-slate-600 hover:border-amber-500 hover:text-amber-600"
                        >
                          + Add Contractor Signature
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ContractEditor
                introMessage={editedIntro}
                workDescription={editedWorkDescription}
                estimatedDays={editedDays}
                startDate={editedStartDate}
                completionDate={editedCompletionDate}
                onIntroChange={setEditedIntro}
                onWorkDescriptionChange={setEditedWorkDescription}
                onEstimatedDaysChange={setEditedDays}
                onStartDateChange={setEditedStartDate}
                onCompletionDateChange={setEditedCompletionDate}
                onSave={handleSaveContractDetails}
                onCancel={() => {
                  setEditingContract(false)
                  setEditedIntro(project.intro_message || 'Thank you for choosing The Best Hardwood Flooring Co. for your flooring and home improvement needs. Below is a breakdown of the work as we discussed. Please review the information and let me know if I missed anything.')
                  setEditedWorkDescription(project.work_description || '')
                  setEditedDays(project.estimated_days?.toString() || '')
                  setEditedStartDate(project.start_date || '')
                  setEditedCompletionDate(project.completion_date || '')
                }}
                saving={saving}
              />
            )}
          </div>
        )}
      </main>

      {/* Signature Modals */}
      <SignatureModal
        isOpen={showCustomerSignature}
        onClose={() => setShowCustomerSignature(false)}
        onSave={(signatureData) => handleSaveSignature(signatureData, 'customer')}
        title="Customer Signature"
        signerName={project?.customer.name || 'Customer'}
      />

      <SignatureModal
        isOpen={showContractorSignature}
        onClose={() => setShowContractorSignature(false)}
        onSave={(signatureData) => handleSaveSignature(signatureData, 'contractor')}
        title="Contractor Signature"
        signerName="Jason W. Dixon"
      />
    </div>
  )
}

export default function EstimatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading estimate...</p>
        </div>
      </div>
    }>
      <EstimatePageContent />
    </Suspense>
  )
}
