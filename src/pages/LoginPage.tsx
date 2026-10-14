import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchAccount } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Erro ao realizar login.');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = async (targetEmail: string, targetId?: string) => {
    setError(null);
    if (targetId) {
      switchAccount(targetId);
      navigate('/dashboard');
      return;
    }
    const res = await login(targetEmail);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Erro ao entrar com a conta de teste.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-navy-900 dark:bg-navy-850 border border-gold-500/30 flex items-center justify-center shadow-md">
              <span className="font-bold text-lg text-gold-400">LM</span>
            </div>
            <span className="text-2xl font-extrabold text-navy-900 dark:text-white">
              LINK<span className="text-gold-500 dark:text-gold-400">MOLAY</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Acesso à Rede Profissional
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Entre com suas credenciais de membro verificado
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-5 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                E-mail de Cadastro
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <a href="#recuperar" className="text-[11px] text-gold-500 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-xs bg-gold-400 hover:bg-gold-300 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Validando acesso...' : 'Entrar na Plataforma'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Picker */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-navy-800">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Acesso Rápido para Testes do MVP:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('pedro.henrique@demolay.org.br', 'd0000000-0000-0000-0000-000000000001')}
                className="p-2 text-left rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
              >
                <div className="text-[11px] font-bold text-blue-500">Pedro Henrique</div>
                <div className="text-[10px] text-slate-400">DeMolay (Dev)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('carlos.silva@silvatech.com.br', 'm0000000-0000-0000-0000-000000000001')}
                className="p-2 text-left rounded-xl border border-gold-500/20 bg-gold-500/5 hover:bg-gold-500/10 transition-colors"
              >
                <div className="text-[11px] font-bold text-gold-500">Carlos Silva</div>
                <div className="text-[10px] text-slate-400">Maçom (Empresário)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('felipe.novato@demolay.org.br', 'd0000000-0000-0000-0000-000000000004')}
                className="p-2 text-left rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
              >
                <div className="text-[11px] font-bold text-amber-500">Felipe Barreto</div>
                <div className="text-[10px] text-slate-400">DeMolay Pendente</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@linkmolay.com.br', 'a0000000-0000-0000-0000-000000000001')}
                className="p-2 text-left rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
              >
                <div className="text-[11px] font-bold text-purple-400">Administrador</div>
                <div className="text-[10px] text-slate-400">Painel Geral</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ainda não faz parte?{' '}
            <Link to="/cadastro" className="font-semibold text-gold-500 hover:underline">
              Solicitar cadastro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
