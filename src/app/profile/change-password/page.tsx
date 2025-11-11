'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setIsSubmitting(true)

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to update password' })
      } else {
        setMessage({ type: 'success', text: 'Password updated successfully!' })
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto mobile-container py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/profile">
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
              Change Password
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto mobile-container py-6 sm:py-8 safe-area-bottom">
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

        {/* Change Password Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-100 rounded-lg p-2.5">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Update Your Password</h2>
            </div>
            <p className="text-sm text-slate-600">
              Choose a strong password to keep your account secure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 text-base"
                placeholder="Enter your current password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 text-base"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 text-base"
                placeholder="Confirm your new password"
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  At least 6 characters long
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Combine letters, numbers, and symbols
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Avoid common words or patterns
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <Link href="/profile" className="flex-1 sm:flex-none">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="touch-target w-full sm:px-8"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="touch-target flex-1 sm:flex-none sm:px-8 bg-amber-500 hover:bg-amber-600 text-white active:scale-95 transition-transform"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Security Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Never share your password with anyone</li>
                <li>• Use a unique password for this account</li>
                <li>• Consider using a password manager</li>
                <li>• Change your password regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
