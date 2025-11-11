'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
}

export default function AppHeader({ title, showBack = false, backHref = '/dashboard' }: AppHeaderProps) {
  const { contractor, signOut } = useAuth()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto mobile-container py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Back Button + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBack && (
              <Link href={backHref as any}>
                <Button
                  variant="outline"
                  className="touch-target flex-shrink-0 active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
            )}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right Section: Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 sm:gap-3 touch-target px-2 sm:px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {contractor?.company_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-slate-700 truncate max-w-[150px]">
                {contractor?.company_name || 'User'}
              </span>
              <svg
                className={`w-4 h-4 text-slate-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {contractor?.company_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {contractor?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link href="/dashboard">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                    </Link>

                    <Link href="/projects">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Projects
                      </button>
                    </Link>

                    <Link href="/customers">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0 .656.126 1.283.356 1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Customers
                      </button>
                    </Link>
                  </div>

                  {/* Settings & Profile */}
                  <div className="border-t border-slate-200 py-2">
                    <Link href="/profile">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>
                    </Link>

                    <Link href="/settings">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-slate-200 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
