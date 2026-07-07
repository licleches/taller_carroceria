-- ============================================================
-- TABLA: appointments (citas agendadas por clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  nombre text NOT NULL,
  telefono text NOT NULL,
  email text NULL,
  placas text NULL,
  servicio text NOT NULL,
  fecha date NOT NULL,
  hora text NOT NULL,
  notas text NULL,
  status text NULL DEFAULT 'pendiente'::text,
  CONSTRAINT appointments_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anónimos pueden INSERTAR (formulario público)
DROP POLICY IF EXISTS "anon_insert_appointments" ON public.appointments;
CREATE POLICY "anon_insert_appointments"
  ON public.appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Autenticados pueden LEER
DROP POLICY IF EXISTS "auth_select_appointments" ON public.appointments;
CREATE POLICY "auth_select_appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (true);

-- Autenticados pueden ACTUALIZAR
DROP POLICY IF EXISTS "auth_update_appointments" ON public.appointments;
CREATE POLICY "auth_update_appointments"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- NOTAS:
-- 1. Esta migración asume que la tabla NO existe aún
-- 2. Si ya creaste la tabla manualmente, solo corre las
--    políticas RLS (desde ALTER TABLE en adelante)
-- ============================================================
