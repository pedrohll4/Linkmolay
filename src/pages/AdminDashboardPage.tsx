import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  UserProfile,
  SystemStats,
  AdminAction,
  Job,
  Company,
  Post,
  Chapter,
} from '../types';
import { VerifiedBadge, UserStatusBadge } from '../components/common/Badges';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Ban,
  Building2,
  Landmark,
  Briefcase,
  FileCheck,
  Activity,
  AlertTriangle,
  Search,
  Check,
  Trash2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'jobs' | 'audit'>('pending');

  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [auditActions, setAuditActions] = useState<AdminAction[]>([]);

  const [userSearch, setUserSearch] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const loadData = () => {
    setStats(api.getStats());
    setPendingUsers(api.getPendingUsers());
    setAllUsers(api.getUsers());
    setAllJobs(api.getJobs());
    setAuditActions(api.getAdminActions());
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8 text-center rounded-3xl border border-rose-500/30 bg-rose-500/10 text-rose-500 max-w-md mx-auto my-12">
        <Lock className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Acesso Restrito</h2>
        <p className="text-xs mt-1">
          Esta área é restrita a administradores e moderadores oficiais da plataforma.
        </p>
      </div>
    );
  }

  const handleApprove = (userId: string) => {
    if (!currentUser) return;
    api.approveUser(userId, currentUser.id, 'Verificado pela administração.');
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setActionSuccessMsg('Usuário aprovado com sucesso com selo verificado!');
    setTimeout(() => setActionSuccessMsg(null), 3000);
    loadData();
  };

  const handleReject = (userId: string) => {
    if (!currentUser) return;
    if (confirm('Deseja realmente rejeitar esta solicitação?')) {
      api.rejectUser(userId, currentUser.id, 'Dados cadastrais inconsistentes.');
      setActionSuccessMsg('Solicitação rejeitada.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
      loadData();
    }
  };

  const handleSuspend = (userId: string) => {
    if (!currentUser) return;
    if (confirm('Deseja suspender a conta deste usuário?')) {
      api.setUserStatus(userId, 'suspended', currentUser.id, 'Suspensão temporária por moderação.');
      loadData();
    }
  };

  const handleReactivate = (userId: string) => {
    if (!currentUser) return;
    api.setUserStatus(userId, 'approved', currentUser.id, 'Reativação de conta.');
    loadData();
  };

  const handleCloseJob = (jobId: string) => {
    api.updateJobStatus(jobId, 'encerrada');
    loadData();
  };

  const filteredUsers = allUsers.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-purple-950/40 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Módulo de Moderação & Controle
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold">Painel Administrativo Geral</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-200">
          <span>Admin: {currentUser?.fullName}</span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {actionSuccessMsg}
        </div>
      )}

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Usuários Totais
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats.totalUsers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.demolaysCount} DeMolays • {stats.masonsCount} Maçons
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-navy-900/60 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-500 uppercase">
              Pendentes de Aprovação
            </span>
            <div className="text-xl font-extrabold text-amber-500 mt-1">
              {stats.pendingUsersCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Aguardando validação manual</div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Empresas & Vagas
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats.companiesCount} / {stats.activeJobsCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.applicationsCount} candidaturas
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Capítulos</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats.chaptersCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mapeados na rede</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-navy-850 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'pending'
              ? 'text-amber-500 font-bold border-b-2 border-amber-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Usuários Pendentes</span>
          {pendingUsers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-extrabold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-all ${
            activeTab === 'users'
              ? 'text-purple-400 font-bold border-b-2 border-purple-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Gerenciamento de Usuários
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 transition-all ${
            activeTab === 'jobs'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Moderação de Vagas
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-all ${
            activeTab === 'audit'
              ? 'text-purple-400 font-bold border-b-2 border-purple-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Histórico de Auditoria
        </button>
      </div>

      {/* Tab 1: Usuários Pendentes de Aprovação */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Fila de aprovação zerada!
              </h3>
              <p className="text-xs mt-1">Nenhum cadastro aguardando verificação no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-6 rounded-3xl border border-amber-500/30 bg-white dark:bg-navy-900/70 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.fullName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {user.fullName}
                          </h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {user.role === 'demolay' ? 'DeMolay' : 'Maçom'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {user.email} • {user.city} - {user.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Aprovar Cadastro
                      </button>

                      <button
                        onClick={() => handleReject(user.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>

                  {/* Submission Specific Info */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-850 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {user.role === 'demolay' ? (
                      <>
                        <div>
                          <span className="text-slate-400 block">Capítulo Informado:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.demolayDetails?.chapterName}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Grau / Cargo:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.demolayDetails?.orderRank}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">CID:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.demolayDetails?.cid || 'Não preenchido'}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-slate-400 block">Loja Maçônica:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.masonDetails?.lodgeName}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Potência / Obediência:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.masonDetails?.lodgeObedience}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">CIM / Profissão:</span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {user.masonDetails?.cim} ({user.masonDetails?.profession})
                          </strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Gerenciamento de Usuários */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por nome, email ou cidade..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} usuários</span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-navy-850 text-xs">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        u.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {u.fullName}
                        </span>
                        <UserStatusBadge status={u.status} />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {u.email} • {u.city} - {u.state} • {u.role.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {u.status === 'suspended' ? (
                      <button
                        onClick={() => handleReactivate(u.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      >
                        Reativar
                      </button>
                    ) : (
                      u.role !== 'admin' && (
                        <button
                          onClick={() => handleSuspend(u.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        >
                          Suspender
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Moderação de Vagas */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-navy-850 text-xs">
              {allJobs.map((j) => (
                <div key={j.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{j.title}</h4>
                    <p className="text-slate-400 mt-0.5">
                      Empresa: {j.companyName} • {j.city} - {j.state} • Status: {j.status}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {j.status === 'aberta' && (
                      <button
                        onClick={() => handleCloseJob(j.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 font-semibold"
                      >
                        Encerrar Vaga
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Histórico de Auditoria */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ações Administrativas Registradas
          </h3>

          <div className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-navy-850 text-xs">
              {auditActions.map((act) => (
                <div key={act.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {act.adminName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Alvo: <strong>{act.targetName}</strong> • {act.reason}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(act.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
