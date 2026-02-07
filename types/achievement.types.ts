export type AchievementType =
  | 'first_save'
  | 'five_saved'
  | 'first_scan'
  | 'five_scans'
  | 'first_note'
  | 'ten_notes'
  | 'three_regions'
  | 'five_rated'

export interface AchievementDefinition {
  type: AchievementType
  name: string
  description: string
  icon: string       // emoji
  requirement: string
}

export interface Achievement {
  id: string
  user_id: string
  type: AchievementType
  unlocked_at: string
  metadata?: Record<string, unknown>
}

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, AchievementDefinition> = {
  first_save: {
    type: 'first_save',
    name: 'First Pour',
    description: 'Saved your first wine to the journal.',
    icon: '🍷',
    requirement: 'Save 1 wine',
  },
  five_saved: {
    type: 'five_saved',
    name: 'Building the Cellar',
    description: 'Your collection is taking shape — 5 wines saved.',
    icon: '🏠',
    requirement: 'Save 5 wines',
  },
  first_scan: {
    type: 'first_scan',
    name: 'Label Detective',
    description: 'Used the camera to scan your first wine label.',
    icon: '📷',
    requirement: 'Scan 1 label',
  },
  five_scans: {
    type: 'five_scans',
    name: 'Scanner',
    description: 'Scanned 5 wine labels. You\'re getting good at this.',
    icon: '🔍',
    requirement: 'Scan 5 labels',
  },
  first_note: {
    type: 'first_note',
    name: 'Taking Notes',
    description: 'Wrote your first tasting note.',
    icon: '📝',
    requirement: 'Write 1 note',
  },
  ten_notes: {
    type: 'ten_notes',
    name: 'The Journalist',
    description: '10 tasting notes written. You have a discerning palate.',
    icon: '✍️',
    requirement: 'Write 10 notes',
  },
  three_regions: {
    type: 'three_regions',
    name: 'World Traveler',
    description: 'Explored wines from 3 different regions.',
    icon: '🌍',
    requirement: 'Save wines from 3 regions',
  },
  five_rated: {
    type: 'five_rated',
    name: 'Discerning Palate',
    description: 'Rated 5 wines. Your opinions matter.',
    icon: '⭐',
    requirement: 'Rate 5 wines',
  },
}
