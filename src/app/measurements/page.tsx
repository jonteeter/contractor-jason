'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  ArrowRight,
  Calculator,
  Home,
  TrendingUp,
  Plus,
  Minus,
  Info,
  DollarSign,
  Ruler
} from 'lucide-react'

interface RoomMeasurement {
  id: number
  name: string
  length: string
  width: string
  sqft: number
}

interface StairMeasurement {
  treads: string
  risers: string
}

interface MeasurementData {
  rooms: RoomMeasurement[]
  stairs: StairMeasurement
  totalSqft: number
  estimatedCost: number
}

export default function MeasurementsPage() {
  const [step, setStep] = useState(1)
  const [measurements, setMeasurements] = useState<MeasurementData>({
    rooms: [
      { id: 1, name: 'Room 1', length: '', width: '', sqft: 0 }
    ],
    stairs: { treads: '', risers: '' },
    totalSqft: 0,
    estimatedCost: 0
  })

  const totalSteps = 3
  const pricePerSqFt = 12.50 // This would come from floor selection in real app

  // Calculate square footage for a room
  const calculateRoomSqft = (length: string, width: string): number => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    return l * w
  }

  // Calculate stair square footage (approximate)
  const calculateStairSqft = (treads: string, risers: string): number => {
    const t = parseInt(treads) || 0
    const r = parseInt(risers) || 0
    // Approximate: each tread is ~3 sq ft, each riser is ~1.5 sq ft
    return (t * 3) + (r * 1.5)
  }

  // Update room measurements
  const updateRoom = (id: number, field: 'length' | 'width', value: string) => {
    setMeasurements(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id === id) {
          const updated = { ...room, [field]: value }
          updated.sqft = calculateRoomSqft(updated.length, updated.width)
          return updated
        }
        return room
      })
    }))
  }

  // Add a new room
  const addRoom = () => {
    if (measurements.rooms.length < 3) {
      const newId = Math.max(...measurements.rooms.map(r => r.id)) + 1
      setMeasurements(prev => ({
        ...prev,
        rooms: [...prev.rooms, {
          id: newId,
          name: `Room ${newId}`,
          length: '',
          width: '',
          sqft: 0
        }]
      }))
    }
  }

  // Remove a room
  const removeRoom = (id: number) => {
    if (measurements.rooms.length > 1) {
      setMeasurements(prev => ({
        ...prev,
        rooms: prev.rooms.filter(room => room.id !== id)
      }))
    }
  }

  // Update stair measurements
  const updateStairs = (field: 'treads' | 'risers', value: string) => {
    setMeasurements(prev => ({
      ...prev,
      stairs: { ...prev.stairs, [field]: value }
    }))
  }

  // Calculate totals whenever measurements change
  useEffect(() => {
    const roomsSqft = measurements.rooms.reduce((total, room) => total + room.sqft, 0)
    const stairsSqft = calculateStairSqft(measurements.stairs.treads, measurements.stairs.risers)
    const totalSqft = roomsSqft + stairsSqft
    const estimatedCost = totalSqft * pricePerSqFt

    setMeasurements(prev => ({
      ...prev,
      totalSqft,
      estimatedCost
    }))
  }, [measurements.rooms, measurements.stairs])

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Navigate to estimate preview
      window.location.href = '/estimate'
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      window.location.href = '/floor-selection'
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return measurements.rooms.some(room => room.length && room.width)
      case 2:
        return measurements.stairs.treads && measurements.stairs.risers
      case 3:
        return measurements.totalSqft > 0
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Room Measurements
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Enter the length and width for each room that needs flooring
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {measurements.rooms.map((room, index) => (
                <div key={room.id} className="bg-white rounded-3xl border-2 border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-amber-100 rounded-2xl">
                        <Home className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                    </div>
                    
                    {measurements.rooms.length > 1 && (
                      <button
                        onClick={() => removeRoom(room.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Length (feet)</label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          value={room.length}
                          onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                          placeholder="12.5"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Width (feet)</label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          value={room.width}
                          onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                          placeholder="10.0"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Square Feet</label>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Calculator className="w-5 h-5 text-amber-600" />
                          <span className="text-lg font-bold text-amber-700">
                            {room.sqft.toFixed(1)} sq ft
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {measurements.rooms.length < 3 && (
                <button
                  onClick={addRoom}
                  className="w-full p-6 border-2 border-dashed border-slate-300 rounded-3xl hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-3 bg-slate-100 group-hover:bg-amber-100 rounded-2xl transition-colors">
                      <Plus className="w-6 h-6 text-slate-600 group-hover:text-amber-600" />
                    </div>
                    <span className="text-lg font-medium text-slate-600 group-hover:text-amber-600">
                      Add Another Room
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Stair Measurements
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Enter the number of treads and risers for your staircase
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-amber-100 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Staircase Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Number of Treads</label>
                    <input
                      type="number"
                      value={measurements.stairs.treads}
                      onChange={(e) => updateStairs('treads', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      placeholder="12"
                      min="0"
                    />
                    <p className="text-xs text-slate-500">Horizontal steps you walk on</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Number of Risers</label>
                    <input
                      type="number"
                      value={measurements.stairs.risers}
                      onChange={(e) => updateStairs('risers', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      placeholder="13"
                      min="0"
                    />
                    <p className="text-xs text-slate-500">Vertical faces between steps</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Measurement Tips:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Treads are the horizontal surfaces you step on</li>
                        <li>• Risers are the vertical faces between each step</li>
                        <li>• Typically there's one more riser than treads</li>
                        <li>• Estimated coverage: ~{calculateStairSqft(measurements.stairs.treads, measurements.stairs.risers).toFixed(1)} sq ft</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Measurement Summary
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Review your measurements and estimated project cost
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Room Summary */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Home className="w-6 h-6 text-amber-600 mr-3" />
                  Room Summary
                </h3>
                
                <div className="space-y-4">
                  {measurements.rooms.map((room) => (
                    <div key={room.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
                      <div>
                        <span className="font-medium text-slate-900">{room.name}</span>
                        <span className="text-slate-500 ml-2">({room.length}' × {room.width}')</span>
                      </div>
                      <span className="font-bold text-slate-900">{room.sqft.toFixed(1)} sq ft</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
                    <span className="font-bold text-slate-900">Rooms Total</span>
                    <span className="font-bold text-amber-600">
                      {measurements.rooms.reduce((total, room) => total + room.sqft, 0).toFixed(1)} sq ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Stairs Summary */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 text-amber-600 mr-3" />
                  Staircase Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="font-medium text-slate-900">Treads & Risers</span>
                      <span className="text-slate-500 ml-2">({measurements.stairs.treads} treads, {measurements.stairs.risers} risers)</span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {calculateStairSqft(measurements.stairs.treads, measurements.stairs.risers).toFixed(1)} sq ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Cost Estimate */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200 p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-amber-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Project Estimate</h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="text-lg text-slate-600">
                      Total Area: <span className="font-bold text-slate-900">{measurements.totalSqft.toFixed(1)} sq ft</span>
                    </div>
                    <div className="text-lg text-slate-600">
                      Rate: <span className="font-bold text-slate-900">${pricePerSqFt}/sq ft</span>
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-amber-700 mb-2">
                    ${measurements.estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  
                  <p className="text-sm text-slate-600">
                    *Estimate includes materials and installation. Final pricing may vary based on site conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Project Measurements</h1>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i + 1 <= step ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Running Total - Fixed at top when measurements exist */}
      {measurements.totalSqft > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-slate-700">
                    Total Area: {measurements.totalSqft.toFixed(1)} sq ft
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span className="text-lg font-bold text-amber-700">
                  ${measurements.estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            className="touch-target px-6 py-3 text-slate-600 border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-slate-500">
            Step {step} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="touch-target px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? 'Generate Estimate' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}
