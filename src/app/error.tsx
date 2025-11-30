'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-4">Something went wrong</h1>
        <p className="text-slate-300 mb-6">
          We encountered an error loading this page.
        </p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/login'}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
