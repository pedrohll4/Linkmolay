-- ==============================================================================
-- LINKMOLAY - SCRIPT DEFINITIVO DE STORAGE E SINCRONIZAÇÃO EM NUVEM
-- Execute este script no SQL Editor do seu projeto Supabase e clique em RUN.
-- Ele habilita os buckets de fotos e libera a sincronização entre dispositivos.
-- ==============================================================================

-- 1. Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar ENUMs com tratamento de duplicidade
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('demolay', 'mason', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Criar a tabela public.profiles caso ainda não exista
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'demolay',
  status user_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT,
  show_phone BOOLEAN DEFAULT FALSE,
  linkedin_url TEXT,
  instagram_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  show_resume BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Desvincular chave estrangeira restritiva de auth.users (permite sincronização imediata)
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 5. Garantir que a coluna banner_url existe
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- 6. Configurar os Buckets de Armazenamento no Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('company-assets', 'company-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('chapter-assets', 'chapter-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 7. Políticas de Segurança RLS para o Storage (storage.objects)
DROP POLICY IF EXISTS "LinkMolay Storage - Leitura Pública" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Leitura Pública"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

DROP POLICY IF EXISTS "LinkMolay Storage - Upload" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Upload"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

DROP POLICY IF EXISTS "LinkMolay Storage - Atualização" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Atualização"
ON storage.objects FOR UPDATE
TO authenticated, anon
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

DROP POLICY IF EXISTS "LinkMolay Storage - Exclusão" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Exclusão"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

-- 8. Políticas RLS para a Tabela public.profiles (Permitir sincronização entre navegadores e dispositivos)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "LinkMolay Profiles - Leitura Pública" ON public.profiles;
CREATE POLICY "LinkMolay Profiles - Leitura Pública"
ON public.profiles FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "LinkMolay Profiles - Inserção" ON public.profiles;
CREATE POLICY "LinkMolay Profiles - Inserção"
ON public.profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "LinkMolay Profiles - Atualização" ON public.profiles;
CREATE POLICY "LinkMolay Profiles - Atualização"
ON public.profiles FOR UPDATE
TO authenticated, anon
USING (true);

-- 9. Inserir ou atualizar perfis base no banco de dados na nuvem
INSERT INTO public.profiles (id, email, full_name, role, status, verified, city, state, bio, phone, show_phone, linkedin_url, github_url)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'pedro.henrique@demolay.org.br', 'Pedro Henrique Lima Leal', 'demolay', 'approved', TRUE, 'Ariquemes', 'RO', 'Estudante de Engenharia de Software, desenvolvedor Full-Stack apaixonado por TypeScript, React e Python. Past Mestre Conselheiro do Cap. Luciano de Assis nº 118.', '(69) 99345-0011', TRUE, 'https://linkedin.com/in/pedro-henrique-demo', 'https://github.com/pedro-demo'),
  ('m0000000-0000-0000-0000-000000000001', 'carlos.silva@silvatech.com.br', 'Carlos Eduardo da Silva', 'mason', 'approved', TRUE, 'Ariquemes', 'RO', 'Empresário do setor de tecnologia, diretor da Silva Tecnologia e entusiasta do desenvolvimento dos jovens DeMolays.', '(69) 99234-5678', TRUE, 'https://linkedin.com/in/carlos-silva-demo', NULL),
  ('a0000000-0000-0000-0000-000000000001', 'admin@linkmolay.com.br', 'Administrador LinkMolay', 'admin', 'approved', TRUE, 'Brasília', 'DF', 'Coordenação Geral da Plataforma LinkMolay e moderação institucional.', NULL, FALSE, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verified = EXCLUDED.verified;

-- 10. Atualizar Capítulo Luciano de Assis nº 118 se tabela chapters existir
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chapters') THEN
    INSERT INTO public.chapters (id, name, number, city, state, logo_url, master_councilor, contact_email, history, active_members_count)
    VALUES (
      'c1000000-0000-0000-0000-000000000001',
      'Capítulo Luciano de Assis',
      118,
      'Ariquemes',
      'RO',
      '/chapters/luciano-de-assis-118.png',
      'Lucas Albuquerque',
      'lucianodeassis118@demolay.org.br',
      'Fundado em Ariquemes - RO, o Capítulo Luciano de Assis nº 118 possui rica história dedicada à formação cívica, moral e de liderança para a juventude de Rondônia.',
      42
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      number = EXCLUDED.number,
      logo_url = EXCLUDED.logo_url;
  END IF;
END $$;

SELECT 'LINKMOLAY: Storage e Perfis configurados com sucesso para acesso sincronizado entre dispositivos!' AS status;
