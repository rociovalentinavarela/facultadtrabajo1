# Plan anual · Cronograma (Gantt) y presupuesto

App web (React + Vite) que reproduce el Gantt de 12 meses y el presupuesto anual de Ritmo Turismo. Todo es editable desde la propia app: textos, nombres, áreas, acciones, semanas, recursos, precios, colores y moneda. Los cambios se guardan en Supabase.

## 1. Supabase (una sola vez)

1. Abrir el proyecto en Supabase > **SQL Editor**.
2. Pegar y ejecutar el contenido de [`supabase/schema.sql`](supabase/schema.sql).

## 2. Variables de entorno

| Variable | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<id-del-proyecto>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | la publishable key (`sb_publishable_...`) |

Nunca usar la secret key ni la legacy JWT secret en el frontend.

## 3. Local

```bash
cp .env.example .env.local   # completar valores
npm install
npm run dev
```

## 4. Vercel

Importar el repo en Vercel (framework: Vite, se detecta solo), cargar las dos variables en *Settings > Environment Variables* y desplegar.

## Uso

- **Editar**: activa la edición. Clic en cualquier texto para cambiarlo; los números del presupuesto son campos.
- **Gantt**: clic en una semana alterna vacía → color pleno → color claro; arrastrar pinta varias.
- **Apariencia**: colores de fondo, hojas, texto, acento y de cada área.
- **Imprimir / PDF**: genera una versión A4 apaisada para la presentación.
- **Restaurar original**: vuelve al contenido de los PDF.

Sin Supabase configurado, la app funciona igual y guarda en el navegador.
