export type WhiskyState = 'in' | 'open' | 'finished'

export interface WhiskyRecord {
  id: number
  title: string
  distillery: string
  bottler: string
  date_bought: string | null
  date_opened: string | null
  date_finished: string | null
  state: WhiskyState
  image_sml: string
  image_lg: string
}

export interface WhiskyWithAnchor extends WhiskyRecord {
  anchorDate: string | null
  anchorField: 'date_bought' | 'date_opened' | 'date_finished' | null
}

export type FilterPeriod = '3M' | '6M' | '12M'

export interface ActiveFilters {
  period: FilterPeriod | null
  year: number | null
  state: WhiskyState | null
  distillery: string | null
  bottler: string | null
}

export interface TimelineGroup {
  yearMonth: string
  label: string
  bottles: WhiskyWithAnchor[]
}

export interface BarEntry {
  label: string
  total: number
  breakdown: Record<WhiskyState, number>
}

export interface HeatmapCell {
  yearMonth: string
  label: string
  bought: number
  opened: number
  finished: number
}
