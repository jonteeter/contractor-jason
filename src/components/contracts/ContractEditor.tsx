'use client'

import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'

interface ContractEditorProps {
  introMessage: string
  workDescription: string
  estimatedDays: string
  startDate: string
  completionDate: string
  onIntroChange: (value: string) => void
  onWorkDescriptionChange: (value: string) => void
  onEstimatedDaysChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onCompletionDateChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}

export default function ContractEditor({
  introMessage,
  workDescription,
  estimatedDays,
  startDate,
  completionDate,
  onIntroChange,
  onWorkDescriptionChange,
  onEstimatedDaysChange,
  onStartDateChange,
  onCompletionDateChange,
  onSave,
  onCancel,
  saving
}: ContractEditorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Edit Contract Details</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Intro Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Introductory Message
          </label>
          <p className="text-xs text-slate-500 mb-2">
            This appears before the contract as a friendly introduction
          </p>
          <textarea
            value={introMessage}
            onChange={(e) => onIntroChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            placeholder="Thank you for choosing..."
          />
        </div>

        {/* Work Description (Exhibit A) */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Work Description (Exhibit A)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Detailed scope of work - this is the heart of the contract
          </p>
          <textarea
            value={workDescription}
            onChange={(e) => onWorkDescriptionChange(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
            placeholder="Install 5&quot; hickory floor provided by client using glue down application with staple assist. Client to provide glue and hickory floor including flush mount vents.&#10;Install Hickory stair treads and risers. Client to provide all materials.&#10;Sand, stain, and finish all installed 5&quot; hickory floors and stairs throughout home where they exist using 6 step sanding method, and:&#10;Apply 3 coats of commercial water based finish Berger-Seidle green star and sheen of customers choice.&#10;All finish, staples, nails, sandpaper, and labor will be provided by the contractor.&#10;Contractor to remove all flooring project debris and dispose of off site."
          />
          <p className="text-xs text-slate-500 mt-2">
            Be specific: materials, methods, who provides what, number of coats, etc.
          </p>
        </div>

        {/* Timeline Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Estimated Completion (Business Days)
            </label>
            <input
              type="number"
              value={estimatedDays}
              onChange={(e) => onEstimatedDaysChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="7"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Completion Date
            </label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => onCompletionDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Tip:</strong> Fill out all fields to avoid blank spaces in the final contract.
            The work description should be detailed enough that both you and the customer are clear on what's included.
          </p>
        </div>
      </div>
    </div>
  )
}
