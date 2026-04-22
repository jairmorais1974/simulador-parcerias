// Tabela progressiva IRPF 2024 (base mensal)
export function calcIRPF(mensal: number): number {
  if (mensal <= 2259.20) return 0;
  if (mensal <= 2826.65) return mensal * 0.075 - 169.44;
  if (mensal <= 3751.05) return mensal * 0.15 - 381.44;
  if (mensal <= 4664.68) return mensal * 0.225 - 662.77;
  return mensal * 0.275 - 896.00;
}

export function formatBRL(val: number): string {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export interface SimInputs {
  licencas: number;
  preco: number;
  fixoDev: number;
  taxPJ: number;     // percentual (ex: 12)
  custoP: number;    // mensal parceiro
  custoD: number;    // mensal dev (infra)
}

export interface ScenarioResult {
  id: number;
  label: string;
  pShare: string;    // ex: "70%"
  dShare: string;    // ex: "30%"
  pBruto: number;
  pImpostos: number;
  pCustos: number;
  pLiq: number;
  dBruto: number;
  dIRPF: number;
  dInfra: number;
  dLiq: number;
  pctEquiv?: number; // só no cenário fixo
}

export function calcScenario(inputs: SimInputs): ScenarioResult[] {
  const { licencas, preco, fixoDev, taxPJ, custoP, custoD } = inputs;
  const brutoTotal = licencas * preco;
  const impostoPJTotal = brutoTotal * (taxPJ / 100);

  const raw = [
    { id: 1, label: '30% Dev / 70% Par', pShare: 0.70, dShare: 0.30, type: 'pct' as const },
    { id: 2, label: '40% Dev / 60% Par', pShare: 0.60, dShare: 0.40, type: 'pct' as const },
    { id: 3, label: 'Valor Fixo',         pShare: 0,    dShare: 0,    type: 'fixed' as const },
  ];

  return raw.map(s => {
    let pBruto: number, dBruto: number;
    if (s.type === 'fixed') {
      dBruto = licencas * fixoDev;
      pBruto = brutoTotal - dBruto;
    } else {
      pBruto = brutoTotal * s.pShare;
      dBruto = brutoTotal * s.dShare;
    }

    const pLiq = pBruto - impostoPJTotal - custoP * 12;

    const dBrutoMes = dBruto / 12;
    const dIRPFMes = calcIRPF(dBrutoMes);
    const dLiq = (dBrutoMes - dIRPFMes - custoD) * 12;

    const pctEquiv = s.type === 'fixed' ? (fixoDev / preco) * 100 : undefined;

    return {
      id: s.id,
      label: s.label,
      pShare: `${Math.round(s.pShare * 100)}%`,
      dShare: s.type === 'fixed' ? `${pctEquiv!.toFixed(1)}%` : `${Math.round(s.dShare * 100)}%`,
      pBruto,
      pImpostos: impostoPJTotal,
      pCustos: custoP * 12,
      pLiq,
      dBruto,
      dIRPF: dIRPFMes * 12,
      dInfra: custoD * 12,
      dLiq: Math.max(0, dLiq),
      pctEquiv,
    };
  });
}
