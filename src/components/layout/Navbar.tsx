import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { VerifiedBadge } from '../common/Badges';
import {
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  User,
  Settings,
  Shield,
  Briefcase,
  Users,
  Check,
  ChevronDown,
  Menu,
  X,
  Home,
  Network,
  MessageSquare,
  Landmark,
  Building2,
  FileCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, role, logout, switchAccount, isAdmin, isMason, isDeMolay } = useAuth();
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemoSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/oportunidades?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-navy-850 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Mobile Menu Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-6">
          {/* Mobile Menu Button (<lg) */}
          <button
            type="button"
            onClick={() => setShowMobileDrawer(true)}
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5 text-gold-500" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-navy-900 dark:bg-navy-850 border border-gold-500/30 flex items-center justify-center shadow-xs group-hover:border-gold-400 transition-colors">
              <span className="font-bold text-base text-gold-400 tracking-wider">LM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-navy-900 dark:text-white leading-tight">
                LINK<span className="text-gold-500 dark:text-gold-400">MOLAY</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-navy-400 font-semibold">
                Rede Profissional
              </span>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:block relative w-64 lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar vagas, talentos, capítulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
            />
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
            title="Buscar vagas e membros"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Demo Switcher Tool (MVP Testing Utility) */}
          <div className="relative" ref={demoRef}>
            <button
              onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-600 dark:text-gold-400 hover:bg-gold-500/20 transition-colors font-medium"
              title="Alternar entre usuários de teste instantaneamente"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alternar Perfil</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showDemoSwitcher && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800 mb-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Ambiente de Demonstração LinkMolay
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Simule diferentes papéis do sistema em 1 clique:
                  </p>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'd0000000-0000-0000-0000-000000000001', name: 'Pedro Henrique', role: 'DeMolay Aprovado (Candidato Dev)' },
                    { id: 'm0000000-0000-0000-0000-000000000001', name: 'Carlos Eduardo', role: 'Maçom Aprovado (Empresário TI)' },
                    { id: 'm0000000-0000-0000-0000-000000000002', name: 'Roberto Mendes', role: 'Maçom Aprovado (Advogado)' },
                    { id: 'd0000000-0000-0000-0000-000000000004', name: 'Felipe Barreto', role: 'DeMolay Pendente (Aguardando)' },
                    { id: 'm0000000-0000-0000-0000-000000000003', name: 'Marcos Albuquerque', role: 'Maçom Pendente (Aguardando)' },
                    { id: 'a0000000-0000-0000-0000-000000000001', name: 'Administrador', role: 'Admin Geral (/admin)' },
                  ].map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        switchAccount(account.id);
                        setShowDemoSwitcher(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        currentUser?.id === account.id
                          ? 'bg-gold-500/15 text-gold-500 dark:text-gold-300 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-[10px] text-slate-400">{account.role}</div>
                      </div>
                      {currentUser?.id === account.id && <Check className="w-3.5 h-3.5 text-gold-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
            title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-white dark:ring-navy-950" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Notificações
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {unreadCount} nova(s) atualização(ões)
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-gold-500 hover:text-gold-400 font-medium"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-850">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            navigate(notif.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors cursor-pointer text-left ${
                          !notif.read ? 'bg-gold-500/5 dark:bg-gold-500/10' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-navy-800 flex items-center justify-center text-xs font-bold text-gold-400">
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
                <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-2 shadow-2xl z-50">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-navy-800 mb-1">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mb-1.5">
                      {currentUser.email}
                    </div>
                    {currentUser.verified && role && (
                      <VerifiedBadge role={role} size="sm" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/meu-perfil"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" /> Meu Perfil
                    </Link>

                    {role === 'mason' && (
                      <Link
                        to="/minhas-vagas"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5" /> Gerenciar Minhas Vagas
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-400 font-medium hover:bg-purple-500/10 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" /> Painel Administrativo
                      </Link>
                    )}

                    <Link
                      to="/configuracoes"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" /> Configurações
                    </Link>

                    <div className="border-t border-slate-100 dark:border-navy-800 my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Encerrar Sessão
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gold-400 hover:bg-gold-300 text-slate-900 transition-all shadow-xs"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-2.5 border-t border-slate-200/80 dark:border-navy-850 bg-slate-50/95 dark:bg-navy-900/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-150">
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setShowMobileSearch(false);
            }}
            className="relative w-full"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar vagas, talentos, capítulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer (Sheet) */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setShowMobileDrawer(false)}
          />

          {/* Drawer Body */}
          <aside className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-[#070D1E] border-r border-slate-200 dark:border-navy-800 z-50 overflow-y-auto p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-navy-800">
                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileDrawer(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-navy-900 dark:bg-navy-850 border border-gold-500/30 flex items-center justify-center">
                    <span className="font-bold text-sm text-gold-400">LM</span>
                  </div>
                  <span className="font-extrabold text-base text-navy-900 dark:text-white">
                    LINK<span className="text-gold-500 dark:text-gold-400">MOLAY</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Mini Card */}
              {currentUser && (
                <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-slate-50 dark:bg-navy-900/60">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-800 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 text-sm shrink-0">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.city}, {currentUser.state}
                      </p>
                    </div>
                  </div>
                  {currentUser.verified && role && (
                    <VerifiedBadge role={role} size="sm" />
                  )}
                </div>
              )}

              {/* Mobile Search inside Drawer */}
              <form
                onSubmit={(e) => {
                  handleSearch(e);
                  setShowMobileDrawer(false);
                }}
                className="relative"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar vagas, talentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </form>

              {/* Navigation Links */}
              <nav className="space-y-1 pt-1">
                {[
                  { label: 'Início', path: '/dashboard', icon: Home },
                  { label: 'Meu Perfil', path: '/meu-perfil', icon: User },
                  { label: 'Oportunidades & Vagas', path: '/oportunidades', icon: Briefcase },
                  { label: 'Encontrar Talentos', path: '/talentos', icon: Users },
                  { label: 'Minha Rede Fraternal', path: '/rede', icon: Network },
                  { label: 'Mensagens', path: '/mensagens', icon: MessageSquare, badge: unreadCount },
                  { label: 'Capítulos DeMolay', path: '/capitulos', icon: Landmark },
                  { label: 'Empresas Parceiras', path: '/empresas', icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMobileDrawer(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-gold-500/10 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gold-500/80 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="min-w-4 h-4 px-1 rounded-full bg-gold-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}

                {/* Sub-section: Minhas Atividades */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-navy-850 my-2">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-navy-400">
                    Minhas Atividades
                  </span>
                </div>

                {isDeMolay && (
                  <Link
                    to="/minhas-candidaturas"
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                  >
                    <FileCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Minhas Candidaturas</span>
                  </Link>
                )}

                {(isMason || isAdmin) && (
                  <Link
                    to="/minhas-vagas"
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Minhas Vagas & Candidatos</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-400 hover:bg-purple-500/10 transition-colors"
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Painel Administrativo</span>
                  </Link>
                )}

                <Link
                  to="/configuracoes"
                  onClick={() => setShowMobileDrawer(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>

            {/* Bottom Actions of Drawer */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-navy-800 space-y-2 mt-4">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors border border-slate-200 dark:border-navy-800"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{theme}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileDrawer(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
