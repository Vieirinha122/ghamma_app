import Papa from 'papaparse'
import { athleteFields } from '../data/formSchema'
import type { AthleteRecord, ImportSummary } from '../types'
import {
  applyDerivedValues,
  buildRecord,
  getAthleteFingerprint,
  mergeRecordValues,
  normalizeFieldValue,
  normalizeText,
} from './athlete'

interface CsvImportResult {
  records: AthleteRecord[]
  ignored: number
}

function mapRowToRecord(row: Record<string, unknown>): AthleteRecord | null {
  const normalizedRow = Object.entries(row).reduce<Record<string, string>>(
    (accumulator, [header, value]) => {
      const normalizedHeader = normalizeText(header)

      if (normalizedHeader) {
        accumulator[normalizedHeader] = String(value ?? '').trim()
      }

      return accumulator
    },
    {},
  )

  const values = athleteFields.reduce<Record<string, string>>((accumulator, field) => {
    const candidates = [field.key, field.label, ...(field.aliases ?? [])].map((candidate) =>
      normalizeText(candidate),
    )

    const matchedHeaderEntry = Object.entries(normalizedRow).find(([header]) =>
      candidates.some(
        (candidate) =>
          header === candidate || header.startsWith(candidate) || candidate.startsWith(header),
      ),
    )

    accumulator[field.key] = matchedHeaderEntry
      ? normalizeFieldValue(field, matchedHeaderEntry[1] || '')
      : ''

    return accumulator
  }, {})

  const hasMeaningfulData = Object.values(values).some((value) => value.trim())
  if (!hasMeaningfulData || !values.fullName.trim()) {
    return null
  }

  return {
    ...buildRecord(applyDerivedValues(values)),
    source: 'csv' as const,
  }
}

export function importAthletesFromCsv(csvContent: string): CsvImportResult {
  const parsed = Papa.parse<Record<string, unknown>>(csvContent, {
    header: true,
    skipEmptyLines: 'greedy',
  })

  const mappedRecords = parsed.data.map((row) => mapRowToRecord(row))
  const records = mappedRecords.filter((record): record is AthleteRecord => record !== null)

  const ignored = mappedRecords.length - records.length

  return {
    records,
    ignored,
  }
}

export function mergeImportedAthletes(
  existingRecords: AthleteRecord[],
  importedRecords: AthleteRecord[],
) {
  const mergedRecords = [...existingRecords]
  const recordIndexByFingerprint = new Map<string, number>()

  mergedRecords.forEach((record, index) => {
    const fingerprint = getAthleteFingerprint(record.values)
    if (fingerprint) {
      recordIndexByFingerprint.set(fingerprint, index)
    }
  })

  const summary: ImportSummary = {
    added: 0,
    updated: 0,
    ignored: 0,
  }

  importedRecords.forEach((record) => {
    const fingerprint = getAthleteFingerprint(record.values)

    if (!fingerprint) {
      mergedRecords.push(record)
      summary.added += 1
      return
    }

    const existingIndex = recordIndexByFingerprint.get(fingerprint)

    if (typeof existingIndex !== 'number') {
      mergedRecords.push(record)
      recordIndexByFingerprint.set(fingerprint, mergedRecords.length - 1)
      summary.added += 1
      return
    }

    const existingRecord = mergedRecords[existingIndex]
    mergedRecords[existingIndex] = {
      ...existingRecord,
      source: 'csv',
      updatedAt: new Date().toISOString(),
      values: mergeRecordValues(existingRecord.values, record.values),
    }

    summary.updated += 1
  })

  return {
    records: mergedRecords,
    summary,
  }
}

export function exportAthletesToCsv(records: AthleteRecord[]) {
  const rows = records.map((record) => {
    const row = athleteFields.reduce<Record<string, string>>((accumulator, field) => {
      accumulator[field.label] = record.values[field.key] || ''
      return accumulator
    }, {})

    return {
      ID: record.id,
      Origem: record.source,
      'Criado em': record.createdAt,
      'Atualizado em': record.updatedAt,
      ...row,
    }
  })

  return Papa.unparse(rows)
}

export function exportTemplateCsv() {
  const headerRow = athleteFields.reduce<Record<string, string>>((accumulator, field) => {
    accumulator[field.label] = ''
    return accumulator
  }, {})

  return Papa.unparse([headerRow])
}


