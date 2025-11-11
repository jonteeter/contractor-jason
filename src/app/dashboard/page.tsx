'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import AppHeader from '@/components/navigation/AppHeader'

interface Stats {
  totalProjects: number
  totalCustomers: number
  quotedProjects: number
}

export default function DashboardPage() {
  const { user, contractor, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalCustomers: 0,
    quotedProjects: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      const [projectsRes, customersRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/customers'),
      ])

      const projectsData = await projectsRes.json()
      const customersData = await customersRes.json()

      if (projectsRes.ok && customersData) {
        const projects = projectsData.projects || []
        const quotedCount = projects.filter((p: any) => p.status === 'quoted' || p.status === 'approved').length

        setStats({
          totalProjects: projects.length,
          totalCustomers: customersData.customers?.length || 0,
          quotedProjects: quotedCount,
        })
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  console.log('📊 Dashboard render - loading:', loading, 'user:', user?.email, 'contractor:', contractor?.company_name)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !contractor) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <AppHeader title={contractor.company_name} showBack={false} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mobile-container py-4 sm:py-6 lg:py-8 safe-area-bottom">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-white mb-6 sm:mb-8 active:scale-[0.99] transition-transform">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {contractor.contact_name}!
          </h2>
          <p className="text-sm sm:text-base text-amber-100">
            Ready to create estimates and manage your projects
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link href="/customer-wizard">
            <div className="bg-white rounded-xl shadow p-5 sm:p-6 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-2 border-transparent hover:border-amber-500 touch-target">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-amber-100 rounded-lg p-2.5 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-slate-900">
                  New Estimate
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                Create a new project estimate for a customer
              </p>
            </div>
          </Link>

          <Link href="/projects">
            <div className="bg-white rounded-xl shadow p-5 sm:p-6 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-2 border-transparent hover:border-amber-500 touch-target">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-blue-100 rounded-lg p-2.5 sm:p-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-slate-900">
                  View Projects
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                Browse and manage all your projects
              </p>
            </div>
          </Link>

          <Link href="/customers">
            <div className="bg-white rounded-xl shadow p-5 sm:p-6 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-2 border-transparent hover:border-amber-500 touch-target">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-green-100 rounded-lg p-2.5 sm:p-3 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-slate-900">
                Customers
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              View and manage customer information
            </p>
          </div>
        </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Projects</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.totalProjects}
                </p>
              </div>
              <div className="bg-amber-100 rounded-full p-2.5 sm:p-3 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stats.totalProjects === 0 ? 'Create your first estimate to get started' : `${stats.quotedProjects} quoted or approved`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Customers</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.totalCustomers}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-2.5 sm:p-3 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Your customer database</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-slate-600 mb-1">Active Status</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2.5 sm:p-3 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Professional Plan</p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Getting Started</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-semibold">
                1
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm sm:text-base text-slate-700">Click "New Estimate" to create your first project</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-semibold">
                2
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm sm:text-base text-slate-700">Fill in customer information and project details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-semibold">
                3
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm sm:text-base text-slate-700">Generate professional estimates and contracts</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
