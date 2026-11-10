import { createContext, useContext } from 'react'

export const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

// Texto editable en el lugar. En modo lectura es texto comun.
export function T({ value, onChange, as: Tag = 'span', className = '', multiline = false }) {
  const { edit } = useApp()
  if (!edit) return <Tag className={className}>{value}</Tag>
  return (
    <Tag
      className={`${className} editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => {
        const v = e.currentTarget.innerText.replace(/\s+\n|\n/g, ' ').trim()
        if (v !== value) onChange(v)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !(multiline && e.shiftKey)) {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
    >
      {value}
    </Tag>
  )
}

// Texto de la seccion "texts" del documento
export function Txt({ k, ...rest }) {
  const { data, update } = useApp()
  return <T value={data.texts[k]} onChange={(v) => update((d) => void (d.texts[k] = v))} {...rest} />
}

export function Num({ value, onChange, format }) {
  const { edit } = useApp()
  if (!edit) return <span>{format ? format(value) : value}</span>
  return (
    <input
      className="num-input"
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  )
}

export function Color({ value, onChange, label }) {
  return (
    <label className="swatch" title={label}>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      <span style={{ background: value }} />
    </label>
  )
}

export function IconBtn({ onClick, title, children, danger }) {
  return (
    <button type="button" className={`icon-btn no-print ${danger ? 'danger' : ''}`} onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  )
}
