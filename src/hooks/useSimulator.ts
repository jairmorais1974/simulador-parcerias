import { useState, useMemo } from 'react';
import { SimInputs, calcScenario, ScenarioResult } from '../lib/calc';

const DEFAULT_INPUTS: SimInputs = {
  licencas: 30,
  preco: 17000,
  fixoDev: 6400,
  taxPJ: 12,
  custoP: 900,
  custoD: 800,
};

export function useSimulator() {
  const [inputs, setInputs] = useState<SimInputs>(DEFAULT_INPUTS);

  const set = <K extends keyof SimInputs>(key: K, value: SimInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results: ScenarioResult[] = useMemo(() => calcScenario(inputs), [inputs]);
  const brutoTotal = inputs.licencas * inputs.preco;

  return { inputs, set, results, brutoTotal };
}
