import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  MapPin,
  Award,
  Sparkles,
  UserPlus,
  UserCheck,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

const INTEREST_AREAS = [
  'Todas as áreas',
  'Desenvolvimento',
  'Tecnologia',
  'Design',
  'Marketing',
  'Administração',
  'Finanças',
  'Engenharia',
  'Direito',
  'Contabilidade',
  'Estágio',
  'Jovem Aprendiz',
];

export const TalentSearchPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [talents, setTalents] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas as áreas');
  const [selectedState, setSelectedState] = useState('all');
  const [onlyOpenToWork, setOnlyOpenToWork] = useState(false);

  useEffect(() => {
    // Only approved DeMolay users
    const allUsers = api.getUsers();
    setTalents(allUsers.filter((u) => u.role === 'demolay' && u.status === 'approved'));
  }, []);

  const filteredTalents = talents.filter((t) => {
    if (onlyOpenToWork && !t.demolayDetails?.openToWork) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = t.fullName.toLowerCase().includes(q);
      const matchCity = t.city.toLowerCase().includes(q);
      const matchCourse = t.demolayDetails?.course?.toLowerCase().includes(q) || false;
      const matchBio = t.bio?.toLowerCase().includes(q) || false;
      const matchSkills =
        t.demolayDetails?.skills?.some((s) => s.toLowerCase().includes(q)) || false;
      if (!matchName && !matchCity && !matchCourse && !matchBio && !matchSkills) return false;
    }

    if (selectedArea !== 'Todas as áreas') {
      const hasArea = t.demolayDetails?.interestAreas?.includes(selectedArea);
      if (!hasArea) return false;
    }

    if (selectedState !== 'all' && t.state !== selectedState) return false;

    return true;
  });

  const handleConnect = (targetId: string) => {
    if (!currentUser) return;
    try {
      api.sendConnectionRequest(currentUser.id, targetId);
      // reload
      const allUsers = api.getUsers();
      setTalents(allUsers.filter((u) => u.role === 'demolay' && u.status === 'approved'));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-gold-500" /> Banco de Talentos DeMolay
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Encontre jovens líderes dedicados, filtrados por competências, localização e disponibilidade imediata.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, habilidade, curso, cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs">
          {/* Area */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[130px] sm:flex-initial">
            <span className="text-slate-400 font-semibold shrink-0">Área:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              {INTEREST_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[130px] sm:flex-initial">
            <span className="text-slate-400 font-semibold shrink-0">Estado:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Todos os Estados</option>
              <option value="RO">Rondônia (RO)</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="DF">Distrito Federal (DF)</option>
            </select>
          </div>

          {/* Toggle Disponível Agora */}
          <label className="flex items-center gap-2 cursor-pointer sm:ml-auto w-full sm:w-auto justify-center sm:justify-start bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-emerald-400 font-semibold">
            <input
              type="checkbox"
              checked={onlyOpenToWork}
              onChange={(e) => setOnlyOpenToWork(e.target.checked)}
              className="w-3.5 h-3.5 accent-emerald-500 rounded"
            />
            <span>Apenas Disponíveis Agora</span>
          </label>
        </div>
      </div>

      {/* Talent Cards Grid */}
      {filteredTalents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum talento encontrado com os filtros selecionados"
          description="Tente limpar os filtros de busca ou alterar a área de interesse para visualizar mais membros."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTalents.map((talent) => {
            const isSelf = currentUser?.id === talent.id;
            const connStatus = currentUser
              ? api.getConnectionStatus(currentUser.id, talent.id)
              : 'none';

            return (
              <div
                key={talent.id}
                className="p-5 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs hover:border-gold-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-800 shrink-0 border border-gold-500/20 font-bold text-gold-400 flex items-center justify-center">
                      {talent.avatarUrl ? (
                        <img src={talent.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        talent.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {talent.fullName}
                        </h3>
                      </div>

                      <div className="mt-0.5">
                        <VerifiedBadge role="demolay" size="sm" />
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {talent.city} - {talent.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Open to Work Flag */}
                  {talent.demolayDetails?.openToWork && (
                    <div className="mb-3">
                      <OpenToWorkBadge size="sm" />
                    </div>
                  )}

                  {/* Chapter & Education Info */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 space-y-1">
                    <p className="truncate">
                      🏛️{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {talent.demolayDetails?.chapterName}
                      </span>
                    </p>
                    {talent.demolayDetails?.course && (
                      <p className="truncate">
                        🎓 {talent.demolayDetails.course} ({talent.demolayDetails.institution})
                      </p>
                    )}
                  </div>

                  {/* Skills Pills */}
                  {talent.demolayDetails?.skills && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {talent.demolayDetails.skills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {talent.demolayDetails.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{talent.demolayDetails.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center gap-2">
                  <Link
                    to={`/perfil/${talent.id}`}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-center bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    Ver Perfil
                  </Link>

                  {!isSelf && (
                    <>
                      {connStatus === 'connected' ? (
                        <Link
                          to={`/mensagens?user=${talent.id}`}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-gold-400 text-slate-950 hover:bg-gold-300 transition-colors"
                        >
                          Mensagem
                        </Link>
                      ) : connStatus === 'pending_sent' ? (
                        <span className="px-2.5 py-2 text-[10px] text-slate-400 font-medium">
                          Enviada
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConnect(talent.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-gold-400 text-slate-950 hover:bg-gold-300 transition-colors"
                        >
                          Conectar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
