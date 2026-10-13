import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { LinkedinIcon, GithubIcon, InstagramIcon } from '../components/common/SocialIcons';
import { ImageUploadModal } from '../components/common/ImageUploadModal';
import { Experience, Education, Project } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Phone,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Building2,
  Sparkles,
  Award,
  Landmark,
  Shield,
  Heart,
  Crown,
  BookOpen,
  ArrowRight,
  Download,
  Camera,
  ImageIcon,
} from 'lucide-react';

const AVAILABLE_INTEREST_AREAS = [
  'Desenvolvimento',
  'Tecnologia',
  'Design',
  'Marketing',
  'Administração',
  'Vendas',
  'Engenharia',
  'Direito',
  'Contabilidade',
  'Atendimento',
  'Logística',
  'Técnico',
  'Estágio',
  'Jovem Aprendiz',
];

export const MyProfilePage: React.FC = () => {
  const { currentUser, role, isDeMolay, isMason, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Perfil atualizado com sucesso!');

  // Image Upload Modals State
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(currentUser?.bannerUrl || '');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [showPhone, setShowPhone] = useState(currentUser?.showPhone ?? true);
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(currentUser?.instagramUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolioUrl || '');
  const [resumeUrl, setResumeUrl] = useState(currentUser?.resumeUrl || '');

  // DeMolay fields
  const [openToWork, setOpenToWork] = useState(currentUser?.demolayDetails?.openToWork ?? false);
  const [interestAreas, setInterestAreas] = useState<string[]>(
    currentUser?.demolayDetails?.interestAreas || []
  );
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(
    isDeMolay
      ? currentUser?.demolayDetails?.skills || []
      : currentUser?.masonDetails?.skills || []
  );

  // Mason fields
  const [profession, setProfession] = useState(currentUser?.masonDetails?.profession || '');
  const [lodgeName, setLodgeName] = useState(currentUser?.masonDetails?.lodgeName || '');

  // Experience modal/add
  const [experiences, setExperiences] = useState<Experience[]>(currentUser?.experiences || []);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpYear, setNewExpYear] = useState('');

  if (!currentUser) return null;

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
    api.updateProfile(currentUser.id, { avatarUrl: newUrl });
    refreshUser();
    showNotification('Foto de perfil atualizada com sucesso!');
  };

  const handleSaveBanner = (newUrl: string) => {
    setBannerUrl(newUrl);
    api.updateProfile(currentUser.id, { bannerUrl: newUrl });
    refreshUser();
    showNotification('Capa de perfil atualizada com sucesso!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: any = {
      fullName,
      city,
      state,
      bio,
      phone,
      showPhone,
      linkedinUrl,
      githubUrl,
      instagramUrl,
      portfolioUrl,
      resumeUrl,
      experiences,
      avatarUrl,
      bannerUrl,
    };

    if (isDeMolay) {
      updates.demolayDetails = {
        ...currentUser.demolayDetails,
        openToWork,
        interestAreas,
        skills,
      };
    } else if (isMason) {
      updates.masonDetails = {
        ...currentUser.masonDetails,
        profession,
        lodgeName,
        skills,
      };
    }

    api.updateProfile(currentUser.id, updates);
    refreshUser();
    setIsEditing(false);
    showNotification('Perfil atualizado com sucesso!');
  };

  const toggleInterestArea = (area: string) => {
    if (interestAreas.includes(area)) {
      setInterestAreas(interestAreas.filter((a) => a !== area));
    } else {
      setInterestAreas([...interestAreas, area]);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddExperience = () => {
    if (!newExpRole.trim() || !newExpCompany.trim()) return;
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      profileId: currentUser.id,
      companyName: newExpCompany.trim(),
      role: newExpRole.trim(),
      startDate: newExpYear || '2023',
      isCurrent: true,
    };
    setExperiences([...experiences, newExp]);
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpYear('');
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const handleToggleOpenToWork = () => {
    if (!isDeMolay) return;
    const newStatus = !openToWork;
    setOpenToWork(newStatus);
    api.updateProfile(currentUser.id, {
      demolayDetails: {
        ...currentUser.demolayDetails!,
        openToWork: newStatus,
      },
    });
    refreshUser();
  };

  const chapterTitle = isDeMolay
    ? currentUser.demolayDetails?.chapterName || 'Capítulo Ariquemes nº 85'
    : currentUser.masonDetails?.lodgeName || 'Loja Maçônica Regular';

  const rankTitle = isDeMolay
    ? currentUser.demolayDetails?.orderRank || 'Sênior DeMolay / Past Mestre Conselheiro'
    : currentUser.masonDetails?.profession || 'Mestre Maçom';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 shadow-md">
          <Check className="w-5 h-5" /> {successMessage}
        </div>
      )}

      {/* 1. CARTÃO EXECUTIVO / CREDENCIAL FRATERNAL DE MEMBRO */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-[#070D1E] via-[#0E162E] to-[#0A1124] text-white shadow-2xl">
        {/* Banner de Fundo com Foto Personalizada ou Padrão Nobre */}
        <div className="h-48 sm:h-64 relative border-b border-amber-400/15 overflow-hidden bg-[#070D1E]">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Capa de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#070D1E] via-[#101B3D] to-[#0A1124]" />
          )}

          {/* Sombra sutil para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Botões do Topo da Capa */}
          <div className="absolute top-4 right-4 flex items-center gap-2.5 z-10">
            {/* Botão de Alterar Capa */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsBannerModalOpen(true)}
              className="gap-1.5 text-xs bg-slate-900/85 hover:bg-slate-900 text-white border border-amber-400/40 backdrop-blur-md shadow-lg cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Alterar Capa</span>
            </Button>

            {!isEditing ? (
              <Button
                variant="goldOutline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2 text-xs backdrop-blur-md"
              >
                <Edit2 className="w-3.5 h-3.5" /> Editar Meu Perfil
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs"
              >
                Cancelar Edição
              </Button>
            )}
          </div>
        </div>

        {/* Informações Principais do Membro */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
            <div className="flex items-end gap-5">
              {/* Avatar com Botão de Upload Direto */}
              <div className="relative group shrink-0">
                <Avatar
                  size="xl"
                  withRing
                  className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-[#070D1E] bg-[#0E162E] shadow-2xl overflow-hidden"
                >
                  <AvatarImage src={avatarUrl || ''} alt={currentUser.fullName} />
                  <AvatarFallback className="text-3xl font-serif text-amber-300">
                    {currentUser.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Botão Flutuante de Alterar Foto de Perfil */}
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl border-2 border-[#070D1E] transition-transform hover:scale-110 cursor-pointer"
                  title="Alterar foto de perfil"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                    {currentUser.fullName}
                  </h1>
                  {currentUser.verified && role && (
                    <VerifiedBadge role={role} size="sm" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-0.5 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  {chapterTitle}
                </p>

                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.city} - {currentUser.state}
                  <span>•</span>
                  <span className="text-slate-300">{rankTitle}</span>
                </p>
              </div>
            </div>

            {/* Chave de Disponibilidade para Vagas */}
            <div className="flex items-center gap-3">
              {isDeMolay && (
                <button
                  onClick={handleToggleOpenToWork}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    openToWork
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      openToWork ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  {openToWork
                    ? '🟢 DISPONÍVEL PARA OPORTUNIDADES'
                    : '⚪ Indisponível no momento'}
                </button>
              )}
            </div>
          </div>

          {/* Barra Rápida de Credenciais: CID/CIM, Status e Contatos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-amber-400/15 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Registro Oficial</span>
                <span className="font-semibold text-white">
                  {isDeMolay
                    ? `CID: ${currentUser.demolayDetails?.cid || '98451'}`
                    : `CIM: ${currentUser.masonDetails?.cim || '12498'}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Grau / Cargo</span>
                <span className="font-semibold text-white">{rankTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Área de Atuação</span>
                <span className="font-semibold text-white">
                  {isDeMolay
                    ? (currentUser.demolayDetails?.interestAreas?.[0] || 'Engenharia / TI')
                    : (currentUser.masonDetails?.profession || 'Diretoria Executiva')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Validação</span>
                <span className="font-semibold text-emerald-400">Regular & Ativo</span>
              </div>
            </div>
          </div>

          {/* Links Sociais e WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {currentUser.phone && currentUser.showPhone && (
              <a
                href={`https://wa.me/55${currentUser.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp: {currentUser.phone}
              </a>
            )}

            {currentUser.linkedinUrl && (
              <a
                href={currentUser.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}

            {currentUser.githubUrl && (
              <a
                href={currentUser.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" /> GitHub
              </a>
            )}

            {currentUser.resumeUrl && (
              <a
                href={currentUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors ml-auto"
              >
                <FileText className="w-3.5 h-3.5" /> Acessar Currículo (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. FORMULÁRIO DE EDIÇÃO (QUANDO ABERTO) */}
      {isEditing ? (
        <Card variant="glass" className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-amber-500" />
                Editar Informações do Perfil
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" size="sm" className="gap-1.5">
                  <Save className="h-3.5 w-3.5" /> Salvar Alterações
                </Button>
              </div>
            </div>

            {/* Atalhos Rápidos para Trocar Imagens no Modo de Edição */}
            <div className="p-4 rounded-xl border border-amber-400/20 bg-[#070D1E]/60 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-300">
                Deseja alterar suas fotos? Você pode selecionar qualquer arquivo do seu dispositivo ou escolher capas na galeria.
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="text-xs gap-1.5"
                >
                  <Camera className="h-3.5 w-3.5 text-amber-400" /> Foto de Perfil
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsBannerModalOpen(true)}
                  className="text-xs gap-1.5"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-amber-400" /> Capa de Fundo
                </Button>
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Biografia / Sobre mim */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sobre você (Biografia & Princípios de Liderança)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] p-3 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                placeholder="Conte sobre sua trajetória, valores aprendidos no Capítulo ou na Loja e aspirações de carreira..."
              />
            </div>

            {/* Contato & Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp com DDD
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(69) 99999-9999"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link do Currículo (PDF)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/seuperfil"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/seuperfil"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Áreas de Interesse (Para DeMolay) */}
            {isDeMolay && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Áreas de Interesse Profissional
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTEREST_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleInterestArea(area)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        interestAreas.includes(area)
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Card>
      ) : null}

      {/* 3. ABAS SHADCN: VISÃO GERAL, CAPÍTULO & LIDERANÇA, CARREIRA, HABILIDADES */}
      <Tabs defaultValue="visao_geral" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 max-w-2xl">
          <TabsTrigger value="visao_geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="capitulo">🏛️ Capítulo & Liderança</TabsTrigger>
          <TabsTrigger value="carreira">💼 Carreira & Projetos</TabsTrigger>
          <TabsTrigger value="habilidades">🎓 Competências</TabsTrigger>
        </TabsList>

        {/* ABA 1: VISÃO GERAL */}
        <TabsContent value="visao_geral" className="space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                Sobre Mim & Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentUser.bio ||
                  'Adicione uma breve biografia para destacar seu perfil para Irmãos e Tios Maçons recrutadores.'}
              </p>
            </CardContent>
          </Card>

          {isDeMolay && interestAreas.length > 0 && (
            <Card variant="default">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Áreas de Interesse para Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {interestAreas.map((area) => (
                    <Badge key={area} variant="gold" className="text-xs px-3 py-1">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA 2: CAPÍTULO & LIDERANÇA NA ORDEM DEMOLAY */}
        <TabsContent value="capitulo" className="space-y-6">
          <Card variant="gold">
            <CardHeader className="pb-3 border-b border-amber-400/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Trajetória Capitular & Formação em Liderança
                </CardTitle>
                <Badge variant="verified">Ordem DeMolay</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-slate-200 text-sm">
              <div className="rounded-xl bg-[#070D1E]/60 p-4 border border-amber-400/20 space-y-2">
                <h4 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  {chapterTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A formação recebida no Capítulo desenvolve oratória pública, liderança de equipes, gestão de projetos filantrópicos e respeito intransigente às 7 Virtudes Cardeais.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070D1E]/40">
                  <span className="block text-[11px] text-amber-400 font-semibold uppercase">
                    Grau na Ordem
                  </span>
                  <span className="font-medium text-white">{rankTitle}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070D1E]/40">
                  <span className="block text-[11px] text-amber-400 font-semibold uppercase">
                    Identificação Fraternal
                  </span>
                  <span className="font-medium text-white">
                    {isDeMolay
                      ? `CID: ${currentUser.demolayDetails?.cid || '98451'}`
                      : `CIM: ${currentUser.masonDetails?.cim || '12498'}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: CARREIRA & PROJETOS */}
        <TabsContent value="carreira" className="space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-amber-500" />
                  Experiências Profissionais
                </CardTitle>
                {isEditing && (
                  <Button size="sm" variant="goldOutline" onClick={handleAddExperience} className="text-xs">
                    + Adicionar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {experiences.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Nenhuma experiência cadastrada até o momento.
                </p>
              ) : (
                experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070D1E]/40"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {exp.companyName}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        Início: {exp.startDate} {exp.isCurrent && '(Atual)'}
                      </span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 4: COMPETÊNCIAS & HABILIDADES */}
        <TabsContent value="habilidades" className="space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-500" />
                Competências & Habilidades Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Digite uma competência e aperte Enter..."
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1E] px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  />
                  <Button size="sm" variant="gold" onClick={() => handleAddSkill({ key: 'Enter', preventDefault: () => {} } as any)} className="text-xs">
                    Adicionar
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Nenhuma competência adicionada ainda.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs px-3 py-1 gap-1.5">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 4. MODAIS DE UPLOAD DE IMAGEM */}
      <ImageUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleSaveAvatar}
        title="Alterar Foto de Perfil"
        type="avatar"
        currentImage={avatarUrl}
      />

      <ImageUploadModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSave={handleSaveBanner}
        title="Alterar Capa do Perfil"
        type="banner"
        currentImage={bannerUrl}
      />
    </div>
  );
};
