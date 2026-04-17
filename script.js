let dias = [];

function obterJornadaNormal(turno) {
    if (turno === 'primeiro') {
        return 8.80; // Primeiro turno: jornada diária de 8h48 (08:00-12:00 e 13:12-18:00)
    } else {
        return 7.92; // Segundo turno: 39,60h/semana = 7,92h/dia
    }
}

document.getElementById('add-day-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    const horasTrabalhadas = parseFloat(document.getElementById('horas-trabalhadas').value);
    const salarioHora = parseFloat(document.getElementById('salario-hora').value);
    const turno = document.getElementById('turno').value;
    const feriado = document.getElementById('feriado').checked;

    if (!data || isNaN(horasTrabalhadas) || isNaN(salarioHora) || horasTrabalhadas < 0 || salarioHora < 0) {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    const dia = {
        data: data,
        horasTrabalhadas: horasTrabalhadas,
        salarioHora: salarioHora,
        turno: turno,
        feriado: feriado
    };

    dias.push(dia);
    atualizarTabela();
    atualizarTotais();

    // Limpar formulário
    document.getElementById('data').value = '';
    document.getElementById('horas-trabalhadas').value = '';
    document.getElementById('feriado').checked = false;
});

document.getElementById('export-btn').addEventListener('click', exportarTabelaCSV);

function atualizarTabela() {
    const tbody = document.getElementById('dias-body');
    tbody.innerHTML = '';

    dias.forEach((dia, index) => {
        const resultado = calcularHorasExtras(dia.horasTrabalhadas, dia.salarioHora, dia.turno, dia.feriado);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatarData(dia.data)}</td>
            <td>${dia.horasTrabalhadas.toFixed(2)}</td>
            <td>${dia.turno === 'primeiro' ? '1º' : '2º'}</td>
            <td>${dia.feriado ? 'Sim' : 'Não'}</td>
            <td>${resultado.horasNormais.toFixed(2)}</td>
            <td>${resultado.horasExtras.toFixed(2)}</td>
            <td>R$ ${resultado.valorExtras.toFixed(2)}</td>
            <td>R$ ${resultado.totalReceber.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="removerDia(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarTotais() {
    if (dias.length === 0) {
        document.getElementById('totais').style.display = 'none';
        return;
    }

    let totalHorasNormais = 0;
    let totalHorasExtras = 0;
    let totalValorExtras = 0;
    let totalReceber = 0;

    dias.forEach(dia => {
        const resultado = calcularHorasExtras(dia.horasTrabalhadas, dia.salarioHora, dia.turno, dia.feriado);
        totalHorasNormais += resultado.horasNormais;
        totalHorasExtras += resultado.horasExtras;
        totalValorExtras += resultado.valorExtras;
        totalReceber += resultado.totalReceber;
    });

    document.getElementById('total-horas-normais').textContent = `Total horas normais: ${totalHorasNormais.toFixed(2)}`;
    document.getElementById('total-horas-extras').textContent = `Total horas extras: ${totalHorasExtras.toFixed(2)}`;
    document.getElementById('total-valor-extras').textContent = `Total valor extras: R$ ${totalValorExtras.toFixed(2)}`;
    document.getElementById('total-receber').textContent = `Total a receber: R$ ${totalReceber.toFixed(2)}`;

    document.getElementById('totais').style.display = 'block';
}

function removerDia(index) {
    dias.splice(index, 1);
    atualizarTabela();
    atualizarTotais();
}

function exportarTabelaCSV() {
    if (dias.length === 0) {
        alert('Adicione ao menos um dia antes de exportar.');
        return;
    }

    const delimiter = ';';
    const headers = [
        'Data',
        'Horas Trabalhadas',
        'Turno',
        'Feriado',
        'Horas Normais',
        'Horas Extras',
        'Valor Extras (R$)',
        'Total Receber (R$)'
    ];

    const rows = dias.map(dia => {
        const resultado = calcularHorasExtras(dia.horasTrabalhadas, dia.salarioHora, dia.turno, dia.feriado);
        return [
            formatarData(dia.data),
            dia.horasTrabalhadas.toFixed(2),
            dia.turno === 'primeiro' ? '1º' : '2º',
            dia.feriado ? 'Sim' : 'Não',
            resultado.horasNormais.toFixed(2),
            resultado.horasExtras.toFixed(2),
            resultado.valorExtras.toFixed(2),
            resultado.totalReceber.toFixed(2)
        ].join(delimiter);
    });

    let totalHorasNormais = 0;
    let totalHorasExtras = 0;
    let totalValorExtras = 0;
    let totalReceber = 0;

    dias.forEach(dia => {
        const resultado = calcularHorasExtras(dia.horasTrabalhadas, dia.salarioHora, dia.turno, dia.feriado);
        totalHorasNormais += resultado.horasNormais;
        totalHorasExtras += resultado.horasExtras;
        totalValorExtras += resultado.valorExtras;
        totalReceber += resultado.totalReceber;
    });

    const totalRows = [
        '',
        `Total horas normais:${delimiter}${totalHorasNormais.toFixed(2)}`,
        '',
        `Total horas extras:${delimiter}${totalHorasExtras.toFixed(2)}`,
        `Total valor extras:${delimiter}R$ ${totalValorExtras.toFixed(2)}`,
        `Total a receber:${delimiter}R$ ${totalReceber.toFixed(2)}`
    ];

    const csvContent = [headers.join(delimiter), ...rows, '', ...totalRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tabela-horas-extras.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function calcularHorasExtras(horasTrabalhadas, salarioHora, turno, feriado) {
    const horasNormaisPorDia = obterJornadaNormal(turno);

    if (feriado) {
        // Em feriados, paga 100% adicional pelas horas trabalhadas
        const valorTotal = horasTrabalhadas * salarioHora * 2;
        return {
            horasNormais: 0, // Não aplicável em feriados
            horasExtras: horasTrabalhadas,
            valorExtras: valorTotal,
            totalReceber: valorTotal
        };
    }

    // Dias normais
    if (horasTrabalhadas <= horasNormaisPorDia) {
        return {
            horasNormais: horasTrabalhadas,
            horasExtras: 0,
            valorExtras: 0,
            totalReceber: horasTrabalhadas * salarioHora
        };
    }

    const horasExtras = horasTrabalhadas - horasNormaisPorDia;
    // Horas extras sempre 50%, independente da quantidade
    const valorExtras = horasExtras * salarioHora * 1.5;
    const totalReceber = (horasNormaisPorDia * salarioHora) + valorExtras;

    return {
        horasNormais: horasNormaisPorDia,
        horasExtras: horasExtras,
        valorExtras: valorExtras,
        totalReceber: totalReceber
    };
}

function formatarData(dataString) {
    // Evita o deslocamento de fuso horário ao formatar datas de input type="date"
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.toLocaleDateString('pt-BR');
}