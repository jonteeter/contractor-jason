'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/client'

type Contractor = Database['public']['Tables']['contractors']['Row']

interface AuthContextType {
  user: User | null
  contractor: Contractor | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  contractor: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization in dev mode (React StrictMode)
    if (initialized.current) return
    initialized.current = true

    console.log('🔐 AuthContext: Initializing...')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 AuthContext: Session loaded:', session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchContractor(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 AuthContext: Auth state changed:', _event, session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchContractor(session.user.id)
      } else {
        setContractor(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      initialized.current = false
    }
  }, [])

  const fetchContractor = async (userId: string) => {
    console.log('🔐 AuthContext: Fetching contractor for user:', userId)
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('🔐 AuthContext: Error fetching contractor:', error)
        console.error('🔐 Error details:', JSON.stringify(error, null, 2))
      } else if (data) {
        console.log('🔐 AuthContext: Contractor loaded:', data.company_name)
        setContractor(data)
      } else {
        console.error('🔐 AuthContext: No contractor data returned')
      }
    } catch (err) {
      console.error('🔐 AuthContext: Exception fetching contractor:', err)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setContractor(null)
  }

  return (
    <AuthContext.Provider value={{ user, contractor, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
