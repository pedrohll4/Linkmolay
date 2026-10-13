-- ==============================================================================
-- LINKMOLAY - SCRIPT DEFINITIVO DE CONFIGURAÇÃO DO SUPABASE
-- Cole este script completo no SQL Editor do seu projeto Supabase e clique em RUN.
-- ==============================================================================

-- 1. Habilitar Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criação Segura de Tipos ENUM
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('demolay', 'mason', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE work_model AS ENUM ('presencial', 'hibrido', 'remoto');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contract_type AS ENUM ('clt', 'pj', 'estagio', 'jovem_aprendiz', 'temporario');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('aberta', 'pausada', 'encerrada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('enviada', 'visualizada', 'em_analise', 'entrevista', 'aprovado', 'rejeitado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('geral', 'conquista', 'projeto_capitulo', 'evento', 'vaga');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('connection', 'message', 'approval', 'job', 'application', 'system');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admin_action_type AS ENUM ('approve', 'reject', 'suspend', 'activate', 'delete');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. TABELA DE PERFIS BASE (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'demolay',
  status user_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url TEXT,
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

-- 4. CAPÍTULOS DA ORDEM DEMOLAY
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  number INTEGER NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  history TEXT,
  master_councilor TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  instagram TEXT,
  active_members_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DETALHES DE PERFIL DEMOLAY
CREATE TABLE IF NOT EXISTS public.demolay_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_name TEXT NOT NULL,
  order_rank TEXT NOT NULL DEFAULT 'DeMolay Ativo',
  cid TEXT,
  open_to_work BOOLEAN DEFAULT FALSE,
  interest_areas TEXT[] DEFAULT '{}',
  education_level TEXT,
  institution TEXT,
  course TEXT,
  skills TEXT[] DEFAULT '{}'
);

-- 6. DETALHES DE PERFIL MAÇOM
CREATE TABLE IF NOT EXISTS public.mason_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  lodge_name TEXT NOT NULL,
  lodge_obedience TEXT,
  cim TEXT,
  profession TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}'
);

-- 7. EMPRESAS (Pertencem a um Maçom)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  segment TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  website TEXT,
  instagram TEXT,
  whatsapp TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VAGAS E OPORTUNIDADES
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  publisher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  work_model work_model NOT NULL DEFAULT 'presencial',
  contract_type contract_type NOT NULL DEFAULT 'clt',
  salary_min NUMERIC(10, 2),
  salary_max NUMERIC(10, 2),
  salary_negotiable BOOLEAN DEFAULT FALSE,
  education_requirement TEXT,
  experience_requirement TEXT,
  required_skills TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  status job_status NOT NULL DEFAULT 'aberta',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CANDIDATURAS A VAGAS
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_note TEXT,
  resume_url TEXT,
  status application_status NOT NULL DEFAULT 'enviada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- 10. EXPERIÊNCIAS PROFISSIONAIS
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT
);

-- 11. FORMAÇÃO ACADÊMICA
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER
);

-- 12. PROJETOS & PORTFÓLIO
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  date TEXT
);

-- 13. CONEXÕES DE NETWORKING
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- 14. CONVERSAS & MENSAGENS PRIVADAS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PUBLICAÇÕES NO FEED
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  type post_type NOT NULL DEFAULT 'geral',
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDITORIA ADMINISTRATIVA
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_name TEXT NOT NULL,
  action admin_action_type NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON public.profiles(role, status);
CREATE INDEX IF NOT EXISTS idx_demolay_open_to_work ON public.demolay_profiles(open_to_work);
CREATE INDEX IF NOT EXISTS idx_jobs_status_city ON public.jobs(status, city);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON public.job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_connections_users ON public.connections(requester_id, addressee_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);

-- ==============================================================================
-- GATILHO AUTOMÁTICO: NOVO USUÁRIO DO SUPABASE AUTH -> TABELAS PUBLIC
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Determinar role do usuário (padrão 'demolay')
  v_role := COALESCE((new.raw_user_meta_data->>'role')::user_role, 'demolay'::user_role);

  -- 1. Inserir perfil base
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    status,
    verified,
    city,
    state,
    bio,
    phone
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_role,
    'pending'::user_status,
    FALSE,
    COALESCE(new.raw_user_meta_data->>'city', 'Não informada'),
    COALESCE(new.raw_user_meta_data->>'state', 'UF'),
    COALESCE(new.raw_user_meta_data->>'bio', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    city = EXCLUDED.city,
    state = EXCLUDED.state;

  -- 2. Se for DeMolay, cria entrada em demolay_profiles
  IF v_role = 'demolay' THEN
    INSERT INTO public.demolay_profiles (
      user_id,
      chapter_name,
      order_rank,
      cid,
      open_to_work,
      education_level
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'chapter_name', 'Capítulo a definir'),
      COALESCE(new.raw_user_meta_data->>'order_rank', 'DeMolay Ativo'),
      new.raw_user_meta_data->>'cid',
      TRUE,
      new.raw_user_meta_data->>'education_level'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- 3. Se for Maçom, cria entrada em mason_profiles
  IF v_role = 'mason' THEN
    INSERT INTO public.mason_profiles (
      user_id,
      lodge_name,
      lodge_obedience,
      cim,
      profession
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'lodge_name', 'Loja a definir'),
      new.raw_user_meta_data->>'lodge_obedience',
      new.raw_user_meta_data->>'cim',
      COALESCE(new.raw_user_meta_data->>'profession', 'Profissional')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- BUCKETS DE STORAGE (Armazenamento de Arquivos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('company-assets', 'company-assets', true),
  ('chapter-assets', 'chapter-assets', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Avatares são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados enviam avatares" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Assets de empresas são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-assets');

CREATE POLICY "Usuários autenticados enviam assets de empresas" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-assets');

CREATE POLICY "Assets de capítulos são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'chapter-assets');

CREATE POLICY "Usuários autenticados enviam assets de capítulos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chapter-assets');

CREATE POLICY "Usuários autenticados acessam currículos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'resumes');

CREATE POLICY "Candidatos enviam currículos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demolay_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mason_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura e Escrita
CREATE POLICY "Leitura de perfis por autenticados" ON public.profiles
  FOR SELECT TO authenticated
  USING (status = 'approved' OR id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Atualização do próprio perfil" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Leitura pública de capítulos" ON public.chapters
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Leitura pública de empresas" ON public.companies
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Maçons podem criar empresas" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Maçons atualizam suas empresas" ON public.companies
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Leitura de vagas abertas" ON public.jobs
  FOR SELECT TO authenticated, anon
  USING (status = 'aberta' OR publisher_id = auth.uid());

CREATE POLICY "Maçons publicam vagas" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (publisher_id = auth.uid());

CREATE POLICY "Candidatos veem suas próprias candidaturas" ON public.job_applications
  FOR SELECT TO authenticated
  USING (candidate_id = auth.uid());

CREATE POLICY "Recrutadores veem candidaturas de suas vagas" ON public.job_applications
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.jobs j 
    JOIN public.companies c ON j.company_id = c.id 
    WHERE j.id = job_applications.job_id AND c.owner_id = auth.uid()
  ));

CREATE POLICY "Candidatar-se a vaga" ON public.job_applications
  FOR INSERT TO authenticated
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Leitura de feed da comunidade" ON public.posts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Publicar no feed" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Mensagens privadas entre participantes" ON public.messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id AND auth.uid() = ANY(c.participant_ids)
  ));

CREATE POLICY "Enviar mensagem privada" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- ==============================================================================
-- 16. SUPABASE STORAGE (BUCKETS & POLÍTICAS DE ACESSO)
-- ==============================================================================
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

ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;

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


-- ==============================================================================
-- DADOS INICIAIS DE CAPÍTULOS (Não dependem de auth.users)
-- ==============================================================================
INSERT INTO public.chapters (id, name, number, city, state, master_councilor, contact_email, history, active_members_count)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Capítulo Ariquemes', 85, 'Ariquemes', 'RO', 'Lucas Albuquerque', 'ariquemes85@demolay.org.br', 'Fundado em 1989, o Capítulo Ariquemes nº 85 possui vasta tradição na formação de líderes e cidadãos exemplares em Rondônia.', 42),
('c1000000-0000-0000-0000-000000000002', 'Capítulo Porto Velho', 48, 'Porto Velho', 'RO', 'Mateus Vasconcelos', 'portovelho48@demolay.org.br', 'O Capítulo mais antigo do estado de Rondônia, formador de dezenas de líderes em atuação nos setores público e privado.', 65),
('c1000000-0000-0000-0000-000000000003', 'Capítulo Piratininga', 10, 'São Paulo', 'SP', 'Gabriel Fontes', 'piratininga10@demolay.org.br', 'Tradicional capítulo paulista com histórico de fomento a inovação e empreendedorismo entre seus seniores.', 90)
ON CONFLICT (id) DO NOTHING;

-- Mensagem de confirmação
SELECT 'LINKMOLAY: Banco de dados provisionado com sucesso com todas as 15 tabelas, gatilhos de autenticação, storage e políticas de segurança!' AS status;
