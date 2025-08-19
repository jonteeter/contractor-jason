'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Download,
  Mail,
  Share2,
  CheckCircle,
  DollarSign,
  Calculator,
  Home,
  TrendingUp,
  FileText,
  Calendar,
  User,
  Phone,
  MapPin,
  Palette,
  Ruler,
  Clock,
  Shield
} from 'lucide-react'

// Mock data - in real app this would come from previous steps
const mockEstimateData = {
  customer: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street\nAnytown, ST 12345',
    company: 'ABC Construction'
  },
  project: {
    type: 'New Installation',
    floorType: 'Red Oak',
    floorSize: '2.5"',
    finish: 'Semi-Gloss',
    stain: 'Golden Oak'
  },
  measurements: {
    rooms: [
      { name: 'Room 1', dimensions: '12.5\' × 10.0\'', sqft: 125.0 },
      { name: 'Room 2', dimensions: '15.0\' × 12.0\'', sqft: 180.0 }
    ],
    stairs: { treads: 12, risers: 13, sqft: 55.5 },
    totalSqft: 360.5
  },
  pricing: {
    materialCost: 3065.25,
    laborCost: 1802.50,
    finishCost: 541.75,
    subtotal: 5409.50,
    tax: 432.76,
    total: 5842.26
  },
  timeline: {
    startDate: '2025-02-15',
    completionDate: '2025-02-22',
    duration: '5-7 business days'
  }
}

export default function EstimatePage() {
  const [activeTab, setActiveTab] = useState<'estimate' | 'contract'>('estimate')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSendEmail = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleDownloadPDF = () => {
    // In real app, this would generate and download a PDF
    console.log('Downloading PDF estimate...')
  }

  const handleGenerateContract = () => {
    setActiveTab('contract')
  }

  const handleBack = () => {
    window.location.href = '/measurements'
  }

  const renderEstimate = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Estimate</h1>
          <p className="text-lg text-slate-600">Professional flooring installation estimate</p>
          <div className="mt-4 text-sm text-slate-500">
            Estimate #EST-2025-001 • Generated {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <User className="w-6 h-6 text-amber-600 mr-3" />
            Customer Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <div className="font-medium text-slate-900">{mockEstimateData.customer.name}</div>
                {mockEstimateData.customer.company && (
                  <div className="text-sm text-slate-600">{mockEstimateData.customer.company}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{mockEstimateData.customer.phone}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{mockEstimateData.customer.email}</span>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-1" />
              <div className="text-slate-700 whitespace-pre-line">{mockEstimateData.customer.address}</div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Palette className="w-6 h-6 text-amber-600 mr-3" />
            Project Specifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Project Type:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.project.type}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Floor Type:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.project.floorType}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Plank Size:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.project.floorSize}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Finish:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.project.finish}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Stain Color:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.project.stain}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Measurements Summary */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <Ruler className="w-6 h-6 text-amber-600 mr-3" />
          Area Measurements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center">
              <Home className="w-5 h-5 text-slate-600 mr-2" />
              Rooms
            </h3>
            <div className="space-y-3">
              {mockEstimateData.measurements.rooms.map((room, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                  <div>
                    <span className="font-medium text-slate-900">{room.name}</span>
                    <span className="text-slate-500 ml-2">({room.dimensions})</span>
                  </div>
                  <span className="font-medium text-slate-900">{room.sqft.toFixed(1)} sq ft</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-slate-600 mr-2" />
              Staircase
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium text-slate-900">Treads & Risers</span>
                  <span className="text-slate-500 ml-2">({mockEstimateData.measurements.stairs.treads} treads, {mockEstimateData.measurements.stairs.risers} risers)</span>
                </div>
                <span className="font-medium text-slate-900">{mockEstimateData.measurements.stairs.sqft.toFixed(1)} sq ft</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t-2 border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900">Total Project Area</span>
            <span className="text-2xl font-bold text-amber-600">{mockEstimateData.measurements.totalSqft.toFixed(1)} sq ft</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <Calculator className="w-6 h-6 text-amber-600 mr-3" />
          Cost Breakdown
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-700">Materials & Flooring</span>
            <span className="font-medium text-slate-900">${mockEstimateData.pricing.materialCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-700">Labor & Installation</span>
            <span className="font-medium text-slate-900">${mockEstimateData.pricing.laborCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-700">Finish & Staining</span>
            <span className="font-medium text-slate-900">${mockEstimateData.pricing.finishCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <span className="font-medium text-slate-900">Subtotal</span>
            <span className="font-medium text-slate-900">${mockEstimateData.pricing.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <span className="text-slate-700">Tax (8%)</span>
            <span className="font-medium text-slate-900">${mockEstimateData.pricing.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center py-4 bg-amber-50 rounded-xl px-4 border-2 border-amber-200">
            <span className="text-xl font-bold text-slate-900">Total Project Cost</span>
            <span className="text-2xl font-bold text-amber-700">${mockEstimateData.pricing.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Timeline & Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 text-amber-600 mr-3" />
            Project Timeline
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Estimated Start:</span>
              <span className="font-medium text-slate-900">{new Date(mockEstimateData.timeline.startDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Estimated Completion:</span>
              <span className="font-medium text-slate-900">{new Date(mockEstimateData.timeline.completionDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium text-slate-900">{mockEstimateData.timeline.duration}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-amber-600 mr-3" />
            Warranty & Terms
          </h2>
          
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>5-year warranty on installation</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Manufacturer warranty on materials</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>50% deposit required to start</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Final payment due upon completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContract = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-3xl border-2 border-green-200 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Service Contract</h1>
          <p className="text-lg text-slate-600">Ready for signature and project commencement</p>
          <div className="mt-4 text-sm text-slate-500">
            Contract #CON-2025-001 • Generated {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Flooring Installation Contract</h2>
          
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <p>
              This contract is entered into between <strong>Tomahawk Wooden Floors</strong> ("Contractor") 
              and <strong>{mockEstimateData.customer.name}</strong> ("Customer") for flooring installation 
              services at <strong>{mockEstimateData.customer.address.replace('\n', ', ')}</strong>.
            </p>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Scope of Work:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Installation of {mockEstimateData.project.floorType} flooring ({mockEstimateData.project.floorSize} planks)</li>
                <li>Application of {mockEstimateData.project.finish} finish with {mockEstimateData.project.stain} stain</li>
                <li>Coverage area: {mockEstimateData.measurements.totalSqft.toFixed(1)} square feet</li>
                <li>Staircase installation: {mockEstimateData.measurements.stairs.treads} treads and {mockEstimateData.measurements.stairs.risers} risers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Payment Terms:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Total contract amount: <strong>${mockEstimateData.pricing.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                <li>50% deposit required upon contract signing: <strong>${(mockEstimateData.pricing.total * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                <li>Remaining balance due upon project completion: <strong>${(mockEstimateData.pricing.total * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Timeline:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Project start date: {new Date(mockEstimateData.timeline.startDate).toLocaleDateString()}</li>
                <li>Estimated completion: {new Date(mockEstimateData.timeline.completionDate).toLocaleDateString()}</li>
                <li>Duration: {mockEstimateData.timeline.duration}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Warranty:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>5-year warranty on installation workmanship</li>
                <li>Manufacturer warranty applies to all materials</li>
                <li>Warranty covers defects in materials and workmanship under normal use</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Customer Signature:</h4>
                <div className="border-b-2 border-slate-300 pb-2 mb-2 h-12"></div>
                <div className="text-sm text-slate-600">
                  {mockEstimateData.customer.name}<br/>
                  Date: _______________
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Contractor Signature:</h4>
                <div className="border-b-2 border-slate-300 pb-2 mb-2 h-12"></div>
                <div className="text-sm text-slate-600">
                  Tomahawk Wooden Floors<br/>
                  Date: _______________
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

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
              <h1 className="text-xl font-bold text-slate-900">
                {activeTab === 'estimate' ? 'Project Estimate' : 'Service Contract'}
              </h1>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('estimate')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'estimate'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Estimate
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'contract'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contract
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Estimate sent successfully!</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-fade-in">
          {activeTab === 'estimate' ? renderEstimate() : renderContract()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-16">
          <Button
            onClick={handleDownloadPDF}
            className="touch-target px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>

          <Button
            onClick={handleSendEmail}
            className="touch-target px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email to Customer
          </Button>

          {activeTab === 'estimate' && (
            <Button
              onClick={handleGenerateContract}
              className="touch-target px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Contract
            </Button>
          )}

          <Button
            variant="outline"
            className="touch-target px-6 py-3 text-slate-600 border-slate-300 hover:bg-slate-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </main>
    </div>
  )
}
