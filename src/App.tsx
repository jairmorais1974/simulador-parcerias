import { motion } from 'framer-motion';
import { useSimulator } from './hooks/useSimulator';
import { formatBRL, projectResult } from './lib/calc';
import { SliderControl, NumberInput } from './components/Controls';
import { ScenarioCard } from './components/ScenarioCard';
import { ComparisonChart } from './components/ComparisonChart';
import { BarChart3, Settings2, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import { authClient } from './lib/auth-client';
import { AuthPage } from './components/AuthPage';

function App() {
  // const { data: sessionData } = authClient.useSession();
  // Logon suspenso temporariamente
  const session = { 
    user: { 
      name: 'Usuário Convidado', 
      email: 'convidado@simulador.com' 
    } 
  };
  
  const { inputs, set, results, brutoTotal, periodo, setPeriodo } = useSimulator();

  const displayedResults = projectResult(results, periodo);
  const displayedBrutoTotal = periodo === 'anual' ? brutoTotal : brutoTotal / 12;

  // Comentado para suspender a obrigatoriedade de logon
  /*
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }
  */

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 selection:bg-blue-600/10">

      {/* Orbs de fundo dinâmicos e suaves para o tema claro */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[130px] animate-float-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] animate-float-slower" />
        <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] rounded-full bg-cyan-200/20 blur-[100px] animate-pulse-glow" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-10 md:py-16">

        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase">
              <BarChart3 className="w-3.5 h-3.5" />
              Business Intelligence Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Simulador de <br />
              <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                Royalties e Parcerias
              </span>
              <span className="text-xs font-bold text-blue-700 ml-4 align-middle bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                Acesso Liberado
              </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
              Projete faturamentos e margens líquidas reais com impostos PJ e retenção de IRPF (PF) integrados.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-4">
            {session && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-sm backdrop-blur-md">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{session.user.name}</span>
                  <span className="text-[9px] font-medium text-slate-400 leading-tight">{session.user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-2 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm shadow-slate-900/5 backdrop-blur-md">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">
                {periodo === 'anual' ? 'Faturamento Bruto Total (Anual)' : 'Faturamento Bruto Total (Mensal)'}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-slate-400 text-sm font-bold">R$</span>
                <motion.h2 
                  key={displayedBrutoTotal}
                  initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                  className="text-4xl font-black text-slate-900 tabular-nums leading-none"
                >
                  {displayedBrutoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.h2>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">

          {/* Sidebar de Ajustes */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm shadow-slate-900/5 backdrop-blur-md">
              
              {/* Seletor Mensal / Anual */}
              <div className="flex bg-slate-200/55 border border-slate-200/80 rounded-xl p-1 mb-8">
                <button
                  type="button"
                  onClick={() => setPeriodo('anual')}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    periodo === 'anual'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Modo Anual
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodo('mensal')}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    periodo === 'mensal'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Modo Mensal
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Settings2 className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Ajustes do Modelo
                </h2>
              </div>

              <div className="space-y-8">
                <SliderControl
                  label="Licenças Anuais"
                  value={inputs.licencas.toLocaleString('pt-BR')}
                  min={1} max={10000} currentValue={inputs.licencas}
                  onChange={v => set('licencas', v)}
                  isCurrency={false}
                />
                <SliderControl
                  label="Venda por Licença (R$)"
                  value={inputs.preco.toLocaleString('pt-BR')}
                  min={10} max={1000000} currentValue={inputs.preco}
                  onChange={v => set('preco', v)}
                  isCurrency={true}
                />
                <SliderControl
                  label={periodo === 'anual' ? 'Custo Op. Parceiro (Anual)' : 'Custo Op. Parceiro (Mensal)'}
                  value={(periodo === 'anual' ? inputs.custoP * 12 : inputs.custoP).toLocaleString('pt-BR')}
                  min={0} 
                  max={periodo === 'anual' ? 2400000 : 200000} 
                  currentValue={periodo === 'anual' ? inputs.custoP * 12 : inputs.custoP}
                  onChange={v => set('custoP', periodo === 'anual' ? Math.round(v / 12) : v)}
                  isCurrency={true}
                />
                <SliderControl
                  label="C3: Fixo do Dev (R$)"
                  value={inputs.fixoDev.toLocaleString('pt-BR')}
                  min={10} max={1000000} currentValue={inputs.fixoDev}
                  onChange={v => set('fixoDev', v)}
                  isCurrency={true}
                />

                <div className="pt-8 border-t border-slate-100 space-y-8">
                  <SliderControl
                    label={periodo === 'anual' ? 'Infra / Servidor Dev (Anual)' : 'Infra / Servidor Dev (Mensal)'}
                    value={(periodo === 'anual' ? inputs.custoD * 12 : inputs.custoD).toLocaleString('pt-BR')}
                    min={0} 
                    max={periodo === 'anual' ? 600000 : 50000} 
                    currentValue={periodo === 'anual' ? inputs.custoD * 12 : inputs.custoD}
                    onChange={v => set('custoD', periodo === 'anual' ? Math.round(v / 12) : v)}
                    isCurrency={true}
                  />
                  
                  <div className="pt-4">
                    <NumberInput label="Imposto PJ Parceiro %" value={inputs.taxPJ} suffix="%" onChange={v => set('taxPJ', v)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex gap-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-800 font-bold">Base de Cálculo</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  IRPF calculado pela tabela progressiva mensal 2024. O parceiro assume 100% dos impostos PJ sobre o faturamento bruto total.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Conteúdo Principal */}
          <div className="flex flex-col gap-8">
            
            {/* Grid de Resultados - Alterado para 2 Colunas para evitar poluição visual e esmagamento dos cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {displayedResults.map((s, i) => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  brutoTotal={displayedBrutoTotal}
                  index={i}
                  isFeatured={s.id === 3}
                  periodo={periodo}
                />
              ))}
            </div>

            {/* Gráfico Comparativo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm shadow-slate-900/5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Comparativo Líquido {periodo === 'anual' ? 'Anual' : 'Mensal'}
                </h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Parceiro</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Dev</span>
                   </div>
                </div>
              </div>
              <ComparisonChart results={displayedResults} />
            </motion.div>
          </div>
        </div>

        <footer className="mt-24 pt-10 border-t border-slate-200 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             Preço Aberto Intelligence &copy; 2026
           </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
