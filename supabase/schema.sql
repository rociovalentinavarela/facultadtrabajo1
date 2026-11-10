-- Ejecutar una sola vez en Supabase > SQL Editor.
-- Guarda todo el plan (textos, colores, areas, acciones, semanas del Gantt y presupuesto)
-- como un documento JSON, para que cualquier campo sea editable sin migraciones.

create table if not exists public.plan_documents (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.plan_documents enable row level security;

grant select, insert, update on public.plan_documents to anon, authenticated;

drop policy if exists "plan_documents_select" on public.plan_documents;
drop policy if exists "plan_documents_insert" on public.plan_documents;
drop policy if exists "plan_documents_update" on public.plan_documents;

-- Acceso abierto con la publishable key: cualquiera con el link puede ver y editar.
-- Para restringir la edicion, cambiar "anon, authenticated" por "authenticated"
-- en insert/update y agregar login con Supabase Auth.
create policy "plan_documents_select" on public.plan_documents
  for select to anon, authenticated using (true);

create policy "plan_documents_insert" on public.plan_documents
  for insert to anon, authenticated with check (true);

create policy "plan_documents_update" on public.plan_documents
  for update to anon, authenticated using (true) with check (true);
