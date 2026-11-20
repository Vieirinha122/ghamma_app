// Painel de gestão de atletas (rota /admin).
// Hoje lista do localStorage; a etapa de migração troca isso pela API (modules/atletas).
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import './AdminPanel.css'
import { athleteFields, athleteSections } from '../../ficha/data/formSchema'
import type { AthleteRecord, FieldDefinition } from '../../../contracts/types'
import {
  applyDerivedValues,
  buildRecord,
  formatBirthDate,
  formatDateTime,
  getAthleteAge,
  getAthleteName,
  STORAGE_KEY,
} from '../utils/athlete'
import {
  exportAthletesToCsv,
  exportTemplateCsv,
  importAthletesFromCsv,
  mergeImportedAthletes,
} from '../utils/csv'

type PanelMode = 'view' | 'create' | 'edit'
type NoticeTone = 'success' | 'info' | 'error'

interface NoticeState {
  tone: NoticeTone
  text: string
}

const sectionFieldsMap = new Map(
  athleteSections.map((section) => [
    section.key,
    athleteFields.filter((field) => field.section === section.key),
  ]),
)

const requiredFieldsBySection: Record<string, string[]> = {
  identification: ['fullName'],
}

function loadStoredAthletes() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return [] as AthleteRecord[]
    }

    const parsedValue = JSON.parse(rawValue) as AthleteRecord[]
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return [] as AthleteRecord[]
  }
}

function sortAthletes(records: AthleteRecord[]) {
  return [...records].sort((firstRecord, secondRecord) => {
    return getAthleteName(firstRecord).localeCompare(getAthleteName(secondRecord), 'pt-BR')
  })
}

function cloneRecord(record: AthleteRecord) {
  return {
    ...record,
    values: { ...record.values },
  }
}

function downloadTextFile(content: string, fileName: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

function getFieldDisplayValue(field: FieldDefinition, record: AthleteRecord) {
  const value = record.values[field.key] || ''

  if (!value.trim()) {
    return '—'
  }

  if (field.key === 'birthDate') {
    return formatBirthDate(value)
  }

  return value
}

function matchesQuery(record: AthleteRecord, query: string) {
  if (!query.trim()) {
    return true
  }

  const haystack = [
    record.values.fullName,
    record.values.currentCategory,
    record.values.position,
    record.values.currentTeam,
    record.values.phone,
  ]
    .join(' ')
    .toLocaleLowerCase()

  return haystack.includes(query.trim().toLocaleLowerCase())
}

function getFirstRecordId(records: AthleteRecord[]) {
  return sortAthletes(records)[0]?.id ?? null
}

function getAthleteAgeLabel(record: AthleteRecord) {
  const age = getAthleteAge(record)
  return age === '—' ? 'Idade não informada' : `${age} anos`
}

function getSectionProgress(sectionKey: string, values: Record<string, string>) {
  const sectionFields = sectionFieldsMap.get(sectionKey) ?? []
  const total = sectionFields.length
  const filled = sectionFields.filter((field) => values[field.key]?.trim()).length

  return {
    filled,
    total,
    isComplete: total > 0 && filled === total,
  }
}

function getSectionErrors(sectionKey: string, values: Record<string, string>) {
  const requiredFields = requiredFieldsBySection[sectionKey] ?? []
  return requiredFields.filter((fieldKey) => !values[fieldKey]?.trim())
}

function getSectionStatus(sectionIndex: number, currentStep: number, values: Record<string, string>) {
  const section = athleteSections[sectionIndex]
  const progress = getSectionProgress(section.key, values)
  const hasErrors = getSectionErrors(section.key, values).length > 0

  if (sectionIndex === currentStep) {
    return 'active'
  }

  if (hasErrors && progress.filled > 0) {
    return 'warning'
  }

  if (progress.isComplete || sectionIndex < currentStep) {
    return 'complete'
  }

  return 'idle'
}

export function AdminPanel() {
  const [athletes, setAthletes] = useState<AthleteRecord[]>(() => loadStoredAthletes())
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    getFirstRecordId(loadStoredAthletes()),
  )
  const [mode, setMode] = useState<PanelMode>('view')
  const [draft, setDraft] = useState<AthleteRecord>(() => buildRecord({ currentTeam: 'CTGV' }))
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [wizardStep, setWizardStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const sortedAthletes = useMemo(() => sortAthletes(athletes), [athletes])
  const filteredAthletes = useMemo(
    () => sortedAthletes.filter((record) => matchesQuery(record, query)),
    [query, sortedAthletes],
  )

  const selectedRecord = useMemo(
    () => athletes.find((record) => record.id === selectedId) ?? null,
    [athletes, selectedId],
  )

  const totalWithPain = useMemo(
    () => athletes.filter((record) => record.values.hasCurrentPain === 'Sim').length,
    [athletes],
  )

  const totalCategories = useMemo(() => {
    return new Set(
      athletes
        .map((record) => record.values.currentCategory)
        .filter((currentCategory) => currentCategory.trim()),
    ).size
  }, [athletes])

  const currentSection = athleteSections[wizardStep]
  const currentStepFields = currentSection
    ? (sectionFieldsMap.get(currentSection.key) ?? [])
    : []
  const totalSteps = athleteSections.length
  const isWizardMode = mode !== 'view'
  const isLastStep = wizardStep === totalSteps - 1
  const currentStepErrors = currentSection
    ? getSectionErrors(currentSection.key, draft.values)
    : []

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes))
  }, [athletes])

  useEffect(() => {
    if (!notice) {
      return
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  useEffect(() => {
    if (!isWizardMode) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMode('view')
        setWizardStep(0)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWizardMode])

  function showNotice(text: string, tone: NoticeTone = 'info') {
    setNotice({ text, tone })
  }

  function openWizard(nextMode: Exclude<PanelMode, 'view'>, record?: AthleteRecord) {
    setDraft(record ? cloneRecord(record) : buildRecord({ currentTeam: 'CTGV' }))
    setWizardStep(0)
    setMode(nextMode)
  }

  function handleCreateAthlete() {
    openWizard('create')
  }

  function handleEditAthlete() {
    if (!selectedRecord) {
      return
    }

    openWizard('edit', selectedRecord)
  }

  function handleCloseWizard() {
    setMode('view')
    setWizardStep(0)
  }

  function handleDeleteAthlete() {
    if (!selectedRecord) {
      return
    }

    const confirmed = window.confirm(
      `Deseja remover o atleta ${getAthleteName(selectedRecord)}? Essa ação apaga o registro salvo no navegador.`,
    )

    if (!confirmed) {
      return
    }

    const remainingAthletes = athletes.filter((record) => record.id !== selectedRecord.id)
    setAthletes(remainingAthletes)
    setSelectedId(getFirstRecordId(remainingAthletes))
    setMode('view')
    showNotice('Atleta removido com sucesso.', 'success')
  }

  function handleFieldChange(field: FieldDefinition, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      values: applyDerivedValues({
        ...currentDraft.values,
        [field.key]: value,
      }),
    }))
  }

  function handleSaveAthlete() {
    const normalizedValues = applyDerivedValues(draft.values)

    if (!normalizedValues.fullName.trim()) {
      showNotice('Informe pelo menos o nome completo do atleta.', 'error')
      setWizardStep(0)
      return
    }

    const timestamp = new Date().toISOString()
    const athleteToSave: AthleteRecord = {
      ...draft,
      updatedAt: timestamp,
      createdAt: mode === 'create' ? timestamp : draft.createdAt,
      values: normalizedValues,
    }

    const nextAthletes =
      mode === 'edit'
        ? athletes.map((record) => (record.id === athleteToSave.id ? athleteToSave : record))
        : [...athletes, athleteToSave]

    setAthletes(nextAthletes)
    setSelectedId(athleteToSave.id)
    handleCloseWizard()
    showNotice(mode === 'edit' ? 'Cadastro atualizado.' : 'Atleta cadastrado.', 'success')
  }

  function handlePreviousStep() {
    setWizardStep((currentStepValue) => Math.max(0, currentStepValue - 1))
  }

  function handleNextStep() {
    if (currentStepErrors.length) {
      const missingLabels = athleteFields
        .filter((field) => currentStepErrors.includes(field.key))
        .map((field) => field.label)
        .join(', ')

      showNotice(`Preencha antes de avançar: ${missingLabels}.`, 'error')
      return
    }

    setWizardStep((currentStepValue) => Math.min(totalSteps - 1, currentStepValue + 1))
  }

  function handleSelectWizardStep(stepIndex: number) {
    if (!isWizardMode) {
      return
    }

    if (stepIndex > wizardStep && currentStepErrors.length) {
      showNotice('Complete os campos obrigatórios da etapa atual antes de avançar.', 'error')
      return
    }

    setWizardStep(stepIndex)
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const csvContent = await file.text()
    const importResult = importAthletesFromCsv(csvContent)
    const mergedResult = mergeImportedAthletes(athletes, importResult.records)
    const nextRecords = sortAthletes(mergedResult.records)

    setAthletes(nextRecords)
    setSelectedId(nextRecords[0]?.id ?? null)
    setMode('view')

    const message = `${mergedResult.summary.added} adicionados, ${mergedResult.summary.updated} atualizados e ${importResult.ignored} linhas ignoradas.`
    showNotice(`Importação concluída: ${message}`, 'success')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleExportData() {
    if (!athletes.length) {
      showNotice('Cadastre ou importe atletas antes de exportar.', 'info')
      return
    }

    downloadTextFile(exportAthletesToCsv(sortAthletes(athletes)), 'ctgv-atletas.csv')
  }

  function handleExportTemplate() {
    downloadTextFile(exportTemplateCsv(), 'ctgv-modelo-importacao.csv')
  }

  const panelTitle = selectedRecord
    ? getAthleteName(selectedRecord)
    : 'Nenhum atleta selecionado'

  return (
    <>
      <div className="app-shell">
        <header className="app-topbar">
          <a className="app-brand" href="#visao-geral" aria-label="Ghamma Volley — visão geral">
            <img src="/ghamma-logo.png" alt="Ghamma Vôlei" />
            <span>
              <strong>Ghamma Volley</strong>
              <small>Gestão de jogadores</small>
            </span>
          </a>
          <nav className="app-navigation" aria-label="Navegação do painel">
            <a href="#visao-geral">Visão geral</a>
            <a className="active" href="#jogadores">
              Jogadores <span>{athletes.length}</span>
            </a>
          </nav>
          <div className="topbar-actions">
            <p className="storage-note">Dados salvos neste navegador</p>
            <a className="admin-site-link" href="/">Ver landing page</a>
          </div>
        </header>

        <header className="hero-panel" id="visao-geral">
          <div>
            <h1>Jogadores e anamnese</h1>
            <p className="hero-copy">
              Cadastre alunos, acompanhe idade e categoria, consulte a ficha completa e
              mantenha um backup em CSV.
            </p>
          </div>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={handleCreateAthlete}>
              Novo atleta
            </button>
            <button className="secondary-button" type="button" onClick={handleExportData}>
              Exportar CSV
            </button>
            <button className="ghost-button" type="button" onClick={handleExportTemplate}>
              Baixar modelo CSV
            </button>
            <label className="secondary-button upload-button">
              Importar CSV
              <input
                ref={fileInputRef}
                accept=".csv"
                type="file"
                onChange={handleImportFile}
              />
            </label>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card stat-card-highlight">
            <span>Total de atletas</span>
            <strong>{athletes.length}</strong>
            <p>Base consolidada entre cadastros manuais e importações.</p>
          </article>
          <article className="stat-card">
            <span>Com dor atual</span>
            <strong>{totalWithPain}</strong>
            <p>Ajuda a priorizar avaliações e acompanhamentos.</p>
          </article>
          <article className="stat-card">
            <span>Categorias ativas</span>
            <strong>{totalCategories}</strong>
            <p>Resumo rápido das turmas já registradas.</p>
          </article>
        </section>

        {notice ? <div className={`notice notice-${notice.tone}`}>{notice.text}</div> : null}

        <main className="workspace-grid" id="jogadores">
          <aside className="list-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Cadastros</p>
                <h2>Jogadores</h2>
              </div>
              <input
                className="search-input"
                type="search"
                placeholder="Buscar por nome, categoria ou posição"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="athlete-list">
              {filteredAthletes.length ? (
                filteredAthletes.map((record) => {
                  const isSelected = selectedId === record.id
                  return (
                    <button
                      key={record.id}
                      type="button"
                      className={`athlete-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedId(record.id)}
                    >
                      <div className="athlete-card-header">
                        <strong>{getAthleteName(record)}</strong>
                        {record.values.hasCurrentPain === 'Sim' ? (
                          <span className="badge badge-alert">Dor atual</span>
                        ) : (
                          <span className="badge">Sem dor atual</span>
                        )}
                      </div>
                      <p>
                        {record.values.currentCategory || 'Sem categoria'} ·{' '}
                        {record.values.position || 'Sem posição'}
                      </p>
                      <div className="athlete-card-meta">
                        <span className="age-chip">{getAthleteAgeLabel(record)}</span>
                        <span>{record.values.phone || 'Sem telefone'}</span>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="empty-state compact">
                  <strong>Nenhum atleta encontrado</strong>
                  <p>Importe um CSV ou ajuste a busca para ver resultados.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="detail-panel">
            <div className="panel-header sticky">
              <div>
                <p className="panel-kicker">Ficha completa</p>
                <h2>{panelTitle}</h2>
              </div>
              <div className="panel-actions">
                {selectedRecord ? (
                  <>
                    <button className="secondary-button" type="button" onClick={handleEditAthlete}>
                      Editar
                    </button>
                    <button className="danger-button" type="button" onClick={handleDeleteAthlete}>
                      Excluir
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {selectedRecord ? (
              <>
                <section className="summary-card">
                  <div>
                    <span className="summary-label">Idade</span>
                    <strong>{getAthleteAgeLabel(selectedRecord)}</strong>
                  </div>
                  <div>
                    <span className="summary-label">Equipe</span>
                    <strong>{selectedRecord.values.currentTeam || 'Não informado'}</strong>
                  </div>
                  <div>
                    <span className="summary-label">Posição</span>
                    <strong>{selectedRecord.values.position || 'Não informado'}</strong>
                  </div>
                  <div>
                    <span className="summary-label">Última atualização</span>
                    <strong>{formatDateTime(selectedRecord.updatedAt)}</strong>
                  </div>
                  <div>
                    <span className="summary-label">Origem</span>
                    <strong>
                      {selectedRecord.source === 'csv' ? 'Importado via CSV' : 'Cadastro manual'}
                    </strong>
                  </div>
                </section>

                <div className="sections-stack">
                  {athleteSections.map((section) => {
                    const sectionFields = sectionFieldsMap.get(section.key) ?? []
                    return (
                      <article className="section-card" key={section.key}>
                        <div className="section-header">
                          <div>
                            <h3>{section.title}</h3>
                            <p>{section.description}</p>
                          </div>
                        </div>
                        <div className="field-grid readonly-grid">
                          {sectionFields.map((field) => (
                            <div className="field-display" key={field.key}>
                              <span>{field.label}</span>
                              <strong>{getFieldDisplayValue(field, selectedRecord)}</strong>
                            </div>
                          ))}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <strong>Sem ficha aberta</strong>
                <p>
                  Use <em>Novo atleta</em> para cadastrar manualmente ou importe o CSV das
                  respostas do formulário.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {isWizardMode ? (
        <div className="modal-overlay" role="presentation" onClick={handleCloseWizard}>
          <section
            aria-modal="true"
            role="dialog"
            aria-labelledby="wizard-modal-title"
            className="wizard-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="wizard-modal-header">
              <div>
                <p className="panel-kicker">
                  {mode === 'create' ? 'Novo cadastro' : 'Editar cadastro'} · Etapa{' '}
                  {wizardStep + 1}/{totalSteps}
                </p>
                <h2 id="wizard-modal-title">
                  {mode === 'create'
                    ? 'Cadastro manual do atleta'
                    : `Editando ${draft.values.fullName || 'atleta'}`}
                </h2>
              </div>
              <button className="ghost-button modal-close-button" type="button" onClick={handleCloseWizard}>
                Fechar
              </button>
            </header>

            <div className="wizard-layout modal-wizard-layout">
              <section className="wizard-summary-card">
                <div>
                  <span className="summary-label">Nome</span>
                  <strong>{draft.values.fullName || 'Ainda não informado'}</strong>
                </div>
                <div>
                  <span className="summary-label">Idade</span>
                  <strong>{draft.values.age || '—'}</strong>
                </div>
                <div>
                  <span className="summary-label">Categoria</span>
                  <strong>{draft.values.currentCategory || '—'}</strong>
                </div>
                <div>
                  <span className="summary-label">Posição</span>
                  <strong>{draft.values.position || '—'}</strong>
                </div>
              </section>

              <nav className="wizard-steps" aria-label="Etapas do cadastro">
                {athleteSections.map((section, index) => {
                  const progress = getSectionProgress(section.key, draft.values)
                  const status = getSectionStatus(index, wizardStep, draft.values)
                  return (
                    <button
                      key={section.key}
                      type="button"
                      className={`wizard-step wizard-step-${status}`}
                      onClick={() => handleSelectWizardStep(index)}
                    >
                      <span className="wizard-step-index">{index + 1}</span>
                      <span className="wizard-step-copy">
                        <strong>{section.title}</strong>
                        <small>
                          {progress.filled}/{progress.total} campos preenchidos
                        </small>
                      </span>
                    </button>
                  )
                })}
              </nav>

              <article className="section-card wizard-card">
                <div className="section-header wizard-header">
                  <div>
                    <p className="panel-kicker">Etapa {wizardStep + 1}</p>
                    <h3>{currentSection.title}</h3>
                    <p>{currentSection.description}</p>
                  </div>
                  <div className="wizard-progress-chip">
                    {Math.round(((wizardStep + 1) / totalSteps) * 100)}% concluído
                  </div>
                </div>

                <div className="wizard-progress-bar" aria-hidden="true">
                  <span style={{ width: `${((wizardStep + 1) / totalSteps) * 100}%` }}></span>
                </div>

                {currentStepErrors.length ? (
                  <div className="wizard-warning">
                    Para avançar, preencha o campo obrigatório desta etapa.
                  </div>
                ) : null}

                <div className="field-grid wizard-field-grid">
                  {currentStepFields.map((field) => {
                    const value = draft.values[field.key] || ''
                    const isAgeAutoField = field.key === 'age' && Boolean(draft.values.birthDate)
                    const isRequired = currentStepErrors.includes(field.key)

                    return (
                      <label
                        className={`field-control ${field.type === 'textarea' ? 'full-width' : ''} ${isRequired ? 'field-control-required' : ''}`}
                        key={field.key}
                      >
                        <span>{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            rows={5}
                            value={value}
                            placeholder={field.placeholder}
                            onChange={(event) => handleFieldChange(field, event.target.value)}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={value}
                            onChange={(event) => handleFieldChange(field, event.target.value)}
                          >
                            <option value="">Selecione</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={value}
                            placeholder={field.placeholder}
                            readOnly={isAgeAutoField}
                            onChange={(event) => handleFieldChange(field, event.target.value)}
                          />
                        )}
                        {field.helperText ? <small>{field.helperText}</small> : null}
                        {isAgeAutoField ? (
                          <small>Idade calculada automaticamente a partir da data.</small>
                        ) : null}
                      </label>
                    )
                  })}
                </div>

                <footer className="wizard-footer">
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={wizardStep === 0}
                  >
                    Voltar etapa
                  </button>
                  <div className="wizard-footer-actions">
                    <button className="secondary-button" type="button" onClick={handleSaveAthlete}>
                      Salvar agora
                    </button>
                    {!isLastStep ? (
                      <button className="primary-button" type="button" onClick={handleNextStep}>
                        Próxima etapa
                      </button>
                    ) : (
                      <button className="primary-button" type="button" onClick={handleSaveAthlete}>
                        Finalizar cadastro
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
