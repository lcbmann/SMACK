/*  concerts-filter.js  – v6
    ------------------------------------------------------------
    – 1) Archetyp: city, early-bird & numeric TExp/REnergy
    – 2) Subtyp: single occasion-regex gegen alle Konzerte
    – 3) Nur gefundene Subtype-Konzerte unionieren (keine Duplikate)
----------------------------------------------------------------*/

import { CONCERTS } from "./concerts.js";

/* ───────────────────────────  Utils  ──────────────────────────*/

// hour < 19 → early-bird
export const isEarly = (c) =>
    Number((c?.start ?? "25").split(":")[0]) < 19;

// normalize für City-Vergleich
export const normalize = (s) =>
    (s ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

// baue einen einzigen Text, um die Regex drauf loszulassen
const concatAll = (c) =>
    [c.title, c.programm, c.series, c.type, c.venue]
        .filter(Boolean)
        .join(" · ");

/* ─────────────── 1) Regex pro Subtyp ─────────────────────────*/

const WORDS = {
    family:  /kammer|familien|kinder|kids?|kita|schul|school|jugend|youth|classroom|jugendchor|junior|matinee|mob|märchen|tiere|fabel|eltern|großeltern|märchenkonzert/i,
    friends: /jugend|youth|u30|unter ?30|uni|campus|student|classroom|rainbow|pride|late|afterwork|open\s*air|lounge|party|beats?|club|x?tra|freunde|new\s*year/i,
    date:    /kammer|klassik am odeonsplatz|odeonsplatz|romantic|valentin|candle|love|date|nacht|night|late|moon|silvester|new\s*year|weinachts?/i,
    alone:   /kammer|quartett?|quintett?|trio|duo|solo|rezit[ai]l|recital|liederabend|sonate|streich|intim|saal\s*x|hp8/i,
};

export const OCCASION_FOR_SUBTYPE = {
    romantic:    "date",
    connected:   "family",
    social:      "friends",
    independent: "alone"
};

/* ─────────────── 2) Archetyp-Presets ────────────────────────*/

const ARCHETYPE_PRESETS = {
    connoisseur: { city: "München", early: undefined },
    pioneer:     { city: "München", early: undefined },
    purist:      { city: "München", early: undefined },
    bohemian:    { city: "München", early: undefined },
};

/* ──────────── 3) Hauptfunktion für das Quiz ──────────────────*/

export function getConcertsForResult(archetypeId, subtypeKey) {
    // 1) Archetyp-Filter
    const { city, early } = ARCHETYPE_PRESETS[archetypeId] || {};
    let base = CONCERTS.filter(c => {
        const cityOk  = !city  || normalize(c.city) === normalize(city);
        const earlyOk = early === undefined || (early ? isEarly(c) : !isEarly(c));
        return cityOk && earlyOk;
    });

    // 2) Numerische TExp / REnergy pro Archetyp
    switch (archetypeId) {
        case "connoisseur":
            base = base.filter(c =>
                Number(c.TExp) <= 3 && Number(c.REnergy) >= 4
            );
            break;
        case "pioneer":
            base = base.filter(c =>
                Number(c.TExp) >= 4 && Number(c.REnergy) >= 4
            );
            break;
        case "purist":
            base = base.filter(c =>
                Number(c.TExp) <= 3 && Number(c.REnergy) <= 3
            );
            break;
        case "bohemian":
            base = base.filter(c =>
                Number(c.TExp) >= 4 && Number(c.REnergy) <= 3
            );
            break;
        default:
            break;
    }

    // 3) Subtyp-Regex über alle Konzerte
    const occasionTag = OCCASION_FOR_SUBTYPE[subtypeKey];
    const subtypeMatches = occasionTag
        ? CONCERTS.filter(c => WORDS[occasionTag].test(concatAll(c)))
        : [];

    // 4) Nur wenn es Subtyp-Matches gab, unioniere
    let result = base;
    if (subtypeMatches.length > 0) {
        result = [...base];
        for (const c of subtypeMatches) {
            if (!result.includes(c)) result.push(c);
        }
    }

    // 5) Optional: Cache
    try {
        localStorage.setItem(
            `mphil-concerts-${archetypeId}-${subtypeKey}`,
            JSON.stringify(result)
        );
    } catch {}

    return result;
}

export default { getConcertsForResult };
