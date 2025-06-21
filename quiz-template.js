// --------------------------------------------------------------
//   CONCERT-QUIZ  •  METRIC EDITION  •  multilingual
// --------------------------------------------------------------

import {
  DIMENSIONS,
  QUESTIONS,
  ARCHETYPES,
  SUBTYPE_LABEL,
  SUBTYPE_ARCHETYPE_DESCRIPTIONS,
  ARCHETYPE_COLORS,
  TRANSLATIONS,
  LANG, setLang,
  COLOR_SEQUENCE
} from './quiz-config.js';

import { getConcertsForResult } from "./concert-filters.js";

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

      <!-- Top right purple shape image (overlap top right corner) -->
      <img src="assets/shapes/shapes1.png"
           class="absolute top-0 right-0 z-20 pointer-events-none object-contain"
           style="width:150px; height:auto; max-width:40vw;" alt="" />

      <!-- Bottom left pink shape image (overlap bottom left corner, smaller) -->
      <img src="assets/shapes/shapes2.png"
           class="absolute bottom-0 left-0 z-20 pointer-events-none object-contain"
           style="width:60px; height:auto; max-width:22vw; left:-2px; bottom:-12px;" alt="" />

      <!-- Yellow "M" SVG (top left, keep as SVG for sharpness) -->
      <div class="absolute" style="left:24px; top:39px; z-index:11;">
        <svg width="34" height="85" viewBox="0 0 34 85" fill="none">
          <path d="M22.2313 6.22368H11.7687V0H0V85H11.7687V74.939H22.2313V78.7995H34V0.987322H22.2313V6.22368Z" fill="#FEE843"/>
        </svg>
      </div>

      <!-- Main content -->
     <div class="relative z-20 flex flex-col items-center justify-center w-full animate-fadein">
        <div class="text-white text-center font-head text-2xl sm:text-3xl md:text-3xl lg:text-4xl mb-6 drop-shadow-lg tracking-tight uppercase mx-auto max-w-sm" style="letter-spacing:.12em;">
          ${t("whichConcertType")}
        </div>

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
  // Color cycling
  const colorIdx = i % COLOR_SEQUENCE.length;
  const colorSet = COLOR_SEQUENCE[colorIdx];

  const bgColor = colorSet.bgColor;
  const optionBg = colorSet.optionBg;
  const optionText = colorSet.optionText;
  const optionBorder = colorSet.optionBorder;
  const nextBg = colorSet.nextBg || "#FEE843";
  const nextText = colorSet.nextText || "#000";

  const q = QUESTIONS[i];
  if (!q) return renderResults();

  // For multi-select, answers[q.id] is an array; for others, it's a string
  const isMulti = q.type === "multi";
  const selectedAnswers = isMulti ? (answers[q.id] || []) : answers[q.id];
  const hasAnswer = isMulti ? Array.isArray(selectedAnswers) && selectedAnswers.length > 0 : !!selectedAnswers;

  // Shape image logic (larger for shapes7 and shapes8)
  let shapeImgHtml = "";
  if (q.shapeImg && q.shapePos) {
    let width = 140;
    if (q.shapeImg.includes("shapes7") || q.shapeImg.includes("shapes8")) {
      width = 180;
    }
    if (q.shapePos === "bottom-right") {
      shapeImgHtml = `<img src="${q.shapeImg}" class="absolute bottom-0 right-0 z-10 pointer-events-none object-contain" style="width:${width}px; height:auto; max-width:40vw;" alt="" />`;
    } else if (q.shapePos === "bottom-left") {
      shapeImgHtml = `<img src="${q.shapeImg}" class="absolute bottom-0 left-0 z-10 pointer-events-none object-contain" style="width:${width}px; height:auto; max-width:40vw;" alt="" />`;
    }
  }

  // Only animate on first render of the question, not on answer selection
  const shouldAnimate = !hasAnswer;

  // --- AUDIO TYPE ---
  if (q.type === "audio") {
    quizContainer.innerHTML = /*html*/`
      <section class="relative w-full min-h-screen overflow-hidden" style="background:${bgColor};">
        <img src="assets/logo.png" alt="Logo" class="absolute top-4 left-4 z-20 w-12 h-12 object-contain pointer-events-none" />
        ${shapeImgHtml}
        <div class="flex flex-col items-center w-full min-h-screen pt-24 pb-12${shouldAnimate ? ' animate-fadein' : ''}">
          <div class="mb-4 text-black font-serif" style="font-family:'PP Editorial New',serif;font-size:14px;">
            ${t("question", i + 1, QUESTIONS.length)}
          </div>
          <div class="mb-8 w-full flex justify-center">
            <h3 class="text-black text-2xl sm:text-3xl font-serif text-center mx-auto max-w-xs" style="font-family:'PP Editorial New',serif;font-weight:400;">
              ${q.text[LANG]}
            </h3>
          </div>
          <div class="flex flex-col gap-4 w-full max-w-md mx-auto px-6">
            ${q.options.map((opt, idx) => {
              const selected = selectedAnswers === opt.value;
              // Always use white text if background is black
              const isBlackBg = (optionBg === "#000" || optionBg.toLowerCase() === "black" || optionBg === "black");
              const textColor = isBlackBg ? "#fff" : optionText;
              return `
                <div
                  class="w-full p-2 flex items-center gap-2 border outline outline-1 outline-offset-[-1px] outline-black rounded-none cursor-pointer transition
                    ${selected ? 'ring-4 ring-yellow-300 shadow-lg scale-105' : ''}
                  "
                  onclick="selectAnswer('${q.id}','${opt.value}',${i},false)"
                  style="
                    background:${selected ? bgColor : optionBg};
                    color:${textColor};
                    border-color:${optionBorder};
                    box-shadow:${selected ? '0 4px 24px 0 rgba(0,0,0,0.18)' : 'none'};
                    transition: box-shadow 0.2s, transform 0.2s;
                  "
                >
                  <button
                    type="button"
                    class="ml-2 bg-transparent text-black rounded-full flex items-center justify-center"
                    onclick="event.stopPropagation(); playAudioClip('${opt.audio}', this);"
                    title="${t('playAudio')}"
                    tabindex="-1"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <div class="flex flex-col flex-1 min-w-0 ml-2">
                    <div class="text-sm font-bold font-['Maison_Neue']" style="color:${textColor};">${opt.label[LANG]}</div>
                    <div class="text-xs font-bold font-['Maison_Neue']" style="color:${textColor};">${opt.description?.[LANG] || ""}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
        <div class="absolute left-0 w-full flex justify-between px-8 z-20" style="bottom: 80px;">
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition
              ${i === 0 ? 'opacity-50 pointer-events-none' : ''}"
            style="background:${nextBg};color:${nextText};"
            onclick="goBack()"
            ${i === 0 ? 'disabled' : ''}
          >&lt; ${t("previous")}</button>
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition
              ${hasAnswer ? '' : 'opacity-50 pointer-events-none'}"
            style="background:${nextBg};color:${nextText};"
            id="next-btn"
            onclick="goNext(${i})"
            ${hasAnswer ? '' : 'disabled'}
          >${t("next")} &gt;</button>
        </div>
      </section>
    `;
    return;
  }

  // --- SLIDER TYPE ---
  if (q.type === "slider") {
    if (typeof answers[q.id] !== "number") {
      answers[q.id] = 3;
    }
    const value = answers[q.id];
    const min = 1, max = 6;

    quizContainer.innerHTML = /*html*/`
      <section class="relative w-full min-h-screen overflow-hidden" style="background:${bgColor};">
        <img src="assets/logo.png" alt="Logo" class="absolute top-4 left-4 z-20 w-12 h-12 object-contain pointer-events-none" />
        ${shapeImgHtml}
        <div class="flex flex-col items-center w-full min-h-screen pt-24 pb-12${shouldAnimate ? ' animate-fadein' : ''}">
          <div class="mb-4 text-black font-serif" style="font-family:'PP Editorial New',serif;font-size:14px;">
            ${t("question", i + 1, QUESTIONS.length)}
          </div>
          <div class="mb-8 w-full flex justify-center">
            <h3 class="text-black text-2xl sm:text-3xl font-serif text-center mx-auto max-w-xs" style="font-family:'PP Editorial New',serif;font-weight:400;">
              ${q.text[LANG]}
            </h3>
          </div>
          <div class="flex flex-col items-center gap-4 w-full max-w-md mx-auto mt-8">
            <div
              class="relative flex items-center justify-center select-none"
              style="height:110px; width:324px;"
              id="battery-slider"
            >
              <div class="absolute inset-0 z-10" style="cursor:pointer;" id="battery-slider-hitbox"></div>
              <div class="flex items-end gap-0 relative z-20" style="position:relative;">
                ${[1,2,3,4,5,6].map(idx => `
                  <div
                    class="flex flex-col items-center"
                    style="margin-right:${idx < 6 ? '0.25rem' : '0'};"
                  >
                    <div
                      class="transition-all duration-150 battery-cell"
                      data-idx="${idx}"
                      style="
                        width:48px;
                        height:80px;
                        border:2px solid #000;
                        border-radius:${idx===1?'8px 0 0 8px':idx===6?'0 8px 8px 0':'0'};
                        background:${value >= idx ? '#8BC27D' : '#fff'};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        cursor:pointer;
                        position:relative;
                        user-select:none;
                      "
                    ></div>
                    <div class="text-black text-base font-normal font-['PP_Editorial_New'] mt-2">${idx}</div>
                  </div>
                `).join("")}
                <div style="position:absolute;right:-18px;top:18px;">
                  <svg width="15" height="44" viewBox="0 0 15 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H7C11.4183 0 15 3.58172 15 8V36C15 40.4183 11.4183 44 7 44H0V0Z" fill="black"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute left-0 w-full flex justify-between px-8 z-20" style="bottom: 80px;">
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition
              ${i === 0 ? 'opacity-50 pointer-events-none' : ''}"
            style="background:${nextBg};color:${nextText};"
            onclick="goBack()"
            ${i === 0 ? 'disabled' : ''}
          >&lt; ${t("previous")}</button>
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition"
            style="background:${nextBg};color:${nextText};"
            id="next-btn"
            onclick="goNext(${i})"
          >${t("next")} &gt;</button>
        </div>
      </section>
    `;

    setTimeout(() => {
      const slider = document.getElementById("battery-slider");
      const hitbox = document.getElementById("battery-slider-hitbox");
      if (!slider || !hitbox) return;
      let dragging = false;

      function getCellIdxFromEvent(e) {
        const rect = hitbox.getBoundingClientRect();
        let clientX;
        if (e.touches && e.touches.length) {
          clientX = e.touches[0].clientX;
        } else {
          clientX = e.clientX;
        }
        const x = clientX - rect.left;
        const cellWidth = rect.width / 6;
        let idx = Math.floor(x / cellWidth) + 1;
        idx = Math.max(1, Math.min(6, idx));
        return idx;
      }

      function setFromEvent(e) {
        if (typeof e.preventDefault === "function") e.preventDefault();
        const idx = getCellIdxFromEvent(e);
        if (answers[q.id] !== idx) {
          answers[q.id] = idx;
          renderQuestion(i);
        }
      }

      hitbox.addEventListener("mousedown", e => {
        dragging = true;
        setFromEvent(e);
      });
      hitbox.addEventListener("touchstart", e => {
        dragging = true;
        setFromEvent(e);
      }, {passive: false});

      window.addEventListener("mousemove", e => {
        if (dragging) setFromEvent(e);
      });
      window.addEventListener("touchmove", e => {
        if (dragging) setFromEvent(e);
      }, {passive: false});

      window.addEventListener("mouseup", () => { dragging = false; });
      window.addEventListener("touchend", () => { dragging = false; });

      slider.querySelectorAll('.battery-cell').forEach(cell => {
        cell.addEventListener('click', e => {
          const idx = Number(cell.getAttribute('data-idx'));
          answers[q.id] = idx;
          renderQuestion(i);
        });
      });
    }, 0);

    return;
  }

  // --- IMAGE TYPE (image-only, no label) ---
  if (q.type === "image") {
    quizContainer.innerHTML = /*html*/`
      <section class="relative w-full min-h-screen overflow-hidden" style="background:${bgColor};">
        <img src="assets/logo.png" alt="Logo" class="absolute top-4 left-4 z-20 w-12 h-12 object-contain pointer-events-none" />
        ${shapeImgHtml}
        <div class="flex flex-col items-center w-full min-h-screen pt-24 pb-12${shouldAnimate ? ' animate-fadein' : ''}">
          <div class="mb-4 text-black font-serif" style="font-family:'PP Editorial New',serif;font-size:14px;">
            ${t("question", i + 1, QUESTIONS.length)}
          </div>
          <div class="mb-8 w-full flex justify-center">
            <h3 class="text-black text-2xl sm:text-3xl font-serif text-center mx-auto max-w-xs" style="font-family:'PP Editorial New',serif;font-weight:400;">
              ${q.text[LANG]}
            </h3>
          </div>
          <div class="w-full flex flex-wrap justify-center gap-6 mb-16 mt-8">
            ${q.options.map((opt, idx) => {
              const selected = selectedAnswers === opt.value;
              return `
                <button
                  class="border-4 ${selected ? 'border-yellow-400' : 'border-transparent'} rounded-lg overflow-hidden transition-all duration-150 focus:outline-none"
                  style="width:140px;height:180px;background:#fff;"
                  onclick="selectAnswer('${q.id}','${opt.value}',${i},false)"
                >
                  <img src="${opt.img}" alt="" class="object-cover w-full h-full" />
                </button>
              `;
            }).join("")}
          </div>
        </div>
        <div class="absolute left-0 w-full flex justify-between px-8 z-20" style="bottom: 140px;">
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition
              ${i === 0 ? 'opacity-50 pointer-events-none' : ''}"
            style="background:${nextBg};color:${nextText};"
            onclick="goBack()"
            ${i === 0 ? 'disabled' : ''}
          >&lt; ${t("previous")}</button>
          <button
            class="rounded font-bold font-head px-5 py-2 text-[14px] transition
              ${hasAnswer ? '' : 'opacity-50 pointer-events-none'}"
            style="background:${nextBg};color:${nextText};"
            id="next-btn"
            onclick="goNext(${i})"
            ${hasAnswer ? '' : 'disabled'}
          >${t("next")} &gt;</button>
        </div>
      </section>
    `;
    return;
  }

  // --- CHOICE TYPE (default) ---
  quizContainer.innerHTML = /*html*/`
    <section class="relative w-full min-h-screen overflow-hidden" style="background:${bgColor};">
      <img src="assets/logo.png" alt="Logo" class="absolute top-4 left-4 z-20 w-12 h-12 object-contain pointer-events-none" />
      ${shapeImgHtml}
      <div class="flex flex-col items-center w-full min-h-screen pt-24 pb-12${shouldAnimate ? ' animate-fadein' : ''}">
        <div class="mb-4 text-black font-serif" style="font-family:'PP Editorial New',serif;font-size:14px;">
          ${t("question", i + 1, QUESTIONS.length)}
        </div>
        <div class="mb-8 w-full flex justify-center">
          <h3 class="text-black text-2xl sm:text-3xl font-serif text-center mx-auto max-w-xs" style="font-family:'PP Editorial New',serif;font-weight:400;">
            ${q.text[LANG]}
          </h3>
        </div>
        <div class="w-full flex flex-wrap justify-center gap-6 mb-16 mt-8">
          ${q.options.map((opt, idx) => {
            const selected = isMulti
              ? Array.isArray(selectedAnswers) && selectedAnswers.includes(opt.value)
              : selectedAnswers === opt.value;
            const description = opt.description?.[LANG] ? `<div class="text-xs text-gray-600 mt-2">${opt.description[LANG]}</div>` : "";
            return selected ? `
              <span class="relative inline-block w-full max-w-[180px] min-h-[108px]">
                <span class="absolute top-1 left-1 w-full h-full bg-black rounded" style="z-index:0;"></span>
                <button
                  class="
                    border flex flex-col items-center justify-center
                    font-bold font-head text-[14px] text-center transition cursor-pointer w-full min-h-[108px] max-w-[180px] break-words
                  "
                  style="
                    position: relative;
                    background: ${bgColor};
                    color: #000;
                    border-color: ${optionBorder};
                    border-radius: 0;
                    z-index:1;
                    padding: 24px 10px;
                  "
                  onclick="selectAnswer('${q.id}','${opt.value}',${i},${isMulti})"
                >
                  <span class="mb-2"><i class="${opt.icon || ''} text-2xl"></i></span>
                  <span class="break-words text-center">${opt.label[LANG]}</span>
                  ${description}
                </button>
              </span>
            ` : `
              <button
                class="
                  border flex flex-col items-center justify-center
                  font-bold font-head text-[14px] text-center transition cursor-pointer w-full min-h-[108px] max-w-[180px] break-words
                  hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-[#FEE843]
                "
                style="
                  background: ${optionBg};
                  color: ${optionText};
                  border-color: ${optionBorder};
                  border-radius: 0;
                  padding: 24px 10px;
                "
                onclick="selectAnswer('${q.id}','${opt.value}',${i},${isMulti})"
              >
                <span class="mb-2"><i class="${opt.icon || ''} text-2xl"></i></span>
                <span class="break-words text-center">${opt.label[LANG]}</span>
                ${description}
              </button>
            `;
          }).join("")}
        </div>
      </div>
      <div class="absolute left-0 w-full flex justify-between px-8 z-20" style="bottom: 140px;">
        <button
          class="rounded font-bold font-head px-5 py-2 text-[14px] transition
            ${i === 0 ? 'opacity-50 pointer-events-none' : ''}"
          style="background:${nextBg};color:${nextText};"
          onclick="goBack()"
          ${i === 0 ? 'disabled' : ''}
        >&lt; ${t("previous")}</button>
        <button
          class="rounded font-bold font-head px-5 py-2 text-[14px] transition
            ${hasAnswer ? '' : 'opacity-50 pointer-events-none'}"
          style="background:${nextBg};color:${nextText};"
          id="next-btn"
          onclick="goNext(${i})"
          ${hasAnswer ? '' : 'disabled'}
        >${t("next")} &gt;</button>
      </div>
    </section>
  `;
}




// Update selectAnswer to handle multi-select
function selectAnswer(id, val, idx, isMulti = false) {
  const q = QUESTIONS[idx];
  if (q && q.type === "multi") {
    if (!Array.isArray(answers[id])) answers[id] = [];
    const arr = answers[id];
    const i = arr.indexOf(val);
    if (i === -1) {
      arr.push(val);
    } else {
      arr.splice(i, 1);
    }
    // Do not auto-advance for multi-select, just re-render
    renderQuestion(idx);
  } else {
    answers[id] = val;
    renderQuestion(idx);
  }
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
    if (!answers[q.id]) return;
    // Handle slider effect function
    if (q.type === "slider" && typeof q.effects === "function") {
      const eff = q.effects(answers[q.id]);
      if (eff) Object.entries(eff).forEach(([k, d]) => (scores[k] += d));
      return;
    }
    // Handle normal options
    if (!q.options || !q.options[0].effects) return;
    const opt = q.options.find(o => o.value === answers[q.id]);
    if (opt?.effects) Object.entries(opt.effects).forEach(([k, d]) => (scores[k] += d));
  });
  return scores;
};

function computeArchetype() {
  const scores = calcScores();
  return ARCHETYPES.find(a => a.rule(scores)) || { title: { en: "Undecided", de: "Unentschieden" }, blurb: { en: "We need more data…", de: "Wir brauchen mehr Daten…" }, id:"none" };
}

function renderResults() {
  const scores = calcScores();
  const archetype = computeArchetype();
  const archetypeImg = `assets/archetypes/${archetype.id}.png`; // <-- Add this line
  const subtypeKey = answers.q3;
  const subtype   = SUBTYPE_LABEL[subtypeKey] ? SUBTYPE_LABEL[subtypeKey][LANG] + " " : "";
  const description = SUBTYPE_ARCHETYPE_DESCRIPTIONS[subtypeKey]?.[archetype.id]?.[LANG] || archetype.blurb[LANG];
  const color = ARCHETYPE_COLORS[archetype.id]?.[subtypeKey] || ARCHETYPE_COLORS[archetype.id]?.base || "#ccc";
  const baseColor = ARCHETYPE_COLORS[archetype.id]?.base || "#ccc";
  const archetypeBgTop = darkenHex(baseColor, 0.10) + "f0";
  const archetypeBgBottom = "#000000"; // pure black
  const concertBoxColors = [
  "#FEE843", // yellow
  "#A49DCC", // purple
  "#8BC27D", // green
];

  // Get concerts for this archetype using the new filter logic
  const recs = getConcertsForResult(archetype.id, subtypeKey);

  /* persist */
  saveResult({ archetypeId: archetype.id, recs, answers });

  // Always use shapes10.png (left) and shapes9.png (right)
  const leftShapeObj = { src: "assets/shapes/shapes10.png", side: "left" };
  const rightShapeObj = { src: "assets/shapes/shapes9.png", side: "right" };

  // Pick two random vertical positions (in % of section height), with a minimum gap
  function getTwoRandomPercents(min = 10, max = 80, minGap = 25) {
    let first = Math.random() * (max - min) + min;
    let second;
    do {
      second = Math.random() * (max - min) + min;
    } while (Math.abs(first - second) < minGap);
    return [first, second];
  }
  const [rightTop, leftTop] = getTwoRandomPercents();

  // Helper for shape positioning (absolute to section, at random heights)
  function renderResultShape(img, side, topPercent) {
    let width = 200;
    let style = `width:${width}px; height:auto; max-width:40vw; z-index:0; pointer-events:none; opacity:0.85; position:absolute; top:${topPercent}%; transform:translateY(-50%);`;
    if (side === "left") style += "left:0;";
    if (side === "right") style += "right:0;";
    return `<img src="${img}" style="${style}" alt="" />`;
  }

  // --- SHARE IMAGE BUTTON ---
  quizContainer.innerHTML = /*html*/`
    <section class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
         style="background:linear-gradient(180deg,${archetypeBgTop} 0%,${archetypeBgBottom} 100%);">
      <!-- Logo in top left corner -->
      <img src="assets/logo2.png" alt="Logo" class="absolute top-4 left-4 z-30 w-14 h-14 object-contain pointer-events-none" />
      <!-- Two fixed shapes: shapes10.png left, shapes9.png right, at random vertical positions -->
      ${renderResultShape(rightShapeObj.src, "right", rightTop)}
      ${renderResultShape(leftShapeObj.src, "left", leftTop)}
      <div class="relative z-10 flex flex-col items-center w-full">
        <!-- Archetype image with rainbow gradient border -->
        <div class="flex flex-col items-center mt-12 mb-6">
          <div class="relative flex items-center justify-center" style="width:210px;height:314px;">
            <div style="
              position:absolute;
              top:0;left:0;right:0;bottom:0;
              padding:6px;
              border-radius: 1.25rem;
              background: conic-gradient(
                #FEE843 0deg, #A49DCC 72deg, #8BC27D 144deg, #F7C3D9 216deg, #F6DF00 288deg, #FEE843 360deg
              );
              z-index:1;
              width:210px;
              height:314px;
              ">
              <div style="
                width:198px;height:302px;
                border-radius: 1rem;
                overflow:hidden;
                background:#fff;
                margin:auto;
                ">
                <img src="${archetypeImg}" alt="${archetype.title[LANG]}"
                  class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div class="mt-8 text-center text-white text-2xl font-normal font-body">
            ${subtype}${archetype.title[LANG]}
          </div>
        </div>
        <div class="w-80 mx-auto text-white text-sm mb-8" style="font-family:'Maison Neue',sans-serif;">
          ${description}
        </div>
        <div class="w-full flex justify-center">
          <div class="w-56 h-16 mx-auto text-white text-2xl font-normal font-body mb-4 text-center">${t("concertPicks")}</div>
        </div>
        <div class="flex flex-wrap gap-8 items-stretch justify-center w-full max-w-4xl mb-8">
          ${
            recs.length
              ? recs
                  .filter(c => new Date(c.date) >= new Date())
                  .sort((a, b) =>
                    new Date(`${a.date}T${(a.start ?? "00:00").slice(0,5)}`) -
                    new Date(`${b.date}T${(b.start ?? "00:00").slice(0,5)}`)
                  )
                  .slice(0, 5)
                  .map((c, idx) => `
                    <div class="flex-1 min-w-[260px] max-w-[320px] p-5 flex flex-col justify-between"
                      style="background:${concertBoxColors[idx % concertBoxColors.length]}; border-radius:0; box-shadow:0 4px 24px 0 rgba(0,0,0,0.10);">
                      <div>
                        <div class="text-black text-sm font-bold font-head mb-2">${getDate(c)}, ${getTime(c)} Uhr</div>
                        <div class="text-black text-base font-normal font-body mb-2">${c.titles}</div>
                        <div class="text-black text-sm font-bold font-head mb-2">${c.venue}</div>
                      </div>
                      <div class="w-full flex flex-col gap-2 mt-2">
                        <a href="${c.link}" target="_blank" class="w-full p-2.5 bg-black inline-flex justify-center items-center gap-2.5 rounded text-white text-sm font-bold font-head">
                          TICKET KAUFEN
                        </a>
                        <div class="text-black text-xs font-bold font-head">Preise: ${c.price || "siehe Website"}</div>
                      </div>
                    </div>
                  `).join("")
              : `<div class="text-white">${t("noMatches")}</div>`
          }
        </div>
        <div class="flex flex-col items-center gap-4 mt-4">
          <button class="btn btn-primary" onclick="shareResultImage()">
            <i class="fas fa-share mr-2"></i> ${t("shareImage")}
          </button>
          <button class="btn btn-secondary mt-2" onclick="renderIntro()">${t("backToStart")}</button>
        </div>
      </div>
    </section>
    ${renderShareCardHTML(archetype, subtype, description, recs, color)}
  `;
}

/* ────────────────────────────────────────────────────────────
   5.  VISUAL HELPERS
   ────────────────────────────────────────────────────────────*/



function cleanQuotes(str = "") {

  return str.replace(/\s*"\s*(?=\s|$)/g, "");
}

function getTitle(c) {
  const raw = cleanQuotes(c.titles ?? "");
  return raw.split(";")[0].trim() || "Konzert";
}

function getDetails(c) {
  // 1️⃣  Primär das Feld “programm” verwenden
  const src = (c.programm && c.programm.trim())
      ? c.programm
      : (c.titles ?? "");

  // 2️⃣  Anführungszeichen säubern und Semikolons ersetzen
  return cleanQuotes(src)
      .split(";")
      .map(s => s.trim())
      .join(" - ");
}


function getDate(c) {
  return (c.date ?? "").split(" ")[0];
}
function getTime(c) {
  return (c.start ?? "").slice(0, 5);
}



/* ────────────────────────────────────────────────────────────
   share-card (hidden poster) — identical fonts + layout
   ────────────────────────────────────────────────────────────*/
function renderShareCardHTML(archetype, subtype, description, recs, color) {
  if (!archetype) return ""; // Don't render if missing

  const archetypeImg = `assets/archetypes/${archetype.id}`;
  const concert      = recs && recs.length ? recs[0] : null;
  const archetypeBg  = color ? color + "22" : "#222222";
  const archetypeTitle = archetype.title?.[LANG] || "";
  const concertDate = concert?.date ? getDate(concert) : "";
  const concertTime = concert?.start ? getTime(concert) : "";
  const concertTitles = concert?.titles || "";
  const concertVenue = concert?.venue || "";
  const concertPrice = concert?.price || "siehe Website";

  return /*html*/`
  <div id="share-card"
       class="fixed -left-[9999px] top-0 w-[700px] h-[900px] flex items-center justify-center pointer-events-none z-[9999] font-body"
       style="background:linear-gradient(0deg,${archetypeBg},#181818 90%);">
    <div class="relative w-[600px] bg-[#181818] rounded-[32px] shadow-2xl p-12 flex flex-col items-center">

        <!-- Logo: keep natural aspect-ratio so it never stretches -->
        <img
          src="assets/logo2.png"
          alt="Logo"
          class="absolute top-8 left-8 h-14 w-auto object-contain"
        />

        <!-- Archetype image with rainbow frame -->
        <div class="mt-12">
          <div class="relative w-[170px] h-[255px] mx-auto">
            <div class="absolute inset-0 p-[5px] rounded-[20px]
                        bg-[conic-gradient(#FEE843_0deg,#A49DCC_72deg,#8BC27D_144deg,#F7C3D9_216deg,#F6DF00_288deg,#FEE843_360deg)]">
              <div class="w-[160px] h-[245px] rounded-[16px] overflow-hidden bg-white m-auto">
                <img src="${archetypeImg}.png" alt="${archetypeTitle}"
                     class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <!-- Title & copy – match results page -->
        <div class="mt-9 text-white text-2xl font-normal font-body text-center">
          ${subtype || ""}${archetypeTitle}
        </div>

        <p class="mt-4 mb-6 text-white text-base font-body text-center max-w-[420px]">
          ${description || ""}
        </p>

        <!-- “Concert picks” heading -->
        <div class="text-white text-xl font-body mb-4">
          ${TRANSLATIONS[LANG].concertPicks}
        </div>

        ${
          concert ? `
            <div class="w-full bg-[#FEE843] p-4 shadow-lg flex flex-col items-start">
              <div class="text-black text-sm font-head font-bold mb-1">
                ${concertDate}${concertTime ? `, ${concertTime} Uhr` : ""}
              </div>
              <div class="text-black text-base font-body mb-1">
                ${concertTitles}
              </div>
              <div class="text-black text-sm font-head font-bold mb-1">
                ${concertVenue}
              </div>
              <div class="text-black text-xs font-head">
                Preise: ${concertPrice}
              </div>
            </div>
          ` : `
            <div class="text-white font-body">
              ${TRANSLATIONS[LANG].noMatches}
            </div>
          `
        }

        <div class="mt-8 text-[#aaaaaa] text-sm font-body text-center">
          mphil.de/quiz
        </div>
      </div>
    </div>
  `;
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
        <div style="text-align:center;font-family=monospace;font-size:20px;color:#444;margin-top:6px;">
          ${Math.abs(val)} ${val === 0 ? "" : (val > 0 ? rightLabel : leftLabel)}
        </div>
      </div>
    `;
  }).join("");
}

// --- DARKEN HEX COLOR HELPER ---
function darkenHex(hex, factor = 0.5) {
  // Accepts #RRGGBB or #RGB
  let c = hex.replace('#','');
  if (c.length === 3) c = c.split('').map(x=>x+x).join('');
  let [r,g,b] = [0,0,0];
  if (c.length === 6) {
    r = parseInt(c.slice(0,2),16);
    g = parseInt(c.slice(2,4),16);
    b = parseInt(c.slice(4,6),16);
  }
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
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
});

// Add this helper at the bottom of the file (or in the global window assignment section)
window.setSliderValue = function(id, val, idx) {
  answers[id] = val;
  renderQuestion(idx);
};
