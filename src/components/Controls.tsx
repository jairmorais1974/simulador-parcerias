import { motion } from 'framer-motion';

interface Props {
  label: string;
  value: string | number;
  valueSuffix?: string;
  min: number;
  max: number;
  step?: number;
  currentValue: number;
  onChange: (v: number) => void;
  accentColor?: string;
}

export function SliderControl({
  label, value, valueSuffix = '', min, max, step = 1,
  currentValue, onChange, accentColor = 'blue'
}: Props) {
  const pct = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-600 transition-colors">
          {label}
        </label>
        <motion.span
          key={String(value)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-sm font-black tabular-nums ${accentColor === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}
        >
          {value}<span className="text-[10px] opacity-60 ml-0.5">{valueSuffix}</span>
        </motion.span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track customizado */}
        <div className="absolute w-full h-1 bg-slate-200 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
             style={{ width: `${pct}%` }}
           />
        </div>
        <input
          type="range"
          min={min} max={max} step={step}
          value={currentValue}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full z-10 opacity-100" 
        />
      </div>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  suffix?: string;
}

export function NumberInput({ label, value, onChange, min = 0, suffix }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative group/input">
        <input
          type="number"
          value={value}
          min={min}
          onChange={e => onChange(Number(e.target.value))}
          className="
            w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3
            text-sm font-bold text-slate-900 tabular-nums outline-none
            focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5
            transition-all duration-300
          "
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
