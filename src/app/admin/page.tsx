'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bug,
  Lightbulb,
  HelpCircle,
  ChevronLeft,
  ExternalLink,
  Check,
  X,
  Eye,
  RefreshCw,
  Calendar,
  Building2,
  Mail,
  Phone,
  Crown,
  UserCheck,
  UserX,
} from 'lucide-react'

interface Stats {
  totalCustomers: number
  totalProjects: number
  totalContractors: number
  projectsByStatus: {
    draft: number
    quoted: number
    approved: number
    in_progress: number
    completed: number
  }
  recentProjects: Array<{
    id: string
    project_name: string
    status: string
    created_at: string
    customer_name: string
  }>
  totalRevenue: number
  pendingFeedback: number
}

interface Contractor {
  id: string
  email: string
  company_name: string | null
  contact_name: string | null
  phone: string | null
  subscription_plan: string
  is_active: boolean
  created_at: string
  project_count: number
  customer_count: number
}

interface FeedbackItem {
  id: string
  category: 'bug' | 'idea' | 'question'
  message: string
  page_url: string
  page_title: string | null
  viewport_width: number | null
  viewport_height: number | null
  status: string
  created_at: string
  screenshot: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'feedback'>('overview')
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [updatingFeedback, setUpdatingFeedback] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, contractorsRes, feedbackRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/contractors'),
        fetch('/api/feedback?status=new')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (contractorsRes.ok) {
        const contractorsData = await contractorsRes.json()
        setContractors(contractorsData)
      }

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json()
        setFeedback(feedbackData)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      fetchData()
    }
  }, [user, authLoading, router, fetchData])

  const updateFeedbackStatus = async (id: string, status: 'resolved' | 'wont_fix') => {
    setUpdatingFeedback(id)
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setFeedback(prev => prev.filter(f => f.id !== id))
        setSelectedFeedback(null)
      }
    } catch (error) {
      console.error('Failed to update feedback:', error)
    } finally {
      setUpdatingFeedback(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  const categoryIcons = {
    bug: Bug,
    idea: Lightbulb,
    question: HelpCircle
  }

  const categoryColors = {
    bug: 'text-red-400 bg-red-500/10',
    idea: 'text-yellow-400 bg-yellow-500/10',
    question: 'text-blue-400 bg-blue-500/10'
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    quoted: 'bg-blue-500',
    approved: 'bg-green-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-emerald-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-sm text-slate-400">Tary Management Console</p>
                </div>
              </div>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 border-b border-slate-700/50 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({contractors.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'feedback'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Feedback
            {feedback.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {feedback.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                title="Contractors"
                value={stats.totalContractors}
                icon={Building2}
                gradient="from-indigo-500 to-purple-500"
                onClick={() => setActiveTab('users')}
              />
              <StatCard
                title="Customers"
                value={stats.totalCustomers}
                icon={Users}
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard
                title="Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                gradient="from-purple-500 to-pink-500"
              />
              <StatCard
                title="Completed"
                value={stats.projectsByStatus.completed}
                icon={CheckCircle2}
                gradient="from-green-500 to-emerald-500"
              />
              <StatCard
                title="Feedback"
                value={stats.pendingFeedback}
                icon={MessageSquare}
                gradient="from-orange-500 to-red-500"
                onClick={() => setActiveTab('feedback')}
              />
            </div>

            {/* Project Status Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-400" />
                Project Status Breakdown
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="bg-slate-900/50 rounded-xl p-4 text-center"
                  >
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-sm text-slate-400 capitalize">
                      {status.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Projects
              </h2>
              <div className="space-y-3">
                {stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/70 transition-colors cursor-pointer"
                      onClick={() => router.push(`/estimate?projectId=${project.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${statusColors[project.status]}`} />
                        <div>
                          <div className="font-medium text-white">
                            {project.project_name || 'Untitled Project'}
                          </div>
                          <div className="text-sm text-slate-400">
                            {project.customer_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No recent projects
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Registered Contractors ({contractors.length})
              </h2>
            </div>

            {contractors.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No contractors yet</h3>
                <p className="text-slate-400">Contractors will appear here when they sign up.</p>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Contractor</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Contact</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Plan</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Projects</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Customers</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractors.map((contractor) => (
                        <tr
                          key={contractor.id}
                          className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {(contractor.company_name || contractor.contact_name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {contractor.company_name || 'No company name'}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {contractor.contact_name || 'No contact name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {contractor.email}
                              </div>
                              {contractor.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Phone className="w-3 h-3 text-slate-500" />
                                  {contractor.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              contractor.subscription_plan === 'enterprise'
                                ? 'bg-purple-500/20 text-purple-400'
                                : contractor.subscription_plan === 'professional'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {contractor.subscription_plan === 'enterprise' && <Crown className="w-3 h-3" />}
                              {contractor.subscription_plan.charAt(0).toUpperCase() + contractor.subscription_plan.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              contractor.is_active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {contractor.is_active ? (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-white font-medium">{contractor.project_count}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-white font-medium">{contractor.customer_count}</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-400">
                            {new Date(contractor.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feedback List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Pending Feedback ({feedback.length})
              </h2>

              {feedback.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
                  <p className="text-slate-400">No pending feedback to review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedback.map((item) => {
                    const Icon = categoryIcons[item.category]
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedFeedback(item)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedFeedback?.id === item.id
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${categoryColors[item.category]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white capitalize">
                                {item.category}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 truncate">
                              {item.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 truncate">
                              {item.page_url.replace('http://localhost:3000', '')}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Feedback Detail */}
            <div className="lg:col-span-2">
              {selectedFeedback ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${categoryColors[selectedFeedback.category]}`}>
                          {(() => {
                            const Icon = categoryIcons[selectedFeedback.category]
                            return <Icon className="w-6 h-6" />
                          })()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white capitalize">
                            {selectedFeedback.category} Report
                          </h3>
                          <p className="text-sm text-slate-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(selectedFeedback.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateFeedbackStatus(selectedFeedback.id, 'resolved')}
                          disabled={updatingFeedback === selectedFeedback.id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Resolve
                        </button>
                        <button
                          onClick={() => updateFeedbackStatus(selectedFeedback.id, 'wont_fix')}
                          disabled={updatingFeedback === selectedFeedback.id}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Won&apos;t Fix
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Message */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Message</h4>
                      <div className="bg-slate-900/50 rounded-xl p-4">
                        <p className="text-white whitespace-pre-wrap">{selectedFeedback.message}</p>
                      </div>
                    </div>

                    {/* Context */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Context</h4>
                      <div className="bg-slate-900/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Page</span>
                          <a
                            href={selectedFeedback.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {selectedFeedback.page_url.replace('http://localhost:3000', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {selectedFeedback.page_title && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Title</span>
                            <span className="text-white">{selectedFeedback.page_title}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Viewport</span>
                          <span className="text-white">
                            {selectedFeedback.viewport_width} × {selectedFeedback.viewport_height}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot */}
                    {selectedFeedback.screenshot && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Screenshot</h4>
                        <div className="bg-slate-900/50 rounded-xl p-2 overflow-hidden">
                          <img
                            src={selectedFeedback.screenshot}
                            alt="Screenshot"
                            className="w-full rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                  <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select feedback to view</h3>
                  <p className="text-slate-400">Click on a feedback item to see details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  onClick
}: {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
  onClick?: () => void
}) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 ${
        onClick ? 'hover:border-slate-600 transition-colors cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </Component>
  )
}
