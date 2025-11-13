'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  customer_type: 'new' | 'existing'
  created_at: string
}

interface Project {
  id: string
  project_name: string
  status: string
  estimated_cost: number
  total_square_feet: number
  created_at: string
  room_1_name?: string | null
  room_1_length?: number | null
  room_1_width?: number | null
  room_2_name?: string | null
  room_2_length?: number | null
  room_2_width?: number | null
  room_3_name?: string | null
  room_3_length?: number | null
  room_3_width?: number | null
}

export default function CustomersPage() {
  const { user, contractor, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'new' | 'existing'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerProjects, setCustomerProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadCustomers()
    }
  }, [user])

  useEffect(() => {
    filterCustomersList()
  }, [customers, searchTerm, filterType])

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()

      if (response.ok && data.customers) {
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const filterCustomersList = () => {
    let filtered = customers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    // Filter by customer type
    if (filterType !== 'all') {
      filtered = filtered.filter(customer => customer.customer_type === filterType)
    }

    setFilteredCustomers(filtered)
  }

  const loadCustomerProjects = async (customerId: string) => {
    setIsLoadingProjects(true)
    try {
      const response = await fetch(`/api/customers/${customerId}/projects`)
      const data = await response.json()

      if (response.ok && data.projects) {
        setCustomerProjects(data.projects)
      }
    } catch (error) {
      console.error('Error loading customer projects:', error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    loadCustomerProjects(customer.id)
  }

  const handleEditClick = (customer: Customer) => {
    setEditFormData(customer)
    setShowEditModal(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveEdit = async () => {
    if (!editFormData.id) return

    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/customers/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Customer updated successfully!' })
        setShowEditModal(false)
        loadCustomers()
        if (selectedCustomer && selectedCustomer.id === editFormData.id) {
          setSelectedCustomer(data.customer)
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update customer' })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = async (customerId: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete ${customerName}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Customer deleted successfully!' })
        loadCustomers()
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(null)
        }
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to delete customer' })
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    }
  }

  // Get array of rooms with their details
  const getProjectRooms = (project: Project) => {
    const rooms = []
    if (project.room_1_length && project.room_1_width) {
      rooms.push({
        name: project.room_1_name || 'Room 1',
        length: project.room_1_length,
        width: project.room_1_width,
        sqft: project.room_1_length * project.room_1_width
      })
    }
    if (project.room_2_length && project.room_2_width) {
      rooms.push({
        name: project.room_2_name || 'Room 2',
        length: project.room_2_length,
        width: project.room_2_width,
        sqft: project.room_2_length * project.room_2_width
      })
    }
    if (project.room_3_length && project.room_3_width) {
      rooms.push({
        name: project.room_3_name || 'Room 3',
        length: project.room_3_length,
        width: project.room_3_width,
        sqft: project.room_3_length * project.room_3_width
      })
    }
    return rooms
  }

  if (loading || isLoadingCustomers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading customers...</p>
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
                Customers
              </h1>
            </div>
            <Link href="/customer-wizard">
              <Button className="touch-target bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 active:scale-95 transition-transform">
                <span className="hidden sm:inline">New Customer</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mobile-container py-6 sm:py-8 safe-area-bottom">
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

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterType('all')}
                variant={filterType === 'all' ? 'default' : 'outline'}
                className={`touch-target ${filterType === 'all' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
              >
                All ({customers.length})
              </Button>
              <Button
                onClick={() => setFilterType('new')}
                variant={filterType === 'new' ? 'default' : 'outline'}
                className={`touch-target ${filterType === 'new' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
              >
                New ({customers.filter(c => c.customer_type === 'new').length})
              </Button>
              <Button
                onClick={() => setFilterType('existing')}
                variant={filterType === 'existing' ? 'default' : 'outline'}
                className={`touch-target ${filterType === 'existing' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
              >
                Existing ({customers.filter(c => c.customer_type === 'existing').length})
              </Button>
            </div>
          </div>
        </div>

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No customers found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Get started by adding your first customer'}
            </p>
            <Link href="/customer-wizard">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Add Your First Customer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                className="bg-white rounded-xl shadow p-5 sm:p-6 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-2 border-transparent hover:border-amber-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-amber-600">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 truncate">{customer.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{customer.customer_type}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{customer.city}, {customer.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-amber-600">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{selectedCustomer.name}</h2>
                  <p className="text-sm text-slate-500 capitalize">{selectedCustomer.customer_type} Customer</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="touch-target p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-600">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-slate-600">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="text-slate-600">
                      <div>{selectedCustomer.address}</div>
                      <div>{selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zip_code}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Projects ({customerProjects.length})</h3>
                {isLoadingProjects ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  </div>
                ) : customerProjects.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">No projects yet</p>
                ) : (
                  <div className="space-y-3">
                    {customerProjects.map((project) => {
                      const rooms = getProjectRooms(project)
                      return (
                        <Link key={project.id} href={`/estimate?projectId=${project.id}`}>
                          <div className="p-4 border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-900">{project.project_name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'quoted' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {project.status.replace('_', ' ')}
                              </span>
                            </div>

                            {/* Room Breakdown */}
                            {rooms.length > 0 && (
                              <div className="mb-3 p-2 bg-slate-50 rounded-md space-y-1">
                                {rooms.map((room, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="font-medium">{room.name}</span>
                                    <span>{room.length}' × {room.width}' = {room.sqft.toFixed(0)} sq ft</span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between text-xs font-semibold text-amber-700 pt-1 border-t border-slate-200">
                                  <span>Total</span>
                                  <span>{project.total_square_feet.toFixed(0)} sq ft</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span className="font-semibold text-slate-900">${project.estimated_cost.toLocaleString()}</span>
                              <span>{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handleEditClick(selectedCustomer)}
                  variant="outline"
                  className="touch-target flex-1"
                >
                  Edit Customer
                </Button>
                <Button
                  onClick={() => handleDeleteClick(selectedCustomer.id, selectedCustomer.name)}
                  variant="outline"
                  className="touch-target flex-1 text-red-600 hover:bg-red-50 border-red-200"
                >
                  Delete Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Edit Customer</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="touch-target p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type *</label>
                  <select
                    name="customer_type"
                    value={editFormData.customer_type || 'new'}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  >
                    <option value="new">New</option>
                    <option value="existing">Existing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address || ''}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP *</label>
                  <input
                    type="text"
                    name="zip_code"
                    value={editFormData.zip_code || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  disabled={isSaving}
                  className="touch-target flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="touch-target flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
