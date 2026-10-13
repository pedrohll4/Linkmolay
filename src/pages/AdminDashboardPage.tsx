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
  Plus,
  Edit2,
  X,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'chapters' | 'jobs' | 'audit'>('pending');

  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [auditActions, setAuditActions] = useState<AdminAction[]>([]);

  const [userSearch, setUserSearch] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Estados do Modal de Criação / Edição de Capítulo
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapName, setChapName] = useState('');
  const [chapNumber, setChapNumber] = useState<number | ''>('');
  const [chapCity, setChapCity] = useState('');
  const [chapState, setChapState] = useState('RO');
  const [chapLogo, setChapLogo] = useState('');
  const [chapMaster, setChapMaster] = useState('');
  const [chapEmail, setChapEmail] = useState('');
  const [chapPhone, setChapPhone] = useState('');
  const [chapInstagram, setChapInstagram] = useState('');
  const [chapHistory, setChapHistory] = useState('');

  // Estados do Modal de Alteração de Capítulo de Membro
  const [userChapterModalOpen, setUserChapterModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [targetChapterSelect, setTargetChapterSelect] = useState<string>('');
  const [targetCustomChapterName, setTargetCustomChapterName] = useState<string>('');

  const loadData = () => {
    setStats(api.getStats());
    setPendingUsers(api.getPendingUsers());
    setAllUsers(api.getUsers());
    setAllJobs(api.getJobs());
    setAllChapters(api.getChapters());
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

  // Funções de Gestão de Capítulos
  const openNewChapterModal = () => {
    setEditingChapter(null);
    setChapName('');
    setChapNumber('');
    setChapCity('Ariquemes');
    setChapState('RO');
    setChapLogo('/chapters/luciano-de-assis-118.png');
    setChapMaster('');
    setChapEmail('');
    setChapPhone('');
    setChapInstagram('');
    setChapHistory('');
    setIsChapterModalOpen(true);
  };

  const openEditChapterModal = (c: Chapter) => {
    setEditingChapter(c);
    setChapName(c.name);
    setChapNumber(c.number);
    setChapCity(c.city);
    setChapState(c.state);
    setChapLogo(c.logoUrl || '');
    setChapMaster(c.masterCouncilor || '');
    setChapEmail(c.contactEmail || '');
    setChapPhone(c.contactPhone || '');
    setChapInstagram(c.instagram || '');
    setChapHistory(c.history || '');
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapName.trim() || !chapNumber) {
      alert('Preencha o nome e o número do capítulo.');
      return;
    }

    if (editingChapter) {
      api.updateChapter(editingChapter.id, {
        name: chapName.trim(),
        number: Number(chapNumber),
        city: chapCity.trim(),
        state: chapState.trim().toUpperCase(),
        logoUrl: chapLogo.trim() || undefined,
        masterCouncilor: chapMaster.trim() || undefined,
        contactEmail: chapEmail.trim() || undefined,
        contactPhone: chapPhone.trim() || undefined,
        instagram: chapInstagram.trim() || undefined,
        history: chapHistory.trim() || undefined,
      });
      setActionSuccessMsg('Capítulo atualizado com sucesso!');
    } else {
      api.createChapter({
        name: chapName.trim(),
        number: Number(chapNumber),
        city: chapCity.trim(),
        state: chapState.trim().toUpperCase(),
        logoUrl: chapLogo.trim() || '/chapters/luciano-de-assis-118.png',
        bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        masterCouncilor: chapMaster.trim() || undefined,
        contactEmail: chapEmail.trim() || undefined,
        contactPhone: chapPhone.trim() || undefined,
        instagram: chapInstagram.trim() || undefined,
        history: chapHistory.trim() || undefined,
        activeMembersCount: 0,
      });
      setActionSuccessMsg('Novo Capítulo cadastrado e disponível na tela de registro!');
    }

    setIsChapterModalOpen(false);
    setTimeout(() => setActionSuccessMsg(null), 3000);
    loadData();
  };

  const handleDeleteChapter = (c: Chapter) => {
    if (confirm(`Deseja realmente excluir o ${c.name} nº ${c.number}?`)) {
      api.deleteChapter(c.id);
      setActionSuccessMsg(`Capítulo ${c.name} excluído.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
      loadData();
    }
  };

  // Funções de Alteração de Capítulo do Usuário
  const openUserChapterModal = (user: UserProfile) => {
    setTargetUser(user);
    const userChap = user.demolayDetails?.chapterName || '';
    const match = allChapters.find(
      (c) =>
        c.id === user.demolayDetails?.chapterId ||
        userChap.toLowerCase().includes(c.name.toLowerCase())
    );

    if (match) {
      setTargetChapterSelect(match.id);
      setTargetCustomChapterName('');
    } else {
      setTargetChapterSelect('custom');
      setTargetCustomChapterName(userChap);
    }
    setUserChapterModalOpen(true);
  };

  const handleSaveUserChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    let finalName = '';
    let finalId: string | undefined = undefined;

    if (targetChapterSelect === 'custom') {
      finalName = targetCustomChapterName.trim();
    } else {
      const found = allChapters.find((c) => c.id === targetChapterSelect);
      if (found) {
        finalName = `${found.name} nº ${found.number}`;
        finalId = found.id;
      } else {
        finalName = targetCustomChapterName.trim();
      }
    }

    if (!finalName) {
      alert('Informe o nome do capítulo.');
      return;
    }

    api.updateUserChapter(targetUser.id, finalId, finalName);
    setActionSuccessMsg(`Capítulo de ${targetUser.fullName} atualizado para "${finalName}"!`);
    setUserChapterModalOpen(false);
    setTimeout(() => setActionSuccessMsg(null), 3500);
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
          onClick={() => setActiveTab('chapters')}
          className={`pb-3 flex items-center gap-1.5 transition-all ${
            activeTab === 'chapters'
              ? 'text-yellow-500 font-bold border-b-2 border-yellow-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-yellow-500" />
          <span>Capítulos</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold">
            {allChapters.length}
          </span>
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
                          <span className="text-slate-400 block mb-0.5">Capítulo Informado:</span>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-800 dark:text-slate-200">
                              {user.demolayDetails?.chapterName || 'Não informado'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => openUserChapterModal(user)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30 transition-colors cursor-pointer"
                              title="Alterar ou vincular a um capítulo oficial"
                            >
                              <Edit2 className="w-2.5 h-2.5" /> Alterar
                            </button>
                          </div>
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
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span>{u.email}</span>
                        <span>•</span>
                        <span>{u.city} - {u.state}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold">{u.role}</span>
                        {u.role === 'demolay' && (
                          <>
                            <span>•</span>
                            <span className="text-amber-500 font-medium inline-flex items-center gap-1">
                              <Landmark className="w-3 h-3 text-amber-500" />
                              {u.demolayDetails?.chapterName || 'Sem capítulo'}
                            </span>
                            <button
                              type="button"
                              onClick={() => openUserChapterModal(u)}
                              className="text-[10px] text-amber-500 hover:underline font-bold cursor-pointer ml-0.5"
                            >
                              [Alterar]
                            </button>
                          </>
                        )}
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

      {/* Tab: Gestão de Capítulos */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  Capítulos da Ordem DeMolay Cadastrados
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Os capítulos cadastrados aqui ficam disponíveis para seleção instantânea na tela de registro. Você pode criar, editar dados de liderança e gerenciar os capítulos da rede.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewChapterModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Cadastrar Novo Capítulo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allChapters.map((chap) => (
              <div
                key={chap.id}
                className="p-5 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/70 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-800 border border-amber-500/30 shrink-0 shadow-md">
                      {chap.logoUrl ? (
                        <img src={chap.logoUrl} alt={chap.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-amber-400 text-xs">
                          {chap.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {chap.name} nº {chap.number}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {chap.city} - {chap.state}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {chap.activeMembersCount || 0} membros ativos
                      </span>
                    </div>
                  </div>

                  {chap.history && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {chap.history}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-navy-850 text-[11px] text-slate-400 space-y-1">
                    {chap.masterCouncilor && (
                      <div>
                        <span className="text-slate-500">Mestre Conselheiro: </span>
                        <strong className="text-slate-700 dark:text-slate-200">{chap.masterCouncilor}</strong>
                      </div>
                    )}
                    {chap.contactEmail && (
                      <div className="truncate">
                        <span className="text-slate-500">E-mail: </span>
                        <span className="text-slate-700 dark:text-slate-200">{chap.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-850">
                  <button
                    type="button"
                    onClick={() => openEditChapterModal(chap)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(chap)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Excluir capítulo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
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
      {/* MODAL 1: Cadastrar / Editar Capítulo */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl border border-amber-500/40 bg-[#0A1124] text-white p-6 shadow-2xl relative my-8">
            <button
              type="button"
              onClick={() => setIsChapterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-amber-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingChapter ? 'Editar Capítulo' : 'Novo Capítulo da Ordem DeMolay'}
                </h3>
                <p className="text-xs text-slate-400">
                  Preencha os dados oficiais do capítulo para disponibilizá-lo na rede.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Nome do Capítulo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Capítulo Luciano de Assis"
                    value={chapName}
                    onChange={(e) => setChapName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Número *</label>
                  <input
                    type="number"
                    required
                    placeholder="118"
                    value={chapNumber}
                    onChange={(e) => setChapNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ariquemes"
                    value={chapCity}
                    onChange={(e) => setChapCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado (UF) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="RO"
                    value={chapState}
                    onChange={(e) => setChapState(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white uppercase text-center font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mestre Conselheiro</label>
                  <input
                    type="text"
                    placeholder="Nome do líder atual"
                    value={chapMaster}
                    onChange={(e) => setChapMaster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">E-mail de Contato</label>
                  <input
                    type="email"
                    placeholder="capitulo@demolay.org.br"
                    value={chapEmail}
                    onChange={(e) => setChapEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(69) 99999-9999"
                    value={chapPhone}
                    onChange={(e) => setChapPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    placeholder="@cap.lucianodeassis118"
                    value={chapInstagram}
                    onChange={(e) => setChapInstagram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL do Brasão / Logo do Capítulo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: /chapters/luciano-de-assis-118.png ou link web"
                    value={chapLogo}
                    onChange={(e) => setChapLogo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setChapLogo('/chapters/luciano-de-assis-118.png')}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap cursor-pointer hover:bg-amber-500/30 transition-colors"
                  >
                    Brasão 118
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">História / Apresentação</label>
                <textarea
                  rows={2}
                  placeholder="Breve resumo histórico da fundação e tradições..."
                  value={chapHistory}
                  onChange={(e) => setChapHistory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingChapter ? 'Salvar Alterações' : 'Cadastrar Capítulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Alterar / Homologar Capítulo do Usuário */}
      {userChapterModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-[#0A1124] text-white p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setUserChapterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white">Alterar Capítulo do Membro</h3>
                <p className="text-xs text-slate-400">
                  {targetUser.fullName} ({targetUser.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUserChapter} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Capítulo atualmente registrado:</span>
                <strong className="text-amber-400 text-xs">
                  {targetUser.demolayDetails?.chapterName || 'Não informado'}
                </strong>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Selecione o Capítulo Oficial:
                </label>
                <select
                  value={targetChapterSelect}
                  onChange={(e) => setTargetChapterSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {allChapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      {chap.name} nº {chap.number} ({chap.city} - {chap.state})
                    </option>
                  ))}
                  <option value="custom">✍️ Digitar Outro / Personalizado</option>
                </select>
              </div>

              {targetChapterSelect === 'custom' && (
                <div className="space-y-1">
                  <label className="block text-slate-300 font-semibold">
                    Nome e Número do Capítulo Personalizado:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Capítulo Cavaleiros do Guaporé nº 340"
                    value={targetCustomChapterName}
                    onChange={(e) => setTargetCustomChapterName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUserChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  Salvar e Vincular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
