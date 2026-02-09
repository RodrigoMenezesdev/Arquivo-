// =======================================================
// CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// =======================================================
const QUESTIONS_PER_BLOCK = 10; 
let originalQuestions = [];
let shuffledQuestions = [];
let currentBlock = 0;
let totalHits = 0;
let totalErrors = 0;
let userAnswers = {}; 

const quizContent = document.getElementById('quiz-content');
const quizSubtitle = document.getElementById('quiz-subtitle'); 
const navigationArea = document.getElementById('navigation-area');

// =======================================================
// SISTEMA DE ÁUDIO
// =======================================================
function pararLeitura() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function lerTexto(texto) {
    pararLeitura();
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR'; 
        speechSynthesis.speak(utterance);
    }
}

// =======================================================
// CARREGAMENTO E INICIALIZAÇÃO
// =======================================================
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        originalQuestions = await response.json();
        originalQuestions = originalQuestions.map((q, i) => ({...q, id: q.id || `q-${i}`}));
        shuffledQuestions = [...originalQuestions].sort(() => Math.random() - 0.5);
        if (shuffledQuestions.length > 50) shuffledQuestions = shuffledQuestions.slice(0, 50);
        renderBlock();
    } catch (error) {
        quizContent.innerHTML = `<p style="color:red">Erro: ${error.message}</p>`;
    }
}

function renderBlock() {
    pararLeitura(); 
    const startIdx = currentBlock * QUESTIONS_PER_BLOCK;
    const blockQuestions = shuffledQuestions.slice(startIdx, startIdx + QUESTIONS_PER_BLOCK);
    const totalBlocks = Math.ceil(shuffledQuestions.length / QUESTIONS_PER_BLOCK);
    
    if(quizSubtitle) quizSubtitle.textContent = `Bloco ${currentBlock + 1} de ${totalBlocks}`;
    quizContent.innerHTML = '';

    blockQuestions.forEach((q, index) => {
        const globalIndex = startIdx + index + 1;
        const qBlock = document.createElement('div');
        qBlock.className = 'question-block';
        qBlock.setAttribute('data-id', q.id); // Identificador para a validação

        const header = document.createElement('div');
        header.className = 'question-header';
        header.innerHTML = `<p class="question-text"><strong>${globalIndex}.</strong> ${q.question}</p>`;
        
        const btnAudioQ = document.createElement('button');
        btnAudioQ.className = 'audio-button';
        btnAudioQ.innerHTML = '🔊';
        btnAudioQ.onclick = () => lerTexto(q.question);
        header.appendChild(btnAudioQ);
        qBlock.appendChild(header);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'answer-options';
        const letters = ['A', 'B', 'C', 'D', 'E'];

        q.options.forEach((opt, i) => {
            const wrap = document.createElement('div');
            wrap.className = 'option-flex';
            const btnOpt = document.createElement('button');
            btnOpt.className = 'option-select-button';
            btnOpt.innerHTML = `${letters[i]}) ${opt.text}`;
            btnOpt.addEventListener('click', () => handleAnswer(btnOpt, q.id, i));

            const btnAudioOpt = document.createElement('button');
            btnAudioOpt.className = 'audio-button';
            btnAudioOpt.innerHTML = '🔊';
            btnAudioOpt.onclick = (e) => { e.stopPropagation(); lerTexto(opt.text); };

            wrap.appendChild(btnOpt);
            wrap.appendChild(btnAudioOpt);
            optionsDiv.appendChild(wrap);
        });

        qBlock.appendChild(optionsDiv);
        quizContent.appendChild(qBlock);
    });

    updateNavigationButtons();
    window.scrollTo(0, 0);
}

// =======================================================
// LÓGICA DE RESPOSTA
// =======================================================
function handleAnswer(btn, qId, idx) {
    if (btn.disabled) return;
    pararLeitura();

    const qBlock = btn.closest('.question-block');
    qBlock.classList.remove('not-answered'); // Remove alerta de erro se existir
    
    const question = originalQuestions.find(q => q.id === qId);
    const isCorrect = String(question.options[idx].isCorrect) === 'true';
    userAnswers[qId] = { isCorrect, selectedIndex: idx };
    
    const feedbackMsg = document.createElement('span');
    feedbackMsg.className = 'feedback-msg ' + (isCorrect ? 'msg-acerto' : 'msg-erro');
    feedbackMsg.innerHTML = isCorrect ? '✅ Resposta Correta!' : '❌ Resposta Errada!';
    qBlock.prepend(feedbackMsg);

    const buttons = qBlock.querySelectorAll('.option-select-button');
    buttons.forEach((b, i) => {
        b.disabled = true;
        const optionIsCorrect = String(question.options[i].isCorrect) === 'true';
        if (optionIsCorrect) b.classList.add('correct');
        else if (i === idx) b.classList.add('incorrect');
    });

    const rationale = document.createElement('div');
    rationale.className = 'rationale-text';
    const correctOpt = question.options.find(o => String(o.isCorrect) === 'true');
    rationale.textContent = `💡 EXPLICAÇÃO: ${correctOpt ? correctOpt.rationale : "Confira a resposta correta acima."}`;
    qBlock.appendChild(rationale);

    totalHits = Object.values(userAnswers).filter(a => a.isCorrect).length;
    totalErrors = Object.values(userAnswers).length - totalHits;
}

// =======================================================
// VALIDAÇÃO E NAVEGAÇÃO
// =======================================================
function validateAndNext() {
    const startIdx = currentBlock * QUESTIONS_PER_BLOCK;
    const blockQs = shuffledQuestions.slice(startIdx, startIdx + QUESTIONS_PER_BLOCK);
    
    // Encontra perguntas não respondidas no bloco atual
    const unanswered = blockQs.filter(q => !userAnswers[q.id]);

    if (unanswered.length > 0) {
        alert(`⚠️ Atenção: Faltam responder ${unanswered.length} pergunta(s) neste bloco!`);
        
        // Destaca visualmente as perguntas que faltam
        unanswered.forEach(q => {
            const el = document.querySelector(`[data-id="${q.id}"]`);
            if (el) el.classList.add('not-answered');
        });

        // Rola até a primeira não respondida
        const firstUnanswered = document.querySelector('.not-answered');
        if (firstUnanswered) firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return;
    }

    // Se tudo estiver OK, avança ou finaliza
    const isLastBlock = (currentBlock + 1) * QUESTIONS_PER_BLOCK >= shuffledQuestions.length;
    if (isLastBlock) {
        finishQuiz();
    } else {
        currentBlock++;
        renderBlock();
    }
}

function updateNavigationButtons() {
    const isLastBlock = (currentBlock + 1) * QUESTIONS_PER_BLOCK >= shuffledQuestions.length;

    navigationArea.innerHTML = `
        <button class="exit-button-arredondado" onclick="exitQuiz()">SAIR</button>
        <button class="nav-button" id="nextBtn">
            ${isLastBlock ? 'FINALIZAR' : 'PRÓXIMO BLOCO'}
        </button>
    `;

    document.getElementById('nextBtn').onclick = validateAndNext;
    navigationArea.style.display = 'flex';
}

function exitQuiz() {
    if (confirm("⚠️ Sair do simulado? O progresso será perdido.")) {
        // Isso faz o navegador sair da pasta 'simulado-tec' e voltar para a raiz
        window.location.href = "../index.html"; 
    }
}

function finishQuiz() {
    quizContent.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <h2>🎉 Simulado Concluído!</h2>
            <p>Acertos: <strong style="color:green">${totalHits}</strong> | Erros: <strong style="color:red">${totalErrors}</strong></p>
            <button class="nav-button" onclick="location.reload()">REINICIAR</button>
            <button class="exit-button-arredondado" onclick="exitQuiz()" style="margin-left:10px">SAIR</button>
        </div>
    `;
    navigationArea.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadQuestions);
