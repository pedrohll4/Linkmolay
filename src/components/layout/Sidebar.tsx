import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VerifiedBadge, OpenToWorkBadge } from '../common/Badges';
import {
  Home,
  User,
  Briefcase,
  Users,
  Network,
  MessageSquare,
  Landmark,
  Building2,
  FileCheck,
  Shield,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, role, isAdmin, isMason, isDeMolay } = useAuth();

  const navItems = [
    { label: 'Início', path: '/dashboard', icon: Home },
    { label: 'Meu Perfil', path: '/meu-perfil', icon: User },
    { label: 'Oportunidades', path: '/oportunidades', icon: Briefcase },
    { label: 'Encontrar Talentos', path: '/talentos', icon: Users },
    { label: 'Minha Rede', path: '/rede', icon: Network },
    { label: 'Mensagens', path: '/mensagens', icon: MessageSquare },
    { label: 'Capítulos', path: '/capitulos', icon: Landmark },
    { label: 'Empresas', path: '/empresas', icon: Building2 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* User Mini Profile Card */}
      {currentUser && (
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white/60 dark:bg-navy-900/40 backdrop-blur-xs shadow-xs">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-800 border border-gold-500/20 flex items-center justify-center font-bold text-gold-400">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.fullName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {currentUser.fullName}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-400 truncate">
                {currentUser.city}, {currentUser.state}
              </p>
            </div>
          </div>

          {currentUser.verified && role && (
            <div className="mb-2">
              <VerifiedBadge role={role} size="sm" />
            </div>
          )}

          {isDeMolay && currentUser.demolayDetails?.openToWork && (
            <div className="mt-2">
              <OpenToWorkBadge size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Primary Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold border border-gold-500/20 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Role Specific Navigation */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-navy-850 my-2">
          <span className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-navy-400">
            Minhas Atividades
          </span>
        </div>

        {isDeMolay && (
          <NavLink
            to="/minhas-candidaturas"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold border border-gold-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900/60'
              }`
            }
          >
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>Minhas Candidaturas</span>
          </NavLink>
        )}

        {(isMason || isAdmin) && (
          <NavLink
            to="/minhas-vagas"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold border border-gold-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900/60'
              }`
            }
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Minhas Vagas & Candidatos</span>
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-purple-400 hover:bg-purple-500/10'
              }`
            }
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Painel Administrativo</span>
          </NavLink>
        )}

        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold border border-gold-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900/60'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Configurações</span>
        </NavLink>
      </nav>

      {/* Footer Branding Info */}
      <div className="mt-auto pt-4 text-[11px] text-slate-400 dark:text-slate-400 px-3.5 leading-relaxed">
        <p className="font-semibold text-slate-500 dark:text-slate-400">LinkMolay MVP v1.0</p>
        <p>Rede privada e exclusiva.</p>
      </div>
    </aside>
  );
};
