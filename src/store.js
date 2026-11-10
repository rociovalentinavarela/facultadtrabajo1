import { createClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { buildDefaults } from './data'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = url && key ? createClient(url, key) : null

const TABLE = 'plan_documents'
const DOC_ID = 'plan-principal'
const LS_KEY = 'plan-doc-v1'

// Completa con valores por defecto las claves que falten (por si se agregan textos nuevos).
function withDefaults(doc) {
  const d = buildDefaults()
  if (!doc || !Array.isArray(doc.areas)) return d
  return {
    ...d,
    ...doc,
    texts: { ...d.texts, ...doc.texts },
    theme: { ...d.theme, ...doc.theme },
  }
}

function readLocal() {
  try {
    return withDefaults(JSON.parse(localStorage.getItem(LS_KEY)))
  } catch {
    return buildDefaults()
  }
}

// status: 'loading' | 'saved' | 'saving' | 'local' | 'error'
export function useDocument() {
  const [data, setData] = useState(readLocal)
  const [status, setStatus] = useState(supabase ? 'loading' : 'local')
  const dirty = useRef(false)
  const remoteOk = useRef(false)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      const { data: row, error } = await supabase.from(TABLE).select('data').eq('id', DOC_ID).maybeSingle()
      if (!alive) return
      if (error) return setStatus('local')
      remoteOk.current = true
      if (row && !dirty.current) {
        setData(withDefaults(row.data))
        return setStatus('saved')
      }
      // Primera vez (o hubo cambios antes de terminar de cargar): sube lo que hay en pantalla.
      setData((current) => {
        supabase
          .from(TABLE)
          .upsert({ id: DOC_ID, data: current, updated_at: new Date().toISOString() })
          .then(({ error: e }) => alive && setStatus(e ? 'error' : 'saved'))
        return current
      })
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!dirty.current) return
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data))
    } catch {}
    if (!supabase || !remoteOk.current) return setStatus('local')
    setStatus('saving')
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from(TABLE)
        .upsert({ id: DOC_ID, data, updated_at: new Date().toISOString() })
      setStatus(error ? 'error' : 'saved')
    }, 700)
    return () => clearTimeout(t)
  }, [data])

  // update(draft => { draft.texts.brand = '...' })
  const update = useCallback((fn) => {
    dirty.current = true
    setData((d) => {
      const next = structuredClone(d)
      fn(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    dirty.current = true
    setData(buildDefaults())
  }, [])

  return { data, update, reset, status }
}
