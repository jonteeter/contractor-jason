'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ContractEditor from '@/components/contracts/ContractEditor'
import ContractTemplate from '@/components/contracts/ContractTemplate'
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
  room_1_length: number | null
  room_1_width: number | null
  room_2_length: number | null
  room_2_width: number | null
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
      name: 'Room 1',
      length: project.room_1_length,
      width: project.room_1_width,
      sqft: project.room_1_length * project.room_1_width
    } : null,
    project.room_2_length && project.room_2_width ? {
      name: 'Room 2',
      length: project.room_2_length,
      width: project.room_2_width,
      sqft: project.room_2_length * project.room_2_width
    } : null,
    project.room_3_length && project.room_3_width ? {
      name: 'Room 3',
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

            {/* Project Details */}
            <div className="border-b border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Palette className="w-4 h-4 text-amber-500 mr-2" />
                    <p className="text-xs text-slate-500">Floor Type</p>
                  </div>
                  <p className="font-semibold text-slate-900">{getFloorTypeLabel(project.floor_type)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Ruler className="w-4 h-4 text-amber-500 mr-2" />
                    <p className="text-xs text-slate-500">Size</p>
                  </div>
                  <p className="font-semibold text-slate-900">{getFloorSizeLabel(project.floor_size)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="w-4 h-4 text-amber-500 mr-2" />
                    <p className="text-xs text-slate-500">Finish</p>
                  </div>
                  <p className="font-semibold text-slate-900">{getFinishTypeLabel(project.finish_type)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Palette className="w-4 h-4 text-amber-500 mr-2" />
                    <p className="text-xs text-slate-500">Stain</p>
                  </div>
                  <p className="font-semibold text-slate-900">{getStainTypeLabel(project.stain_type)}</p>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="border-b border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Measurements</h3>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room!.name} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700">{room!.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-500">{room!.length}' × {room!.width}'</span>
                      <span className="font-semibold text-slate-900">{room!.sqft.toFixed(1)} sq ft</span>
                    </div>
                  </div>
                ))}
                {project.stair_treads > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700">Stairs</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-500">
                        {project.stair_treads} treads, {project.stair_risers} risers
                      </span>
                      <span className="font-semibold text-slate-900">
                        {((project.stair_treads * 3) + (project.stair_risers * 1.5)).toFixed(1)} sq ft
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 bg-amber-50 px-4 rounded-lg">
                  <span className="font-semibold text-slate-900">Total Square Footage</span>
                  <span className="text-xl font-bold text-amber-600">{project.total_square_feet.toFixed(1)} sq ft</span>
                </div>
              </div>
            </div>

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
