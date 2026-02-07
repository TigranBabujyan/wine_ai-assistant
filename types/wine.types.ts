export type WineStyle = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert'
export type WineSource = 'search' | 'scan' | 'manual'
export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury'

export interface FlavorProfile {
  acidity: number    // 1-10
  tannin: number     // 1-10
  body: number       // 1-10
  sweetness: number  // 1-10
  alcohol: number    // 1-10
}

export interface TastingNotes {
  aroma: string[]
  palate: string[]
  finish: string
}

// Partial wine — from Claude response, not yet saved
export interface WinePartial {
  name: string
  producer?: string
  vintage?: number | null
  region?: string
  country?: string
  variety?: string[]
  style: WineStyle
  description?: string
  tasting_notes?: TastingNotes
  flavor_profile?: FlavorProfile
  ai_summary?: string
  food_pairings?: string[]
  price_range?: PriceRange
  why_recommended?: string
  label_image_url?: string
  source: WineSource
}

// Full wine — saved in Supabase
export interface WineFull extends WinePartial {
  id: string
  user_id: string
  saved_at: string
  updated_at: string
}

// Search API response from Claude
export interface WineSearchResponse {
  wines: WinePartial[]
  query_interpretation: string
  total_results: number
}

// Note entity
export interface WineNote {
  id: string
  wine_id: string
  user_id: string
  content: string
  rating?: number  // 1-5
  occasion?: string
  paired_with?: string[]
  drunk_at?: string
  created_at: string
  updated_at: string
}

// Scan entity
export interface WineScan {
  id: string
  user_id: string
  wine_id?: string
  image_url: string
  extracted_data?: WinePartial
  confidence?: number
  model_used: string
  tokens_used?: number
  created_at: string
}

// Scan API response
export interface ScanResponse {
  wine: WinePartial
  scan_id: string
  image_url: string
  confidence: number
  notes: string
}
