// ---------------------------------------------
//      CONCERT-QUIZ TEMPLATE  •  METRIC EDITION
//                (text answer fix)
// ---------------------------------------------

/* ---------------------------------------------------------------------------
   0.  CONFIGURATION SECTION – tweak here only
--------------------------------------------------------------------------- */
const METRICS = ["energy", "empathy", "novelty", "structure"];

const QUESTIONS = [
  {
    id: "q1",
    type: "choice",
    text: "How are you feeling today?",
    options: [
      { value: "energetic", label: "Energetic & Ready for Adventure",
        description: "Something exciting and dynamic", icon: "fas fa-bolt",
        effects: { energy: +2, novelty: +1 } },
      { value: "peaceful",  label: "Contemplative & Peaceful",
        description: "Something soothing and reflective", icon: "fas fa-leaf",
        effects: { energy: -1, empathy: +2 } },
      { value: "emotional", label: "Emotional & Passionate",
        description: "I want to feel deeply moved", icon: "fas fa-heart",
        effects: { empathy: +3 } },
      { value: "social",    label: "Social & Celebratory",
        description: "Share a special experience", icon: "fas fa-users",
        effects: { energy: +1, empathy: +1 } }
    ]
  },
  {
    id: "q2",
    type: "text",
    text: "In a sentence, describe your perfect evening out.",
    placeholder: "Your answer …"
  },
  {
    id: "q3",
    type: "image",
    text: "Which artwork resonates most with you?",
    options: [
      { value: "vangogh",   label: "Van Gogh – Starry Night",
        img: "assets/starry-night.jpg",
        effects: { novelty: +2, empathy: +1 } },
      { value: "monet",     label: "Monet – Water Lilies",
        img: "assets/water-lilies.jpg",
        effects: { empathy: +2, energy: -1 } },
      { value: "kandinsky", label: "Kandinsky – Composition VIII",
        img: "assets/composition-8.jpg",
        effects: { novelty: +3 } },
      { value: "pollock", label: "Pollock – No. 5 (1948)",
        img: "assets/pollock-no5.jpg",   
        effects: { energy: +2, novelty: +3 } }

    ]
  }
];

const PERSONALITY_TYPES = [
  {
    id: "adventurer",
    title: "The Adventurer",
    blurb: "Craves energy, bold sounds and new experiences.",
    rule: s => s.energy > 1 && s.novelty > 1
  },
  {
    id: "dreamer",
    title: "The Dreamer",
    blurb: "Enjoys contemplative atmospheres and pastel sound-colours.",
    rule: s => s.empathy > 1 && s.energy <= 1
  }
];

const CONCERTS = {
  adventurer: [
    { date: "2025-10-12", title: "Mahler 6 – City Symphony Orchestra", venue: "Philharmonie" },
    { date: "2025-11-04", title: "John Adams: Harmonielehre",          venue: "Modern Hall" }
  ],
  dreamer: [
    { date: "2025-09-21", title: "Debussy & Ravel String Quartets",    venue: "Chamber Music Hall" }
  ]
};

/* ---------------------------------------------------------------------------
   1.  APP STATE
--------------------------------------------------------------------------- */
const quizContainer = document.getElementById("quiz-container");
let answers = {};
let currentIndex = 0;

/* ---------------------------------------------------------------------------
   2.  RENDERING LAYER
--------------------------------------------------------------------------- */
function renderIntro() {
  answers = {};
  currentIndex = 0;
  quizContainer.innerHTML = /*html*/`
    <section class="max-w-4xl mx-auto text-center px-4 sm:px-8">
      <img src="assets/concert.jpg"
           alt="Concert crowd" class="rounded-3xl shadow-2xl mb-12 w-full h-64 object-cover" />
      <h2 class="text-4xl sm:text-5xl font-extrabold font-head mb-6 leading-tight">
        What Kind of Concertgoer Are You?
      </h2>
      <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto font-body">
        Discover your musical personality – get bespoke concert picks.
      </p>
      <button class="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold text-lg py-4 px-10 rounded-2xl shadow-lg transition hover:scale-105"
              onclick="startQuiz()">Start Quiz</button>
    </section>`;
}

function startQuiz() { renderQuestion(0); }

function renderQuestion(i) {
  const q = QUESTIONS[i];
  if (!q) return renderResults();

  const progress = Math.round(((i + 1) / QUESTIONS.length) * 100);

  quizContainer.innerHTML = /*html*/`
    <div class="max-w-3xl mx-auto">
      <div class="mb-6 flex justify-between text-sm text-gray-500 uppercase tracking-wide">
        <span>Question ${i + 1} of ${QUESTIONS.length}</span>
        <span>${progress}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1 mb-10">
        <div class="bg-yellow-400 h-1 rounded-full transition-all" style="width:${progress}%"></div>
      </div>
      <h3 class="text-3xl font-head font-bold text-center mb-10">${q.text}</h3>
      ${renderByType(q)}
      <div class="flex justify-between mt-10">
        <button class="btn btn-secondary ${i === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${i===0? 'disabled': ''}
                onclick="goBack()">← Back</button>
        <button id="next-btn"
                class="btn btn-yellow ${answers[q.id] ? '' : 'opacity-30 cursor-not-allowed'}"
                ${answers[q.id] ? '' : 'disabled'}
                onclick="goNext(${i})">Next →</button>
      </div>
    </div>`;
}

function renderByType(q) {
  switch (q.type) {
    case "choice":
      return /*html*/`<div class="space-y-4">
        ${q.options.map(opt => {
          const selected = answers[q.id] === opt.value;
          return /*html*/`
            <button class="w-full text-left card ${selected ? 'card-selected' : ''}"
                    onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
              <div class="flex items-start space-x-4">
                <div class="card-icon ${selected ? 'bg-yellow-300' : 'bg-black/10'}">
                  <i class="${opt.icon} text-lg ${selected ? 'text-black' : 'text-gray-700'}"></i>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-1">${opt.label}</h4>
                  <p class="text-sm text-gray-600">${opt.description || ''}</p>
                </div>
              </div>
            </button>`;}).join('')}
      </div>`;

    case "text":
      return /*html*/`<div class="text-center">
        <textarea id="text-q-${q.id}" class="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  rows="4" placeholder="${q.placeholder || ''}"
                  oninput="handleTextInput('${q.id}', this)">${answers[q.id]||''}</textarea>
      </div>`;

    case "image":
      return /*html*/`<div class="grid sm:grid-cols-2 gap-6">
        ${q.options.map(opt => {
          const selected = answers[q.id] === opt.value;
          return /*html*/`
            <div class="cursor-pointer relative group"
                 onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
              <img src="${opt.img}" alt="${opt.label}"
                   class="rounded-2xl shadow-lg border-4 ${selected ? 'border-yellow-400' : 'border-transparent'}">
              <span class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-sm py-2 rounded-b-2xl text-center">${opt.label}</span>
            </div>`;}).join('')}
      </div>`;

    default:
      return `<p>Unsupported question type: ${q.type}</p>`;
  }
}

/* ---------------------------------------------------------------------------
   3.  STATE + NAVIGATION
--------------------------------------------------------------------------- */
function selectAnswer(id, value, idx) {
  answers[id] = value;
  const q = QUESTIONS[idx];
  if (q.type !== "text") renderQuestion(idx);
}

function handleTextInput(id, el) {
  answers[id] = el.value;

  // Enable Next button once any text is present
  const btn = document.getElementById("next-btn");
  if (btn && el.value.trim().length) {
    btn.classList.remove("opacity-30", "cursor-not-allowed");
    btn.removeAttribute("disabled");
  } else if (btn) {
    btn.classList.add("opacity-30", "cursor-not-allowed");
    btn.setAttribute("disabled", "disabled");
  }
}

function goBack() {
  if (currentIndex > 0) { currentIndex--; renderQuestion(currentIndex); }
}

function goNext(idx) {
  if (!answers[QUESTIONS[idx].id]) return;
  currentIndex = idx + 1;
  renderQuestion(currentIndex);
}

/* ---------------------------------------------------------------------------
   4.  SCORING + RESULT
--------------------------------------------------------------------------- */
function calcScores() {
  const scores = Object.fromEntries(METRICS.map(m => [m, 0]));
  QUESTIONS.forEach(q => {
    if (!answers[q.id]) return;
    if (q.type === "choice" || q.type === "image") {
      const opt = q.options.find(o => o.value === answers[q.id]);
      if (opt?.effects) {
        for (const [metric, delta] of Object.entries(opt.effects)) {
          if (metric in scores) scores[metric] += delta;
        }
      }
    }
  });
  return scores;
}

function computePersonality() {
  const scores = calcScores();
  const type = PERSONALITY_TYPES.find(p => p.rule(scores));
  return type || { id: "undecided", title: "Undecided", blurb: "We need more data to classify you!" };
}

function renderResults() {
  const personality = computePersonality();
  const recs = CONCERTS[personality.id] || [];

  quizContainer.innerHTML = /*html*/`
    <div class="max-w-xl mx-auto text-center">
      <h2 class="text-4xl font-head font-bold mb-6">${personality.title}</h2>
      <p class="text-lg text-gray-700 mb-8 font-body">${personality.blurb}</p>

      <h3 class="text-2xl font-semibold font-head mb-4">Recommended Concerts</h3>
      <ul class="space-y-3 mb-10">
        ${recs.length
          ? recs.map(c => `<li class="border p-4 rounded-xl text-left">
                <span class="block font-semibold">${c.title}</span>
                <span class="text-sm text-gray-500">${c.date} – ${c.venue}</span>
             </li>`).join('')
          : '<li>No matches yet – stay tuned!</li>'}
      </ul>

      <button onclick="renderIntro()" class="btn btn-secondary">Retake Quiz</button>
    </div>`;
}

/* ---------------------------------------------------------------------------
   5.  BOOTSTRAP
--------------------------------------------------------------------------- */
renderIntro();

/* ---------------------------------------------------------------------------
   6.  GLOBAL HANDLERS
--------------------------------------------------------------------------- */
window.startQuiz       = startQuiz;
window.selectAnswer    = selectAnswer;
window.goBack          = goBack;
window.goNext          = goNext;
window.handleTextInput = handleTextInput;
window.renderIntro     = renderIntro;
