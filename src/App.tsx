import { motion } from 'framer-motion';
import { useSimulator } from './hooks/useSimulator';
import { formatBRL } from './lib/calc';
import { SliderControl, NumberInput } from './components/Controls';
import { ScenarioCard } from './components/ScenarioCard';
import { ComparisonChart } from './components/ComparisonChart';
import { BarChart3, Settings2, HelpCircle } from 'lucide-react';

function App() {
  const { inputs, set, results, brutoTotal } = useSimulator();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-600/10">

      {/* Orbs de fundo suaves para o tema claro */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-10 md:py-16">

        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/5 border border-blue-600/10 text-blue-600 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase">
              <BarChart3 className="w-3 h-3" />
              Business Intelligence Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Simulador de <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Royalties e Parcerias
              </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
              Projete faturamentos e margens líquidas reais com impostos PJ e retenção de IRPF (PF) integrados.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">Faturamento Bruto Total (Anual)</p>
              <div className="flex items-baseline gap-3">
                <span className="text-slate-400 text-sm font-bold">R$</span>
                <motion.h2 
                  key={brutoTotal}
                  initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                  className="text-4xl font-black text-slate-900 tabular-nums leading-none"
                >
                  {brutoTotal.toLocaleString('pt-BR')}
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
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-600/10">
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
                  min={1} max={500} currentValue={inputs.licencas}
                  onChange={v => set('licencas', v)}
                />
                <SliderControl
                  label="Venda por Licença (R$)"
                  value={inputs.preco.toLocaleString('pt-BR')}
                  min={1000} max={20000} step={500} currentValue={inputs.preco}
                  onChange={v => set('preco', v)}
                />
                <SliderControl
                  label="C3: Fixo do Dev (R$)"
                  value={inputs.fixoDev.toLocaleString('pt-BR')}
                  min={500} max={10000} step={100} currentValue={inputs.fixoDev}
                  onChange={v => set('fixoDev', v)}
                />

                <div className="pt-8 border-t border-slate-100 space-y-8">
                  <SliderControl
                    label="Custo Op. Parceiro (Mensal)"
                    value={inputs.custoP.toLocaleString('pt-BR')}
                    valueSuffix="R$"
                    min={0} max={20000} step={100} currentValue={inputs.custoP}
                    onChange={v => set('custoP', v)}
                  />
                  <SliderControl
                    label="Infra / Servidor Dev (Mensal)"
                    value={inputs.custoD.toLocaleString('pt-BR')}
                    valueSuffix="R$"
                    min={0} max={5000} step={50} currentValue={inputs.custoD}
                    onChange={v => set('custoD', v)}
                  />
                  
                  <div className="pt-4">
                    <NumberInput label="Imposto PJ Parceiro %" value={inputs.taxPJ} suffix="%" onChange={v => set('taxPJ', v)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-5 flex gap-4 shadow-sm shadow-blue-900/5">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-900 font-bold">Base de Cálculo</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  IRPF calculado pela tabela progressiva mensal 2024. O parceiro assume 100% dos impostos PJ sobre o faturamento bruto total.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Conteúdo Principal */}
          <div className="flex flex-col gap-8">
            
            {/* Grid de Resultados */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((s, i) => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  brutoTotal={brutoTotal}
                  index={i}
                  isFeatured={s.id === 3}
                />
              ))}
            </div>

            {/* Gráfico Comparativo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Comparativo Líquido Anual</h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Parceiro</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Dev</span>
                   </div>
                </div>
              </div>
              <ComparisonChart results={results} />
            </motion.div>
          </div>
        </div>

        <footer className="mt-24 pt-10 border-t border-slate-100 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
             Preço Aberto Intelligence &copy; 2026
           </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
