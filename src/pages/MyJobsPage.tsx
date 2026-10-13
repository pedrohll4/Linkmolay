import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Job, Company, JobApplication, ApplicationStatus, WorkModel, ContractType } from '../types';
import { ApplicationStatusBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import {
  Briefcase,
  Plus,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Calendar,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const MyJobsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // Create job modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [newCity, setNewCity] = useState('Ariquemes');
  const [newState, setNewState] = useState('RO');
  const [newWorkModel, setNewWorkModel] = useState<WorkModel>('presencial');
  const [newContractType, setNewContractType] = useState<ContractType>('clt');
  const [newSalaryMin, setNewSalaryMin] = useState('2500');
  const [newSalaryMax, setNewSalaryMax] = useState('3500');
  const [newDescription, setNewDescription] = useState('');
  const [newSkillsStr, setNewSkillsStr] = useState('React, TypeScript, Git');
  const [newBenefitsStr, setNewBenefitsStr] = useState('Vale Alimentação, Plano de Saúde');

  const loadData = () => {
    if (!currentUser) return;
    const comps = api.getCompaniesByOwner(currentUser.id);
    setMyCompanies(comps);
    if (comps.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(comps[0].id);
    }

    const jobs = api.getJobsByPublisher(currentUser.id);
    setMyJobs(jobs);

    if (jobs.length > 0) {
      const activeId = selectedJobId || jobs[0].id;
      setSelectedJobId(activeId);
      setJobApplications(api.getApplicationsByJob(activeId));
    } else {
      setSelectedJobId(null);
      setJobApplications([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setJobApplications(api.getApplicationsByJob(jobId));
  };

  const handleUpdateStatus = (appId: string, status: ApplicationStatus) => {
    api.updateApplicationStatus(appId, status);
    if (selectedJobId) {
      setJobApplications(api.getApplicationsByJob(selectedJobId));
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedCompanyId || !newTitle.trim()) return;

    const company = myCompanies.find((c) => c.id === selectedCompanyId);
    if (!company) return;

    const created = api.createJob({
      companyId: company.id,
      companyName: company.name,
      companyLogoUrl: company.logoUrl,
      publisherId: currentUser.id,
      publisherName: currentUser.fullName,
      title: newTitle.trim(),
      description: newDescription.trim(),
      city: newCity.trim(),
      state: newState.trim().toUpperCase(),
      workModel: newWorkModel,
      contractType: newContractType,
      salaryMin: Number(newSalaryMin) || undefined,
      salaryMax: Number(newSalaryMax) || undefined,
      salaryNegotiable: false,
      requiredSkills: newSkillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      benefits: newBenefitsStr.split(',').map((b) => b.trim()).filter(Boolean),
      status: 'aberta',
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    loadData();
    setSelectedJobId(created.id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-gold-500" /> Minhas Vagas & Gestão de Candidatos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de processos seletivos e candidaturas das suas empresas.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" /> Nova Vaga
        </button>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Você ainda não publicou nenhuma vaga"
          description="Publique oportunidades para suas empresas e receba candidaturas dos jovens DeMolays."
          actionText="+ Publicar Primeira Vaga"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Job list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Suas Vagas Ativas ({myJobs.length})
            </h3>
            {myJobs.map((j) => (
              <div
                key={j.id}
                onClick={() => handleSelectJob(j.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedJobId === j.id
                    ? 'border-gold-500/50 bg-gold-500/5 dark:bg-navy-850 shadow-sm'
                    : 'border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {j.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-500">
                    {j.contractType.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {j.companyName} • {j.city} - {j.state}
                </div>
                <div className="flex items-center justify-between text-[11px] text-gold-500 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {j.applicationsCount || 0} candidatos
                  </span>
                  <span>Ver candidatos →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Applicants for selected job */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-navy-800">
                <div>
                  <span className="text-[11px] text-slate-400">Candidatos para a vaga:</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {myJobs.find((j) => j.id === selectedJobId)?.title || 'Selecione uma vaga'}
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold-500/10 text-gold-500">
                  {jobApplications.length} candidato(s)
                </span>
              </div>

              {jobApplications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nenhum talento se candidatou para esta vaga ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {jobApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl border border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-850/60 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0">
                            {app.candidateAvatarUrl && (
                              <img src={app.candidateAvatarUrl} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/perfil/${app.candidateId}`}
                              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-gold-500 transition-colors"
                            >
                              {app.candidateName}
                            </Link>
                            <div className="text-[11px] text-slate-400">
                              Candidatou-se em{' '}
                              {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <ApplicationStatusBadge status={app.status} />
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 text-xs rounded-xl bg-gold-500/10 text-gold-500 hover:bg-gold-500/20 font-semibold flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> Currículo
                            </a>
                          )}
                        </div>
                      </div>

                      {app.coverNote && (
                        <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-100 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                            Apresentação:
                          </span>
                          "{app.coverNote}"
                        </div>
                      )}

                      {/* Status Changing Select */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-navy-800 text-xs">
                        <span className="text-[11px] text-slate-400">Atualizar Etapa:</span>
                        {(['em_analise', 'entrevista', 'aprovado', 'rejeitado'] as ApplicationStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(app.id, st)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                app.status === st
                                  ? 'bg-gold-400 text-slate-950 shadow-xs'
                                  : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                              }`}
                            >
                              {st === 'em_analise'
                                ? 'Em Análise'
                                : st === 'entrevista'
                                ? 'Entrevista'
                                : st === 'aprovado'
                                ? 'Aprovar'
                                : 'Encerrar'}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Job */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold-500" /> Publicar Nova Oportunidade
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do Cargo / Vaga *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Desenvolvedor Front-end Júnior"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Empresa Contratante *
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                >
                  {myCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.segment})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo de Trabalho
                  </label>
                  <select
                    value={newWorkModel}
                    onChange={(e) => setNewWorkModel(e.target.value as WorkModel)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  >
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="remoto">Remoto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Contratação
                  </label>
                  <select
                    value={newContractType}
                    onChange={(e) => setNewContractType(e.target.value as ContractType)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  >
                    <option value="clt">CLT</option>
                    <option value="pj">PJ</option>
                    <option value="estagio">Estágio</option>
                    <option value="jovem_aprendiz">Jovem Aprendiz</option>
                    <option value="temporario">Temporário</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value.toUpperCase())}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faixa Salarial Mínima (R$)
                  </label>
                  <input
                    type="number"
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faixa Salarial Máxima (R$)
                  </label>
                  <input
                    type="number"
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição da Vaga e Responsabilidades *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Habilidades Exigidas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={newSkillsStr}
                  onChange={(e) => setNewSkillsStr(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gold-400 hover:bg-gold-300 text-slate-950"
                >
                  Publicar Vaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
