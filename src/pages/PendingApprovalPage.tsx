import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldCheck, Mail, ArrowRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PendingApprovalPage: React.FC = () => {
  const { currentUser, logout, switchAccount } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

        {/* Status Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Cadastro em Análise
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Olá, <span className="font-semibold text-gold-500">{currentUser?.fullName}</span>! Seu cadastro como{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-100 uppercase text-xs">
            {currentUser?.role === 'demolay' ? 'DeMolay' : 'Maçom'}
          </span>{' '}
          foi recebido e está aguardando verificação manual da administração.
        </p>

        {/* Timeline verification card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-navy-800 text-left mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Dados cadastrais enviados
              </p>
              <p className="text-[11px] text-slate-400">
                {currentUser?.city} - {currentUser?.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
              •
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Validação com a liderança da Ordem
              </p>
              <p className="text-[11px] text-slate-400">
                {currentUser?.role === 'demolay'
                  ? `Capítulo: ${currentUser?.demolayDetails?.chapterName || 'Informado'}`
                  : `Loja: ${currentUser?.masonDetails?.lodgeName || 'Informada'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-navy-700 text-slate-500 flex items-center justify-center text-xs">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Liberação de acesso & Selo Verificado
              </p>
              <p className="text-[11px] text-slate-400">Acesso completo à plataforma</p>
            </div>
          </div>
        </div>

        {/* Testing helper alert */}
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-600 dark:text-gold-300 mb-6 text-left">
          <p className="font-semibold mb-1">💡 Dica para Avaliação do MVP:</p>
          <p className="text-[11px] leading-relaxed mb-2">
            Você pode alternar para o perfil do <strong>Administrador</strong> para aprovar este cadastro agora mesmo pelo painel de controle.
          </p>
          <button
            onClick={() => {
              switchAccount('a0000000-0000-0000-0000-000000000001');
              navigate('/admin');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-500 hover:text-gold-400 underline"
          >
            Acessar como Administrador e Aprovar <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>

          <a
            href="mailto:contato@linkmolay.com.br"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Mail className="w-3.5 h-3.5" /> Suporte
          </a>
        </div>
      </div>
    </div>
  );
};
