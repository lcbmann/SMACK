/*  concerts-filter.js  – v3
    ------------------------------------------------------------
    – city-, early- und occasion-Filter
    – Archetyp/Subtyp-Presets
    – Jedes Konzert erhält ≥ 1 Occasion:
        · Treffer  ➜ passende Tags
        · kein Treffer ➜  ["family","friends","date","alone"]
----------------------------------------------------------------*/

//EARLY BIRD STUFF FOR AMELIE
//import { getIsEarlyBird } from './quiz-config.js';
// ...
//const isEarlyBird = getIsEarlyBird(answers); // true, false, or undefined



import { CONCERTS } from "./concerts.js";

/* ───────────────────────────  Utils  ──────────────────────────*/

export const isEarly = (c) => Number((c?.start ?? "25").split(":")[0]) < 19;

export const normalize = (s) =>
    (s ?? "")
        .toLowerCase()
        .normalize("NFD")           // ä → a + ̈ usw.
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

/* ─────────────── 1) Occasion-Wortlisten  ─────────────────────*/

const WORDS = {
    family: new RegExp(
        [
            "kammer", "familien", "kinder", "kids?", "kita", "schul", "school", "jugend", "youth",
            "classroom", "jugendchor", "junior", "matinee", "mob", "märchen",
            "tiere", "fabel", "eltern", "großeltern", "märchenkonzert"
        ].join("|"),
        "i"
    ),

    friends: new RegExp(
        [
            "jugend", "youth", "u30", "unter ?30", "uni", "campus", "student",
            "classroom", "rainbow", "pride", "late", "afterwork", "open\\s*air",
            "lounge", "party", "beats?", "club", "x?tra", "freunde", "new\\s*year",
        ].join("|"),
        "i"
    ),

    date: new RegExp(
        [
            "kammer", "klassik am odeonsplatz", "odeonsplatz", "romantic",
            "valentin", "candle", "love", "date", "nacht", "night",
            "late", "moon", "silvester", "new\\s*year", "weinachts?"
        ].join("|"),
        "i"
    ),

    alone: new RegExp(
        [
            "kammer", "quartett?", "quintett?", "trio", "duo",
            "solo", "rezit[ai]l", "recital", "liederabend",
            "sonate", "streich", "intim", "saal\\s*x", "hp8"
        ].join("|"),
        "i"
    )
};

/* ─────────────── 2) Occasion-Erkennung  ──────────────────────*/

const concatAll = (c) =>
    [c.title, c.programm, c.series, c.type, c.venue]
        .filter(Boolean)
        .join(" · ");

export const getOccasions = (concert) => {
    const text = concatAll(concert);
    const tags = Object.entries(WORDS)
        .filter(([, rx]) => rx.test(text))
        .map(([k]) => k);

    /*  Mindestens 1 Tag:  Treffer → tags, sonst alle vier  */
    return tags.length ? tags : ["family", "friends", "date", "alone"];
};

/* ─────────────── 3) applyFilters()  ──────────────────────────*/

export function applyFilters(
    list = CONCERTS,
    { city, early, occasion } = {}
) {
    const occWanted = occasion ? [].concat(occasion) : null;

    return list.filter((c) => {
        const cityOk  = !city  || normalize(c.city) === normalize(city);
        const earlyOk = !early || isEarly(c);

        const occTags = getOccasions(c);
        const occOk   = !occWanted || occTags.some((t) => occWanted.includes(t));

        return cityOk && earlyOk && occOk;
    });
}

/* ──────────── 4) Archetyp- & Subtyp-Presets  ─────────────────*/

const ARCHETYPE_PRESETS = {
    connoisseur: { city: "München" },
    pioneer:     { city: "München", early: true },
    purist:      { city: "München" },
    bohemian:    { city: "München" }
};

export const OCCASION_FOR_SUBTYPE = {
    romantic:    "date",
    connected:   "family",
    social:      "friends",
    independent: "alone"
};

/* ──────────── 5) Haupt-Helper für das Quiz  ─────────────────*/

export function getConcertsForResult(archetypeId, subtypeKey) {
    const base     = ARCHETYPE_PRESETS[archetypeId] ?? {};
    const occasion = OCCASION_FOR_SUBTYPE[subtypeKey];
    const preset   = { ...base, ...(occasion && { occasion }) };

    const filtered = applyFilters(CONCERTS, preset);

    try {
        localStorage.setItem(
            `mphil-concerts-${archetypeId}-${subtypeKey}`,
            JSON.stringify(filtered)
        );
    } catch {/* quota errors ignored */}

    return filtered;
}

export default { applyFilters, getConcertsForResult, getOccasions };
