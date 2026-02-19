-- 1. Habilitar la extensión pgcrypto para gen_random_uuid() si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Crear tipos ENUM para roles y estados de tickets (Manejo de duplicados)
DO $$ BEGIN
    CREATE TYPE public.role_enum AS ENUM ('Solicitante', 'Jefe Directo', 'Mejora Continua', 'Administrador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.ticket_status_enum AS ENUM ('Borrador', 'En revisión jefe', 'Aprobado', 'Rechazado', 'En análisis', 'En desarrollo', 'En pruebas/validación', 'Implementado', 'Cerrado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.urgency_enum AS ENUM ('Baja', 'Media', 'Alta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear la tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role public.role_enum NOT NULL DEFAULT 'Solicitante',
  manager VARCHAR(255) -- Se mantiene como email por simplicidad, podría normalizarse a un ID
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal auth.users table.';

-- 4. Crear la tabla de tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impacto TEXT,
  area TEXT,
  sucursal TEXT,
  categoria TEXT,
  urgencia public.urgency_enum NOT NULL,
  prioridad public.urgency_enum NOT NULL,
  status public.ticket_status_enum NOT NULL DEFAULT 'Borrador',
  drive_folder_url TEXT,
  ishikawa_data JSONB,
  solicitante_id UUID NOT NULL REFERENCES public.profiles(id),
  aprobador_email TEXT, -- Email del jefe directo para aprobación
  asignado_a_id UUID REFERENCES public.profiles(id)
);
COMMENT ON TABLE public.tickets IS 'Stores all the continuous improvement tickets.';

-- 5. Crear la tabla de comentarios
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content TEXT NOT NULL,
  ticket_id TEXT NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.comments IS 'Stores comments and log entries for each ticket.';

-- 6. Configurar Políticas de Seguridad (Row Level Security - RLS)
-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Borrar políticas anteriores para evitar duplicados y recrearlas
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow users to create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow assigned users or admins to update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow authenticated users to read comments" ON public.comments;
DROP POLICY IF EXISTS "Allow authenticated users to insert comments" ON public.comments;

-- Políticas para la tabla 'profiles'
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para la tabla 'tickets'
CREATE POLICY "Allow authenticated users to read all tickets" ON public.tickets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to create tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = solicitante_id);
CREATE POLICY "Allow assigned users or admins to update tickets" ON public.tickets FOR UPDATE TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Mejora Continua', 'Administrador')
  OR auth.uid() = asignado_a_id
  OR aprobador_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
) WITH CHECK (true);

-- Políticas para la tabla 'comments'
CREATE POLICY "Allow authenticated users to read comments" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);


-- 7. Configurar Publicaciones para actualizaciones en tiempo real
-- Intentar crear la publicación, si falla (porque existe) lo ignoramos.
DO $$ BEGIN
    CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- Alternativamente, asegurarnos de que las tablas estén en la publicación (si no es FOR ALL TABLES por defecto)
ALTER PUBLICATION supabase_realtime ID TABLE public.profiles, public.tickets, public.comments;
