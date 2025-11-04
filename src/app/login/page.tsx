'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🔑 Login attempt with:', email)

    try {
      // Use client-side Supabase to login
      console.log('🔑 Signing in with Supabase client...')
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('🔑 Login error:', signInError)
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data?.session) {
        console.log('🔑 Login successful! Session created for:', data.user?.email)
        console.log('🔑 Redirecting to dashboard...')
        // Use window.location for full page reload to ensure middleware picks up session
        window.location.href = '/dashboard'
        return
      } else {
        console.error('🔑 No session returned')
        setError('Login failed - no session created')
        setLoading(false)
      }
    } catch (err) {
      console.error('🔑 Login exception:', err)
      setError('An unexpected error occurred: ' + (err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Lotus</h1>
          <p className="text-slate-300">Contractor Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Need help? Contact support
            </p>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
          <p className="text-xs text-amber-400">jason@thebesthardwoodfloor.com</p>
          <p className="text-xs text-amber-400">TempPassword123!</p>
        </div>
      </div>
    </div>
  )
}
