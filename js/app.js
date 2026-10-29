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
          btn.classList.add('text-primary', 'font-bold');
          btn.classList.remove('text-secondary');
        } else {
          btn.classList.remove('text-primary', 'font-bold');
          btn.classList.add('text-secondary');
        }
      } else {
        // Estilos escritorio (sidebar)
        if (isTarget) {
          btn.classList.add('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
          btn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
        } else {
          btn.classList.remove('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
          btn.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
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
    const user = store.getUser();

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
        const colorClass = pct >= 80 ? 'bg-tertiary text-on-tertiary-container' : pct >= 60 ? 'bg-primary' : 'bg-error';
        const badgeColor = pct >= 80 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : pct >= 60 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container';

        const row = document.createElement('div');
        row.className = 'p-3 bg-surface-container-low rounded-xl flex flex-col gap-2 transition-all hover:bg-surface-container';
        row.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-title-sm text-title-sm text-on-surface font-semibold">${name}</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}">${data.correct}/${data.answered} acertadas</span>
            </div>
            <span class="font-headline-sm text-headline-sm font-bold text-on-surface">${pct}%</span>
          </div>
          <div class="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
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
        itemEl.className = 'p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between gap-3 shadow-xs';
        itemEl.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <div class="flex flex-col">
              <span class="font-body-md text-on-surface font-semibold text-sm leading-snug">${item.title}</span>
              <span class="text-xs text-secondary">${item.date} • <span class="text-primary font-medium">${item.tag}</span></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold px-2.5 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed">${item.score}</span>
          </div>
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

    // Segmented progress tracker
    const trackerContainer = document.getElementById('quiz-progress-tracker');
    if (trackerContainer) {
      trackerContainer.innerHTML = '';
      this.quizState.questions.forEach((_, idx) => {
        const seg = document.createElement('div');
        seg.className = 'h-2 rounded-full transition-all duration-300';
        if (idx < this.quizState.currentIndex) {
          const ans = this.quizState.userAnswers[idx];
          seg.className += ans && ans.isCorrect ? ' bg-tertiary' : ' bg-error';
        } else if (idx === this.quizState.currentIndex) {
          seg.className += ' bg-primary animate-pulse';
        } else {
          seg.className += ' bg-surface-container-high';
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
        btn.className = 'quiz-option-btn w-full text-left p-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container transition-all flex items-start gap-3 shadow-xs';
        btn.setAttribute('data-option-id', opt.id);

        btn.innerHTML = `
          <span class="w-8 h-8 rounded-lg bg-surface-container text-on-surface font-bold text-sm flex items-center justify-center shrink-0 option-badge">
            ${opt.id}
          </span>
          <span class="font-body-md text-on-surface text-sm sm:text-base leading-relaxed pt-0.5">
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

    // Ocultar caja de explicación y botón siguiente inicialmente
    const explanationBox = document.getElementById('quiz-explanation-box');
    if (explanationBox) explanationBox.classList.add('hidden');

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.classList.add('hidden');
      nextBtn.textContent = this.quizState.currentIndex === this.quizState.questions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta';
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

    // Guardar en store y actualizar métricas
    store.recordQuizAnswer(question, chosenId, isCorrect);

    // Pintar opciones
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(btn => {
      const optId = btn.getAttribute('data-option-id');
      const badge = btn.querySelector('.option-badge');
      btn.disabled = true;

      if (optId === question.correctAnswer) {
        btn.classList.remove('bg-surface-container-lowest', 'border-outline-variant/40');
        btn.classList.add('bg-tertiary-fixed/30', 'border-tertiary', 'text-on-surface');
        if (badge) {
          badge.className = 'w-8 h-8 rounded-lg bg-tertiary text-on-tertiary font-bold text-sm flex items-center justify-center shrink-0';
          badge.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span>';
        }
      } else if (optId === chosenId && !isCorrect) {
        btn.classList.remove('bg-surface-container-lowest', 'border-outline-variant/40');
        btn.classList.add('bg-error-container/40', 'border-error', 'text-on-surface');
        if (badge) {
          badge.className = 'w-8 h-8 rounded-lg bg-error text-on-error font-bold text-sm flex items-center justify-center shrink-0';
          badge.innerHTML = '<span class="material-symbols-outlined text-[18px]">close</span>';
        }
      } else {
        btn.classList.add('opacity-60');
      }
    });

    // Mostrar panel de explicación
    const explanationBox = document.getElementById('quiz-explanation-box');
    if (explanationBox) {
      explanationBox.classList.remove('hidden');
      const titleEl = document.getElementById('quiz-exp-title');
      const textEl = document.getElementById('quiz-exp-text');
      const pearlEl = document.getElementById('quiz-exp-pearl');

      if (titleEl) {
        titleEl.textContent = isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta';
        titleEl.className = `font-headline-sm text-lg font-bold ${isCorrect ? 'text-tertiary' : 'text-error'}`;
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

    store.recordQuizCompleted("Autoevaluación Clínica", correct, total, "Medicina General");

    const modal = document.getElementById('quiz-summary-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.getElementById('modal-score-pct').textContent = `${scorePct}%`;
      document.getElementById('modal-correct-count').textContent = `${correct} de ${total} preguntas acertadas`;
      
      const feedbackText = scorePct >= 80 ? '¡Excelente rendimiento clínico! Dominas los conceptos clave.' : scorePct >= 60 ? 'Buen avance. Tienes algunos temas por afianzar en el módulo de Repaso.' : 'Requiere refuerzo urgente. Te recomendamos revisar tus puntos débiles.';
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
        tabBtns.forEach(b => {
          b.classList.remove('border-primary', 'text-primary', 'font-bold');
          b.classList.add('border-transparent', 'text-secondary');
        });
        btn.classList.add('border-primary', 'text-primary', 'font-bold');
        btn.classList.remove('border-transparent', 'text-secondary');

        document.querySelectorAll('.case-tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`case-tab-${tab}`)?.classList.remove('hidden');
      });
    });

    // Selector de caso (Caso 1 o Caso 2)
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

    // Factores de riesgo / Antecedentes
    const antContainer = document.getElementById('case-antecedents');
    if (antContainer) {
      antContainer.innerHTML = '';
      c.patient.antecedents.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container-high text-on-surface-variant';
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
        labRow.className = `p-3 rounded-lg flex items-center justify-between gap-3 text-sm ${lab.alert ? 'bg-error-container/30 border border-error/30' : 'bg-surface-container-low'}`;
        labRow.innerHTML = `
          <div class="flex flex-col">
            <span class="font-semibold text-on-surface">${lab.name}</span>
            <span class="text-xs text-secondary">${lab.normal ? `Valor referencia: ${lab.normal}` : ''}</span>
          </div>
          <span class="font-bold ${lab.alert ? 'text-error' : 'text-primary'} text-right">${lab.value}</span>
        `;
        labsContainer.appendChild(labRow);
      });
    }

    // Etapas de toma de decisiones
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
        btn.className = 'w-full text-left p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container transition-all flex items-start gap-3 shadow-xs';
        btn.innerHTML = `
          <span class="w-7 h-7 rounded-md bg-surface-container text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
            ${opt.id}
          </span>
          <span class="text-sm font-medium text-on-surface leading-relaxed">${opt.text}</span>
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

      feedbackBox.className = `p-4 rounded-xl flex flex-col gap-2 ${isCorrect ? 'bg-tertiary-fixed/30 border border-tertiary text-on-surface' : 'bg-surface-container border border-primary text-on-surface'}`;
    }

    // Siguiente etapa o finalizar caso
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
          alert(`¡Felicitaciones! Has resuelto con éxito el ${currentCase.title}. Se ha registrado en tu progreso.`);
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
      card.className = 'p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md';
      card.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-error-container text-on-error-container">
              Tasa de Fallo: ${wp.errorRate}%
            </span>
            <span class="text-xs font-semibold text-secondary">${wp.specialty}</span>
          </div>
          <h3 class="font-headline-sm text-lg font-bold text-on-surface">${wp.topic}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">${wp.diagnostic}</p>
        </div>
        <div class="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 text-xs text-on-surface">
          <span class="material-symbols-outlined text-primary text-[18px] shrink-0">lightbulb</span>
          <div class="flex flex-col">
            <strong class="font-semibold text-primary">Acción de Alto Rendimiento:</strong>
            <span>${wp.highYieldAction}</span>
          </div>
        </div>
        <button type="button" class="start-targeted-review-btn w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm" data-specialty="${wp.specialty}">
          <span class="material-symbols-outlined text-[18px]">play_circle</span>
          <span>Iniciar Test de Refuerzo (${wp.specialty})</span>
        </button>
      `;

      card.querySelector('.start-targeted-review-btn').addEventListener('click', () => {
        // Filtrar preguntas de esa especialidad
        const filtered = QUIZ_QUESTIONS.filter(q => q.specialty === wp.specialty);
        this.resetQuizSession(filtered.length > 0 ? filtered : QUIZ_QUESTIONS);
        this.switchView('quiz');
      });

      container.appendChild(card);
    });

    // Flashcard interactiva de repaso rápido
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

    // Botones de preguntas rápidas preconfiguradas
    const quickPromptsContainer = document.getElementById('tutor-quick-prompts');
    if (quickPromptsContainer) {
      quickPromptsContainer.innerHTML = '';
      TUTOR_QUICK_PROMPTS.forEach(p => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left transition-all border border-outline-variant/30 flex flex-col gap-0.5 text-xs';
        pill.innerHTML = `
          <span class="font-bold text-primary">${p.title}</span>
          <span class="text-secondary truncate">${p.subtitle}</span>
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

      const bubbleColor = isUser ? 'bg-primary text-on-primary rounded-2xl rounded-tr-xs' : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-2xl rounded-tl-xs shadow-xs';

      msgDiv.innerHTML = `
        <div class="flex items-center gap-1.5 text-xs text-secondary px-1">
          <span>${isUser ? 'Dra. Sofía Rivas' : 'Tutor IA Médico'}</span>
          <span>•</span>
          <span>${msg.time}</span>
        </div>
        <div class="p-4 ${bubbleColor} text-sm sm:text-base leading-relaxed whitespace-pre-line">
          ${this.formatChatText(msg.text)}
        </div>
      `;

      container.appendChild(msgDiv);
    });

    container.scrollTop = container.scrollHeight;
  }

  formatChatText(text) {
    // Formatea negritas y listas con markdown básico
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/> (.*?)\n/g, '<blockquote class="border-l-4 border-primary pl-2 my-1 text-primary-fixed-variant">$1</blockquote>\n');
  }

  sendUserChatMessage(text) {
    store.addChatMessage('user', text);
    this.renderChatHistory();

    // Simular respuesta clínica inteligente pedagógica
    setTimeout(() => {
      const response = this.generateMedicalAIResponse(text);
      store.addChatMessage('ai', response);
      this.renderChatHistory();
    }, 600);
  }

  generateMedicalAIResponse(query) {
    const qLower = query.toLowerCase();

    if (qLower.includes('ieca') || qLower.includes('nefroprotecc')) {
      return `¡Gran pregunta, Sofía! Vamos a desglosar el mecanismo de los **IECA** de forma clara:

**1. Fisiopatología:**
- En la diabetes e hipertensión, la arteriola eferente del glomérulo se encuentra constreñida por la angiotensina II, aumentando la presión de filtración intraglomerular (hiperfiltración perjudicial).
- Los IECA (como Enalapril o Ramipril) inhiben la ECA, reduciendo la Angiotensina II y dilatando preferentemente la **arteriola eferente**.

**2. Beneficio Clínico:**
- Disminuyen la presión hidrostática intraglomerular, frenando la fuga de proteínas (reducción de microalbuminuria) y retrasando la fibrosis renal.

**3. Precaución Inmediata:**
- Puede presentarse un aumento fisiológico de creatinina de hasta un **20-30%** en las primeras 2 semanas; si supera el 30%, descartar estenosis bilateral de la arteria renal.

¿Quieres que te prepare una pregunta para evaluar este tema?`;
    }

    if (qLower.includes('nac') || qLower.includes('neumon')) {
      return `¡Hola! Aquí tienes la clave diferencial rápida para **Neumonía Adquirida en la Comunidad (NAC)**:

**Típica vs. Atípica:**
1. **Clínica**: Típica (Neumococo) = Fiebre en picos, escalofríos intensos, tos productiva y dolor pleurítico. Atípica (Mycoplasma/Chlamydia) = Comienzo gradual, tos seca irritativa, síntomas extrapulmonares.
2. **Radiografía**: Típica = Consolidación lobar focal con **broncograma aéreo**. Atípica = Infiltrado reticulonodular bilateral difuso.
3. **Escala CURB-65**: Evalúa Confusión, Urea >19 mg/dL, Respiración ≥30, Presión sistólica <90 o diastólica ≤60, y Edad ≥65 para definir si requiere ingreso hospitalario.`;
    }

    if (qLower.includes('fibrilaci') || qLower.includes('antiarr')) {
      return `En **Fibrilación Auricular (FA)**, la estrategia depende del perfil del paciente:

- **Control de Ritmo** (volver y mantener ritmo sinusal): Indicado en pacientes sintomáticos jóvenes, primer episodio de FA, o si la FA es desencadenante de insuficiencia cardíaca aguda. (Fármacos: Flecainida en corazón sano, Amiodarona si hay cardiopatía estructural).
- **Control de Frecuencia** (frecuencia cardíaca < 100-110 lpm en reposo): Estrategia preferida en ancianos asintomáticos o con FA de larga data. (Fármacos: Betabloqueadores como Metoprolol, o Calcioantagonistas no dihidropiridínicos como Diltiazem).

> **Recuerda**: La anticoagulación (según escala CHA₂DS₂-VASc) es independiente de si eliges control de ritmo o de frecuencia.`;
    }

    return `Entendido. He analizado tu consulta médica: "${query}".

**Puntos Clínicos Clave:**
1. **Abordaje Fisiopatológico**: En la evaluación de esta condición, el primer paso es jerarquizar los signos de alarma y constantes vitales (triage).
2. **Diagnóstico Diferencial**: Descartar siempre las patologías tiempo-dependientes de mayor morbimortalidad antes de confirmar diagnósticos secundarios.
3. **Pauta Terapéutica**: Priorizar medidas de soporte hemodinámico, estabilización de vía aérea y tratamiento farmacológico guiado por las guías de práctica clínica más recientes.

*(Nota académica: Este tutor es una herramienta de simulación y estudio para estudiantes de medicina y no debe utilizarse en pacientes reales).*

¿Deseas profundizar en la farmacología o en la presentación clínica de este tema?`;
  }
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.medpulseApp = new MedPulseApp();
});