-- ==============================================================================
-- LINKMOLAY - ESQUEMA DE BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enumerações
CREATE TYPE user_role AS ENUM ('demolay', 'mason', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE work_model AS ENUM ('presencial', 'hibrido', 'remoto');
CREATE TYPE contract_type AS ENUM ('clt', 'pj', 'estagio', 'jovem_aprendiz', 'temporario');
CREATE TYPE job_status AS ENUM ('aberta', 'pausada', 'encerrada');
CREATE TYPE application_status AS ENUM ('enviada', 'visualizada', 'em_analise', 'entrevista', 'aprovado', 'rejeitado');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE post_type AS ENUM ('geral', 'conquista', 'projeto_capitulo', 'evento', 'vaga');
CREATE TYPE notification_type AS ENUM ('connection', 'message', 'approval', 'job', 'application', 'system');
CREATE TYPE admin_action_type AS ENUM ('approve', 'reject', 'suspend', 'activate', 'delete');

-- 1. TABELA DE PERFIS BASE (vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
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

-- 2. DETALHES DE PERFIL DEMOLAY
CREATE TABLE IF NOT EXISTS demolay_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID,
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

-- 3. DETALHES DE PERFIL MAÇOM
CREATE TABLE IF NOT EXISTS mason_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  lodge_name TEXT NOT NULL,
  lodge_obedience TEXT,
  cim TEXT,
  profession TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}'
);

-- 4. CAPÍTULOS DA ORDEM DEMOLAY
CREATE TABLE IF NOT EXISTS chapters (
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

-- Adicionar chave estrangeira de chapter_id em demolay_profiles
ALTER TABLE demolay_profiles 
  ADD CONSTRAINT fk_demolay_chapter 
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL;

-- 5. EMPRESAS (Pertencem a um Maçom)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- 6. VAGAS E OPORTUNIDADES
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  publisher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- 7. CANDIDATURAS
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_note TEXT,
  resume_url TEXT,
  status application_status NOT NULL DEFAULT 'enviada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- 8. EXPERIÊNCIAS PROFISSIONAIS
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT
);

-- 9. FORMAÇÃO ACADÊMICA
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER
);

-- 10. PROJETOS & PORTFÓLIO
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  date TEXT
);

-- 11. CONEXÕES DE NETWORKING
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- 12. CONVERSAS & MENSAGENS
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PUBLICAÇÕES NO FEED
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  type post_type NOT NULL DEFAULT 'geral',
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDITORIA ADMINISTRATIVA
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_name TEXT NOT NULL,
  action admin_action_type NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES PARA ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_profiles_role_status ON profiles(role, status);
CREATE INDEX idx_demolay_open_to_work ON demolay_profiles(open_to_work);
CREATE INDEX idx_jobs_status_city ON jobs(status, city);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX idx_connections_users ON connections(requester_id, addressee_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demolay_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mason_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Exemplo de Policies Seguras:
-- Perfis aprovados são visíveis para membros autenticados
CREATE POLICY "Perfis visiveis para usuarios autenticados" ON profiles
  FOR SELECT TO authenticated
  USING (status = 'approved' OR id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Proprio usuario pode atualizar seu perfil" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Candidaturas: apenas o candidato ou o dono da empresa pode ver
CREATE POLICY "Candidatos podem ver suas proprias candidaturas" ON job_applications
  FOR SELECT TO authenticated
  USING (candidate_id = auth.uid());

CREATE POLICY "Recrutadores podem ver candidaturas de suas vagas" ON job_applications
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM jobs j 
    JOIN companies c ON j.company_id = c.id 
    WHERE j.id = job_applications.job_id AND c.owner_id = auth.uid()
  ));
