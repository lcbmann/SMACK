#!/usr/bin/env python3
# coding: utf-8
"""
wandelt die Tabelle „Concerts.numbers“ (oder .xlsx/.csv) in eine
JavaScript-Datei concerts.js um. Die JS-Datei exportiert:
  • DEFAULT_CONCERT_LINK   (Fallback-URL)
  • CONCERTS               (Array aller Konzert-Objekte)

NEU (06/2025)
  • Spalten **TExp** und **REnergy** (ganzzahlig) werden übernommen.
"""

import json
import re
import pathlib
import pandas as pd

try:
    from numbers_parser import Document  # Apple-Numbers
except ImportError:
    Document = None  # Skript läuft ohne

# ─────────────── Konfiguration ──────────────────────────────────
SRC_FILE  = "Concerts.numbers"  # oder .xlsx / .csv
DEST_FILE = "concerts.js"
DEFAULT_CONCERT_LINK = (
    "https://www.mphil.de/konzerte-und-karten/kalender-2024-2025#j44933"
)

# ─────────────── 1) Datei einlesen ──────────────────────────────
suffix = pathlib.Path(SRC_FILE).suffix.lower()

if suffix == ".numbers":
    if Document is None:
        raise RuntimeError(
            "numbers_parser nicht installiert – `pip install numbers-parser`"
        )
    doc   = Document(SRC_FILE)
    sheet = doc.sheets[0]
    tbl   = sheet.tables[0]
    data  = list(tbl.rows(values_only=True))
    hdr   = [str(c).strip() for c in data[0]]
    df    = pd.DataFrame(data[1:], columns=hdr)
else:  # .xlsx, .xls, .csv …
    df = pd.read_excel(SRC_FILE, dtype=str).fillna("")

# Spaltennamen harmonisieren
df.columns = df.columns.str.strip().str.lower()
# ─── Hier füllen wir alle NaN mit leeren Strings auf ─────────────
df = df.fillna("")

# ─────────────── 2) Mapping-Funktion ────────────────────────────
def map_row(r: pd.Series) -> dict:
    """holt Spaltenwerte case-insensitiv, liefert »« oder 0, falls leer"""
    g  = lambda col, default="": r.get(col.lower(), default)
    gi = lambda col: int(g(col) or 0)

    return {
        "date":               g("date"),
        "start":              g("start"),
        "type":               g("type of date"),
        "venue":              g("venue"),
        "city":               g("city"),
        "series":             g("series"),
        "programm":           g("programm"),
        "title":              g("title"),
        "composers":          g("composer"),
        "composerGivenNames": g("given names composer"),
        "titles":             g("title"),
        "duration":           g("duration"),
        "soloistsLastNames":  g("last names soloists"),
        "soloistsGivenNames": g("given names solioist(s)"),
        "instruments":        g("instrument(s)"),
        "conductorLastName":  g("conductor"),
        "conductorGivenNames":g("given names conductors"),
        "capacity":           gi("capacity"),

        # ────── NEU: zwei numerische Felder ──────
        "TExp":               gi("texp"),
        "REnergy":            gi("renergy"),

        # Link aus der Tabelle → sonst Fallback
        "link":               g("link", "DEFAULT_CONCERT_LINK")
    }

concerts = [map_row(r) for _, r in df.iterrows()]

# ─────────────── 3) JS-Export bauen ─────────────────────────────
json_block = json.dumps(concerts, indent=2, ensure_ascii=False)

# Keys ohne Anführungszeichen (JS-Object-Literal)
json_block = re.sub(r'\"([A-Za-z_][A-Za-z0-9_]*)\":', r'\1:', json_block)
# Platzhalter ersetzen
json_block = json_block.replace('"DEFAULT_CONCERT_LINK"', 'DEFAULT_CONCERT_LINK')

js_text = f"""export const DEFAULT_CONCERT_LINK = "{DEFAULT_CONCERT_LINK}";

const concerts = {json_block};

export {{ concerts as CONCERTS }};
"""

pathlib.Path(DEST_FILE).write_text(js_text, encoding="utf-8")
print(f"✅  {len(concerts)} Konzerte nach '{DEST_FILE}' geschrieben.")
