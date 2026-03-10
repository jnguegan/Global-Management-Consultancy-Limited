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
  topicsById: {},
  questions: [],
  currentIndex: 0,
  score: 0,
  attemptId: null,
  startedAt: null,
  submitted: false,
  canSaveAttempt: false,

  // mock exam
  timeLimitMinutes: 60,
  remainingSeconds: 60 * 60,
  timerInterval: null,
  answersByQuestionId: {},
  flaggedQuestionIds: new Set(),

  // practice mode
  practiceResultsByQuestionId: {}
};

const el = {
  loader: document.getElementById("loader"),
  quizContent: document.getElementById("quizContent"),
  quizCard: document.getElementById("quizCard"),

  topicBadge: document.getElementById("topicBadge"),
  quizHeading: document.getElementById("quizHeading"),
  quizSubheading: document.getElementById("quizSubheading"),

  timer: document.getElementById("timer"),
  questionCounter: document.getElementById("questionCounter"),

  questionBlock: document.getElementById("questionBlock"),
  questionNumber: document.getElementById("questionNumber"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  referencesContainer: document.getElementById("referencesContainer"),

  feedbackBox: document.getElementById("feedbackBox"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),

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

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function parseMode() {
  const params = getQueryParams();
  const mode = params.get("mode");
  const topic = params.get("topic");

  state.mode = mode === "mock" ? "mock" : "practice";
  state.topicSlug = topic || null;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isCorrectOption(opt) {
  return opt?.is_correct === true || opt?.is_correct === 1 || opt?.is_correct === "true";
}

function getTextByLang(item, base) {
  if (!item) return "";

  const langKey = `${base}_${state.lang}`;
  const enKey = `${base}_en`;

  if (item[langKey]) return item[langKey];
  if (item[enKey]) return item[enKey];
  if (item[base]) return item[base];

  return "";
}

function getQuestionText(question) {
  return (
    getTextByLang(question, "question_text") ||
    getTextByLang(question, "text") ||
    question.question ||
    ""
  );
}

function getOptionText(option) {
  return (
    getTextByLang(option, "option_text") ||
    getTextByLang(option, "text") ||
    option.label ||
    ""
  );
}

function getTopicTitle(topic) {
  return (
    getTextByLang(topic, "title") ||
    getTextByLang(topic, "name") ||
    topic?.slug ||
    "Quiz"
  );
}

function getExplanationText(question) {
  return (
    getTextByLang(question, "explanation") ||
    getTextByLang(question, "feedback") ||
    ""
  );
}

function showLoader(show) {
  if (el.loader) {
    el.loader.style.display = show ? "block" : "none";
  }
  if (el.quizContent) {
    el.quizContent.classList.toggle("hidden", show);
  }
}

function setElementVisible(element, visible, displayValue = "") {
  if (!element) return;
  element.style.display = visible ? displayValue : "none";
}

function updateModeUI() {
  const isMock = state.mode === "mock";

  if (el.submitBtn) {
    el.submitBtn.textContent = isMock ? "Submit Exam" : "Submit answer";
  }

  if (el.nextBtn) {
    el.nextBtn.textContent = "Next question";
  }

  setElementVisible(el.timer?.parentElement || el.timer, isMock);
  setElementVisible(el.palette, isMock);
  setElementVisible(el.flagBtn, isMock, "inline-flex");

  if (!isMock) {
    renderTimer();
  }
}

async function createAttempt() {
  state.attemptId = null;
  state.canSaveAttempt = false;
  return;
}

async function fetchAllTopicsMap() {
  try {
    const { data, error } = await db
      .from("topics")
      .select("*");

    if (error) throw error;

    const map = {};
    (data || []).forEach((topic) => {
      map[topic.id] = topic;
    });
    state.topicsById = map;
  } catch (error) {
    console.warn("Could not load topics map:", error.message);
    state.topicsById = {};
  }
}

async function fetchPracticeQuestions(topicSlug) {
  const { data: topic, error: topicError } = await db
    .from("topics")
    .select("*")
    .eq("slug", topicSlug)
    .single();

  if (topicError) throw topicError;

  state.topic = topic;
  state.topicsById = { [topic.id]: topic };

  const { data: questions, error } = await db
    .from("questions")
    .select("*")
    .eq("topic_id", topic.id)
    .order("id", { ascending: true });

  if (error) throw error;

  const activeQuestions = (questions || []).filter((q) => q.is_active !== false);

  console.log("Practice topic slug:", topicSlug);
  console.log("Practice topic:", topic);
  console.log("Practice questions found:", activeQuestions.length, activeQuestions);

  return activeQuestions;
}

async function fetchMockQuestionPool() {
  await fetchAllTopicsMap();

  const { data, error } = await db
    .from("questions")
    .select("*");

  if (error) throw error;

  return (data || []).filter((q) => q.is_active !== false);
}

async function fetchOptionsForQuestions(questionIds) {
  if (!questionIds.length) return [];

  const { data, error } = await db
    .from("question_options")
    .select("*")
    .in("question_id", questionIds);

  if (error) throw error;
  return data || [];
}

async function fetchReferencesForQuestions(questionIds) {
  if (!questionIds.length) return [];

  try {
    const { data, error } = await db
      .from("question_references")
      .select("*")
      .in("question_id", questionIds);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Could not load references:", error.message);
    return [];
  }
}

async function loadQuestions() {
  let selected = [];

  if (state.mode === "mock") {
    const pool = await fetchMockQuestionPool();
    selected = shuffleArray(pool).slice(0, 40);
  } else {
    const practicePool = await fetchPracticeQuestions(state.topicSlug);
    selected = shuffleArray(practicePool);

    if (selected.length > 20) {
      selected = selected.slice(0, 20);
    }

    console.log("Practice selected questions:", selected.length, selected);
  }

  const questionIds = selected.map((q) => q.id);

  const [options, references] = await Promise.all([
    fetchOptionsForQuestions(questionIds),
    fetchReferencesForQuestions(questionIds)
  ]);

  const optionsByQuestionId = groupBy(options, "question_id");
  const refsByQuestionId = groupBy(references, "question_id");

  state.questions = selected.map((q) => {
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

function getCorrectOption(question) {
  return (question.options || []).find(isCorrectOption) || null;
}

function renderHeader() {
  if (!el.topicBadge || !el.quizHeading || !el.quizSubheading) return;

  if (state.mode === "mock") {
    el.topicBadge.textContent = "Mock Exam";
    el.quizHeading.textContent = "FIFA Football Agent Mock Exam";
    el.quizSubheading.textContent = "Timed exam mode. No instant feedback. Review flagged questions before submitting.";
    return;
  }

  const title = getTopicTitle(state.topic);
  el.topicBadge.textContent = title;
  el.quizHeading.textContent = title;
  el.quizSubheading.textContent = "Answer each question and track your score live.";
}

function renderFeedback({ title = "", text = "", show = false, isCorrect = null }) {
  if (!el.feedbackBox || !el.feedbackTitle || !el.feedbackText) return;

  if (!show) {
    el.feedbackBox.style.display = "none";
    el.feedbackTitle.textContent = "";
    el.feedbackText.textContent = "";
    el.feedbackBox.classList.remove("correct", "incorrect");
    return;
  }

  el.feedbackBox.style.display = "block";
  el.feedbackTitle.textContent = title;
  el.feedbackText.textContent = text;

  el.feedbackBox.classList.remove("correct", "incorrect");
  if (isCorrect === true) el.feedbackBox.classList.add("correct");
  if (isCorrect === false) el.feedbackBox.classList.add("incorrect");
}

function renderReferences(question) {
  if (!el.referencesContainer) return;

  el.referencesContainer.innerHTML = "";

  (question.references || []).forEach((ref) => {
    const item = document.createElement("div");
    item.className = "question-reference";

    const preview =
      getTextByLang(ref, "reference_preview") ||
      ref.reference_preview ||
      "";

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

function renderFlagButton() {
  if (!el.flagBtn) return;

  if (state.mode !== "mock") {
    el.flagBtn.style.display = "none";
    return;
  }

  el.flagBtn.style.display = "";
  const q = getCurrentQuestion();
  if (!q) return;

  el.flagBtn.textContent = state.flaggedQuestionIds.has(q.id)
    ? "Unflag question"
    : "Flag question";
}

function renderPalette() {
  if (!el.palette) return;

  if (state.mode !== "mock") {
    el.palette.innerHTML = "";
    el.palette.style.display = "none";
    return;
  }

  el.palette.style.display = "";
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

function renderNavButtons() {
  if (el.prevBtn) {
    if (state.mode === "mock") {
      el.prevBtn.style.display = "";
      el.prevBtn.disabled = state.currentIndex === 0;
    } else {
      el.prevBtn.style.display = "none";
    }
  }

  if (el.nextBtn) {
    if (state.mode === "mock") {
      el.nextBtn.disabled = state.currentIndex === state.questions.length - 1;
    } else {
      const q = getCurrentQuestion();
      const result = q ? state.practiceResultsByQuestionId[q.id] : null;
      el.nextBtn.disabled = !result?.submitted;
      el.nextBtn.textContent =
        state.currentIndex === state.questions.length - 1
          ? "View results"
          : "Next question";
    }
  }
}

function renderQuestion() {
  const q = getCurrentQuestion();
  if (!q) return;

  renderHeader();

  if (el.questionCounter) {
    el.questionCounter.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  }

  if (el.questionNumber) {
    el.questionNumber.textContent = `Question ${state.currentIndex + 1}`;
  }

  if (el.questionText) {
    el.questionText.textContent = getQuestionText(q);
  }

  if (el.optionsContainer) {
    el.optionsContainer.innerHTML = "";
    const savedOptionId = getSavedAnswer(q.id);
    const practiceResult = state.practiceResultsByQuestionId[q.id];
    const disableInputs = state.mode === "practice" && practiceResult?.submitted;

    (q.options || []).forEach((opt, index) => {
      const wrapper = document.createElement("label");
      wrapper.className = "quiz-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${q.id}`;
      input.value = opt.id;
      input.checked = String(savedOptionId) === String(opt.id);
      input.disabled = disableInputs;

      input.addEventListener("change", () => {
        saveAnswerLocally(q.id, opt.id);
      });

      const text = document.createElement("span");
      const letter = ["A", "B", "C", "D"][index] || "";
      text.textContent = `${letter}. ${getOptionText(opt)}`;

      wrapper.appendChild(input);
      wrapper.appendChild(text);
      el.optionsContainer.appendChild(wrapper);
    });
  }

  if (state.mode === "practice") {
    const result = state.practiceResultsByQuestionId[q.id];

    if (result?.submitted) {
      renderFeedback({
        title: result.correct ? "Correct" : "Incorrect",
        text: result.feedbackText || "",
        show: true,
        isCorrect: result.correct
      });
    } else {
      renderFeedback({ show: false });
    }
  } else {
    renderFeedback({ show: false });
  }

  renderReferences(q);
  renderPalette();
  renderFlagButton();
  renderNavButtons();
  renderTimer();
}

function saveAnswerLocally(questionId, optionId) {
  state.answersByQuestionId[questionId] = optionId;
  renderPalette();

  if (state.mode === "mock") {
    renderNavButtons();
  }
}

function toggleFlag() {
  if (state.mode !== "mock") return;

  const q = getCurrentQuestion();
  if (!q) return;

  if (state.flaggedQuestionIds.has(q.id)) {
    state.flaggedQuestionIds.delete(q.id);
  } else {
    state.flaggedQuestionIds.add(q.id);
  }

  renderFlagButton();
  renderPalette();
}

function goNext() {
  if (state.mode === "practice") {
    const isLast = state.currentIndex === state.questions.length - 1;
    if (isLast) {
      submitPracticeResults();
      return;
    }
  }

  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
  }
}

function goPrev() {
  if (state.mode !== "mock") return;

  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
  }
}

function submitPracticeAnswer() {
  const q = getCurrentQuestion();
  if (!q) return;

  if (state.practiceResultsByQuestionId[q.id]?.submitted) {
    return;
  }

  const selectedOptionId = state.answersByQuestionId[q.id];
  if (!selectedOptionId) {
    window.alert("Please select an answer first.");
    return;
  }

  const correctOption = getCorrectOption(q);
  const isCorrect =
    !!selectedOptionId &&
    !!correctOption &&
    String(selectedOptionId) === String(correctOption.id);

  if (isCorrect) {
    state.score += 1;
  }

  const explanation = getExplanationText(q);
  const feedbackText = explanation || (
    isCorrect
      ? "Well done. That is the correct answer."
      : "That is not correct. Review the regulation reference and explanation."
  );

  state.practiceResultsByQuestionId[q.id] = {
    submitted: true,
    correct: isCorrect,
    feedbackText
  };

  renderQuestion();
}

function calculateScore() {
  let correct = 0;

  state.questions.forEach((question) => {
    const selectedOptionId = state.answersByQuestionId[question.id];
    const correctOption = getCorrectOption(question);

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
  return state.questions.filter((q) => !state.answersByQuestionId[q.id]).length;
}

function getFlaggedCount() {
  return state.questions.filter((q) => state.flaggedQuestionIds.has(q.id)).length;
}

function calculateWeakTopics() {
  const topicStats = {};

  state.questions.forEach((question) => {
    const topicId = question.topic_id;
    const selectedOptionId = state.answersByQuestionId[question.id];
    const correctOption = getCorrectOption(question);

    const isCorrect =
      selectedOptionId &&
      correctOption &&
      String(selectedOptionId) === String(correctOption.id);

    if (!topicStats[topicId]) {
      topicStats[topicId] = {
        topicId,
        title: getTopicTitle(state.topicsById[topicId] || {}),
        total: 0,
        correct: 0,
        wrong: 0
      };
    }

    topicStats[topicId].total += 1;

    if (isCorrect) {
      topicStats[topicId].correct += 1;
    } else {
      topicStats[topicId].wrong += 1;
    }
  });

  return Object.values(topicStats).sort((a, b) => b.wrong - a.wrong);
}

function renderResultsScreen(html) {
  if (!el.resultScreen) return;

  el.resultScreen.hidden = false;
  el.resultScreen.innerHTML = html;
}

function disableQuizInteraction() {
  if (el.questionText) el.questionText.innerHTML = "";
  if (el.optionsContainer) el.optionsContainer.innerHTML = "";
  if (el.referencesContainer) el.referencesContainer.innerHTML = "";
  if (el.palette) el.palette.innerHTML = "";

  if (el.prevBtn) el.prevBtn.disabled = true;
  if (el.nextBtn) el.nextBtn.disabled = true;
  if (el.flagBtn) el.flagBtn.disabled = true;
  if (el.submitBtn) el.submitBtn.disabled = true;
}

function submitPracticeResults() {
  if (state.submitted) return;

  state.submitted = true;

  const totalQuestions = state.questions.length;
  const answeredCount = Object.values(state.practiceResultsByQuestionId).filter((r) => r.submitted).length;
  const percentageScore = totalQuestions
    ? Number(((state.score / totalQuestions) * 100).toFixed(2))
    : 0;

  renderResultsScreen(`
    <div class="result-card">
      <h2>Practice Quiz Result</h2>
      <p><strong>Score:</strong> ${state.score} / ${totalQuestions}</p>
      <p><strong>Percentage:</strong> ${percentageScore}%</p>
      <p><strong>Answered:</strong> ${answeredCount}</p>
      <p><strong>Topic:</strong> ${getTopicTitle(state.topic)}</p>
    </div>
  `);

  disableQuizInteraction();
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

  const passMark = 75;
  const passed = percentageScore >= passMark;
  const weakTopics = calculateWeakTopics();

  const weakTopicsHtml = weakTopics.length
    ? weakTopics.map((t) => `
        <p><strong>${t.title || `Topic ${t.topicId}`}</strong> — Correct: ${t.correct}/${t.total}, Wrong: ${t.wrong}</p>
      `).join("")
    : "<p>No topic data available.</p>";

  renderResultsScreen(`
    <div class="result-card">
      <h2>Mock Exam Result</h2>
      <p><strong>Score:</strong> ${state.score} / ${totalQuestions}</p>
      <p><strong>Percentage:</strong> ${percentageScore}%</p>
      <p><strong>Status:</strong> ${passed ? "Pass" : "Fail"}</p>
      <p><strong>Answered:</strong> ${answeredCount}</p>
      <p><strong>Unanswered:</strong> ${unansweredCount}</p>
      <p><strong>Flagged:</strong> ${flaggedCount}</p>
      <p><strong>Time spent:</strong> ${formatTime(timeSpentSeconds)}</p>
      <p><strong>Submission type:</strong> ${autoSubmitted ? "Auto-submitted on time expiry" : "Submitted by user"}</p>

      <hr style="margin: 16px 0;">

      <h3>Weak Topic Analysis</h3>
      ${weakTopicsHtml}
    </div>
  `);

  disableQuizInteraction();
}

function handleSubmitButton() {
  if (state.mode === "mock") {
    const unanswered = getUnansweredCount();
    const proceed = window.confirm(
      unanswered > 0
        ? `You still have ${unanswered} unanswered question(s). Submit exam anyway?`
        : "Submit exam now?"
    );

    if (proceed) {
      submitExam(false);
    }
    return;
  }

  submitPracticeAnswer();
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
    el.submitBtn.addEventListener("click", handleSubmitButton);
  }
}

async function initQuiz() {
  try {
    showLoader(true);
    parseMode();
    updateModeUI();
    attachEvents();
    await createAttempt();
    await loadQuestions();

    if (!state.questions.length) {
      throw new Error("No questions found.");
    }

    if (state.mode === "mock") {
      startMockTimer();
    }

    renderQuestion();
    showLoader(false);
  } catch (error) {
    console.error("Quiz init failed:", error);
    showLoader(false);

    if (el.questionText) {
      el.questionText.textContent = "Failed to load quiz.";
    }

    renderResultsScreen(`
      <div class="result-card">
        <h2>Quiz Error</h2>
        <p>The quiz could not be loaded.</p>
        <p>${error?.message || "Unknown error"}</p>
      </div>
    `);
  }
}

document.addEventListener("DOMContentLoaded", initQuiz);
