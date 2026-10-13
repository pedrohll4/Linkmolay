import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Briefcase,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  CheckCircle2,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-gold-500/20 selection:text-gold-300">
      {/* Top Institutional Header */}
      <nav className="border-b border-slate-200/80 dark:border-navy-850/80 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-navy-850 border border-gold-500/30 flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-lg text-gold-400 tracking-wider">LM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white">
                LINK<span className="text-gold-500 dark:text-gold-400">MOLAY</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Rede Profissional Exclusiva
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all shadow-sm active:scale-98"
              >
                Acessar Plataforma <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white transition-colors"
                >
                  Entrar na plataforma
                </Link>
                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all shadow-sm active:scale-98"
                >
                  Solicitar acesso
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200/80 dark:border-navy-850/80">
        <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 dark:text-gold-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Ecossistema fechado para DeMolays e Maçons</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-navy-950 dark:text-white mb-6 leading-[1.15]">
            Conectando talentos, oportunidades e a nossa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500">
              comunidade
            </span>.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Uma rede profissional exclusiva para DeMolays e Maçons, criada para conectar
            jovens líderes a oportunidades oferecidas por empresários da família maçônica e empresas parceiras.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-gold-400 hover:bg-gold-300 shadow-md transition-all active:scale-98"
            >
              Solicitar Acesso à Plataforma <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800/80 transition-all"
            >
              Já possuo acesso
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-navy-850/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Verificação Manual</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-500 dark:text-gold-400">+40 Capítulos</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Em mapeamento</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">Empresas</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">De membros maçons</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-500 dark:text-gold-400">Privado</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Sem cadastro irrestrito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Pillars: Para DeMolays & Para Maçons */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-950 dark:text-white mb-3">
            Construído para Fortalecer Nossa Rede
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Uma ponte direta entre o potencial da juventude DeMolay e a solidez profissional dos Maçons.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card DeMolay */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 dark:text-white mb-3">
                Para DeMolays
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Mostre sua formação acadêmica, suas habilidades e sua dedicação. Fique visível
                para vagas exclusivas oferecidas por empresários e profissionais liberais maçons.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Perfil profissional completo com indicador "Disponível para Oportunidades"',
                  'Disponibilização de currículo em PDF e portfólio',
                  'Candidaturas diretas às vagas de empresas da rede maçônica',
                  'Páginas dos Capítulos para integração e projetos sociais',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/cadastro?tipo=demolay"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 dark:text-gold-400 hover:underline"
            >
              Criar perfil como DeMolay <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card Maçom */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 dark:text-white mb-3">
                Para Maçons & Empresas
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Cadastre suas empresas, anuncie vagas e encontre jovens preparados, com ética,
                liderança e valores comprovados forjados na Ordem DeMolay.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Cadastre suas empresas com vínculo ao seu perfil verificado',
                  'Publique oportunidades de estágio, jovem aprendiz, CLT e PJ',
                  'Mecanismo de busca ativa de talentos por cidade, habilidades e área',
                  'Mensagens diretas com candidatos conectados',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/cadastro?tipo=mason"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 dark:text-gold-400 hover:underline"
            >
              Cadastrar-se como Maçom <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works: Manual verification & Security */}
      <section className="py-20 border-t border-slate-200/80 dark:border-navy-850/80 bg-slate-100/50 dark:bg-navy-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-4">
              <Lock className="w-3.5 h-3.5 text-gold-500" /> Segurança e Exclusividade
            </div>
            <h2 className="text-3xl font-bold text-navy-950 dark:text-white mb-3">
              Como Funciona o Acesso
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              O LinkMolay não possui cadastro aberto ao público geral. Todo membro passa por crivo institucional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-left">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Solicitação de Acesso
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Você informa seus dados, seu Capítulo DeMolay ou Loja Maçônica correspondente e grau na Ordem.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-left">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Verificação Manual
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A administração confirma o cadastro com as lideranças locais, garantindo a idoneidade e segurança do ambiente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Selo de Verificação
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seu perfil recebe o selo oficial "✓ DeMolay verificado" ou "✓ Maçom verificado", liberando vagas e conexões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-navy-900 to-navy-950 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Pronto para fazer parte do LinkMolay?
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
              Conecte-se hoje mesmo a uma rede pautada em confiança, propósito e oportunidades reais de crescimento profissional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/cadastro"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-gold-400 hover:bg-gold-300 shadow-md transition-all active:scale-98"
              >
                Solicitar Acesso Agora
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 transition-all"
              >
                Acessar Minha Conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-navy-850 py-10 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-navy-900 dark:text-white">LINKMOLAY</span>
            <span>— Rede Profissional DeMolay & Maçom</span>
          </div>
          <p>© {new Date().getFullYear()} LinkMolay. Todos os direitos reservados. Ambiente fechado e seguro.</p>
        </div>
      </footer>
    </div>
  );
};
