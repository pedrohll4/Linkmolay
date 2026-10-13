import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { PendingApprovalPage } from '../../pages/PendingApprovalPage';

export const AppLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se o cadastro estiver pendente, exibe a tela institucional de validação
  if (currentUser.status === 'pending') {
    return <PendingApprovalPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-8 pb-20 lg:pb-12">
        <Sidebar />
        <main className="flex-1 min-w-0 py-6">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
