import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Post, Job, Chapter, PostType } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  Landmark,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, role, isDeMolay, isMason, refreshUser } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [featuredChapters, setFeaturedChapters] = useState<Chapter[]>([]);
  const [connectionsCount, setConnectionsCount] = useState(0);

  // New post state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<PostType>('geral');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Comments state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Onboarding checklist expanded
  const [showOnboarding, setShowOnboarding] = useState(true);

  const loadData = () => {
    if (!currentUser) return;
    setPosts(api.getPosts());
    setRecommendedJobs(api.getJobs().filter((j) => j.status === 'aberta').slice(0, 3));
    setFeaturedChapters(api.getChapters().slice(0, 2));

    const conn = api.getUserConnections(currentUser.id);
    setConnectionsCount(conn.connections.length);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!currentUser) return 0;
    let score = 0;
    let total = 7;

    if (currentUser.avatarUrl) score++;
    if (currentUser.bio && currentUser.bio.length > 15) score++;
    if (currentUser.city && currentUser.state) score++;
    if (currentUser.phone) score++;

    if (isDeMolay) {
      if (currentUser.demolayDetails?.skills?.length) score++;
      if (currentUser.demolayDetails?.openToWork !== undefined) score++;
      if (currentUser.resumeUrl || currentUser.demolayDetails?.institution) score++;
    } else {
      if (currentUser.masonDetails?.profession) score++;
      if (currentUser.masonDetails?.skills?.length) score++;
      if (currentUser.masonDetails?.lodgeName) score++;
    }

    return Math.round((score / total) * 100);
  };

  const completionPct = calculateProfileCompletion();

  // Toggle open to work
  const handleToggleOpenToWork = () => {
    if (!currentUser || !isDeMolay) return;
    const currentStatus = currentUser.demolayDetails?.openToWork ?? false;
    api.updateProfile(currentUser.id, {
      demolayDetails: {
        ...currentUser.demolayDetails!,
        openToWork: !currentStatus,
      },
    });
    refreshUser();
  };

  // Submit new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUser) return;

    setIsSubmittingPost(true);
    api.createPost({
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatarUrl: currentUser.avatarUrl,
      authorRole: currentUser.role,
      authorVerified: currentUser.verified,
      chapterName: currentUser.demolayDetails?.chapterName,
      type: newPostType,
      content: newPostContent.trim(),
      imageUrl: newPostImage.trim() || undefined,
      likes: [],
      comments: [],
    });

    setNewPostContent('');
    setNewPostImage('');
    setShowImageInput(false);
    setIsSubmittingPost(false);
    loadData();
  };

  // Like post
  const handleToggleLike = (postId: string) => {
    if (!currentUser) return;
    api.toggleLikePost(postId, currentUser.id);
    loadData();
  };

  // Add comment
  const handleAddComment = (postId: string) => {
    if (!commentText.trim() || !currentUser) return;
    api.addComment(postId, {
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      authorAvatarUrl: currentUser.avatarUrl,
      content: commentText.trim(),
    });
    setCommentText('');
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-gradient-to-r from-white via-white to-gold-500/5 dark:from-navy-900 dark:via-navy-900 dark:to-navy-850 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                Rede Profissional Exclusiva
              </span>
              {currentUser?.verified && role && (
                <VerifiedBadge role={role} size="sm" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white">
              Olá, {currentUser?.fullName.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {isDeMolay
                ? 'Conecte-se a Maçons líderes, explore vagas exclusivas e acelere seu futuro profissional.'
                : 'Publique vagas das suas empresas e encontre os melhores jovens talentos da Ordem DeMolay.'}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            {isDeMolay ? (
              <button
                onClick={handleToggleOpenToWork}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                  currentUser?.demolayDetails?.openToWork
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentUser?.demolayDetails?.openToWork
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {currentUser?.demolayDetails?.openToWork
                  ? 'Buscando Emprego (Ativo)'
                  : 'Ativar "Buscando Emprego"'}
              </button>
            ) : (
              <Link
                to="/minhas-vagas"
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all flex items-center gap-2 shadow-sm"
              >
                <Briefcase className="w-3.5 h-3.5" /> Publicar Nova Vaga
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4 Quick KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Disponibilidade */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Status Carreira
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {isDeMolay
              ? currentUser?.demolayDetails?.openToWork
                ? 'Disponível'
                : 'Não buscando'
              : 'Recrutador Ativo'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isDeMolay ? 'Visível para empresas' : 'Buscando talentos'}
          </div>
        </div>

        {/* Card 2: Perfil Completo % */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Perfil Completo
            </span>
            <div className="w-7 h-7 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {completionPct}%
            </div>
            <div className="text-[11px] text-gold-500 font-semibold">
              {completionPct >= 80 ? 'Excelente' : 'Completar'}
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-navy-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-gold-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Oportunidades Próximas */}
        <Link
          to="/oportunidades"
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs hover:border-gold-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Oportunidades
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {recommendedJobs.length} abertas
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 group-hover:text-gold-500 transition-colors">
            Explorar vagas →
          </div>
        </Link>

        {/* Card 4: Conexões na Rede */}
        <Link
          to="/rede"
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs hover:border-gold-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Minha Rede
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {connectionsCount} conexões
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 group-hover:text-gold-500 transition-colors">
            Ver solicitações →
          </div>
        </Link>
      </div>

      {/* Onboarding Checklist Box (Collapsible) */}
      {completionPct < 100 && (
        <div className="p-5 rounded-2xl border border-gold-500/20 bg-gold-500/5 dark:bg-navy-900/60">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowOnboarding(!showOnboarding)}>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {isDeMolay ? 'Vamos preparar seu perfil profissional:' : 'Complete as informações corporativas:'}
              </h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              {showOnboarding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showOnboarding && (
            <div className="mt-4 pt-3 border-t border-gold-500/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Link to="/meu-perfil" className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-navy-850 hover:bg-gold-500/10 transition-colors">
                <CheckCircle2 className={`w-3.5 h-3.5 ${currentUser?.avatarUrl ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className="truncate">Foto de Perfil</span>
              </Link>
              <Link to="/meu-perfil" className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-navy-850 hover:bg-gold-500/10 transition-colors">
                <CheckCircle2 className={`w-3.5 h-3.5 ${currentUser?.bio ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className="truncate">Biografia</span>
              </Link>
              <Link to="/meu-perfil" className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-navy-850 hover:bg-gold-500/10 transition-colors">
                <CheckCircle2 className={`w-3.5 h-3.5 ${(currentUser?.demolayDetails?.skills?.length || currentUser?.masonDetails?.skills?.length) ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className="truncate">Habilidades</span>
              </Link>
              <Link to="/meu-perfil" className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-navy-850 hover:bg-gold-500/10 transition-colors">
                <CheckCircle2 className={`w-3.5 h-3.5 ${currentUser?.resumeUrl ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className="truncate">{isDeMolay ? 'Currículo em PDF' : 'Empresa'}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Feed on Left (2 cols), Recommendations on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feed & Publishing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Box */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <form onSubmit={handleCreatePost}>
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.fullName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={
                    isDeMolay
                      ? 'Compartilhe um marco profissional, conquista ou projeto do seu Capítulo...'
                      : 'Divulgue novidades de suas empresas ou oportunidades para os DeMolays...'
                  }
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none"
                />
              </div>

              {showImageInput && (
                <div className="mb-3">
                  <input
                    type="url"
                    placeholder="URL da imagem (ex: https://images.unsplash.com/...)"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <select
                    value={newPostType}
                    onChange={(e) => setNewPostType(e.target.value as PostType)}
                    className="text-xs bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="geral">Geral</option>
                    <option value="conquista">Conquista Profissional</option>
                    <option value="projeto_capitulo">Projeto de Capítulo</option>
                    <option value="vaga">Oportunidade</option>
                    <option value="evento">Evento</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-gold-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    title="Adicionar imagem"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim() || isSubmittingPost}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Publicar
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              const hasLiked = currentUser ? post.likes.includes(currentUser.id) : false;

              return (
                <article
                  key={post.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs"
                >
                  {/* Post Author Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                        {post.authorAvatarUrl ? (
                          <img src={post.authorAvatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          post.authorName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {post.authorName}
                          </h4>
                          {post.authorVerified && (
                            <VerifiedBadge role={post.authorRole} size="sm" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          {post.chapterName && <span>{post.chapterName} • </span>}
                          {post.companyName && <span>{post.companyName} • </span>}
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                      {post.type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Post Content */}
                  {post.title && (
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Optional Image */}
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-navy-800 max-h-80">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Post Interactions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                        hasLiked
                          ? 'text-rose-500 font-bold bg-rose-500/10'
                          : 'hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-navy-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes.length} curtidas</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} comentários</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: post.title || 'LinkMolay', text: post.content });
                        }
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Compartilhar</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 space-y-3">
                      {post.comments.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {c.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                        </div>
                      ))}

                      {/* Add comment input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Escreva um comentário construtivo..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-2 text-xs font-semibold rounded-xl bg-gold-400 text-slate-950"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Recommended Jobs Widget */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-gold-500" />
                Vagas Recentes
              </h3>
              <Link to="/oportunidades" className="text-[11px] text-gold-500 hover:underline">
                Ver todas
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/oportunidades/${job.id}`}
                  className="block p-3 rounded-xl border border-slate-100 dark:border-navy-800 hover:border-gold-500/30 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-gold-500 transition-colors truncate">
                    {job.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {job.companyName}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.city} - {job.state}
                    </span>
                    <span className="uppercase font-semibold text-gold-500">
                      {job.contractType}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Chapters Spotlight Widget */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5 text-blue-400" />
                Capítulos em Foco
              </h3>
              <Link to="/capitulos" className="text-[11px] text-gold-500 hover:underline">
                Explorar
              </Link>
            </div>

            <div className="space-y-3">
              {featuredChapters.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/capitulos/${ch.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-navy-800 hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0">
                    {ch.logoUrl && (
                      <img src={ch.logoUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {ch.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {ch.city} - {ch.state} • {ch.activeMembersCount} membros
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
