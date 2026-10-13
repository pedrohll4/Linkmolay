import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Job, Company, JobApplication } from '../types';
import { VerifiedBadge } from '../components/common/Badges';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Send,
  FileCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isDeMolay } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [existingApplication, setExistingApplication] = useState<JobApplication | null>(null);

  // Application modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [customResumeUrl, setCustomResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successApplied, setSuccessApplied] = useState(false);

  const loadJob = () => {
    if (!id) return;
    const found = api.getJobById(id);
    setJob(found);

    if (found) {
      setCompany(api.getCompanyById(found.companyId));
      if (currentUser) {
        const apps = api.getApplicationsByCandidate(currentUser.id);
        const myApp = apps.find((a) => a.jobId === found.id);
        setExistingApplication(myApp || null);
        setCustomResumeUrl(currentUser.resumeUrl || '');
      }
    }
  };

  useEffect(() => {
    loadJob();
  }, [id, currentUser]);

  if (!job) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Vaga não encontrada ou encerrada.</p>
        <button
          onClick={() => navigate('/oportunidades')}
          className="mt-4 px-4 py-2 text-xs rounded-xl bg-gold-400 text-slate-950 font-bold"
        >
          Voltar para Vagas
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === job.publisherId;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      api.applyToJob({
        jobId: job.id,
        candidateId: currentUser.id,
        coverNote: coverNote.trim(),
        resumeUrl: customResumeUrl.trim() || undefined,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setShowApplyModal(false);
      setSuccessApplied(true);
      loadJob();
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar candidatura');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/oportunidades')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para todas as oportunidades
      </button>

      {successApplied && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Candidatura enviada com sucesso! O recrutador foi notificado.</span>
          </div>
          <Link to="/minhas-candidaturas" className="font-bold underline">
            Acompanhar status
          </Link>
        </div>
      )}

      {/* Main Job Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-navy-800 shrink-0 border border-gold-500/20">
              {job.companyLogoUrl ? (
                <img src={job.companyLogoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-gold-400 text-xl">
                  {job.companyName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {job.title}
                </h1>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
                  {job.contractType}
                </span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {job.workModel}
                </span>
              </div>

              <Link
                to={`/empresas/${job.companyId}`}
                className="text-xs sm:text-sm font-semibold text-gold-500 hover:underline flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" /> {job.companyName}
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.city} - {job.state}
                </span>

                {job.salaryMin && (
                  <span className="flex items-center gap-1 font-bold text-emerald-500 dark:text-emerald-400">
                    R$ {job.salaryMin.toLocaleString('pt-BR')} - R${' '}
                    {job.salaryMax?.toLocaleString('pt-BR')}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Publicada em{' '}
                  {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {isOwner ? (
              <Link
                to="/minhas-vagas"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-navy-900 text-white dark:bg-navy-800 hover:bg-navy-700 transition-all"
              >
                Gerenciar Candidatos ({job.applicationsCount || 0})
              </Link>
            ) : existingApplication ? (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-850 text-right">
                <div className="text-[11px] text-slate-400">Status da sua candidatura:</div>
                <div className="text-xs font-bold text-gold-500 uppercase mt-0.5">
                  {existingApplication.status.replace('_', ' ')}
                </div>
                <Link
                  to="/minhas-candidaturas"
                  className="text-[10px] text-blue-400 hover:underline mt-1 block"
                >
                  Ver no painel →
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all shadow-md active:scale-98 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Candidatar-se Agora
              </button>
            )}
          </div>
        </div>

        {/* Vacancy Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Descrição da Oportunidade
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-navy-800">
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Formação Desejada:
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.educationRequirement || 'Não especificada.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Experiência / Requisitos:
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.experienceRequirement || 'Aberto a novos talentos.'}
            </p>
          </div>
        </div>

        {/* Required Skills */}
        {job.requiredSkills.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Habilidades Desejadas
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-gold-500/10 text-gold-500 border border-gold-500/20"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Benefícios Oferecidos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {job.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company & Mason Owner Info Card */}
        {company && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-100 dark:border-navy-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Empresa Vinculada à Rede Maçônica
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {company.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proprietário: {company.ownerName || 'Maçom Verificado'}
              </p>
            </div>
            <Link
              to={`/empresas/${company.id}`}
              className="text-xs font-semibold text-gold-500 hover:underline shrink-0"
            >
              Conhecer a empresa →
            </Link>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Candidatar-se à Oportunidade
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{job.title}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gold-500/5 border border-gold-500/20 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-gold-500 mb-1">
                  Seu Perfil do LinkMolay será enviado ao recrutador:
                </p>
                <p className="text-[11px] text-slate-400">
                  Nome: {currentUser?.fullName} • Capítulo:{' '}
                  {currentUser?.demolayDetails?.chapterName || 'Informado'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Apresentação / Mensagem para o Recrutador (Opcional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Apresente brevemente seu interesse, seus projetos e por que você gostaria de atuar nesta oportunidade..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Link do Currículo em PDF
                </label>
                <input
                  type="url"
                  placeholder="https://link-do-curriculo.pdf"
                  value={customResumeUrl}
                  onChange={(e) => setCustomResumeUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar Candidatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
