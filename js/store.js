// store.js - Manejo del estado local (LocalStorage) y cálculos de rendimiento

import { INITIAL_USER, INITIAL_STATS, QUIZ_QUESTIONS, CLINICAL_CASES, WEAK_POINTS_RECOMMENDATIONS } from './data.js';

const STORAGE_KEY_USER = 'medpulse_user_v1';
const STORAGE_KEY_STATS = 'medpulse_stats_v1';
const STORAGE_KEY_TUTOR_CHAT = 'medpulse_chat_v1';

export class MedPulseStore {
  constructor() {
    this.user = this.load(STORAGE_KEY_USER, INITIAL_USER);
    this.stats = this.load(STORAGE_KEY_STATS, INITIAL_STATS);
    this.chat = this.load(STORAGE_KEY_TUTOR_CHAT, this.getDefaultChat());
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error loading key ${key} from localStorage:`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error saving key ${key} to localStorage:`, e);
    }
  }

  getUser() {
    return this.user;
  }

  getStats() {
    // Calculamos el porcentaje global dinámico
    const total = this.stats.totalAnswered || 0;
    const correct = this.stats.totalCorrect || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 1000) / 10 : 75;

    return {
      ...this.stats,
      accuracyGlobal: accuracy,
      totalIncorrect: Math.max(0, total - correct)
    };
  }

  recordQuizAnswer(question, chosenOptionId, isCorrect) {
    this.stats.totalAnswered += 1;
    if (isCorrect) {
      this.stats.totalCorrect += 1;
    }

    // Actualizar especialidad
    const spec = question.specialty || "Medicina General";
    if (!this.stats.specialties[spec]) {
      this.stats.specialties[spec] = { answered: 0, correct: 0 };
    }
    this.stats.specialties[spec].answered += 1;
    if (isCorrect) {
      this.stats.specialties[spec].correct += 1;
    }

    this.save(STORAGE_KEY_STATS, this.stats);
  }

  recordQuizCompleted(title, correct, total, specialty) {
    const scorePct = Math.round((correct / total) * 100);
    const newEntry = {
      id: Date.now(),
      title: title || `Test de ${specialty}`,
      date: "Reciente",
      score: `${scorePct}%`,
      correct: correct,
      total: total,
      tag: specialty
    };

    this.stats.history = [newEntry, ...this.stats.history.slice(0, 7)];
    this.save(STORAGE_KEY_STATS, this.stats);
  }

  recordCaseCompleted(caseId, scorePct) {
    this.stats.completedCases = Math.min(this.stats.targetCases, (this.stats.completedCases || 0) + 1);
    
    const newEntry = {
      id: Date.now(),
      title: `Simulador: ${caseId === 'caso-1' ? 'Síndrome Coronario Agudo' : 'Neumonía Grave Comunitaria'}`,
      date: "Reciente",
      score: `${scorePct}%`,
      correct: 3,
      total: 3,
      tag: "Casos Clínicos"
    };

    this.stats.history = [newEntry, ...this.stats.history.slice(0, 7)];
    this.save(STORAGE_KEY_STATS, this.stats);
  }

  getWeakPoints() {
    // Calcula puntos débiles analizando las especialidades con menor porcentaje de aciertos
    const specs = this.stats.specialties || {};
    const analyzed = [];

    for (const [name, data] of Object.entries(specs)) {
      if (data.answered > 0) {
        const errorPct = Math.round(((data.answered - data.correct) / data.answered) * 100);
        analyzed.push({
          specialty: name,
          errorRate: errorPct,
          answered: data.answered,
          correct: data.correct
        });
      }
    }

    analyzed.sort((a, b) => b.errorRate - a.errorRate);

    // Mapeamos a las recomendaciones detalladas
    return WEAK_POINTS_RECOMMENDATIONS.map(rec => {
      const match = analyzed.find(a => a.specialty === rec.specialty);
      return {
        ...rec,
        errorRate: match ? match.errorRate : rec.errorRate
      };
    });
  }

  getDefaultChat() {
    return [
      {
        id: "msg-1",
        sender: "user",
        time: "10:14 AM",
        text: "Hola Tutor, me cuesta recordar cómo diferenciar una Neumonía Adquirida en la Comunidad (NAC) típica de una atípica en cuanto a agentes etiológicos y hallazgos en la radiografía de tórax. ¿Podrías darme una tabla comparativa y una regla mnemotécnica?"
      },
      {
        id: "msg-2",
        sender: "ai",
        time: "10:14 AM",
        text: `¡Hola, Sofía! Con gusto. Esta diferenciación es clásica en el examen y en la práctica médica:

**1. Tabla Comparativa Rápida:**
- **NAC Típica**: Inicio brusco/agudo, fiebre alta con escalofríos, tos productiva con esputo purulento/herrumbroso, dolor pleurítico.
  - *Germen principal*: **Streptococcus pneumoniae** (Neumococo).
  - *Radiografía*: Consolidación lobar focal con **broncograma aéreo**.
- **NAC Atípica**: Inicio insidioso/progresivo, fiebre moderada sin escalofríos, tos seca persistente, cefalea y mialgias.
  - *Gérmenes*: **Mycoplasma pneumoniae**, *Chlamydia pneumoniae*, *Legionella*.
  - *Radiografía*: Infiltrados reticulares difusos o bilaterales ("la radiografía luce peor que el paciente").

**2. Mnemotecnia Clínica:**
> **"TÍPICO es Tozudo"**: **T**os con esputo, **I**nicio brusco, **P**atrón lobar en Rx, **C**alofrios intensos, **O**ído a la auscultación (soplo tubárico).

¿Te gustaría que te plantee una viñeta rápida de autoevaluación para poner a prueba este concepto?`
      }
    ];
  }

  getChatMessages() {
    return this.chat;
  }

  addChatMessage(sender, text) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: sender,
      time: timeStr,
      text: text
    };
    this.chat.push(newMsg);
    this.save(STORAGE_KEY_TUTOR_CHAT, this.chat);
    return newMsg;
  }

  resetAll() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_STATS);
    localStorage.removeItem(STORAGE_KEY_TUTOR_CHAT);
    this.user = { ...INITIAL_USER };
    this.stats = JSON.parse(JSON.stringify(INITIAL_STATS));
    this.chat = this.getDefaultChat();
  }
}

export const store = new MedPulseStore();
