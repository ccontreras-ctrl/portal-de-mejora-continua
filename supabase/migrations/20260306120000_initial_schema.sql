-- ==========================================
-- Portal de Mejora Continua - Initial Schema
-- ==========================================

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Solicitante',
    manager TEXT,
    area TEXT,
    sucursal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Anyone can view profiles (needed for dropdowns, etc)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. System Configurations (Admin Catalogs)
CREATE TABLE IF NOT EXISTS public.system_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_slas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    urgency_level TEXT NOT NULL UNIQUE, -- ej: Baja, Media, Alta
    max_resolution_hours INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin catalogs
ALTER TABLE public.system_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_slas ENABLE ROW LEVEL SECURITY;

-- Everyone can read catalogs
CREATE POLICY "Catalogs are viewable by everyone" ON public.system_areas FOR SELECT USING (true);
CREATE POLICY "Catalogs are viewable by everyone" ON public.system_categories FOR SELECT USING (true);
CREATE POLICY "Catalogs are viewable by everyone" ON public.system_slas FOR SELECT USING (true);

-- Only admins can write catalogs (Simplification: anyone authenticated for now, or check role later)
CREATE POLICY "Authenticated users can manage areas" ON public.system_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage categories" ON public.system_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage slas" ON public.system_slas FOR ALL USING (auth.role() = 'authenticated');


-- 3. Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id VARCHAR(50) PRIMARY KEY, -- Format: MC-YYYY-XXXX
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    solicitante_id UUID REFERENCES public.profiles(id) NOT NULL,
    area TEXT,
    sucursal TEXT,
    categoria TEXT,
    description TEXT NOT NULL,
    impacto TEXT,
    urgencia TEXT,
    prioridad TEXT,
    status TEXT DEFAULT 'En revisión jefe',
    aprobador_email TEXT,
    asignado_a_id UUID REFERENCES public.profiles(id),
    drive_folder_url TEXT,
    ishikawa_data JSONB,
    gemini_analysis TEXT
);

-- Enable RLS for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
-- For now, authenticated users can see all tickets, or we can restrict to own + assigned
CREATE POLICY "Tickets viewable by authenticated" ON public.tickets FOR SELECT USING (auth.role() = 'authenticated');
-- Authenticated users can insert tickets
CREATE POLICY "Tickets insertable by authenticated" ON public.tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Authenticated users can update tickets
CREATE POLICY "Tickets updatable by authenticated" ON public.tickets FOR UPDATE USING (auth.role() = 'authenticated');


-- 4. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id VARCHAR(50) REFERENCES public.tickets(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by authenticated" ON public.comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Comments insertable by authenticated" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Comments updatable by author" ON public.comments FOR UPDATE USING (auth.uid() = author_id);


-- Insert some default data for Area, Categories and SLAs
INSERT INTO public.system_areas (name) VALUES ('Ventas'), ('Post Venta'), ('Administración y Finanzas'), ('Gerencia General'), ('Recursos Humanos'), ('Marketing'), ('Desarrollo Web/TI') ON CONFLICT DO NOTHING;
INSERT INTO public.system_categories (name) VALUES ('Proceso Interno'), ('Operacional'), ('BI / Reportería'), ('Comercial'), ('Administrativo') ON CONFLICT DO NOTHING;
INSERT INTO public.system_slas (urgency_level, max_resolution_hours) VALUES ('Baja', 168), ('Media', 72), ('Alta', 24) ON CONFLICT DO NOTHING;
