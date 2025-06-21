

import { CONCERTS } from "./concerts.js"; // komplette Konzert‑Liste

// ─── Hilfsfunktionen ─────────────────────────────────────────
/** true, wenn Konzert vor 19:00 Uhr beginnt */
const isEarly = (c) => {
    const [hh] = (c.start ?? "").split(":");
    return Number(hh) < 19; // NaN wird zu false
};


const normalize = (s) =>
    (s ?? "")
        .toLowerCase()
        .normalize("NFD") // Umlaute → Basis + Diakritika
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

/**
 * Kern‑Filter: Stadt‑ und ggf. "early"‑Kriterium anwenden
 * @param {Array} list  – Ausgangsliste (typ. CONCERTS)
 * @param {Object} opts – { city?: String, early?: Boolean }
 */
export function applyFilters(list, { city, early } = {}) {
    return list.filter((c) => {
        const cityOk = !city || normalize(c.city) === normalize(city);
        const earlyOk = !early || isEarly(c);
        return cityOk && earlyOk;
    });
}

// ─── Voreinstellungen pro Archetyp ───────────────────────────
const PRESETS = {
    connoisseur: { city: "München" },
    pioneer:     { city: "München", early: true },
    purist:      { city: "München" },
    wanderer:    { city: "München" }
};


/**
 * Liefert gefilterte Konzerte für ein Ergebnis‑Archetyp
 * und cached sie in localStorage (Key: mphil-concerts-<id>).
 */
export function getConcertsForResult(archetypeId) {
    const preset    = PRESETS[archetypeId] || {};
    const filtered  = applyFilters(CONCERTS, preset);
    try {
        localStorage.setItem(
            `mphil-concerts-${archetypeId}`,
            JSON.stringify(filtered)
        );
    } catch (_) { /* Quota‑Fehler ignorieren */ }
    return filtered;
}

// ─── Optional: Default‑Export für einfache Nutzung ───────────
export default { getConcertsForResult, applyFilters };
