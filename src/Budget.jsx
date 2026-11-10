import { actionTotal, areaTotal, grandTotal, money, newAction, newResource, pct, resTotal } from './data'
import { IconBtn, Num, T, Txt, useApp } from './ui'

export default function Budget() {
  const { data, update, edit } = useApp()
  const cur = data.theme.currency
  const total = grandTotal(data)
  const share = (ar) => (total ? areaTotal(ar) / total : 0)

  return (
    <section className="sheet">
      <header className="sheet-head">
        <Txt k="budgetTitle" as="h2" />
        <Txt k="budgetSubtitle" as="p" className="lede" multiline />
      </header>

      {/* Resumen */}
      <div className="summary">
        <div className="total-card">
          <Txt k="grandTotal" as="span" className="label" />
          <strong>{money(total, cur)}</strong>
          <div className="stack" aria-hidden="true">
            {data.areas.map((ar) => (
              <i key={ar.id} style={{ background: ar.color, flexGrow: areaTotal(ar) || 0.0001 }} />
            ))}
          </div>
        </div>
        <table className="sum-table">
          <caption>
            <Txt k="summaryTitle" />
          </caption>
          <thead>
            <tr>
              <th className="left">
                <Txt k="sumArea" />
              </th>
              <th>
                <Txt k="sumTotal" />
              </th>
              <th>
                <Txt k="sumPct" />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.areas.map((ar) => (
              <tr key={ar.id}>
                <th className="left">
                  <i className="dot" style={{ background: ar.color }} />
                  {ar.name}
                </th>
                <td>{money(areaTotal(ar), cur)}</td>
                <td>{pct(share(ar))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="left">
                <Txt k="grandTotal" />
              </th>
              <td>{money(total, cur)}</td>
              <td>{total ? '100%' : '—'}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Premisas */}
      <div className="premises">
        <Txt k="premisesTitle" as="h3" />
        <ul>
          {data.premises.map((p, i) => (
            <li key={i}>
              <T value={p} multiline onChange={(v) => update((d) => void (d.premises[i] = v))} />
              {edit && (
                <IconBtn danger title="Eliminar premisa" onClick={() => update((d) => void d.premises.splice(i, 1))}>
                  ×
                </IconBtn>
              )}
            </li>
          ))}
        </ul>
        {edit && (
          <button className="add no-print" onClick={() => update((d) => void d.premises.push('Nueva premisa'))}>
            + Agregar premisa
          </button>
        )}
      </div>

      {/* Detalle */}
      <Txt k="detailTitle" as="h3" className="detail-title" />
      {data.areas.map((ar, ai) => (
        <div key={ar.id} className="area-block" style={{ '--c': ar.color }}>
          <div className="area-band">
            <T value={ar.name} onChange={(v) => update((d) => void (d.areas[ai].name = v))} />
            <span>{money(areaTotal(ar), cur)}</span>
          </div>
          <div className="table-scroll">
            <table className="budget">
              <thead>
                <tr>
                  <th className="left c-code"><Txt k="colCode" /></th>
                  <th className="left c-action"><Txt k="colAction" /></th>
                  <th className="left"><Txt k="colResource" /></th>
                  <th className="left c-unit"><Txt k="colUnit" /></th>
                  <th><Txt k="colPrice" /></th>
                  <th><Txt k="colTimes" /></th>
                  <th><Txt k="colTotal" /></th>
                  <th><Txt k="colSubtotal" /></th>
                </tr>
              </thead>
              <tbody>
                {ar.actions.map((a, ci) => {
                  const rows = a.resources.length ? a.resources : [null]
                  const setA = (fn) => update((d) => void fn(d.areas[ai].actions[ci]))
                  return rows.map((r, ri) => (
                    <tr key={r ? r.id : a.id} className={ri === 0 ? 'first' : ''}>
                      {ri === 0 && (
                        <>
                          <th className="left code" rowSpan={rows.length}>
                            <T value={a.code} onChange={(v) => setA((x) => (x.code = v))} />
                          </th>
                          <th className="left aname" rowSpan={rows.length}>
                            <T value={a.name} onChange={(v) => setA((x) => (x.name = v))} />
                            {edit && (
                              <span className="cell-tools no-print">
                                <button className="mini" onClick={() => setA((x) => x.resources.push(newResource()))}>
                                  + Recurso
                                </button>
                                <button className="mini danger" onClick={() => update((d) => void d.areas[ai].actions.splice(ci, 1))}>
                                  Eliminar acción
                                </button>
                              </span>
                            )}
                          </th>
                        </>
                      )}
                      {r ? (
                        <>
                          <td className="left">
                            <T value={r.desc} multiline onChange={(v) => setA((x) => (x.resources[ri].desc = v))} />
                            {edit && (
                              <IconBtn danger title="Eliminar recurso" onClick={() => setA((x) => x.resources.splice(ri, 1))}>
                                ×
                              </IconBtn>
                            )}
                          </td>
                          <td className="left muted">
                            <T value={r.unit} onChange={(v) => setA((x) => (x.resources[ri].unit = v))} />
                          </td>
                          <td>
                            <Num value={r.price} format={(n) => money(n, cur)} onChange={(v) => setA((x) => (x.resources[ri].price = v))} />
                          </td>
                          <td>
                            <Num value={r.times} onChange={(v) => setA((x) => (x.resources[ri].times = v))} />
                          </td>
                          <td>{money(resTotal(r), cur)}</td>
                        </>
                      ) : (
                        <td colSpan={5} className="left muted">—</td>
                      )}
                      {ri === 0 && (
                        <td className="sub" rowSpan={rows.length}>
                          {money(actionTotal(a), cur)}
                        </td>
                      )}
                    </tr>
                  ))
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th className="left" colSpan={7}>
                    <Txt k="subtotal" /> {ar.name}
                  </th>
                  <td>{money(areaTotal(ar), cur)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {edit && (
            <button className="add no-print" onClick={() => update((d) => void d.areas[ai].actions.push(newAction()))}>
              + Agregar acción en {ar.name}
            </button>
          )}
        </div>
      ))}

      <div className="grand">
        <Txt k="grandTotalLong" />
        <strong>{money(total, cur)}</strong>
      </div>
    </section>
  )
}
