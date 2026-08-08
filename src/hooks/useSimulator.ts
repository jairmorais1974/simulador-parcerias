import { useState, useMemo } from 'react';
import { SimInputs, calcScenario, ScenarioResult } from '../lib/calc';

const DEFAULT_INPUTS: SimInputs = {
  licencas: 30,
  preco: 7500,
  fixoDev: 3000,
  taxPJ: 12,
  custoP: 0,
  custoD: 350,
  regimeDev: 'lucro_presumido',
  pctDevCenario1: 30,
};

export function useSimulator() {
  const [inputs, setInputs] = useState<SimInputs>(DEFAULT_INPUTS);
  const [periodo, setPeriodo] = useState<'mensal' | 'anual'>('anual');

  const set = <K extends keyof SimInputs>(key: K, value: SimInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results: ScenarioResult[] = useMemo(() => calcScenario(inputs), [inputs]);
  const brutoTotal = inputs.licencas * inputs.preco;

  return { inputs, set, results, brutoTotal, periodo, setPeriodo };
}
