'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  LogOut,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Ruler,
  Phone,
  Mail,
  ExternalLink,
  PenTool,
  Loader2
} from 'lucide-react'

interface Contractor {
  company_name: string
  contact_name: string
  phone: string
  email: string
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
  contractor: Contractor | null
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
  created_at: string
  customer_signature: string | null
  customer_signature_date: string | null
  public_token: string | null
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
  contractor: Contractor | null
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
    month: 'short',
    day: 'numeric'
  })
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'approved': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-amber-100 text-amber-800'
    case 'quoted': return 'bg-purple-100 text-purple-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return 'Completed'
    case 'approved': return 'Approved'
    case 'in_progress': return 'In Progress'
    case 'quoted': return 'Quoted'
    case 'draft': return 'Draft'
    default: return status
  }
}

export default function CustomerPortalPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer info
        const meResponse = await fetch('/api/customer-auth/me')
        if (!meResponse.ok) {
          router.push('/portal/login')
          return
        }
        const meData = await meResponse.json()
        setCustomer(meData.customer)

        // Fetch projects
        const projectsResponse = await fetch('/api/customer-auth/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
      } catch (err) {
        console.error('Fetch error:', err)
        router.push('/portal/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/customer-auth/logout', { method: 'POST' })
      router.push('/portal/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  const contractor = customer.contractor || projects[0]?.contractor

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Customer Portal</h1>
                <p className="text-xs text-slate-500">{customer.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome, {customer.name.split(' ')[0]}!</h2>
          <p className="text-amber-100">
            View and manage your flooring projects below.
          </p>
        </div>

        {/* Contractor Info */}
        {contractor && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Your Contractor</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{contractor.company_name}</p>
                <p className="text-sm text-slate-600">{contractor.contact_name}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={`tel:${contractor.phone}`}
                    className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <Phone className="w-4 h-4" />
                    {contractor.phone}
                  </a>
                  <a
                    href={`mailto:${contractor.email}`}
                    className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <Mail className="w-4 h-4" />
                    {contractor.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Your Projects ({projects.length})</h3>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No projects yet.</p>
              <p className="text-sm text-slate-500 mt-1">
                Your contractor will add projects here when they create estimates for you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  {/* Project Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {project.project_name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Created {formatDate(project.created_at)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-5 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Floor Type</p>
                      <p className="font-medium text-slate-900">{project.floor_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Finish</p>
                      <p className="font-medium text-slate-900">{project.finish_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Area</p>
                      <p className="font-medium text-slate-900">{project.total_square_feet} sq ft</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Estimate</p>
                      <p className="font-bold text-green-600">{formatCurrency(project.estimated_cost)}</p>
                    </div>
                  </div>

                  {/* Signature Status */}
                  <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                    {project.customer_signature ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Signed on {project.customer_signature_date ? formatDate(project.customer_signature_date) : 'N/A'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm font-medium">Awaiting signature</span>
                      </div>
                    )}

                    {project.public_token && (
                      <Link
                        href={`/view/${project.public_token}`}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                      >
                        {project.customer_signature ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            View
                          </>
                        ) : (
                          <>
                            <PenTool className="w-4 h-4" />
                            View & Sign
                          </>
                        )}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-slate-500">
          <p>Powered by Tary</p>
        </div>
      </main>
    </div>
  )
}
