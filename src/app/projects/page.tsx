'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AppHeader from '@/components/navigation/AppHeader'
import {
  Plus,
  Search,
  FileText,
  Calendar,
  DollarSign,
  User,
  ChevronRight,
  Filter,
  Calculator
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
}

interface Project {
  id: string
  project_name: string
  status: string
  floor_type: string
  total_square_feet: number
  estimated_cost: number
  created_at: string
  customer: Customer
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load projects')
      }

      setProjects(result.projects)
    } catch (err) {
      console.error('Load projects error:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-700'
      case 'quoted': return 'bg-blue-100 text-blue-700'
      case 'approved': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-purple-100 text-purple-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft'
      case 'quoted': return 'Quoted'
      case 'approved': return 'Approved'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  const getFloorTypeLabel = (floorType: string) => {
    switch (floorType) {
      case 'red_oak': return 'Red Oak'
      case 'white_oak': return 'White Oak'
      case 'linoleum': return 'Linoleum'
      default: return floorType
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <AppHeader title="Projects" showBack={true} backHref="/dashboard" />

      {/* Filters */}
      <div className="max-w-7xl mx-auto mobile-container py-4 sm:py-6">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Button
              onClick={() => router.push('/customer-wizard')}
              className="touch-target w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects or customers..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 touch-target"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white touch-target"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto mobile-container pb-8 sm:pb-12 safe-area-bottom">
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first project'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                onClick={() => router.push('/customer-wizard')}
                className="touch-target bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/estimate?projectId=${project.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:border-amber-300 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer group touch-target"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-col sm:flex-row sm:gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                          {project.project_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-600 truncate">{project.customer.name}</span>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="text-xs sm:text-sm text-slate-600 truncate">
                            {project.customer.city}, {project.customer.state}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} whitespace-nowrap`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Floor Type</p>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{getFloorTypeLabel(project.floor_type)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Square Feet</p>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                            {project.total_square_feet ? `${project.total_square_feet.toFixed(0)} sq ft` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Estimated Cost</p>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                            {project.estimated_cost ? formatCurrency(project.estimated_cost) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Created</p>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{formatDate(project.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors flex-shrink-0 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
