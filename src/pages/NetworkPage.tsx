import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProfile, Connection } from '../types';
import { VerifiedBadge, OpenToWorkBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import {
  Network,
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  Clock,
  ArrowRight,
  MapPin,
  Trash2,
} from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'connections' | 'received' | 'sent'>('connections');
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<
    { connection: Connection; user: UserProfile }[]
  >([]);
  const [sentRequests, setSentRequests] = useState<
    { connection: Connection; user: UserProfile }[]
  >([]);

  const loadNetwork = () => {
    if (!currentUser) return;
    const res = api.getUserConnections(currentUser.id);
    setConnections(res.connections);
    setReceivedRequests(res.receivedRequests);
    setSentRequests(res.sentRequests);
  };

  useEffect(() => {
    loadNetwork();
  }, [currentUser]);

  const handleAccept = (connId: string) => {
    api.acceptConnection(connId);
    loadNetwork();
  };

  const handleRemove = (otherUserId: string) => {
    if (!currentUser) return;
    if (confirm('Deseja realmente desfazer esta conexão?')) {
      api.removeConnection(currentUser.id, otherUserId);
      loadNetwork();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Network className="w-6 h-6 text-gold-500" /> Minha Rede & Conexões
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gerencie suas conexões de confiança e convites na comunidade DeMolay e Maçônica.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-navy-850 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('connections')}
          className={`pb-3 flex items-center gap-2 transition-all relative ${
            activeTab === 'connections'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Conexões Ativas</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
            {connections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 flex items-center gap-2 transition-all relative ${
            activeTab === 'received'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Solicitações Recebidas</span>
          {receivedRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold-500 text-slate-950 font-extrabold">
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 flex items-center gap-2 transition-all relative ${
            activeTab === 'sent'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Solicitações Enviadas</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Tab: Connections */}
      {activeTab === 'connections' && (
        <>
          {connections.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Você ainda não possui conexões"
              description="Explore o Banco de Talentos ou as páginas de Capítulos e conecte-se com membros da comunidade."
              actionText="Descobrir Membros"
              onAction={() => (window.location.href = '/talentos')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((user) => (
                <div
                  key={user.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 shrink-0 font-bold text-xs text-gold-400 flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/perfil/${user.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-gold-500 truncate block"
                      >
                        {user.fullName}
                      </Link>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.city} - {user.state}
                      </div>
                      <div className="mt-1">
                        <VerifiedBadge role={user.role} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Link
                      to={`/mensagens?user=${user.id}`}
                      className="p-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 transition-colors"
                      title="Enviar Mensagem"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleRemove(user.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remover conexão"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab: Received Requests */}
      {activeTab === 'received' && (
        <>
          {receivedRequests.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Nenhuma solicitação pendente"
              description="Quando outros membros solicitarem conexão com você, eles aparecerão aqui."
            />
          ) : (
            <div className="space-y-3">
              {receivedRequests.map(({ connection, user }) => (
                <div
                  key={connection.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-navy-800 shrink-0">
                      {user.avatarUrl && (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/perfil/${user.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:underline"
                      >
                        {user.fullName}
                      </Link>
                      <p className="text-[11px] text-slate-400">
                        {user.city} - {user.state} • {user.role === 'demolay' ? 'DeMolay' : 'Maçom'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(connection.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-300 text-slate-950 transition-all flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Aceitar
                    </button>
                    <button
                      onClick={() => handleRemove(user.id)}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-500 bg-slate-100 dark:bg-navy-800 transition-colors"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab: Sent Requests */}
      {activeTab === 'sent' && (
        <>
          {sentRequests.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Nenhuma solicitação enviada pendente"
              description="Você não possui convites aguardando resposta de outros membros."
            />
          ) : (
            <div className="space-y-3">
              {sentRequests.map(({ connection, user }) => (
                <div
                  key={connection.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-navy-800 shrink-0">
                      {user.avatarUrl && (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/perfil/${user.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:underline"
                      >
                        {user.fullName}
                      </Link>
                      <p className="text-[11px] text-slate-400">
                        {user.city} - {user.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Aguardando resposta
                    </span>
                    <button
                      onClick={() => handleRemove(user.id)}
                      className="text-xs text-rose-500 hover:underline ml-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
