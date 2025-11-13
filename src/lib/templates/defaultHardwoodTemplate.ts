// Default template for hardwood floor contractors
// This provides sensible defaults so contractors can start using the app immediately

export interface FloorTypeConfig {
  key: string
  name: string
  description: string
  basePrice: number
  features: string[]
  image: string
}

export interface FloorSizeConfig {
  key: string
  name: string
  description: string
  multiplier: number
}

export interface FinishTypeConfig {
  key: string
  name: string
  description: string
  price: number
}

export interface StainTypeConfig {
  key: string
  name: string
  description: string
  price: number
  color: string
}

export interface ContractorTemplate {
  floor_types: FloorTypeConfig[]
  floor_sizes: FloorSizeConfig[]
  finish_types: FinishTypeConfig[]
  stain_types: StainTypeConfig[]
}

export const DEFAULT_HARDWOOD_TEMPLATE: ContractorTemplate = {
  floor_types: [
    {
      key: 'red_oak',
      name: 'Red Oak',
      description: 'Classic American hardwood with prominent grain patterns and warm tones',
      basePrice: 8.50,
      features: ['Durable & Long-lasting', 'Classic Grain Pattern', 'Warm Natural Tones', 'Easy to Refinish'],
      image: '🌳'
    },
    {
      key: 'white_oak',
      name: 'White Oak',
      description: 'Premium hardwood with subtle grain and excellent durability',
      basePrice: 9.75,
      features: ['Premium Quality', 'Subtle Grain Pattern', 'Excellent Durability', 'Modern Appeal'],
      image: '🪵'
    },
    {
      key: 'linoleum',
      name: 'Linoleum',
      description: 'Eco-friendly resilient flooring with modern designs and easy maintenance',
      basePrice: 4.25,
      features: ['Eco-Friendly', 'Water Resistant', 'Easy Maintenance', 'Comfortable Underfoot'],
      image: '📐'
    }
  ],
  floor_sizes: [
    {
      key: '2_inch',
      name: '2"',
      description: 'Traditional narrow planks',
      multiplier: 1.0
    },
    {
      key: '2_5_inch',
      name: '2.5"',
      description: 'Popular medium width',
      multiplier: 1.15
    },
    {
      key: '3_inch',
      name: '3"',
      description: 'Wide plank premium look',
      multiplier: 1.25
    }
  ],
  finish_types: [
    {
      key: 'stain',
      name: 'Stain',
      description: 'Custom color with protective coating',
      price: 2.50
    },
    {
      key: 'gloss',
      name: 'Gloss',
      description: 'High-shine protective finish',
      price: 1.75
    },
    {
      key: 'semi_gloss',
      name: 'Semi-Gloss',
      description: 'Balanced shine and durability',
      price: 1.50
    },
    {
      key: 'option',
      name: 'Custom Option',
      description: 'Specialized finish consultation',
      price: 3.00
    }
  ],
  stain_types: [
    {
      key: 'natural',
      name: 'Natural',
      description: 'Original wood color',
      price: 0,
      color: '#D2B48C'
    },
    {
      key: 'golden_oak',
      name: 'Golden Oak',
      description: 'Warm golden tones',
      price: 0.75,
      color: '#DAA520'
    },
    {
      key: 'spice_brown',
      name: 'Spice Brown',
      description: 'Rich brown finish',
      price: 0.75,
      color: '#8B4513'
    }
  ]
}
