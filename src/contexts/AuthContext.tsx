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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setContractor(data)
      } else {
        console.error('Error fetching contractor:', error)
      }
    } catch (err) {
      console.error('Exception fetching contractor:', err)
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
