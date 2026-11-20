export type FieldType = 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'date' | 'select'

export interface SectionDefinition {
  key: string
  title: string
  description: string
}

export interface FieldDefinition {
  key: string
  section: string
  label: string
  type: FieldType
  placeholder?: string
  helperText?: string
  options?: string[]
  aliases?: string[]
}

export interface AthleteRecord {
  id: string
  source: 'manual' | 'csv'
  createdAt: string
  updatedAt: string
  values: Record<string, string>
}

export interface ImportSummary {
  added: number
  updated: number
  ignored: number
}
