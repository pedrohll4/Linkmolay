import React, { useState } from 'react';
import { UserProfile, Chapter } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Heart,
  Sparkles,
  Users,
  ShieldCheck,
  Award,
  Compass,
  Building,
  Flag,
  ArrowRight,
  Flame,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChapterHeroBannerProps {
  user: UserProfile;
  chapter?: Chapter | null;
}

export const VIRTUES = [
  {
    id: 'filial',
    name: 'Amor Filial',
    latin: 'Amor Parentalis',
    icon: Heart,
    short: 'Piedade e honra aos pais',
    description:
      'A primeira e fundamental virtude. O respeito profundo, carinho e gratidão àqueles que nos deram a vida e nos ensinaram os primeiros passos éticos no mundo.',
    careerImpact:
      'Gera líderes gratos, com respeito à ancestralidade, empatia profunda e compromisso moral com suas origens.',
  },
  {
    id: 'reverencia',
    name: 'Reverência Sagrada',
    latin: 'Reverentia Divina',
    icon: Sparkles,
    short: 'Fé e respeito ao Sagrado',
    description:
      'O respeito ecumênico às crenças de todos os homens e o reconhecimento humilde de um Criador Supremo que nos guia.',
    careerImpact:
      'Inculca retidão de caráter, humildade intelectual e respeito absoluto à diversidade de credos no ambiente profissional.',
  },
  {
    id: 'cortesia',
    name: 'Cortesia',
    latin: 'Comitas',
    icon: Compass,
    short: 'Nobreza e elegância no trato',
    description:
      'A elegância no falar e no agir. Cavalheirismo, gentileza e empatia demonstrados tanto com o mais humilde quanto com o mais poderoso.',
    careerImpact:
      'Habilidade chave em liderança executiva: comunicação assertiva, escuta ativa e elegância em negociações complexas.',
  },
  {
    id: 'companheirismo',
    name: 'Companheirismo',
    latin: 'Fraternitas',
    icon: Users,
    short: 'Lealdade inabalável entre Irmãos',
    description:
      'A chama da amizade leal que nada pode apagar. Apoiar o Irmão na adversidade e celebrar com alegria suas vitórias.',
    careerImpact:
      'Capacidade ímpar de trabalhar em equipe, construir redes de apoio confiáveis e fortalecer a cultura corporativa.',
  },
  {
    id: 'fidelidade',
    name: 'Fidelidade',
    latin: 'Fidelitas',
    icon: ShieldCheck,
    short: 'Honra aos juramentos e princípios',
    description:
      'A palavra dada é sagrada. Manter-se fiel aos seus ideais, ao seu Capítulo, à sua pátria e aos seus compromissos firmados.',
    careerImpact:
      'O atributo mais valorizado por empresários e Tios Maçons: integridade contratual, confidencialidade e confiabilidade irrestrita.',
  },
  {
    id: 'pureza',
    name: 'Pureza',
    latin: 'Puritas',
    icon: Flame,
    short: 'Integridade de mente, corpo e alma',
    description:
      'Manter os pensamentos límpidos, as mãos limpas de corrupção e o corpo preservado com hábitos nobres e honrados.',
    careerImpact:
      'Governança ética transparente, rejeição a atalhos desonestos e reputação impecável diante do mercado.',
  },
  {
    id: 'patriotismo',
    name: 'Patriotismo',
    latin: 'Patria et Honor',
    icon: Flag,
    short: 'Liderança ética e devoção cívica',
    description:
      'O compromisso em ser um cidadão exemplar, cumpridor das leis, defensor da justiça e construtor do progresso da nação.',
    careerImpact:
      'Visão de longo prazo, responsabilidade socioambiental (ESG) e vocação para construir empreendimentos que transformem a sociedade.',
  },
];

export const ChapterHeroBanner: React.FC<ChapterHeroBannerProps> = ({ user, chapter }) => {
  const [selectedVirtue, setSelectedVirtue] = useState<(typeof VIRTUES)[0] | null>(null);

  const isMason = user.role === 'mason';
  const chapterName = chapter?.name || user.demolayDetails?.chapterName || 'Capítulo da Ordem DeMolay';
  const chapterNumber = chapter?.number || 85;
  const state = chapter?.state || user.state || 'BR';

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-[#070D1E] via-[#0D1530] to-[#080E23] p-6 md:p-8 text-white shadow-2xl shadow-black/40">
        {/* Glow de fundo dourado e safira */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        {/* Marca d'água geométrica sacra / brasão sutil */}
        <div className="pointer-events-none absolute right-6 bottom-4 opacity-5 hidden lg:block">
          <svg width="260" height="260" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="currentColor" strokeWidth="1" fill="none" />
            <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Topo do Banner: Brasão, Identificação do Capítulo e Lema */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-amber-400/15">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              {/* Brasão Heráldico */}
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent p-0.5 border border-amber-400/40 shadow-inner shadow-amber-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#091024]">
                  <Award className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-amber-400 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-400 text-[#070D1E] font-bold text-[10px] sm:text-xs shadow-md">
                  ★
                </div>
              </div>

              {/* Títulos e Saudação Fraternal */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <Badge variant="verified" className="text-[10px] sm:text-[11px] tracking-wide uppercase px-2 py-0.5">
                    {isMason ? '✓ Maçom Regular' : '✓ DeMolay Ativo'}
                  </Badge>
                  <span className="text-[11px] sm:text-xs text-amber-300/80 font-medium tracking-wide truncate">
                    {isMason ? (user.masonDetails?.lodgeName || 'Loja Maçônica') : `${chapterName} nº ${chapterNumber}`}
                  </span>
                </div>

                <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">
                  {isMason ? 'Respeitável Irmão ' : 'Saudações Fraternais, Irmão '}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    {user.fullName.split(' ')[0]}
                  </span>
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
                  {isMason
                    ? 'Bem-vindo ao centro de conexão da Maçonaria com os jovens talentos da Ordem DeMolay. Suas oportunidades constroem o futuro da nossa Fraternidade.'
                    : `Sua jornada de liderança começou no altar do ${chapterName}. Aqui no LinkMolay, seus valores fraternais abrem as portas do mercado profissional.`}
                </p>
              </div>
            </div>

            {/* Ação rápida para ver o Capítulo */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0 w-full sm:w-auto">
              {chapter && (
                <Link to={`/capitulos/${chapter.id}`} className="w-full sm:w-auto">
                  <Button variant="goldOutline" size="sm" className="w-full sm:w-auto gap-2 text-xs">
                    <Building className="h-3.5 w-3.5" />
                    Página do Capítulo
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* As 7 Virtudes Cardeais da Ordem DeMolay */}
          <div className="pt-5 sm:pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 font-sans">
                  As Sete Virtudes Cardeais que Moldam Nossos Líderes
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                Clique em uma virtude para entender seu impacto na carreira
              </span>
              <span className="text-[10px] text-amber-400/80 font-medium sm:hidden flex items-center gap-1">
                Deslize para ver todas →
              </span>
            </div>

            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {VIRTUES.map((virtue, index) => {
                const Icon = virtue.icon;
                return (
                  <button
                    key={virtue.id}
                    onClick={() => setSelectedVirtue(virtue)}
                    className="group relative flex flex-col items-center justify-center rounded-xl border border-amber-400/20 bg-[#0E162E]/70 p-2.5 text-center transition-all duration-200 hover:border-amber-400/60 hover:bg-[#131D3B] hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer min-w-[110px] sm:min-w-0 shrink-0 sm:shrink"
                  >
                    <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-amber-200 line-clamp-1">
                      {virtue.name}
                    </span>
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                      {virtue.short}
                    </span>
                    <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A1124] border border-amber-400/30 text-[9px] text-amber-300">
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Dialog Informativo da Virtude Selecionada */}
      {selectedVirtue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card
            variant="gold"
            className="w-full max-w-lg border-amber-400/40 bg-[#0D1530] text-white p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedVirtue(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-amber-400/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-lg">
                {React.createElement(selectedVirtue.icon, { className: 'h-7 w-7' })}
              </div>
              <div>
                <span className="text-xs uppercase font-semibold tracking-widest text-amber-300">
                  {selectedVirtue.latin}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedVirtue.name}
                </h3>
                <p className="text-xs text-slate-300 italic">
                  "{selectedVirtue.short}"
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h5 className="text-xs font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <Info className="h-3.5 w-3.5" />
                  Significado na Ordem DeMolay
                </h5>
                <p className="text-slate-200 leading-relaxed bg-[#070D1E]/60 p-3 rounded-lg border border-slate-800">
                  {selectedVirtue.description}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  <Award className="h-3.5 w-3.5" />
                  Diferencial no Mercado & Carreira Profissional
                </h5>
                <p className="text-slate-200 leading-relaxed bg-[#070D1E]/60 p-3 rounded-lg border border-emerald-500/20">
                  {selectedVirtue.careerImpact}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="gold"
                size="sm"
                onClick={() => setSelectedVirtue(null)}
                className="w-full sm:w-auto"
              >
                Compreendi e Honrarei
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
