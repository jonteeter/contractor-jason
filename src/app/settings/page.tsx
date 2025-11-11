'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SettingsData {
  email_signature: string
  send_copy_to_self: boolean
  default_labor_rate: number
  default_material_markup: number
  notify_new_projects: boolean
  notify_status_changes: boolean
  currency: string
  date_format: string
  timezone: string
}

export default function SettingsPage() {
  const { user, contractor, loading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [settings, setSettings] = useState<SettingsData>({
    email_signature: '',
    send_copy_to_self: true,
    default_labor_rate: 0,
    default_material_markup: 0,
    notify_new_projects: true,
    notify_status_changes: true,
    currency: 'USD',
    date_format: 'MM/DD/YYYY',
    timezone: 'America/New_York',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/contractors/settings')
      const data = await response.json()

      if (response.ok && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setSettings(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setSettings(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/contractors/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
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
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto mobile-container py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="touch-target flex-shrink-0 active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">
                Settings
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="touch-target bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 active:scale-95 transition-transform"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mobile-container py-6 sm:py-8 safe-area-bottom">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm sm:text-base">{message.text}</p>
          </div>
        )}

        {/* Email Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Signature
              </label>
              <textarea
                name="email_signature"
                value={settings.email_signature}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base resize-none"
                placeholder="This will be added to the bottom of emails sent to customers..."
              />
              <p className="text-xs text-slate-500 mt-1">
                This signature will be included in estimate and contract emails
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="send_copy_to_self"
                name="send_copy_to_self"
                checked={settings.send_copy_to_self}
                onChange={handleInputChange}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="send_copy_to_self" className="text-sm text-slate-700">
                Send a copy of emails to myself
              </label>
            </div>
          </div>
        </div>

        {/* Default Pricing */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Default Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Default Labor Rate ($/hr)
              </label>
              <input
                type="number"
                name="default_labor_rate"
                value={settings.default_labor_rate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Material Markup (%)
              </label>
              <input
                type="number"
                name="default_material_markup"
                value={settings.default_material_markup}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="1"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            These values will be used as defaults when creating new estimates
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notify_new_projects"
                name="notify_new_projects"
                checked={settings.notify_new_projects}
                onChange={handleInputChange}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="notify_new_projects" className="text-sm text-slate-700">
                Notify me when new projects are created
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notify_status_changes"
                name="notify_status_changes"
                checked={settings.notify_status_changes}
                onChange={handleInputChange}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="notify_status_changes" className="text-sm text-slate-700">
                Notify me when project statuses change
              </label>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Regional Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              >
                <option value="USD">USD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date Format
              </label>
              <select
                name="date_format"
                value={settings.date_format}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Timezone
              </label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
