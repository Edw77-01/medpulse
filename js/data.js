// data.js - Banco de preguntas, casos clínicos y datos iniciales de MedPulse

export const INITIAL_USER = {
  name: "Dra. Sofía Rivas",
  role: "Internado Rotatorio / 5to Año",
  streak: 14,
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
  lastActive: new Date().toISOString()
};

export const INITIAL_STATS = {
  totalAnswered: 24,
  totalCorrect: 19,
  completedCases: 3,
  targetCases: 5,
  streakDays: 14,
  specialties: {
    "Farmacología": { answered: 10, correct: 6 },
    "Cardiología": { answered: 8, correct: 7 },
    "Neumología": { answered: 6, correct: 6 },
    "Pediatría": { answered: 5, correct: 4 },
    "Medicina Interna": { answered: 7, correct: 5 }
  },
  history: [
    { id: 1, title: "Test de Farmacología Cardiovascular", date: "Hoy, 10:30", score: "70%", correct: 7, total: 10, tag: "Farmacología" },
    { id: 2, title: "Caso Clínico: Síndrome Coronario Agudo", date: "Ayer, 16:15", score: "100%", correct: 3, total: 3, tag: "Cardiología" },
    { id: 3, title: "Autoevaluación de Neumología Infecciosa", date: "Hace 2 días", score: "100%", correct: 5, total: 5, tag: "Neumología" }
  ]
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    specialty: "Farmacología",
    subtopic: "Antiarrítmicos y Hemodinámica",
    vignette: "Un paciente de 62 años con fibrilación auricular paroxística consulta por mareos y palpitaciones. En el ECG se evidencia flutter auricular con conducción variable. Si se decide iniciar un fármaco del Grupo IC de Vaughan-Williams, ¿cuál de los siguientes es el mecanismo farmacológico predominante?",
    options: [
      { id: "A", text: "Bloqueo potente de los canales de sodio rápidos (Fase 0) con disociación lenta." },
      { id: "B", text: "Prolongación del potencial de acción y bloqueo primario de canales de potasio (Fase 3)." },
      { id: "C", text: "Bloqueo selectivo de los receptores beta-1 adrenérgicos con efecto cronotrópico negativo." },
      { id: "D", text: "Inhibición de la corriente marcapasos If en el nódulo sinoauricular." }
    ],
    correctAnswer: "A",
    explanation: {
      correct: "Los antiarrítmicos de clase IC (como la flecainida y propafenona) son los bloqueadores más potentes de los canales de sodio dependientes de voltaje (Nav1.5, Fase 0). Tienen una cinética de disociación muy lenta, lo que produce un ensanchamiento marcado del QRS sin alargar significativamente el intervalo QT.",
      distractors: {
        "B": "Corresponde a la Clase III de Vaughan-Williams (amiodarona, sotalol).",
        "C": "Corresponde a la Clase II (betabloqueadores como metoprolol, atenolol).",
        "D": "Corresponde a la ivabradina, un fármaco inhibidor de los canales If utilizado en insuficiencia cardíaca y angina estable."
      },
      pearl: "Regla clínica: Nunca usar clase IC en cardiopatía isquémica o deterioro de FEVI por alto riesgo proarrítmico (Ensayo CAST)."
    }
  },
  {
    id: 2,
    specialty: "Cardiología",
    subtopic: "Síndrome Coronario Agudo",
    vignette: "Hombre de 54 años acude al servicio de urgencias por dolor precordial opresivo de 50 minutos de evolución, irradiado a mandíbula y diaforesis profusa. El ECG muestra elevación del segmento ST de 3 mm en derivaciones II, III y aVF con imagen recíproca en I y aVL. ¿Cuál es la arteria coronaria comprometida con mayor probabilidad?",
    options: [
      { id: "A", text: "Arteria coronaria derecha (ACD)" },
      { id: "B", text: "Arteria descendente anterior (ADA)" },
      { id: "C", text: "Arteria circunfleja izquierda (ACx)" },
      { id: "D", text: "Arteria marginal obtusa izquierda" }
    ],
    correctAnswer: "A",
    explanation: {
      correct: "Las derivaciones II, III y aVF exploran la cara inferior del ventrículo izquierdo. En más del 85-90% de los individuos (dominancia derecha), la cara inferior y la arteria descendente posterior son irrigadas por la Arteria Coronaria Derecha (ACD).",
      distractors: {
        "B": "La arteria descendente anterior irriga la cara anteroseptal (V1-V4).",
        "C": "La arteria circunfleja irriga la cara lateral alta y baja (I, aVL, V5, V6).",
        "D": "Las ramas marginales obtusas irrigan la pared posterolateral libre."
      },
      pearl: "En todo infarto de cara inferior, siempre solicitar derivaciones derechas (V3R-V4R) para descartar extensión a ventrículo derecho antes de administrar nitratos o diuréticos."
    }
  },
  {
    id: 3,
    specialty: "Neumología",
    subtopic: "Infecciones Respiratorias Bajas",
    vignette: "Mujer de 34 años previamente sana consulta por fiebre alta, escalofríos intensos, tos con expectoración herrumbrosa y dolor torácico de tipo pleurítico de 48 horas de evolución. A la auscultación presenta soplo tubárico y crepitantes focales en hemitórax derecho. ¿Cuál es el patógeno causante más frecuente de este cuadro?",
    options: [
      { id: "A", text: "Streptococcus pneumoniae (Neumococo)" },
      { id: "B", text: "Mycoplasma pneumoniae" },
      { id: "C", text: "Legionella pneumophila" },
      { id: "D", text: "Pseudomonas aeruginosa" }
    ],
    correctAnswer: "A",
    explanation: {
      correct: "Streptococcus pneumoniae continúa siendo la causa bacteriana más común de Neumonía Adquirida en la Comunidad (NAC) típica. La presentación hiperaguda con fiebre alta, dolor pleurítico, expectoración herrumbrosa y consolidación lobar con soplo tubárico es el cuadro patognomónico clásico.",
      distractors: {
        "B": "Mycoplasma causa neumonía atípica, con comienzo gradual, tos seca e infiltrados intersticiales.",
        "C": "Legionella suele asociar diarrea acuosa, hiponatremia y alteración de enzimas hepáticas.",
        "D": "Pseudomonas es común en bronquiectasias, fibrosis quística o estancia en UCI, no en adultos sanos de la comunidad."
      },
      pearl: "Tratamiento ambulatorio de elección en pacientes sin comorbilidades: Amoxicilina a dosis altas (1g c/8h) o azitromicina según el perfil de resistencia local."
    }
  },
  {
    id: 4,
    specialty: "Farmacología",
    subtopic: "Antihipertensivos y Nefroprotección",
    vignette: "Paciente de 58 años con antecedente de diabetes mellitus tipo 2 e hipertensión arterial acude a control. En los análisis se objetiva creatinina de 1.1 mg/dL y un cociente albúmina/creatinina en orina de 220 mg/g (microalbuminuria persistente). ¿Cuál de los siguientes grupos de fármacos es la primera línea recomendada para frenar la progresión del daño renal?",
    options: [
      { id: "A", text: "Inhibidores del Sistema Renina-Angiotensina (IECA o ARA-II)" },
      { id: "B", text: "Calcioantagonistas dihidropiridínicos de acción rápida" },
      { id: "C", text: "Betabloqueadores no selectivos" },
      { id: "D", text: "Diuréticos de asa a dosis elevadas" }
    ],
    correctAnswer: "A",
    explanation: {
      correct: "Los IECA (ej. enalapril, ramipril) o ARA-II (ej. losartán, valsartán) dilatan preferentemente la arteriola eferente glomerular, reduciendo la presión intraglomerular y disminuyendo significativamente la proteinuria y la velocidad de progresión a nefropatía diabética terminal.",
      distractors: {
        "B": "Los calcioantagonistas dihidropiridínicos dilatan la arteriola aferente y no reducen la presión intraglomerular con la misma eficacia nefroprotectora.",
        "C": "Los betabloqueadores no han demostrado reducir la microalbuminuria y pueden enmascarar síntomas de hipoglucemia en diabéticos.",
        "D": "Los diuréticos de asa se reservan para sobrecarga hídrica en filtrados glomerulares muy disminuidos."
      },
      pearl: "Vigilar que el ascenso de creatinina no supere el 30% tras iniciar IECA/ARA-II y controlar los niveles séricos de potasio (riesgo de hiperpotasemia)."
    }
  },
  {
    id: 5,
    specialty: "Pediatría",
    subtopic: "Urgencias Pediátricas",
    vignette: "Lactante de 18 meses acude traído por sus padres por dificultad respiratoria y tos perruna metálica iniciada súbitamente en la madrugada. Al examen físico se aprecia estridor inspiratorio en reposo y tiraje subcostal moderado. Presenta un puntaje de Westley de 5 (Crup moderado). ¿Cuál es la conducta terapéutica prioritaria?",
    options: [
      { id: "A", text: "Dexametasona oral o intramuscular en dosis única (0.15 a 0.6 mg/kg)" },
      { id: "B", text: "Antibioticoterapia intravenosa inmediata con ceftriaxona" },
      { id: "C", text: "Sedación y broncodilatadores en nebulización continua con salbutamol" },
      { id: "D", text: "Antihistamínicos orales y expectorantes" }
    ],
    correctAnswer: "A",
    explanation: {
      correct: "En la laringotraqueítis aguda (crup), los corticoides (especialmente la dexametasona oral o parenteral en dosis de 0.15 a 0.6 mg/kg) constituyen la piedra angular del tratamiento, reduciendo el edema de la vía aérea subglótica y la necesidad de hospitalización.",
      distractors: {
        "B": "El crup es de etiología viral (virus parainfluenza tipo 1 en >70% de casos); los antibióticos no están indicados.",
        "C": "El salbutamol actúa sobre receptores beta-2 del árbol bronquial inferior, no alivia el edema laríngeo subglótico.",
        "D": "Los antihistamínicos no tienen ningún beneficio comprobado y resecan las secreciones."
      },
      pearl: "Si hay estridor en reposo con distrés severo, administrar además micronebulización con Adrenalina racémica o corriente (L-adrenalina) con efecto vasoconstrictor local inmediato."
    }
  }
];

export const CLINICAL_CASES = [
  {
    id: "caso-1",
    title: "Dolor precordial agudo en paciente de 58 años",
    specialty: "Cardiología & Urgencias",
    difficulty: "Intermedio",
    patient: {
      name: "Carlos Mendoza",
      age: "58 años",
      sex: "Masculino",
      occupation: "Conductor de transporte interurbano",
      triage: "Prioridad I (Emergencia)",
      antecedents: [
        "Hipertensión Arterial Grado 2 (mal controlada)",
        "Fumador activo (30 paquetes/año)",
        "Diabetes Mellitus tipo 2 (HbA1c 8.9%)",
        "Dislipidemia mixta sin tratamiento farmacológico"
      ]
    },
    vitals: {
      bp: "165/95 mmHg",
      bpStatus: "Crisis hipertensiva Fase 2",
      hr: "104 lpm",
      hrStatus: "Taquicardia sinusal",
      spo2: "93%",
      spo2Status: "Aire ambiente",
      rr: "22 rpm",
      rrStatus: "Taquipnea leve",
      temp: "36.8 °C",
      tempStatus: "Afebril"
    },
    anamnesis: "Paciente masculino de 58 años que acude a emergencias tras presentar dolor retroesternal opresivo de intensidad 9/10 iniciado hace 75 minutos mientras miraba televisión. Refiere que el dolor se irradia a cuello, mandíbula y cara interna de brazo izquierdo. Se acompaña de sudoración fría profusa, náuseas sin vómitos y disnea. No ha mejorado tras reposo ni tras tomar un antiácido en casa.",
    exam: "Paciente angustiado, diaforético y pálido. Cuello sin ingurgitación yugular a 45°. Auscultación cardíaca: R1 y R2 taquicárdicos, sin soplos audibles; presencia de 4to ruido cardíaco (R4). Auscultación pulmonar: murmullo vesicular presente bilateral, escasos crepitantes bibasales finos. Abdomen blando, indoloro. Pulsos periféricos simétricos y llenado capilar en 2 segundos.",
    labs: [
      { name: "Troponina I de alta sensibilidad", value: "840 ng/L", normal: "< 14 ng/L", alert: true },
      { name: "CK-MB", value: "48 U/L", normal: "< 25 U/L", alert: true },
      { name: "ECG 12 derivaciones", value: "Elevación del segmento ST de 3.5 mm en DII, DIII y aVF con infradesnivel recíproco en I y aVL.", alert: true },
      { name: "Glucemia capilar", value: "198 mg/dL", normal: "70-100 mg/dL", alert: true },
      { name: "Creatinina sérica", value: "1.05 mg/dL", normal: "0.7 - 1.2 mg/dL", alert: false }
    ],
    stages: [
      {
        questionNumber: 1,
        title: "Diagnóstico Clínico Inicial",
        prompt: "¿Cuál es el diagnóstico más certero y la arteria más probablemente comprometida?",
        options: [
          { id: "A", text: "Infarto Agudo de Miocardio con elevación del ST (IAMCEST) de cara inferior por oclusión de la Arteria Coronaria Derecha (ACD)." },
          { id: "B", text: "Pericarditis aguda viral con elevación difusa del segmento ST." },
          { id: "C", text: "Disección aórtica tipo B de Stanford con afectación de arterias subclavias." },
          { id: "D", text: "Angina inestable de alto riesgo sin evidencia de necrosis miocárdica." }
        ],
        correctAnswer: "A",
        feedback: "¡Excelente razonamiento clínico! La elevación del ST en DII, DIII y aVF junto con troponina marcadamente elevada confirma un IAMCEST inferior. En la anatomía coronaria habitual, la coronaria derecha es la responsable en casi el 90% de los casos."
      },
      {
        questionNumber: 2,
        title: "Paso de Seguridad Inmediato",
        prompt: "Antes de administrar nitratos o vasodilatadores en este paciente, ¿qué conducta diagnóstica es OBLIGATORIA?",
        options: [
          { id: "A", text: "Realizar derivaciones electrocardiográficas derechas (V3R y V4R) para descartar extensión a ventrículo derecho." },
          { id: "B", text: "Solicitar una tomografía torácica computarizada con contraste inmediatamente." },
          { id: "C", text: "Administrar 500 ml de bolo de suero salino al 3%." },
          { id: "D", text: "Indicar intubación orotraqueal de secuencia rápida por taquipnea." }
        ],
        correctAnswer: "A",
        feedback: "¡Regla de oro! Los infartos de cara inferior tienen hasta un 30-40% de compromiso de ventrículo derecho. Si administras nitroglicerina a un paciente con infarto de ventrículo derecho, provocarás una caída brusca de la precarga y un shock cardiogénico severo."
      },
      {
        questionNumber: 3,
        title: "Estrategia de Reperfusión y Terapéutica",
        prompt: "El centro cuenta con sala de hemodinámica disponible con tiempo puerta-balón estimado de 45 minutos. ¿Cuál es el tratamiento definitivo de elección?",
        options: [
          { id: "A", text: "Angioplastia coronaria transluminal primaria (ACTP) con implante de stent farmacológico + doble antiagregación y heparina." },
          { id: "B", text: "Fibrinólisis farmacológica intravenosa con tenecteplasa inmediata." },
          { id: "C", text: "Observación en sala general con reposo absoluto y nitroglicerina sublingual." },
          { id: "D", text: "Cirugía de revascularización coronaria de urgencia sin cateterismo previo." }
        ],
        correctAnswer: "A",
        feedback: "¡Perfecto! La angioplastia primaria es el estándar de oro si el tiempo estimado hasta el balón es menor a 120 minutos desde el primer contacto médico. Acompañada de dosis de carga de aspirina más un inhibidor P2Y12 (ticagrelor o prasugrel)."
      }
    ]
  },
  {
    id: "caso-2",
    title: "Neumonía Comunitaria y Dificultad Respiratoria",
    specialty: "Neumología & Medicina Interna",
    difficulty: "Fundamental",
    patient: {
      name: "Teresa Valdés",
      age: "67 años",
      sex: "Femenino",
      occupation: "Jubilada",
      triage: "Prioridad II (Urgencia)",
      antecedents: [
        "EPOC moderada (tratamiento con broncodilatador inhalado)",
        "Osteoporosis senil",
        "No fumadora desde hace 10 años"
      ]
    },
    vitals: {
      bp: "115/70 mmHg",
      bpStatus: "Normotensa",
      hr: "108 lpm",
      hrStatus: "Taquicardia compensatoria",
      spo2: "88%",
      spo2Status: "Hipoxemia moderada en aire ambiente",
      rr: "28 rpm",
      rrStatus: "Taquipnea evidente",
      temp: "38.6 °C",
      tempStatus: "Febril"
    },
    anamnesis: "Paciente femenina de 67 años acude por cuadro de 3 días caracterizado por fiebre de 38.6°C, escalofríos, tos productiva con esputo purulento verdoso y dolor torácico en hemitórax derecho que empeora con las inspiraciones profundas. Su familiar refiere aumento del trabajo respiratorio desde hoy por la mañana y desorientación temporal leve en casa.",
    exam: "Taquipneica con uso de musculatura accesoria. Examen de tórax: matidez a la percusión en base derecha, incremento de vibraciones vocales, auscultación con soplo tubárico y estertores crepitantes abundantes en lóbulo inferior derecho.",
    labs: [
      { name: "Leucocitos", value: "17,800 /mm³ (88% Neutrófilos)", normal: "4,500 - 10,000", alert: true },
      { name: "Proteína C Reactiva (PCR)", value: "142 mg/L", normal: "< 5 mg/L", alert: true },
      { name: "Radiografía de tórax", value: "Consolidación alveolar lobar derecha con broncograma aéreo nítido.", alert: true },
      { name: "Nitrógeno Ureico en Sangre (BUN)", value: "24 mg/dL", normal: "7 - 20 mg/dL", alert: true },
      { name: "Gasometría arterial (FiO2 21%)", value: "PaO2 58 mmHg, PaCO2 32 mmHg, pH 7.45", alert: true }
    ],
    stages: [
      {
        questionNumber: 1,
        title: "Estratificación de Gravedad (Escala CURB-65)",
        prompt: "Al evaluar la escala CURB-65 (Confusión, Urea >19 mg/dL, Respiración ≥30 rpm, Presión arterial sistólica <90 o diastólica ≤60, Edad ≥65): ¿Cuál es la puntuación y el destino asistencial recomendado?",
        options: [
          { id: "A", text: "CURB-65 de 3 puntos (Confusión, Urea/BUN elevado, Edad ≥65). Indicación de hospitalización inmediata (evaluar UCI)." },
          { id: "B", text: "CURB-65 de 0 puntos. Tratamiento domiciliario por vía oral." },
          { id: "C", text: "CURB-65 de 1 punto. Manejo ambulatorio supervisado." },
          { id: "D", text: "No es aplicable por tener antecedente de EPOC." }
        ],
        correctAnswer: "A",
        feedback: "¡Exacto! Puntos positivos: C (Confusión temporal), U (BUN > 20), E (Edad 67 ≥ 65) = 3 puntos. Puntuación de 3 o más define una neumonía grave que requiere hospitalización obligatoria y estrecha vigilancia de posible requerimiento de UCI."
      },
      {
        questionNumber: 2,
        title: "Manejo Terapéutico Inicial",
        prompt: "¿Cuál es el esquema antibiótico empírico de primera línea recomendado para esta paciente hospitalizada en planta?",
        options: [
          { id: "A", text: "Ceftriaxona IV + Macrólido (Azitromicina o Claritromicina) o Monoterapia con Levofloxacino respiratorio." },
          { id: "B", text: "Amoxicilina oral 500 mg cada 8 horas en monoterapia ambulatoria." },
          { id: "C", text: "Vancomicina + Meropenem + Colistina a dosis máximas." },
          { id: "D", text: "Corticoides inhalados exclusivamente sin antibióticos." }
        ],
        correctAnswer: "A",
        feedback: "¡Correcto! En neumonía adquirida en la comunidad hospitalizada en sala general, la combinación de un betalactámico IV de amplio espectro (Ceftriaxona o Cefotaxima) más un macrólido cubre tanto bacterias típicas (S. pneumoniae, H. influenzae) como microorganismos atípicos (Legionella, Mycoplasma)."
      }
    ]
  }
];

export const WEAK_POINTS_RECOMMENDATIONS = [
  {
    topic: "Farmacología Antiarrítmica",
    specialty: "Farmacología",
    errorRate: 40,
    diagnostic: "Dificultades recurrentes diferenciando los efectos de la Clase IC vs Clase III en el potencial de acción celular cardíaco.",
    highYieldAction: "Repasar la clasificación de Vaughan-Williams y su impacto en la Fase 0 y Fase 3.",
    sampleQuestionIds: [1, 4]
  },
  {
    topic: "Estratificación de Urgencias Cardiovasculares",
    specialty: "Cardiología",
    errorRate: 35,
    diagnostic: "Confusión frecuente en la identificación de contraindicaciones de nitratos en infartos con sospecha de cara inferior y VD.",
    highYieldAction: "Recordar la solicitud obligatoria de V3R-V4R ante elevación del ST en DII, DIII y aVF.",
    sampleQuestionIds: [2]
  },
  {
    topic: "Criterios de Hospitalización en Infecciones Respiratorias",
    specialty: "Neumología",
    errorRate: 25,
    diagnostic: "Dominio adecuado, pero se requiere memorizar los puntos de corte exactos del CURB-65 y PSI.",
    highYieldAction: "Realizar mnemotecnias activas para Confusión, Urea, Respiración, Presión y Edad ≥65.",
    sampleQuestionIds: [3]
  }
];

export const TUTOR_QUICK_PROMPTS = [
  {
    title: "Diferencia NAC típica vs atípica",
    subtitle: "Clínica, patógenos y radiología",
    query: "¿Cuál es la diferencia clínica, etiológica y radiológica entre una neumonía adquirida en la comunidad típica y una atípica? Dame una tabla y una mnemotecnia."
  },
  {
    title: "Mecanismo de acción de los IECA",
    subtitle: "Fisiopatología renal y cardiovascular",
    query: "Explícame de forma didáctica el mecanismo de acción de los IECA y por qué son nefroprotectores en diabéticos."
  },
  {
    title: "Algoritmo de Fibrilación Auricular",
    subtitle: "Control de ritmo vs frecuencia",
    query: "¿Cuándo se prefiere controlar el ritmo y cuándo la frecuencia cardíaca en un paciente con fibrilación auricular?"
  },
  {
    title: "Pregunta rápida tipo MIR/USMLE",
    subtitle: "Ponte a prueba con una viñeta",
    query: "Genérame una viñeta clínica de pediatría con 4 opciones de respuesta para evaluar mis conocimientos en patologías respiratorias."
  }
];
