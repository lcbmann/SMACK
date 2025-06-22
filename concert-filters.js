/*  concerts-filter.js  – v7
    ------------------------------------------------------------
    – 1) Archetyp: city & numeric TExp/REnergy
    – 2) Subtyp: single occasion-regex against every concert
    – 3) Union both sets (no duplicates) only if matches found
----------------------------------------------------------------*/

import { CONCERTS } from "./concerts.js";

/* ───────────────────────────  Utils  ──────────────────────────*/

// normalize for city comparison
export const normalize = (s) =>
    (s ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

// build one big text to run regexes on
const concatAll = (c) =>
    [c.title, c.programm, c.series, c.type, c.venue]
        .filter(Boolean)
        .join(" · ");

/* ─────────────── 1) Occasion-Regex per Subtype ──────────────*/

const WORDS = {
    family:  /kammer|familien|kinder|kids?|kita|schul|school|jugend|youth|classroom|jugendchor|junior|matinee|mob|märchen|tiere|fabel|eltern|großeltern|märchenkonzert|bach|beethoven|mozart/i,
    friends: /jugend|youth|u30|unter ?30|uni|campus|student|classroom|rainbow|pride|late|afterwork|open\s*air|lounge|party|beats?|club|x?tra|freunde|new\s*year|vivaldi|handel|haydn/i,
    date:    /kammer|klassik am odeonsplatz|odeonsplatz|romantic|valentin|candle|love|date|nacht|night|late|moon|silvester|new\s*year|weinachts?|tchaikovsky|schubert/i,
    alone:   /kammer|quartett?|quintett?|trio|duo|solo|rezit[ai]l|recital|liederabend|sonate|streich|intim|saal\s*x|hp8|mahler|strauss/i,
};

export const OCCASION_FOR_SUBTYPE = {
    romantic:     "date",
    connected:    "family",
    social:       "friends",
    independent:  "alone"
};

/* ─────────────── 2) Archetyp-Presets ───────────────────────*/

const ARCHETYPE_PRESETS = {
    connoisseur: { city: "München" },
    pioneer:     { city: "München" },
    purist:      { city: "München" },
    bohemian:    { city: "München" },
};

/* ──────────── 3) Main Helper for Quiz  ───────────────────────*/

export function getConcertsForResult(archetypeId, subtypeKey) {
    // 1) Archetyp-Filter: nur City
    const { city } = ARCHETYPE_PRESETS[archetypeId] || {};
    let base = CONCERTS.filter(c => {
        const cityOk = !city || normalize(c.city) === normalize(city);
        return cityOk;
    });

    // 2) Numerische TExp / REnergy pro Archetyp
    switch (archetypeId) {
        case "connoisseur":
            base = base.filter(c =>
                Number(c.TExp) <= 4 && Number(c.REnergy) >= 4
            );
            break;
        case "pioneer":
            base = base.filter(c =>
                Number(c.TExp) >= 4 && Number(c.REnergy) >= 4
            );
            break;
        case "purist":
            base = base.filter(c =>
                Number(c.TExp) <= 4 && Number(c.REnergy) <= 4
            );
            break;
        case "bohemian":
            base = base.filter(c =>
                Number(c.TExp) >= 4 && Number(c.REnergy) <= 4
            );
            break;
        default:
            break;
    }

    // 3) Subtyp-Regex über alle Konzerte
    const occasionTag    = OCCASION_FOR_SUBTYPE[subtypeKey];
    const subtypeMatches = occasionTag
        ? CONCERTS.filter(c => WORDS[occasionTag].test(concatAll(c)))
        : [];

    // 4) Union nur wenn es Subtyp-Matches gibt
    if (subtypeMatches.length > 0) {
        for (const c of subtypeMatches) {
            if (!base.includes(c)) base.push(c);
        }
    }

    // 5) Cache (optional)
    try {
        localStorage.setItem(
            `mphil-concerts-${archetypeId}-${subtypeKey}`,
            JSON.stringify(base)
        );
    } catch {}

    return base;
}

export default { getConcertsForResult };
