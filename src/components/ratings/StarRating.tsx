'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 'md',
  readonly = false
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const handleClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              index < rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
