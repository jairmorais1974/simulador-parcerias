import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Tooltip, Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ScenarioResult, formatBRL } from '../lib/calc';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  results: ScenarioResult[];
}

export function ComparisonChart({ results }: Props) {
  const labels = results.map(r => r.label);

  const data = {
    labels,
    datasets: [
      {
        label: 'Líquido Parceiro (PJ)',
        data: results.map(r => r.pLiq),
        backgroundColor: 'rgba(203, 213, 225, 0.4)', // slate-300 alpha
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        borderRadius: 12,
        maxBarThickness: 40,
      },
      {
        label: 'Líquido Jair — Dev (PF)',
        data: results.map(r => r.dLiq),
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const {ctx: canvasCtx, chartArea} = chart;
          if (!chartArea) return '#2563eb';
          const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, '#2563eb');
          gradient.addColorStop(1, '#60a5fa');
          return gradient;
        },
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 12,
        maxBarThickness: 40,
        hoverBackgroundColor: '#1d4ed8'
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9', drawTicks: false },
        border: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 10, weight: 500 },
          padding: 10,
          callback: v => `R$ ${(Number(v) / 1000).toFixed(0)}k`,
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { 
          color: '#64748b', 
          font: { family: 'Inter', size: 10, weight: 'bold' },
          padding: 10
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleFont: { family: 'Space Grotesk', size: 13, weight: 'bold' },
        titleColor: '#0f172a',
        bodyFont: { family: 'Inter', size: 12 },
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 16,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 6,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${formatBRL(ctx.raw as number)}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[320px]">
      <Bar data={data} options={options} />
    </div>
  );
}
