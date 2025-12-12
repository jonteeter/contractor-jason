'use client'

import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface RoomPhotoUploadProps {
  roomNumber: number
  projectId: string
  photoUrl: string | null
  onPhotoChange: (url: string | null) => void
  disabled?: boolean
}

export function RoomPhotoUpload({
  roomNumber,
  projectId,
  photoUrl,
  onPhotoChange,
  disabled = false,
}: RoomPhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      // Compress image before upload
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      }

      let compressedFile: File
      try {
        compressedFile = await imageCompression(file, options)
      } catch {
        // If compression fails (e.g., unsupported format), use original
        compressedFile = file
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('roomNumber', String(roomNumber))

      // Upload to API
      const response = await fetch(`/api/projects/${projectId}/photos`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo')
      }

      onPhotoChange(data.photoUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemovePhoto = async () => {
    if (!photoUrl) return

    setError(null)
    setUploading(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/photos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove photo')
      }

      onPhotoChange(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove photo')
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input with camera capture for mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {photoUrl ? (
        // Photo preview with remove button
        <div className="relative">
          <div
            className="w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-200 cursor-pointer hover:border-amber-400 transition-colors"
            onClick={triggerFileInput}
          >
            <img
              src={photoUrl}
              alt={`Room ${roomNumber} photo`}
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          {!disabled && !uploading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemovePhoto()
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        // Camera button
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={disabled || uploading}
          className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-amber-400 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add room photo"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-gray-400" />
          )}
        </button>
      )}

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
