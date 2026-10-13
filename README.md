# LINKMOLAY — Rede Profissional DeMolay & Maçom

> **Uma rede profissional exclusiva para DeMolays e Maçons, criada para conectar talentos DeMolays a oportunidades profissionais oferecidas por Maçons e empresas pertencentes a Maçons.**

---

## 📌 Sumário
1. [Visão Geral](#visão-geral)
2. [Identidade Visual & Filosofia de Design](#identidade-visual--filosofia-de-design)
3. [Tecnologias Utilizadas (Stack)](#tecnologias-utilizadas-stack)
4. [Estrutura e Arquitetura do Projeto](#estrutura-e-arquitetura-do-projeto)
5. [Controle de Acesso & Roles](#controle-de-acesso--roles)
6. [Fluxo de Verificação Manual](#fluxo-de-verificação-manual)
7. [Contas de Demonstração (Seed)](#contas-de-demonstração-seed)
8. [Configuração do Banco de Dados & Supabase](#configuração-do-banco-de-dados--supabase)
9. [Instalação e Execução Local](#instalação-e-execução-local)
10. [Testes Automatizados](#testes-automatizados)
11. [Progressive Web App (PWA)](#progressive-web-app-pwa)
12. [Deploy Inicial na Vercel](#deploy-inicial-na-vercel)
13. [Guia de Migração Futura para a Hostinger](#guia-de-migração-futura-para-a-hostinger)

---

## 1. Visão Geral

O **LinkMolay** é uma plataforma web privada criada para unir a tradição e liderança da Ordem DeMolay à solidez e oportunidades do empresariado Maçônico. 

Diferente de redes sociais genéricas, o LinkMolay é uma plataforma profissional fechada:
- **DeMolays** cadastram seus perfis acadêmicos e profissionais, anexam currículo em PDF, indicam disponibilidade imediata (**🟢 DISPONÍVEL PARA OPORTUNIDADES**) e candidatam-se a vagas exclusivas.
- **Maçons** criam perfis vinculados às suas Lojas Maçônicas, cadastram suas empresas e publicam oportunidades de emprego (estágio, jovem aprendiz, CLT, PJ).
- **Empresas** pertencem a perfis de Maçons verificados, garantindo transparência e integridade a cada vaga.
- **Capítulos** possuem comunidades próprias com projetos, filantropia e eventos.
- **Administradores** gerenciam a fila de aprovação de novos membros e moderam a plataforma via `/admin`.

---

## 2. Identidade Visual & Filosofia de Design

- **Cores Principais**:
  - Base: Azul Noturno Profundo (`#060B18`, `#0B132B`, `#101B3D`)
  - Destaque: Dourado Nobre (`#C9A038`, `#E0BF5C`, `#93751B`) com sofisticação e moderação.
- **Dark Mode Completo**:
  - Tratado como parte nativa da identidade da plataforma, com suporte a troca instantânea no menu superior entre **Dark Mode**, **Light Mode** e **Tema do Sistema**.
- **Tipografia**: *Plus Jakarta Sans*, moderna, geométrica e profissional.
- **Responsividade & Mobile**:
  - Desktop-first com layout limpo e barra lateral.
  - Mobile adaptativo com **Bottom Navigation** nativa (`Início`, `Oportunidades`, `Rede`, `Mensagens`, `Perfil`).

---

## 3. Tecnologias Utilizadas (Stack)

- **Frontend**: React 19, TypeScript, Vite 8
- **Estilização**: Tailwind CSS v4 com paleta personalizada (`navy` e `gold`)
- **Ícones**: Lucide React + SVGs customizados de alta definição
- **Roteamento**: React Router DOM v7
- **Microinterações**: Canvas Confetti
- **PWA**: `vite-plugin-pwa` com suporte a Service Worker e Web Manifest
- **Testes**: Vitest (100% de aprovação nos fluxos centrais)
- **Banco de Dados & Autenticação**:
  - Supabase (PostgreSQL + RLS + Auth + Storage)
  - Engine de Persistência Híbrida / Mock LocalStorage isolada para testes imediatos sem dependência externa obrigatória.

---

## 4. Estrutura e Arquitetura do Projeto

```
src/
├── components/          # Componentes visuais reutilizáveis
│   ├── common/          # Badges, EmptyStates, Skeletons, Ícones Sociais
│   └── layout/          # Navbar, Sidebar, BottomNav, AppLayout
├── context/             # Gerenciamento de Estado Global (Auth, Theme, Notifications)
├── pages/               # Telas do Sistema
│   ├── LandingPage.tsx          # Institucional moderna com chamadas à ação
│   ├── LoginPage.tsx            # Login com seletor rápido para testes
│   ├── RegisterPage.tsx         # Formulário com suporte a DeMolay e Maçom
│   ├── PendingApprovalPage.tsx  # Tela institucional de status da verificação
│   ├── DashboardPage.tsx        # Início, KPIs, feed e checklist de onboarding
│   ├── MyProfilePage.tsx        # Edição de perfil e currículo
│   ├── UserProfilePage.tsx      # Visualização pública de membro e conexões
│   ├── JobsPage.tsx             # Mural de vagas com filtros dinâmicos
│   ├── JobDetailPage.tsx        # Detalhes da vaga e formulário de candidatura
│   ├── MyJobsPage.tsx           # Gestão de vagas e candidatos (Maçons)
│   ├── MyApplicationsPage.tsx   # Acompanhamento de candidaturas (DeMolay)
│   ├── TalentSearchPage.tsx     # Busca ativa de DeMolays para empresas
│   ├── NetworkPage.tsx          # Conexões ativas e solicitações recebidas/enviadas
│   ├── MessagesPage.tsx         # Chat privado em tempo real entre membros conectados
│   ├── ChaptersPage.tsx         # Diretório de Capítulos da Ordem DeMolay
│   ├── ChapterDetailPage.tsx    # Comunidade do Capítulo (Sobre, Membros, Projetos, Eventos)
│   ├── CompaniesPage.tsx        # Empresas de Maçons e cadastro de nova empresa
│   ├── CompanyDetailPage.tsx    # Página institucional da empresa
│   ├── AdminDashboardPage.tsx   # Painel /admin (aprovação, moderação e auditoria)
│   └── SettingsPage.tsx         # Configurações de tema, privacidade e reset demo
├── services/            # Serviços de integração (api.ts, mockData.ts, supabase.ts)
├── types/               # Definições de tipos TypeScript
└── tests/               # Suíte de testes automatizados com Vitest
```

---

## 5. Controle de Acesso & Roles

| Papel (Role) | Descrição | Permissões Principais |
| :--- | :--- | :--- |
| **`demolay`** | Membro da Ordem DeMolay | Criar perfil, anexar currículo, ativar "Buscando Emprego", candidatar-se a vagas, conectar-se, enviar mensagens, participar dos Capítulos. |
| **`mason`** | Membro da Maçonaria | Criar perfil vinculado à Loja, cadastrar empresas, publicar vagas, gerenciar candidatos, buscar talentos DeMolay, conectar-se e conversar. |
| **`admin`** | Administrador da Plataforma | Acesso exclusivo a `/admin`, aprovar/rejeitar cadastros pendentes, suspender contas, encerrar vagas e auditar histórico. |

---

## 6. Fluxo de Verificação Manual

1. O usuário se cadastra em `/cadastro` selecionando **[ DeMolay ]** ou **[ Maçom ]** e informando seu Capítulo ou Loja.
2. O cadastro é gravado com status `pending`.
3. Ao realizar login com cadastro pendente, o usuário é direcionado à tela **`PendingApprovalPage`**, onde acompanha a etapa de validação institucional.
4. O Administrador acessa `/admin`, visualiza os dados do cadastro na aba **Usuários Pendentes** e clica em **`[ Aprovar ]`** ou **`[ Rejeitar ]`**.
5. Ao ser aprovado, o status passa para `approved`, o selo **`✓ DeMolay verificado`** ou **`✓ Maçom verificado`** é ativado, e uma notificação de boas-vindas é gerada.

---

## 7. Contas de Demonstração (Seed)

Para avaliar o sistema imediatamente sem precisar configurar o banco externo no primeiro minuto, utilize as contas pré-configuradas (senha padrão: `123456`):

- **Pedro Henrique** (`pedro.henrique@demolay.org.br`): DeMolay Aprovado, Desenvolvedor Full-Stack, com currículo e indicador de busca de emprego ativo.
- **Carlos Eduardo da Silva** (`carlos.silva@silvatech.com.br`): Maçom Aprovado, CEO da Silva Tecnologia, com vagas publicadas e candidaturas recebidas.
- **Roberto Mendes** (`roberto.mendes@mendesadv.com.br`): Maçom Aprovado, Advogado sócio da Mendes & Associados.
- **Felipe Barreto** (`felipe.novato@demolay.org.br`): DeMolay com cadastro **Pendente** para testar o fluxo de aprovação.
- **Marcos Albuquerque** (`marcos.albuquerque@novos.com.br`): Maçom com cadastro **Pendente**.
- **Administrador** (`admin@linkmolay.com.br` / senha: `admin123`): Acesso irrestrito a `/admin`.

> **Dica**: No topo da barra de navegação (Navbar), há um botão **"Alternar Perfil"** que permite trocar entre essas contas em 1 clique durante a avaliação do MVP!

---

## 8. Configuração do Banco de Dados & Supabase

### Arquivos de Migração e Seed:
- `database/schema.sql`: DDL completo do PostgreSQL com enums, 15 tabelas, chaves estrangeiras, índices e políticas de Row Level Security (RLS).
- `database/seed.sql`: Carga inicial de dados de teste (Capítulos, Empresas, Usuários, Vagas, Candidaturas, Mensagens, Posts).
- `supabase/migrations/20250101_initial_schema.sql`: Migração no padrão Supabase CLI.

### Como aplicar no Supabase:
1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor** -> **New query**.
3. Copie o conteúdo de `database/schema.sql` e execute (**Run**).
4. Copie o conteúdo de `database/seed.sql` e execute (**Run**).
5. Preencha seu arquivo `.env` com a URL e chave anônima do seu projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=seu-anon-key
VITE_APP_MODE=supabase
```

---

## 9. Instalação e Execução Local

### Pré-requisitos:
- Node.js v18+ (testado e homologado no Node v24)
- npm v9+

### Passos:
```bash
# 1. Clonar ou abrir o diretório do projeto
cd d:/Projetos/LINKMOLAY

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`.

---

## 10. Testes Automatizados

A suíte de testes cobre integralmente os 10 fluxos críticos exigidos no projeto:
```bash
npm run test
```

Resultados cobertos:
- ✅ Cadastro DeMolay com status `pending`
- ✅ Cadastro Maçom com vinculação de Loja e CIM
- ✅ Aprovação pelo Administrador com emissão de selo verificado e trilha de auditoria
- ✅ Bloqueio de login por suspensão de conta
- ✅ Criação de empresa por Maçom
- ✅ Publicação de vaga vinculada à empresa
- ✅ Candidatura de DeMolay e bloqueio de duplicações
- ✅ Conexão de networking (solicitação e aceitação)
- ✅ Envio de mensagens privadas entre conectados
- ✅ Métricas e consultas do painel administrativo

---

## 11. Progressive Web App (PWA)

O LinkMolay foi desenvolvido como PWA instalável:
- **Manifest**: `dist/manifest.webmanifest`
- **Service Worker**: `dist/sw.js` gerado automaticamente via Workbox
- **Offline ready**: Precache dos assets essenciais
- **Instalação**: No navegador móvel (Chrome/Safari), basta clicar em *"Adicionar à tela de início"* para utilizar o LinkMolay com experiência e ícone de aplicativo.

---

## 12. Deploy Inicial na Vercel

1. Suba o repositório no GitHub/GitLab.
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Defina as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_MODE`
4. Clique em **Deploy**.

---

## 13. Guia de Migração Futura para a Hostinger

O projeto foi projetado com independência tecnológica rigorosa para permitir migração transparente para servidores da **Hostinger**:

### Opção A: Hospedagem Compartilhada / Cloud Hostinger (hPanel)
1. Execute o build de produção localmente ou via pipeline:
   ```bash
   npm run build
   ```
2. Acesse o **Gerenciador de Arquivos** no hPanel da Hostinger.
3. Faça o upload de todos os arquivos da pasta `dist/` para a pasta `public_html/`.
4. Crie um arquivo `.htaccess` na raiz de `public_html/` com o seguinte conteúdo para suportar o roteamento do React:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Opção B: VPS Hostinger (Docker / Nginx)
1. Configure um contêiner Nginx simples servindo a pasta `dist/`.
2. Configure o banco PostgreSQL localmente na VPS ou mantenha a conexão com o banco gerenciado do Supabase.

---

## 14. Licença & Uso

LinkMolay é um produto reservado e exclusivo para a comunidade DeMolay e Maçônica. Todos os direitos reservados.
