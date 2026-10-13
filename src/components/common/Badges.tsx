import React from 'react';
import { UserRole, UserStatus, ApplicationStatus } from '../../types';
import { CheckCircle2, ShieldCheck, Clock, AlertCircle, Ban } from 'lucide-react';

export const VerifiedBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({
  role,
  size = 'md',
}) => {
  const isDeMolay = role === 'demolay';
  const label = isDeMolay ? 'DeMolay verificado' : 'Maçom verificado';

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400 dark:text-gold-300 ${sizeClasses} shadow-sm backdrop-blur-xs`}
      title={label}
    >
      <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-gold-400' : 'w-3.5 h-3.5 text-gold-400'} />
      <span>{label}</span>
    </span>
  );
};

export const OpenToWorkBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold uppercase tracking-wider ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1.5' : 'text-xs px-3 py-1 gap-2'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>Disponível para Oportunidades</span>
    </span>
  );
};

export const UserStatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" /> Aprovado
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" /> Pendente de Aprovação
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-3 h-3" /> Rejeitado
        </span>
      );
    case 'suspended':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          <Ban className="w-3 h-3" /> Suspenso
        </span>
      );
    default:
      return null;
  }
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
          Administrador
        </span>
      );
    case 'mason':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-gold-500/15 text-gold-300 border border-gold-500/30">
          Maçom
        </span>
      );
    case 'demolay':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30">
          DeMolay
        </span>
      );
  }
};

export const ApplicationStatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const map: Record<ApplicationStatus, { label: string; color: string }> = {
    enviada: { label: 'Enviada', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    visualizada: { label: 'Visualizada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    em_analise: { label: 'Em Análise', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    entrevista: { label: 'Entrevista', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    aprovado: { label: 'Aprovado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    rejeitado: { label: 'Encerrado', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };

  const item = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.color}`}>
      {item.label}
    </span>
  );
};
