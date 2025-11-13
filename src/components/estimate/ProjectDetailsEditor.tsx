'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X } from 'lucide-react'

interface ContractorTemplate {
  floor_types: any[]
  floor_sizes: any[]
  finish_types: any[]
  stain_types: any[]
}

interface ProjectDetails {
  floor_type: string
  floor_size: string
  finish_type: string
  stain_type: string | null
}

interface Props {
  projectDetails: ProjectDetails
  onSave: (details: ProjectDetails) => Promise<void>
  getFloorTypeLabel: (key: string) => string
  getFloorSizeLabel: (key: string) => string
  getFinishTypeLabel: (key: string) => string
  getStainTypeLabel: (key: string | null) => string
}

export default function ProjectDetailsEditor({
  projectDetails,
  onSave,
  getFloorTypeLabel,
  getFloorSizeLabel,
  getFinishTypeLabel,
  getStainTypeLabel
}: Props) {
  const [editing, setEditing] = useState(false)
  const [template, setTemplate] = useState<ContractorTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editedDetails, setEditedDetails] = useState<ProjectDetails>(projectDetails)

  useEffect(() => {
    loadTemplate()
  }, [])

  const loadTemplate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/contractor-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
      }
    } catch (error) {
      console.error('Error loading template:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditedDetails(projectDetails)
    setEditing(true)
  }

  const handleCancel = () => {
    setEditedDetails(projectDetails)
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(editedDetails)
      setEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="border-b border-slate-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Project Specifications</h3>
          <Button
            onClick={handleEdit}
            size="sm"
            variant="outline"
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2">Floor Type</p>
            <p className="font-semibold text-slate-900">{getFloorTypeLabel(projectDetails.floor_type)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2">Size</p>
            <p className="font-semibold text-slate-900">{getFloorSizeLabel(projectDetails.floor_size)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2">Finish</p>
            <p className="font-semibold text-slate-900">{getFinishTypeLabel(projectDetails.finish_type)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2">Stain</p>
            <p className="font-semibold text-slate-900">{getStainTypeLabel(projectDetails.stain_type)}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !template) {
    return (
      <div className="border-b border-slate-200 p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-sm text-slate-500 mt-2">Loading options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-slate-200 p-8 bg-amber-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Edit Project Specifications</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            size="sm"
            variant="outline"
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Floor Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Floor Type
          </label>
          <select
            value={editedDetails.floor_type}
            onChange={(e) => setEditedDetails({ ...editedDetails, floor_type: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            {template.floor_types.map((floor: any) => (
              <option key={floor.key} value={floor.key}>
                {floor.image} {floor.name} - ${floor.basePrice.toFixed(2)}/sq ft
              </option>
            ))}
          </select>
        </div>

        {/* Floor Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Floor Size
          </label>
          <select
            value={editedDetails.floor_size}
            onChange={(e) => setEditedDetails({ ...editedDetails, floor_size: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            {template.floor_sizes.map((size: any) => (
              <option key={size.key} value={size.key}>
                {size.name} ({size.multiplier}x)
              </option>
            ))}
          </select>
        </div>

        {/* Finish Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Finish Type
          </label>
          <select
            value={editedDetails.finish_type}
            onChange={(e) => setEditedDetails({ ...editedDetails, finish_type: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            {template.finish_types.map((finish: any) => (
              <option key={finish.key} value={finish.key}>
                {finish.name} (+${finish.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Stain Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Stain Color {editedDetails.finish_type === 'stain' ? '' : '(Optional)'}
          </label>
          <select
            value={editedDetails.stain_type || ''}
            onChange={(e) => setEditedDetails({ ...editedDetails, stain_type: e.target.value || null })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">None</option>
            {template.stain_types.map((stain: any) => (
              <option key={stain.key} value={stain.key}>
                {stain.name} {stain.price > 0 ? `(+$${stain.price.toFixed(2)})` : '(Included)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Auto-pricing enabled:</strong> The estimated cost will be automatically recalculated based on your new selections when you save.
        </p>
      </div>
    </div>
  )
}
