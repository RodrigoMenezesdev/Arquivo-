// script-calculos.js

const calculationData = [
    // 1. Gotejamento (Macrogotas) - 5 Exercícios
    { 
        category: "1. Gotejamento (Macrogotas)", 
        problem: "Prescrito: 800 ml em 5 horas.", 
        formula: "G = V / (T x 3)", 
        calculation: "800 / (5 x 3) = 800 / 15", 
        answer: "53 gts/min" 
    },
    { 
        category: "1. Gotejamento (Macrogotas)", 
        problem: "Prescrito: 1.200 ml em 8 horas.", 
        formula: "G = V / (T x 3)", 
        calculation: "1200 / (8 x 3) = 1200 / 24", 
        answer: "50 gts/min" 
    },
    { 
        category: "1. Gotejamento (Macrogotas)", 
        problem: "Prescrito: 500 ml em 6 horas.", 
        formula: "G = V / (T x 3)", 
        calculation: "500 / 18", 
        answer: "28 gts/min" 
    },
    { 
        category: "1. Gotejamento (Macrogotas)", 
        problem: "Prescrito: 750 ml em 4 horas.", 
        formula: "G = V / (T x 3)", 
        calculation: "750 / 12", 
        answer: "63 gts/min" 
    },
    { 
        category: "1. Gotejamento (Macrogotas)", 
        problem: "Prescrito: 2.000 ml em 12 horas.", 
        formula: "G = V / (T x 3)", 
        calculation: "2000 / 36", 
        answer: "56 gts/min" 
    },

    // 2. Gotejamento (Microgotas) - 5 Exercícios
    { 
        category: "2. Gotejamento (Microgotas)", 
        problem: "Prescrito: 100 ml em 2 horas.", 
        formula: "µG = V / T", 
        calculation: "100 / 2", 
        answer: "50 µgts/min" 
    },
    { 
        category: "2. Gotejamento (Microgotas)", 
        problem: "Prescrito: 250 ml em 3 horas.", 
        formula: "µG = V / T", 
        calculation: "250 / 3", 
        answer: "83 µgts/min" 
    },
    { 
        category: "2. Gotejamento (Microgotas)", 
        problem: "Prescrito: 50 ml em 1 hora.", 
        formula: "µG = V / T", 
        calculation: "50 / 1", 
        answer: "50 µgts/min" 
    },
    { 
        category: "2. Gotejamento (Microgotas)", 
        problem: "Prescrito: 150 ml em 4 horas.", 
        formula: "µG = V / T", 
        calculation: "150 / 4", 
        answer: "38 µgts/min" 
    },
    { 
        category: "2. Gotejamento (Microgotas)", 
        problem: "Prescrito: 300 ml em 5 horas.", 
        formula: "µG = V / T", 
        calculation: "300 / 5", 
        answer: "60 µgts/min" 
    },
    
    // 3. Transformação de Soro - 3 Exercícios
    { 
        category: "3. Transformação de Soro", 
        problem: "Transformar 1.000 ml de Soro Glicosado 50% (hipertônico) para Soro Glicosado 5%.", 
        formula: "Regra: (C1 x V1) = (C2 x V2). (50 x 1000) = (5 x V2). V2 = 10.000 ml.", 
        calculation: "V2 (final) = 10.000 ml. Volume de água destilada a adicionar: 10.000 ml - 1.000 ml = 9.000 ml.", 
        answer: "Adicionar 9.000 ml de água destilada." 
    },
    { 
        category: "3. Transformação de Soro", 
        problem: "Transformar 500 ml de Soro Glicosado 50% (hipertônico) para Soro Glicosado 10%.", 
        formula: "Regra: (C1 x V1) = (C2 x V2). (50 x 500) = (10 x V2). V2 = 2.500 ml.", 
        calculation: "V2 (final) = 2.500 ml. Volume de água destilada a adicionar: 2.500 ml - 500 ml (SG 10%) = 2.000 ml de água destilada.", 
        answer: "Adicionar 2.000 ml de água destilada." 
    },
    { 
        category: "3. Transformação de Soro", 
        problem: "Transformar 1.000 ml de Soro Glicosado 50% (hipertônico) para Soro Glicosado 10%.", 
        formula: "Regra: (C1 x V1) = (C2 x V2). (50 x 1000) = (10 x V2). V2 = 5000 ml.", 
        calculation: "V2 (final) = 5.000 ml. Volume de água destilada a adicionar: 5000 ml - 1000 ml = 4000 ml.", 
        answer: "Adicionar 4.000 ml de água destilada." 
    },

    // 4. Cálculo de Tempo - 3 Exercícios
    { 
        category: "4. Cálculo de Tempo", 
        problem: "Prescrito: 500 ml para correr em 20 gts/min.", 
        formula: "T = V / (G x 3)", 
        calculation: "T = 500 / (20 x 3) = 500 / 60", 
        answer: "8 horas e 20 minutos" 
    },
    { 
        category: "4. Cálculo de Tempo", 
        problem: "Prescrito: 1.500 ml para correr em 42 gts/min.", 
        formula: "T = V / (G x 3)", 
        calculation: "T = 1500 / (42 x 3) = 1500 / 126", 
        answer: "11 horas e 55 minutos" 
    },
    { 
        category: "4. Cálculo de Tempo", 
        problem: "Prescrito: 250 ml para correr em 18 gts/min.", 
        formula: "T = V / (G x 3)", 
        calculation: "T = 250 / (18 x 3) = 250 / 54", 
        answer: "4 horas e 38 minutos" 
    },

    // 5. Cálculo de Dose / Rediluição - 3 Exercícios
    { 
        category: "5. Cálculo de Dose / Rediluição", 
        problem: "Precisa-se de 5 mg de um medicamento. A apresentação disponível é ampola com 10 mg em 2 ml. Quanto aspirar?", 
        formula: "D = (Desejada x Volume) / Disponível", 
        calculation: "D = (5 mg x 2 ml) / 10 mg", 
        answer: "1 ml" 
    },
    { 
        category: "5. Cálculo de Dose / Rediluição", 
        problem: "Precisa-se de 300 mg de Amicacina. Apresentação: 500 mg em 2 ml. Quanto aspirar?", 
        formula: "D = (Desejada x Volume) / Disponível", 
        calculation: "D = (300 mg x 2 ml) / 500 mg", 
        answer: "1.2 ml" 
    },
    { 
        category: "5. Cálculo de Dose / Rediluição", 
        problem: "Precisa-se de 40.000 UI. Apresentação: Frasco-ampola de 500.000 UI diluído em 5 ml. Quanto aspirar?", 
        formula: "D = (Desejada x Volume) / Disponível", 
        calculation: "D = (40.000 UI x 5 ml) / 500.000 UI", 
        answer: "0.4 ml" 
    },

    // 6. Conversão de Peso - 3 Exercícios
    { 
        category: "6. Conversão de Peso", 
        problem: "Converter 1,5 kg para gramas (g).", 
        formula: "1 kg = 1.000 g", 
        calculation: "1.5 x 1000", 
        answer: "1.500 g" 
    },
    { 
        category: "6. Conversão de Peso", 
        problem: "Converter 250 g para quilogramas (kg).", 
        formula: "1 g = 0.001 kg", 
        calculation: "250 / 1000", 
        answer: "0.25 kg" 
    },
    { 
        category: "6. Conversão de Peso", 
        problem: "Um paciente pesa 75.000 g. Qual o peso em quilogramas (kg)?", 
        formula: "1 g = 0.001 kg", 
        calculation: "75000 / 1000", 
        answer: "75 kg" 
    }
];

const calculosContainer = document.getElementById('calculos-container');


// ===================================
// NOVO BLOCO DE CÓDIGO PARA O MENU RESPONSIVO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle-calculos');
    const navMenu = document.getElementById('main-nav-calculos'); 

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            // Alterna a classe 'open', que é usada no CSS para mostrar/esconder o menu
            navMenu.classList.toggle('open');
        });
    }
    
    // Procura o botão de saída
    const exitButton = document.querySelector('.exit-button');

    if (exitButton) {
        exitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Impede que o link HTML padrão seja seguido
            
            // SOLUÇÃO FINAL: Força o redirecionamento para o index.html.
            // O caminho '../index.html' navega um nível acima (pasta principal), 
            // corrigindo o erro de caminho para arquivos em subdiretórios.
            window.location.href = '../index.html';
        });
    }
    
    // Inicia o carregamento dos exercícios (função já existente)
    loadCalculations();
});
// ===================================


// Função para carregar os exercícios de cálculo
function loadCalculations() {
    let output = '';
    let currentCategory = '';
    let problemCount = 0;

    calculationData.forEach((item, index) => {
        // Verifica se a categoria mudou para adicionar um novo cabeçalho
        if (item.category !== currentCategory) {
            output += `<h2>${item.category}</h2>`;
            currentCategory = item.category;
            problemCount = 0; // Reinicia a contagem de problemas para a nova categoria
        }
        
        problemCount++;

        // Cria a estrutura de cada exercício
        output += `
            <div class="exercise" id="ex${index}">
                <h3>Exercício ${problemCount}: ${item.problem}</h3>
                <button class="reveal-button" onclick="toggleSolution(${index})">
                    Mostrar Solução
                </button>
                
                <div class="solution-box" id="solution${index}" style="display: none;">
                    <p><strong>Fórmula:</strong> ${item.formula}</p>
                    <p><strong>Cálculo na Calculadora:</strong> ${item.calculation}</p>
                    <p class="final-answer"><strong>Resposta:</strong> ${item.answer}</p>
                </div>
            </div>
        `;
    });

    calculosContainer.innerHTML = output;
}

// Função para mostrar/esconder a solução ao clicar no botão
function toggleSolution(index) {
    const solutionBox = document.getElementById(`solution${index}`);
    const button = document.querySelector(`#ex${index} .reveal-button`);
    
    if (solutionBox.style.display === 'none') {
        solutionBox.style.display = 'block';
        button.textContent = 'Ocultar Solução';
        button.classList.add('active');
    } else {
        solutionBox.style.display = 'none';
        button.textContent = 'Mostrar Solução';
        button.classList.remove('active');
    }
}
