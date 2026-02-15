// =========================================================
// FUNÇÕES PARA O MENU DE NAVEGAÇÃO LATERAL
// =========================================================

// Função para abrir/fechar o menu lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-menu');
    sidebar.classList.toggle('open');
}

/**
 * Fecha o menu lateral e executa o scroll suave para a âncora.
 * @param {Event} event - O evento de clique.
 */
function closeSidebar(event) {
    const sidebar = document.getElementById('sidebar-menu');
    
    // Fecha o menu imediatamente
    sidebar.classList.remove('open');
    
    // Verifica se o clique veio de um link <a> para fazer a navegação
    if (event && event.target && event.target.tagName === 'A') {
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Previne o comportamento padrão (salto abrupto)
            event.preventDefault(); 
            
            // Scroll suave para o elemento, com offset para o header fixo
            window.scrollTo({
                // Offset de 100px para garantir que o cabeçalho não cubra o título
                top: targetElement.offsetTop - 100, 
                behavior: 'smooth'
            });
        }
    }
}

// Funções de atualização dos totais do BH em tempo real (para uso no HTML)
function getValidValue(id) {
    const value = parseFloat(document.getElementById(id)?.value);
    // Retorna 0 se não for um número válido ou for negativo
    return isNaN(value) || value < 0 ? 0 : value;
}

function atualizarTotalIngestas() {
    const ev = getValidValue('ev');
    const vo = getValidValue('vo');
    const sng = getValidValue('sng');
    const outrasIngestas = getValidValue('outras_ingestas');
    const totalIngestas = ev + vo + sng + outrasIngestas;
    const display = document.getElementById('total-ingestas-display');
    if (display) display.textContent = `Total Ingestas: ${totalIngestas.toFixed(0)} mL`;
}

function atualizarTotalEliminacoes() {
    const diurese = getValidValue('diurese');
    const drenos = getValidValue('drenos');
    const vomitos = getValidValue('vomitos');
    const outrasEliminacoes = getValidValue('outras_eliminacoes');
    const totalEliminacoes = diurese + drenos + vomitos + outrasEliminacoes;
    const display = document.getElementById('total-eliminacoes-display');
    if (display) display.textContent = `Total Eliminações: ${totalEliminacoes.toFixed(0)} mL`;
}

// =========================================================
// FUNÇÕES AUXILIARES PARA EXPLICAÇÃO
// =========================================================

// Função genérica para mostrar/esconder o bloco de explicação
function toggleExplicacao(idBase) {
    const explicacaoDiv = document.getElementById(`explicacao-${idBase}`);
    // Busca o botão que chamou esta função (para alterar o texto)
    const botao = document.querySelector(`.explanation-toggle[onclick*="'${idBase}'"]`);

    if (!explicacaoDiv || !botao) return;

    if (explicacaoDiv.style.display === 'none' || explicacaoDiv.style.display === '') {
        explicacaoDiv.style.display = 'block';
        botao.textContent = 'Ocultar Explicação';
        botao.classList.add('active');
    } else {
        explicacaoDiv.style.display = 'none';
        botao.textContent = 'Mostrar Explicação';
        botao.classList.remove('active');
    }
}

// Função auxiliar para resetar o estado da explicação ao recalcular
function resetExplicacao(idBase) {
    const explicacaoDiv = document.getElementById(`explicacao-${idBase}`);
    const botao = document.querySelector(`.explanation-toggle[onclick*="'${idBase}'"]`);
    if (explicacaoDiv && botao) {
        explicacaoDiv.style.display = 'none';
        botao.textContent = 'Mostrar Explicação';
        botao.classList.remove('active');
    }
}


// =========================================================
// MÓDULO 1: CALCULADORA DE GOTEJAMENTO
// =========================================================

function calcularGotejamento() {
    const volumeTotal = parseFloat(document.getElementById('volume').value);
    const tempoHoras = parseFloat(document.getElementById('tempo').value);
    const resultadoDiv = document.getElementById('resultado');
    
    resultadoDiv.classList.remove('erro');
    
    // Validação
    if (isNaN(volumeTotal) || isNaN(tempoHoras) || volumeTotal <= 0 || tempoHoras <= 0) {
        resultadoDiv.innerHTML = '🚨 **Erro:** Por favor, insira valores válidos e positivos (mL e horas).';
        resultadoDiv.classList.add('erro');
        resetExplicacao('gotejamento');
        return; 
    }

    // Cálculos
    // Gotas/min = Volume / (Tempo em h * 3)
    const gotasPorMinuto = (volumeTotal / (tempoHoras * 3)).toFixed(1);
    // Microgotas/min = Volume / Tempo em h
    const microgotasPorMinuto = (volumeTotal / tempoHoras).toFixed(1); 

    // Exibe o resultado formatado
    resultadoDiv.style.backgroundColor = '#e6f0ff';
    resultadoDiv.style.borderColor = '#007bff';
    resultadoDiv.innerHTML = `
        ✅ **Resultados da Infusão:**
        <p>Volume Total: **${volumeTotal} mL**</p>
        <p>Tempo de Infusão: **${tempoHoras} horas**</p>
        <hr style="border-top: 1px solid #007bff4d;">
        <h4>Velocidade de Gotejamento:</h4>
        <ul>
            <li>**Gotas por Minuto (GTS/min):** <span style="color: #dc3545;">**${gotasPorMinuto}**</span></li>
            <li>**Microgotas por Minuto (MGT/min):** <span style="color: #007bff;">**${microgotasPorMinuto}**</span></li>
        </ul>
        <p style="font-size: 0.9em; margin-top: 10px;">*Lembre-se: Microgotas/min é o mesmo que mL/hora.</p>
    `;

    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('gotejamento');
    const explicacaoDiv = document.getElementById('explicacao-gotejamento');
    const gotasFormula = `GTS/min = Volume (mL) / [Tempo (h) x 3]`;
    const microgotasFormula = `MGT/min = Volume (mL) / Tempo (h)`;
    
    const explicacaoHTML = `
        <h3>Fórmulas Utilizadas:</h3>
        <p>1. **Macrogotas/min (GTS/min):** ${gotasFormula}</p>
        <p>2. **Microgotas/min (MGT/min):** ${microgotasFormula}</p>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>1. **Gotas/min:** ${volumeTotal} mL / (${tempoHoras} h x 3) = **${gotasPorMinuto} GTS/min**</p>
        <p>2. **Microgotas/min:** ${volumeTotal} mL / ${tempoHoras} h = **${microgotasPorMinuto} MGT/min**</p>
        <p style="font-size: 0.9em; margin-top: 10px;">*O valor '3' na fórmula de gotas é o fator de conversão (1 mL ≈ 20 gotas, ou 1 gota ≈ 3 microgotas).</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}

// =========================================================
// MÓDULO 2: CALCULADORA DE DILUIÇÃO E DOSAGEM
// =========================================================

function calcularDosagem() {
    const disponivelMg = parseFloat(document.getElementById('disponivel_mg').value);
    const disponivelMl = parseFloat(document.getElementById('disponivel_ml').value);
    const prescritoMg = parseFloat(document.getElementById('prescrito_mg').value);
    const resultadoDiv = document.getElementById('resultado-dosagem');
    
    resultadoDiv.classList.remove('erro');

    // Validação
    if (isNaN(disponivelMg) || isNaN(disponivelMl) || isNaN(prescritoMg) || disponivelMg <= 0 || disponivelMl <= 0 || prescritoMg <= 0) {
        resultadoDiv.innerHTML = '🚨 **Erro:** Por favor, insira valores válidos e positivos em todos os campos.';
        resultadoDiv.classList.add('erro');
        resetExplicacao('dosagem');
        return; 
    }
    
    // Cálculo da Dosagem (Regra de Três): X = (Prescrito * Volume Disponível) / Concentração Disponível
    const volumeAspirar = (prescritoMg * disponivelMl) / disponivelMg;
    
    const volumeFinal = volumeAspirar.toFixed(2);
    
    // Exibe o resultado
    resultadoDiv.style.backgroundColor = '#fff0f0';
    resultadoDiv.style.borderColor = '#dc3545';
    resultadoDiv.innerHTML = `
        ✅ **Resultado da Dosagem:**
        <p>Prescrito: **${prescritoMg} mg**</p>
        <p>Disponível: **${disponivelMg} mg** em **${disponivelMl} mL**</p>
        <hr style="border-top: 1px solid #dc35454d;">
        <h4>Volume a Aspirar:</h4>
        <p style="font-size: 1.5em; color: #007bff;">**${volumeFinal} mL**</p>
    `;

    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('dosagem');
    const explicacaoDiv = document.getElementById('explicacao-dosagem');
    const formula = `V = (Prescrito * Volume Disponível) / Concentração Disponível`;
    
    const explicacaoHTML = `
        <h3>Fórmula Utilizada (Regra de Três):</h3>
        <pre style="background: #e9ecef; padding: 10px; border-radius: 4px;">
Disponível (${disponivelMg} mg) está para ${disponivelMl} mL
Prescrito (${prescritoMg} mg) está para X mL
        </pre>
        <p>O que resulta na fórmula: **Volume Aspirar (X)** = ${formula}</p>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>X = (${prescritoMg} mg * ${disponivelMl} mL) / ${disponivelMg} mg</p>
        <p>X = ${(prescritoMg * disponivelMl).toFixed(2)} / ${disponivelMg}</p>
        <p>X = **${volumeFinal} mL**</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}


// =========================================================
// MÓDULO 3: CALCULADORA DE BALANÇO HÍDRICO (BH)
// =========================================================

function calcularBalançoHidrico() {
    // 1. Obter Ingestas
    const ev = getValidValue('ev');
    const vo = getValidValue('vo');
    const sng = getValidValue('sng');
    const outrasIngestas = getValidValue('outras_ingestas');

    const totalIngestas = ev + vo + sng + outrasIngestas;

    // 2. Obter Eliminações
    const diurese = getValidValue('diurese');
    const drenos = getValidValue('drenos');
    const vomitos = getValidValue('vomitos');
    const outrasEliminacoes = getValidValue('outras_eliminacoes');

    const totalEliminacoes = diurese + drenos + vomitos + outrasEliminacoes;

    // 3. Calcular BH
    const balancoHidrico = totalIngestas - totalEliminacoes;
    const resultadoDiv = document.getElementById('resultado-bh');

    // 4. Atualizar Display de Totais
    document.getElementById('total-ingestas-display').textContent = `Total Ingestas: ${totalIngestas.toFixed(0)} mL`;
    document.getElementById('total-eliminacoes-display').textContent = `Total Eliminações: ${totalEliminacoes.toFixed(0)} mL`;

    // 5. Exibir Resultado BH

    let status = 'neutro';
    let cor = '#6c757d';
    let sinal = '';

    if (balancoHidrico > 50) { // BH Positivo (Retenção)
        status = 'Positivo';
        cor = '#dc3545'; // Vermelho/Perigo
        sinal = '+';
    } else if (balancoHidrico < -50) { // BH Negativo (Perda)
        status = 'Negativo';
        cor = '#007bff'; // Azul/Déficit
        sinal = ''; // Não precisa de sinal de menos, o próprio balancoHidrico já terá
    } else {
        status = 'Neutro (Quase Equilibrado)';
        cor = '#28a745'; // Verde/Estável
    }
    
    // Formatação do Resultado
    resultadoDiv.style.backgroundColor = `${cor}1a`; 
    resultadoDiv.style.borderColor = cor;
    resultadoDiv.innerHTML = `
        <h3>💧 Balanço Hídrico (BH) em 24h:</h3>
        <p style="font-size: 1.5em; color: ${cor}; font-weight: bold;">
            BH Total: ${sinal}${balancoHidrico.toFixed(0)} mL
        </p>
        <p>Status: **${status}**</p>
        <hr style="border-top: 1px solid ${cor}4d;">
        <ul>
            <li>**Total Ingestas:** ${totalIngestas.toFixed(0)} mL</li>
            <li>**Total Eliminações:** ${totalEliminacoes.toFixed(0)} mL</li>
        </ul>
        <p style="font-size: 0.9em; margin-top: 10px;">*BH positivo indica retenção líquida. BH negativo indica déficit ou perda.</p>
    `;

    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('bh');
    const explicacaoDiv = document.getElementById('explicacao-bh');
    const formula = `BH = Total de Ingestas - Total de Eliminações`;
    
    const explicacaoHTML = `
        <h3>Fórmula Utilizada:</h3>
        <p>BH (mL) = ${formula}</p>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>1. **Total Ingestas:** ${ev} (EV) + ${vo} (VO) + ${sng} (SNG) + ${outrasIngestas} (Outras) = **${totalIngestas.toFixed(0)} mL**</p>
        <p>2. **Total Eliminações:** ${diurese} (Diurese) + ${drenos} (Drenos) + ${vomitos} (Vômitos) + ${outrasEliminacoes} (Outras) = **${totalEliminacoes.toFixed(0)} mL**</p>
        <p>3. **BH Final:** ${totalIngestas.toFixed(0)} mL - ${totalEliminacoes.toFixed(0)} mL = **${sinal}${balancoHidrico.toFixed(0)} mL**</p>
        <p style="font-size: 0.9em; margin-top: 10px;">*Nota: Perdas insensíveis (suor, respiração) não são incluídas no cálculo manual padrão de BH, mas são importantes na avaliação clínica total.</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}

// Otimização: Recalcular os totais em tempo real ao digitar
document.querySelectorAll('.bh-section input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
        if (['ev', 'vo', 'sng', 'outras_ingestas'].includes(input.id)) {
            atualizarTotalIngestas();
        } else if (['diurese', 'drenos', 'vomitos', 'outras_eliminacoes'].includes(input.id)) {
            atualizarTotalEliminacoes();
        }
    });
});


// =========================================================
// MÓDULO 4: CALCULADORAS ADICIONAIS
// =========================================================

// CALCULA DOSE PEDIÁTRICA
function calcularDosePediatrica() {
    const doseRecomendada = parseFloat(document.getElementById('dose-recomendada').value);
    const pesoCrianca = parseFloat(document.getElementById('peso-crianca').value);
    const resultadoDiv = document.getElementById('resultado-pediatrica');

    resultadoDiv.classList.remove('erro');

    if (isNaN(doseRecomendada) || isNaN(pesoCrianca) || doseRecomendada <= 0 || pesoCrianca <= 0) {
        resultadoDiv.innerHTML = '🚨 **Erro:** Insira valores válidos e positivos para a dose (mg/Kg) e o peso (Kg).';
        resultadoDiv.classList.add('erro');
        resetExplicacao('pediatrica');
        return;
    }

    // Cálculo: Dose Total (mg) = Dose Recomendada (mg/Kg) * Peso (Kg)
    const doseTotal = (doseRecomendada * pesoCrianca).toFixed(2);

    resultadoDiv.style.backgroundColor = '#e6ffec';
    resultadoDiv.style.borderColor = '#28a745';
    resultadoDiv.innerHTML = `
        ✅ **Resultado da Dose Pediátrica:**
        <p>Dose Recomendada: **${doseRecomendada} mg/Kg**</p>
        <p>Peso da Criança: **${pesoCrianca} Kg**</p>
        <hr style="border-top: 1px solid #28a7454d;">
        <h4>Dose Total a Ser Administrada:</h4>
        <p style="font-size: 1.5em; color: #dc3545;">**${doseTotal} mg**</p>
    `;

    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('pediatrica');
    const explicacaoDiv = document.getElementById('explicacao-pediatrica');
    const formula = `Dose Total (mg) = Dose Recomendada (mg/Kg) x Peso (Kg)`;
    
    const explicacaoHTML = `
        <h3>Fórmula Utilizada:</h3>
        <p>${formula}</p>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>Dose Total = ${doseRecomendada} mg/Kg x ${pesoCrianca} Kg</p>
        <p>Dose Total = **${doseTotal} mg**</p>
        <p style="font-size: 0.9em; margin-top: 10px;">*Este cálculo define a quantidade total de medicamento (em mg) que a criança deve receber, antes de qualquer diluição.</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}

// CALCULA UNIDADES DE INSULINA
function calcularInsulina() {
    const unidadesPrescritas = parseFloat(document.getElementById('unidades-prescritas').value);
    const unidadesMl = parseFloat(document.getElementById('unidades-ml').value);
    const resultadoDiv = document.getElementById('resultado-insulina');

    resultadoDiv.classList.remove('erro');

    if (isNaN(unidadesPrescritas) || isNaN(unidadesMl) || unidadesPrescritas <= 0 || unidadesMl <= 0) {
        resultadoDiv.innerHTML = '🚨 **Erro:** Insira valores válidos e positivos para as Unidades e Concentração (U/mL).';
        resultadoDiv.classList.add('erro');
        resetExplicacao('insulina');
        return;
    }

    // Cálculo: Volume (mL) = Unidades Prescritas (U) / Concentração (U/mL)
    const volumeAspirar = (unidadesPrescritas / unidadesMl).toFixed(2);

    resultadoDiv.style.backgroundColor = '#fff8e1';
    resultadoDiv.style.borderColor = '#ffc107';
    resultadoDiv.innerHTML = `
        ✅ **Resultado da Insulina:**
        <p>Unidades Prescritas: **${unidadesPrescritas} U**</p>
        <p>Concentração do Frasco: **${unidadesMl} U/mL**</p>
        <hr style="border-top: 1px solid #ffc1074d;">
        <h4>Volume a Aspirar:</h4>
        <p style="font-size: 1.5em; color: #007bff;">**${volumeAspirar} mL**</p>
    `;
    
    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('insulina');
    const explicacaoDiv = document.getElementById('explicacao-insulina');
    const formula = `Volume (mL) = Unidades Prescritas (U) / Concentração (U/mL)`;
    
    const explicacaoHTML = `
        <h3>Fórmula Utilizada:</h3>
        <p>${formula}</p>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>Volume = ${unidadesPrescritas} U / ${unidadesMl} U/mL</p>
        <p>Volume = **${volumeAspirar} mL**</p>
        <p style="font-size: 0.9em; margin-top: 10px;">*Este cálculo é essencial quando se usa seringas de insulina não padronizadas ou a insulina não está na seringa pré-dosada.</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}

// CONVERSÃO DE UNIDADES
function converterUnidades() {
    const valorInput = document.getElementById('valor-converter');
    const valor = parseFloat(valorInput?.value);
    const origem = document.getElementById('unidade-origem')?.value;
    const destino = document.getElementById('unidade-destino')?.value;
    const resultadoDiv = document.getElementById('resultado-conversao');

    let valorFinal = 0;
    let valorEmMg = 0;
    let unidadeFinal = destino;

    resultadoDiv.classList.remove('erro');
    if (isNaN(valor)) {
        resultadoDiv.innerHTML = '🚨 **Erro:** Insira um valor numérico válido.';
        resultadoDiv.classList.add('erro');
        resetExplicacao('conversao');
        return;
    }

    // Passo 1: Converter valor de origem para Miligramas (mg)
    switch (origem) {
        case 'g':
            valorEmMg = valor * 1000;
            break;
        case 'mg':
            valorEmMg = valor;
            break;
        case 'mcg':
            valorEmMg = valor / 1000;
            break;
        default:
             valorEmMg = valor; // Caso de fallback, mantendo o valor
    }

    // Passo 2: Converter de Miligramas (mg) para a unidade de destino
    let fatorConversao = 0;
    let isMultiplication = false;

    switch (destino) {
        case 'g':
            valorFinal = valorEmMg / 1000;
            fatorConversao = 1000;
            break;
        case 'mg':
            valorFinal = valorEmMg;
            fatorConversao = 1;
            break;
        case 'mcg':
            valorFinal = valorEmMg * 1000;
            fatorConversao = 1000;
            isMultiplication = true;
            break;
        default:
            valorFinal = valorEmMg; // Caso de fallback, mantendo o valor
    }

    // Remove zeros à direita e o ponto decimal se for inteiro
    const valorFormatado = valorFinal.toFixed(4).replace(/\.?0+$/, '');
    
    resultadoDiv.style.backgroundColor = '#f8f9fa';
    resultadoDiv.style.borderColor = '#6c757d';
    resultadoDiv.innerHTML = `
        ✅ **Resultado da Conversão:**
        <p style="font-size: 1.5em; color: #007bff;">**${valorFormatado} ${unidadeFinal}**</p>
    `;
    
    // --- GERAÇÃO DA EXPLICAÇÃO ---
    resetExplicacao('conversao');
    const explicacaoDiv = document.getElementById('explicacao-conversao');
    const explicacaoHTML = `
        <h3>Fatores de Conversão (Base: Miligrama - mg):</h3>
        <ul>
            <li>**1 Grama (g)** = 1000 mg</li>
            <li>**1 Miligrama (mg)** = 1000 mcg (Microgramas)</li>
        </ul>
        <hr>
        <p><strong>Cálculo Passo a Passo:</strong></p>
        <p>1. **Conversão para mg:** ${valor} ${origem} se torna **${valorEmMg.toFixed(4).replace(/\.?0+$/, '')} mg**.</p>
        <p>2. **Conversão de mg para ${destino}:** ${valorEmMg.toFixed(4).replace(/\.?0+$/, '')} mg ${isMultiplication ? 'multiplicado' : 'dividido'} por ${fatorConversao} resulta em **${valorFormatado} ${destino}**.</p>
    `;
    explicacaoDiv.innerHTML = explicacaoHTML;
}

// Garante que a conversão seja executada ao digitar/mudar
document.getElementById('valor-converter')?.addEventListener('input', converterUnidades);
document.getElementById('unidade-origem')?.addEventListener('change', converterUnidades);
document.getElementById('unidade-destino')?.addEventListener('change', converterUnidades);


// =========================================================
// MÓDULO 5: FLASHCARDS (100 CONCEITOS)
// =========================================================

// Banco de dados principal com 100 flashcards
const allFlashcards = [
    // ----------------------------------------
    // CARDS ANATOMIA E FISIOLOGIA (25)
    // ----------------------------------------
    { pergunta: "Qual é o osso longo da coxa?", resposta: "Fêmur", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual é o principal músculo da respiração?", resposta: "Diafragma", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Onde ocorrem as trocas gasosas (hematose)?", resposta: "Alvéolos Pulmonares", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Quais são as quatro câmaras do coração?", resposta: "Átrio Direito, Ventrículo Direito, Átrio Esquerdo, Ventrículo Esquerdo", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual válvula cardíaca fica entre o Átrio Esquerdo e o Ventrículo Esquerdo?", resposta: "Válvula Mitral (ou Bicúspide)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual válvula cardíaca fica entre o Átrio Direito e o Ventrículo Direito?", resposta: "Válvula Tricúspide", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual a maior artéria do corpo humano, que sai do ventrículo esquerdo?", resposta: "Artéria Aorta", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Quais veias trazem o sangue venoso (rico em CO2) do corpo para o Átrio Direito?", resposta: "Veias Cavas (Superior e Inferior)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual órgão produz a bile?", resposta: "Fígado", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual órgão armazena a bile?", resposta: "Vesícula Biliar", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual órgão produz a insulina?", resposta: "Pâncreas (nas Ilhotas de Langerhans)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual é a unidade funcional dos rins, responsável pela filtração do sangue?", resposta: "Néfron", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Onde ocorre a maior parte da absorção de nutrientes no sistema digestivo?", resposta: "Intestino Delgado (Jejuno e Íleo)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual parte do cérebro é responsável pelo equilíbrio e coordenação motora?", resposta: "Cerebelo", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual o nome da célula sanguínea responsável pelo transporte de oxigênio?", resposta: "Hemácia (ou Eritrócito)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual o nome da célula sanguínea responsável pela defesa (sistema imune)?", resposta: "Leucócito (Glóbulo Branco)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual o fragmento celular responsável pela coagulação do sangue?", resposta: "Plaqueta (ou Trombócito)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual é o maior órgão do corpo humano?", resposta: "Pele", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Quais são as três camadas da pele?", resposta: "Epiderme (externa), Derme (intermediária) e Hipoderme (interna/subcutânea)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Como é chamado o movimento de contração do esôfago e intestinos que empurra o alimento?", resposta: "Peristaltismo (ou Movimentos Peristálticos)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual o nome do hormônio liberado em situações de estresse agudo ('luta ou fuga')?", resposta: "Adrenalina (Epinefrina)", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Quais artérias irrigam o próprio músculo cardíaco?", resposta: "Artérias Coronárias", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Qual o osso longo do braço (entre ombro e cotovelo)?", resposta: "Úmero", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Quais são os ossos do antebraço?", resposta: "Rádio e Ulna", categoria: "Anatomia/Fisiologia" },
    { pergunta: "Onde o espermatozoide é produzido?", resposta: "Testículos", categoria: "Anatomia/Fisiologia" },

    // ----------------------------------------
    // CARDS PATOLOGIA (25)
    // ----------------------------------------
    { pergunta: "Termo médico para inflamação do apêndice.", resposta: "Apendicite", categoria: "Patologia" },
    { pergunta: "Termo médico para inflamação do fígado.", resposta: "Hepatite", categoria: "Patologia" },
    { pergunta: "Termo médico para inflamação da vesícula biliar.", resposta: "Colecistite", categoria: "Patologia" },
    { pergunta: "Termo médico para 'pedra na vesícula'.", resposta: "Colelitíase", categoria: "Patologia" },
    { pergunta: "Termo médico para 'pedra nos rins'.", resposta: "Nefrolitíase (ou Cálculo Renal)", categoria: "Patologia" },
    { pergunta: "Doença caracterizada por níveis elevados de glicose no sangue.", resposta: "Diabetes Mellitus", categoria: "Patologia" },
    { pergunta: "Acúmulo de placas de gordura nas artérias, endurecendo-as.", resposta: "Aterosclerose", categoria: "Patologia" },
    { pergunta: "Morte de tecido do músculo cardíaco por falta de oxigênio.", resposta: "Infarto Agudo do Miocárdio (IAM)", categoria: "Patologia" },
    { pergunta: "Termo médico para 'derrame cerebral' (falta de sangue ou sangramento no cérebro).", resposta: "Acidente Vascular Cerebral (AVC)", categoria: "Patologia" },
    { pergunta: "Infecção/inflamação dos alvéolos pulmonares.", resposta: "Pneumonia", categoria: "Patologia" },
    { pergunta: "Infecção em qualquer parte do sistema urinário.", resposta: "Infecção do Trato urinário (ITU)", categoria: "Patologia" },
    { pergunta: "Inflamação das meninges (membranas que cobrem o cérebro).", resposta: "Meningite", categoria: "Patologia" },
    { pergunta: "Doença em que o sistema imunológico ataca o próprio corpo.", resposta: "Doença Autoimune (Ex: Lúpus, Artrite Reumatoide)", categoria: "Patologia" },
    { pergunta: "Perda súbita ou progressiva da função dos rins.", resposta: "Insuficiência Renal (Aguda ou Crônica)", categoria: "Patologia" },
    { pergunta: "Crescimento descontrolado e maligno de células.", resposta: "Câncer (ou Neoplasia Maligna)", categoria: "Patologia" },
    { pergunta: "Redução do número de hemácias ou de hemoglobina no sangue.", resposta: "Anemia", categoria: "Patologia" },
    { pergunta: "Inflamação do pâncreas.", resposta: "Pancreatite", categoria: "Patologia" },
    { pergunta: "Doença pulmonar crônica que obstrui o fluxo de ar (Ex: Enfisema, Bronquite Crônica).", resposta: "DPOC (Doença Pulmonar Obstrutiva Crônica)", categoria: "Patologia" },
    { pergunta: "Acúmulo de gordura no fígado.", resposta: "Esteatose Hepática", categoria: "Patologia" },
    { pergunta: "Infecção generalizada grave que se espalha pelo corpo.", resposta: "Sepse (ou Septicemia)", categoria: "Patologia" },
    { pergunta: "Obstrução de uma artéria do pulmão por um coágulo.", resposta: "Embolia Pulmonar (EP)", categoria: "Patologia" },
    { pergunta: "Formação de um coágulo (trombo) em uma veia profunda, geralmente nas pernas.", resposta: "Trombose Venosa Profunda (TVP)", categoria: "Patologia" },
    { pergunta: "Termo médico para inflamação das articulações.", resposta: "Artrite", categoria: "Patologia" },
    { pergunta: "Vírus da Imunodeficiência Humana, que ataca o sistema imunológico.", resposta: "HIV", categoria: "Patologia" },
    { pergunta: "Aumento da pressão dentro do olho, que pode levar à cegueira.", resposta: "Glaucoma", categoria: "Patologia" },
    
    // ----------------------------------------
    // CARDS FUNDAMENTOS E PROCEDIMENTOS (50)
    // ----------------------------------------
    { pergunta: "Sinal vital que reflete o número de batimentos cardíacos por minuto.", resposta: "Frequência Cardíaca (FC)", categoria: "Sinais Vitais" },
    { pergunta: "Temperatura axilar considerada estado febril (aproximado).", resposta: "Acima de 37,8°C", categoria: "Sinais Vitais" },
    { pergunta: "Valor normal de glicemia em jejum (aproximado).", resposta: "70 a 99 mg/dL", categoria: "Sinais Vitais" },
    { pergunta: "Pupilas dilatadas.", resposta: "Midríase", categoria: "Sinais Vitais" },
    { pergunta: "Pupilas contraídas.", resposta: "Miose", categoria: "Sinais Vitais" },
    { pergunta: "Frequência respiratória normal em adulto (em repouso).", resposta: "12 a 20 incursões por minuto (ipm)", categoria: "Sinais Vitais" },
    { pergunta: "Termo para frequência cardíaca abaixo do normal (< 60 bpm).", resposta: "Bradicardia", categoria: "Sinais Vitais" },
    { pergunta: "Termo para frequência cardíaca acima do normal (> 100 bpm).", resposta: "Taquicardia", categoria: "Sinais Vitais" },
    { pergunta: "Termo técnico para Dificuldade para respirar.", resposta: "Dispneia", categoria: "Terminologia" },
    { pergunta: "Termo técnico para dor de cabeça.", resposta: "Cefaleia", categoria: "Terminologia" },
    { pergunta: "Termo técnico para ausência de urina.", resposta: "Anúria", categoria: "Terminologia" },
    { pergunta: "Termo técnico para pressão arterial baixa.", resposta: "Hipotensão", categoria: "Terminologia" },
    { pergunta: "Termo técnico para febre alta.", resposta: "Hipertermia", categoria: "Terminologia" },
    { pergunta: "Aspirar um líquido do estado gasoso é um termo chamado de:", resposta: "Inalação", categoria: "Terminologia" },
    { pergunta: "Posição para exame ginecológico.", resposta: "Posição de Litotomia (ou Ginecológica)", categoria: "Terminologia" },
    { pergunta: "Posição deitada de costas.", resposta: "Decúbito Dorsal", categoria: "Terminologia" },
    { pergunta: "Posição deitada de lado.", resposta: "Decúbito Lateral", categoria: "Terminologia" },
    { pergunta: "Posição de bruços.", resposta: "Decúbito Ventral (ou Prona)", categoria: "Terminologia" },
    { pergunta: "Posição semi-sentada (cabeceira elevada 45-60°).", resposta: "Posição de Fowler", categoria: "Terminologia" },
    { pergunta: "Vômito com sangue.", resposta: "Hematêmese", categoria: "Terminologia" },
    { pergunta: "Sangue na urina.", resposta: "Hematúria", categoria: "Terminologia" },
    { pergunta: "Cor amarelada da pele e mucosas.", resposta: "Icterícia", categoria: "Terminologia" },
    { pergunta: "Cor azulada/arroxeada da pele (falta de O2).", resposta: "Cianose", categoria: "Terminologia" },
    { pergunta: "Principal via de eliminação de medicamentos no corpo.", resposta: "Via Renal (rins)", categoria: "Farmacologia" },
    { pergunta: "Nome da técnica de administração de medicação na camada subcutânea.", resposta: "Via Subcutânea", categoria: "Farmacologia" },
    { pergunta: "Abreviatura para 'tomar se for necessário'.", resposta: "S.O.S (Se Oportuno For)", categoria: "Farmacologia" },
    { pergunta: "Quantas microgotas equivalem a 1 gota?", resposta: "3 Microgotas", categoria: "Farmacologia" },
    { pergunta: "Via de administração 'SL'.", resposta: "Sublingual", categoria: "Farmacologia" },
    { pergunta: "Via de administração 'ID'.", resposta: "Intradérmica", categoria: "Farmacologia" },
    { pergunta: "Via de administração 'SC'.", resposta: "Subcutânea", categoria: "Farmacologia" },
    { pergunta: "Via de administração 'IM'.", resposta: "Intramuscular", categoria: "Farmacologia" },
    { pergunta: "Via de administração 'EV' ou 'IV'.", resposta: "Endovenosa (ou Intravenosa)", categoria: "Farmacologia" },
    { pergunta: "Os 5 Certos da Administração de Medicamentos (clássicos).", resposta: "Paciente Certo, Medicamento Certo, Via Certa, Hora Certa, Dose Certa.", categoria: "Farmacologia" },
    { pergunta: "O que é Assepsia?", resposta: "Conjunto de medidas para impedir a penetração de microrganismos (prevenção).", categoria: "Fundamentos" },
    { pergunta: "O que é Degermação?", resposta: "Redução do número de microrganismos da pele ou mucosas.", categoria: "Fundamentos" },
    { pergunta: "O que é Hipodermóclise?", resposta: "Administração de fluidos por via subcutânea.", categoria: "Procedimentos" },
    { pergunta: "Principal objetivo da Lavagem das Mãos na Enfermagem.", resposta: "Prevenção e controle de infecção hospitalar.", categoria: "Fundamentos" },
    { pergunta: "O que é um Cateter Venoso Central (CVC)?", resposta: "Cateter inserido em uma veia de grande calibre (ex: subclávia, jugular).", categoria: "Procedimentos" },
    { pergunta: "O que é um Cateter Venoso Periférico (CVP)?", resposta: "Cateter inserido em veias de membros (mãos, braços).", categoria: "Procedimentos" },
    { pergunta: "O que é Paracentese?", resposta: "Punção da cavidade abdominal para retirar líquido (ascite).", categoria: "Procedimentos" },
    { pergunta: "O que é Tricotomia?", resposta: "Remoção de pelos (geralmente pré-cirúrgica).", categoria: "Procedimentos" },
    { pergunta: "Escala usada para avaliar nível de consciência.", resposta: "Escala de Coma de Glasgow", categoria: "Fundamentos" },
    { pergunta: "Escala usada para avaliar risco de úlcera por pressão (lesão).", resposta: "Escala de Braden", categoria: "Fundamentos" },
    { pergunta: "A sigla SUS significa:", resposta: "Sistema Único de Saúde", categoria: "SUS/Legislação" },
    { pergunta: "Qual a função do Coren (Conselho Regional de Enfermagem)?", resposta: "Fiscalizar e normatizar o exercício da profissão.", categoria: "SUS/Legislação" },
    { pergunta: "Sigla EPI?", resposta: "Equipamento de Proteção Individual", categoria: "Biossegurança" },
    { pergunta: "O que é lixo perfurocortante?", resposta: "Agulhas, lâminas, vidros quebrados.", categoria: "Biossegurança" },
    { pergunta: "Qual a cor do recipiente para lixo perfurocortante?", resposta: "Amarelo (Caixa Coletora tipo Descarpack)", categoria: "Biossegurança" },
    { pergunta: "Princípio do SUS: Acesso igualitário para todos.", resposta: "Universalidade", categoria: "SUS/Legislação" },
    { pergunta: "Princípio do SUS: Tratar desigualmente os desiguais, focando em quem mais precisa.", resposta: "Equidade", categoria: "SUS/Legislação" }
];


let currentFlashcards = [...allFlashcards];
let currentIndex = 0;

// FUNÇÕES FLASHCARDS 
function virarCard() {
    const card = document.getElementById('flashcard');
    card?.classList.toggle('flipped'); 
}

function carregarCard(index) {
    if (index < 0 || index >= currentFlashcards.length) return; 

    const cardElement = document.getElementById('flashcard');
    const questionElement = document.getElementById('card-question');
    const answerElement = document.getElementById('card-answer');

    cardElement?.classList.remove('flipped'); 
    
    if (questionElement && answerElement) {
        questionElement.textContent = currentFlashcards[index].pergunta;
        answerElement.textContent = currentFlashcards[index].resposta;
    }
}

function proximoCard(event) {
    if (event) event.stopPropagation(); 
    
    if (currentFlashcards.length === 0) return;

    currentIndex = (currentIndex + 1) % currentFlashcards.length; 
    carregarCard(currentIndex);
}

function embaralhar() {
    currentFlashcards = shuffleArray(currentFlashcards); 
    currentIndex = 0; 
    carregarCard(currentIndex);
}

function filtrarCards(categoria) {
    if (categoria === "Todos os Conceitos") {
        currentFlashcards = [...allFlashcards];
    } else {
        currentFlashcards = allFlashcards.filter(card => card.categoria === categoria);
    }
    currentIndex = 0;
    embaralhar(); 
    carregarCard(currentIndex);
}

// =========================================================
// MÓDULO 6: SIMULADO DE ENFERMAGEM (100 QUESTÕES)
// =========================================================

// Função auxiliar para embaralhar arrays (útil para cards e quiz)
function shuffleArray(array) {
    let newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Banco de Dados do Simulado (100 PERGUNTAS) - ATUALIZADO
const quizQuestions = [
    // ----------------------------------------
    // QUESTÕES 1-10
    // ----------------------------------------
    { question: "1. Qual o ângulo correto para a administração de medicamentos por via intramuscular (IM) em um paciente adulto?", options: ["15°", "45°", "90°", "30°"], answer: "90°", justification: "A via intramuscular requer a injeção profunda no músculo, sendo o ângulo de 90° o padrão para a maioria dos adultos, garantindo que a medicação atinja a camada muscular." },
    { question: "2. Qual o princípio básico do SUS que garante o acesso à saúde a todos os cidadãos brasileiros, sem distinção?", options: ["Integralidade", "Equidade", "Descentralização", "Universalidade"], answer: "Universalidade", justification: "Universalidade significa que a saúde é um direito de todos e dever do Estado, garantindo o acesso a serviços para qualquer cidadão." },
    { question: "3. O termo técnico 'cianose' refere-se à coloração azulada ou arroxeada da pele e mucosas causada por:", options: ["Excesso de bilirrubina", "Deficiência de oxigenação sanguínea", "Hiperglicemia", "Excesso de melanina"], answer: "Deficiência de oxigenação sanguínea", justification: "Cianose é um sinal de hipóxia (baixa oxigenação), onde a hemoglobina reduzida na pele confere a coloração azulada." },
    { question: "4. Em um cálculo de gotejamento, quantas microgotas por minuto devem ser administradas para 500 mL em 10 horas?", options: ["50 MGT/min", "83 MGT/min", "100 MGT/min", "30 MGT/min"], answer: "50 MGT/min", justification: "Cálculo: (Volume Total em mL) / (Tempo em Horas) = MGT/min. 500 mL / 10 h = 50 MGT/min." },
    { question: "5. Qual o principal Equipamento de Proteção Individual (EPI) deve ser usado ao manipular materiais perfurocortantes?", options: ["Óculos de proteção", "Máscara cirúrgica", "Luvas de procedimento", "Avental impermeável"], answer: "Luvas de procedimento", justification: "A luva é o principal para formar uma barreira de contato e proteger contra o risco biológico." },
    { question: "6. Qual a escala utilizada para avaliar o risco do paciente desenvolver úlceras por pressão (lesões por pressão)?", options: ["Escala de Coma de Glasgow", "Escala de Braden", "Escala de Dor (EVA)", "Escala de Fugulin"], answer: "Escala de Braden", justification: "A Escala de Braden é amplamente utilizada para avaliar o risco de desenvolvimento de lesões por pressão." },
    { question: "7. A eliminação de resíduos sólidos de saúde (RSS) do Grupo A (infectantes) deve ser feita em qual tipo de recipiente?", options: ["Saco preto comum", "Recipiente rígido e amarelo (Descarpack)", "Saco branco leitoso identificado", "Recipiente azul para recicláveis"], answer: "Saco branco leitoso identificado", justification: "Resíduos do Grupo A (potencialmente infectantes) devem ser acondicionados em sacos brancos leitosos." },
    { question: "8. O que é 'hipodermóclise'?", options: ["Administração de medicação na derme", "Administração de medicação por via endovenosa", "Administração de fluidos por via subcutânea", "Retirada de líquido do espaço abdominal"], answer: "Administração de fluidos por via subcutânea", justification: "Hipodermóclise é o método de administração de fluidos e medicamentos no tecido subcutâneo." },
    { question: "9. A administração de medicamento pela via intradérmica (ID) é geralmente realizada em qual ângulo?", options: ["15°", "45°", "90°", "10°"], answer: "15°", justification: "A via intradérmica exige que a agulha atinja apenas a camada dérmica da pele, sendo o ângulo de 15° o ideal." },
    { question: "10. Qual o termo técnico para fezes com presença de sangue vivo e vermelho (sangramento digestivo baixo)?", options: ["Hematêmese", "Melena", "Enterorragia", "Icterícia"], answer: "Enterorragia", justification: "Enterorragia refere-se à eliminação de sangue vivo pelo ânus." },
    // ----------------------------------------
    // QUESTÕES 11-20
    // ----------------------------------------
    { question: "11. O que significa o termo 'alopécia' na terminologia médica?", options: ["Febre alta", "Perda de cabelo", "Dor nas articulações", "Vômito com sangue"], answer: "Perda de cabelo", justification: "Alopécia é o termo médico para a queda de cabelo." },
    { question: "12. Qual o local de aplicação mais seguro para injeção intramuscular em bebês e crianças pequenas?", options: ["Deltóide", "Dorso-glúteo", "Vasto Lateral da Coxa", "Ventro-glúteo"], answer: "Vasto Lateral da Coxa", justification: "O músculo Vasto Lateral da Coxa é o local preferido e mais seguro em crianças menores de dois anos." },
    { question: "13. Na administração de insulina por via subcutânea, qual o ângulo de aplicação mais comum para pacientes com tecido adiposo suficiente?", options: ["90°", "45°", "30°", "15°"], answer: "90°", justification: "O ângulo de 90° é o padrão para a via subcutânea quando há tecido adiposo suficiente." },
    { question: "14. A abreviação 'VO' na prescrição médica significa:", options: ["Via Endovenosa", "Volume Ocular", "Via Oral", "Vacina Obrigatória"], answer: "Via Oral", justification: "VO é a abreviatura padrão para administração de medicamentos por via oral." },
    { question: "15. Qual dos seguintes é um resíduo do Grupo B (químicos) na classificação de Resíduos de Serviços de Saúde (RSS)?", options: ["Saco de lixo hospitalar contaminado", "Agulhas e bisturis", "Medicamentos vencidos e reagentes", "Restos de alimentos de pacientes em isolamento"], answer: "Medicamentos vencidos e reagentes", justification: "O Grupo B engloba resíduos químicos, como medicamentos e reagentes." },
    { question: "16. O que é 'disfagia'?", options: ["Dificuldade para falar", "Dificuldade para respirar", "Dificuldade para urinar", "Dificuldade para deglutir (engolir)"], answer: "Dificuldade para deglutir (engolir)", justification: "Disfagia é o termo técnico para a dificuldade ou desconforto ao engolir." },
    { question: "17. Qual o valor de Pressão Arterial (PA) que, classicamente, define Hipertensão Arterial Sistêmica em adultos?", options: ["PA < 120/80 mmHg", "PA ≥ 140/90 mmHg", "PA ≥ 130/85 mmHg", "PA < 90/60 mmHg"], answer: "PA ≥ 140/90 mmHg", justification: "A definição clássica de hipertensão é PA sistólica igual ou superior a 140 mmHg e/ou PA diastólica igual ou superior a 90 mmHg." },
    { question: "18. O que é 'Taquipneia'?", options: ["Frequência cardíaca rápida", "Frequência respiratória lenta", "Frequência respiratória rápida", "Pressão arterial baixa"], answer: "Frequência respiratória rápida", justification: "Taquipneia é o aumento da frequência respiratória acima dos limites normais (acima de 20 irpm em adultos)." },
    { question: "19. A Desinfecção de Alto Nível (DAN) é um processo que destrói microrganismos, exceto:", options: ["Bactérias vegetativas", "Esporos bacterianos", "Vírus", "Fungos"], answer: "Esporos bacterianos", justification: "A DAN elimina a maioria dos microrganismos, mas não garante a eliminação de um grande número de esporos bacterianos. A Esterilização é necessária para isso." },
    { question: "20. O que é 'oligúria'?", options: ["Aumento do volume urinário", "Ausência de urina", "Diminuição do volume urinário", "Presença de sangue na urina"], answer: "Diminuição do volume urinário", justification: "Oligúria é a baixa produção de urina, geralmente definida como menos de 400 mL em 24 horas em adultos." },
    // ----------------------------------------
    // QUESTÕES 21-30
    // ----------------------------------------
    { question: "21. Qual o nome da manobra de primeiros socorros utilizada para desobstrução das vias aéreas em adultos conscientes por engasgo?", options: ["RCP (Ressuscitação Cardiopulmonar)", "Manobra de Sellick", "Manobra de Heimlich", "Posição de recuperação lateral"], answer: "Manobra de Heimlich", justification: "A Manobra de Heimlich é a técnica padronizada para desengasgo em adultos e crianças." },
    { question: "22. O que caracteriza a posição de Trendelenburg?", options: ["Paciente deitado de costas, com a cabeça mais baixa que os pés.", "Paciente sentado com as pernas pendentes.", "Paciente de bruços, com a cabeça lateralizada.", "Paciente deitado de costas, com as pernas elevadas."], answer: "Paciente deitado de costas, com a cabeça mais baixa que os pés.", justification: "Na posição de Trendelenburg, a cabeceira da cama é abaixada e os pés são elevados." },
    { question: "23. Qual a finalidade da Sonda de Foley?", options: ["Alimentação enteral", "Drenagem de secreção pulmonar", "Drenagem urinária contínua", "Administração de oxigênio"], answer: "Drenagem urinária contínua", justification: "A Sonda de Foley é um cateter vesical de demora, utilizado para drenagem contínua de urina." },
    { question: "24. O que é 'Hemoptise'?", options: ["Vômito com sangue", "Sangue nas fezes", "Tosse com sangue", "Sangramento nasal"], answer: "Tosse com sangue", justification: "Hemoptise é a eliminação de sangue pela boca ou nariz, proveniente dos pulmões ou brônquios (tosse)." },
    { question: "25. No cálculo de dosagem, qual o nome do princípio utilizado (regra matemática básica)?", options: ["Teorema de Pitágoras", "Lei da Semelhança de Triângulos", "Regra de Três Simples", "Cálculo Diferencial"], answer: "Regra de Três Simples", justification: "A maioria dos cálculos de dosagem em Enfermagem é resolvida utilizando a Regra de Três Simples." },
    { question: "26. Qual a função do Conselho Federal de Enfermagem (Cofen)?", options: ["Apoiar o sindicato da categoria", "Fiscalizar o exercício profissional a nível local", "Normatizar e expedir resoluções para todo o país", "Regulamentar o salário dos profissionais"], answer: "Normatizar e expedir resoluções para todo o país", justification: "O Cofen é o órgão máximo de Enfermagem, responsável por normatizar e regulamentar o exercício profissional em nível nacional." },
    { question: "27. Qual o principal agente utilizado na assepsia cirúrgica das mãos?", options: ["Água e sabão comum", "Álcool 70%", "Clorexidina degermante", "Solução salina"], answer: "Clorexidina degermante", justification: "A Clorexidina degermante é o antisséptico mais usado para a escovação antes de procedimentos cirúrgicos." },
    { question: "28. Qual a temperatura corporal normal média considerada em adultos, por via axilar?", options: ["35,5°C", "37,0°C", "37,8°C", "38,5°C"], answer: "37,0°C", justification: "A temperatura corporal normal média para adultos é tipicamente em torno de 36,5°C a 37,5°C, sendo 37,0°C o valor central mais aceito." },
    { question: "29. O que é 'Anasarca'?", options: ["Edema localizado em uma perna", "Edema generalizado em todo o corpo", "Desidratação grave", "Acúmulo de líquido apenas no abdômen"], answer: "Edema generalizado em todo o corpo", justification: "Anasarca é a forma mais grave de edema, caracterizada pelo acúmulo excessivo de líquido em todos os tecidos." },
    { question: "30. A sigla 'PCR' em emergência significa:", options: ["Paralisia Cerebral Recorrente", "Pressão Cardíaca Rápida", "Parada Cardiorrespiratória", "Pneumonia Crônica Recente"], answer: "Parada Cardiorrespiratória", justification: "PCR é uma das emergências mais críticas, onde há cessação da respiração e da circulação sanguínea." },
    // ----------------------------------------
    // QUESTÕES 31-40
    // ----------------------------------------
    { question: "31. Qual a principal complicação do uso prolongado de cateter venoso periférico?", options: ["Hipertensão", "Flebite (inflamação da veia)", "Hipotermia", "Hemorragia"], answer: "Flebite (inflamação da veia)", justification: "A flebite é a complicação mais comum associada ao uso de cateteres venosos periféricos." },
    { question: "32. O que é considerado o 'Quinto Sinal Vital' e é de avaliação obrigatória?", options: ["Saturação de Oxigênio", "Nível de Consciência", "Dor", "Glicemia Capilar"], answer: "Dor", justification: "A dor é considerada o Quinto Sinal Vital e deve ser avaliada e registrada rotineiramente." },
    { question: "33. Qual o tipo de luva que deve ser utilizada em procedimentos invasivos e cirúrgicos?", options: ["Luva de procedimento", "Luva estéril", "Luva de vinil", "Luva de borracha"], answer: "Luva estéril", justification: "A luva estéril é necessária para qualquer procedimento que envolva a penetração de tecidos ou contato com áreas estéreis do corpo." },
    { question: "34. O que é o componente básico da biossegurança que define o conjunto de normas a serem seguidas para evitar contaminação no ambiente de trabalho?", options: ["Comissão de Residência", "Precauções Padrão", "Esterilização Química", "Medidas de Conforto"], answer: "Precauções Padrão", justification: "As Precauções Padrão são o conjunto básico de medidas de controle de infecção aplicáveis a todos os pacientes." },
    { question: "35. O que é a 'Lei do Exercício Profissional' de Enfermagem (Lei Federal)?", options: ["Lei n° 8.080/90", "Lei n° 7.498/86", "Lei n° 8.142/90", "Portaria MS n° 2.436/17"], answer: "Lei n° 7.498/86", justification: "A Lei n° 7.498/86 dispõe sobre o exercício da Enfermagem, definindo as competências da categoria." },
    { question: "36. A via de administração medicamentosa 'SL' é ideal para fármacos que necessitam de absorção rápida e local.", options: ["Subcutânea", "Sublingual", "Subdérmica", "Solução Lenta"], answer: "Sublingual", justification: "A via Sublingual (SL) permite a absorção rápida da medicação diretamente na corrente sanguínea." },
    { question: "37. O que é 'Diálise Peritoneal'?", options: ["Processo de filtragem do sangue fora do corpo.", "Procedimento cirúrgico renal", "Processo de filtragem do sangue através da membrana peritoneal.", "Técnica de retirada de ascite."], answer: "Processo de filtragem do sangue através da membrana peritoneal.", justification: "A Diálise Peritoneal utiliza o peritônio como filtro natural, infundindo líquido dialisador na cavidade abdominal." },
    { question: "38. A sigla CIPA refere-se a:", options: ["Conselho Intermunicipal de Políticas Ambientais", "Comissão Interna de Prevenção de Acidentes", "Controle de Infecções e Proteção Ambiental", "Comitê de Imunização e Prevenção de Agravos"], answer: "Comissão Interna de Prevenção de Acidentes", justification: "A CIPA tem como objetivo a prevenção de acidentes e doenças decorrentes do trabalho." },
    { question: "39. Em uma emergência com grande hemorragia, qual a primeira medida a ser tomada?", options: ["Chamar a ambulância", "Aplicar torniquete", "Elevar o membro afetado", "Fazer compressão direta no local"], answer: "Fazer compressão direta no local", justification: "A compressão direta é a medida inicial e mais eficaz para controlar a maioria das hemorragias externas graves." },
    { question: "40. Qual o nome da posição utilizada para paciente com dispneia e insuficiência cardíaca?", options: ["Decúbito Lateral", "Posição de Sims", "Posição de Fowler (ou Semi-Fowler)", "Posição de Trendelenburg"], answer: "Posição de Fowler (ou Semi-Fowler)", justification: "As posições Fowler ou Semi-Fowler facilitam a expansão pulmonar e diminuem o retorno venoso." },
    // ----------------------------------------
    // QUESTÕES 41-50
    // ----------------------------------------
    { question: "41. Qual a abreviatura para 'duas vezes ao dia' na prescrição médica?", options: ["BID", "TID", "QID", "SOS"], answer: "BID", justification: "BID (Bis In Die) significa 'duas vezes ao dia'." },
    { question: "42. O que é 'NANDA' na Enfermagem?", options: ["Associação Americana de Neurocirurgia", "Normas de Administração de Nutrição e Dietas", "Nomenclatura e Classificação de Diagnósticos de Enfermagem", "Sistema Nacional de Doenças Agudas"], answer: "Nomenclatura e Classificação de Diagnósticos de Enfermagem", justification: "NANDA International é a organização que desenvolve a taxonomia de Diagnósticos de Enfermagem." },
    { question: "43. A etapa do Processo de Enfermagem que envolve a coleta de dados e o histórico do paciente é a:", options: ["Diagnóstico de Enfermagem", "Planejamento", "Avaliação", "Coleta de Dados (ou Histórico)"], answer: "Coleta de Dados (ou Histórico)", justification: "O Processo de Enfermagem começa com a Coleta de Dados." },
    { question: "44. Qual o termômetro mais utilizado atualmente em ambientes hospitalares para medição de temperatura?", options: ["Termômetro de mercúrio", "Termômetro de álcool", "Termômetro digital", "Termômetro de vidro"], answer: "Termômetro digital", justification: "Os termômetros digitais substituíram o mercúrio por serem mais seguros e rápidos." },
    { question: "45. A punção venosa na fossa antecubital deve ser feita preferencialmente nas veias:", options: ["Cefálica ou Basílica", "Safena ou Poplítea", "Jugular ou Subclávia", "Radial ou Ulnar"], answer: "Cefálica ou Basílica", justification: "As veias Cefálica, Basílica e Mediana Cubital são os locais mais comuns e preferenciais para punção venosa." },
    { question: "46. Qual a forma correta de descartar uma agulha após o uso?", options: ["Recapada no lixo comum", "Inteira na caixa coletora amarela", "Quebrada no lixo biológico", "Recapada no lixo infectante"], answer: "Inteira na caixa coletora amarela", justification: "Agulhas NUNCA devem ser recapadas, e devem ser descartadas inteiras nos coletores rígidos (Descarpack)." },
    { question: "47. A técnica de Cateterismo Vesical de Alívio é utilizada para:", options: ["Aferir débito urinário em 24h", "Drenagem urinária intermitente", "Administração de medicamentos na bexiga", "Tratamento de infecção urinária"], answer: "Drenagem urinária intermitente", justification: "O cateterismo de alívio é a passagem e remoção imediata do cateter para esvaziar a bexiga." },
    { question: "48. Qual o princípio da 'Equidade' no SUS?", options: ["Saúde para todos", "Hierarquização dos serviços", "Tratar os desiguais de forma desigual (priorizar quem mais precisa)", "Participação da comunidade"], answer: "Tratar os desiguais de forma desigual (priorizar quem mais precisa)", justification: "Equidade busca reduzir as desigualdades, investindo mais onde a carência é maior." },
    { question: "49. O que significa 'SARA' em emergência?", options: ["Síndrome Aguda da Raiz Articular", "Síndrome do Alívio Rápido da Ansiedade", "Síndrome do Desconforto Respiratório Agudo", "Sistema de Atendimento e Resgate Ambulatorial"], answer: "Síndrome do Desconforto Respiratório Agudo", justification: "SARA (ARDS em inglês) é uma condição grave de insuficiência respiratória aguda." },
    { question: "50. O que é 'Melena'?", options: ["Fezes com gordura", "Fezes claras", "Fezes escuras (sangue digerido)", "Fezes com sangue vivo"], answer: "Fezes escuras (sangue digerido)", justification: "Melena indica a presença de sangue digerido nas fezes, geralmente de sangramento gastrointestinal alto." },
    // ----------------------------------------
    // QUESTÕES 51-60
    // ----------------------------------------
    { question: "51. O que significa o termo 'Nefro'?", options: ["Fígado", "Coração", "Rim", "Pulmão"], answer: "Rim", justification: "O prefixo 'Nefro' refere-se aos rins." },
    { question: "52. A posição de 'Decúbito Dorsal' é a posição mais apropriada para qual situação?", options: ["Paciente com dispneia", "Paciente inconsciente (coma)", "Exame físico abdominal", "Paciente em trabalho de parto"], answer: "Exame físico abdominal", justification: "A posição deitada de costas (Decúbito Dorsal) relaxa a musculatura abdominal, ideal para o exame físico dessa região." },
    { question: "53. A via de administração 'ID' (Intradérmica) é comumente utilizada para:", options: ["Administração de antibióticos", "Testes de sensibilidade (alergia)", "Vacinas de rotina", "Grande volume de soro"], answer: "Testes de sensibilidade (alergia)", justification: "A via ID é usada para a inoculação de pequenas quantidades, sendo seu principal uso os testes de sensibilidade." },
    { question: "54. Na reanimação cardiopulmonar (RCP) em adultos, qual a relação de compressões e ventilações (para 1 ou 2 socorristas)?", options: ["15:2", "30:2", "5:1", "30:5"], answer: "30:2", justification: "A relação padrão é de 30 compressões para 2 ventilações para um ou dois socorristas em adultos." },
    { question: "55. A sigla 'PAM' refere-se a:", options: ["Pulso Arterial Medido", "Pressão Arterial Média", "Procedimento de Alta Complexidade", "Programa de Atenção à Mulher"], answer: "Pressão Arterial Média", justification: "A PAM é um cálculo que representa a pressão média dentro das artérias durante um ciclo cardíaco." },
    { question: "56. Qual o volume máximo recomendado para aplicação de medicamento por via subcutânea em adultos?", options: ["Até 5 mL", "Até 3 mL", "Até 1 mL", "Até 0,5 mL"], answer: "Até 1 mL", justification: "Geralmente, o volume máximo aceito para via subcutânea é de 1 mL." },
    { question: "57. O que é 'AINE'?", options: ["Anestésico Injetável de Efeito Rápido", "Agente de Imunização Não Essencial", "Anti-inflamatório Não Esteroidal", "Aumento da Inflamação Normal e Exsudação"], answer: "Anti-inflamatório Não Esteroidal", justification: "AINEs são um grupo de medicamentos usados para aliviar dor e inflamação." },
    { question: "58. Qual a finalidade de usar um Cateter de Guedel?", options: ["Drenagem gástrica", "Administração de oxigênio nasal", "Manter a via aérea pérvia em paciente inconsciente", "Monitoramento da pressão venosa central"], answer: "Manter a via aérea pérvia em paciente inconsciente", justification: "O Cateter de Guedel evita que a língua caia e obstrua a via aérea em pacientes inconscientes." },
    { question: "59. O que é 'Esterilização'?", options: ["Processo que elimina todos os microrganismos e esporos.", "Processo que reduz 99% das bactérias", "Destruição de bactérias em tecidos vivos", "Redução de microrganismos em objetos inanimados"], answer: "Processo que elimina todos os microrganismos e esporos.", justification: "Esterilização é a completa destruição ou remoção de todos os microrganismos, incluindo os esporos." },
    { question: "60. Qual a principal complicação causada por imobilidade prolongada e atrito?", options: ["Flebite", "Lesão por Pressão (Úlcera)", "Pneumonia", "Hipertensão"], answer: "Lesão por Pressão (Úlcera)", justification: "A Lesão por Pressão, antigamente chamada de úlcera de decúbito, é a complicação mais comum da imobilidade prolongada." },
    // ----------------------------------------
    // QUESTÕES 61-70
    // ----------------------------------------
    { question: "61. O que é 'Disartria'?", options: ["Dificuldade para engolir", "Dificuldade para respirar", "Dificuldade na articulação das palavras", "Perda total da voz"], answer: "Dificuldade na articulação das palavras", justification: "Disartria é a dificuldade ou incapacidade de articular as palavras de forma clara, devido a problemas neurológicos ou musculares." },
    { question: "62. A sigla 'IM' na administração de medicamentos refere-se à via:", options: ["Intradérmica", "Inalatória Mucosa", "Intramuscular", "Intravenosa"], answer: "Intramuscular", justification: "IM é a abreviatura para Intramuscular." },
    { question: "63. Qual a importância da 'notificação compulsória' em Enfermagem?", options: ["Garantir a confidencialidade do paciente", "Monitorar a incidência de doenças específicas para vigilância epidemiológica", "Aumentar a pontuação do hospital em rankings", "Agilizar o processo de alta"], answer: "Monitorar a incidência de doenças específicas para vigilância epidemiológica", justification: "A notificação compulsória é obrigatória para doenças e agravos específicos, visando o controle de saúde pública." },
    { question: "64. A 'Autoclave' é um equipamento utilizado para qual finalidade em materiais hospitalares?", options: ["Lavagem rápida", "Desinfecção de baixo nível", "Esterilização por calor úmido", "Secagem por radiação"], answer: "Esterilização por calor úmido", justification: "A autoclave utiliza vapor saturado sob pressão para esterilizar materiais, eliminando todos os microrganismos e esporos." },
    { question: "65. No Processo de Enfermagem, a fase de 'Intervenção' corresponde a:", options: ["Coleta de dados", "Ações e cuidados implementados", "Avaliação dos resultados", "Formulação do Diagnóstico"], answer: "Ações e cuidados implementados", justification: "Intervenção (ou Implementação) é a execução do plano de cuidados estabelecido." },
    { question: "66. O que significa 'Jejum' na prescrição médica?", options: ["Comer", "Dormir", "Jejum", "Tomar em jejum"], answer: "Jejum", justification: "Jejum (ou NPO/Nada por Via Oral) significa abster-se de alimentos e líquidos, exceto água, por um período determinado." },
    { question: "67. Qual a principal via de administração da vacina BCG?", options: ["Intramuscular", "Subcutânea", "Intradérmica", "Oral"], answer: "Intradérmica", justification: "A vacina BCG (tuberculose) é tipicamente administrada por via intradérmica, na região do deltóide." },
    { question: "68. O que é 'Sialorreia'?", options: ["Dificuldade para falar", "Eliminação excessiva de saliva", "Aumento da sudorese", "Febre"], answer: "Eliminação excessiva de saliva", justification: "Sialorreia é o termo para salivação excessiva ou escoamento de saliva pela boca." },
    { question: "69. Para a mensuração da Pressão Arterial (PA), o paciente deve estar em repouso por, no mínimo:", options: ["1 minuto", "5 minutos", "10 minutos", "15 minutos"], answer: "5 minutos", justification: "O repouso de 5 minutos antes da aferição é um protocolo essencial para garantir a precisão do valor da PA." },
    { question: "70. Qual o pH normal do sangue arterial (aproximado)?", options: ["6.5 a 7.0", "7.35 a 7.45", "7.50 a 8.00", "5.0 a 5.5"], answer: "7.35 a 7.45", justification: "O pH sanguíneo normal é mantido dentro de uma faixa muito estreita, ligeiramente alcalina." },
    // ----------------------------------------
    // QUESTÕES 71-80
    // ----------------------------------------
    { question: "71. O que é 'Sinais de Blumberg' (Blumberg positivo)?", options: ["Dor ao tossir", "Dor à descompressão súbita no abdômen", "Dor ao elevar a perna", "Dor ao flexionar o pescoço"], answer: "Dor à descompressão súbita no abdômen", justification: "O Sinal de Blumberg é um indicativo de peritonite (inflamação do peritônio), frequentemente associado à apendicite." },
    { question: "72. A ausência total ou parcial de dentes é chamada de:", options: ["Cárie", "Gengivite", "Edentulismo", "Estomatite"], answer: "Edentulismo", justification: "Edentulismo é a condição de ter perdido todos ou parte dos dentes naturais." },
    { question: "73. Qual a sigla para o 'Sistema de Classificação de Resultados de Enfermagem'?", options: ["NANDA", "NOC", "NIC", "CIPE"], answer: "NOC", justification: "NOC (Nursing Outcomes Classification) é usado para classificar os resultados esperados das intervenções de enfermagem." },
    { question: "74. O que são 'Precauções por Gotículas'?", options: ["Uso obrigatório de avental e luvas.", "Quarto privativo e máscara cirúrgica para o profissional e visita.", "Uso de máscara N95 e pressão negativa.", "Uso de luvas e lavagem das mãos."], answer: "Quarto privativo e máscara cirúrgica para o profissional e visita.", justification: "Precauções por Gotículas são usadas para doenças transmitidas por gotículas grandes (> 5 micrômetros), como Influenza, exigindo máscara cirúrgica." },
    { question: "75. O que é o termo para a incapacidade de realizar movimentos intencionais, na ausência de paralisia?", options: ["Afasia", "Dislalia", "Apraxia", "Agnosia"], answer: "Apraxia", justification: "Apraxia é o distúrbio neurológico que impede a execução de tarefas motoras complexas, apesar da compreensão da tarefa." },
    { question: "76. A regra de cálculo de dose para crianças baseada na idade (idade/idade + 12) x dose do adulto é conhecida como Regra de:", options: ["Clark", "Young", "Fried", "Watts"], answer: "Young", justification: "A Regra de Young é uma das fórmulas pediátricas que utiliza a idade da criança para estimar a dosagem." },
    { question: "77. A abreviatura 'S/N' na prescrição médica significa:", options: ["Sem Nutrição", "Solução Normal", "Se Necessário", "Soro Noturno"], answer: "Se Necessário", justification: "S/N ou SOS (Se Oportuno/Necessário) indica que o medicamento deve ser administrado apenas quando o sintoma aparecer." },
    { question: "78. No jejum pré-operatório, a finalidade principal é a prevenção de:", options: ["Hipotensão", "Hemorragia", "Broncoaspiração", "Infecção"], answer: "Broncoaspiração", justification: "O jejum visa esvaziar o estômago para prevenir que o conteúdo gástrico seja aspirado para os pulmões durante a anestesia." },
    { question: "79. Qual dos seguintes é um resíduo do Grupo D (Comum) na classificação de RSS?", options: ["Restos de biópsias", "Seringas não contaminadas", "Papel de escritório, jornal", "Luvas contaminadas"], answer: "Papel de escritório, jornal", justification: "O Grupo D (Comum) inclui resíduos que não apresentam risco biológico, químico ou radiológico, como papel e lixo de escritório." },
    { question: "80. O que significa o termo 'Fotofobia'?", options: ["Medo de altura", "Sensibilidade ou aversão à luz", "Medo de agulhas", "Visão turva"], answer: "Sensibilidade ou aversão à luz", justification: "Fotofobia é a intolerância anormal à luz, comum em casos de meningite ou enxaqueca." },
    // ----------------------------------------
    // QUESTÕES 81-90
    // ----------------------------------------
    { question: "81. Qual a classificação de risco de Manchester para pacientes em emergência que recebem a cor LARANJA?", options: ["Não Urgente", "Urgente", "Emergência", "Pouco Urgente"], answer: "Urgente", justification: "Na classificação de Manchester, Laranja representa Urgência, com tempo-limite de atendimento de 10 minutos." },
    { question: "82. A 'Descontaminação' de artigos hospitalares tem como objetivo:", options: ["Esterilizar o material", "Reduzir a carga microbiana para manuseio seguro", "Destruir os esporos", "Apenas lavar o material"], answer: "Reduzir a carga microbiana para manuseio seguro", justification: "A descontaminação reduz a carga microbiana de artigos sujos, protegendo os profissionais antes da limpeza e esterilização." },
    { question: "83. O que é 'Nictúria'?", options: ["Micção dolorosa", "Aumento da frequência urinária noturna", "Incontinência urinária", "Dificuldade para iniciar a micção"], answer: "Aumento da frequência urinária noturna", justification: "Nictúria é a necessidade de acordar à noite por vontade de urinar." },
    { question: "84. Qual o nome da escala utilizada para avaliar o nível de dor do paciente?", options: ["Escala de Braden", "Escala de Glasgow", "Escala Visual Analógica (EVA)", "Escala de Ramsay"], answer: "Escala Visual Analógica (EVA)", justification: "A EVA é uma ferramenta comumente usada para que o paciente classifique sua dor de 0 a 10." },
    { question: "85. A responsabilidade de realizar o diagnóstico de enfermagem é privativa do:", options: ["Técnico de Enfermagem", "Auxiliar de Enfermagem", "Enfermeiro", "Médico"], answer: "Enfermeiro", justification: "O Diagnóstico de Enfermagem é uma das atividades privativas do Enfermeiro, conforme a Lei nº 7.498/86." },
    { question: "86. O que significa o termo 'Pneumo'?", options: ["Fígado", "Coração", "Osso", "Pulmão"], answer: "Pulmão", justification: "O prefixo 'Pneumo' está relacionado aos pulmões ou à respiração." },
    { question: "87. Qual a finalidade da Sonda Nasogástrica (SNG)?", options: ["Drenagem urinária", "Alimentação e/ou drenagem gástrica", "Administração de oxigênio", "Medir a pressão venosa central"], answer: "Alimentação e/ou drenagem gástrica", justification: "A SNG pode ser usada para administrar nutrição (alimentação enteral) ou para descompressão/drenagem do estômago." },
    { question: "88. A 'Vacina de Hepatite B' em adultos é administrada por qual via?", options: ["Intradérmica", "Subcutânea", "Intramuscular", "Oral"], answer: "Intramuscular", justification: "A maioria das vacinas aplicadas em adultos, incluindo Hepatite B, é por via intramuscular (geralmente no deltóide)." },
    { question: "89. O que é 'Hipercapnia'?", options: ["Baixo nível de oxigênio no sangue", "Alto nível de dióxido de carbono no sangue", "Baixo nível de potássio", "Alta frequência cardíaca"], answer: "Alto nível de dióxido de carbono no sangue", justification: "Hipercapnia é o acúmulo excessivo de CO2 no sangue, geralmente por ventilação insuficiente." },
    { question: "90. Qual o tempo máximo recomendado para um torniquete permanecer em um membro?", options: ["30 minutos", "1 hora", "Máximo de 60 segundos", "Não há limite"], answer: "Máximo de 60 segundos", justification: "O torniquete (garrote) não deve ser mantido por muito tempo para evitar isquemia; deve ser solto rapidamente após a punção." },
    // ----------------------------------------
    // QUESTÕES 91-100 (Adicionadas para completar 100)
    // ----------------------------------------
    { question: "91. Qual a principal causa de parada cardíaca em crianças?", options: ["Arritmia primária", "Choque hemorrágico", "Falência respiratória", "Infarto"], answer: "Falência respiratória", justification: "Diferente de adultos, a PCR em crianças geralmente é secundária à hipóxia (falência respiratória)." },
    { question: "92. O princípio da 'Integralidade' no SUS refere-se a:", options: ["Atendimento apenas em nível hospitalar", "Foco apenas na prevenção", "O indivíduo como um todo, do preventivo ao curativo", "Foco apenas na recuperação da saúde"], answer: "O indivíduo como um todo, do preventivo ao curativo", justification: "Integralidade é a visão do ser humano em sua totalidade, englobando todas as ações de saúde, prevenção e tratamento." },
    { question: "93. O que é 'Enterostomia'?", options: ["Remoção do rim", "Abertura cirúrgica de uma porção do intestino (estoma)", "Remoção do apêndice", "Exame da bexiga"], answer: "Abertura cirúrgica de uma porção do intestino (estoma)", justification: "Enterostomia é a criação de uma abertura (estoma) na parede abdominal para drenagem de conteúdo intestinal." },
    { question: "94. A sigla 'AS' na equipe de Enfermagem refere-se a:", options: ["Agente Sanitário", "Auxiliar de Serviço", "Auxiliar de Saúde", "Auxiliar de Enfermagem"], answer: "Auxiliar de Enfermagem", justification: "AS é a abreviatura comum para Auxiliar de Enfermagem." },
    { question: "95. O que é 'Isolamento de Contato'?", options: ["Uso de máscara N95", "Uso de luvas e avental ao tocar no paciente e no ambiente", "Quarto com pressão negativa", "Uso de luvas e óculos"], answer: "Uso de luvas e avental ao tocar no paciente e no ambiente", justification: "O Isolamento de Contato é para doenças transmitidas por contato direto ou indireto, exigindo luvas e avental." },
    { question: "96. A 'Regra de Clark' para cálculo de dose pediátrica utiliza qual parâmetro?", options: ["Idade em meses", "Área de superfície corporal", "Peso em libras (ou Kg)", "Altura da criança"], answer: "Peso em libras (ou Kg)", justification: "A Regra de Clark utiliza o peso (geralmente em libras) da criança para calcular a dose." },
    { question: "97. O que é 'Taquicardia Supraventricular' (TSV)?", options: ["Ritmo lento e anormal", "Ritmo acelerado que se origina acima dos ventrículos (átrios)", "Ritmo acelerado que se origina nos ventrículos", "Ausência de batimentos cardíacos"], answer: "Ritmo acelerado que se origina acima dos ventrículos (átrios)", justification: "A TSV é uma taquicardia cuja origem está nas estruturas cardíacas acima dos ventrículos." },
    { question: "98. O que é 'Piúria'?", options: ["Ausência de urina", "Excesso de açúcar na urina", "Presença de pus (leucócitos) na urina", "Urina com sangue"], answer: "Presença de pus (leucócitos) na urina", justification: "Piúria é a presença de células de pus na urina, geralmente indicando infecção do trato urinário." },
    { question: "99. No preparo do campo estéril, as laterais da mesa ou embalagem devem ser consideradas:", options: ["Estéreis", "Contaminadas", "Limitas", "Semi-estéreis"], answer: "Contaminadas", justification: "Apenas a parte superior da mesa ou do invólucro do campo estéril é considerada estéril; as bordas e laterais são consideradas contaminadas." },
    { question: "100. Qual a escala utilizada para classificar o nível de sedação de um paciente?", options: ["Escala de Braden", "Escala de Ramsay", "Escala de Glasgow", "Escala EVA"], answer: "Escala de Ramsay", justification: "A Escala de Ramsay é especificamente utilizada para monitorar e classificar o nível de sedação em pacientes, geralmente em UTI." }
];


let currentQuestionIndex = 0;
let score = 0;
let quizActive = false;
let buttonsDisabled = false;
let shuffledQuizQuestions = []; 

const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
// O botão 'next-question-button' é usado como principal de ação (Iniciar/Próxima Pergunta)
const startQuizPrimaryButton = document.getElementById('next-question-button'); 
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const currentIndexElement = document.getElementById('current-question-index');
const endQuizButton = document.getElementById('end-quiz-button');


// FUNÇÕES SIMULADO
function startQuiz() {
    // Reset de variáveis
    score = 0;
    currentQuestionIndex = 0;
    quizActive = true;
    
    // Embaralha todas as 100 questões
    shuffledQuizQuestions = shuffleArray(quizQuestions);
    
    // ATUALIZA DISPLAY
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = shuffledQuizQuestions.length;
    }
    
    // Configura o botão principal para Próxima Pergunta
    if (startQuizPrimaryButton) {
        startQuizPrimaryButton.textContent = 'Próxima Pergunta';
        // A função loadNextQuestion é chamada no clique DEPOIS da resposta
        startQuizPrimaryButton.onclick = loadNextQuestion; 
        startQuizPrimaryButton.disabled = true; // Inicia desabilitado, só habilita após a resposta
    }
    
    // Configura o botão de SAÍDA
    if (endQuizButton) {
        endQuizButton.style.display = 'inline-block';
        endQuizButton.onclick = endQuiz;
        endQuizButton.disabled = false;
    }
    
    if (scoreElement) scoreElement.textContent = score;
    if (currentIndexElement) currentIndexElement.textContent = 1;

    loadQuestion();
}


function loadQuestion() {
    if (currentQuestionIndex >= shuffledQuizQuestions.length) {
        endQuiz();
        return;
    }

    const currentQ = shuffledQuizQuestions[currentQuestionIndex];
    
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (feedbackMessage) feedbackMessage.innerHTML = '';
    
    // Desabilita o botão principal até a seleção da resposta
    if (startQuizPrimaryButton) {
        startQuizPrimaryButton.textContent = 'Próxima Pergunta';
        startQuizPrimaryButton.disabled = true;
    }
    
    buttonsDisabled = false;
    
    // Tenta remover o número seguido de ponto e espaço no início (Ex: "1. Pergunta")
    let questionText = currentQ.question;
    questionText = questionText.replace(/^\s*\d+(\.\d+)?\.\s*/, '').trim(); 
    
    // Garante que o número sequencial correto do simulado seja sempre exibido
    if (questionTextElement) questionTextElement.textContent = `${currentQuestionIndex + 1}. ${questionText}`;
    if (currentIndexElement) currentIndexElement.textContent = currentQuestionIndex + 1;

    const letters = ['A', 'B', 'C', 'D'];
    
    // Embaralha as opções
    const optionsWithAnswerIndex = currentQ.options.map((option, index) => ({ option, index }));
    const shuffledOptions = shuffleArray(optionsWithAnswerIndex);


    shuffledOptions.forEach((item, index) => {
        const button = document.createElement('button');
        const labeledOption = `${letters[index]}) ${item.option}`; 
        button.textContent = labeledOption;
        
        button.className = 'option-button'; 
        
        // Associa a função de resposta corretamente
        button.onclick = () => selectAnswer(button, item.option, currentQ.answer, currentQ.justification);
        if (optionsContainer) optionsContainer.appendChild(button);
    });
}


function selectAnswer(selectedButton, selectedAnswer, correctAnswer, justification) {
    if (buttonsDisabled) return;

    buttonsDisabled = true;
    
    // Habilita o botão de "Próxima Pergunta" após a seleção
    if (startQuizPrimaryButton) startQuizPrimaryButton.disabled = false; 

    // Desabilita todos os botões após a seleção
    if (optionsContainer) {
        Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
    }

    const correctAnswerText = correctAnswer.trim(); 
    
    if (selectedAnswer.trim() === correctAnswerText) {
        score++; // INCREMENTA PONTUAÇÃO
        selectedButton.classList.add('correct-answer'); 
        if (feedbackMessage) feedbackMessage.innerHTML = `✅ **Correto!**`;
    } else {
        selectedButton.classList.add('incorrect-answer'); 
        if (feedbackMessage) feedbackMessage.innerHTML = `❌ **Incorreto.** A resposta correta era: **${correctAnswerText}**.<br><span style="font-size:0.9em;">**Justificativa:** ${justification}</span>`;
    }
    
    // Destaca a resposta correta 
    if (optionsContainer) {
        Array.from(optionsContainer.children).forEach(btn => {
            // Remove o prefixo de letra da opção (Ex: "A) Opção" -> "Opção")
            const optionTextWithoutLetter = btn.textContent.replace(/^[A-D]\)\s*/, '').trim(); 
            if (optionTextWithoutLetter === correctAnswerText) {
                btn.classList.add('correct-answer');
            }
        });
    }

    if (scoreElement) scoreElement.textContent = score; // ATUALIZA DISPLAY DA PONTUAÇÃO
}


function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuizQuestions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}


function endQuiz() {
    quizActive = false;
    
    // Esconde e desabilita o botão de SAÍDA/FINALIZAR
    if (endQuizButton) {
        endQuizButton.style.display = 'none';
        endQuizButton.disabled = true; 
    }

    // Volta a ser o botão Iniciar Simulado (agora Refazer Simulado)
    if (startQuizPrimaryButton) {
        startQuizPrimaryButton.textContent = 'Refazer Simulado'; 
        startQuizPrimaryButton.onclick = startQuiz;
        startQuizPrimaryButton.disabled = false;
    }
    
    if (optionsContainer) optionsContainer.innerHTML = '';

    // Calcula o total de perguntas realmente vistas/respondidas
    const totalRespondidas = currentQuestionIndex; 
    
    const finalMessage = `🎉 **FIM DO SIMULADO!** 🎉<br><br>Você acertou **${score}** de **${totalRespondidas}** perguntas respondidas (Total: ${quizQuestions.length} questões).`;

    if (questionTextElement) questionTextElement.innerHTML = finalMessage;
    
    const aproveitamento = totalRespondidas > 0 ? ((score / totalRespondidas) * 100).toFixed(0) : 0;
    
    if (feedbackMessage) feedbackMessage.innerHTML = `Seu aproveitamento nas **${totalRespondidas}** questões respondidas foi de **${aproveitamento}%**. Clique em "Refazer Simulado" para começar do zero.`;
}

// Função para configurar o botão de início do Simulado
function setupQuizButton() {
    if (startQuizPrimaryButton) {
        startQuizPrimaryButton.textContent = 'Iniciar o questionário'; 
        startQuizPrimaryButton.onclick = startQuiz;
        startQuizPrimaryButton.disabled = false;
    }
    
    // Garante que o botão de sair esteja escondido no início
    if (endQuizButton) {
        endQuizButton.style.display = 'none';
    }
}


// =========================================================
// NOVO CÓDIGO AQUI: FECHAR MENU AO CLICAR FORA 
// =========================================================
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar-menu');
    const menuToggle = document.getElementById('menu-toggle');

    // Verifica se o menu está aberto e se os elementos existem
    if (sidebar && menuToggle && sidebar.classList.contains('open')) {
        
        // Verifica se o clique NÃO foi dentro do menu E NÃO foi dentro do botão de toggle
        const isClickInsideMenu = sidebar.contains(event.target);
        const isClickInsideButton = menuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickInsideButton) {
            // Remove a classe 'open', fechando o menu
            sidebar.classList.remove('open');
        }
    }
});
// =========================================================
// FIM DO NOVO CÓDIGO DE FECHAMENTO
// =========================================================


// =========================================================
// INICIALIZAÇÃO DA PÁGINA (DOMContentLoaded)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. CONFIGURAÇÃO DOS EVENTOS DO MENU LATERAL
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sidebarMenu = document.getElementById('sidebar-menu');

    // Listener para o botão de abrir (mobile)
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Listener para o botão de fechar (X dentro do menu)
    if (closeMenu) {
        closeMenu.addEventListener('click', closeSidebar);
    }
    
    // Listeners para os links internos do menu
    if (sidebarMenu) {
        const menuLinks = sidebarMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            // Passa o evento para a função closeSidebar que cuidará do fechamento e do scroll
            link.addEventListener('click', closeSidebar);
        });
    }
    
    // 1. Inicialização do Flashcards
    if (allFlashcards.length > 0) {
        carregarCard(currentIndex);
    } else {
        const questionEl = document.getElementById('card-question');
        if (questionEl) questionEl.textContent = "Nenhum card encontrado.";
    }
    
    // 2. Inicialização do Simulado (Módulo 6)
    
    // Define o total de questões
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = quizQuestions.length;
    }
    
    // Chama a função para configurar o botão de Iniciar
    setupQuizButton();

    // Mensagem inicial do Simulado
    if (questionTextElement) {
        questionTextElement.innerHTML = 'Clique em "Iniciar o questionário" para começar as 100 Questões!';
    }
    
    // 3. Inicialização das Calculadoras
    // Chamar as funções de cálculo para garantir que os valores iniciais e explicações sejam gerados
    if (document.getElementById('valor-converter')) converterUnidades(); // Garante que o valor inicial e a explicação da conversão sejam gerados
    
    // Otimização: Chamar a função de BH APÓS atualizar os totais, para que o resultado inicial seja preciso
    atualizarTotalIngestas();
    atualizarTotalEliminacoes();
    if (document.getElementById('ev')) calcularBalançoHidrico(); // Garante que os totais do BH e a explicação sejam gerados

    // Garante que o estado inicial das explicações seja escondido (pois converterUnidades/calcularBH as gerou)
    resetExplicacao('gotejamento');
    resetExplicacao('dosagem');
    resetExplicacao('bh');
    resetExplicacao('pediatrica');
    resetExplicacao('insulina');
    resetExplicacao('conversao');
});
// No seu script.js (Raiz)
if ('serviceWorker' in navigator) {
    // Forçar o registo no caminho atual
navigator.serviceWorker.register('./sw.js', { scope: './' })
    .then(reg => console.log('Service Worker registrado com sucesso!', reg))
    .catch(err => console.log('Falha ao registrar:', err));
}
// =========================================================
// FUNÇÃO DE SAÍDA COM TELA DE DESPEDIDA
// =========================================================

function executarSaida(event) {
    if (event) event.preventDefault(); 

    const telaSaida = document.getElementById('saida-overlay');
    const sidebar = document.getElementById('sidebar-menu');
    
    // 1. Fecha o menu lateral imediatamente (usando a sua classe 'open')
    if (sidebar) {
        sidebar.classList.remove('open');
    }

    // 2. Mostra a tela de despedida
    if (telaSaida) {
        telaSaida.style.display = 'flex';
        // Pequeno delay para a transição de opacidade funcionar
        setTimeout(() => {
            telaSaida.style.opacity = '1';
        }, 10);
    }

    // 3. Após 2.5 segundos, limpa a tela e volta ao topo
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (telaSaida) {
            telaSaida.style.opacity = '0';
            // Esconde o elemento após a animação de sumir
            setTimeout(() => {
                telaSaida.style.display = 'none';
            }, 500);
        }
    }, 2500);
}
