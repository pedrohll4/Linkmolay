import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Company, Job, UserProfile } from '../types';
import { VerifiedBadge } from '../components/common/Badges';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!id) return;
    const comp = api.getCompanyById(id);
    setCompany(comp);

    if (comp) {
      setOwner(api.getUserById(comp.ownerId));
      const allJobs = api.getJobs();
      setJobs(allJobs.filter((j) => j.companyId === comp.id && j.status === 'aberta'));
    }
  }, [id]);

  if (!company) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Empresa não encontrada.</p>
        <button
          onClick={() => navigate('/empresas')}
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
        onClick={() => navigate('/empresas')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Empresas
      </button>

      {/* Header Banner & Profile */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
        <div className="h-40 sm:h-52 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 relative">
          {company.bannerUrl && (
            <img src={company.bannerUrl} alt="" className="w-full h-full object-cover opacity-50" />
          )}
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-navy-800 border-4 border-white dark:border-navy-900 shadow-xl flex items-center justify-center font-bold text-2xl text-gold-400">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{company.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="mb-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {company.name}
                </h1>
                <span className="text-xs font-semibold text-gold-500 block mt-0.5">
                  {company.segment}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {company.city} - {company.state}
                </p>
              </div>
            </div>

            {/* Links and Socials */}
            <div className="flex flex-wrap items-center gap-2">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-navy-850 text-slate-700 dark:text-slate-300"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Website
                </a>
              )}
              {company.whatsapp && (
                <a
                  href={`https://wa.me/55${company.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-medium"
                >
                  <Phone className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Sobre a Empresa
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          </div>

          {/* Verification / Mason Link Card */}
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 text-xs">
                M
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 block">
                  Empresa Pertencente à Rede de Maçom Verificado
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {company.ownerName || 'Carlos Eduardo da Silva'}
                </h4>
              </div>
            </div>

            {owner && (
              <Link
                to={`/perfil/${owner.id}`}
                className="text-xs font-bold text-gold-500 hover:underline shrink-0"
              >
                Ver perfil do Maçom →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Open Vacancies at this Company */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gold-500" /> Vagas Abertas nesta Empresa ({jobs.length})
          </h3>
        </div>

        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Esta empresa não possui vagas abertas no momento.
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-850/60 flex items-center justify-between gap-4 hover:border-gold-500/30 transition-all"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>
                      {job.city} - {job.state}
                    </span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-gold-500">
                      {job.contractType}
                    </span>
                    <span>•</span>
                    <span>{job.workModel}</span>
                  </div>
                </div>

                <Link
                  to={`/oportunidades/${job.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all"
                >
                  Candidatar-se
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
