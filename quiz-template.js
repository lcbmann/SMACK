// --------------------------------------------------------------
//   CONCERT-QUIZ TEMPLATE  •  METRIC EDITION  •  MPhil Styling
// --------------------------------------------------------------

/* ──────────────────────────────────────────────────────────────
   0.  CONFIGURATION
   ──────────────────────────────────────────────────────────────*/
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
        img: "assets/starry-night.jpg", effects: { novelty: +2, empathy: +1 } },
      { value: "monet",     label: "Monet – Water Lilies",
        img: "assets/water-lilies.jpg", effects: { empathy: +2, energy: -1 } },
      { value: "kandinsky", label: "Kandinsky – Composition VIII",
        img: "assets/composition-8.jpg", effects: { novelty: +3 } },
      { value: "pollock",   label: "Pollock – No. 5 (1948)",
        img: "assets/pollock-no5.jpg", effects: { energy: +2, novelty: +3 } }
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

/* ──────────────────────────────────────────────────────────────
   1.  APP STATE
   ──────────────────────────────────────────────────────────────*/
const quizContainer = document.getElementById("quiz-container");
let answers = {};
let currentIndex = 0;

/* ──────────────────────────────────────────────────────────────
   2.  RENDERING
   ──────────────────────────────────────────────────────────────*/
function renderIntro() {
  answers = {}; currentIndex = 0;
  const saved = getSavedResult();
  quizContainer.innerHTML = /*html*/`
    <section class="relative max-w-2xl w-full mx-auto bg-white/90 rounded-3xl shadow-2xl px-8 py-12 flex flex-col items-center animate-fadein">
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-[var(--mphil-yellow)] rounded-full shadow-lg"></div>
      <img src="assets/concert.jpg"
           alt="Orchestra" class="rounded-xl shadow-lg mb-10 w-full h-56 object-cover object-center"/>
      <h2 class="text-5xl sm:text-6xl font-head mb-6 tracking-tight">Discover</h2>
      <p class="text-lg text-gray-700 mb-10 max-w-xl mx-auto font-body">
        Find out which concert vibe suits you best – and get personalised
        tips from the Münchner&nbsp;Philharmoniker programme.
      </p>
      ${saved ? `
        <div class="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button class="btn btn-primary shadow-lg" onclick="viewSavedResult()">View Your Result</button>
          <button class="btn btn-secondary shadow-lg" onclick="clearSavedResultAndRetake()">Retake Quiz</button>
        </div>
      ` : `
        <button class="btn btn-primary mt-2 shadow-lg" onclick="startQuiz()">Take the Quiz</button>
      `}
    </section>`;
}

function startQuiz(){ renderQuestion(0); }

function renderQuestion(i){
  const q = QUESTIONS[i];
  if(!q) return renderResults();
  const progress = Math.round(((i+1)/QUESTIONS.length)*100);

  quizContainer.innerHTML = /*html*/`
    <div class="relative max-w-2xl w-full mx-auto bg-white/95 rounded-3xl shadow-2xl px-8 py-12">
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-[var(--mphil-yellow)] rounded-full shadow-lg"></div>
      <div class="fixed top-0 left-0 w-full z-30">
        <div class="mx-auto max-w-2xl px-8 pt-6">
          <div class="progress-track rounded-full overflow-hidden h-3 bg-gray-200 shadow">
            <div class="progress-bar h-3 rounded-full" style="width:${progress}%"></div>
          </div>
        </div>
      </div>
      <div class="mb-8 flex justify-between text-sm text-gray-500 font-head">
        <span>Question ${i+1}/${QUESTIONS.length}</span>
        <span>${progress}%</span>
      </div>
      <h3 class="text-3xl font-head mb-8 tracking-tight">${q.text}</h3>
      ${renderByType(q)}
      <div class="flex justify-between mt-10">
        <button class="btn btn-secondary ${i===0?'opacity-30 cursor-not-allowed':''}"
                ${i===0?'disabled':''} onclick="goBack()">← Back</button>
        <button id="next-btn"
                class="btn btn-primary ${answers[q.id]?'':'opacity-30 cursor-not-allowed'}"
                ${answers[q.id]?'':'disabled'}
                onclick="goNext(${i})">Next →</button>
      </div>
    </div>`;
}

function renderByType(q){
  if(q.type==="choice"){
    return /*html*/`<div class="space-y-4">
      ${q.options.map(opt=>{
        const selected = answers[q.id]===opt.value;
        return /*html*/`
          <button class="w-full text-left card ${selected?'card-selected':''}"
                  onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
            <div class="flex items-start gap-4">
              <div class="card-icon ${selected?'bg-[var(--mphil-yellow)]':''}">
                <i class="${opt.icon} text-lg ${selected?'text-black':'text-gray-700'}"></i>
              </div>
              <div>
                <h4 class="font-semibold mb-1">${opt.label}</h4>
                <p class="text-sm text-gray-600">${opt.description||''}</p>
              </div>
            </div>
          </button>`;}).join("")}
    </div>`;
  }

  if(q.type==="text"){
    return /*html*/`<div class="text-center">
      <textarea id="text-q-${q.id}"
        class="w-full bg-gray-50 border-2 border-gray-300 p-4 focus:border-[var(--mphil-yellow)]"
        rows="4" placeholder="${q.placeholder||''}"
        oninput="handleTextInput('${q.id}',this)">${answers[q.id]||''}</textarea>
    </div>`;
  }

  if(q.type==="image"){
    return /*html*/`<div class="grid sm:grid-cols-2 gap-6">
      ${q.options.map(opt=>{
        const selected = answers[q.id]===opt.value;
        return /*html*/`
          <div class="group cursor-pointer relative"
               onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
            <img src="${opt.img}" alt="${opt.label}"
                 class="img-card w-full h-48 object-cover border-4 ${selected?'border-[var(--mphil-yellow)]':'border-transparent'}">
            <span class="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs py-1 text-center">
              ${opt.label}
            </span>
          </div>`;}).join("")}
    </div>`;
  }

  return `<p>Unsupported question type</p>`;
}

/* ──────────────────────────────────────────────────────────────
   3.  STATE & NAVIGATION
   ──────────────────────────────────────────────────────────────*/
function selectAnswer(id,val,idx){
  answers[id]=val;
  if(QUESTIONS[idx].type!=="text") renderQuestion(idx);
}

function handleTextInput(id,el){
  answers[id]=el.value;
  const btn=document.getElementById("next-btn");
  if(!btn) return;
  if(el.value.trim().length){
    btn.classList.remove("opacity-30","cursor-not-allowed");
    btn.removeAttribute("disabled");
  }else{
    btn.classList.add("opacity-30","cursor-not-allowed");
    btn.setAttribute("disabled","disabled");
  }
}

function goBack(){ if(currentIndex>0){ currentIndex--; renderQuestion(currentIndex);} }
function goNext(idx){
  if(!answers[QUESTIONS[idx].id]) return;
  currentIndex = idx+1;
  renderQuestion(currentIndex);
}

/* ──────────────────────────────────────────────────────────────
   4.  SCORING  &  RESULTS
   ──────────────────────────────────────────────────────────────*/
function calcScores(){
  const scores = Object.fromEntries(METRICS.map(m=>[m,0]));
  QUESTIONS.forEach(q=>{
    if(!answers[q.id]) return;
    if(q.type==="choice"||q.type==="image"){
      const opt=q.options.find(o=>o.value===answers[q.id]);
      if(opt?.effects){
        for(const [m,delta] of Object.entries(opt.effects)){
          if(m in scores) scores[m]+=delta;
        }
      }
    }
  });
  return scores;
}

function computePersonality(){
  const scores = calcScores();
  const type = PERSONALITY_TYPES.find(p=>p.rule(scores));
  return type || {title:"Undecided",blurb:"We need more data to classify you!"};
}

function renderResults(){
  const pers = computePersonality();
  const recs = CONCERTS[pers.id] || [];
  const scores = calcScores();
  saveResult({pers, recs, answers});

  quizContainer.innerHTML = /*html*/`
    <div class="max-w-xl mx-auto text-center animate-fadein">
      <h2 class="text-4xl font-head mb-6">${pers.title}</h2>
      <p class="text-lg text-gray-700 mb-8 font-body">${pers.blurb}</p>

      <h3 class="text-2xl font-head mb-4">Your Profile</h3>
      <div class="mb-10 space-y-3">
        ${renderMetricsBars(scores)}
      </div>

      <h3 class="text-2xl font-head mb-4">Recommended Concerts</h3>
      <ul class="space-y-3 mb-12">
        ${recs.length
          ? recs.map(c=>`<li class="border p-4 text-left flex flex-col gap-1">
              <span class="block font-semibold">${c.title}</span>
              <span class="text-sm text-gray-500">${c.date} – ${c.venue}</span>
              <a href="https://www.mphil.de/en/concerts-tickets/calendar/concerts/debussy-francaix-ravel-2025-06-22-4598" target="_blank" rel="noopener" class="text-[var(--mphil-yellow)] underline text-sm mt-1">View details</a>
            </li>`).join("")
          : "<li>No matches yet – stay tuned!</li>"}
      </ul>

      <button class="btn btn-primary mb-4" onclick="shareResultImage()">Share as Image</button>
      <button class="btn btn-secondary" onclick="renderIntro()">Back to Start</button>
    </div>

    <!-- 🆕  Hidden share card – 3:4 poster ratio, airy layout -->
    <div id="share-card"
         style="width:1200px;height:1600px;position:fixed;left:-9999px;top:0;
                background:#FFFBE6;z-index:-1;pointer-events:none;
                display:flex;align-items:center;justify-content:center;">
      <div style="width:940px;padding:72px 64px;
                  background:white;border-radius:56px;
                  box-shadow:0 16px 64px rgba(246,223,0,.25);
                  display:flex;flex-direction:column;align-items:center;">

        <img src='assets/concert.jpg' crossorigin="anonymous" alt='Concert hall'
             style="width:620px;height:350px;object-fit:cover;border-radius:32px;margin-bottom:48px;">

        <div style="font-family:'Maison Neue',sans-serif;font-size:72px;
                    text-transform:uppercase;letter-spacing:.14em;
                    color:#F6DF00;margin-bottom:32px;text-align:center;">
          ${pers.title}
        </div>

        <div style="font-family:'PPEditorialNew',serif;font-size:38px;
                    line-height:1.3;color:#222;text-align:center;
                    max-width:760px;margin-bottom:56px;">
          ${pers.blurb}
        </div>

        <div style="width:100%;margin-bottom:56px;">
          ${renderMetricsBarsForImage(scores)}
        </div>

        <div style="font-family:'Maison Neue',sans-serif;font-size:34px;
                    letter-spacing:.08em;text-transform:uppercase;
                    color:#222;margin-bottom:24px;">
          Concert Picks
        </div>

        <ul style="width:100%;list-style:none;padding:0;margin:0 0 48px 0;">
          ${recs.length
            ? recs.map(c=>`<li style="
                  margin-bottom:24px;padding:26px 32px;border-radius:24px;
                  background:#FFFBE6;border:3px solid #F6DF00;">
                  <div style="font-weight:800;font-size:32px;color:#222;">${c.title}</div>
                  <div style="font-size:24px;color:#666;margin-top:6px;">${c.date} – ${c.venue}</div>
                </li>`).join("")
            : "<li style='font-size:28px;color:#888;'>No matches yet – stay tuned!</li>"}
        </ul>

        <div style="font-family:'PPEditorialNew',serif;font-size:26px;color:#999;">
          mphil.de/quiz
        </div>
      </div>
    </div>
  `;
}

function viewSavedResult() {
  const saved = getSavedResult();
  if (!saved) return renderIntro();
  const { pers, recs, answers: savedAnswers } = saved;
  // Recalculate scores in case metrics changed
  const scores = calcScoresFrom(savedAnswers);

  quizContainer.innerHTML = /*html*/`
    <div class="max-w-xl mx-auto text-center animate-fadein">
      <h2 class="text-4xl font-head mb-6">${pers.title}</h2>
      <p class="text-lg text-gray-700 mb-8 font-body">${pers.blurb}</p>

      <h3 class="text-2xl font-head mb-4">Your Profile</h3>
      <div class="mb-10 space-y-3">
        ${renderMetricsBars(scores)}
      </div>

      <h3 class="text-2xl font-head mb-4">Recommended Concerts</h3>
      <ul class="space-y-3 mb-12">
        ${recs.length
          ? recs.map(c=>`<li class="border p-4 text-left flex flex-col gap-1">
              <span class="block font-semibold">${c.title}</span>
              <span class="text-sm text-gray-500">${c.date} – ${c.venue}</span>
              <a href="https://www.mphil.de/en/concerts-tickets/calendar/concerts/debussy-francaix-ravel-2025-06-22-4598" target="_blank" rel="noopener" class="text-[var(--mphil-yellow)] underline text-sm mt-1">View details</a>
            </li>`).join("")
          : "<li>No matches yet – stay tuned!</li>"}
      </ul>
      <button class="btn btn-primary mb-4" onclick="shareResultImage()">Share as Image</button>
      <div class="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <button class="btn btn-secondary" onclick="renderIntro()">Back to Start</button>
        <button class="btn btn-primary" onclick="clearSavedResultAndRetake()">Retake Quiz</button>
      </div>
    </div>

    <!-- 🆕  Hidden share card – 3:4 poster ratio, airy layout -->
    <div id="share-card"
         style="width:1200px;height:1600px;position:fixed;left:-9999px;top:0;
                background:#FFFBE6;z-index:-1;pointer-events:none;
                display:flex;align-items:center;justify-content:center;">
      <div style="width:940px;padding:72px 64px;
                  background:white;border-radius:56px;
                  box-shadow:0 16px 64px rgba(246,223,0,.25);
                  display:flex;flex-direction:column;align-items:center;">

        <img src='assets/concert.jpg' crossorigin="anonymous" alt='Concert hall'
             style="width:620px;height:350px;object-fit:cover;border-radius:32px;margin-bottom:48px;">

        <div style="font-family:'Maison Neue',sans-serif;font-size:72px;
                    text-transform:uppercase;letter-spacing:.14em;
                    color:#F6DF00;margin-bottom:32px;text-align:center;">
          ${pers.title}
        </div>

        <div style="font-family:'PPEditorialNew',serif;font-size:38px;
                    line-height:1.3;color:#222;text-align:center;
                    max-width:760px;margin-bottom:56px;">
          ${pers.blurb}
        </div>

        <div style="width:100%;margin-bottom:56px;">
          ${renderMetricsBarsForImage(scores)}
        </div>

        <div style="font-family:'Maison Neue',sans-serif;font-size:34px;
                    letter-spacing:.08em;text-transform:uppercase;
                    color:#222;margin-bottom:24px;">
          Concert Picks
        </div>

        <ul style="width:100%;list-style:none;padding:0;margin:0 0 48px 0;">
          ${recs.length
            ? recs.map(c=>`<li style="
                  margin-bottom:24px;padding:26px 32px;border-radius:24px;
                  background:#FFFBE6;border:3px solid #F6DF00;">
                  <div style="font-weight:800;font-size:32px;color:#222;">${c.title}</div>
                  <div style="font-size:24px;color:#666;margin-top:6px;">${c.date} – ${c.venue}</div>
                </li>`).join("")
            : "<li style='font-size:28px;color:#888;'>No matches yet – stay tuned!</li>"}
        </ul>

        <div style="font-family:'PPEditorialNew',serif;font-size:26px;color:#999;">
          mphil.de/quiz
        </div>
      </div>
    </div>
  `;
}

// Helper: Render metrics as colored bars
function renderMetricsBars(scores) {
  // Pick a color for each metric (extend as needed)
  const palette = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-pink-300",
    "bg-green-300",
    "bg-purple-300",
    "bg-orange-300",
    "bg-red-300"
  ];
  // Find min/max for normalization
  const vals = Object.values(scores);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);

  return METRICS.map((metric, i) => {
    const val = scores[metric];
    // Normalize width: always at least 10%, up to 100%
    const width = max === min ? 100 : Math.max(10, ((val - min) / (max - min)) * 100);
    const color = palette[i % palette.length];
    // Label: Capitalize first letter
    const label = metric.charAt(0).toUpperCase() + metric.slice(1);
    return `
      <div class="flex items-center gap-3">
        <span class="w-24 text-left font-head text-sm text-gray-700">${label}</span>
        <div class="flex-1 h-5 rounded-full bg-gray-200 overflow-hidden">
          <div class="${color} h-5 rounded-full transition-all" style="width:${width}%"></div>
        </div>
        <span class="w-8 text-right font-mono text-sm text-gray-600">${val}</span>
      </div>
    `;
  }).join("");
}

// Helper: Calculate scores from a given answers object (for saved results)
function calcScoresFrom(ans) {
  const scores = Object.fromEntries(METRICS.map(m=>[m,0]));
  QUESTIONS.forEach(q=>{
    if(!ans[q.id]) return;
    if(q.type==="choice"||q.type==="image"){
      const opt=q.options.find(o=>o.value===ans[q.id]);
      if(opt?.effects){
        for(const [m,delta] of Object.entries(opt.effects)){
          if(m in scores) scores[m]+=delta;
        }
      }
    }
  });
  return scores;
}

// Save result to localStorage
function saveResult(data) {
  localStorage.setItem("mphil-quiz-result", JSON.stringify(data));
}

// Get saved result from localStorage
function getSavedResult() {
  try {
    return JSON.parse(localStorage.getItem("mphil-quiz-result"));
  } catch {
    return null;
  }
}

// Clear saved result and retake quiz
function clearSavedResultAndRetake() {
  localStorage.removeItem("mphil-quiz-result");
  startQuiz();
}

/* ──────────────────────────────────────────────────────────────
   5.  BOOTSTRAP & GLOBALS
   ──────────────────────────────────────────────────────────────*/
renderIntro();

window.startQuiz       = startQuiz;
window.selectAnswer    = selectAnswer;
window.goBack          = goBack;
window.goNext          = goNext;
window.handleTextInput = handleTextInput;
window.renderIntro     = renderIntro;
window.viewSavedResult = viewSavedResult;
window.clearSavedResultAndRetake = clearSavedResultAndRetake;
window.shareResultImage = shareResultImage;

// Helper for pretty bars in the share image
function renderMetricsBarsForImage(scores) {
  const palette = [
    "#F6DF00", "#7DD3FC", "#F9A8D4", "#6EE7B7", "#C4B5FD", "#FDBA74", "#FCA5A5"
  ];
  const vals = Object.values(scores);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  return METRICS.map((metric, i) => {
    const val = scores[metric];
    const width = max === min ? 100 : Math.max(10, ((val - min) / (max - min)) * 100);
    const color = palette[i % palette.length];
    const label = metric.charAt(0).toUpperCase() + metric.slice(1);
    return `
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
        <span style="width:180px;text-align:left;font-family:'Maison Neue',sans-serif;font-size:22px;color:#222;">${label}</span>
        <div style="flex:1;height:32px;border-radius:16px;background:#eee;overflow:hidden;">
          <div style="height:32px;border-radius:16px;background:${color};width:${width}%"></div>
        </div>
        <span style="width:48px;text-align:right;font-family:monospace;font-size:22px;color:#666;">${val}</span>
      </div>
    `;
  }).join("");
}

function shareResultImage() {
  const card = document.getElementById('share-card');
  if (!card) return;
  card.style.display = 'flex';
  html2canvas(card, {backgroundColor: null, useCORS: true, scale: 2}).then(canvas => {
    card.style.display = 'none';
    // Download the image or open in new tab for sharing
    const link = document.createElement('a');
    link.download = 'mphil-quiz-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}
