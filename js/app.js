// app.js - Controlador principal de MedPulse
import { store } from './store.js';
import { QUIZ_QUESTIONS, CLINICAL_CASES, TUTOR_QUICK_PROMPTS } from './data.js';

class MedPulseApp {
  constructor() {
    this.currentView = 'dashboard';
    this.quizState = {
      questions: [...QUIZ_QUESTIONS],
      currentIndex: 0,
      userAnswers: {},
      isAnswered: false,
      score: 0
    };
    this.caseState = {
      currentCaseIndex: 0,
      activeTab: 'anamnesis',
      currentStageIndex: 0,
      completedStages: {}
    };

    this.init();
  }

  init() {
    this.setupNavigation();
    this.renderDashboard();
    this.setupQuiz();
    this.setupCases();
    this.setupReview();
    this.setupTutor();

    // Comprobar hash en URL si existe
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'quiz', 'cases', 'review', 'tutor'].includes(hash)) {
      this.switchView(hash);
    } else {
      this.switchView('dashboard');
    }
  }

  // --- NAVEGACIÓN Y VISTAS RESPONSIVAS ---
  setupNavigation() {
    const navButtons = document.querySelectorAll('[data-nav-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-nav-target');
        this.switchView(targetView);
      });
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Ocultar todas las secciones
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.add('hidden');
    });

    // Mostrar vista objetivo
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.remove('hidden');
    }

    // Actualizar estilos activos en sidebar (escritorio) y barra inferior (móvil)
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      const isTarget = btn.getAttribute('data-nav-target') === viewName;
      if (btn.classList.contains('mobile-nav-item')) {
        // Estilos móviles
        if (isTarget) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      } else {
        // Estilos escritorio (sidebar)
        if (isTarget) {
          btn.classList.add('bg-primary', 'text-white', 'font-semibold', 'shadow-xs');
          btn.classList.remove('text-slate-600', 'hover:bg-slate-100', 'hover:text-slate-900');
        } else {
          btn.classList.remove('bg-primary', 'text-white', 'font-semibold', 'shadow-xs');
          btn.classList.add('text-slate-600', 'hover:bg-slate-100', 'hover:text-slate-900');
        }
      }
    });

    // Acciones específicas al entrar a una vista
    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'review') {
      this.renderReview();
    }

    // Scroll arriba suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- FUNCIÓN 3: DASHBOARD & SEGUIMIENTO DEL PROGRESO ---
  renderDashboard() {
    const stats = store.getStats();

    // Actualizar KPIs principales
    const elAccuracy = document.getElementById('dash-accuracy');
    if (elAccuracy) elAccuracy.textContent = `${stats.accuracyGlobal}%`;

    const elCases = document.getElementById('dash-cases');
    if (elCases) elCases.textContent = `${stats.completedCases}`;

    const elTotalAnswered = document.getElementById('dash-total-answered');
    if (elTotalAnswered) elTotalAnswered.textContent = stats.totalAnswered;

    const elCorrectCount = document.getElementById('dash-correct-count');
    if (elCorrectCount) elCorrectCount.textContent = `${stats.totalCorrect} correctas`;

    const elIncorrectCount = document.getElementById('dash-incorrect-count');
    if (elIncorrectCount) elIncorrectCount.textContent = `${stats.totalIncorrect} a repasar`;

    const elStreak = document.getElementById('dash-streak');
    if (elStreak) elStreak.textContent = `${stats.streakDays}`;

    // Renderizar Dominio por Especialidad
    const specContainer = document.getElementById('dash-specialty-list');
    if (specContainer) {
      specContainer.innerHTML = '';
      const specs = stats.specialties || {};
      for (const [name, data] of Object.entries(specs)) {
        const pct = data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 70;
        const colorClass = pct >= 80 ? 'bg-emerald-600' : pct >= 60 ? 'bg-primary' : 'bg-rose-600';
        const badgeColor = pct >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : pct >= 60 ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-rose-50 text-rose-800 border-rose-200';

        const row = document.createElement('div');
        row.className = 'p-3 bg-slate-50 border border-slate-200/70 rounded-lg flex flex-col gap-2 transition-all hover:bg-slate-100/70';
        row.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-800">${name}</span>
              <span class="text-[10px] px-2 py-0.5 rounded border font-medium ${badgeColor}">${data.correct}/${data.answered} acertadas</span>
            </div>
            <span class="text-sm font-bold text-slate-900 tabular-nums">${pct}%</span>
          </div>
          <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full ${colorClass} rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        `;
        specContainer.appendChild(row);
      }
    }

    // Renderizar Historial de Intentos
    const historyContainer = document.getElementById('dash-history-list');
    if (historyContainer) {
      historyContainer.innerHTML = '';
      (stats.history || []).forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs';
        itemEl.innerHTML = `
          <div class="flex items-center gap-2.5">
            <span class="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[16px]">verified</span>
            </span>
            <div class="flex flex-col">
              <span class="font-semibold text-slate-900">${item.title}</span>
              <span class="text-[10px] text-slate-500">${item.date} • <span class="text-primary font-medium">${item.tag}</span></span>
            </div>
          </div>
          <span class="font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 tabular-nums">${item.score}</span>
        `;
        historyContainer.appendChild(itemEl);
      });
    }
  }

  // --- FUNCIÓN 1: BANCO DE PREGUNTAS INTERACTIVO ---
  setupQuiz() {
    this.renderCurrentQuestion();

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.quizState.currentIndex < this.quizState.questions.length - 1) {
          this.quizState.currentIndex += 1;
          this.quizState.isAnswered = false;
          this.renderCurrentQuestion();
        } else {
          this.showQuizSummaryModal();
        }
      });
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.resetQuizSession();
      });
    }
  }

  resetQuizSession(questions = null) {
    this.quizState.questions = questions || [...QUIZ_QUESTIONS];
    this.quizState.currentIndex = 0;
    this.quizState.userAnswers = {};
    this.quizState.isAnswered = false;
    this.quizState.score = 0;
    this.renderCurrentQuestion();
    document.getElementById('quiz-summary-modal')?.classList.add('hidden');
  }

  renderCurrentQuestion() {
    const q = this.quizState.questions[this.quizState.currentIndex];
    if (!q) return;

    // Barra de Progreso Segmentada
    const trackerContainer = document.getElementById('quiz-progress-tracker');
    if (trackerContainer) {
      trackerContainer.innerHTML = '';
      this.quizState.questions.forEach((_, idx) => {
        const seg = document.createElement('div');
        seg.className = 'progress-segment';
        if (idx < this.quizState.currentIndex) {
          const ans = this.quizState.userAnswers[idx];
          seg.className += ans && ans.isCorrect ? ' seg-correct' : ' seg-incorrect';
        } else if (idx === this.quizState.currentIndex) {
          seg.className += ' seg-active';
        }
        trackerContainer.appendChild(seg);
      });
    }

    // Cabecera de pregunta
    const elCounter = document.getElementById('quiz-question-counter');
    if (elCounter) elCounter.textContent = `Pregunta ${this.quizState.currentIndex + 1} de ${this.quizState.questions.length}`;

    const elSpecialty = document.getElementById('quiz-question-specialty');
    if (elSpecialty) elSpecialty.textContent = `${q.specialty} • ${q.subtopic || ''}`;

    // Viñeta clínica
    const elVignette = document.getElementById('quiz-vignette-text');
    if (elVignette) elVignette.textContent = q.vignette;

    // Opciones
    const optionsContainer = document.getElementById('quiz-options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn w-full text-left p-3.5 sm:p-4 flex items-start gap-3';
        btn.setAttribute('data-option-id', opt.id);

        btn.innerHTML = `
          <span class="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 option-badge border border-slate-200">
            ${opt.id}
          </span>
          <span class="text-xs sm:text-sm text-slate-800 leading-relaxed pt-0.5">
            ${opt.text}
          </span>
        `;

        btn.addEventListener('click', () => {
          if (!this.quizState.isAnswered) {
            this.handleOptionSelect(q, opt.id);
          }
        });

        optionsContainer.appendChild(btn);
      });
    }

    // Ocultar explicación y botón
    const explanationBox = document.getElementById('quiz-explanation-box');
    if (explanationBox) explanationBox.classList.add('hidden');

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.classList.add('hidden');
      nextBtn.textContent = this.quizState.currentIndex === this.quizState.questions.length - 1 ? 'Finalizar y Ver Resultados' : 'Siguiente Pregunta';
    }
  }

  handleOptionSelect(question, chosenId) {
    this.quizState.isAnswered = true;
    const isCorrect = chosenId === question.correctAnswer;
    if (isCorrect) this.quizState.score += 1;

    this.quizState.userAnswers[this.quizState.currentIndex] = {
      chosenId,
      isCorrect
    };

    // Guardar en store
    store.recordQuizAnswer(question, chosenId, isCorrect);

    // Pintar opciones con estilos de grado médico
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(btn => {
      const optId = btn.getAttribute('data-option-id');
      const badge = btn.querySelector('.option-badge');
      btn.disabled = true;

      if (optId === question.correctAnswer) {
        btn.classList.add('opt-correct');
        if (badge) {
          badge.className = 'w-7 h-7 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
          badge.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';
        }
      } else if (optId === chosenId && !isCorrect) {
        btn.classList.add('opt-incorrect');
        if (badge) {
          badge.className = 'w-7 h-7 rounded-md bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
          badge.innerHTML = '<span class="material-symbols-outlined text-[16px]">close</span>';
        }
      } else {
        btn.classList.add('opacity-50');
      }
    });

    // Mostrar panel de fundamentación clínica
    const explanationBox = document.getElementById('quiz-explanation-box');
    if (explanationBox) {
      explanationBox.classList.remove('hidden');
      const titleEl = document.getElementById('quiz-exp-title');
      const textEl = document.getElementById('quiz-exp-text');
      const pearlEl = document.getElementById('quiz-exp-pearl');

      if (titleEl) {
        titleEl.textContent = isCorrect ? 'Respuesta Correcta' : 'Respuesta Incorrecta';
        titleEl.className = `font-heading text-sm font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`;
      }

      if (textEl) {
        textEl.textContent = question.explanation.correct;
      }

      if (pearlEl) {
        pearlEl.textContent = question.explanation.pearl || '';
      }
    }

    // Mostrar botón siguiente
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.classList.remove('hidden');
  }

  showQuizSummaryModal() {
    const total = this.quizState.questions.length;
    const correct = this.quizState.score;
    const scorePct = Math.round((correct / total) * 100);

    store.recordQuizCompleted("Autoevaluación Formativa", correct, total, "Medicina General");

    const modal = document.getElementById('quiz-summary-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.getElementById('modal-score-pct').textContent = `${scorePct}%`;
      document.getElementById('modal-correct-count').textContent = `${correct} de ${total}`;
      
      const feedbackText = scorePct >= 80 ? 'Excelente asimilación de conceptos fisiopatológicos y farmacológicos.' : scorePct >= 60 ? 'Rendimiento aceptable. Se recomienda repasar los puntos débiles identificados.' : 'Requiere refuerzo urgente en farmacoterapia antes de la rotación.';
      document.getElementById('modal-feedback-text').textContent = feedbackText;
    }
  }

  // --- FUNCIÓN 2: SIMULADOR DE CASOS CLÍNICOS ---
  setupCases() {
    this.renderCase();

    // Pestañas del caso
    const tabBtns = document.querySelectorAll('[data-case-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-case-tab');
        this.caseState.activeTab = tab;
        tabBtns.forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');

        document.querySelectorAll('.case-tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`case-tab-${tab}`)?.classList.remove('hidden');
      });
    });

    // Selector de caso
    const caseSelect = document.getElementById('case-select');
    if (caseSelect) {
      caseSelect.addEventListener('change', (e) => {
        this.caseState.currentCaseIndex = parseInt(e.target.value, 10) || 0;
        this.caseState.currentStageIndex = 0;
        this.renderCase();
      });
    }
  }

  renderCase() {
    const c = CLINICAL_CASES[this.caseState.currentCaseIndex];
    if (!c) return;

    // Datos del paciente
    document.getElementById('case-patient-name').textContent = c.patient.name;
    document.getElementById('case-patient-details').textContent = `${c.patient.age} • ${c.patient.sex} • ${c.patient.occupation}`;
    document.getElementById('case-title').textContent = c.title;

    // Antecedentes
    const antContainer = document.getElementById('case-antecedents');
    if (antContainer) {
      antContainer.innerHTML = '';
      c.patient.antecedents.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200';
        badge.textContent = item;
        antContainer.appendChild(badge);
      });
    }

    // Constantes vitales
    document.getElementById('case-vital-bp').textContent = c.vitals.bp;
    document.getElementById('case-vital-bp-sub').textContent = c.vitals.bpStatus;
    document.getElementById('case-vital-hr').textContent = c.vitals.hr;
    document.getElementById('case-vital-hr-sub').textContent = c.vitals.hrStatus;
    document.getElementById('case-vital-spo2').textContent = c.vitals.spo2;
    document.getElementById('case-vital-rr').textContent = c.vitals.rr;
    document.getElementById('case-vital-temp').textContent = c.vitals.temp;

    // Anamnesis y Examen Físico
    document.getElementById('case-anamnesis-text').textContent = c.anamnesis;
    document.getElementById('case-exam-text').textContent = c.exam;

    // Laboratorios
    const labsContainer = document.getElementById('case-labs-container');
    if (labsContainer) {
      labsContainer.innerHTML = '';
      c.labs.forEach(lab => {
        const labRow = document.createElement('div');
        labRow.className = `p-2.5 rounded-lg flex items-center justify-between gap-3 text-xs ${lab.alert ? 'bg-rose-50 border border-rose-200 text-rose-900' : 'bg-slate-50 border border-slate-200 text-slate-800'}`;
        labRow.innerHTML = `
          <div class="flex flex-col">
            <span class="font-semibold">${lab.name}</span>
            <span class="text-[10px] text-slate-500">${lab.normal ? `Referencia: ${lab.normal}` : ''}</span>
          </div>
          <span class="font-bold tabular-nums text-right ${lab.alert ? 'text-rose-700' : 'text-slate-900'}">${lab.value}</span>
        `;
        labsContainer.appendChild(labRow);
      });
    }

    // Etapa de decisión
    this.renderCaseStage(c);
  }

  renderCaseStage(currentCase) {
    const stage = currentCase.stages[this.caseState.currentStageIndex];
    if (!stage) return;

    document.getElementById('case-stage-counter').textContent = `Etapa ${this.caseState.currentStageIndex + 1} de ${currentCase.stages.length}`;
    document.getElementById('case-stage-title').textContent = stage.title;
    document.getElementById('case-stage-prompt').textContent = stage.prompt;

    const optContainer = document.getElementById('case-stage-options');
    if (optContainer) {
      optContainer.innerHTML = '';
      stage.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-start gap-2.5';
        btn.innerHTML = `
          <span class="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
            ${opt.id}
          </span>
          <span class="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">${opt.text}</span>
        `;

        btn.addEventListener('click', () => {
          this.handleCaseStageAnswer(currentCase, stage, opt.id, btn);
        });

        optContainer.appendChild(btn);
      });
    }

    const feedbackBox = document.getElementById('case-stage-feedback');
    if (feedbackBox) feedbackBox.classList.add('hidden');
  }

  handleCaseStageAnswer(currentCase, stage, chosenId, clickedBtn) {
    const isCorrect = chosenId === stage.correctAnswer;
    const feedbackBox = document.getElementById('case-stage-feedback');
    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      const textEl = document.getElementById('case-stage-feedback-text');
      if (textEl) textEl.textContent = stage.feedback;

      feedbackBox.className = `p-4 rounded-lg flex flex-col gap-1.5 border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
    }

    // Siguiente etapa o finalizar
    const nextBtn = document.getElementById('case-stage-next-btn');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      const isLast = this.caseState.currentStageIndex === currentCase.stages.length - 1;
      nextBtn.textContent = isLast ? 'Completar Caso Clínico' : 'Avanzar a Siguiente Etapa';
      nextBtn.onclick = () => {
        if (!isLast) {
          this.caseState.currentStageIndex += 1;
          this.renderCaseStage(currentCase);
        } else {
          store.recordCaseCompleted(currentCase.id, 100);
          alert(`Caso completado: ${currentCase.title}. Se ha registrado en tu historial formativo.`);
          this.switchView('dashboard');
        }
      };
    }
  }

  // --- FUNCIÓN 4: REPASO PERSONALIZADO Y PUNTOS DÉBILES ---
  setupReview() {
    this.renderReview();
  }

  renderReview() {
    const weakPoints = store.getWeakPoints();
    const container = document.getElementById('review-cards-container');
    if (!container) return;

    container.innerHTML = '';
    weakPoints.forEach(wp => {
      const card = document.createElement('div');
      card.className = 'clinical-card p-4 sm:p-5 flex flex-col justify-between gap-3';
      card.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
              Fallo: ${wp.errorRate}%
            </span>
            <span class="text-xs font-semibold text-slate-500">${wp.specialty}</span>
          </div>
          <h3 class="font-heading text-sm font-bold text-slate-900">${wp.topic}</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">${wp.diagnostic}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-start gap-2 text-xs text-slate-700">
          <span class="material-symbols-outlined text-primary text-[16px] shrink-0">lightbulb</span>
          <div class="flex flex-col">
            <strong class="font-semibold text-slate-900 text-[11px]">Acción Formativa:</strong>
            <span class="text-[11px] text-slate-600">${wp.highYieldAction}</span>
          </div>
        </div>
        <button type="button" class="start-targeted-review-btn w-full py-2 px-3 rounded-lg bg-primary hover:bg-[#00507a] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs" data-specialty="${wp.specialty}">
          <span class="material-symbols-outlined text-[16px]">play_circle</span>
          <span>Iniciar Refuerzo (${wp.specialty})</span>
        </button>
      `;

      card.querySelector('.start-targeted-review-btn').addEventListener('click', () => {
        const filtered = QUIZ_QUESTIONS.filter(q => q.specialty === wp.specialty);
        this.resetQuizSession(filtered.length > 0 ? filtered : QUIZ_QUESTIONS);
        this.switchView('quiz');
      });

      container.appendChild(card);
    });

    // Flashcard interactiva
    const flipCard = document.getElementById('flashcard-interactive');
    const flipBtn = document.getElementById('flashcard-flip-btn');
    if (flipCard && flipBtn) {
      let isFlipped = false;
      flipBtn.addEventListener('click', () => {
        isFlipped = !isFlipped;
        const front = document.getElementById('flashcard-front');
        const back = document.getElementById('flashcard-back');
        if (isFlipped) {
          front?.classList.add('hidden');
          back?.classList.remove('hidden');
          flipBtn.textContent = 'Ocultar Respuesta';
        } else {
          front?.classList.remove('hidden');
          back?.classList.add('hidden');
          flipBtn.textContent = 'Revelar Mnemotecnia Clínica';
        }
      });
    }
  }

  // --- FUNCIÓN 5: TUTOR MÉDICO IA ---
  setupTutor() {
    this.renderChatHistory();

    const sendBtn = document.getElementById('tutor-send-btn');
    const inputEl = document.getElementById('tutor-chat-input');

    const handleSend = () => {
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      this.sendUserChatMessage(text);
    };

    if (sendBtn && inputEl) {
      sendBtn.addEventListener('click', handleSend);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
      });
    }

    // Prompts sugeridos
    const quickPromptsContainer = document.getElementById('tutor-quick-prompts');
    if (quickPromptsContainer) {
      quickPromptsContainer.innerHTML = '';
      TUTOR_QUICK_PROMPTS.forEach(p => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex flex-col gap-0.5 text-xs';
        pill.innerHTML = `
          <span class="font-bold text-primary text-[11px]">${p.title}</span>
          <span class="text-slate-500 text-[10px] truncate">${p.subtitle}</span>
        `;
        pill.addEventListener('click', () => {
          this.sendUserChatMessage(p.query);
        });
        quickPromptsContainer.appendChild(pill);
      });
    }
  }

  renderChatHistory() {
    const container = document.getElementById('tutor-chat-messages');
    if (!container) return;

    container.innerHTML = '';
    const messages = store.getChatMessages();

    messages.forEach(msg => {
      const isUser = msg.sender === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex flex-col gap-1 max-w-2xl ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`;

      const bubbleClass = isUser ? 'chat-bubble-user' : 'chat-bubble-ai';

      msgDiv.innerHTML = `
        <div class="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
          <span>${isUser ? 'Dra. Sofía Rivas' : 'Tutor Clínico'}</span>
          <span>•</span>
          <span>${msg.time}</span>
        </div>
        <div class="${bubbleClass} whitespace-pre-line font-normal">
          ${this.formatChatText(msg.text)}
        </div>
      `;

      container.appendChild(msgDiv);
    });

    container.scrollTop = container.scrollHeight;
  }

  formatChatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/> (.*?)\n/g, '<blockquote>$1</blockquote>\n');
  }

  sendUserChatMessage(text) {
    store.addChatMessage('user', text);
    this.renderChatHistory();

    setTimeout(() => {
      const response = this.generateMedicalAIResponse(text);
      store.addChatMessage('ai', response);
      this.renderChatHistory();
    }, 500);
  }

  generateMedicalAIResponse(query) {
    const qLower = query.toLowerCase();

    if (qLower.includes('ieca') || qLower.includes('nefroprotecc')) {
      return `Estimada Dra. Rivas, abordemos el fundamento fisiopatológico de los **IECA**:

**1. Dinámica Glomerular:**
- En la nefropatía diabética temprana existe vasoconstricción preferencial de la arteriola eferente mediada por angiotensina II, lo que incrementa la presión intraglomerular e induce hiperfiltración nociva.
- Los IECA inhiben la síntesis de angiotensina II, provocando **vasodilatación de la arteriola eferente**.

**2. Beneficio Clínico:**
- Descenso de la presión capilar intraglomerular, disminución de la microalbuminuria y enlentecimiento del deterioro de la tasa de filtrado glomerular.

**3. Monitorización Obligatoria:**
- Es esperable un ascenso de hasta un 25-30% en los niveles de creatinina sérica tras el inicio; incrementos superiores obligan a descartar estenosis de arteria renal bilateral.`;
    }

    if (qLower.includes('nac') || qLower.includes('neumon')) {
      return `Diferenciación clínico-radiológica en **Neumonía Adquirida en la Comunidad (NAC)**:

**Patrón Típico vs. Atípico:**
1. **Típica (S. pneumoniae)**: Inicio hiperagudo, fiebre en picos, escalofríos, esputo purulento/herrumbroso y dolor pleurítico. En radiografía: consolidación lobar con **broncograma aéreo**.
2. **Atípica (M. pneumoniae / C. pneumoniae)**: Inicio gradual, tos seca persistente, mialgias y disociación clínico-radiológica (infiltrados reticulares bilaterales con auscultación poco expresiva).
3. **Escala CURB-65**: Evalúa Confusión, Urea >19 mg/dL, Frecuencia Respiratoria ≥30 rpm, Presión arterial sistólica <90 o diastólica ≤60 mmHg, y Edad ≥65 años.`;
    }

    if (qLower.includes('fibrilaci') || qLower.includes('antiarr')) {
      return `En el manejo de la **Fibrilación Auricular (FA)**:

- **Estrategia de Control de Ritmo**: Restauración y mantenimiento del ritmo sinusal. De elección en pacientes sintomáticos, episodios de inicio reciente (<48h) o insuficiencia cardíaca descompensada atribuible a la taquiarritmia.
- **Estrategia de Control de Frecuencia**: Frecuencia ventricular objetivo < 100-110 lpm. Indicada en pacientes con síntomas leves o ancianos con aurículas muy dilatadas.
- **Tromboprofilaxis**: Se rige por la escala CHA₂DS₂-VASc con independencia de la estrategia elegida (ritmo o frecuencia).`;
    }

    return `Consulta clínica registrada: "${query}".

**Criterios Académicos:**
1. **Evaluación de Estabilidad**: Confirmar de forma inmediata el triángulo de evaluación clínica (vía aérea, respiración y perfusión tisular).
2. **Prioridad Diagnóstica**: Jerarquizar diagnósticos diferenciales según gravedad y tiempo de evolución.
3. **Manejo Farmacológico**: Indicar medidas basadas en evidencia de acuerdo a protocolos clínicos vigentes.

*(Aviso: Esta herramienta forma parte de un entorno simulado para estudiantes de medicina).*`;
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.medpulseApp = new MedPulseApp();
});
