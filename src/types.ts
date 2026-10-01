export interface WhiskyBottle {
  id: number
  title: string
  distillery: string
  bottler: string
  date_bought: string | null
  date_opened: string | null
  date_finished: string | null
  state: 'in' | 'open' | 'finished'
  image_sml: string
  image_lg: string
}
