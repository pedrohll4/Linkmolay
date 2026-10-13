import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Target, HeartHandshake, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CampaignItem {
  id: string;
  title: string;
  chapterName: string;
  category: 'Filantropia' | 'Liderança' | 'Educação' | 'Comunidade';
  description: string;
  current: number;
  goal: number;
  unit: string;
  deadline: string;
  supportersCount: number;
}

export const ACTIVE_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-1',
    title: 'Inverno Fraterno: Agasalhos & Cestas Básicas',
    chapterName: 'Capítulo Ariquemes nº 85',
    category: 'Filantropia',
    description:
      'Mobilização conjunta entre os jovens DeMolays e as Lojas Maçônicas da região para arrecadação e distribuição para 120 famílias carentes.',
    current: 98,
    goal: 120,
    unit: 'famílias atendidas',
    deadline: 'Até 30 de Outubro',
    supportersCount: 46,
  },
  {
    id: 'camp-2',
    title: 'Bolsa de Estudos & Mentoria Jacques DeMolay',
    chapterName: 'Capítulo Porto Velho nº 48',
    category: 'Educação',
    description:
      'Fundo mantido por Tios Maçons empresários para custeio de certificações profissionais e cursos em tecnologia para DeMolays ativos.',
    current: 12,
    goal: 15,
    unit: 'bolsas concedidas',
    deadline: 'Inscrições abertas',
    supportersCount: 28,
  },
];

export const ChapterCampaignsCard: React.FC = () => {
  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-amber-400/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-500 dark:text-amber-300">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-serif">
                Mural de Projetos & Campanhas dos Capítulos
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Iniciativas filantrópicas e cívicas lideradas pela juventude e apoiadas pela Maçonaria
              </p>
            </div>
          </div>
          <Link to="/capitulos">
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-amber-600 dark:text-amber-400">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {ACTIVE_CAMPAIGNS.map((camp) => {
          const progressPercent = Math.round((camp.current / camp.goal) * 100);
          return (
            <div
              key={camp.id}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-[#070D1E]/60 p-4 transition-all hover:border-amber-400/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="chapter" className="text-[10px]">
                    {camp.chapterName}
                  </Badge>
                  <Badge variant="gold" className="text-[10px]">
                    {camp.category}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-500" />
                  {camp.deadline}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                {camp.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {camp.description}
              </p>

              {/* Barra de Progresso Dourada */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    Progresso: <strong className="text-amber-500">{camp.current}</strong> de {camp.goal} {camp.unit}
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {progressPercent}%
                  </span>
                </div>
                <Progress value={progressPercent} max={100} variant="gold" />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  {camp.supportersCount} Irmãos e Tios participando
                </span>
                <Button variant="goldOutline" size="sm" className="h-7 text-xs px-2.5">
                  Participar / Doar
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
