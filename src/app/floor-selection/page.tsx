'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Palette,
  Ruler,
  Sparkles,
  DollarSign,
  Info,
  Loader2
} from 'lucide-react'
import type { ContractorTemplate } from '@/lib/templates/defaultHardwoodTemplate'

type FloorType = string | null
type FloorSize = string | null
type FinishType = string | null
type StainType = string | null

interface FloorSelection {
  type: FloorType
  size: FloorSize
  finish: FinishType
  stain: StainType
}

interface PricingData {
  basePrice: number
  sizeMultiplier: number
  finishPrice: number
  stainPrice: number
  totalPerSqFt: number
}

export default function FloorSelectionPage() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [template, setTemplate] = useState<ContractorTemplate | null>(null)
  const [selection, setSelection] = useState<FloorSelection>({
    type: null,
    size: null,
    finish: null,
    stain: null
  })
  const [pricing, setPricing] = useState<PricingData>({
    basePrice: 0,
    sizeMultiplier: 1,
    finishPrice: 0,
    stainPrice: 0,
    totalPerSqFt: 0
  })

  const totalSteps = 4

  // Load project ID and template from API
  useEffect(() => {
    const init = async () => {
      const storedProjectId = localStorage.getItem('currentProjectId')
      if (storedProjectId) {
        setProjectId(storedProjectId)
      } else {
        setError('No project found. Please start from customer wizard.')
        setLoading(false)
        return
      }

      // Fetch contractor's template
      try {
        const response = await fetch('/api/contractor-templates')
        if (!response.ok) {
          throw new Error('Failed to load template')
        }
        const templateData = await response.json()
        setTemplate(templateData)
      } catch (err) {
        console.error('Error loading template:', err)
        setError('Failed to load floor options. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Calculate pricing whenever selection changes
  useEffect(() => {
    if (selection.type && template) {
      const floorType = template.floor_types.find(ft => ft.key === selection.type)
      const floorSize = template.floor_sizes.find(fs => fs.key === selection.size)
      const finishType = template.finish_types.find(ft => ft.key === selection.finish)
      const stainType = template.stain_types.find(st => st.key === selection.stain)

      const basePrice = floorType?.basePrice || 0
      const sizeMultiplier = floorSize?.multiplier || 1
      const finishPrice = finishType?.price || 0
      const stainPrice = stainType?.price || 0

      const totalPerSqFt = (basePrice * sizeMultiplier) + finishPrice + stainPrice

      setPricing({
        basePrice,
        sizeMultiplier,
        finishPrice,
        stainPrice,
        totalPerSqFt
      })
    }
  }, [selection, template])

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save floor selection to database
      await saveFloorSelection()
    }
  }

  const saveFloorSelection = async () => {
    if (!projectId) {
      setError('No project ID found')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Keys are already in the correct format (matching database enums)
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          floor_type: selection.type,
          floor_size: selection.size,
          finish_type: selection.finish,
          stain_type: selection.stain,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save floor selection')
      }

      // Navigate to measurements
      window.location.href = '/measurements'
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
      window.location.href = '/customer-wizard'
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selection.type !== null
      case 2:
        return selection.size !== null
      case 3:
        return selection.finish !== null
      case 4:
        return selection.finish !== 'stain' || selection.stain !== null
      default:
        return false
    }
  }

  const renderStep = () => {
    if (!template) return null

    switch (step) {
      case 1:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Choose Your Flooring Type
              </h2>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Select the perfect flooring material for your project
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {template.floor_types.map((floor) => (
                <button
                  key={floor.key}
                  onClick={() => setSelection({ ...selection, type: floor.key })}
                  className={`group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                    selection.type === floor.key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{floor.image}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{floor.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {floor.description}
                    </p>
                    <div className="text-2xl font-bold text-amber-600">
                      ${floor.basePrice.toFixed(2)}/sq ft
                    </div>
                  </div>

                  <div className="space-y-2">
                    {floor.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {selection.type === floor.key && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Select Plank Width
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Choose the width that best fits your design vision
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {template.floor_sizes.map((size) => (
                <button
                  key={size.key}
                  onClick={() => setSelection({ ...selection, size: size.key })}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.size === size.key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mx-auto mb-4 w-16 h-16 flex items-center justify-center transition-colors duration-200 ${
                    selection.size === size.key
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Ruler className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{size.name}</h3>
                  <p className="text-slate-600 mb-4">{size.description}</p>

                  <div className="text-sm text-amber-600 font-medium">
                    {size.multiplier > 1 ? `+${((size.multiplier - 1) * 100).toFixed(0)}% premium` : 'Standard pricing'}
                  </div>

                  {selection.size === size.key && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Choose Your Finish
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Select the protective finish and appearance style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {template.finish_types.map((finish) => (
                <button
                  key={finish.key}
                  onClick={() => setSelection({ ...selection, finish: finish.key, stain: finish.key === 'stain' ? selection.stain : null })}
                  className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.finish === finish.key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mx-auto mb-4 w-16 h-16 flex items-center justify-center transition-colors duration-200 ${
                    selection.finish === finish.key
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Palette className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{finish.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{finish.description}</p>

                  <div className="text-sm font-medium text-amber-600">
                    +${finish.price.toFixed(2)}/sq ft
                  </div>

                  {selection.finish === finish.key && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        if (selection.finish !== 'stain') {
          // Skip stain selection if not stain finish
          handleNext()
          return null
        }

        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Select Stain Color
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Choose the perfect stain color to complement your space
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {template.stain_types.map((stain) => (
                <button
                  key={stain.key}
                  onClick={() => setSelection({ ...selection, stain: stain.key })}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.stain === stain.key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    style={{ backgroundColor: stain.color }}
                  />

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{stain.name}</h3>
                  <p className="text-slate-600 mb-4">{stain.description}</p>

                  <div className="text-sm font-medium text-amber-600">
                    {stain.price > 0 ? `+$${stain.price.toFixed(2)}/sq ft` : 'No additional cost'}
                  </div>

                  {selection.stain === stain.key && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </button>
              ))}
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
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Floor Selection</h1>
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

      {/* Pricing Summary - Fixed at top when selections are made */}
      {selection.type && template && (
        <div className="bg-amber-50 border-b border-amber-200 sticky top-[57px] sm:top-[65px] z-40 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    {selection.type && template.floor_types.find(ft => ft.key === selection.type)?.name}
                    {selection.size && <span className="hidden sm:inline"> • {template.floor_sizes.find(fs => fs.key === selection.size)?.name}</span>}
                    {selection.finish && <span className="hidden md:inline"> • {template.finish_types.find(ft => ft.key === selection.finish)?.name}</span>}
                    {selection.stain && <span className="hidden lg:inline"> • {template.stain_types.find(st => st.key === selection.stain)?.name}</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-sm sm:text-lg font-bold text-amber-700 whitespace-nowrap">
                  ${pricing.totalPerSqFt.toFixed(2)}/sq ft
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 safe-area-bottom">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading floor options...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {renderStep()}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 sm:mt-16 max-w-4xl mx-auto gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="touch-target px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-slate-600 border-slate-300 hover:bg-slate-50 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
            Step {step} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="touch-target px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
          >
            <span className="hidden sm:inline">{step === totalSteps ? 'Continue to Measurements' : 'Next'}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-4 h-4 sm:ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}
