'use client'

import { useState, useCallback } from 'react'
import { MessageCircleQuestion, Bug, Lightbulb, HelpCircle, X, Camera, Send, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'

type Category = 'bug' | 'idea' | 'question'

interface FeedbackContext {
  url: string
  title: string
  viewport: { width: number; height: number }
  userAgent: string
  timestamp: string
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<Category>('bug')
  const [message, setMessage] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const captureScreenshot = useCallback(async () => {
    setIsCapturing(true)
    try {
      // Hide the widget temporarily for clean screenshot
      const widget = document.getElementById('feedback-widget')
      if (widget) widget.style.display = 'none'

      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        scale: 0.5, // Reduce size for storage
        ignoreElements: (el) => el.id === 'feedback-widget'
      })

      if (widget) widget.style.display = 'block'

      const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
      setScreenshot(dataUrl)
    } catch (error) {
      console.error('Screenshot failed:', error)
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setSubmitted(false)
    // Auto-capture screenshot when opening
    await captureScreenshot()
  }, [captureScreenshot])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setMessage('')
    setScreenshot(null)
    setCategory('bug')
  }, [])

  const getContext = useCallback((): FeedbackContext => ({
    url: window.location.href,
    title: document.title,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }), [])

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          screenshot,
          context: getContext()
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        alert('Failed to submit feedback. Please try again.')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [category, message, screenshot, getContext, handleClose])

  const categories: { id: Category; label: string; icon: typeof Bug }[] = [
    { id: 'bug', label: 'Bug', icon: Bug },
    { id: 'idea', label: 'Idea', icon: Lightbulb },
    { id: 'question', label: 'Question', icon: HelpCircle },
  ]

  return (
    <div id="feedback-widget" className="fixed bottom-4 right-4 z-[9999]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Send feedback"
        >
          <MessageCircleQuestion className="w-6 h-6" />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
            <h3 className="font-semibold text-gray-900">Send Feedback</h3>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {submitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Thanks!</h4>
              <p className="text-gray-600">Your feedback has been sent.</p>
            </div>
          ) : (
            /* Form */
            <div className="p-4 space-y-4">
              {/* Category Selection */}
              <div className="flex gap-2">
                {categories.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setCategory(id)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      category === id
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'bug'
                    ? "What's not working? What did you expect to happen?"
                    : category === 'idea'
                    ? "What would make this better?"
                    : "What are you wondering about?"
                }
                className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Screenshot Preview */}
              <div className="flex items-center gap-2 text-sm">
                {isCapturing ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Capturing screenshot...
                  </div>
                ) : screenshot ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Camera className="w-4 h-4" />
                    Screenshot captured
                    <button
                      onClick={captureScreenshot}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Retake
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={captureScreenshot}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <Camera className="w-4 h-4" />
                    Capture screenshot
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>

              {/* Context Info */}
              <p className="text-xs text-gray-400 text-center">
                Page info will be included automatically
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
