import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { JobApplication } from '../types';
import { ApplicationStatusBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (currentUser) {
      setApplications(api.getApplicationsByCandidate(currentUser.id));
    }
  }, [currentUser]);

  const getStepIndex = (status: JobApplication['status']) => {
    switch (status) {
      case 'enviada':
        return 1;
      case 'visualizada':
      case 'em_analise':
        return 2;
      case 'entrevista':
        return 3;
      case 'aprovado':
      case 'rejeitado':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileCheck className="w-6 h-6 text-gold-500" /> Minhas Candidaturas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Acompanhe o status e as etapas de seus processos seletivos na rede LinkMolay.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Você ainda não enviou nenhuma candidatura"
          description="Explore as oportunidades publicadas por empresários Maçons e candidate-se com seu perfil DeMolay."
          actionText="Buscar Oportunidades"
          onAction={() => (window.location.href = '/oportunidades')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const step = getStepIndex(app.status);

            return (
              <div
                key={app.id}
                className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gold-500" />
                      <span>{app.companyName}</span>
                      <span>•</span>
                      <span>
                        Enviada em {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={app.status} />
                    <Link
                      to={`/oportunidades/${app.jobId}`}
                      className="text-xs font-semibold text-gold-500 hover:underline flex items-center gap-1"
                    >
                      Ver Vaga <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Visual Step Tracker */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                          step >= 1
                            ? 'bg-gold-500 text-slate-950 shadow-xs'
                            : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
                        }`}
                      >
                        1
                      </div>
                      <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        Enviada
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                          step >= 2
                            ? 'bg-gold-500 text-slate-950 shadow-xs'
                            : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
                        }`}
                      >
                        2
                      </div>
                      <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        Em Análise
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                          step >= 3
                            ? 'bg-gold-500 text-slate-950 shadow-xs'
                            : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
                        }`}
                      >
                        3
                      </div>
                      <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        Entrevista
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                          step >= 4
                            ? app.status === 'aprovado'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-500 text-white'
                            : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
                        }`}
                      >
                        {step >= 4 ? '✓' : '4'}
                      </div>
                      <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        {app.status === 'aprovado'
                          ? 'Aprovado!'
                          : app.status === 'rejeitado'
                          ? 'Finalizado'
                          : 'Conclusão'}
                      </span>
                    </div>
                  </div>
                </div>

                {app.coverNote && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-100 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Sua mensagem enviada:
                    </span>
                    "{app.coverNote}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
