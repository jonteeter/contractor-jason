'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Stats {
  totalProjects: number
  totalCustomers: number
  quotedProjects: number
}

export default function DashboardPage() {
  const { user, contractor, loading, signOut } = useAuth()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !contractor) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {contractor.company_name}
              </h1>
              <p className="text-sm text-slate-600">{contractor.contact_name}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-slate-600 hover:text-slate-900"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {contractor.contact_name}!
          </h2>
          <p className="text-amber-100">
            Ready to create estimates and manage your projects
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/customer-wizard">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-amber-500">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-slate-900">
                  New Estimate
                </h3>
              </div>
              <p className="text-slate-600">
                Create a new project estimate for a customer
              </p>
            </div>
          </Link>

          <Link href="/projects">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-amber-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-slate-900">
                  View Projects
                </h3>
              </div>
              <p className="text-slate-600">
                Browse and manage all your projects
              </p>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-slate-900">
                Customers
              </h3>
            </div>
            <p className="text-slate-600">
              View and manage customer information (Coming soon)
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.totalProjects}
                </p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stats.totalProjects === 0 ? 'Create your first estimate to get started' : `${stats.quotedProjects} quoted or approved`}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.totalCustomers}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Your customer database</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Status</p>
                <p className="text-3xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Professional Plan</p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="ml-3">
                <p className="text-slate-700">Click "New Estimate" to create your first project</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="ml-3">
                <p className="text-slate-700">Fill in customer information and project details</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div className="ml-3">
                <p className="text-slate-700">Generate professional estimates and contracts</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
