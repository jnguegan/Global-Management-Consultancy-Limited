(function () {
  "use strict";

  const db = window.supabaseClient || window.sb || null;

  const EXAM_QUESTION_COUNT = 20;
  const EXAM_DURATION_MINUTES = 60;
  const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;
  const PASS_MARK_PERCENT = 75;
  const LANGUAGE_STORAGE_KEY = "mock_exam_lang";

  const state = {
    lang: localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en",
    questions: [],
    currentIndex: 0,
    answers: {},
    flagged: {},
    visited: {},
    startedAtMs: null,
    endsAtMs: null,
    timerInterval: null,
    remainingSeconds: EXAM_DURATION_SECONDS,
    attemptId: null,
    submitted: false,
    submitting: false
  };

  const i18n = {
    en: {
      pageTitle: "FIFA Football Agent Mock Exam",
      pageSubtitle: "20 questions • 60 minutes • Pass mark: 75%",
      loading: "Loading mock exam...",
      submitExam: "Submit Exam",
      submitConfirm: "Are you sure you want to submit your mock exam now?",
      questionOf: "Question {current} of {total}",
      flag: "⚑ Flag for review",
      flagged: "⚑ Flagged for review",
      previous: "Previous",
      next: "Next",
      referencesTitle: "Regulation references",
      paletteTitle: "Question Palette",
      current: "Current",
      answered: "Answered",
      unanswered: "Unanswered",
      flaggedLabel: "Flagged",
      resultTitle: "Mock Exam Result",
      score: "Score",
      percentage: "Percentage",
      timeSpent: "Time Spent",
      answeredTitle: "Answered",
      unansweredTitle: "Unanswered",
      flaggedTitle: "Flagged",
      pass: "PASS",
      fail: "FAIL",
      passMark: "Pass mark",
      autoSubmittedLead: "Your time expired and the exam was submitted automatically.",
      submittedLead: "Your exam has been submitted successfully.",
      resultSummary: "You answered {answered} out of {total} questions in {time}.",
      notEnoughQuestions: "Not enough questions found to start the mock exam. At least {count} questions are required.",
      supabaseMissing: "Supabase client not found. Please make sure window.supabaseClient is loaded before mock-exam.js.",
      genericError: "Something went wrong.",
      submitError: "There was a problem submitting the exam: {message}",
      startTitle: "Mock Exam Instructions",
      startInstructions:
        "Select your preferred language for this exam. Once you are ready, click Start Exam to load the questions and begin the timed mock exam. You will have 60 minutes to complete 20 questions. Your selected language will remain fixed for the entire exam.",
      startExam: "Start Exam",
      languageBadge: "Language: EN"
    },
    fr: {
      pageTitle: "Examen blanc d’agent de football FIFA",
      pageSubtitle: "20 questions • 60 minutes • Note de passage : 75%",
      loading: "Chargement de l’examen blanc...",
      submitExam: "Soumettre l’examen",
      submitConfirm: "Voulez-vous vraiment soumettre votre examen blanc maintenant ?",
      questionOf: "Question {current} sur {total}",
      flag: "⚑ Marquer pour révision",
      flagged: "⚑ Marquée pour révision",
      previous: "Précédent",
      next: "Suivant",
      referencesTitle: "Références réglementaires",
      paletteTitle: "Palette des questions",
      current: "Actuelle",
      answered: "Répondues",
      unanswered: "Sans réponse",
      flaggedLabel: "Marquées",
      resultTitle: "Résultat de l’examen blanc",
      score: "Score",
      percentage: "Pourcentage",
      timeSpent: "Temps utilisé",
      answeredTitle: "Répondues",
      unansweredTitle: "Sans réponse",
      flaggedTitle: "Marquées",
      pass: "ADMIS",
      fail: "ÉCHEC",
      passMark: "Note de passage",
      autoSubmittedLead: "Le temps est écoulé et l’examen a été soumis automatiquement.",
      submittedLead: "Votre examen a été soumis avec succès.",
      resultSummary: "Vous avez répondu à {answered} questions sur {total} en {time}.",
      notEnoughQuestions: "Nombre de questions insuffisant pour lancer l’examen blanc. Au moins {count} questions sont requises.",
      supabaseMissing: "Client Supabase introuvable. Vérifiez que window.supabaseClient est bien chargé avant mock-exam.js.",
      genericError: "Une erreur s’est produite.",
      submitError: "Un problème est survenu lors de la soumission de l’examen : {message}",
      startTitle: "Instructions de l’examen blanc",
      startInstructions:
        "Sélectionnez votre langue préférée pour cet examen. Lorsque vous êtes prêt, cliquez sur Commencer l’examen pour charger les questions et démarrer l’examen chronométré. Vous disposerez de 60 minutes pour répondre à 20 questions. La langue choisie restera fixe pendant toute la durée de l’examen.",
      startExam: "Commencer l’examen",
      languageBadge: "Langue : FR"
    },
    es: {
      pageTitle: "Examen simulacro de agente de fútbol FIFA",
      pageSubtitle: "20 preguntas • 60 minutos • Nota mínima para aprobar: 75%",
      loading: "Cargando examen simulacro...",
      submitExam: "Entregar examen",
      submitConfirm: "¿Seguro que deseas entregar tu examen simulacro ahora?",
      questionOf: "Pregunta {current} de {total}",
      flag: "⚑ Marcar para revisión",
      flagged: "⚑ Marcada para revisión",
      previous: "Anterior",
      next: "Siguiente",
      referencesTitle: "Referencias reglamentarias",
      paletteTitle: "Panel de preguntas",
      current: "Actual",
      answered: "Respondidas",
      unanswered: "Sin responder",
      flaggedLabel: "Marcadas",
      resultTitle: "Resultado del simulacro",
      score: "Puntuación",
      percentage: "Porcentaje",
      timeSpent: "Tiempo empleado",
      answeredTitle: "Respondidas",
      unansweredTitle: "Sin responder",
      flaggedTitle: "Marcadas",
      pass: "APROBADO",
      fail: "SUSPENSO",
      passMark: "Nota mínima",
      autoSubmittedLead: "El tiempo ha expirado y el examen se ha entregado automáticamente.",
      submittedLead: "Tu examen se ha entregado correctamente.",
      resultSummary: "Has respondido {answered} de {total} preguntas en {time}.",
      notEnoughQuestions: "No hay suficientes preguntas para iniciar el simulacro. Se requieren al menos {count} preguntas.",
      supabaseMissing: "No se encontró el cliente de Supabase. Asegúrate de que window.supabaseClient esté cargado antes de mock-exam.js.",
      genericError: "Ha ocurrido un error.",
      submitError: "Hubo un problema al entregar el examen: {message}",
      startTitle: "Instrucciones del examen simulacro",
      startInstructions:
        "Seleccione su idioma preferido para este examen. Cuando esté listo, haga clic en Comenzar examen para cargar las preguntas e iniciar el examen cronometrado. Dispondrá de 60 minutos para responder 20 preguntas. El idioma seleccionado permanecerá fijo durante todo el examen.",
      startExam: "Comenzar examen",
      languageBadge: "Idioma: ES"
    }
  };

  const el = {
    examTopbar: document.getElementById("examTopbar"),
    loadingState: document.getElementById("loadingState"),
    errorState: document.getElementById("errorState"),
    examLayout: document.getElementById("examLayout"),
    resultScreen: document.getElementById("resultScreen"),

    startScreen: document.getElementById("startScreen"),
    startTitle: document.getElementById("startTitle"),
    startInstructions: document.getElementById("startInstructions"),
    startExamBtn: document.getElementById("startExamBtn"),

    pageTitle: document.getElementById("pageTitle"),
    pageSubtitle: document.getElementById("pageSubtitle"),
    timer: document.getElementById("timer"),
    submitExamBtn: document.getElementById("submitExamBtn"),
    activeLanguageBadge: document.getElementById("activeLanguageBadge"),

    questionCounter: document.getElementById("questionCounter"),
    questionText: document.getElementById("questionText"),
    optionsContainer: document.getElementById("optionsContainer"),
    referencesSection: document.getElementById("referencesSection"),
    referencesTitle: document.getElementById("referencesTitle"),
    referencesList: document.getElementById("referencesList"),

    flagBtn: document.getElementById("flagBtn"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),

    paletteTitle: document.getElementById("paletteTitle"),
    legendCurrent: document.getElementById("legendCurrent"),
    legendAnswered: document.getElementById("legendAnswered"),
    legendFlagged: document.getElementById("legendFlagged"),
    legendUnanswered: document.getElementById("legendUnanswered"),

    paletteContainer: document.getElementById("paletteContainer"),
    answeredLabel: document.getElementById("answeredLabel"),
    unansweredLabel: document.getElementById("unansweredLabel"),
    flaggedLabel: document.getElementById("flaggedLabel"),
    answeredCount: document.getElementById("answeredCount"),
    unansweredCount: document.getElementById("unansweredCount"),
    flaggedCount: document.getElementById("flaggedCount"),

    resultTitle: document.getElementById("resultTitle"),
    resultLead: document.getElementById("resultLead"),
    resultStatus: document.getElementById("resultStatus"),
    scoreTitle: document.getElementById("scoreTitle"),
    percentageTitle: document.getElementById("percentageTitle"),
    timeSpentTitle: document.getElementById("timeSpentTitle"),
    answeredTitle: document.getElementById("answeredTitle"),
    unansweredTitle: document.getElementById("unansweredTitle"),
    flaggedTitle: document.getElementById("flaggedTitle"),
    resultScore: document.getElementById("resultScore"),
    resultPercentage: document.getElementById("resultPercentage"),
    resultTimeSpent: document.getElementById("resultTimeSpent"),
    resultAnswered: document.getElementById("resultAnswered"),
    resultUnanswered: document.getElementById("resultUnanswered"),
    resultFlagged: document.getElementById("resultFlagged")
  };

  document.addEventListener("DOMContentLoaded", initMockExam);

  function initMockExam() {
    bindEvents();
    bindStartScreenLanguage();
    applyStartScreenTranslations();
    setLoading(false);
    el.errorState.classList.add("hidden");
    el.examLayout.classList.add("hidden");
    el.resultScreen.classList.add("hidden");
    el.startScreen.classList.remove("hidden");
    el.examTopbar.classList.add("hidden");
  }

  function bindEvents() {
    el.prevBtn.addEventListener("click", goToPreviousQuestion);
    el.nextBtn.addEventListener("click", goToNextQuestion);
    el.flagBtn.addEventListener("click", toggleFlagForCurrentQuestion);
    el.submitExamBtn.addEventListener("click", handleManualSubmit);
    el.startExamBtn.addEventListener("click", startMockExam);
  }

  function bindStartScreenLanguage() {
    document.querySelectorAll("[data-start-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.startLang || "en";
        state.lang = lang;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

        document.querySelectorAll("[data-start-lang]").forEach((b) => {
          b.classList.remove("is-active");
        });

        btn.classList.add("is-active");
        applyStartScreenTranslations();
      });
    });

    const active = document.querySelector(`[data-start-lang="${state.lang}"]`);
    if (active) {
      active.classList.add("is-active");
    }
  }

  function applyStartScreenTranslations() {
    document.documentElement.lang = state.lang;
    el.startTitle.textContent = t("startTitle");
    el.startInstructions.textContent = t("startInstructions");
    el.startExamBtn.textContent = t("startExam");
    updateActiveLanguageBadge();
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang;
    el.pageTitle.textContent = t("pageTitle");
    el.pageSubtitle.textContent = t("pageSubtitle");
    el.loadingState.textContent = t("loading");
    el.submitExamBtn.textContent = t("submitExam");
    el.referencesTitle.textContent = t("referencesTitle");
    el.prevBtn.textContent = t("previous");
    el.nextBtn.textContent = t("next");
    el.paletteTitle.textContent = t("paletteTitle");
    el.legendCurrent.textContent = t("current");
    el.legendAnswered.textContent = t("answered");
    el.legendFlagged.textContent = t("flaggedLabel");
    el.legendUnanswered.textContent = t("unanswered");
    el.answeredLabel.textContent = `${t("answered")}:`;
    el.unansweredLabel.textContent = `${t("unanswered")}:`;
    el.flaggedLabel.textContent = `${t("flaggedLabel")}:`;
    el.resultTitle.textContent = t("resultTitle");
    el.scoreTitle.textContent = t("score");
    el.percentageTitle.textContent = t("percentage");
    el.timeSpentTitle.textContent = t("timeSpent");
    el.answeredTitle.textContent = t("answeredTitle");
    el.unansweredTitle.textContent = t("unansweredTitle");
    el.flaggedTitle.textContent = t("flaggedTitle");
    updateActiveLanguageBadge();
  }

  function updateActiveLanguageBadge() {
    el.activeLanguageBadge.textContent = t("languageBadge");
  }

  async function startMockExam() {
    if (!db) {
      showError(t("supabaseMissing"));
      return;
    }

    try {
      setLoading(true);
      el.errorState.classList.add("hidden");
      el.resultScreen.classList.add("hidden");
      el.startScreen.classList.add("hidden");
      el.examTopbar.classList.remove("hidden");

      applyStaticTranslations();

      const pool = await loadQuestionPool();

      if (!Array.isArray(pool) || pool.length < EXAM_QUESTION_COUNT) {
        showError(t("notEnoughQuestions", { count: EXAM_QUESTION_COUNT }));
        return;
      }

      state.questions = buildExamQuestions(pool);
      state.currentIndex = 0;
      state.answers = {};
      state.flagged = {};
      state.visited = {};
      state.submitted = false;
      state.submitting = false;
      state.remainingSeconds = EXAM_DURATION_SECONDS;
      state.startedAtMs = Date.now();
      state.endsAtMs = state.startedAtMs + EXAM_DURATION_SECONDS * 1000;

      state.questions.forEach((q) => {
        state.visited[q.id] = false;
      });

      state.attemptId = await createMockAttempt();

      renderPalette();
      renderCurrentQuestion();
      updateSidebarCounts();
      showExam();
      startTimer();
    } catch (error) {
      console.error("Mock exam start error:", error);
      showError(error.message || t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  async function loadQuestionPool() {
    const questions = await fetchQuestions();
    const questionIds = questions.map((q) => q.id);

    const [optionsRows, referenceRows] = await Promise.all([
      fetchOptions(questionIds),
      fetchReferences(questionIds)
    ]);

    const optionsByQuestionId = groupBy(optionsRows, "question_id");
    const referencesByQuestionId = groupBy(referenceRows, "question_id");

    return questions
      .map((question) => {
        const options = (optionsByQuestionId[question.id] || [])
          .map(normalizeOptionRow)
          .filter((opt) => !!getLocalizedOptionText(opt.raw || {}));

        const references = (referencesByQuestionId[question.id] || [])
          .map(normalizeReferenceRow)
          .filter((ref) => ref.label || ref.url);

        return {
          id: question.id,
          topicId: question.topic_id || null,
          raw: question,
          options,
          references
        };
      })
      .filter((q) => getLocalizedQuestionText(q.raw || "").trim() && q.options.length >= 4);
  }

  async function fetchQuestions() {
    const { data, error } = await db
      .from("questions")
      .select("*");

    if (error) {
      throw new Error(`Unable to load questions: ${error.message}`);
    }

    return Array.isArray(data) ? data : [];
  }

  async function fetchOptions(questionIds) {
    if (!questionIds.length) return [];

    const { data, error } = await db
      .from("question_options")
      .select("*")
      .in("question_id", questionIds);

    if (error) {
      throw new Error(`Unable to load question options: ${error.message}`);
    }

    return Array.isArray(data) ? data : [];
  }

  async function fetchReferences(questionIds) {
    if (!questionIds.length) return [];

    const { data, error } = await db
      .from("question_references")
      .select("*")
      .in("question_id", questionIds);

    if (error) {
      console.warn("Could not load question references:", error.message);
      return [];
    }

    return Array.isArray(data) ? data : [];
  }

  function buildExamQuestions(pool) {
    const selected = shuffleArray([...pool]).slice(0, EXAM_QUESTION_COUNT);

    return selected.map((question) => ({
      ...question,
      options: shuffleArray(
        [...question.options].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      )
    }));
  }

  function renderCurrentQuestion() {
    const question = getCurrentQuestion();
    if (!question) return;

    state.visited[question.id] = true;

    el.questionCounter.textContent = t("questionOf", {
      current: state.currentIndex + 1,
      total: state.questions.length
    });

    el.questionText.textContent = getLocalizedQuestionText(question.raw || {});
    renderOptions(question);
    renderReferences(question);
    renderFlagButton(question);
    renderNavButtons();
    renderPalette();
    updateSidebarCounts();
  }

  function renderOptions(question) {
    const selectedOptionId = state.answers[question.id] || null;
    el.optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "option";

      if (selectedOptionId === option.id) {
        optionButton.classList.add("is-selected");
      }

      optionButton.disabled = state.submitted;

      optionButton.addEventListener("click", () => {
        if (state.submitted) return;
        selectAnswer(question.id, option.id);
      });

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = optionLetter(index);

      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = getLocalizedOptionText(option.raw || {});

      optionButton.appendChild(letter);
      optionButton.appendChild(text);
      el.optionsContainer.appendChild(optionButton);
    });
  }

  function renderReferences(question) {
    const refs = Array.isArray(question.references) ? question.references : [];

    if (!refs.length) {
      el.referencesSection.classList.add("hidden");
      el.referencesList.innerHTML = "";
      return;
    }

    el.referencesList.innerHTML = "";

    refs.forEach((ref) => {
      const li = document.createElement("li");

      if (ref.url) {
        const a = document.createElement("a");
        a.href = ref.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = ref.label || ref.url;
        li.appendChild(a);
      } else {
        li.textContent = ref.label || "Reference";
      }

      el.referencesList.appendChild(li);
    });

    el.referencesSection.classList.remove("hidden");
  }

  function renderFlagButton(question) {
    const isFlagged = !!state.flagged[question.id];
    el.flagBtn.classList.toggle("is-active", isFlagged);
    el.flagBtn.textContent = isFlagged ? t("flagged") : t("flag");
    el.flagBtn.disabled = state.submitted;
  }

  function renderNavButtons() {
    el.prevBtn.disabled = state.submitted || state.currentIndex <= 0;
    el.nextBtn.disabled = state.submitted || state.currentIndex >= state.questions.length - 1;
  }

  function renderPalette() {
    el.paletteContainer.innerHTML = "";

    state.questions.forEach((question, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-btn";
      btn.textContent = String(index + 1);
      btn.disabled = state.submitted;

      const isCurrent = index === state.currentIndex;
      const isAnswered = !!state.answers[question.id];
      const isFlagged = !!state.flagged[question.id];

      if (isCurrent) btn.classList.add("is-current");
      if (isAnswered) btn.classList.add("is-answered");
      if (isFlagged) btn.classList.add("is-flagged");

      btn.addEventListener("click", () => {
        if (state.submitted) return;
        goToQuestion(index);
      });

      el.paletteContainer.appendChild(btn);
    });
  }

  function updateSidebarCounts() {
    const answered = countAnswered();
    const unanswered = state.questions.length - answered;
    const flagged = countFlagged();

    el.answeredCount.textContent = String(answered);
    el.unansweredCount.textContent = String(unanswered);
    el.flaggedCount.textContent = String(flagged);
  }

  function selectAnswer(questionId, optionId) {
    state.answers[questionId] = optionId;
    renderCurrentQuestion();
  }

  function toggleFlagForCurrentQuestion() {
    const question = getCurrentQuestion();
    if (!question || state.submitted) return;

    state.flagged[question.id] = !state.flagged[question.id];
    renderCurrentQuestion();
  }

  function goToPreviousQuestion() {
    if (state.submitted || state.currentIndex <= 0) return;
    goToQuestion(state.currentIndex - 1);
  }

  function goToNextQuestion() {
    if (state.submitted || state.currentIndex >= state.questions.length - 1) return;
    goToQuestion(state.currentIndex + 1);
  }

  function goToQuestion(index) {
    if (index < 0 || index >= state.questions.length) return;
    state.currentIndex = index;
    renderCurrentQuestion();
  }

  function startTimer() {
    stopTimer();
    updateTimerUI();

    state.timerInterval = window.setInterval(() => {
      const msLeft = state.endsAtMs - Date.now();
      const secondsLeft = Math.max(0, Math.ceil(msLeft / 1000));

      state.remainingSeconds = secondsLeft;
      updateTimerUI();

      if (secondsLeft <= 0) {
        stopTimer();
        submitMockExam({ autoSubmitted: true });
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      window.clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerUI() {
    const seconds = Math.max(0, state.remainingSeconds);
    el.timer.textContent = formatMinutesSeconds(seconds);
    el.timer.classList.remove("is-warning", "is-danger");

    if (seconds <= 300) {
      el.timer.classList.add("is-danger");
    } else if (seconds <= 900) {
      el.timer.classList.add("is-warning");
    }
  }

  async function handleManualSubmit() {
    if (state.submitted || state.submitting) return;

    const answered = countAnswered();
const unanswered = state.questions.length - answered;
const flagged = countFlagged();

if (unanswered > 0) {

  const review = window.confirm(
    `${t("submitConfirm")}\n\n` +
    `${t("answered")}: ${answered}\n` +
    `${t("unanswered")}: ${unanswered}\n` +
    `${t("flaggedLabel")}: ${flagged}\n\n` +
    `You still have unanswered questions.\n\n` +
    `Press OK to review them or Cancel to submit anyway.`
  );

  if (review) {
    const firstUnansweredIndex = state.questions.findIndex(q => !state.answers[q.id]);
    if (firstUnansweredIndex >= 0) {
      goToQuestion(firstUnansweredIndex);
      return;
    }
  }

} else {

  const confirmed = window.confirm(t("submitConfirm"));
  if (!confirmed) return;

}
    if (!confirmed) return;

    stopTimer();
    await submitMockExam({ autoSubmitted: false });
  }

  async function submitMockExam({ autoSubmitted }) {
    if (state.submitted || state.submitting) return;

    state.submitting = true;
    lockExamUI();

    try {
      const result = calculateResult();
      await saveAnswers(result.answerRows);
      await finalizeAttempt(result, autoSubmitted);

      state.submitted = true;
      showResultScreen(result, autoSubmitted);
    } catch (error) {
      console.error("Submit exam error:", error);
      alert(t("submitError", { message: error.message || "Unknown error" }));
      unlockExamUI();
    } finally {
      state.submitting = false;
    }
  }

  function calculateResult() {
    const total = state.questions.length;
    let score = 0;
    let answered = 0;

    const answerRows = state.questions.map((question) => {
      const selectedOptionId = state.answers[question.id] || null;
      const correctOption = question.options.find((opt) => opt.isCorrect) || null;
      const isCorrect = !!(selectedOptionId && correctOption && selectedOptionId === correctOption.id);

      if (selectedOptionId) answered += 1;
      if (isCorrect) score += 1;

      return {
        attempt_id: state.attemptId,
        question_id: question.id,
        selected_option_id: selectedOptionId,
        is_correct: isCorrect
      };
    });

    const unanswered = total - answered;
    const flagged = countFlagged();
    const elapsedSeconds = Math.min(
      EXAM_DURATION_SECONDS,
      Math.max(0, Math.round((Date.now() - state.startedAtMs) / 1000))
    );
    const percentage = total ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= PASS_MARK_PERCENT;

    return {
      total,
      score,
      percentage,
      passed,
      answered,
      unanswered,
      flagged,
      elapsedSeconds,
      answerRows
    };
  }

  async function createMockAttempt() {
    const startedAtIso = new Date().toISOString();

    const payloads = [
      {
        mode: "mock_exam",
        started_at: startedAtIso,
        total_questions: EXAM_QUESTION_COUNT,
        language: state.lang
      },
      {
        started_at: startedAtIso,
        total_questions: EXAM_QUESTION_COUNT,
        language: state.lang
      },
      {
        mode: "mock_exam",
        started_at: startedAtIso
      },
      {
        started_at: startedAtIso
      }
    ];

    for (const payload of payloads) {
      const { data, error } = await db
        .from("quiz_attempts")
        .insert(payload)
        .select()
        .single();

      if (!error && data && data.id) {
        return data.id;
      }
    }

    console.warn("Could not create quiz_attempts row. Mock exam will continue without attempt persistence.");
    return null;
  }

  async function saveAnswers(answerRows) {
    if (!state.attemptId || !Array.isArray(answerRows) || !answerRows.length) return;

    const fullRows = answerRows.map((row) => ({
      ...row,
      answered_at: new Date().toISOString()
    }));

    let response = await db.from("quiz_answers").insert(fullRows);
    if (!response.error) return;

    const reducedRows = answerRows.map((row) => ({
      attempt_id: row.attempt_id,
      question_id: row.question_id,
      selected_option_id: row.selected_option_id,
      is_correct: row.is_correct
    }));

    response = await db.from("quiz_answers").insert(reducedRows);
    if (!response.error) return;

    const minimalRows = answerRows.map((row) => ({
      attempt_id: row.attempt_id,
      question_id: row.question_id,
      selected_option_id: row.selected_option_id
    }));

    response = await db.from("quiz_answers").insert(minimalRows);
    if (response.error) {
      throw new Error(`Unable to save quiz answers: ${response.error.message}`);
    }
  }

  async function finalizeAttempt(result, autoSubmitted) {
    if (!state.attemptId) return;

    const completedAtIso = new Date().toISOString();

    const payloads = [
      {
        completed_at: completedAtIso,
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        answered_count: result.answered,
        unanswered_count: result.unanswered,
        flagged_count: result.flagged,
        time_spent_seconds: result.elapsedSeconds,
        submitted_at: completedAtIso,
        auto_submitted: autoSubmitted
      },
      {
        completed_at: completedAtIso,
        score: result.score,
        percentage: result.percentage,
        passed: result.passed
      },
      {
        completed_at: completedAtIso,
        score: result.score
      }
    ];

    for (const payload of payloads) {
      const { error } = await db
        .from("quiz_attempts")
        .update(payload)
        .eq("id", state.attemptId);

      if (!error) return;
    }

    console.warn("Could not fully finalize quiz_attempts row for attempt:", state.attemptId);
  }

  function showResultScreen(result, autoSubmitted) {
    hideExam();

    el.resultScore.textContent = `${result.score} / ${result.total}`;
    el.resultPercentage.textContent = `${result.percentage}%`;
    el.resultTimeSpent.textContent = formatMinutesSeconds(result.elapsedSeconds);
    el.resultAnswered.textContent = String(result.answered);
    el.resultUnanswered.textContent = String(result.unanswered);
    el.resultFlagged.textContent = String(result.flagged);

    const statusText = result.passed ? t("pass") : t("fail");
    el.resultStatus.textContent = `${statusText} • ${t("passMark")}: ${PASS_MARK_PERCENT}%`;
    el.resultStatus.className = `result-status ${result.passed ? "pass" : "fail"}`;

    const lead1 = autoSubmitted ? t("autoSubmittedLead") : t("submittedLead");
    const lead2 = t("resultSummary", {
      answered: result.answered,
      total: result.total,
      time: formatMinutesSeconds(result.elapsedSeconds)
    });

    el.resultLead.textContent = `${lead1} ${lead2}`;
    el.resultScreen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function lockExamUI() {
    el.submitExamBtn.disabled = true;
    el.prevBtn.disabled = true;
    el.nextBtn.disabled = true;
    el.flagBtn.disabled = true;
    Array.from(el.optionsContainer.querySelectorAll("button")).forEach((btn) => {
      btn.disabled = true;
    });
    Array.from(el.paletteContainer.querySelectorAll("button")).forEach((btn) => {
      btn.disabled = true;
    });
  }

  function unlockExamUI() {
    if (state.submitted) return;
    el.submitExamBtn.disabled = false;
    el.flagBtn.disabled = false;
    renderNavButtons();
    Array.from(el.optionsContainer.querySelectorAll("button")).forEach((btn) => {
      btn.disabled = false;
    });
    Array.from(el.paletteContainer.querySelectorAll("button")).forEach((btn) => {
      btn.disabled = false;
    });
  }

  function showExam() {
    el.examLayout.classList.remove("hidden");
    el.errorState.classList.add("hidden");
  }

  function hideExam() {
    el.examLayout.classList.add("hidden");
  }

  function setLoading(isLoading) {
    el.loadingState.classList.toggle("hidden", !isLoading);
  }

  function showError(message) {
    el.errorState.textContent = message || t("genericError");
    el.errorState.classList.remove("hidden");
    hideExam();
    setLoading(false);
  }

  function getCurrentQuestion() {
    return state.questions[state.currentIndex] || null;
  }

  function countAnswered() {
    return state.questions.reduce((count, question) => {
      return count + (state.answers[question.id] ? 1 : 0);
    }, 0);
  }

  function countFlagged() {
    return state.questions.reduce((count, question) => {
      return count + (state.flagged[question.id] ? 1 : 0);
    }, 0);
  }

  function getLocalizedQuestionText(row) {
    if (state.lang === "fr") {
      return (row.question_text_fr || row.question_text_en || "").trim();
    }
    if (state.lang === "es") {
      return (row.question_text_es || row.question_text_en || "").trim();
    }
    return (row.question_text_en || "").trim();
  }

  function getLocalizedOptionText(row) {
    if (state.lang === "fr") {
      return (row.option_text_fr || row.option_text_en || "").trim();
    }
    if (state.lang === "es") {
      return (row.option_text_es || row.option_text_en || "").trim();
    }
    return (row.option_text_en || "").trim();
  }

  function getLocalizedReferenceLabel(row) {
    return getLocalizedValue(row, [
      `article_ref_${state.lang}`,
      `reference_${state.lang}`,
      `title_${state.lang}`,
      `label_${state.lang}`,
      `text_${state.lang}`,
      "article_ref",
      "reference",
      "title",
      "label",
      "text"
    ]) || "Reference";
  }

  function getLocalizedValue(row, keys) {
    for (const key of keys) {
      if (typeof row[key] === "string" && row[key].trim()) {
        return row[key].trim();
      }
    }
    return "";
  }

  function normalizeOptionRow(row) {
    return {
      id: row.id,
      questionId: row.question_id,
      raw: row,
      isCorrect: !!row.is_correct,
      sortOrder: Number(row.sort_order || 0)
    };
  }

  function normalizeReferenceRow(row) {
    return {
      id: row.id,
      questionId: row.question_id,
      label: getLocalizedReferenceLabel(row),
      url: (row.url || row.link || row.href || "").trim()
    };
  }

  function groupBy(rows, key) {
    return (rows || []).reduce((acc, row) => {
      const value = row[key];
      if (!acc[value]) acc[value] = [];
      acc[value].push(row);
      return acc;
    }, {});
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function optionLetter(index) {
    return ["A", "B", "C", "D", "E", "F"][index] || String(index + 1);
  }

  function formatMinutesSeconds(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function t(key, vars) {
    const dict = i18n[state.lang] || i18n.en;
    let value = dict[key] || i18n.en[key] || key;

    if (vars && typeof value === "string") {
      Object.keys(vars).forEach((varKey) => {
        value = value.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(vars[varKey]));
      });
    }

    return value;
  }
})();
