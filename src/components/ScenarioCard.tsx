import { motion } from 'framer-motion';
import { ScenarioResult, formatBRL } from '../lib/calc';
import { TrendingUp, Landmark, Server, Crown, ArrowUpRight } from 'lucide-react';

interface Props {
  scenario: ScenarioResult;
  brutoTotal: number;
  index: number;
  isFeatured?: boolean;
  periodo: 'mensal' | 'anual';
}

function Row({ label, value, sub, color = 'text-slate-800', icon }: {
  label: string; value: string; sub?: string; color?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
        {icon && <span className="text-blue-600/70">{icon}</span>}
        <span className="flex flex-col">
          {label}
          {sub && <span className="text-[9px] text-slate-400 font-normal">{sub}</span>}
        </span>
      </div>
      <span className={`text-[11px] font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export function ScenarioCard({ scenario, index, isFeatured, periodo }: Props) {
  const s = scenario;
  const t = periodo === 'anual' ? 'Anual' : 'Mensal';
  const ts = periodo === 'anual' ? 'Anuais' : 'Mensais';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden rounded-[32px] border p-7 flex flex-col gap-6
        ${isFeatured
          ? 'bg-gradient-to-br from-blue-50/40 via-white to-white border-blue-200 shadow-md shadow-blue-900/5 ring-1 ring-blue-100'
          : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50/10'}
        transition-all duration-300 group
      `}
    >
      {/* Indicador de Seleção / Hover */}
      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-blue-500/40" />
      </div>

      {/* Header do Card */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isFeatured ? 'bg-blue-600 animate-pulse shadow-[0_0_6px_rgba(37,99,235,0.6)]' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cenário {s.id}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{s.label}</h3>
        </div>
        {isFeatured && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 shadow-sm">
            <Crown className="w-3.5 h-3.5" />
            Sugestão
          </div>
        )}
      </div>

      {/* Seção Parceiro */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partilha Parceiro</span>
          <span className="text-xs font-black text-slate-600">{s.pShare}</span>
        </div>
        
        <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/60">
          <Row label={`Faturamento Bruto (${t})`} value={formatBRL(s.pBruto)} color="text-slate-800" />
          <Row label={`Impostos Totais (PJ/${t})`} value={`- ${formatBRL(s.pImpostos)}`} color="text-rose-600" />
          <Row label={`Custos Operacionais (${ts})`} value={`- ${formatBRL(s.pCustos)}`} color="text-rose-500/90" />
          
          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-600 uppercase">{`Resultado Líquido (${t})`}</span>
            <span className={`text-base font-black tabular-nums ${s.pLiq >= 0 ? 'text-slate-900' : 'text-rose-600 animate-pulse'}`}>
              {formatBRL(s.pLiq)}
            </span>
          </div>
        </div>
      </div>

      {/* Seção Desenvolvedor (Destaque Blue) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest">Retorno Jair (Dev)</span>
          <span className="text-xs font-black text-blue-600">
            {s.pctEquiv !== undefined ? `≈ ${s.pctEquiv.toFixed(1)}%` : s.dShare}
          </span>
        </div>

        <div className={`rounded-2xl p-5 border ${
          isFeatured ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50/60 border-slate-200/60'
        }`}>
          <Row label={`Royalties Brutos (${ts})`} value={formatBRL(s.dBruto)} color="text-blue-900" icon={<TrendingUp className="w-3.5 h-3.5" />} />
          <Row label={`Retenção IRPF (PF/${t})`} value={`- ${formatBRL(s.dIRPF)}`} color="text-rose-600" icon={<Landmark className="w-3.5 h-3.5" />} />
          <Row label={`Custo Infra/Servidor (${t})`} value={`- ${formatBRL(s.dInfra)}`} color="text-amber-800/90" icon={<Server className="w-3.5 h-3.5" />} />
          
          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-blue-100/50">
            <span className="text-[11px] font-bold text-blue-700 uppercase">Líquido no Bolso (PF)</span>
            <span className="text-lg font-black text-blue-700 tabular-nums">
              {formatBRL(s.dLiq)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
