'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ContractorTemplate {
  id: string
  floor_types: any[]
  floor_sizes: any[]
  finish_types: any[]
  stain_types: any[]
  template_name: string
}

interface Props {
  template: ContractorTemplate
  onSave: (template: ContractorTemplate) => Promise<void>
  isSaving: boolean
}

export default function ProductCatalogEditor({ template, onSave, isSaving }: Props) {
  const [editingCatalog, setEditingCatalog] = useState(false)
  const [editedTemplate, setEditedTemplate] = useState<ContractorTemplate | null>(null)

  const handleEditCatalog = () => {
    setEditedTemplate(JSON.parse(JSON.stringify(template)))
    setEditingCatalog(true)
  }

  const handleCancelEdit = () => {
    setEditedTemplate(null)
    setEditingCatalog(false)
  }

  const handleSaveCatalog = async () => {
    if (!editedTemplate) return
    await onSave(editedTemplate)
    setEditingCatalog(false)
    setEditedTemplate(null)
  }

  const updateFloorType = (index: number, field: string, value: any) => {
    if (!editedTemplate) return
    const updated = [...editedTemplate.floor_types]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTemplate({ ...editedTemplate, floor_types: updated })
  }

  const updateFloorSize = (index: number, field: string, value: any) => {
    if (!editedTemplate) return
    const updated = [...editedTemplate.floor_sizes]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTemplate({ ...editedTemplate, floor_sizes: updated })
  }

  const updateFinishType = (index: number, field: string, value: any) => {
    if (!editedTemplate) return
    const updated = [...editedTemplate.finish_types]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTemplate({ ...editedTemplate, finish_types: updated })
  }

  const updateStainType = (index: number, field: string, value: any) => {
    if (!editedTemplate) return
    const updated = [...editedTemplate.stain_types]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTemplate({ ...editedTemplate, stain_types: updated })
  }

  const removeItem = (type: 'floor_types' | 'floor_sizes' | 'finish_types' | 'stain_types', index: number) => {
    if (!editedTemplate) return
    const updated = editedTemplate[type].filter((_: any, i: number) => i !== index)
    setEditedTemplate({ ...editedTemplate, [type]: updated })
  }

  const addFloorType = () => {
    if (!editedTemplate) return
    setEditedTemplate({
      ...editedTemplate,
      floor_types: [...editedTemplate.floor_types, {
        key: `floor_${Date.now()}`,
        name: 'New Floor Type',
        description: 'Description',
        basePrice: 10.00,
        features: ['Feature 1', 'Feature 2'],
        image: '📦'
      }]
    })
  }

  const addFloorSize = () => {
    if (!editedTemplate) return
    setEditedTemplate({
      ...editedTemplate,
      floor_sizes: [...editedTemplate.floor_sizes, {
        key: `size_${Date.now()}`,
        name: 'New Size',
        description: 'Description',
        multiplier: 1.0
      }]
    })
  }

  const addFinishType = () => {
    if (!editedTemplate) return
    setEditedTemplate({
      ...editedTemplate,
      finish_types: [...editedTemplate.finish_types, {
        key: `finish_${Date.now()}`,
        name: 'New Finish',
        description: 'Description',
        price: 2.00
      }]
    })
  }

  const addStainType = () => {
    if (!editedTemplate) return
    setEditedTemplate({
      ...editedTemplate,
      stain_types: [...editedTemplate.stain_types, {
        key: `stain_${Date.now()}`,
        name: 'New Stain',
        description: 'Description',
        price: 0.75,
        color: '#8B4513'
      }]
    })
  }

  const displayTemplate = editingCatalog ? editedTemplate : template
  if (!displayTemplate) return null

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          These are the products and pricing that appear when creating new quotes.
        </p>
        {!editingCatalog && (
          <Button
            onClick={handleEditCatalog}
            variant="outline"
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            Edit Catalog
          </Button>
        )}
      </div>

      {/* Floor Types */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Floor Types</h4>
          {editingCatalog && (
            <button
              onClick={addFloorType}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              + Add Floor Type
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayTemplate.floor_types.map((floor: any, index: number) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              {editingCatalog ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="text"
                      value={floor.image}
                      onChange={(e) => updateFloorType(index, 'image', e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-slate-300 rounded"
                      placeholder="📦"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={floor.name}
                        onChange={(e) => updateFloorType(index, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                      />
                      <input
                        type="text"
                        value={floor.description}
                        onChange={(e) => updateFloorType(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={floor.basePrice}
                        onChange={(e) => updateFloorType(index, 'basePrice', parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-right"
                      />
                      <span className="text-xs text-slate-500">/sq ft</span>
                    </div>
                    <button
                      onClick={() => removeItem('floor_types', index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{floor.image}</span>
                      <span className="font-medium text-slate-900">{floor.name}</span>
                    </div>
                    <span className="font-semibold text-amber-600">${floor.basePrice.toFixed(2)}/sq ft</span>
                  </div>
                  <p className="text-xs text-slate-500">{floor.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floor Sizes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Floor Sizes</h4>
          {editingCatalog && (
            <button
              onClick={addFloorSize}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              + Add Size
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayTemplate.floor_sizes.map((size: any, index: number) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              {editingCatalog ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={size.name}
                      onChange={(e) => updateFloorSize(index, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded font-semibold text-center"
                    />
                    <input
                      type="number"
                      value={size.multiplier}
                      onChange={(e) => updateFloorSize(index, 'multiplier', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-right"
                    />
                    <button
                      onClick={() => removeItem('floor_sizes', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-semibold text-slate-900">{size.name}</div>
                  <div className="text-xs text-slate-500">{size.multiplier}x</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Finishes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Finishes</h4>
          {editingCatalog && (
            <button
              onClick={addFinishType}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              + Add Finish
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayTemplate.finish_types.map((finish: any, index: number) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              {editingCatalog ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={finish.name}
                      onChange={(e) => updateFinishType(index, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded font-medium"
                    />
                    <input
                      type="number"
                      value={finish.price}
                      onChange={(e) => updateFinishType(index, 'price', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-right"
                    />
                    <button
                      onClick={() => removeItem('finish_types', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{finish.name}</span>
                  <span className="text-sm font-semibold text-amber-600">+${finish.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stains */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Stain Colors</h4>
          {editingCatalog && (
            <button
              onClick={addStainType}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              + Add Stain
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayTemplate.stain_types.map((stain: any, index: number) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              {editingCatalog ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={stain.color}
                    onChange={(e) => updateStainType(index, 'color', e.target.value)}
                    className="w-12 h-12 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stain.name}
                    onChange={(e) => updateStainType(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded font-medium"
                  />
                  <input
                    type="number"
                    value={stain.price}
                    onChange={(e) => updateStainType(index, 'price', parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-right"
                  />
                  <button
                    onClick={() => removeItem('stain_types', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: stain.color }}
                    />
                    <span className="font-medium text-slate-900">{stain.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    {stain.price > 0 ? `+$${stain.price.toFixed(2)}` : 'Included'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {editingCatalog && (
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCatalog}
            disabled={isSaving}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}
