import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Job, WorkModel, ContractType } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import {
  Briefcase,
  Search,
  MapPin,
  Filter,
  DollarSign,
  Clock,
  Building2,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const JobsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const { isMason, isAdmin } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  useEffect(() => {
    setJobs(api.getJobs());
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (job.status !== 'aberta') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = job.companyName.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
      const matchCity = job.city.toLowerCase().includes(q);
      if (!matchTitle && !matchComp && !matchSkills && !matchCity) return false;
    }

    if (selectedModel !== 'all' && job.workModel !== selectedModel) return false;
    if (selectedContract !== 'all' && job.contractType !== selectedContract) return false;
    if (selectedState !== 'all' && job.state !== selectedState) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-gold-500" /> Oportunidades & Vagas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vagas exclusivas oferecidas por empresários e profissionais Maçons para talentos DeMolay.
          </p>
        </div>

        {(isMason || isAdmin) && (
          <Link
            to="/minhas-vagas"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Publicar Oportunidade
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cargo, tecnologia, empresa ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          {/* Modelo */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Modelo:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
              <option value="remoto">Remoto</option>
            </select>
          </div>

          {/* Contrato */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Contrato:</span>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="clt">CLT</option>
              <option value="pj">PJ</option>
              <option value="estagio">Estágio</option>
              <option value="jovem_aprendiz">Jovem Aprendiz</option>
              <option value="temporario">Temporário</option>
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Estado:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="RO">Rondônia (RO)</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="DF">Distrito Federal (DF)</option>
            </select>
          </div>

          {(searchTerm || selectedModel !== 'all' || selectedContract !== 'all' || selectedState !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedModel('all');
                setSelectedContract('all');
                setSelectedState('all');
              }}
              className="text-xs text-rose-500 hover:underline ml-auto"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Jobs Listing Grid */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Nenhuma oportunidade encontrada"
          description="Tente ajustar os filtros ou pesquisar com outros termos para encontrar vagas compatíveis."
        />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs hover:border-gold-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-800 shrink-0 border border-gold-500/20">
                  {job.companyLogoUrl ? (
                    <img src={job.companyLogoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gold-400 text-lg">
                      {job.companyName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors">
                      {job.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
                      {job.contractType}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {job.workModel}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {job.companyName}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.city} - {job.state}
                    </span>

                    {job.salaryMin && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-500 dark:text-emerald-400">
                        R$ {job.salaryMin.toLocaleString('pt-BR')} - R${' '}
                        {job.salaryMax?.toLocaleString('pt-BR')}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Publicada há pouco
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[11px] text-slate-400">
                        +{job.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-navy-800">
                <Link
                  to={`/oportunidades/${job.id}`}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  Ver Detalhes & Candidatar-se
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
