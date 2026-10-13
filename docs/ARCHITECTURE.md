# Arquitetura do Sistema — LINKMOLAY

## 1. Visão Geral e Princípios Arquiteturais

O **LinkMolay** é uma rede profissional fechada, voltada à comunidade DeMolay e Maçônica, construída com arquitetura desacoplada, segura e desenhada para portabilidade entre provedores de nuvem (Vercel inicial e Hostinger futura).

### Princípios Norteadores:
1. **Zero Vendor Lock-in**: Não utilizamos serviços proprietários vinculados a um único ecossistema (como Vercel KV ou Vercel Postgres). Toda a camada de dados é compatível com PostgreSQL padrão e pode ser migrada para qualquer servidor VPS ou hospedagem gerenciada da Hostinger.
2. **Segurança por Padrão (Security by Default)**: Cadastro restrito com aprovação manual inicial (`pending` -> `approved`), Row Level Security (RLS) no banco de dados e controle estrito de permissões por perfil (`demolay`, `mason`, `admin`).
3. **Desktop First & Mobile First Adaptativo**: Experiência desktop rica com sidebar persistente e experiência mobile dedicada com barra inferior de navegação rápida (bottom navigation).
4. **PWA Ready**: Suporte a instalação como aplicativo na tela inicial do smartphone ou desktop (PWA via Web App Manifest e Service Worker com caching).

---

## 2. Diagrama de Entidades e Relacionamentos

```
                  ┌──────────────────────────────┐
                  │           PROFILES           │
                  │  (id, email, role, status)   │
                  └───────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ (1:1 se role='demolay')│                        │ (1:1 se role='mason')
         ▼                        │                        ▼
┌──────────────────┐              │               ┌──────────────────┐
│ DEMOLAY_PROFILES │              │               │  MASON_PROFILES  │
│(chapter, rank)   │              │               │ (lodge, CIM)     │
└────────┬─────────┘              │               └────────┬─────────┘
         │ (N:1)                  │                        │ (1:N)
         ▼                        │                        ▼
┌──────────────────┐              │               ┌──────────────────┐
│     CHAPTERS     │              │               │    COMPANIES     │
│(name, city, UF)  │              │               │(name, segment)   │
└──────────────────┘              │               └────────┬─────────┘
                                  │                        │ (1:N)
                                  │                        ▼
                                  │               ┌──────────────────┐
                                  │               │       JOBS       │
                                  │               │ (title, salary)  │
                                  │               └────────┬─────────┘
                                  │                        │ (1:N)
                                  ▼                        ▼
                       ┌─────────────────────────────────────┐
                       │           JOB_APPLICATIONS          │
                       │(candidate_id, job_id, cover_note, st)│
                       └─────────────────────────────────────┘
```

---

## 3. Modelo de Permissões e Acesso (RBAC)

A plataforma possui 3 perfis e 4 estados de verificação:

### Papéis (Roles):
- **DeMolay**:
  - Pode criar e gerenciar seu perfil acadêmico/profissional.
  - Pode ativar/desativar o indicador "🟢 Disponível para Oportunidades".
  - Pode anexar currículo em PDF e links (GitHub, LinkedIn, Portfólio).
  - Pode se candidatar a vagas abertas por empresas de Maçons.
  - Pode conectar-se a outros membros e trocar mensagens.
  - Pode interagir com as páginas de Capítulos e publicações no feed.
- **Maçom**:
  - Pode criar perfil com dados de sua Loja Maçônica e profissão.
  - Pode cadastrar e gerenciar **suas próprias empresas**.
  - Pode publicar vagas em nome de suas empresas.
  - Pode buscar ativamente talentos DeMolay com filtros avançados.
  - Pode avaliar candidatos, visualizar currículos e alterar o status da candidatura.
  - Pode conectar-se e conversar diretamente com candidatos e irmãos.
- **Administrador**:
  - Acesso irrestrito ao painel `/admin`.
  - Aprovação ou rejeição de usuários pendentes em fila.
  - Suspensão e reativação de contas.
  - Moderação de publicações e encerramento administrativo de vagas.
  - Visualização de métricas e histórico de auditoria.

### Estados de Usuário:
1. `pending`: Usuário recém-cadastrado. Redirecionado para a tela institucional de análise. Sem acesso a dados internos de outros membros.
2. `approved`: Usuário verificado pela administração. Acesso liberado com selo "✓ DeMolay verificado" ou "✓ Maçom verificado".
3. `rejected`: Cadastro recusado por inconformidade com os critérios. Acesso bloqueado.
4. `suspended`: Conta temporariamente bloqueada por moderação.

---

## 4. Camadas de Software

A estrutura do projeto está organizada por domínios e responsabilidades:

```
src/
├── components/          # Componentes visuais reutilizáveis
│   ├── common/          # Badges, EmptyStates, Skeletons, Ícones Sociais
│   └── layout/          # Navbar, Sidebar, BottomNav, AppLayout
├── context/             # Gerenciamento de Estado Global
│   ├── AuthContext.tsx         # Sessão, login, registro, troca de perfil
│   ├── ThemeContext.tsx        # Dark Mode, Light Mode e Sistema
│   └── NotificationContext.tsx # Central de notificações e badge não lidas
├── pages/               # Telas do Sistema (Rotas)
│   ├── LandingPage.tsx          # Institucional pública com CTA
│   ├── LoginPage.tsx            # Login com atalhos de teste MVP
│   ├── RegisterPage.tsx         # Cadastro DeMolay e Maçom
│   ├── PendingApprovalPage.tsx  # Tela de acompanhamento de aprovação
│   ├── DashboardPage.tsx        # Início / Feed / Onboarding checklist
│   ├── MyProfilePage.tsx        # Edição de perfil, currículo e privacidade
│   ├── UserProfilePage.tsx      # Visualização de membros e conexão
│   ├── JobsPage.tsx             # Mural de vagas com filtros
│   ├── JobDetailPage.tsx        # Detalhe de vaga e candidatura
│   ├── MyJobsPage.tsx           # Gestão de vagas e candidatos (Maçons)
│   ├── MyApplicationsPage.tsx   # Linha do tempo de candidaturas (DeMolay)
│   ├── TalentSearchPage.tsx     # Busca ativa de DeMolays para empresas
│   ├── NetworkPage.tsx          # Minha rede, solicitações enviadas/recebidas
│   ├── MessagesPage.tsx         # Chat privado em tempo real
│   ├── ChaptersPage.tsx         # Diretório de Capítulos da Ordem
│   ├── ChapterDetailPage.tsx    # Comunidade capitular (4 abas)
│   ├── CompaniesPage.tsx        # Empresas da rede de Maçons
│   ├── CompanyDetailPage.tsx    # Página da empresa e vagas vinculadas
│   ├── AdminDashboardPage.tsx   # Painel /admin de moderação e auditoria
│   └── SettingsPage.tsx         # Configurações de tema, privacidade e dados
├── services/            # Serviços de integração
│   ├── api.ts                  # Persistência unificada e regras de negócio
│   ├── mockData.ts             # Dados realistas para testes imediatos
│   └── supabase.ts             # Inicialização oficial do Supabase client
├── types/               # Tipos TypeScript estritos de todo o ecossistema
└── tests/               # Suíte de testes unitários e de integração
```

---

## 5. Estratégia de Deploy e Migração Futura para a Hostinger

### Fase 1: Vercel (Frontend) + Supabase (PostgreSQL & Auth)
- A aplicação roda como SPA estática ultrarrápida, consumindo a API REST e Realtime do Supabase.
- Build simples com `npm run build` gerando a pasta `dist/`.

### Fase 2: Migração para a Hostinger
A Hostinger oferece dois cenários comuns:
1. **Hospedagem Compartilhada / Cloud Hostinger**:
   - Basta gerar o build estático (`npm run build`) e enviar os arquivos da pasta `dist/` para o diretório `public_html/` via FTP ou Gerenciador de Arquivos do hPanel.
   - O arquivo `.htaccess` redireciona todas as rotas para `index.html` (comportamento de Single Page Application).
2. **VPS Hostinger (Docker ou Node.js)**:
   - Um contêiner Nginx servindo o build estático com proxy reverso ou um servidor Node.js.
   - O banco PostgreSQL do Supabase pode continuar no Supabase ou ser migrado para uma instância PostgreSQL dedicada na VPS Hostinger usando os scripts `database/schema.sql` e `database/seed.sql`.
