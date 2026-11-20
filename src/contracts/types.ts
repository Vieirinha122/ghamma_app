// Contratos de tipo do domínio da ficha (usados pelo formSchema e pela
// renderização da ficha). Tipos de API vivem em contracts/schemas/.
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
