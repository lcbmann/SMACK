// --------------------------------------------------------------
//   CONCERT-QUIZ  •  METRIC EDITION  •  multilingual
// --------------------------------------------------------------

import {
  DIMENSIONS,
  QUESTIONS,
  ARCHETYPES,
  CONCERTS,
  SUBTYPE_LABEL,
  SUBTYPE_ARCHETYPE_DESCRIPTIONS,
  ARCHETYPE_COLORS,
  TRANSLATIONS,
  LANG, setLang
} from './quiz-config.js';

/* ────────────────────────────────────────────────────────────
   1.  STATE
   ────────────────────────────────────────────────────────────*/
const quizContainer = document.getElementById("quiz-container");
let answers = {};
let currentIndex = 0;

/* ────────────────────────────────────────────────────────────
   2.  RENDERING HELPERS
   ────────────────────────────────────────────────────────────*/
const $ = (sel) => document.querySelector(sel);

function t(key, ...rest) {
  const str = TRANSLATIONS[LANG][key];
  return typeof str === "function" ? str(...rest) : str;
}

function renderIntro() {
  answers = {}; currentIndex = 0;
  const saved = getSavedResult();

  quizContainer.innerHTML = /*html*/`
    <section class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <!-- Fullscreen background image and overlay -->
      <img src="assets/concert2.jpg" class="fixed inset-0 w-full h-full object-cover z-0" alt="" />
      <div class="fixed inset-0 bg-black/60 z-0"></div>

      <!-- Top right purple shape image (flush with top right) -->
      <img src="assets/shapes/shapes1.png"
           class="absolute top-0 right-0 z-10 pointer-events-none object-contain"
           style="width:120px; height:auto; max-width:40vw;" alt="" />

      <!-- Bottom left pink shape image (flush with bottom left, smaller) -->
      <img src="assets/shapes/shapes2.png"
           class="absolute bottom-0 left-0 z-10 pointer-events-none object-contain"
           style="width:70px; height:auto; max-width:22vw;" alt="" />

      <!-- Yellow "M" SVG (top left, keep as SVG for sharpness) -->
      <div class="absolute" style="left:24px; top:39px; z-index:11;">
        <svg width="34" height="85" viewBox="0 0 34 85" fill="none">
          <path d="M22.2313 6.22368H11.7687V0H0V85H11.7687V74.939H22.2313V78.7995H34V0.987322H22.2313V6.22368Z" fill="#FEE843"/>
        </svg>
      </div>

      <!-- Main content -->
      <div class="relative z-20 flex flex-col items-center justify-center w-full">
        <div class="text-white text-center font-head text-3xl sm:text-5xl md:text-4xl lg:text-5xl mb-8 drop-shadow-lg tracking-tight uppercase" style="letter-spacing:.12em;">
          ${t("whichConcertType")}
        </div>
        <p class="text-lg text-gray-200 mb-10 max-w-md mx-auto font-body text-center">
          ${t("intro")}
        </p>
        <div class="flex flex-col gap-4 w-full max-w-xs mx-auto">
          ${
            saved ? `
            <button class="btn btn-primary" onclick="viewSavedResult()">${t("viewResult")}</button>
            <button class="btn btn-secondary" onclick="clearSavedResultAndRetake()">${t("retakeQuiz")}</button>
            ` : `
            <button class="btn btn-primary" onclick="startQuiz()">${t("takeQuiz")}  →</button>
            `
          }
        </div>
      </div>
      <!-- Language selector -->
      <div class="absolute top-4 right-4 z-50">
        <div class="relative inline-block">
          <button id="lang-toggle-btn" class="btn btn-secondary btn-xs px-2 py-1 rounded-full flex items-center" style="font-size:1.1rem;" type="button">
            <i class="fas fa-globe"></i>
          </button>
          <div id="lang-dropdown" class="hidden absolute right-0 mt-1 bg-white border rounded shadow-lg text-sm">
            <button class="block w-full px-4 py-2 text-left hover:bg-gray-100" onclick="setLangAndRerender('en')">English</button>
            <button class="block w-full px-4 py-2 text-left hover:bg-gray-100" onclick="setLangAndRerender('de')">Deutsch</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function startQuiz() { renderQuestion(0); }

function renderQuestion(i) {
  const q = QUESTIONS[i];
  if (!q) return renderResults();

  const progress = Math.round(((i + 1) / QUESTIONS.length) * 100);

  quizContainer.innerHTML = /*html*/`
    <div class="relative max-w-2xl mx-auto bg-white/95 rounded-3xl shadow-2xl px-8 py-12">
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-[var(--mphil-yellow)] rounded-full shadow-lg"></div>

      <!-- progress bar -->
      <div class="fixed top-0 left-0 w-full z-30">
        <div class="mx-auto max-w-2xl px-8 pt-6">
          <div class="progress-track h-3 bg-gray-200 rounded-full shadow">
            <div class="progress-bar h-3 rounded-full" style="width:${progress}%"></div>
          </div>
        </div>
      </div>

      <div class="mb-8 flex justify-between text-sm text-gray-500 font-head">
        <span>${t("question", i + 1, QUESTIONS.length)}</span><span>${progress}%</span>
      </div>

      <h3 class="text-3xl font-head mb-8 tracking-tight">${q.text[LANG]}</h3>
      ${renderByType(q)}

      <div class="flex justify-between mt-10">
        <button class="btn btn-secondary ${i === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${i === 0 ? 'disabled' : ''} onclick="goBack()">← Back</button>
        <button id="next-btn" class="btn btn-primary ${answers[q.id] ? '' : 'opacity-30 cursor-not-allowed'}"
                ${answers[q.id] ? '' : 'disabled'} onclick="goNext(${i})">Next →</button>
      </div>
    </div>`;
}

function renderByType(q) {
  if (q.type === "choice") {
    return `<div class="space-y-4">
      ${q.options.map(opt => {
        const selected = answers[q.id] === opt.value;
        return `
          <button class="w-full text-left card ${selected ? 'card-selected' : ''}"
                  onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
            <div class="flex items-start gap-4">
              <div class="card-icon ${selected ? 'bg-[var(--mphil-yellow)]' : ''}">
                <i class="${opt.icon} text-lg ${selected ? 'text-black' : 'text-gray-700'}"></i>
              </div>
              <div>
                <h4 class="font-semibold mb-1">${opt.label[LANG]}</h4>
                ${opt.description ? `<p class="text-sm text-gray-600">${opt.description[LANG] || ""}</p>` : ""}
              </div>
            </div>
          </button>`; }).join("")}
    </div>`;
  }

  if (q.type === "text") {
    return `<textarea id="text-q-${q.id}" rows="4" placeholder="${q.placeholder?.[LANG] || ''}"
              class="w-full bg-gray-50 border-2 border-gray-300 p-4 focus:border-[var(--mphil-yellow)]"
              oninput="handleTextInput('${q.id}', this)">${answers[q.id] || ''}</textarea>`;
  }

  if (q.type === "image") {
    return `<div class="grid sm:grid-cols-2 gap-6">
      ${q.options.map(opt => {
        const selected = answers[q.id] === opt.value;
        return `
          <div class="group cursor-pointer relative"
               onclick="selectAnswer('${q.id}','${opt.value}',${currentIndex})">
            <img src="${opt.img}" alt="${opt.label[LANG]}"
                 class="img-card w-full h-48 object-cover border-4 ${selected ? 'border-[var(--mphil-yellow)]' : 'border-transparent'}">
            <span class="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs py-1 text-center">
              ${opt.label[LANG]}
            </span>
          </div>`;
      }).join("")}
    </div>`;
  }

  return "<p>Unsupported question type</p>";
}

/* ────────────────────────────────────────────────────────────
   3.  STATE + NAVIGATION
   ────────────────────────────────────────────────────────────*/
function selectAnswer(id, val, idx) {
  answers[id] = val;
  if (QUESTIONS[idx].type !== "text") renderQuestion(idx);
}

function handleTextInput(id, el) {
  answers[id] = el.value;
  const btn = $("#next-btn");
  if (!btn) return;
  if (el.value.trim()) {
    btn.classList.remove("opacity-30", "cursor-not-allowed");
    btn.removeAttribute("disabled");
  } else {
    btn.classList.add("opacity-30", "cursor-not-allowed");
    btn.setAttribute("disabled", "disabled");
  }
}

function goBack()  { if (currentIndex > 0) { currentIndex--; renderQuestion(currentIndex); } }
function goNext(i) { if (answers[QUESTIONS[i].id]) { currentIndex = i + 1; renderQuestion(currentIndex); } }

/* ────────────────────────────────────────────────────────────
   4.  SCORING & RESULT BUILDING
   ────────────────────────────────────────────────────────────*/
const calcScores = () => {
  const scores = Object.fromEntries(DIMENSIONS.map(m => [m, 0]));
  QUESTIONS.forEach(q => {
    if (!answers[q.id] || !q.options[0].effects) return;
    const opt = q.options.find(o => o.value === answers[q.id]);
    if (opt?.effects) Object.entries(opt.effects).forEach(([k, d]) => (scores[k] += d));
  });
  // No clamping!
  return scores;
};

function computeArchetype() {
  const scores = calcScores();
  return ARCHETYPES.find(a => a.rule(scores)) || { title: { en: "Undecided", de: "Unentschieden" }, blurb: { en: "We need more data…", de: "Wir brauchen mehr Daten…" }, id:"none" };
}

function renderResults() {
  const scores = calcScores();
  const archetype = computeArchetype();
  const subtypeKey = answers.q3;
  const subtype   = SUBTYPE_LABEL[subtypeKey] ? SUBTYPE_LABEL[subtypeKey][LANG] + " " : "";
  const recs      = CONCERTS[archetype.id] || [];
  const description = SUBTYPE_ARCHETYPE_DESCRIPTIONS[subtypeKey]?.[archetype.id]?.[LANG] || archetype.blurb[LANG];
  const color = ARCHETYPE_COLORS[archetype.id]?.[subtypeKey] || ARCHETYPE_COLORS[archetype.id]?.base || "#ccc";

  /* persist */
  saveResult({ archetypeId: archetype.id, recs, answers });

  /* UI */
  quizContainer.innerHTML = /*html*/`
    <div class="max-w-xl mx-auto text-center animate-fadein">
      <h2 class="text-4xl font-head mb-6" style="color:${color}">${subtype}${archetype.title[LANG]}</h2>
      <p class="text-lg text-gray-700 mb-8 font-body">${description}</p>

      <h3 class="text-2xl font-head mb-4">${t("yourProfile")}</h3>
      <div class="space-y-3 mb-10">${renderMetricBars(scores)}</div>

      <h3 class="text-2xl font-head mb-4">${t("concertPicks")}</h3>
      <ul class="space-y-3 mb-12">
        ${recs.length ? recs.map(c => `
          <li class="border p-4 rounded-xl text-left">
            <span class="block font-semibold">${c.title}</span>
            <span class="text-sm text-gray-500">${c.date} – ${c.venue}</span>
            <a href="${c.link}" target="_blank" rel="noopener"
               class="text-[var(--mphil-yellow)] underline text-sm mt-1 block">View details</a>
          </li>`).join("") : `<li>${t("noMatches")}</li>`}
      </ul>

      <button class="btn btn-primary btn-sm mb-3" onclick="shareResultImage()">${t("shareImage")}</button>
      <button class="btn btn-primary btn-sm mb-3" onclick="window.open('https://www.mphil.de/abonnement/infomaterial-bestellen/newsletter','_blank')">
        ${t("newsletter")}
      </button>
      <button class="btn btn-secondary" onclick="renderIntro()">${t("backToStart")}</button>

      ${renderShareCardHTML(archetype, scores, recs, subtype, description)}
    </div>`;
}

/* ────────────────────────────────────────────────────────────
   5.  VISUAL HELPERS
   ────────────────────────────────────────────────────────────*/
function renderMetricBars(scores) {
  const axisLabels = {
    energy:    { left: t("calm"), right: t("energizing") },
    tradition: { left: t("discovery"), right: t("tradition") }
  };

  // Find the maximum absolute value for normalization
  const maxAbs = Math.max(2, ...Object.values(scores).map(Math.abs)); // 2 is your max possible

  return DIMENSIONS.map((m) => {
    const val = scores[m];
    const leftLabel = axisLabels[m]?.left || "Left";
    const rightLabel = axisLabels[m]?.right || "Right";
    // Normalize value to [-1, 1]
    const norm = Math.max(-1, Math.min(1, val / maxAbs));
    // Dot position: 0% (far left) to 100% (far right), 50% is center
    const dotPos = 50 + norm * 50;

    return `
      <div class="flex flex-col gap-1 mb-2">
        <div class="flex justify-between text-xs font-head text-gray-600 mb-1">
          <span>${leftLabel}</span>
          <span>${rightLabel}</span>
        </div>
        <div class="relative h-5 rounded-full overflow-hidden" style="background: linear-gradient(90deg, #7DD3FC 0%, #F6DF00 100%);">
          <div style="
            position:absolute;
            top:50%; left:${dotPos}%;
            transform:translate(-50%,-50%);
            width:22px;height:22px;
            background:#fff;
            border:4px solid #222;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,0,0,0.10);
            z-index:2;
            transition:left 0.3s;
          "></div>
        </div>
        <div class="text-center text-xs text-gray-700 mt-1 font-mono">
          ${Math.abs(val)} ${val === 0 ? "" : (val > 0 ? rightLabel : leftLabel)}
        </div>
      </div>
    `;
  }).join("");
}

function renderMetricsBarsForImage(scores) {
  const axisLabels = {
    energy:    { left: t("calm"), right: t("energizing") },
    tradition: { left: t("discovery"), right: t("tradition") }
  };
  const maxAbs = Math.max(2, ...Object.values(scores).map(Math.abs));
  return DIMENSIONS.map((m) => {
    const val = scores[m];
    const leftLabel = axisLabels[m]?.left || "Left";
    const rightLabel = axisLabels[m]?.right || "Right";
    const norm = Math.max(-1, Math.min(1, val / maxAbs));
    const dotPos = 50 + norm * 50;
    return `
      <div style="margin-bottom:32px;">
        <div style="display:flex;justify-content:space-between;font-family:'Maison Neue',sans-serif;font-size:22px;color:#666;margin-bottom:6px;">
          <span>${leftLabel}</span>
          <span>${rightLabel}</span>
        </div>
        <div style="position:relative;height:32px;border-radius:16px;overflow:hidden;background:linear-gradient(90deg,#7DD3FC 0%,#F6DF00 100%);">
          <div style="
            position:absolute;
            top:50%; left:${dotPos}%;
            transform:translate(-50%,-50%);
            width:32px;height:32px;
            background:#fff;
            border:6px solid #222;
            border-radius:50%;
            box-shadow:0 2px 12px rgba(0,0,0,0.10);
            z-index:2;
            transition:left 0.3s;
          "></div>
        </div>
        <div style="text-align:center;font-family:monospace;font-size:20px;color:#444;margin-top:6px;">
          ${Math.abs(val)} ${val === 0 ? "" : (val > 0 ? rightLabel : leftLabel)}
        </div>
      </div>
    `;
  }).join("");
}

/* share-card (hidden poster) */
function renderShareCardHTML(arch, scores, recs, subtype = "", description = "", subtypeKey = "romantic") {
  const color = ARCHETYPE_COLORS[arch.id]?.[subtypeKey] || ARCHETYPE_COLORS[arch.id]?.base || "#ccc";
  return /*html*/`
    <div id="share-card" style="width:1200px;height:1600px;position:fixed;left:-9999px;top:0;
         background:#FFFBE6;display:flex;align-items:center;justify-content:center;pointer-events:none;">
      <div style="width:940px;padding:72px 64px;background:white;border-radius:56px;
                  box-shadow:0 16px 64px ${color}44;display:flex;flex-direction:column;align-items:center;">
        <img src="assets/concert.jpg" alt="" style="width:620px;height:350px;object-fit:cover;border-radius:32px;margin-bottom:48px;">
        <div style="font-family:'Maison Neue';font-size:72px;text-transform:uppercase;letter-spacing:.14em;
                    color:${color};margin-bottom:32px;text-align:center;">
          ${subtype}${arch.title[LANG]}
        </div>
        <div style="font-family:'PPEditorialNew';font-size:38px;line-height:1.3;color:#222;text-align:center;max-width:760px;margin-bottom:56px;">
          ${description}
        </div>
        <div style="width:100%;margin-bottom:56px;">${renderMetricsForImage(scores, color)}</div>
        <div style="font-family:'Maison Neue';font-size:34px;text-transform:uppercase;letter-spacing:.08em;color:#222;margin-bottom:24px;">
          ${t("concertPicks")}
        </div>
        <ul style="width:100%;list-style:none;padding:0;margin:0 0 48px 0;">
          ${recs.length ? recs.map(c=>`
            <li style="margin-bottom:24px;padding:26px 32px;border-radius:24px;background:#FFFBE6;border:3px solid ${color};">
              <div style="font-weight:800;font-size:32px;color:#222;">${c.title}</div>
              <div style="font-size:24px;color:#666;margin-top:6px;">${c.date} – ${c.venue}</div>
            </li>`).join("") : `<li style='font-size:28px;color:#888;'>${t("noMatches")}</li>`}
        </ul>
        <div style="font-family:'PPEditorialNew';font-size:26px;color:#999;">mphil.de/quiz</div>
      </div>
    </div>`;
}

function renderMetricsForImage(scores) {
  const axisLabels = {
    energy:    { left: t("calm"), right: t("energizing") },
    tradition: { left: t("discovery"), right: t("tradition") }
  };
  const maxAbs = Math.max(2, ...Object.values(scores).map(Math.abs));
  return DIMENSIONS.map((m) => {
    const val = scores[m];
    const leftLabel = axisLabels[m]?.left || "Left";
    const rightLabel = axisLabels[m]?.right || "Right";
    const norm = Math.max(-1, Math.min(1, val / maxAbs));
    const dotPos = 50 + norm * 50;
    return `
      <div style="margin-bottom:32px;">
        <div style="display:flex;justify-content:space-between;font-family:'Maison Neue',sans-serif;font-size:22px;color:#666;margin-bottom:6px;">
          <span>${leftLabel}</span>
          <span>${rightLabel}</span>
        </div>
        <div style="position:relative;height:32px;border-radius:16px;overflow:hidden;background:linear-gradient(90deg,#7DD3FC 0%,#F6DF00 100%);">
          <div style="
            position:absolute;
            top:50%; left:${dotPos}%;
            transform:translate(-50%,-50%);
            width:32px;height:32px;
            background:#fff;
            border:6px solid #222;
            border-radius:50%;
            box-shadow:0 2px 12px rgba(0,0,0,0.10);
            z-index:2;
            transition:left 0.3s;
          "></div>
        </div>
        <div style="text-align:center;font-family:monospace;font-size:20px;color:#444;margin-top:6px;">
          ${Math.abs(val)} ${val === 0 ? "" : (val > 0 ? rightLabel : leftLabel)}
        </div>
      </div>
    `;
  }).join("");
}

/* ────────────────────────────────────────────────────────────
   6.  LOCAL-STORAGE + SHARE
   ────────────────────────────────────────────────────────────*/
const saveResult   = (data)=>localStorage.setItem("mphil-quiz",JSON.stringify(data));
const getSavedResult=()=>{ try{return JSON.parse(localStorage.getItem("mphil-quiz"));}catch{return null;} };
const clearSavedResultAndRetake = ()=>{ localStorage.removeItem("mphil-quiz"); startQuiz(); };

function shareResultImage() {
  const card = $("#share-card"); if (!card) return;
  card.style.display = "flex";
  html2canvas(card,{backgroundColor:null,useCORS:true,scale:2}).then(canvas=>{
    card.style.display = "none";
    const link = document.createElement("a");
    link.download = "mphil-quiz-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

/* ────────────────────────────────────────────────────────────
   7.  BOOTSTRAP + GLOBALS FOR INLINE HANDLERS
   ────────────────────────────────────────────────────────────*/
renderIntro();

Object.assign(window,{
  startQuiz, viewSavedResult, clearSavedResultAndRetake,
  selectAnswer, goBack, goNext, handleTextInput, renderIntro, shareResultImage, toggleLang
});

function viewSavedResult() {
  const saved = getSavedResult();
  if (!saved) return renderIntro();
  answers = saved.answers || {};
  renderResults();
}

function toggleLang() {
  setLang(LANG === "en" ? "de" : "en");
  // re-render whatever view we're on
  if (currentIndex === 0 && Object.keys(answers).length === 0) {
    renderIntro();
  } else if (currentIndex >= QUESTIONS.length) {
    renderResults();
  } else {
    renderQuestion(currentIndex);
  }
}

function setLangAndRerender(lang) {
  setLang(lang);
  // re-render whatever view we're on
  if (currentIndex === 0 && Object.keys(answers).length === 0) {
    renderIntro();
  } else if (currentIndex >= QUESTIONS.length) {
    renderResults();
  } else {
    renderQuestion(currentIndex);
  }
}
window.setLangAndRerender = setLangAndRerender;

document.addEventListener("click", function(e) {
  const btn = document.getElementById("lang-toggle-btn");
  const dd  = document.getElementById("lang-dropdown");
  if (!btn || !dd) return;
  if (btn.contains(e.target)) {
    dd.classList.toggle("hidden");
  } else if (!dd.contains(e.target)) {
    dd.classList.add("hidden");
  }
});
