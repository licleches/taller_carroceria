-- ============================================================
-- TABLA: quotes (UUID, con foto_url y check contacto)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  nombre text NOT NULL,
  telefono text NOT NULL,
  email text NULL,
  marca text NOT NULL,
  modelo text NOT NULL,
  año text NOT NULL,
  servicio text NOT NULL,
  descripcion text NOT NULL,
  contacto text NOT NULL,
  foto_url text NULL,
  status text NULL DEFAULT 'pendiente'::text,
  respuesta_precio text NULL,
  respuesta_tiempo text NULL,
  respuesta_notas text NULL,
  respuesta_pdf_url text NULL,
  responded_at timestamp with time zone NULL,
  CONSTRAINT quotes_pkey PRIMARY KEY (id),
  CONSTRAINT quotes_contacto_check CHECK (
    contacto = ANY (ARRAY['whatsapp'::text, 'email'::text])
  )
) TABLESPACE pg_default;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anónimos pueden INSERTAR (formulario público)
DROP POLICY IF EXISTS "anon_insert_quotes" ON public.quotes;
CREATE POLICY "anon_insert_quotes"
  ON public.quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Autenticados pueden LEER
DROP POLICY IF EXISTS "auth_select_quotes" ON public.quotes;
CREATE POLICY "auth_select_quotes"
  ON public.quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Autenticados pueden ACTUALIZAR (responder cotización)
DROP POLICY IF EXISTS "auth_update_quotes" ON public.quotes;
CREATE POLICY "auth_update_quotes"
  ON public.quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- COLUMNA ADICIONAL (si ya tienes la tabla sin respuesta_pdf_url)
-- ============================================================
-- Si ya creaste la tabla antes, ejecuta esto por separado:
-- ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS respuesta_pdf_url text NULL;

-- ============================================================
-- NOTAS:
-- 1. Crear bucket "evidencias" en Storage > New bucket > público
-- 2. Crear usuario admin en Authentication > Add User
--    Email: cesar@desertjewel.com
-- 3. Si ya creaste la tabla manualmente, SOLO corre las
--    políticas RLS (desde ALTER TABLE en adelante)
-- ============================================================
