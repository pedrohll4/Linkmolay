import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { LinkedinIcon, GithubIcon, InstagramIcon } from '../components/common/SocialIcons';
import { Experience, Education, Project } from '../types';
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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> Perfil atualizado com sucesso!
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
        {/* Banner */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-800 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Editar Perfil
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-navy-800 border-4 border-white dark:border-navy-900 shadow-xl flex items-center justify-center font-bold text-2xl text-gold-400">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.fullName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentUser.fullName}
                  </h1>
                  {currentUser.verified && role && (
                    <VerifiedBadge role={role} size="sm" />
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {currentUser.city} - {currentUser.state}
                  <span>•</span>
                  {isDeMolay && (
                    <span>{currentUser.demolayDetails?.chapterName}</span>
                  )}
                  {isMason && (
                    <span>{currentUser.masonDetails?.lodgeName}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Badges / Availability */}
            <div className="flex flex-wrap items-center gap-2">
              {isDeMolay && currentUser.demolayDetails?.openToWork && (
                <OpenToWorkBadge />
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sobre mim
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {currentUser.bio || 'Adicione uma breve biografia para destacar seu perfil na rede.'}
            </p>
          </div>

          {/* Socials & Contact Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            {currentUser.phone && currentUser.showPhone && (
              <a
                href={`https://wa.me/55${currentUser.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp: {currentUser.phone}
              </a>
            )}

            {currentUser.linkedinUrl && (
              <a
                href={currentUser.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}

            {currentUser.githubUrl && (
              <a
                href={currentUser.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-500/10 text-slate-400 text-xs font-medium hover:bg-slate-500/20 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" /> GitHub
              </a>
            )}

            {currentUser.portfolioUrl && (
              <a
                href={currentUser.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> Portfólio
              </a>
            )}

            {currentUser.resumeUrl && (
              <a
                href={currentUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 text-gold-500 text-xs font-semibold hover:bg-gold-500/20 transition-colors ml-auto"
              >
                <FileText className="w-3.5 h-3.5" /> Visualizar Currículo (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Editing Form Container */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl border border-gold-500/30 bg-white dark:bg-navy-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-gold-500" /> Editar Dados do Perfil
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Salvar Alterações
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Biografia Profissional
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* DeMolay Specific Controls */}
          {isDeMolay && (
            <>
              <div className="p-4 rounded-2xl bg-gold-500/5 border border-gold-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Indicador "Estou procurando emprego"
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ativa a etiqueta "Disponível para Oportunidades" no topo do seu perfil e na busca de talentos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={openToWork}
                  onChange={(e) => setOpenToWork(e.target.checked)}
                  className="w-5 h-5 accent-gold-500 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Áreas de Interesse Profissional
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTEREST_AREAS.map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleInterestArea(area)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        interestAreas.includes(area)
                          ? 'bg-gold-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link do Currículo em PDF (Google Drive / Cloud)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
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
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portfólio URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* Areas of Interest (DeMolay) */}
      {isDeMolay && currentUser.demolayDetails?.interestAreas && currentUser.demolayDetails.interestAreas.length > 0 && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Áreas de Interesse
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.demolayDetails.interestAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-300 border border-gold-500/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Competências & Habilidades
          </h3>
          {isEditing && (
            <span className="text-[11px] text-slate-400">Pressione Enter para adicionar</span>
          )}
        </div>

        {isEditing && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Digite uma habilidade e pressione Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-navy-700"
            >
              {skill}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter((s) => s !== skill))}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Professional Experiences */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Experiência Profissional
        </h3>

        <div className="space-y-4">
          {experiences.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhuma experiência cadastrada ainda.</p>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-100 dark:border-navy-800 flex items-start justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {exp.companyName}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}

          {isEditing && (
            <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-navy-700 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                + Adicionar Nova Experiência
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Cargo (ex: Desenvolvedor Júnior)"
                  value={newExpRole}
                  onChange={(e) => setNewExpRole(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Empresa (ex: Silva Tecnologia)"
                  value={newExpCompany}
                  onChange={(e) => setNewExpCompany(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-navy-800 text-xs font-bold"
              >
                Adicionar à lista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
