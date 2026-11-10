import { Fragment, useEffect, useRef } from 'react'
import { WEEKS, newAction, newArea } from './data'
import { Color, IconBtn, T, Txt, useApp } from './ui'

const NEXT = { 0: '2', 2: '1', 1: '0' } // vacio -> pleno -> claro -> vacio

export default function Gantt() {
  const { data, update, edit } = useApp()
  const paint = useRef(null) // estado que se esta "pintando" al arrastrar

  useEffect(() => {
    const stop = () => (paint.current = null)
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  const setWeek = (ai, ci, wi, state) =>
    update((d) => {
      const a = d.areas[ai].actions[ci]
      a.weeks = a.weeks.slice(0, wi) + state + a.weeks.slice(wi + 1)
    })

  return (
    <section className="sheet">
      <header className="sheet-head">
        <Txt k="ganttTitle" as="h2" />
        <Txt k="ganttSubtitle" as="p" className="lede" />
        <div className="legend">
          {data.areas.map((ar) => (
            <span key={ar.id} className="legend-item">
              <i style={{ background: ar.color }} />
              {ar.name}
            </span>
          ))}
          <span className="legend-item">
            <i className="lg-full" />
            <Txt k="legendFull" />
          </span>
          <span className="legend-item">
            <i className="lg-light" />
            <Txt k="legendLight" />
          </span>
        </div>
        {edit && (
          <p className="hint no-print">
            Clic en una semana para cambiarla: vacía → color pleno → color claro. Se puede arrastrar para pintar varias.
          </p>
        )}
      </header>

      <div className="table-scroll">
        <table className="gantt">
          <colgroup>
            <col className="col-action" />
            {Array.from({ length: WEEKS }, (_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <thead>
            <tr className="months">
              <th className="left">
                <Txt k="actionCol" />
              </th>
              {data.months.map((m, i) => (
                <th key={i} colSpan={4} className="mstart">
                  <T value={m} onChange={(v) => update((d) => void (d.months[i] = v))} />
                </th>
              ))}
            </tr>
            <tr className="weeks">
              <th className="left">
                <Txt k="weekLabel" />
              </th>
              {Array.from({ length: WEEKS }, (_, i) => (
                <th key={i} className={i % 4 === 0 ? 'mstart' : ''}>
                  {(i % 4) + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.areas.map((ar, ai) => (
              <Fragment key={ar.id}>
                <tr className="area-row" style={{ '--c': ar.color }}>
                  <th className="left">
                    <T value={ar.name} onChange={(v) => update((d) => void (d.areas[ai].name = v))} />
                  </th>
                  <td colSpan={WEEKS}>
                    {edit && (
                      <span className="row-tools no-print">
                        <Color
                          value={ar.color}
                          label={`Color de ${ar.name}`}
                          onChange={(v) => update((d) => void (d.areas[ai].color = v))}
                        />
                        <button className="mini" onClick={() => update((d) => void d.areas[ai].actions.push(newAction()))}>
                          + Acción
                        </button>
                        <button
                          className="mini danger"
                          onClick={() =>
                            confirm(`¿Eliminar el área "${ar.name}" y todas sus acciones?`) &&
                            update((d) => void d.areas.splice(ai, 1))
                          }
                        >
                          Eliminar área
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
                {ar.actions.map((a, ci) => (
                  <tr key={a.id} className="action-row" style={{ '--c': ar.color }}>
                    <th className="left">
                      <T className="code" value={a.code} onChange={(v) => update((d) => void (d.areas[ai].actions[ci].code = v))} />
                      <T className="aname" value={a.name} onChange={(v) => update((d) => void (d.areas[ai].actions[ci].name = v))} />
                      {edit && (
                        <IconBtn danger title={`Eliminar ${a.code}`} onClick={() => update((d) => void d.areas[ai].actions.splice(ci, 1))}>
                          ×
                        </IconBtn>
                      )}
                    </th>
                    {a.weeks.split('').map((s, wi) => {
                      const prev = a.weeks[wi - 1]
                      const next = a.weeks[wi + 1]
                      const cls = [
                        'wk',
                        wi % 4 === 0 ? 'mstart' : '',
                        s === '2' ? 'full' : s === '1' ? 'light' : '',
                        s !== '0' && (wi === 0 || prev === '0') ? 'start' : '',
                        s !== '0' && (wi === WEEKS - 1 || next === '0') ? 'end' : '',
                      ].join(' ')
                      return (
                        <td
                          key={wi}
                          className={cls}
                          onMouseDown={
                            edit
                              ? (e) => {
                                  e.preventDefault()
                                  paint.current = NEXT[s]
                                  setWeek(ai, ci, wi, NEXT[s])
                                }
                              : undefined
                          }
                          onMouseEnter={
                            edit ? () => paint.current !== null && paint.current !== s && setWeek(ai, ci, wi, paint.current) : undefined
                          }
                        >
                          <i />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <button className="add no-print" onClick={() => update((d) => void d.areas.push(newArea()))}>
          + Agregar área
        </button>
      )}
    </section>
  )
}
