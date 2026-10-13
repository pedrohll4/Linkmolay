import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Chapter, UserProfile, Post } from '../types';
import { VerifiedBadge } from '../components/common/Badges';
import { InstagramIcon } from '../components/common/SocialIcons';
import {
  Landmark,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  Heart,
  Award,
} from 'lucide-react';

export const ChapterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'sobre' | 'membros' | 'projetos' | 'eventos'>('sobre');
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [chapterPosts, setChapterPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) return;
    const ch = api.getChapterById(id);
    setChapter(ch);

    if (ch) {
      // Find members of this chapter
      const allUsers = api.getUsers();
      const chMembers = allUsers.filter(
        (u) =>
          u.role === 'demolay' &&
          u.status === 'approved' &&
          (u.demolayDetails?.chapterId === ch.id ||
            u.demolayDetails?.chapterName.includes(ch.name) ||
            u.demolayDetails?.chapterName.includes(ch.number.toString()))
      );
      setMembers(chMembers);

      // Find posts of this chapter
      const posts = api.getPosts().filter((p) => p.chapterId === ch.id);
      setChapterPosts(posts);
    }
  }, [id]);

  if (!chapter) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Capítulo não encontrado.</p>
        <button
          onClick={() => navigate('/capitulos')}
          className="mt-4 px-4 py-2 text-xs rounded-xl bg-gold-400 text-slate-950 font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/capitulos')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Capítulos
      </button>

      {/* Chapter Banner & Header Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
        <div className="h-44 sm:h-56 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 relative">
          {chapter.bannerUrl && (
            <img src={chapter.bannerUrl} alt="" className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-extrabold bg-navy-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
            Capítulo Oficial nº {chapter.number}
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-navy-800 border-4 border-white dark:border-navy-900 shadow-xl flex items-center justify-center font-bold text-2xl text-gold-400">
                {chapter.logoUrl ? (
                  <img src={chapter.logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>C{chapter.number}</span>
                )}
              </div>

              <div className="mb-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {chapter.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {chapter.city} - {chapter.state}
                  <span>•</span>
                  <span>{chapter.activeMembersCount || 42} DeMolays ativos</span>
                </p>
              </div>
            </div>
          </div>

          {/* 4 Community Tabs */}
          <div className="flex border-b border-slate-100 dark:border-navy-800 gap-6 text-xs font-semibold">
            {(['sobre', 'membros', 'projetos', 'eventos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize transition-all ${
                  activeTab === tab
                    ? 'text-gold-500 font-bold border-b-2 border-gold-500'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 1: Sobre */}
      {activeTab === 'sobre' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                História do Capítulo
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {chapter.history ||
                  'Este capítulo é dedicado à formação cívica, intelectual e de liderança dos jovens da região.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-navy-800 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mestre Conselheiro Atual:
                </span>
                <p className="text-gold-500 font-semibold">
                  {chapter.masterCouncilor || 'Liderança Ativa'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contatos Oficiais:
                </span>
                <div className="space-y-1 text-slate-500 dark:text-slate-400">
                  {chapter.contactEmail && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {chapter.contactEmail}
                    </div>
                  )}
                  {chapter.contactPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {chapter.contactPhone}
                    </div>
                  )}
                  {chapter.instagram && (
                    <div className="flex items-center gap-1.5">
                      <InstagramIcon className="w-3.5 h-3.5" /> {chapter.instagram}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Membros */}
      {activeTab === 'membros' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-850 flex items-center justify-between text-xs">
            <span className="text-slate-500">Membros cadastrados no LinkMolay deste capítulo:</span>
            <span className="font-bold text-gold-500">{members.length} membro(s)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((m) => (
              <Link
                key={m.id}
                to={`/perfil/${m.id}`}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 hover:border-gold-500/30 transition-all flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    m.fullName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors truncate">
                    {m.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {m.demolayDetails?.orderRank || 'DeMolay'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {m.city} - {m.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Projetos */}
      {activeTab === 'projetos' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Campanha Semestral de Arrecadação de Alimentos
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Projeto permanente do Capítulo que atende mais de 80 famílias em vulnerabilidade em cada gestão administrativa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Programa de Mentoria Profissional com Maçons da Região
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Rodadas de conversas bimestrais entre seniores, empresários da Loja mantenedora e DeMolays ativos sobre preparação para o mercado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Eventos */}
      {activeTab === 'eventos' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cerimônia Pública das Rosas & Instalação de Oficiais
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500">
                    Em Breve
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Sessão magna aberta para homenagear as mães e apresentar os projetos da nova gestão capitular à sociedade.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
