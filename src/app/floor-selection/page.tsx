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
  Info
} from 'lucide-react'

type FloorType = 'red-oak' | 'white-oak' | 'linoleum' | null
type FloorSize = '2inch' | '2.5inch' | '3inch' | null
type FinishType = 'stain' | 'gloss' | 'semi-gloss' | 'option' | null
type StainType = 'natural' | 'golden-oak' | 'spice-brown' | null

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
  const [error, setError] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
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

  // Load project ID from localStorage on mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('currentProjectId')
    if (storedProjectId) {
      setProjectId(storedProjectId)
    } else {
      setError('No project found. Please start from customer wizard.')
    }
  }, [])

  // Floor type data with realistic pricing
  const floorTypes = {
    'red-oak': {
      name: 'Red Oak',
      description: 'Classic American hardwood with prominent grain patterns and warm tones',
      basePrice: 8.50,
      features: ['Durable & Long-lasting', 'Classic Grain Pattern', 'Warm Natural Tones', 'Easy to Refinish'],
      image: '🌳'
    },
    'white-oak': {
      name: 'White Oak',
      description: 'Premium hardwood with subtle grain and excellent durability',
      basePrice: 9.75,
      features: ['Premium Quality', 'Subtle Grain Pattern', 'Excellent Durability', 'Modern Appeal'],
      image: '🪵'
    },
    'linoleum': {
      name: 'Linoleum',
      description: 'Eco-friendly resilient flooring with modern designs and easy maintenance',
      basePrice: 4.25,
      features: ['Eco-Friendly', 'Water Resistant', 'Easy Maintenance', 'Comfortable Underfoot'],
      image: '📐'
    }
  }

  const floorSizes = {
    '2inch': { name: '2"', multiplier: 1.0, description: 'Traditional narrow planks' },
    '2.5inch': { name: '2.5"', multiplier: 1.15, description: 'Popular medium width' },
    '3inch': { name: '3"', multiplier: 1.25, description: 'Wide plank premium look' }
  }

  const finishTypes = {
    'stain': { name: 'Stain', price: 2.50, description: 'Custom color with protective coating' },
    'gloss': { name: 'Gloss', price: 1.75, description: 'High-shine protective finish' },
    'semi-gloss': { name: 'Semi-Gloss', price: 1.50, description: 'Balanced shine and durability' },
    'option': { name: 'Custom Option', price: 3.00, description: 'Specialized finish consultation' }
  }

  const stainTypes = {
    'natural': { name: 'Natural', price: 0, description: 'Original wood color', color: '#D2B48C' },
    'golden-oak': { name: 'Golden Oak', price: 0.75, description: 'Warm golden tones', color: '#DAA520' },
    'spice-brown': { name: 'Spice Brown', price: 0.75, description: 'Rich brown finish', color: '#8B4513' }
  }

  // Calculate pricing whenever selection changes
  useEffect(() => {
    if (selection.type) {
      const basePrice = floorTypes[selection.type].basePrice
      const sizeMultiplier = selection.size ? floorSizes[selection.size].multiplier : 1
      const finishPrice = selection.finish ? finishTypes[selection.finish].price : 0
      const stainPrice = selection.stain ? stainTypes[selection.stain].price : 0
      
      const totalPerSqFt = (basePrice * sizeMultiplier) + finishPrice + stainPrice

      setPricing({
        basePrice,
        sizeMultiplier,
        finishPrice,
        stainPrice,
        totalPerSqFt
      })
    }
  }, [selection])

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
      // Map frontend values to database enum values
      const floorTypeMap: Record<string, string> = {
        'red-oak': 'red_oak',
        'white-oak': 'white_oak',
        'linoleum': 'linoleum'
      }

      const floorSizeMap: Record<string, string> = {
        '2inch': '2_inch',
        '2.5inch': '2_5_inch',
        '3inch': '3_inch'
      }

      const finishTypeMap: Record<string, string> = {
        'stain': 'stain',
        'gloss': 'gloss',
        'semi-gloss': 'semi_gloss',
        'option': 'option'
      }

      const stainTypeMap: Record<string, string> = {
        'natural': 'natural',
        'golden-oak': 'golden_oak',
        'spice-brown': 'spice_brown'
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          floor_type: floorTypeMap[selection.type || ''],
          floor_size: floorSizeMap[selection.size || ''],
          finish_type: finishTypeMap[selection.finish || ''],
          stain_type: selection.stain ? stainTypeMap[selection.stain] : null,
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
              {Object.entries(floorTypes).map(([key, floor]) => (
                <button
                  key={key}
                  onClick={() => setSelection({ ...selection, type: key as FloorType })}
                  className={`group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-left touch-target active:scale-[0.98] ${
                    selection.type === key
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
                      ${floor.basePrice}/sq ft
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

                  {selection.type === key && (
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
              {Object.entries(floorSizes).map(([key, size]) => (
                <button
                  key={key}
                  onClick={() => setSelection({ ...selection, size: key as FloorSize })}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.size === key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mx-auto mb-4 w-16 h-16 flex items-center justify-center transition-colors duration-200 ${
                    selection.size === key
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

                  {selection.size === key && (
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
              {Object.entries(finishTypes).map(([key, finish]) => (
                <button
                  key={key}
                  onClick={() => setSelection({ ...selection, finish: key as FinishType, stain: key === 'stain' ? selection.stain : null })}
                  className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.finish === key
                      ? 'border-amber-500 bg-amber-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mx-auto mb-4 w-16 h-16 flex items-center justify-center transition-colors duration-200 ${
                    selection.finish === key
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                  }`}>
                    <Palette className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{finish.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{finish.description}</p>
                  
                  <div className="text-sm font-medium text-amber-600">
                    +${finish.price}/sq ft
                  </div>

                  {selection.finish === key && (
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
              {Object.entries(stainTypes).map(([key, stain]) => (
                <button
                  key={key}
                  onClick={() => setSelection({ ...selection, stain: key as StainType })}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-center ${
                    selection.stain === key
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
                    {stain.price > 0 ? `+$${stain.price}/sq ft` : 'No additional cost'}
                  </div>

                  {selection.stain === key && (
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
      {selection.type && (
        <div className="bg-amber-50 border-b border-amber-200 sticky top-[57px] sm:top-[65px] z-40 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    {selection.type && floorTypes[selection.type].name}
                    {selection.size && <span className="hidden sm:inline"> • {floorSizes[selection.size].name}</span>}
                    {selection.finish && <span className="hidden md:inline"> • {finishTypes[selection.finish].name}</span>}
                    {selection.stain && <span className="hidden lg:inline"> • {stainTypes[selection.stain].name}</span>}
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
