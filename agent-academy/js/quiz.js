const db =
  window.supabaseClient ||
  window.sb ||
  null;

if (!db) {
  console.error("Supabase client not found. Check supabase-client.js");
}

const state = {
  lang: localStorage.getItem("lang") || "en",
  topicSlug: null,
  topic: null,
  questions: [],
  currentIndex: 0,
  selectedOptionId: null,
  score: 0,
  attemptId: null,
  startedAt: null,
  submitted: false,
  canSaveAttempt: false,
  questionLimit: 10,
  seenQuestionIds: new Set()
};

const el = {
  loader: document.getElementById("loader"),
  emptyState: document.getElementById("emptyState"),
  topicTitle: document.getElementById("topicTitle"),
  topicBadge: document.getElementById("topicBadge"),
  quizHeading: document.getElementById("quizHeading"),
  quizSubheading: document.getElementById("quizSubheading"),
  quizContent: document.getElementById("quizContent"),
  resultsView: document.getElementById("resultsView"),
  progressLabel: document.getElementById("progressLabel"),
  progressPercent: document.getElementById("progressPercent"),
  progressBar: document.getElementById("progressBar"),
  questionNumber: document.getElementById("questionNumber"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  feedbackBox: document.getElementById("feedbackBox"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),
  scoreLive: document.getElementById("scoreLive"),
  totalLive: document.getElementById("totalLive"),
  submitBtn: document.getElementById("submitBtn"),
  nextBtn: document.getElementById("nextBtn"),
  retryBtn: document.getElementById("retryBtn"),
    
  questionReferencePanel: document.getElementById("questionReferencePanel"),
  questionReferenceMeta: document.getElementById("questionReferenceMeta"),
  questionReferenceLink: document.getElementById("questionReferenceLink"),
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    if (!db) {
      showEmpty("Supabase client not found.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    state.topicSlug = params.get("topic");
     const params = new URLSearchParams(window.location.search);
    state.topicSlug = params.get("topic");

    if (!state.topicSlug) {
      showEmpty("Missing topic in URL. Example: quiz.html?topic=ffar-basics");
      return;
    }

    injectReferenceTooltipStyles();
    bindEvents();
    loadSeenQuestionIds();
    await loadTopic();
    await loadQuestions();

    if (!state.questions.length) {
      showEmpty("No questions found for this topic yet.");
      return;
    }

    hideLoader();
    showQuiz();
    renderQuestion();

    await tryCreateQuizAttempt();
  } catch (error) {
    console.error("Quiz init error:", error);
    showEmpty("Unable to load quiz.");
  }
}

function injectReferenceTooltipStyles() {
  if (document.getElementById("ref-tooltip-styles")) return;

  const style = document.createElement("style");
  style.id = "ref-tooltip-styles";
  style.textContent = `
    .ref-link-wrap{
      position:relative;
      display:inline-block;
      vertical-align:baseline;
    }

    .ref-link{
      text-decoration:underline;
      cursor:pointer;
    }

    .ref-tooltip{
      position:absolute;
      left:50%;
      bottom:calc(100% + 8px);
      transform:translateX(-50%);
      min-width:180px;
      max-width:280px;
      width:max-content;
      background:#111827;
      color:#fff;
      padding:8px 10px;
      border-radius:8px;
      font-size:12px;
      line-height:1.35;
      box-shadow:0 8px 22px rgba(0,0,0,.18);
      white-space:normal;
      word-break:break-word;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .18s ease, visibility .18s ease, transform .18s ease;
      z-index:999;
      text-align:left;
    }

    .ref-tooltip::after{
      content:"";
      position:absolute;
      left:50%;
      top:100%;
      transform:translateX(-50%);
      border-width:6px;
      border-style:solid;
      border-color:#111827 transparent transparent transparent;
    }

    .ref-link-wrap:hover .ref-tooltip,
    .ref-link-wrap:focus-within .ref-tooltip{
      opacity:1;
      visibility:visible;
      transform:translateX(-50%) translateY(-2px);
    }
  `;
  document.head.appendChild(style);
}

function bindEvents() {
  if (el.submitBtn) el.submitBtn.addEventListener("click", submitAnswer);
  if (el.nextBtn) el.nextBtn.addEventListener("click", goNext);
  if (el.retryBtn) el.retryBtn.addEventListener("click", retryQuiz);
}

function getSeenStorageKey() {
  return `quiz_seen_${state.topicSlug || "default"}`;
}

function loadSeenQuestionIds() {
  try {
    const raw = sessionStorage.getItem(getSeenStorageKey());
    const ids = raw ? JSON.parse(raw) : [];
    state.seenQuestionIds = new Set(ids);
  } catch (err) {
    console.warn("Failed to load seen questions:", err);
    state.seenQuestionIds = new Set();
  }
}

function saveSeenQuestionIds() {
  try {
    sessionStorage.setItem(
      getSeenStorageKey(),
      JSON.stringify([...state.seenQuestionIds])
    );
  } catch (err) {
    console.warn("Failed to save seen questions:", err);
  }
}

function resetSeenQuestionIds() {
  try {
    sessionStorage.removeItem(getSeenStorageKey());
  } catch (err) {
    console.warn("Failed to reset seen questions:", err);
  }
  state.seenQuestionIds = new Set();
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function selectRandomQuestions(allQuestions, limit) {
  const unseen = allQuestions.filter(q =>
    !state.seenQuestionIds.has(q.id)
  );

  const pool = unseen.length >= limit ? unseen : allQuestions;
  const shuffled = shuffleArray(pool);
  const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

  selected.forEach(q => state.seenQuestionIds.add(q.id));
  saveSeenQuestionIds();

  return selected;
}

async function loadTopic() {
  const { data, error } = await db
    .from("topics")
    .select(`
      id,
      slug,
      is_active,
      name_en,
      name_fr,
      name_es,
      description_en,
      description_fr,
      description_es
    `)
    .eq("slug", state.topicSlug)
    .eq("is_active", true)
    .single();

  console.log("TOPIC DATA:", data);
  console.log("TOPIC ERROR:", error);

  if (error || !data) {
    throw error || new Error("Topic not found");
  }

  state.topic = data;

  const topicName = getLocalizedValue(data, "name");
  const topicDescription = getLocalizedValue(data, "description");

  if (el.topicTitle) el.topicTitle.textContent = topicName || "Topic";
  if (el.topicBadge) el.topicBadge.textContent = data.slug;
  if (el.quizHeading) el.quizHeading.textContent = topicName || "Quiz";
  if (el.quizSubheading) {
    el.quizSubheading.textContent =
      topicDescription || "Answer each question and track your score.";
  }
}

async function loadQuestions() {
  const access = await AgentAcademyGuard.getAccessState();

let table = "questions";

if (access.plan === "free") {
  table = "preview_quiz_questions";
} else if (access.plan === "starter") {
  table = "starter_quiz_questions";
}
  const exactQuestionId = state.questionIdFromUrl || null;

let idsQuery = db
  .from(table)
  .select("id");

if (state.questionIdFromUrl) {

  idsQuery = idsQuery.eq("id", state.questionIdFromUrl);

} else if (access.plan !== "free") {

  idsQuery = idsQuery
    .eq("topic_id", state.topic.id)
    .eq("is_active", true);

}

if (access.plan !== "free") {
  idsQuery = idsQuery.eq("topic_id", state.topic.id);
}

if (access.plan !== "free") {
  idsQuery = idsQuery.eq("topic_id", state.topic.id);
}

const { data: idsData, error: idsError } = await idsQuery;

console.log("QUESTION IDS DATA:", idsData);
console.log("QUESTION IDS ERROR:", idsError);

if (idsError) {
  throw idsError;
}

  const allQuestionIds = (idsData || []).map((q) => q.id);

  if (!allQuestionIds.length) {
    state.questions = [];
    if (el.totalLive) el.totalLive.textContent = "0";
    return;
  }

  const unseenQuestionIds = allQuestionIds.filter(
    (id) => !state.seenQuestionIds.has(id)
  );

  const pool =
    unseenQuestionIds.length >= state.questionLimit
      ? unseenQuestionIds
      : allQuestionIds;

  const selectedQuestionIds = shuffleArray(pool).slice(
    0,
    Math.min(state.questionLimit, pool.length)
  );

  selectedQuestionIds.forEach((id) => state.seenQuestionIds.add(id));
  saveSeenQuestionIds();

  const { data: questionsData, error: questionsError } = await db
    .from("questions")
    .select(`
      id,
      topic_id,
      is_active,
      created_at,
      question_text_en,
      question_text_fr,
      question_text_es,
      explanation_en,
      explanation_fr,
      explanation_es,
      reference_label,
      reference_article,
      reference_url,
      reference_title,
      reference_page,
      reference_preview_en,
      reference_preview_fr,
      reference_preview_es,
      difficulty
    `)
    .in("id", selectedQuestionIds);

  console.log("QUESTIONS DATA:", questionsData);
  console.log("QUESTIONS ERROR:", questionsError);

  if (questionsError) {
    throw questionsError;
  }

  const questionsById = {};
  (questionsData || []).forEach((q) => {
    questionsById[q.id] = q;
  });

  const orderedQuestions = selectedQuestionIds
    .map((id) => questionsById[id])
    .filter(Boolean);

  const { data: optionsData, error: optionsError } = await db
    .from("question_options")
    .select(`
      id,
      question_id,
      is_correct,
      sort_order,
      option_text_en,
      option_text_fr,
      option_text_es
    `)
    .in("question_id", selectedQuestionIds)
    .order("sort_order", { ascending: true });

  console.log("OPTIONS DATA:", optionsData);
  console.log("OPTIONS ERROR:", optionsError);

  if (optionsError) {
    throw optionsError;
  }

  const optionsByQuestionId = {};

  (optionsData || []).forEach((option) => {
    if (!optionsByQuestionId[option.question_id]) {
      optionsByQuestionId[option.question_id] = [];
    }
    optionsByQuestionId[option.question_id].push(option);
  });

  state.questions = orderedQuestions.map((q) => {
    const options = (optionsByQuestionId[q.id] || []).sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );

    return {
      ...q,
      options
    };
  });

  state.currentIndex = 0;
  state.selectedOptionId = null;
  state.score = 0;
  state.submitted = false;

  if (el.totalLive) el.totalLive.textContent = String(state.questions.length);
}

async function tryCreateQuizAttempt() {
  try {
    const {
      data: { user },
      error: userError
    } = await db.auth.getUser();

    console.log("AUTH USER:", user);
    console.log("AUTH ERROR:", userError);

    if (userError || !user) {
      state.canSaveAttempt = false;
      return;
    }

    state.startedAt = new Date().toISOString();

    const { data, error } = await db
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        topic_id: state.topic.id,
        started_at: state.startedAt,
        score: 0,
        total_questions: state.questions.length,
        percentage: 0,
        mode: "practice"
      })
      .select("id")
      .single();

    console.log("ATTEMPT DATA:", data);
    console.log("ATTEMPT ERROR:", error);

    if (error || !data) {
      state.canSaveAttempt = false;
      return;
    }

    state.attemptId = data.id;
    state.canSaveAttempt = true;
  } catch (err) {
    console.error("tryCreateQuizAttempt error:", err);
    state.canSaveAttempt = false;
  }
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  state.selectedOptionId = null;
  state.submitted = false;

  const questionText = getLocalizedValue(q, "question_text");
  const questionExplanation = getLocalizedValue(q, "explanation");

  if (el.questionNumber) {
    el.questionNumber.textContent = `Question ${state.currentIndex + 1}`;
  }

  if (el.questionText) {
    el.questionText.textContent = questionText || "";
  }

  if (el.progressLabel) {
    el.progressLabel.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  }

  const percent = Math.round((state.currentIndex / state.questions.length) * 100);

  if (el.progressPercent) el.progressPercent.textContent = `${percent}%`;
  if (el.progressBar) el.progressBar.style.width = `${percent}%`;
  if (el.scoreLive) el.scoreLive.textContent = String(state.score);

  if (el.feedbackBox) el.feedbackBox.className = "feedback";
  if (el.feedbackTitle) el.feedbackTitle.textContent = "";
  if (el.feedbackText) el.feedbackText.textContent = "";

  if (el.submitBtn) el.submitBtn.disabled = false;
  if (el.nextBtn) {
    el.nextBtn.disabled = true;
    el.nextBtn.textContent =
      state.currentIndex === state.questions.length - 1
        ? "Finish quiz"
        : "Next question";
  }

  if (el.optionsContainer) {
    el.optionsContainer.innerHTML = "";

    q.options.forEach((option, index) => {
      const optionText = getLocalizedValue(option, "option_text");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.dataset.optionId = option.id;
      btn.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(optionText || "")}`;

      btn.addEventListener("click", () => {
        if (state.submitted) return;
        selectOption(option.id);
      });

      el.optionsContainer.appendChild(btn);
    });
  }

  q._cachedExplanation = questionExplanation || "";

if (el.questionReferencePanel) {
  el.questionReferencePanel.classList.add("hidden");
}
}

function selectOption(optionId) {
  state.selectedOptionId = optionId;

  document.querySelectorAll(".option").forEach((button) => {
    button.classList.remove("selected");
    if (Number(button.dataset.optionId) === Number(optionId)) {
      button.classList.add("selected");
    }
  });
}

async function submitAnswer() {
  if (!state.selectedOptionId) {
    alert("Please select an answer first.");
    return;
  }

  const q = state.questions[state.currentIndex];
  const selected = q.options.find(
    (opt) => Number(opt.id) === Number(state.selectedOptionId)
  );
  const correct = q.options.find((opt) => opt.is_correct === true);
  const isCorrect = !!selected?.is_correct;

  state.submitted = true;

  if (isCorrect) {
    state.score += 1;
    if (el.scoreLive) el.scoreLive.textContent = String(state.score);
  }

  if (state.canSaveAttempt && state.attemptId && selected) {
    await saveQuizAnswer({
      attempt_id: state.attemptId,
      question_id: q.id,
      selected_option_id: selected.id,
      is_correct: isCorrect
    });
  }

  document.querySelectorAll(".option").forEach((button) => {
    button.disabled = true;

    const currentId = Number(button.dataset.optionId);

    if (correct && currentId === Number(correct.id)) {
      button.classList.add("correct");
    }

    if (selected && currentId === Number(selected.id) && !isCorrect) {
      button.classList.add("incorrect");
    }
  });

  if (el.submitBtn) el.submitBtn.disabled = true;
  if (el.nextBtn) el.nextBtn.disabled = false;

  if (el.feedbackBox) {
    el.feedbackBox.className = `feedback show ${isCorrect ? "correct" : "incorrect"}`;
  }

  if (el.feedbackTitle) {
    el.feedbackTitle.textContent = isCorrect ? "Correct" : "Incorrect";
  }

  if (el.feedbackText) {
    let ref = "";

    if (q.reference_label || q.reference_article) {
      const refWord =
        state.lang === "fr"
          ? "Référence"
          : state.lang === "es"
          ? "Referencia"
          : "Reference";

      const rawLabel = (q.reference_label || "").trim();
      const rawArticle = (q.reference_article || "").trim();
      const safeLabel = escapeHtml(rawLabel);
      const safeArticle = escapeHtml(rawArticle);
      const safeTitle = escapeHtml(q.reference_title || "");
      const safePreview = escapeHtml(getReferencePreview(q));

      let link = q.reference_url || "";

      const docMap = window.REGULATION_DOC_MAP || {};
      const doc = docMap[rawLabel];

      if (!link && doc) {
        link = q.reference_page
          ? `/agent-academy/regulation-viewer.html?doc=${encodeURIComponent(doc)}&page=${encodeURIComponent(q.reference_page)}`
          : `/agent-academy/regulation-viewer.html?doc=${encodeURIComponent(doc)}`;
      }

      if (!link && rawLabel === "FFAR" && typeof getFFARArticleLink === "function") {
        link = getFFARArticleLink(q.reference_article);
      }

      const tooltipHtml =
        safeTitle || safePreview
          ? `<span class="ref-tooltip">
               ${safeTitle ? `<strong>${getReferenceTitleLabel()}:</strong> ${safeTitle}${safePreview ? "<br>" : ""}` : ""}
               ${safePreview ? `<strong>${getReferencePreviewLabel()}:</strong> ${safePreview}` : ""}
             </span>`
          : "";

      const linkedLabel = `${safeLabel} — ${safeArticle}`;

      const refHtml = link
        ? `<span class="ref-link-wrap">
             <a href="${link}" target="_blank" rel="noopener noreferrer" class="ref-link">${linkedLabel}</a>
             ${tooltipHtml}
           </span>`
        : `<span class="ref-link-wrap">
             <span class="ref-link">${linkedLabel}</span>
             ${tooltipHtml}
           </span>`;

      ref = `<br><br>${refWord}: ${refHtml}.`;
    }

    el.feedbackText.innerHTML =
      escapeHtml(
        q._cachedExplanation ||
        (isCorrect ? "Well done." : "Review this point carefully.")
      ) + ref;
  }
  if (typeof renderReferencePanel === "function") {
    renderReferencePanel(q);
  }
}

async function saveQuizAnswer(payload) {
  const { error } = await db.from("quiz_answers").insert({
    attempt_id: payload.attempt_id,
    question_id: payload.question_id,
    selected_option_id: payload.selected_option_id,
    is_correct: payload.is_correct,
    answered_at: new Date().toISOString()
  });

  if (error) {
    console.error("Failed to save quiz answer:", error);
  }
}

async function goNext() {
  if (!state.submitted) return;

  const isLast = state.currentIndex === state.questions.length - 1;

  if (isLast) {
    await finishQuiz();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

async function finishQuiz() {
  const total = state.questions.length;
  const percentage = total > 0 ? Math.round((state.score / total) * 100) : 0;
  const finishedAt = new Date().toISOString();

  if (state.canSaveAttempt && state.attemptId) {
    const { error } = await db
      .from("quiz_attempts")
      .update({
        finished_at: finishedAt,
        score: state.score,
        total_questions: total,
        percentage,
        mode: "practice"
      })
      .eq("id", state.attemptId);

    if (error) {
      console.error("Failed to update quiz attempt:", error);
    }
  }

  if (el.progressPercent) el.progressPercent.textContent = "100%";
  if (el.progressBar) el.progressBar.style.width = "100%";

  hideQuiz();
  showResults();

  const finalScore = document.getElementById("finalScore");
  const correctAnswers = document.getElementById("correctAnswers");
  const totalQuestions = document.getElementById("totalQuestions");

  if (finalScore) finalScore.textContent = `${percentage}%`;
  if (correctAnswers) correctAnswers.textContent = String(state.score);
  if (totalQuestions) totalQuestions.textContent = String(total);
}

function retryQuiz() {
  resetSeenQuestionIds();
  const url = new URL(window.location.href);
  url.searchParams.set("topic", state.topicSlug);
  window.location.href = url.toString();
}

function getLocalizedValue(obj, baseField) {
  if (!obj) return "";

  if (state.lang === "fr") return obj[`${baseField}_fr`] || obj[`${baseField}_en`] || "";
  if (state.lang === "es") return obj[`${baseField}_es`] || obj[`${baseField}_en`] || "";

  return obj[`${baseField}_en`] || "";
}

function getReferencePreview(q) {
  if (!q) return "";

  if (state.lang === "fr") return q.reference_preview_fr || q.reference_preview_en || "";
  if (state.lang === "es") return q.reference_preview_es || q.reference_preview_en || "";

  return q.reference_preview_en || "";
}

function getReferenceTitleLabel() {
  if (state.lang === "fr") return "Titre";
  if (state.lang === "es") return "Título";
  return "Title";
}

function getReferencePreviewLabel() {
  if (state.lang === "fr") return "Aperçu";
  if (state.lang === "es") return "Resumen";
  return "Preview";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function hideLoader() {
  if (el.loader) el.loader.classList.add("hidden");
}

function showQuiz() {
  if (el.quizContent) el.quizContent.classList.remove("hidden");
  if (el.resultsView) el.resultsView.classList.remove("show");
  if (el.emptyState) el.emptyState.classList.add("hidden");
}

function hideQuiz() {
  if (el.quizContent) el.quizContent.classList.add("hidden");
}

function showResults() {
  if (el.resultsView) el.resultsView.classList.add("show");
}

function showEmpty(message) {
  hideLoader();
  hideQuiz();
  if (el.resultsView) el.resultsView.classList.remove("show");
  if (el.emptyState) {
    el.emptyState.classList.remove("hidden");
    el.emptyState.textContent = message;
  }
}
