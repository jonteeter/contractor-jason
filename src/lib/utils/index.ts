import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculate square footage from length and width
 */
export function calculateSquareFootage(length: number, width: number): number {
  return Math.round(length * width * 100) / 100
}

/**
 * Calculate total project square footage including rooms and stairs
 */
export function calculateTotalSquareFootage(
  rooms: Array<{ length: number | null; width: number | null }>,
  stairTreads: number,
  stairRisers: number
): number {
  // Calculate room square footage
  const roomSquareFootage = rooms.reduce((total, room) => {
    if (room.length && room.width) {
      return total + calculateSquareFootage(room.length, room.width)
    }
    return total
  }, 0)

  // Estimate stair square footage (treads are typically 10" deep, risers 7" high)
  const stairSquareFootage = (stairTreads * 10 * 12 + stairRisers * 7 * 12) / 144

  return Math.round((roomSquareFootage + stairSquareFootage) * 100) / 100
}

/**
 * Estimate project cost based on floor type and square footage
 */
export function estimateProjectCost(
  floorType: 'red_oak' | 'white_oak' | 'linoleum',
  floorSize: '2_inch' | '2_5_inch' | '3_inch',
  finishType: 'stain' | 'gloss' | 'semi_gloss' | 'option',
  totalSquareFootage: number
): number {
  // Base cost per square foot by floor type
  const baseCosts = {
    red_oak: 8.50,
    white_oak: 9.25,
    linoleum: 4.75
  }

  // Size multipliers
  const sizeMultipliers = {
    '2_inch': 1.0,
    '2_5_inch': 1.15,
    '3_inch': 1.25
  }

  // Finish multipliers
  const finishMultipliers = {
    stain: 1.2,
    gloss: 1.1,
    semi_gloss: 1.15,
    option: 1.0
  }

  const baseCost = baseCosts[floorType]
  const sizeMultiplier = sizeMultipliers[floorSize]
  const finishMultiplier = finishMultipliers[finishType]

  const costPerSquareFoot = baseCost * sizeMultiplier * finishMultiplier
  const totalCost = costPerSquareFoot * totalSquareFootage

  // Add 15% markup for labor and overhead
  return Math.round(totalCost * 1.15 * 100) / 100
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate a unique project name
 */
export function generateProjectName(customerName: string, floorType: string): string {
  const date = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
  const floorTypeFormatted = floorType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  return `${customerName} - ${floorTypeFormatted} - ${date}`
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
