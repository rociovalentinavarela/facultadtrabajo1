// Contenido inicial, tomado de los PDF originales (Gantt y presupuesto).
// Todo lo que esta aca se puede editar desde la app; esto es solo el punto de partida.

export const WEEKS = 48 // 12 meses x 4 semanas

export const uid = () => Math.random().toString(36).slice(2, 10)

// Estados de cada semana: '0' vacia, '2' color pleno, '1' color claro
function weeks(...ops) {
  const w = Array(WEEKS).fill('0')
  for (const [state, from, to = from] of ops) for (let i = from; i <= to; i++) w[i] = state
  return w.join('')
}
// Ultima semana de cada mes, desde el mes indicado (0 = primer mes)
const monthly = (state, fromMonth = 0) =>
  Array.from({ length: 12 - fromMonth }, (_, i) => [state, (fromMonth + i) * 4 + 3])
const month = (state, m) => [state, m * 4, m * 4 + 3]

const action = (code, name, w, resources) => ({
  id: uid(),
  code,
  name,
  weeks: w,
  resources: resources.map(([desc, unit, price, times]) => ({ id: uid(), desc, unit, price, times })),
})

export const emptyWeeks = () => '0'.repeat(WEEKS)

export function buildDefaults() {
  return {
    texts: {
      brand: 'Ritmo Turismo',
      kicker: 'Matriz IGO · Acciones "Ejecutar ya"',
      tabGantt: 'Cronograma',
      tabBudget: 'Presupuesto',
      ganttTitle: 'Plan de 12 meses, por semanas',
      ganttSubtitle: '21 acciones del cuadrante "Ejecutar ya". Cada mes tiene 4 semanas (1 a 4).',
      legendFull: 'Color pleno: ejecución / implementación',
      legendLight: 'Color claro: seguimiento / actualización periódica',
      actionCol: 'Acción',
      weekLabel: 'Semana',
      budgetTitle: 'Presupuesto anual',
      budgetSubtitle:
        'Acciones del cuadrante "Ejecutar ya" según el Gantt de 12 meses · Valores en pesos argentinos (ARS), IVA incluido · Precios de noviembre de 2026',
      summaryTitle: 'Resumen por área',
      sumArea: 'Área',
      sumTotal: 'Total anual',
      sumPct: '% del total',
      grandTotal: 'Total general',
      grandTotalLong: 'Total general del presupuesto (12 meses, IVA incluido)',
      premisesTitle: 'Premisas y valores de referencia',
      detailTitle: 'Detalle por acción',
      subtotal: 'Subtotal',
      colCode: 'Cód.',
      colAction: 'Acción',
      colResource: 'Recurso requerido',
      colUnit: 'Unidad',
      colPrice: 'Precio unitario',
      colTimes: 'Veces',
      colTotal: 'Total',
      colSubtotal: 'Subtotal acción',
      footer: 'Ritmo Turismo · Matriz IGO · Plan de acciones "Ejecutar ya"',
    },
    theme: {
      paper: '#f4f2ec',
      surface: '#ffffff',
      ink: '#18212d',
      accent: '#1f4e9e',
      currency: '$',
    },
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    premises: [
      'Tipo de cambio: dólar oficial Banco Nación $1.570 (venta, 9/11/2026), usado para el CRM, que se cobra en dólares.',
      'Tienda Nube: Plan Esencial $27.999 por mes y puesta en marcha con especialista $70.000 (único), según Tiendanube (oct. 2026). Se toman como precio final.',
      'Xubio (software de gestión financiera): Plan Básico $123.100 + IVA 21% = $148.951 por mes (lista de septiembre de 2026). Se paga desde el mes 3, cuando arranca la implementación (10 meses).',
      'CRM: Zoho CRM Standard, USD 14 por usuario por mes, 3 usuarios, con IVA 21% sobre servicios digitales del exterior. No incluye percepciones por pago con tarjeta.',
      'Mano de obra (estimación de mercado): $30.000 por hora para tareas administrativas, contables y creativas (se corresponde con un honorario contable de unos $125.700 por tarea, de unas 4 horas, relevado en abril de 2026) y $45.000 por hora para consultoría y capacitación de RR. HH. Las horas de cada acción son un supuesto de dimensionamiento y pueden ajustarse.',
      'Incentivos de fidelización (M2.2): supuesto de 5 beneficios por mes de $30.000 cada uno.',
      'Repeticiones: se toman del Gantt (por ejemplo, 12 meses, 11 meses cuando la acción empieza en el mes 2, 4 intervenciones trimestrales de asesoría, 6 relevamientos, 3 ciclos de capacitación y 2 evaluaciones).',
      'Sin costo: Google Sheets, Drive y Forms (cuenta gratuita). No se incluyen dominio propio, inflación durante el año ni imprevistos.',
    ],
    areas: [
      {
        id: uid(),
        name: 'Marketing',
        color: '#e0531f',
        actions: [
          action('M1.1', 'Calendario de contenidos mensual', weeks(...monthly('2')), [
            ['Planificación del calendario (4 hs x $30.000)', 'mes', 120000, 12],
          ]),
          action('M1.2', 'Contenido audiovisual y publicaciones de viaje', weeks(['2', 0, 47]), [
            ['Producción y edición mensual de contenido (16 hs x $30.000)', 'mes', 480000, 12],
          ]),
          action('M2.1', 'Presentación institucional (valor agregado)', weeks(['2', 0, 1]), [
            ['Diseño de la presentación (16 hs x $30.000)', 'único', 480000, 1],
          ]),
          action('M2.2', 'Programa de fidelización y recomendaciones', weeks(['2', 2, 47]), [
            ['Gestión del programa (6 hs x $30.000)', 'mes', 180000, 12],
            ['Incentivos por recomendación (5 por mes x $30.000)', 'mes', 150000, 12],
          ]),
          action('M2.4', 'Encuestas de satisfacción y posventa', weeks(['2', 2, 47]), [
            ['Envío y análisis de encuestas (4 hs x $30.000). Google Forms sin costo', 'mes', 120000, 12],
          ]),
          action('M3.1', 'Diseño y desarrollo de la página web (Tienda Nube)', weeks(['2', 2, 3]), [
            ['Plan Esencial de Tienda Nube', 'mes', 27999, 12],
            ['Puesta en marcha con especialista Tienda Nube', 'único', 70000, 1],
            ['Personalización y carga de contenidos (12 hs x $30.000)', 'único', 360000, 1],
          ]),
          action('M3.2', 'Control de la página web', weeks(['2', 4, 47]), [
            ['Revisión y mantenimiento (4 hs x $30.000)', 'mes', 120000, 11],
          ]),
          action('M3.3', 'Catálogo de paquetes actualizado', weeks(['2', 4, 47]), [
            ['Actualización del catálogo (6 hs x $30.000)', 'mes', 180000, 11],
          ]),
          action('M4.1', 'Contratación y uso de CRM', weeks(['2', 2, 47]), [
            ['CRM Zoho Standard, 3 usuarios (USD 14 c/u)', 'mes', 79787, 12],
            ['Configuración e implementación (10 hs x $30.000)', 'único', 300000, 1],
          ]),
        ],
      },
      {
        id: uid(),
        name: 'Recursos Humanos',
        color: '#7b3fa0',
        actions: [
          action(
            'R1.1',
            'Asesoría externa en RR. HH.',
            weeks(['2', 0, 3], ['1', 4, 47], ['2', 11], ['2', 23], ['2', 35], ['2', 47]),
            [
              ['Búsqueda y contratación de la asesoría (6 hs x $30.000)', 'único', 180000, 1],
              ['Intervención trimestral del asesor (8 hs x $45.000)', 'trimestre', 360000, 4],
            ],
          ),
          action('R2.1', 'Organizar información del personal', weeks(['2', 0, 3], ...monthly('1', 1)), [
            ['Organización inicial (12 hs x $30.000)', 'único', 360000, 1],
            ['Actualización mensual (2 hs x $30.000)', 'mes', 60000, 11],
          ]),
          action('R2.2', 'Centralizar datos en Google Sheets', weeks(['2', 4, 7], ...monthly('1', 2)), [
            ['Implementación inicial (10 hs x $30.000). Google Sheets sin costo', 'único', 300000, 1],
            ['Actualización mensual (2 hs x $30.000)', 'mes', 60000, 10],
          ]),
          action(
            'R3.1',
            'Detectar necesidades de capacitación',
            weeks(...[1, 3, 5, 7, 9, 11].map((m) => month('2', m))),
            [['Relevamiento (8 hs x $45.000)', 'relevamiento', 360000, 6]],
          ),
          action('R3.3', 'Plan de capacitación (ciclos de 3 meses)', weeks(['2', 8, 43]), [
            ['Diseño del ciclo (10 hs x $45.000)', 'ciclo', 450000, 3],
            ['Dictado e implementación (12 hs x $45.000)', 'ciclo', 540000, 3],
          ]),
          action('R3.4', 'Evaluar resultados de capacitaciones', weeks(month('2', 5), month('2', 9)), [
            ['Evaluación (8 hs x $45.000)', 'evaluación', 360000, 2],
          ]),
        ],
      },
      {
        id: uid(),
        name: 'Finanzas',
        color: '#1f4e9e',
        actions: [
          action('F1.3', 'Estandarizar márgenes por paquete', weeks(['2', 0, 7]), [
            ['Análisis de costos y definición de márgenes (12 hs x $30.000)', 'único', 360000, 1],
          ]),
          action('F1.4', 'Planilla de ingresos y egresos', weeks(...monthly('2')), [
            ['Reformulación y carga mensual (3 hs x $30.000)', 'mes', 90000, 12],
          ]),
          action('F2.2', 'Cronograma estandarizado de cobros', weeks(['2', 0, 7]), [
            ['Diseño del cronograma de cuotas (10 hs x $30.000)', 'único', 300000, 1],
          ]),
          action('F2.3', 'Digitalizar registros de pagos', weeks(['2', 4, 11]), [
            ['Digitalización de registros (16 hs x $30.000)', 'único', 480000, 1],
          ]),
          action('F3.1', 'Software de gestión financiera', weeks(['2', 8, 19]), [
            ['Xubio Plan Básico ($123.100 + IVA)', 'mes', 148951, 10],
            ['Implementación y migración desde Excel (15 hs x $30.000)', 'único', 450000, 1],
          ]),
          action('F4.1', 'Calendario de pagos a proveedores', weeks(['2', 12, 19]), [
            ['Armado del calendario (10 hs x $30.000)', 'único', 300000, 1],
          ]),
        ],
      },
    ],
  }
}

export const newArea = () => ({ id: uid(), name: 'Nueva área', color: '#2f7d6b', actions: [] })
export const newAction = () => ({
  id: uid(),
  code: 'X0.0',
  name: 'Nueva acción',
  weeks: emptyWeeks(),
  resources: [newResource()],
})
export const newResource = () => ({ id: uid(), desc: 'Nuevo recurso', unit: 'mes', price: 0, times: 1 })

// Totales
export const resTotal = (r) => (Number(r.price) || 0) * (Number(r.times) || 0)
export const actionTotal = (a) => a.resources.reduce((s, r) => s + resTotal(r), 0)
export const areaTotal = (ar) => ar.actions.reduce((s, a) => s + actionTotal(a), 0)
export const grandTotal = (d) => d.areas.reduce((s, ar) => s + areaTotal(ar), 0)

const nf = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
export const money = (n, cur = '$') => `${cur}${nf.format(Math.round(n))}`
export const pct = (n) => `${(n * 100).toFixed(1).replace('.', ',')}%`
