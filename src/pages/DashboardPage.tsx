import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Post, Job, Chapter, PostType } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { ChapterHeroBanner } from '../components/common/ChapterHeroBanner';
import { ChapterCampaignsCard } from '../components/common/ChapterCampaignsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon,
  Send,
  Heart,
  MessageCircle,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  Landmark,
  ArrowRight,
  Shield,
  GraduationCap,
  Award,
  BookOpen,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import { uploadImageFile } from '../services/imageUpload';

export const DashboardPage: React.FC = () => {
  const { currentUser, role, isDeMolay, isMason, refreshUser } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [featuredChapters, setFeaturedChapters] = useState<Chapter[]>([]);
  const [userChapter, setUserChapter] = useState<Chapter | null>(null);
  const [connectionsCount, setConnectionsCount] = useState(0);

  // New post state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<PostType>('geral');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isUploadingPostImage, setIsUploadingPostImage] = useState(false);
  const postFileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePostFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPostImage(true);
      const uploadRes = await uploadImageFile(file, 'chapter-assets', 'banner');
      setNewPostImage(uploadRes.url);
      setShowImageInput(true);
    } catch (err) {
      alert('Erro ao carregar imagem para o post.');
    } finally {
      setIsUploadingPostImage(false);
    }
  };

  // Feed filter tab
  const [feedFilter, setFeedFilter] = useState<'all' | 'conquista' | 'projeto_capitulo' | 'vaga'>('all');

  // Comments state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const loadData = () => {
    if (!currentUser) return;
    const allPosts = api.getPosts();
    setPosts(allPosts);
    setRecommendedJobs(api.getJobs().filter((j) => j.status === 'aberta').slice(0, 3));
    
    const chapters = api.getChapters();
    setFeaturedChapters(chapters.slice(0, 2));

    // Find current user's chapter
    if (currentUser.demolayDetails?.chapterName) {
      const match = chapters.find((c) =>
        currentUser.demolayDetails?.chapterName.toLowerCase().includes(c.name.toLowerCase())
      );
      setUserChapter(match || chapters[0] || null);
    } else {
      setUserChapter(chapters[0] || null);
    }

    const conn = api.getUserConnections(currentUser.id);
    setConnectionsCount(conn.connections.length);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

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

  // Filtered posts
  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'all') return true;
    return p.type === feedFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO CAPITULAR & SAUDAÇÃO NOBRE (COM AS 7 VIRTUDES CARDEAIS) */}
      {currentUser && (
        <ChapterHeroBanner user={currentUser} chapter={userChapter} />
      )}

      {/* 2. KPIS EXECUTIVOS & IMPACTO FRATERNAL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* KPI 1: Status de Carreira */}
        <Card variant="default" className="p-3 sm:p-4 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Status Carreira
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {isDeMolay
              ? currentUser?.demolayDetails?.openToWork
                ? 'Disponível para Vagas'
                : 'Não buscando'
              : 'Empresa Recrutadora'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {isDeMolay ? 'Visível para Maçons' : 'Buscando jovens talentos'}
          </div>
        </Card>

        {/* KPI 2: Conexões na Fraternidade */}
        <Card variant="default" className="p-3 sm:p-4 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Rede Fraternal
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {connectionsCount} Irmãos
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Laços de amizade e negócios
          </div>
        </Card>

        {/* KPI 3: Vagas Exclusivas */}
        <Card variant="default" className="p-3 sm:p-4 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Oportunidades
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {recommendedJobs.length} Vagas Abertas
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Em empresas de Maçons
          </div>
        </Card>

        {/* KPI 4: Mentoria & Capítulos */}
        <Card variant="default" className="p-3 sm:p-4 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Capítulo Ativo
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {userChapter?.name || 'Capítulo Luciano de Assis nº 118'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {userChapter?.activeMembersCount || 42} membros regulares
          </div>
        </Card>
      </div>

      {/* 3. GRID PRINCIPAL (FEED FRATERNAL + PAINEL LATERAL DE CAPÍTULOS & OPORTUNIDADES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA CENTRAL & ESQUERDA (Feed e Publicações) */}
        <div className="lg:col-span-2 space-y-6">
          {/* MURAL DE CAMPANHAS DO CAPÍTULO */}
          <ChapterCampaignsCard />

          {/* CAIXA DE CRIAÇÃO DE POSTS ESTILO SHADCN */}
          <Card variant="glass" className="overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b border-slate-200/60 dark:border-amber-400/10">
              <div className="flex items-center gap-3">
                <Avatar withRing size="default">
                  <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.fullName} />
                  <AvatarFallback>{currentUser?.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Compartilhe com a Fraternidade
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Divulgue conquistas profissionais, projetos do Capítulo ou oportunidades
                  </p>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleCreatePost} className="p-4 space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Ex: 'Com muita honra iniciei meu estágio na área de Engenharia...' ou 'Nosso Capítulo arrecadou 120 cestas...'"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
              />

              <input
                type="file"
                ref={postFileInputRef}
                onChange={handlePostFileUpload}
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
              />

              {/* Preview da Imagem Anexada */}
              {newPostImage && (
                <div className="relative rounded-xl overflow-hidden border border-amber-400/40 bg-[#070D1E] p-1.5 max-w-sm">
                  <img
                    src={newPostImage}
                    alt="Preview do anexo"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewPostImage('');
                      setShowImageInput(false);
                    }}
                    className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 hover:bg-red-600 text-white text-xs cursor-pointer shadow-md transition-colors"
                    title="Remover foto"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {showImageInput && !newPostImage && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="Ou cole uma URL direta de imagem..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <select
                    value={newPostType}
                    onChange={(e) => setNewPostType(e.target.value as PostType)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="geral">Mensagem Geral</option>
                    <option value="conquista">🏆 Conquista Profissional</option>
                    <option value="projeto_capitulo">🏛️ Projeto do Capítulo</option>
                    <option value="evento">📅 Evento / Convocatória</option>
                    <option value="vaga">💼 Oportunidade / Vaga</option>
                  </select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => postFileInputRef.current?.click()}
                    disabled={isUploadingPostImage}
                    className="text-xs gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    {isUploadingPostImage ? (
                      <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-amber-500" />
                    )}
                    {newPostImage ? 'Trocar Foto' : 'Anexar Foto'}
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={!newPostContent.trim() || isSubmittingPost || isUploadingPostImage}
                  className="gap-2 text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Publicar
                </Button>
              </div>
            </form>
          </Card>

          {/* FILTRO DO FEED EM BOTÕES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Feed da Comunidade
            </h3>
            <div className="flex overflow-x-auto no-scrollbar gap-1 bg-slate-100 dark:bg-[#0A1124] p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs w-full sm:w-auto">
              <button
                onClick={() => setFeedFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  feedFilter === 'all'
                    ? 'bg-white dark:bg-amber-400/15 text-slate-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFeedFilter('conquista')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  feedFilter === 'conquista'
                    ? 'bg-white dark:bg-amber-400/15 text-slate-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏆 Conquistas
              </button>
              <button
                onClick={() => setFeedFilter('projeto_capitulo')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  feedFilter === 'projeto_capitulo'
                    ? 'bg-white dark:bg-amber-400/15 text-slate-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏛️ Capítulos
              </button>
              <button
                onClick={() => setFeedFilter('vaga')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  feedFilter === 'vaga'
                    ? 'bg-white dark:bg-amber-400/15 text-slate-900 dark:text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                💼 Vagas
              </button>
            </div>
          </div>

          {/* LISTA DE POSTS DO FEED */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
              const isExpandedComment = activeCommentPostId === post.id;

              return (
                <Card key={post.id} variant="default" className="overflow-hidden">
                  <div className="p-5">
                    {/* Header do Post */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/perfil/${post.authorId}`}>
                          <Avatar withRing size="default">
                            <AvatarImage src={post.authorAvatarUrl || ''} alt={post.authorName} />
                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/perfil/${post.authorId}`}
                              className="font-semibold text-sm text-slate-900 dark:text-white hover:text-amber-500 transition-colors"
                            >
                              {post.authorName}
                            </Link>
                            {post.authorVerified && (
                              <VerifiedBadge role={post.authorRole} size="sm" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            {post.chapterName && (
                              <span className="text-amber-500/90 font-medium">
                                {post.chapterName}
                              </span>
                            )}
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tag do Tipo de Post */}
                      <Badge
                        variant={
                          post.type === 'conquista'
                            ? 'gold'
                            : post.type === 'projeto_capitulo'
                            ? 'chapter'
                            : post.type === 'vaga'
                            ? 'success'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {post.type === 'conquista' && '🏆 Conquista'}
                        {post.type === 'projeto_capitulo' && '🏛️ Capítulo'}
                        {post.type === 'evento' && '📅 Evento'}
                        {post.type === 'vaga' && '💼 Vaga'}
                        {post.type === 'geral' && 'Publicação'}
                      </Badge>
                    </div>

                    {/* Conteúdo do Post */}
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    {/* Imagem do Post se houver */}
                    {post.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800">
                        <img
                          src={post.imageUrl}
                          alt="Anexo do post"
                          className="w-full max-h-96 object-cover"
                        />
                      </div>
                    )}

                    {/* Contadores e Ações */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isLiked
                              ? 'text-red-500 font-semibold'
                              : 'hover:text-red-500 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`}
                          />
                          <span>{post.likes.length}</span>
                        </button>

                        <button
                          onClick={() =>
                            setActiveCommentPostId(isExpandedComment ? null : post.id)
                          }
                          className="flex items-center gap-1.5 hover:text-amber-500 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments.length}</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        LinkMolay Fraternidade
                      </span>
                    </div>

                    {/* Área de Comentários Aberta */}
                    {isExpandedComment && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="space-y-2">
                          {post.comments.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-start gap-2.5 rounded-lg bg-slate-50 dark:bg-[#070D1E] p-2.5 text-xs"
                            >
                              <Avatar size="sm">
                                <AvatarImage src={c.authorAvatarUrl || ''} />
                                <AvatarFallback>{c.authorName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-900 dark:text-white">
                                    {c.authorName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(c.createdAt).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                                  {c.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Input de Novo Comentário */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Deixe uma palavra fraternal..."
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                          />
                          <Button
                            size="sm"
                            variant="gold"
                            onClick={() => handleAddComment(post.id)}
                            className="h-8 text-xs"
                          >
                            Enviar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* COLUNA LATERAL DIREITA (Oportunidades Maçônicas & Mentoria) */}
        <div className="space-y-6">
          {/* CARD DE VAGAS EM EMPRESAS DE MAÇONS */}
          <Card variant="glass">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-amber-400/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-sm font-serif">Oportunidades Maçônicas</CardTitle>
                </div>
                <Link to="/vagas">
                  <Button variant="link" size="sm" className="text-xs">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recommendedJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/vagas/${job.id}`}
                  className="block rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-[#070D1E]/40 p-3 transition-all hover:border-amber-400/40 hover:bg-[#0E162E]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white hover:text-amber-400 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {job.companyName}
                      </p>
                    </div>
                    <Badge variant="gold" className="text-[9px]">
                      {job.workModel}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      {job.city} - {job.state}
                    </span>
                    <span className="font-semibold text-emerald-500">
                      R$ {job.salaryMin} - {job.salaryMax}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* CARD CÍRCULO DE MENTORIA FRATERNAL */}
          <Card variant="gold" className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white">
                  Círculo de Mentoria Ativa
                </h4>
                <p className="text-[10px] text-amber-200/80">
                  Líderes Maçons orientando jovens DeMolays
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Empresários, magistrados, engenheiros e diretores de empresas conectando-se para aconselhamento profissional e aceleração de carreira.
            </p>
            <Link to="/talentos">
              <Button variant="gold" size="sm" className="w-full text-xs font-semibold gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Explorar Mentores & Talentos
              </Button>
            </Link>
          </Card>

          {/* CAPÍTULOS DESTAQUE */}
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-serif flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-amber-500" />
                  Capítulos em Destaque
                </CardTitle>
                <Link to="/capitulos">
                  <Button variant="link" size="sm" className="text-xs">
                    Todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {featuredChapters.map((chap) => (
                <Link
                  key={chap.id}
                  to={`/capitulos/${chap.id}`}
                  className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-[#0E162E] transition-colors border border-transparent hover:border-amber-400/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-serif font-bold text-xs border border-blue-500/20">
                      #{chap.number}
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                        {chap.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {chap.city} - {chap.state}
                      </span>
                    </div>
                  </div>
                  <Badge variant="chapter" className="text-[10px]">
                    {chap.activeMembersCount} membros
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
