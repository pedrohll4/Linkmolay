import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Network, MessageSquare, User } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const BottomNav: React.FC = () => {
  const { unreadCount } = useNotifications();

  const navItems = [
    { label: 'Início', path: '/dashboard', icon: Home },
    { label: 'Oportunidades', path: '/oportunidades', icon: Briefcase },
    { label: 'Rede', path: '/rede', icon: Network },
    { label: 'Mensagens', path: '/mensagens', icon: MessageSquare, badge: unreadCount },
    { label: 'Perfil', path: '/meu-perfil', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-t border-slate-200 dark:border-navy-850 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-gold-500 dark:text-gold-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-gold-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
