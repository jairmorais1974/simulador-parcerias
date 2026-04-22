// Seletores de Input
const inLicencas = document.getElementById('in-licencas');
const inPreco = document.getElementById('in-preco');
const inFixoDev = document.getElementById('in-fixo-dev');
const inTaxPJ = document.getElementById('in-tax-pj');
const inCustoP = document.getElementById('in-custo-p');
const inCustoD = document.getElementById('in-custo-d');

// Seletores de Display
const valLicencas = document.getElementById('val-licencas');
const valPreco = document.getElementById('val-preco');
const valFixoDev = document.getElementById('val-fixo-dev');
const resBrutoTotal = document.getElementById('res-bruto-total');

let chart;

function formatBRL(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

// Tabela IRPF 2024 Simplificada (Base Mensal)
function calcIRPF(mensal) {
    if (mensal <= 2259.20) return 0;
    if (mensal <= 2826.65) return (mensal * 0.075) - 169.44;
    if (mensal <= 3751.05) return (mensal * 0.150) - 381.44;
    if (mensal <= 4664.68) return (mensal * 0.225) - 662.77;
    return (mensal * 0.275) - 896.00;
}

function update() {
    const licencas = parseInt(inLicencas.value);
    const preco = parseInt(inPreco.value);
    const fixoDev = parseInt(inFixoDev.value);
    const taxPJ = parseFloat(inTaxPJ.value) / 100;
    const custoP = parseFloat(inCustoP.value) || 0;
    const custoD = parseFloat(inCustoD.value) || 0;

    // Atualiza labels
    valLicencas.innerText = licencas;
    valPreco.innerText = preco.toLocaleString('pt-BR');
    valFixoDev.innerText = fixoDev.toLocaleString('pt-BR');

    const brutoTotal = licencas * preco;
    resBrutoTotal.innerText = formatBRL(brutoTotal);

    const scenarios = [
        { id: 1, pShare: 0.7, dShare: 0.3, type: 'pct' },
        { id: 2, pShare: 0.6, dShare: 0.4, type: 'pct' },
        { id: 3, dFixed: fixoDev, type: 'fixed' }
    ];

    const chartDataP = [];
    const chartDataD = [];

    scenarios.forEach(s => {
        let pBrutoAno, dBrutoAno;

        if (s.type === 'fixed') {
            dBrutoAno = licencas * s.dFixed;
            pBrutoAno = brutoTotal - dBrutoAno;
        } else {
            pBrutoAno = brutoTotal * s.pShare;
            dBrutoAno = brutoTotal * s.dShare;
        }

        // Imposto PJ integral pago pelo Parceiro
        const impostoPJTotal = brutoTotal * taxPJ;

        // Líquido Parceiro
        // Regra: Fica com sua parte bruta, mas paga TODO o imposto do projeto e seus custos operacionais
        const pLiqAno = pBrutoAno - impostoPJTotal - (custoP * 12);

                // Líquido Desenvolvedor (PF)
        // Regra: Recebe sua parte bruta, paga IRPF mensal e seus custos de infra
        const dBrutoMes = dBrutoAno / 12;
        const dIRPFMes = calcIRPF(dBrutoMes);
        const dLiqAno = (dBrutoMes - dIRPFMes - custoD) * 12;

        // Atualizar UI
        document.getElementById(`c${s.id}-p-bruto`).innerText = formatBRL(pBrutoAno);
        document.getElementById(`c${s.id}-p-liq`).innerText = formatBRL(Math.max(0, pLiqAno));
        document.getElementById(`c${s.id}-d-bruto`).innerText = formatBRL(dBrutoAno);
        document.getElementById(`c${s.id}-d-irpf`).innerText = formatBRL(dIRPFMes * 12);
        document.getElementById(`c${s.id}-d-infra`).innerText = formatBRL(custoD * 12);
        document.getElementById(`c${s.id}-d-liq`).innerText = formatBRL(Math.max(0, dLiqAno));

        // Atualizar percentual equivalente no Cenário 3
        if (s.id === 3) {
            const pctEquiv = ((fixoDev / preco) * 100).toFixed(1);
            document.getElementById('c3-pct-equiv').innerText = `${pctEquiv}%`;
        }

        // Cores de alerta para prejuízo
        const pElement = document.getElementById(`c${s.id}-p-liq`);
        if (pLiqAno < 0) {
            pElement.style.color = '#ef4444';
        } else {
            pElement.style.color = '#f1f5f9';
        }

        chartDataP.push(Math.max(0, pLiqAno));
        chartDataD.push(Math.max(0, dLiqAno));
    });

    updateChart(chartDataP, chartDataD);
}

function updateChart(dataP, dataD) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    const chartContent = {
        labels: ['30/70', '40/60', 'Valor Fixo'],
        datasets: [
            {
                label: 'Líquido Parceiro (PJ)',
                data: dataP,
                backgroundColor: 'rgba(148, 163, 184, 0.4)',
                borderColor: '#94a3b8',
                borderWidth: 1,
                borderRadius: 8,
            },
            {
                label: 'Líquido Jair (PF)',
                data: dataD,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#3b82f6'
            }
        ]
    };

    if (chart) {
        chart.data = chartContent;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'bar',
            data: chartContent,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#94a3b8',
                            callback: (v) => 'R$ ' + (v/1000) + 'k'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { weight: 'bold' } }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#f8fafc', font: { size: 12, weight: '600' }, padding: 20 }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#fff',
                        bodyColor: '#f8fafc',
                        borderColor: '#334155',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${formatBRL(context.raw)}`
                        }
                    }
                }
            }
        });
    }
}

// Event Listeners
[inLicencas, inPreco, inFixoDev, inTaxPJ, inCustoP, inCustoD].forEach(el => {
    el.addEventListener('input', update);
});

// Init
window.onload = update;
