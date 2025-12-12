'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react'

interface Room {
  name: string
  length: number
  width: number
  sqft: number
  photoUrl?: string | null
}

interface MeasurementsData {
  room_1_name?: string | null
  room_1_length?: number | null
  room_1_width?: number | null
  room_1_photo_url?: string | null
  room_2_name?: string | null
  room_2_length?: number | null
  room_2_width?: number | null
  room_2_photo_url?: string | null
  room_3_name?: string | null
  room_3_length?: number | null
  room_3_width?: number | null
  room_3_photo_url?: string | null
  stair_treads: number
  stair_risers: number
}

interface Props {
  measurements: MeasurementsData
  onSave: (data: MeasurementsData) => Promise<void>
}

export default function MeasurementsEditor({ measurements, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [rooms, setRooms] = useState<Array<{
    name: string
    length: string
    width: string
  }>>(() => {
    const initial = []
    if (measurements.room_1_length && measurements.room_1_width) {
      initial.push({
        name: measurements.room_1_name || 'Room 1',
        length: measurements.room_1_length.toString(),
        width: measurements.room_1_width.toString()
      })
    }
    if (measurements.room_2_length && measurements.room_2_width) {
      initial.push({
        name: measurements.room_2_name || 'Room 2',
        length: measurements.room_2_length.toString(),
        width: measurements.room_2_width.toString()
      })
    }
    if (measurements.room_3_length && measurements.room_3_width) {
      initial.push({
        name: measurements.room_3_name || 'Room 3',
        length: measurements.room_3_length.toString(),
        width: measurements.room_3_width.toString()
      })
    }
    // If no rooms exist, add one empty room
    if (initial.length === 0) {
      initial.push({ name: 'Room 1', length: '', width: '' })
    }
    return initial
  })

  const [stairs, setStairs] = useState({
    treads: measurements.stair_treads.toString(),
    risers: measurements.stair_risers.toString()
  })

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    // Reset to original values
    const initial = []
    if (measurements.room_1_length && measurements.room_1_width) {
      initial.push({
        name: measurements.room_1_name || 'Room 1',
        length: measurements.room_1_length.toString(),
        width: measurements.room_1_width.toString()
      })
    }
    if (measurements.room_2_length && measurements.room_2_width) {
      initial.push({
        name: measurements.room_2_name || 'Room 2',
        length: measurements.room_2_length.toString(),
        width: measurements.room_2_width.toString()
      })
    }
    if (measurements.room_3_length && measurements.room_3_width) {
      initial.push({
        name: measurements.room_3_name || 'Room 3',
        length: measurements.room_3_length.toString(),
        width: measurements.room_3_width.toString()
      })
    }
    if (initial.length === 0) {
      initial.push({ name: 'Room 1', length: '', width: '' })
    }
    setRooms(initial)
    setStairs({
      treads: measurements.stair_treads.toString(),
      risers: measurements.stair_risers.toString()
    })
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data: MeasurementsData = {
        room_1_name: rooms[0] ? rooms[0].name : null,
        room_1_length: rooms[0] && rooms[0].length ? parseFloat(rooms[0].length) : null,
        room_1_width: rooms[0] && rooms[0].width ? parseFloat(rooms[0].width) : null,
        room_2_name: rooms[1] ? rooms[1].name : null,
        room_2_length: rooms[1] && rooms[1].length ? parseFloat(rooms[1].length) : null,
        room_2_width: rooms[1] && rooms[1].width ? parseFloat(rooms[1].width) : null,
        room_3_name: rooms[2] ? rooms[2].name : null,
        room_3_length: rooms[2] && rooms[2].length ? parseFloat(rooms[2].length) : null,
        room_3_width: rooms[2] && rooms[2].width ? parseFloat(rooms[2].width) : null,
        stair_treads: parseInt(stairs.treads) || 0,
        stair_risers: parseInt(stairs.risers) || 0
      }
      await onSave(data)
      setEditing(false)
    } catch (error) {
      console.error('Error saving measurements:', error)
    } finally {
      setSaving(false)
    }
  }

  const addRoom = () => {
    if (rooms.length < 3) {
      setRooms([...rooms, { name: `Room ${rooms.length + 1}`, length: '', width: '' }])
    }
  }

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (index: number, field: 'name' | 'length' | 'width', value: string) => {
    const updated = [...rooms]
    updated[index] = { ...updated[index], [field]: value }
    setRooms(updated)
  }

  const calculateRoomSqft = (length: string, width: string) => {
    const l = parseFloat(length)
    const w = parseFloat(width)
    return l && w ? (l * w).toFixed(1) : '0.0'
  }

  const calculateTotalSqft = () => {
    let total = 0
    rooms.forEach(room => {
      const l = parseFloat(room.length)
      const w = parseFloat(room.width)
      if (l && w) total += l * w
    })
    const treads = parseInt(stairs.treads) || 0
    const risers = parseInt(stairs.risers) || 0
    total += (treads * 3) + (risers * 1.5)
    return total.toFixed(1)
  }

  // Display rooms for view mode
  const displayRooms: Room[] = []
  if (measurements.room_1_length && measurements.room_1_width) {
    displayRooms.push({
      name: measurements.room_1_name || 'Room 1',
      length: measurements.room_1_length,
      width: measurements.room_1_width,
      sqft: measurements.room_1_length * measurements.room_1_width,
      photoUrl: measurements.room_1_photo_url
    })
  }
  if (measurements.room_2_length && measurements.room_2_width) {
    displayRooms.push({
      name: measurements.room_2_name || 'Room 2',
      length: measurements.room_2_length,
      width: measurements.room_2_width,
      sqft: measurements.room_2_length * measurements.room_2_width,
      photoUrl: measurements.room_2_photo_url
    })
  }
  if (measurements.room_3_length && measurements.room_3_width) {
    displayRooms.push({
      name: measurements.room_3_name || 'Room 3',
      length: measurements.room_3_length,
      width: measurements.room_3_width,
      sqft: measurements.room_3_length * measurements.room_3_width,
      photoUrl: measurements.room_3_photo_url
    })
  }

  if (!editing) {
    return (
      <div className="border-b border-slate-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Measurements</h3>
          <Button
            onClick={handleEdit}
            size="sm"
            variant="outline"
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Measurements
          </Button>
        </div>
        <div className="space-y-3">
          {displayRooms.length > 0 ? (
            displayRooms.map((room, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {room.photoUrl && (
                    <img
                      src={room.photoUrl}
                      alt={`${room.name} photo`}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(room.photoUrl!, '_blank')}
                      title="Click to view full size"
                    />
                  )}
                  <span className="text-slate-700">{room.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500">{room.length}' × {room.width}'</span>
                  <span className="font-semibold text-slate-900">{room.sqft.toFixed(1)} sq ft</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500 italic">
              No rooms added yet. Click "Edit Measurements" to add rooms.
            </div>
          )}
          {measurements.stair_treads > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-700">Stairs</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">
                  {measurements.stair_treads} treads, {measurements.stair_risers} risers
                </span>
                <span className="font-semibold text-slate-900">
                  {((measurements.stair_treads * 3) + (measurements.stair_risers * 1.5)).toFixed(1)} sq ft
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between py-3 bg-amber-50 px-4 rounded-lg">
            <span className="font-semibold text-slate-900">Total Square Footage</span>
            <span className="text-xl font-bold text-amber-600">
              {(() => {
                let total = 0
                displayRooms.forEach(room => total += room.sqft)
                total += (measurements.stair_treads * 3) + (measurements.stair_risers * 1.5)
                return total.toFixed(1)
              })()} sq ft
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-slate-200 p-8 bg-amber-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Edit Measurements</h3>
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

      <div className="space-y-4">
        {/* Rooms */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-700">Rooms</h4>
            {rooms.length < 3 && (
              <Button
                onClick={addRoom}
                size="sm"
                variant="outline"
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Room
              </Button>
            )}
          </div>
          {rooms.map((room, index) => (
            <div key={index} className="bg-white rounded-lg p-4 mb-3 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => updateRoom(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Master Bedroom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={room.length}
                    onChange={(e) => updateRoom(index, 'length', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Width (ft)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={room.width}
                      onChange={(e) => updateRoom(index, 'width', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      step="0.1"
                      min="0"
                    />
                    {rooms.length > 1 && (
                      <Button
                        onClick={() => removeRoom(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {room.length && room.width && (
                <div className="mt-2 text-sm text-slate-600">
                  = <span className="font-semibold">{calculateRoomSqft(room.length, room.width)} sq ft</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stairs */}
        <div>
          <h4 className="font-medium text-slate-700 mb-3">Stairs (Optional)</h4>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Treads</label>
                <input
                  type="number"
                  value={stairs.treads}
                  onChange={(e) => setStairs({ ...stairs, treads: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Risers</label>
                <input
                  type="number"
                  value={stairs.risers}
                  onChange={(e) => setStairs({ ...stairs, risers: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-3 bg-white px-4 rounded-lg border-2 border-amber-500">
          <span className="font-semibold text-slate-900">Total Square Footage</span>
          <span className="text-xl font-bold text-amber-600">{calculateTotalSqft()} sq ft</span>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Auto-pricing enabled:</strong> The estimated cost will be automatically recalculated when you save these measurements.
          </p>
        </div>
      </div>
    </div>
  )
}
