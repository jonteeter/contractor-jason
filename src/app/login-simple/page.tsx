'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('jason@thebesthardwoodfloor.com')
  const [password, setPassword] = useState('TempPassword123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccess(true)
        setError('')
        // Don't redirect, just show success
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + (err as Error).message)
      setLoading(false)
    }
  }

  const checkContractor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not logged in')
        return
      }

      const { data: contractor, error: contractorError } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', user.id)
        .single()

      if (contractorError) {
        setError(`Contractor error: ${contractorError.message} (Code: ${contractorError.code})`)
        return
      }

      if (contractor) {
        setError('')
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError('No contractor found')
      }
    } catch (err) {
      setError('Check error: ' + (err as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Simple Login Test</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-600">✅ Logged in successfully!</p>
            <button
              onClick={checkContractor}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Test contractor fetch
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2 rounded font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
