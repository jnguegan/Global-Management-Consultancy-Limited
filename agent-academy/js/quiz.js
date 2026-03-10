const db =
  window.supabaseClient ||
  window.sb ||
  null;

if (!db) {
  console.error("Supabase client not found. Check supabase-client.js");
}

const state = {
  lang: localStorage.getItem("lang") || "en",
  mode: "practice",
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
  loader: document.getElementById("loader"),
  quizContent: document.getElementById("quizContent"),

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

function setLoadingState(isLoading) {
  if (el.loader) {
    el.loader.style.display = isLoading ? "block" : "none";
  }

  if (el.quizContent) {
    if (isLoading) {
      el.quizContent.classList.add("hidden");
    } else {
      el.quizContent.classList.remove("hidden");
    }
  }
}

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

  state.mode = mode === "mock" ? "mock" : "practice";
  state.topicSlug = topic || null;
}

async function createAttempt() {
  state.attemptId = null;
  state.canSaveAttempt = false;
}

async function fetchMockQuestionPool() {
  const { data, error } = await db
    .from("questions")
    .select("*");

  if (error) throw error;
  return (data || []).filter(q => q.is_active !== false);
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
    const ids = new Set(selected.map(q => q.id));
    const extra = shuffleArray(pool.filter(q => !ids.has(q.id)));
    selected = [...selected, ...extra.slice(0, 40 - selected.length)];
  }

  return shuffleArray(selected).slice(0, 40);
}

async function fetchPracticeQuestions(topicSlug) {
  const { data: topic, error: topicError } = await db
    .from("topics")
    .select("*")
    .eq("slug", topicSlug)
    .single();

  if (topicError) throw topicError;

  state.topic = topic;

  const { data: questions, error } = await db
    .from("questions")
    .select("*")
    .eq("topic_id", topic.id);

  if (error) throw error;

  return (questions || []).filter(q => q.is_active !== false);
}

async function fetchOptionsForQuestions(ids) {
  const { data, error } = await db
    .from("question_options")
    .select("*")
    .in("question_id", ids);

  if (error) throw error;
  return data || [];
}

async function fetchReferencesForQuestions(ids) {
  const { data, error } = await db
    .from("question_references")
    .select("*")
    .in("question_id", ids);

  if (error) throw error;
  return data || [];
}

async function loadQuestions() {
  let selected = [];

  if (state.mode === "mock") {
    const pool = await fetchMockQuestionPool();
    selected = pickWeightedMockQuestions(pool);
  } else {
    const pool = await fetchPracticeQuestions(state.topicSlug);
    selected = shuffleArray(pool);
  }

  const ids = selected.map(q => q.id);

  const [options, references] = await Promise.all([
    fetchOptionsForQuestions(ids),
    fetchReferencesForQuestions(ids)
  ]);

  const optionsByQuestionId = groupBy(options, "question_id");
  const refsByQuestionId = groupBy(references, "question_id");

  state.questions = selected.map(q => ({
    ...q,
    options: shuffleArray((optionsByQuestionId[q.id] || []).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))),
    references: refsByQuestionId[q.id] || []
  }));

  state.startedAt = Date.now();
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  if (el.questionCounter)
    el.questionCounter.textContent = `Question ${state.currentIndex+1} of ${state.questions.length}`;

  if (el.questionText)
    el.questionText.textContent = getTextByLang(q,"question_text");

  if (el.optionsContainer) {
    el.optionsContainer.innerHTML = "";
    const saved = state.answersByQuestionId[q.id];

    q.options.forEach((opt,i)=>{
      const wrapper=document.createElement("label");
      wrapper.className="quiz-option";

      const input=document.createElement("input");
      input.type="radio";
      input.name=`question-${q.id}`;
      input.value=opt.id;
      input.checked=String(saved)===String(opt.id);

      input.addEventListener("change",()=>saveAnswerLocally(q.id,opt.id));

      const text=document.createElement("span");
      text.textContent=`${["A","B","C","D"][i]}. ${getTextByLang(opt,"option_text")}`;

      wrapper.appendChild(input);
      wrapper.appendChild(text);
      el.optionsContainer.appendChild(wrapper);
    });
  }

  renderReferences(q);
}

function renderReferences(q){
  if(!el.referencesContainer) return;
  el.referencesContainer.innerHTML="";

  (q.references||[]).forEach(ref=>{
    const item=document.createElement("div");
    item.className="question-reference";
    const preview=getTextByLang(ref,"reference_preview");

    item.innerHTML=`
      <strong>${ref.reference_label||""}</strong>
      ${ref.reference_article?` - ${ref.reference_article}`:""}
      ${ref.reference_title?` - ${ref.reference_title}`:""}
      ${ref.reference_page?` (p.${ref.reference_page})`:""}
      ${preview?`<div class="reference-preview">${preview}</div>`:""}
    `;

    el.referencesContainer.appendChild(item);
  });
}

function saveAnswerLocally(qid,oid){
  state.answersByQuestionId[qid]=oid;
}

async function initQuiz(){
  try{
    setLoadingState(true);

    parseMode();
    await createAttempt();
    await loadQuestions();

    renderQuestion();

    setLoadingState(false);
  }
  catch(err){
    console.error("Quiz init failed:",err);
    setLoadingState(false);
  }
}

document.addEventListener("DOMContentLoaded", initQuiz);
