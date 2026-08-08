// Tabela progressiva IRPF 2024 (base mensal)
export function calcIRPF(mensal: number): number {
  if (mensal <= 2259.20) return 0;
  if (mensal <= 2826.65) return mensal * 0.075 - 169.44;
  if (mensal <= 3751.05) return mensal * 0.15 - 381.44;
  if (mensal <= 4664.68) return mensal * 0.225 - 662.77;
  return mensal * 0.275 - 896.00;
}

export function formatBRL(val: number): string {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export type RegimeDev = 'lucro_presumido' | 'pf';

export interface SimInputs {
  licencas: number;
  preco: number;
  fixoDev: number;
  taxPJ: number;     // percentual (ex: 12)
  custoP: number;    // mensal parceiro
  custoD: number;    // mensal dev (infra)
  regimeDev: RegimeDev; // 'lucro_presumido' (17%) ou 'pf' (tabela IRPF)
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
  dIRPF: number;     // Valor do imposto do dev (seja PJ 17% ou IRPF PF)
  dTaxaTipo: RegimeDev;
  dImpostoLabel: string;
  dInfra: number;
  dLiq: number;
  pctEquiv?: number; // só no cenário fixo
}

export function calcScenario(inputs: SimInputs): ScenarioResult[] {
  const { licencas, preco, fixoDev, taxPJ, custoP, custoD, regimeDev = 'lucro_presumido' } = inputs;
  const brutoTotal = licencas * preco;
  const impostoPJTotal = brutoTotal * (taxPJ / 100);

  const raw = [
    { id: 1, label: '30% Dev / 70% Par', pShare: 0.70, dShare: 0.30, type: 'pct' as const },
    { id: 2, label: '40% Dev / 60% Par', pShare: 0.60, dShare: 0.40, type: 'pct' as const },
    { id: 3, label: 'Valor Fixo',         pShare: 0,    dShare: 0,    type: 'fixed' as const },
    { id: 4, label: 'Venda Direta (Sem Parceiro)', pShare: 0, dShare: 1.0, type: 'direct' as const },
  ];

  return raw.map(s => {
    let pBruto: number, dBruto: number;
    let pImpostos = 0;
    let pCustos = 0;
    let dImpostosPJ = 0;

    if (s.type === 'fixed') {
      dBruto = licencas * fixoDev;
      pBruto = brutoTotal - dBruto;
      pImpostos = impostoPJTotal;
      pCustos = custoP * 12;
    } else if (s.type === 'direct') {
      pBruto = 0;
      dBruto = brutoTotal;
      pImpostos = 0;
      pCustos = 0;
      dImpostosPJ = impostoPJTotal;
    } else {
      pBruto = brutoTotal * s.pShare;
      dBruto = brutoTotal * s.dShare;
      pImpostos = impostoPJTotal;
      pCustos = custoP * 12;
    }

    const pLiq = s.type === 'direct' ? 0 : (pBruto - pImpostos - pCustos);

    let dImpostoDev = 0;
    let dLiq = 0;
    let dImpostoLabel = '';

    if (s.type === 'direct') {
      // Venda direta pela própria PJ do desenvolvedor
      dImpostoDev = dImpostosPJ;
      dImpostoLabel = `Imposto PJ Direct (${taxPJ}%)`;
      dLiq = dBruto - dImpostosPJ - (custoD * 12);
    } else {
      if (regimeDev === 'lucro_presumido') {
        // 17% de Lucro Presumido sobre a receita/royalties do Dev
        dImpostoDev = dBruto * 0.17;
        dImpostoLabel = 'Imposto Lucro Pres. (17%)';
        dLiq = dBruto - dImpostoDev - (custoD * 12);
      } else {
        // Tabela IRPF (Pessoa Física)
        const dBrutoMes = dBruto / 12;
        const dIRPFMes = calcIRPF(dBrutoMes);
        dImpostoDev = dIRPFMes * 12;
        dImpostoLabel = 'Retenção IRPF (PF)';
        dLiq = (dBrutoMes - dIRPFMes - custoD) * 12;
      }
    }

    const pctEquiv = s.type === 'fixed' ? (fixoDev / preco) * 100 : undefined;

    return {
      id: s.id,
      label: s.label,
      pShare: s.type === 'direct' ? '0%' : `${Math.round(s.pShare * 100)}%`,
      dShare: s.type === 'fixed' ? `${pctEquiv!.toFixed(1)}%` : `${Math.round(s.dShare * 100)}%`,
      pBruto,
      pImpostos,
      pCustos,
      pLiq,
      dBruto,
      dIRPF: dImpostoDev,
      dTaxaTipo: regimeDev,
      dImpostoLabel,
      dInfra: custoD * 12,
      dLiq: Math.max(0, dLiq),
      pctEquiv,
    };
  });
}

export function projectResult(results: ScenarioResult[], periodo: 'mensal' | 'anual'): ScenarioResult[] {
  if (periodo === 'anual') return results;
  return results.map(r => ({
    ...r,
    pBruto: r.pBruto / 12,
    pImpostos: r.pImpostos / 12,
    pCustos: r.pCustos / 12,
    pLiq: r.pLiq / 12,
    dBruto: r.dBruto / 12,
    dIRPF: r.dIRPF / 12,
    dInfra: r.dInfra / 12,
    dLiq: r.dLiq / 12,
  }));
}
