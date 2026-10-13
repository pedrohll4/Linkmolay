import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProfile, Company } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { LinkedinIcon, GithubIcon } from '../components/common/SocialIcons';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  MapPin,
  Building2,
  FileText,
  UserPlus,
  MessageSquare,
  Clock,
  Phone,
  Globe,
  ArrowLeft,
  Shield,
  Landmark,
  Award,
  Crown,
  Briefcase,
  GraduationCap,
  Sparkles,
  Check,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [masonCompanies, setMasonCompanies] = useState<Company[]>([]);
  const [connectionState, setConnectionState] = useState<
    'none' | 'pending_sent' | 'pending_received' | 'connected'
  >('none');

  const loadProfile = () => {
    if (!id) return;
    const user = api.getUserById(id);
    setProfile(user);

    if (user?.role === 'mason') {
      setMasonCompanies(api.getCompaniesByOwner(user.id));
    }

    if (currentUser && user) {
      setConnectionState(api.getConnectionStatus(currentUser.id, user.id));
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id, currentUser]);

  if (!profile) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p className="font-serif text-lg">Perfil de membro não encontrado.</p>
        <Button
          variant="gold"
          size="sm"
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    );
  }

  const isDeMolay = profile.role === 'demolay';
  const isMason = profile.role === 'mason';
  const isSelf = currentUser?.id === profile.id;

  const handleConnect = () => {
    if (!currentUser || isSelf) return;
    try {
      api.sendConnectionRequest(currentUser.id, profile.id);
      loadProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStartChat = () => {
    if (!currentUser) return;
    navigate(`/mensagens?user=${profile.id}`);
  };

  const chapterTitle = isDeMolay
    ? profile.demolayDetails?.chapterName || 'Capítulo da Ordem DeMolay'
    : profile.masonDetails?.lodgeName || 'Loja Maçônica Regular';

  const rankTitle = isDeMolay
    ? profile.demolayDetails?.orderRank || 'DeMolay Ativo'
    : profile.masonDetails?.profession || 'Mestre Maçom';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-xs gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
      </Button>

      {/* 1. CREDENCIAL FRATERNAL EXECUTIVA */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-[#070D1E] via-[#0E162E] to-[#0A1124] text-white shadow-2xl">
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#070D1E] via-[#101B3D] to-[#0A1124] relative border-b border-amber-400/15">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
            <div className="flex items-end gap-5">
              <Avatar
                size="xl"
                withRing
                className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-[#070D1E] bg-[#0E162E] shadow-2xl shrink-0"
              >
                <AvatarImage src={profile.avatarUrl || ''} alt={profile.fullName} />
                <AvatarFallback className="text-3xl font-serif text-amber-300">
                  {profile.fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                    {profile.fullName}
                  </h1>
                  {profile.verified && (
                    <VerifiedBadge role={profile.role} size="sm" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-0.5 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  {chapterTitle}
                </p>

                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.city} - {profile.state}
                  <span>•</span>
                  <span className="text-slate-300">{rankTitle}</span>
                </p>
              </div>
            </div>

            {/* Ações de Conexão e Mensagens */}
            {!isSelf && (
              <div className="flex flex-wrap items-center gap-2">
                {connectionState === 'none' && (
                  <Button variant="gold" size="sm" onClick={handleConnect} className="gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Conectar
                  </Button>
                )}
                {connectionState === 'pending_sent' && (
                  <Button variant="secondary" size="sm" disabled className="gap-1.5 opacity-75">
                    <Clock className="w-3.5 h-3.5" /> Solicitação Enviada
                  </Button>
                )}
                {connectionState === 'connected' && (
                  <>
                    <Badge variant="success" className="px-3 py-1.5 text-xs gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Conectados
                    </Badge>
                    <Button variant="gold" size="sm" onClick={handleStartChat} className="gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Enviar Mensagem
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Destaque DeMolay Disponível para Emprego */}
          {isDeMolay && profile.demolayDetails?.openToWork && (
            <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              🟢 DISPONÍVEL PARA OPORTUNIDADES PROFISSIONAIS
            </div>
          )}

          {/* Barra de Credenciais: CID/CIM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-amber-400/15 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Registro</span>
                <span className="font-semibold text-white">
                  {isDeMolay
                    ? `CID: ${profile.demolayDetails?.cid || '98451'}`
                    : `CIM: ${profile.masonDetails?.cim || '12498'}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Grau / Status</span>
                <span className="font-semibold text-white">{rankTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Atuação</span>
                <span className="font-semibold text-white">
                  {isDeMolay
                    ? (profile.demolayDetails?.interestAreas?.[0] || 'Geral')
                    : (profile.masonDetails?.profession || 'Executivo')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Status</span>
                <span className="font-semibold text-emerald-400">Regular</span>
              </div>
            </div>
          </div>

          {/* Links e Contatos */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {profile.phone && profile.showPhone && (
              <a
                href={`https://wa.me/55${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp: {profile.phone}
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" /> GitHub
              </a>
            )}

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors ml-auto"
              >
                <FileText className="w-3.5 h-3.5" /> Ver Currículo (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. ABAS DE DETALHES SHADCN */}
      <Tabs defaultValue="visao_geral" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-xl">
          <TabsTrigger value="visao_geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="trajetoria">🏛️ Trajetória Fraternal</TabsTrigger>
          <TabsTrigger value="habilidades">🎓 Competências</TabsTrigger>
        </TabsList>

        <TabsContent value="visao_geral" className="space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-base font-serif">Sobre o Membro</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {profile.bio || 'Este membro ainda não informou sua biografia detalhada.'}
              </p>
            </CardContent>
          </Card>

          {/* Empresas Pertencentes ao Maçom */}
          {isMason && masonCompanies.length > 0 && (
            <Card variant="default">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  Empresas do Irmão Maçom
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {masonCompanies.map((comp) => (
                  <Link
                    key={comp.id}
                    to={`/empresas/${comp.id}`}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400/40 hover:bg-slate-50 dark:hover:bg-[#0E162E] transition-all"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {comp.name}
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                      {comp.segment}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-2 block">
                      {comp.city} - {comp.state}
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trajetoria" className="space-y-6">
          <Card variant="gold">
            <CardHeader className="pb-3 border-b border-amber-400/20">
              <CardTitle className="text-base font-serif text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                Formação de Liderança na Fraternidade
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-slate-200 text-sm">
              <div className="rounded-xl bg-[#070D1E]/60 p-4 border border-amber-400/20">
                <h4 className="font-serif font-bold text-base text-amber-300">
                  {chapterTitle}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Líder formado sob os preceitos de honra, companheirismo e responsabilidade cívica que caracterizam os quadros da Ordem.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Habilidades & Áreas de Domínio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {isDeMolay &&
                  profile.demolayDetails?.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                {isMason &&
                  profile.masonDetails?.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs px-3 py-1">
                      {s}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
