
const db =
  window.supabaseClient ||
  window.sb ||
  null;

if (!db) {
  console.error("Supabase client not found. Check supabase-client.js");
}

const state = {
  lang: localStorage.getItem("lang") || "en",
  mode: "practice", // practice | mock
  topicSlug: null,
  topic: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  attemptId: null,
  startedAt: null,
  submitted: false,
  canSaveAttempt: false,

  timeLimitMinutes: 60,
  remainingSeconds: 60 * 60,
  timerInterval: null,

  answersByQuestionId: {},
  flaggedQuestionIds: new Set()
};

const el = {
  timer: document.getElementById("timer"),
  questionCounter: document.getElementById("questionCounter"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  referencesContainer: document.getElementById("referencesContainer"),
  palette: document.getElementById("palette"),
  prevBtn: document.getElementById("prevBtn"),
  flagBtn: document.getElementById("flagBtn"),
  nextBtn: document.getElementById("nextBtn"),
  submitBtn: document.getElementById("submitBtn"),
  resultScreen: document.getElementById("resultScreen")
};

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) acc[value] = [];
    acc[value].push(item);
    return acc;
  }, {});
}

function getTextByLang(item, base) {
  return item[`${base}_${state.lang}`] || item[`${base}_en`] || "";
}

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function parseMode() {
  const params = getQueryParams();
  const mode = params.get("mode");
  const topic = params.get("topic");

  if (mode === "mock") {
    state.mode = "mock";
  } else {
    state.mode = "practice";
  }

  state.topicSlug = topic || null;
}

async function createAttempt() {
  if (!db) return;

  const payload = {
    mode: state.mode,
    is_mock: state.mode === "mock",
    started_at: new Date().toISOString(),
    time_limit_minutes: state.mode === "mock" ? state.timeLimitMinutes : null
  };

  if (state.topicSlug) payload.topic_slug = state.topicSlug;

  const { data, error } = await db
    .from("quiz_attempts")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.warn("Could not create attempt:", error.message);
    return;
  }

  state.attemptId = data.id;
  state.canSaveAttempt = true;
}

async function fetchMockQuestionPool() {
  const { data, error } = await db
    .from("questions")
    .select(`
      id,
      topic_id,
      question_text_en,
      question_text_fr,
      question_text_es,
      question_type,
      difficulty,
      explanation_en,
      explanation_fr,
      explanation_es,
      is_active,
      source_article,
      source_page,
      source_note
    `)
    .eq("is_active", true)
    .in("question_type", ["standard", "scenario", "calculation", "multi_article"]);

  if (error) throw error;
  return data || [];
}

function pickWeightedMockQuestions(pool, counts = { easy: 12, medium: 20, hard: 8 }) {
  const easy = shuffleArray(pool.filter(q => q.difficulty === "easy"));
  const medium = shuffleArray(pool.filter(q => q.difficulty === "medium"));
  const hard = shuffleArray(pool.filter(q => q.difficulty === "hard"));

  let selected = [
    ...easy.slice(0, counts.easy),
    ...medium.slice(0, counts.medium),
    ...hard.slice(0, counts.hard)
  ];

  if (selected.length < 40) {
    const selectedIds = new Set(selected.map(q => q.id));
    const extra = shuffleArray(pool.filter(q => !selectedIds.has(q.id)));
    selected = [...selected, ...extra.slice(0, 40 - selected.length)];
  }

  return shuffleArray(selected).slice(0, 40);
}

async function fetchPracticeQuestions(topicSlug) {
  const { data: topic, error: topicError } = await db
    .from("topics")
    .select("id, slug, title_en, title_fr, title_es")
    .eq("slug", topicSlug)
    .single();

  if (topicError) throw topicError;

  state.topic = topic;

  const { data: questions, error } = await db
    .from("questions")
    .select(`
      id,
      topic_id,
      question_text_en,
      question_text_fr,
      question_text_es,
      question_type,
      difficulty,
      explanation_en,
      explanation_fr,
      explanation_es,
      is_active,
      source_article,
      source_page,
      source_note
    `)
    .eq("topic_id", topic.id)
    .eq("is_active", true);

  if (error) throw error;
  return questions || [];
}

async function fetchOptionsForQuestions(questionIds) {
  const { data, error } = await db
    .from("question_options")
    .select(`
      id,
      question_id,
      option_text_en,
      option_text_fr,
      option_text_es,
      is_correct,
      sort_order
    `)
    .in("question_id", questionIds);

  if (error) throw error;
  return data || [];
}

async function fetchReferencesForQuestions(questionIds) {
  const { data, error } = await db
    .from("question_references")
    .select(`
      id,
      question_id,
      reference_label,
      reference_article,
      reference_page,
      reference_title,
      reference_preview_en,
      reference_preview_fr,
      reference_preview_es
    `)
    .in("question_id", questionIds);

  if (error) throw error;
  return data || [];
}

async function loadQuestions() {
  let selected = [];

  if (state.mode === "mock") {
    const pool = await fetchMockQuestionPool();
    selected = pickWeightedMockQuestions(pool, {
      easy: 12,
      medium: 20,
      hard: 8
    });
  } else {
    const practicePool = await fetchPracticeQuestions(state.topicSlug);
    selected = shuffleArray(practicePool);
  }

  const questionIds = selected.map(q => q.id);

  const [options, references] = await Promise.all([
    fetchOptionsForQuestions(questionIds),
    fetchReferencesForQuestions(questionIds)
  ]);

  const optionsByQuestionId = groupBy(options, "question_id");
  const refsByQuestionId = groupBy(references, "question_id");

  state.questions = selected.map(q => {
    const orderedOptions = (optionsByQuestionId[q.id] || []).sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );

    return {
      ...q,
      options: shuffleArray(orderedOptions),
      references: refsByQuestionId[q.id] || []
    };
  });

  state.startedAt = Date.now();
}

function renderTimer() {
  if (!el.timer) return;

  if (state.mode === "mock") {
    el.timer.textContent = `Time remaining: ${formatTime(state.remainingSeconds)}`;
  } else {
    el.timer.textContent = "";
  }
}

function startMockTimer() {
  if (state.mode !== "mock") return;

  clearInterval(state.timerInterval);

  renderTimer();

  state.timerInterval = setInterval(() => {
    state.remainingSeconds -= 1;
    renderTimer();

    if (state.remainingSeconds <= 0) {
      clearInterval(state.timerInterval);
      submitExam(true);
    }
  }, 1000);
}

function getCurrentQuestion() {
  return state.questions[state.currentIndex];
}

function getSavedAnswer(questionId) {
  return state.answersByQuestionId[questionId] || null;
}

function renderQuestion() {
  const q = getCurrentQuestion();
  if (!q) return;

  if (el.questionCounter) {
    el.questionCounter.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  }

  if (el.questionText) {
    el.questionText.textContent = getTextByLang(q, "question_text");
  }

  if (el.optionsContainer) {
    el.optionsContainer.innerHTML = "";
    const savedOptionId = getSavedAnswer(q.id);

    q.options.forEach((opt, index) => {
      const wrapper = document.createElement("label");
      wrapper.className = "quiz-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${q.id}`;
      input.value = opt.id;
      input.checked = String(savedOptionId) === String(opt.id);

      input.addEventListener("change", () => {
        saveAnswerLocally(q.id, opt.id);
      });

      const text = document.createElement("span");
      const letter = ["A", "B", "C", "D"][index] || "";
      text.textContent = `${letter}. ${getTextByLang(opt, "option_text")}`;

      wrapper.appendChild(input);
      wrapper.appendChild(text);
      el.optionsContainer.appendChild(wrapper);
    });
  }

  renderReferences(q);
  renderPalette();
  renderFlagButton();
  renderNavButtons();
}

function renderReferences(question) {
  if (!el.referencesContainer) return;

  el.referencesContainer.innerHTML = "";

  (question.references || []).forEach(ref => {
    const item = document.createElement("div");
    item.className = "question-reference";

    const preview = getTextByLang(ref, "reference_preview");

    item.innerHTML = `
      <strong>${ref.reference_label || ""}</strong>
      ${ref.reference_article ? ` - ${ref.reference_article}` : ""}
      ${ref.reference_title ? ` - ${ref.reference_title}` : ""}
      ${ref.reference_page ? ` (p. ${ref.reference_page})` : ""}
      ${preview ? `<div class="reference-preview">${preview}</div>` : ""}
    `;

    el.referencesContainer.appendChild(item);
  });
}

function saveAnswerLocally(questionId, optionId) {
  state.answersByQuestionId[questionId] = optionId;
  renderPalette();

  if (state.canSaveAttempt) {
    saveAnswerToSupabase(questionId, optionId).catch(err => {
      console.warn("Could not save answer:", err.message);
    });
  }
}

async function saveAnswerToSupabase(questionId, optionId) {
  if (!state.attemptId) return;

  const question = state.questions.find(q => q.id === questionId);
  const chosenOption = question?.options?.find(opt => String(opt.id) === String(optionId));

  await db.from("quiz_answers").upsert({
    attempt_id: state.attemptId,
    question_id: questionId,
    selected_option_id: optionId,
    flagged: state.flaggedQuestionIds.has(questionId),
    marked_for_review: state.flaggedQuestionIds.has(questionId),
    answered_at: new Date().toISOString(),
    is_correct: chosenOption ? !!chosenOption.is_correct : null
  }, {
    onConflict: "attempt_id,question_id"
  });
}

function toggleFlag() {
  const q = getCurrentQuestion();
  if (!q) return;

  if (state.flaggedQuestionIds.has(q.id)) {
    state.flaggedQuestionIds.delete(q.id);
  } else {
    state.flaggedQuestionIds.add(q.id);
  }

  renderFlagButton();
  renderPalette();

  if (state.canSaveAttempt) {
    const selectedOptionId = state.answersByQuestionId[q.id] || null;
    saveAnswerToSupabase(q.id, selectedOptionId).catch(err => {
      console.warn("Could not save flag:", err.message);
    });
  }
}

function renderFlagButton() {
  if (!el.flagBtn) return;
  const q = getCurrentQuestion();
  if (!q) return;

  el.flagBtn.textContent = state.flaggedQuestionIds.has(q.id)
    ? "Unflag"
    : "Flag for review";
}

function renderNavButtons() {
  if (el.prevBtn) el.prevBtn.disabled = state.currentIndex === 0;
  if (el.nextBtn) el.nextBtn.disabled = state.currentIndex === state.questions.length - 1;
}

function renderPalette() {
  if (!el.palette) return;

  el.palette.innerHTML = "";

  state.questions.forEach((q, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = index + 1;
    btn.className = "palette-btn";

    const answered = !!state.answersByQuestionId[q.id];
    const flagged = state.flaggedQuestionIds.has(q.id);
    const current = index === state.currentIndex;

    if (answered) btn.classList.add("answered");
    if (flagged) btn.classList.add("flagged");
    if (current) btn.classList.add("current");

    btn.addEventListener("click", () => {
      state.currentIndex = index;
      renderQuestion();
    });

    el.palette.appendChild(btn);
  });
}

function goNext() {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
  }
}

function goPrev() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
  }
}

function calculateScore() {
  let correct = 0;

  state.questions.forEach(question => {
    const selectedOptionId = state.answersByQuestionId[question.id];
    const correctOption = question.options.find(opt => opt.is_correct);

    if (
      selectedOptionId &&
      correctOption &&
      String(selectedOptionId) === String(correctOption.id)
    ) {
      correct += 1;
    }
  });

  return correct;
}

function getUnansweredCount() {
  return state.questions.filter(q => !state.answersByQuestionId[q.id]).length;
}

function getFlaggedCount() {
  return state.questions.filter(q => state.flaggedQuestionIds.has(q.id)).length;
}

async function submitExam(autoSubmitted = false) {
  if (state.submitted) return;

  state.submitted = true;
  clearInterval(state.timerInterval);

  state.score = calculateScore();

  const totalQuestions = state.questions.length;
  const unansweredCount = getUnansweredCount();
  const flaggedCount = getFlaggedCount();
  const answeredCount = totalQuestions - unansweredCount;
  const percentageScore = totalQuestions
    ? Number(((state.score / totalQuestions) * 100).toFixed(2))
    : 0;

  const timeSpentSeconds = state.mode === "mock"
    ? (state.timeLimitMinutes * 60 - state.remainingSeconds)
    : Math.floor((Date.now() - state.startedAt) / 1000);

  if (state.attemptId) {
    try {
      await db
        .from("quiz_attempts")
        .update({
          submitted_at: new Date().toISOString(),
          total_questions: totalQuestions,
          correct_answers: state.score,
          unanswered_count: unansweredCount,
          flagged_count: flaggedCount,
          time_limit_minutes: state.mode === "mock" ? state.timeLimitMinutes : null,
          time_spent_seconds: timeSpentSeconds,
          auto_submitted: autoSubmitted,
          percentage_score: percentageScore
        })
        .eq("id", state.attemptId);
    } catch (err) {
      console.warn("Could not update attempt:", err.message);
    }
  }

  renderResults({
    totalQuestions,
    answeredCount,
    unansweredCount,
    flaggedCount,
    percentageScore,
    autoSubmitted,
    timeSpentSeconds
  });
}

function renderResults(stats) {
  if (!el.resultScreen) return;

  const passMark = 75;
  const passed = stats.percentageScore >= passMark;

  el.resultScreen.hidden = false;
  el.resultScreen.innerHTML = `
    <h2>Mock Exam Result</h2>
    <p><strong>Score:</strong> ${state.score} / ${stats.totalQuestions}</p>
    <p><strong>Percentage:</strong> ${stats.percentageScore}%</p>
    <p><strong>Status:</strong> ${passed ? "Pass" : "Fail"}</p>
    <p><strong>Answered:</strong> ${stats.answeredCount}</p>
    <p><strong>Unanswered:</strong> ${stats.unansweredCount}</p>
    <p><strong>Flagged:</strong> ${stats.flaggedCount}</p>
    <p><strong>Time spent:</strong> ${formatTime(stats.timeSpentSeconds)}</p>
    <p><strong>Submission type:</strong> ${stats.autoSubmitted ? "Auto-submitted on time expiry" : "Submitted by user"}</p>
  `;

  if (el.questionText) el.questionText.innerHTML = "";
  if (el.optionsContainer) el.optionsContainer.innerHTML = "";
  if (el.referencesContainer) el.referencesContainer.innerHTML = "";
  if (el.palette) el.palette.innerHTML = "";

  if (el.prevBtn) el.prevBtn.disabled = true;
  if (el.nextBtn) el.nextBtn.disabled = true;
  if (el.flagBtn) el.flagBtn.disabled = true;
  if (el.submitBtn) el.submitBtn.disabled = true;
}

function attachEvents() {
  if (el.prevBtn) {
    el.prevBtn.addEventListener("click", goPrev);
  }

  if (el.nextBtn) {
    el.nextBtn.addEventListener("click", goNext);
  }

  if (el.flagBtn) {
    el.flagBtn.addEventListener("click", toggleFlag);
  }

  if (el.submitBtn) {
    el.submitBtn.addEventListener("click", () => {
      const unanswered = getUnansweredCount();
      const proceed = window.confirm(
        unanswered > 0
          ? `You still have ${unanswered} unanswered question(s). Submit anyway?`
          : "Submit exam now?"
      );

      if (proceed) {
        submitExam(false);
      }
    });
  }
}

async function initQuiz() {
  try {
    parseMode();
    attachEvents();
    await createAttempt();
    await loadQuestions();

    if (state.mode === "mock") {
      startMockTimer();
    }

    renderQuestion();
  } catch (error) {
    console.error("Quiz init failed:", error);
    if (el.questionText) {
      el.questionText.textContent = "Failed to load quiz.";
    }
  }
}

document.addEventListener("DOMContentLoaded", initQuiz);
