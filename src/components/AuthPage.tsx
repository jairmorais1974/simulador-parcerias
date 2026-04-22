import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '../lib/auth-client';
import { BarChart3, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendCode = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
      });
      if (error) throw new Error(error.message || 'Erro ao reenviar código');
      setError('Um novo código foi enviado para seu e-mail.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isVerifying) {
        const { error } = await authClient.verifyEmail({
          query: {
            token: code,
          },
        });
        if (error) throw new Error(error.message || 'Código inválido');
        setIsVerifying(false);
        setIsLogin(true);
        setError('E-mail verificado com sucesso! Faça login agora.');
        return;
      }

      if (isLogin) {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        
        if (result.error) {
          const msg = result.error.message?.toLowerCase() || '';
          if (msg.includes('verify') || msg.includes('verified')) {
            setIsVerifying(true);
            setError('Por favor, verifique seu e-mail para continuar.');
            return;
          }
          throw new Error(result.error.message || 'Erro ao fazer login');
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (result.error) throw new Error(result.error.message || 'Erro ao criar conta');
        setIsVerifying(true);
        setError('Enviamos um código para seu e-mail.');
      }
    } catch (err: any) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('verify') || msg.includes('verified')) {
        setIsVerifying(true);
        setError('Por favor, verifique seu e-mail para continuar.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/5 border border-blue-600/10 text-blue-600 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase">
            <BarChart3 className="w-3 h-3" />
            Intelligence Access
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {isVerifying ? 'Verifique seu e-mail' : (isLogin ? 'Bem-vindo de volta' : 'Crie sua conta')}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isVerifying ? 'Enviamos um código de segurança' : (isLogin ? 'Acesse o simulador de parcerias' : 'Comece a projetar seus resultados hoje')}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl shadow-blue-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Código de Verificação</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/30 transition-all"
                    />
                    <p className="text-[10px] text-slate-400 text-center font-medium">
                      Insira o código de 6 dígitos enviado para seu e-mail.
                    </p>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendLoading}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest"
                      >
                        {resendLoading ? 'Enviando...' : 'Não recebeu? Reenviar código'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required={!isLogin}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/30 transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemplo@empresa.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/30 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/30 transition-all font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${isVerifying ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'} border rounded-2xl p-4 flex gap-3 items-start`}
              >
                <AlertCircle className={`w-5 h-5 ${isVerifying ? 'text-blue-500' : 'text-red-500'} shrink-0 mt-0.5`} />
                <p className={`text-sm ${isVerifying ? 'text-blue-600' : 'text-red-600'} font-medium leading-tight`}>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isVerifying ? 'Confirmar Código' : (isLogin ? 'Entrar no Sistema' : 'Criar minha conta')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            {isVerifying ? (
              <button
                onClick={() => { setIsVerifying(false); setError(null); }}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Voltar para o login
              </button>
            ) : (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                {isLogin ? (
                  <>
                    Não tem uma conta? <span className="text-blue-600">Cadastre-se</span>
                    <br />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsVerifying(true); setError(null); }}
                      className="mt-2 text-xs text-blue-600/60 hover:text-blue-600"
                    >
                      Já tenho um código de verificação
                    </button>
                  </>
                ) : (
                  <>Já tem uma conta? <span className="text-blue-600">Fazer login</span></>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Preço Aberto Intelligence &copy; 2026
        </p>
      </motion.div>
    </div>
  );
};
