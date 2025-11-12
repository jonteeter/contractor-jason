'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (signatureData: string) => void
  title: string
  signerName: string
}

export default function SignatureModal({
  isOpen,
  onClose,
  onSave,
  title,
  signerName
}: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  if (!isOpen) return null

  const handleClear = () => {
    sigCanvas.current?.clear()
    setIsEmpty(true)
  }

  const handleSave = () => {
    if (sigCanvas.current && !isEmpty) {
      const signatureData = sigCanvas.current.toDataURL('image/png')
      onSave(signatureData)
      handleClear()
      onClose()
    }
  }

  const handleBeginStroke = () => {
    setIsEmpty(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-600 mt-1">Please sign below</p>
          </div>
          <button
            onClick={onClose}
            className="touch-target p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Signature Canvas */}
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 relative">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: 'w-full h-64 cursor-crosshair',
                style: { touchAction: 'none' }
              }}
              onBegin={handleBeginStroke}
            />

            {/* Signature Line & Label */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <div className="border-b-2 border-slate-400"></div>
              <p className="text-xs text-slate-500 mt-2">
                {signerName}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm text-slate-600 mt-4 text-center">
            Draw your signature using your mouse, trackpad, or finger
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <Button
            onClick={handleClear}
            variant="outline"
            className="touch-target"
          >
            Clear
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="touch-target"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isEmpty}
              className="touch-target bg-amber-500 hover:bg-amber-600"
            >
              Save Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
