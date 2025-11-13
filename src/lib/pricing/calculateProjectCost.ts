/**
 * Calculates project pricing based on floor specifications and measurements
 */

import type { ContractorTemplate } from '@/lib/templates/defaultHardwoodTemplate'

interface FloorSpecs {
  floor_type: string
  floor_size: string
  finish_type: string
  stain_type: string | null
}

interface Measurements {
  room_1_length?: number | null
  room_1_width?: number | null
  room_2_length?: number | null
  room_2_width?: number | null
  room_3_length?: number | null
  room_3_width?: number | null
  stair_treads?: number | null
  stair_risers?: number | null
}

interface PricingResult {
  pricePerSqFt: number
  totalSquareFeet: number
  estimatedCost: number
}

/**
 * Calculate the price per square foot based on floor specifications
 */
export function calculatePricePerSqFt(
  specs: FloorSpecs,
  template: ContractorTemplate
): number {
  const floorType = template.floor_types.find(f => f.key === specs.floor_type)
  const floorSize = template.floor_sizes.find(s => s.key === specs.floor_size)
  const finishType = template.finish_types.find(f => f.key === specs.finish_type)
  const stainType = specs.stain_type
    ? template.stain_types.find(s => s.key === specs.stain_type)
    : null

  const basePrice = floorType?.basePrice || 0
  const sizeMultiplier = floorSize?.multiplier || 1
  const finishPrice = finishType?.price || 0
  const stainPrice = stainType?.price || 0

  return (basePrice * sizeMultiplier) + finishPrice + stainPrice
}

/**
 * Calculate total square footage from measurements
 */
export function calculateTotalSquareFeet(measurements: Measurements): number {
  let roomsSqft = 0

  // Room 1
  if (measurements.room_1_length && measurements.room_1_width) {
    roomsSqft += measurements.room_1_length * measurements.room_1_width
  }

  // Room 2
  if (measurements.room_2_length && measurements.room_2_width) {
    roomsSqft += measurements.room_2_length * measurements.room_2_width
  }

  // Room 3
  if (measurements.room_3_length && measurements.room_3_width) {
    roomsSqft += measurements.room_3_length * measurements.room_3_width
  }

  // Stairs (approximate: each tread is ~3 sq ft, each riser is ~1.5 sq ft)
  const treads = measurements.stair_treads || 0
  const risers = measurements.stair_risers || 0
  const stairsSqft = (treads * 3) + (risers * 1.5)

  return roomsSqft + stairsSqft
}

/**
 * Calculate complete project pricing
 */
export function calculateProjectCost(
  specs: FloorSpecs,
  measurements: Measurements,
  template: ContractorTemplate
): PricingResult {
  const pricePerSqFt = calculatePricePerSqFt(specs, template)
  const totalSquareFeet = calculateTotalSquareFeet(measurements)
  const estimatedCost = pricePerSqFt * totalSquareFeet

  return {
    pricePerSqFt,
    totalSquareFeet,
    estimatedCost
  }
}
