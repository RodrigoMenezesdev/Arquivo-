// script.js (DENTRO DA PASTA SIMULADO/)

// =========================================================
// 1. DADOS DO QUIZ (10 QUESTÕES RESTAURADAS)
// =========================================================
const quizData = [
    {
        question: "Conforme a Lei nº 7.498/86, qual das atividades a seguir é considerada atribuição privativa do Enfermeiro e NÃO deve ser realizada pelo Técnico?",
        options: [
            "Prestar cuidados de higiene e conforto a pacientes graves.",
            "Participar da equipe de Ressuscitação Cardiopulmonar (RCP).",
            "Executar a administração de medicamentos por via endovenosa, sob supervisão.",
            "Prescrever a Assistência de Enfermagem (SAE) e realizar a consulta de Enfermagem."
        ],
        answer: "Prescrever a Assistência de Enfermagem (SAE) e realizar a consulta de Enfermagem.",
        commentary: "A Consulta de Enfermagem e a Prescrição da Assistência de Enfermagem (SAE) são atribuições privativas do Enfermeiro."
    },
    {
        question: "Um princípio doutrinário do SUS determina que os serviços devem atender o indivíduo em sua totalidade. Esse conceito está diretamente relacionado ao princípio da:",
        options: [
            "Descentralização",
            "Universalidade",
            "Equidade",
            "Integralidade"
        ],
        answer: "Integralidade",
        commentary: "A Integralidade implica que o indivíduo deve ser visto de forma completa, contemplando ações de prevenção, promoção, tratamento e reabilitação."
    },
    {
        question: "Qual via de administração de medicamentos apresenta maior risco de embolia e deve ser realizada por via Z-Track?",
        options: [
            "Intradérmica (ID)",
            "Subcutânea (SC)",
            "Intramuscular (IM)",
            "Endovenosa (EV)"
        ],
        answer: "Intramuscular (IM)",
        commentary: "A via Intramuscular (IM), especialmente em medicamentos oleosos, possui risco de atingir vasos sanguíneos. A técnica Z-Track é utilizada para selar o local da injeção, impedindo o refluxo do medicamento e reduzindo a dor e manchas."
    },
    {
        question: "Para o cálculo de gotejamento, em uma prescrição de 500 ml de Soro Fisiológico para correr em 6 horas, o resultado em gotas por minuto (gts/min) será de:",
        options: [
            "21 gts/min",
            "28 gts/min",
            "42 gts/min",
            "56 gts/min"
        ],
        answer: "28 gts/min",
        commentary: "Fórmula: Gts/min = Volume (ml) / (Tempo (h) x 3). Cálculo: 500 / (6 x 3) = 500 / 18 ≈ 27,77. Arredondando, temos 28 gts/min."
    },
    {
        question: "O código de ética dos profissionais de enfermagem preconiza que o profissional deve recusar-se a executar atividades que não sejam de sua competência técnica, científica, ética e legal. Este direito é conhecido como:",
        options: [
            "Sigilo profissional",
            "Autonomia",
            "Recusa Justificada",
            "Privacidade"
        ],
        answer: "Recusa Justificada",
        commentary: "A Recusa Justificada permite ao profissional recusar-se a praticar atos que não sejam de sua alçada ou que coloquem em risco o paciente, conforme o Código de Ética."
    },
    {
        question: "Qual o equipamento de proteção individual (EPI) de uso obrigatório em contato com fluidos corporais em potencial risco de respingos?",
        options: [
            "Avental simples.",
            "Máscara cirúrgica e Óculos de proteção.",
            "Luvas de procedimento e Gorro.",
            "Protetor facial ou máscara N95."
        ],
        answer: "Máscara cirúrgica e Óculos de proteção.",
        commentary: "Em procedimentos com risco de respingos (como aspiração ou manuseio de drenos), a proteção das mucosas (olhos, nariz e boca) é essencial. O uso combinado de máscara cirúrgica e óculos/protetor facial é o mais indicado."
    },
    {
        question: "Segundo a classificação de risco de Manchester, qual cor indica a prioridade zero e a necessidade de atendimento imediato, com risco iminente de morte?",
        options: [
            "Amarelo",
            "Laranja",
            "Vermelho",
            "Verde"
        ],
        answer: "Vermelho",
        commentary: "O protocolo de Manchester classifica o Vermelho como emergência (risco iminente de morte, atendimento imediato), Laranja como muito urgente, Amarelo como urgente, Verde como pouco urgente e Azul como não urgente."
    },
    {
        question: "Na administração de insulina subcutânea, o ângulo de aplicação correto em paciente com tecido adiposo suficiente é de:",
        options: [
            "15 graus",
            "30 graus",
            "45 graus",
            "90 graus"
        ],
        answer: "90 graus",
        commentary: "Em pacientes com bom tecido adiposo, o ângulo de 90º é o mais seguro para garantir que a medicação atinja o tecido subcutâneo. Em pacientes magros ou crianças, o ângulo de 45º, com prega cutânea, é recomendado."
    },
    {
        question: "A principal função da Vigilância Epidemiológica (VE) é:",
        options: [
            "Realizar o tratamento de todas as doenças crônicas.",
            "Promover a reabilitação física de pacientes.",
            "Coletar, processar e disseminar dados para planejar medidas de controle de doenças.",
            "Executar a assistência direta ao paciente em estado grave."
        ],
        answer: "Coletar, processar e disseminar dados para planejar medidas de controle de doenças.",
        commentary: "A VE é o sistema que monitora a ocorrência e distribuição de doenças (agravos à saúde) e fatores de risco em uma população. Seu foco é a informação para a ação (planejamento e controle)."
    },
    {
        question: "Qual técnica deve ser utilizada para a aspiração de vias aéreas superiores, garantindo a higiene e prevenindo infecções cruzadas?",
        options: [
            "Técnica asséptica com reuso de sonda.",
            "Técnica limpa com sonda descartável.",
            "Técnica estéril com sonda descartável.",
            "Técnica limpa com luvas não estéreis."
        ],
        answer: "Técnica estéril com sonda descartável.",
        commentary: "A aspiração traqueal e de vias aéreas superiores é um procedimento invasivo. Deve ser realizada sob técnica estéril, utilizando luvas estéreis e sonda descartável para evitar a introdução de microrganismos e infecções associadas a cuidados de saúde."
    }
];

// =========================================================
// 2. LÓGICA DO QUIZ (COMPLETA)
// =========================================================

const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const submitButton = document.getElementById('submit-button');
const exitButton = document.querySelector('.exit-button');
let currentQuestions = []; 
let userAnswers = [];

// Array de letras para as opções
const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']; 


// Lógica para carregar as 10 questões
function buildQuiz() {
    currentQuestions = quizData; 

    const output = [];
    currentQuestions.forEach((currentQuestion, questionNumber) => {
        const options = [];
        
        // Renderiza as opções
        currentQuestion.options.forEach((option, optionIndex) => {
            // Inclui a letra da opção (A, B, C...) e o texto
            options.push(
                `<li data-option="${option}">
                    <span class="option-label">${optionLetters[optionIndex]})</span>
                    <span class="option-text">${option}</span>
                </li>`
            );
        });

        output.push(
            `<div class="question-card" data-question-id="${questionNumber}">
                <h3>Questão ${questionNumber + 1}: ${currentQuestion.question}</h3>
                <ul class="options-list">
                    ${options.join('')}
                </ul>
                <div class="feedback-box" style="display:none;"></div>
            </div>`
        );
    });

    quizContainer.innerHTML = output.join('');
    
    // Adiciona evento de clique para seleção de opção
    document.querySelectorAll('.options-list li').forEach(optionElement => {
        optionElement.addEventListener('click', function() {
            const questionCard = this.closest('.question-card');
            const questionIndex = parseInt(questionCard.dataset.questionId);
            const selectedOption = this.dataset.option;
            
            // Remove a classe 'selected' de todas as opções daquela pergunta
            questionCard.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            
            // Adiciona a classe 'selected' à opção clicada
            this.classList.add('selected');

            // Salva a resposta do usuário
            userAnswers[questionIndex] = selectedOption;
        });
    });
}

// Lógica para enviar e corrigir o quiz (Mantida, pois não houve alteração)
function submitQuiz() {
    let score = 0;
    const totalQuestions = currentQuestions.length;
    let detailedFeedback = '';

    // Passa por todas as questões
    currentQuestions.forEach((currentQuestion, questionNumber) => {
        const questionElement = document.querySelector(`[data-question-id="${questionNumber}"]`);
        const feedbackElement = questionElement.querySelector('.feedback-box');
        
        const userAnswer = userAnswers[questionNumber];
        const userAnswerLabel = userAnswer ? userAnswer : 'Não respondeu';
        const correctAnswerLabel = currentQuestion.answer;

        // Limpa classes anteriores e mostra o feedback
        questionElement.classList.remove('correct', 'incorrect');
        feedbackElement.style.display = 'block';

        if (userAnswer === currentQuestion.answer) {
            // Resposta Correta
            score++;
            questionElement.classList.add('correct');
            detailedFeedback += `<p class="correct">✅ **Questão ${questionNumber + 1} Correta!**</p>`;
        } else {
            // Resposta Incorreta ou Sem Resposta
            questionElement.classList.add('incorrect');
            detailedFeedback += `<p class="incorrect">❌ **Questão ${questionNumber + 1} Incorreta.** (Você respondeu: ${userAnswerLabel})</p>`;
        }
        
        // Exibe o feedback detalhado (Comentário + Resposta Certa)
        feedbackElement.innerHTML = `
            <p><strong>Resposta Correta:</strong> ${correctAnswerLabel}</p>
            <p><strong>Comentário:</strong> ${currentQuestion.commentary}</p>
        `;
    });

    // Exibe o resultado final
    resultsContainer.innerHTML = `
        <h2>Resultado Final: ${score} de ${totalQuestions}</h2>
        <p>Parabéns! Você acertou **${score}** questões. Foco total em RIOSAÚDE/UPAS!</p>
        <hr>
        <h3>Revisão Detalhada:</h3>
        ${detailedFeedback}
    `;
    
    // Rolagem suave para o resultado
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// =========================================================
// 3. INICIALIZAÇÃO E EVENTOS
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    
    buildQuiz(); // Constrói o quiz ao carregar a página
    
    // --- LÓGICA DO BOTÃO FINALIZAR ---
    if (submitButton) {
        submitButton.addEventListener('click', submitQuiz);
    }
    
    // --- LÓGICA DO BOTÃO SAIR (Navegação segura para a pasta raiz) ---
    if (exitButton) {
        exitButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            // O caminho '../index.html' leva o usuário da subpasta 'simulado/' para o arquivo 'index.html' na pasta raiz.
            window.location.href = '../index.html';
        });
    }

});
