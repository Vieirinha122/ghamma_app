import { athleteFields } from '../data/formSchema'
import type { AthleteRecord, FieldDefinition } from '../types'

export const STORAGE_KEY = 'ctgv-athletes-v1'

export function createEmptyValues() {
  return athleteFields.reduce<Record<string, string>>((accumulator, field) => {
    accumulator[field.key] = ''
    return accumulator
  }, {})
}

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function computeAgeFromBirthDate(birthDate: string) {
  if (!birthDate) {
    return ''
  }

  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number)
  if (!birthYear || !birthMonth || !birthDay) {
    return ''
  }

  const today = new Date()
  let age = today.getFullYear() - birthYear
  const monthDifference = today.getMonth() + 1 - birthMonth

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDay)
  ) {
    age -= 1
  }

  return age >= 0 ? String(age) : ''
}

export function normalizeFieldValue(field: FieldDefinition, rawValue: string) {
  const trimmedValue = rawValue.replace(/\s+/g, ' ').trim()

  if (!trimmedValue) {
    return ''
  }

  if (!field.options?.length) {
    return trimmedValue
  }

  const normalizedValue = normalizeText(trimmedValue)
  const matchedOption = field.options.find(
    (option) => normalizeText(option) === normalizedValue,
  )

  return matchedOption ?? trimmedValue
}

export function applyDerivedValues(values: Record<string, string>) {
  const nextValues = { ...values }

  if (nextValues.birthDate) {
    nextValues.age = computeAgeFromBirthDate(nextValues.birthDate)
  }

  return nextValues
}

export function buildRecord(values?: Record<string, string>): AthleteRecord {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    source: 'manual',
    createdAt: now,
    updatedAt: now,
    values: applyDerivedValues({
      ...createEmptyValues(),
      ...values,
    }),
  }
}

export function getAthleteName(record: AthleteRecord) {
  return record.values.fullName?.trim() || 'Atleta sem nome'
}

export function getAthleteAge(record: AthleteRecord) {
  return record.values.age?.trim() || '—'
}

export function getAthleteFingerprint(values: Record<string, string>) {
  const email = normalizeText(values.email || '')
  const phone = normalizeText(values.phone || '')
  const name = normalizeText(values.fullName || '')

  if (email) {
    return `email:${email}`
  }

  if (name && phone) {
    return `name-phone:${name}:${phone}`
  }

  if (name) {
    return `name:${name}`
  }

  return ''
}

export function mergeRecordValues(
  currentValues: Record<string, string>,
  incomingValues: Record<string, string>,
) {
  const mergedValues = { ...currentValues }

  Object.entries(incomingValues).forEach(([key, value]) => {
    if (value.trim()) {
      mergedValues[key] = value
    }
  })

  return applyDerivedValues(mergedValues)
}

export function formatDateTime(value: string) {
  if (!value) {
    return '—'
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsedDate)
}

export function formatBirthDate(value: string) {
  if (!value) {
    return '—'
  }

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day))
}
