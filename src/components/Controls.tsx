import React from 'react';

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
  isCurrency?: boolean;
}

const formatCurrencyValue = (num: number) => {
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export function SliderControl({
  label, min, max, currentValue, onChange, accentColor = 'blue', isCurrency = false
}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrency) {
      const digits = e.target.value.replace(/\D/g, '');
      const numericValue = Number(digits) / 100;
      onChange(numericValue);
    } else {
      onChange(Number(e.target.value));
    }
  };

  const handleBlur = () => {
    const bounded = Math.min(max, Math.max(min, currentValue));
    onChange(bounded);
  };

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-focus-within:text-blue-600 group-hover:text-slate-600 transition-colors">
        {label}
      </label>
      <div className="
        relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5
        hover:border-slate-300 focus-within:border-blue-500/70 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5
        transition-all duration-300
      ">
        <input
          type={isCurrency ? "text" : "number"}
          value={isCurrency ? formatCurrencyValue(currentValue) : currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full bg-transparent text-sm font-bold tabular-nums outline-none border-0 p-0 focus:ring-0
            ${accentColor === 'blue' ? 'text-blue-600' : 'text-emerald-600'}
          `}
        />
      </div>
    </div>
  );
}

export function RangeSlider({
  label, value, onChange, min = 0, max = 100, step = 1, suffix = '%', subtitle
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-hover:text-blue-600 transition-colors">
          {label}
        </label>
        <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black rounded-md tabular-nums">
          {value}{suffix}
        </span>
      </div>
      {subtitle && (
        <span className="text-[10px] text-slate-400 font-medium">
          {subtitle}
        </span>
      )}
      <div className="relative flex items-center pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberInput({ label, value, onChange, min = 0, max = 100, step = 0.01, suffix }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] group-focus-within:text-blue-600 group-hover:text-slate-600 transition-colors">
        {label}
      </label>
      <div className="
        relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5
        hover:border-slate-300 focus-within:border-blue-500/70 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5
        transition-all duration-300
      ">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-bold text-slate-800 tabular-nums outline-none border-0 p-0 focus:ring-0"
        />
        {suffix && (
          <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
