'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle,
  Sparkles
} from 'lucide-react'

type CustomerType = 'new' | 'existing' | null
type ProjectType = 'new-installation' | 'refinishing' | null

interface CustomerData {
  type: CustomerType
  projectType: ProjectType
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  company?: string
}

export default function CustomerWizardPage() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [customerData, setCustomerData] = useState<CustomerData>({
    type: null,
    projectType: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: ''
  })

  const totalSteps = 3

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save customer and project to database
      await saveCustomerAndProject()
    }
  }

  const saveCustomerAndProject = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zip_code: customerData.zipCode,
          customer_type: customerData.type,
          project_type: customerData.projectType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save customer')
      }

      // Store project ID in localStorage for next steps
      localStorage.setItem('currentProjectId', result.project.id)
      localStorage.setItem('currentCustomerId', result.customer.id)

      // Navigate to floor selection
      window.location.href = '/floor-selection'
    } catch (err) {
      console.error('Save error:', err)
      setError((err as Error).message)
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      window.location.href = '/'
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return customerData.type !== null
      case 2:
        return customerData.projectType !== null
      case 3:
        return customerData.name && customerData.email && customerData.phone && customerData.address && customerData.city && customerData.state && customerData.zipCode
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Welcome to Your Project
              </h2>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Let's start by understanding your customer type to provide the most accurate estimate
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setCustomerData({ ...customerData, type: 'new' })}
                className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                  customerData.type === 'new'
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 ${
                    customerData.type === 'new'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <User className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">New Customer</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      First-time client requiring complete contact information and project details
                    </p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600 font-medium space-y-1">
                      <div>• Full contact form</div>
                      <div>• Project consultation</div>
                      <div>• Detailed estimate</div>
                    </div>
                  </div>
                </div>
                {customerData.type === 'new' && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setCustomerData({ ...customerData, type: 'existing' })}
                className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                  customerData.type === 'existing'
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 ${
                    customerData.type === 'existing'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Existing Customer</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Returning client with previous project history and saved preferences
                    </p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600 font-medium space-y-1">
                      <div>• Quick project setup</div>
                      <div>• Saved preferences</div>
                      <div>• Priority scheduling</div>
                    </div>
                  </div>
                </div>
                {customerData.type === 'existing' && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Project Type
              </h2>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
                What type of flooring project are you planning?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setCustomerData({ ...customerData, projectType: 'new-installation' })}
                className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                  customerData.projectType === 'new-installation'
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 ${
                    customerData.projectType === 'new-installation'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">New Installation</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Complete flooring installation with material selection and professional installation
                    </p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600 font-medium space-y-1">
                      <div>• Material selection</div>
                      <div>• Professional installation</div>
                      <div>• Full warranty coverage</div>
                    </div>
                  </div>
                </div>
                {customerData.projectType === 'new-installation' && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setCustomerData({ ...customerData, projectType: 'refinishing' })}
                className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                  customerData.projectType === 'refinishing'
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 ${
                    customerData.projectType === 'refinishing'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Building className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Refinishing</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Restore existing hardwood floors with sanding, staining, and protective coating
                    </p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600 font-medium space-y-1">
                      <div>• Professional sanding</div>
                      <div>• Stain selection</div>
                      <div>• Protective finish</div>
                    </div>
                  </div>
                </div>
                {customerData.projectType === 'refinishing' && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Contact Information
              </h2>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Please provide your contact details for the estimate and project coordination
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full pl-9 sm:pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base touch-target"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Company (Optional)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={customerData.company}
                      onChange={(e) => setCustomerData({ ...customerData, company: e.target.value })}
                      className="w-full pl-9 sm:pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base touch-target"
                      placeholder="ABC Construction"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Street Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="col-span-2 sm:col-span-1 space-y-2">
                  <label className="text-sm font-medium text-slate-700">City *</label>
                  <input
                    type="text"
                    value={customerData.city}
                    onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base touch-target"
                    placeholder="Anytown"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">State *</label>
                  <input
                    type="text"
                    value={customerData.state}
                    onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base touch-target uppercase"
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ZIP Code *</label>
                  <input
                    type="text"
                    value={customerData.zipCode}
                    onChange={(e) => setCustomerData({ ...customerData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base touch-target"
                    placeholder="12345"
                    maxLength={10}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 safe-area-top flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={handleBack}
                className="touch-target p-2 hover:bg-slate-100 active:scale-95 rounded-lg transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Customer Setup</h1>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    i + 1 <= step ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 safe-area-bottom">
        <div className="animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 sm:mt-16 max-w-4xl mx-auto gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="touch-target px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-slate-600 border-slate-300 hover:bg-slate-50 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{step === 1 ? 'Home' : 'Back'}</span>
          </Button>

          <div className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
            Step {step} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || saving}
            className="touch-target px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
          >
            <span className="hidden sm:inline">{saving ? 'Saving...' : step === totalSteps ? 'Continue to Floor Selection' : 'Next'}</span>
            <span className="sm:hidden">{saving ? 'Saving...' : 'Next'}</span>
            {!saving && <ArrowRight className="w-4 h-4 sm:ml-2" />}
          </Button>
        </div>
      </main>
    </div>
  )
}
