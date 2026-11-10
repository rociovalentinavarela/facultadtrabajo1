import { useState } from 'react'
import Budget from './Budget'
import Gantt from './Gantt'
import { useDocument } from './store'
import { Color, Ctx, Txt } from './ui'

const STATUS = {
  loading: 'Conectando…',
  saved: 'Guardado en Supabase',
  saving: 'Guardando…',
  local: 'Modo local · sin base de datos',
  error: 'Error al guardar',
}

const THEME_FIELDS = [
  ['paper', 'Fondo'],
  ['surface', 'Hojas'],
  ['ink', 'Texto'],
  ['accent', 'Acento'],
]

export default function App() {
  const { data, update, reset, status } = useDocument()
  const [edit, setEdit] = useState(false)
  const [tab, setTab] = useState('gantt')
  const t = data.theme

  return (
    <Ctx.Provider value={{ data, update, edit }}>
      <div
        className={`app ${edit ? 'is-edit' : ''}`}
        style={{ '--paper': t.paper, '--surface': t.surface, '--ink': t.ink, '--accent': t.accent }}
      >
        <header className="top">
          <div className="brand">
            <Txt k="kicker" as="span" className="kicker" />
            <Txt k="brand" as="h1" />
          </div>
          <nav className="tabs no-print" aria-label="Secciones">
            {[
              ['gantt', 'tabGantt'],
              ['budget', 'tabBudget'],
            ].map(([id, k]) => (
              <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)} aria-current={tab === id}>
                {edit && tab === id ? <Txt k={k} /> : data.texts[k]}
              </button>
            ))}
          </nav>
          <div className="actions no-print">
            <span className={`status s-${status}`}>{STATUS[status]}</span>
            <button className="btn" onClick={() => window.print()}>
              Imprimir / PDF
            </button>
            <button className={`btn primary ${edit ? 'on' : ''}`} onClick={() => setEdit((e) => !e)}>
              {edit ? 'Terminar edición' : 'Editar'}
            </button>
          </div>
        </header>

        {edit && (
          <aside className="appearance no-print" aria-label="Apariencia">
            <strong>Apariencia</strong>
            {THEME_FIELDS.map(([k, label]) => (
              <span key={k} className="field">
                <Color value={t[k]} label={label} onChange={(v) => update((d) => void (d.theme[k] = v))} />
                {label}
              </span>
            ))}
            {data.areas.map((ar, i) => (
              <span key={ar.id} className="field">
                <Color value={ar.color} label={ar.name} onChange={(v) => update((d) => void (d.areas[i].color = v))} />
                {ar.name}
              </span>
            ))}
            <label className="field">
              Moneda
              <input
                className="cur-input"
                value={t.currency}
                maxLength={5}
                onChange={(e) => update((d) => void (d.theme.currency = e.target.value))}
              />
            </label>
            <button
              className="mini danger push"
              onClick={() => confirm('¿Volver al contenido original? Se pierden todos los cambios.') && reset()}
            >
              Restaurar original
            </button>
          </aside>
        )}

        <main>{tab === 'gantt' ? <Gantt /> : <Budget />}</main>

        <footer className="foot">
          <Txt k="footer" />
        </footer>
      </div>
    </Ctx.Provider>
  )
}
