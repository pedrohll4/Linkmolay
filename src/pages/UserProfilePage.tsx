import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProfile, Company } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { LinkedinIcon, GithubIcon } from '../components/common/SocialIcons';
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
      <div className="p-8 text-center text-slate-400">
        <p>Perfil de membro não encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-xs rounded-xl bg-gold-400 text-slate-950 font-bold"
        >
          Voltar
        </button>
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
    // Go to chat with this participant
    navigate(`/mensagens?user=${profile.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
      </button>

      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
        <div className="h-36 sm:h-48 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-800" />

        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-navy-800 border-4 border-white dark:border-navy-900 shadow-xl flex items-center justify-center font-bold text-2xl text-gold-400">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile.fullName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {profile.fullName}
                  </h1>
                  {profile.verified && <VerifiedBadge role={profile.role} size="sm" />}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {profile.city} - {profile.state}
                  <span>•</span>
                  {isDeMolay && <span>{profile.demolayDetails?.chapterName}</span>}
                  {isMason && <span>{profile.masonDetails?.lodgeName}</span>}
                </p>
              </div>
            </div>

            {/* Interaction Buttons */}
            {!isSelf && (
              <div className="flex items-center gap-2.5">
                {connectionState === 'connected' ? (
                  <button
                    onClick={handleStartChat}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Enviar Mensagem
                  </button>
                ) : connectionState === 'pending_sent' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> Solicitação Enviada
                  </span>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 dark:bg-navy-800 text-white hover:bg-navy-800 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-gold-400" /> Conectar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Open to Work Flag */}
          {isDeMolay && profile.demolayDetails?.openToWork && (
            <div className="mb-6">
              <OpenToWorkBadge />
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sobre
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.bio || 'Este membro ainda não adicionou uma biografia detalhada.'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            {profile.phone && profile.showPhone && (
              <a
                href={`https://wa.me/55${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-medium"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-medium"
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-500/10 text-slate-400 text-xs font-medium"
              >
                <GithubIcon className="w-3.5 h-3.5" /> GitHub
              </a>
            )}

            {profile.resumeUrl && profile.showResume && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 text-gold-500 text-xs font-semibold ml-auto"
              >
                <FileText className="w-3.5 h-3.5" /> Baixar Currículo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mason Owned Companies Section */}
      {isMason && masonCompanies.length > 0 && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-500" /> Empresas deste Maçom
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {masonCompanies.map((comp) => (
              <Link
                key={comp.id}
                to={`/empresas/${comp.id}`}
                className="p-4 rounded-2xl border border-slate-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-850/60 hover:border-gold-500/30 transition-all flex items-start gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 shrink-0">
                  {comp.logoUrl && (
                    <img src={comp.logoUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors truncate">
                    {comp.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{comp.segment}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {comp.city} - {comp.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {((isDeMolay && profile.demolayDetails?.skills?.length) ||
        (isMason && profile.masonDetails?.skills?.length)) && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Habilidades & Competências
          </h3>
          <div className="flex flex-wrap gap-2">
            {(isDeMolay ? profile.demolayDetails?.skills : profile.masonDetails?.skills)?.map(
              (skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-navy-700"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Experiences */}
      {profile.experiences && profile.experiences.length > 0 && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Experiência
          </h3>
          <div className="space-y-3">
            {profile.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-100 dark:border-navy-800"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {exp.role}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400">{exp.companyName}</div>
                {exp.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
