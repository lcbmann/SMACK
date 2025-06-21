import json, re, pathlib, pandas as pd
from numbers_parser import Document   # liest .numbers

SRC_FILE  = "Concerts.numbers"        # <-- Ihre Datei
DEST_FILE = "concerts.js"
DEFAULT_CONCERT_LINK = (
    "https://www.mphil.de/konzerte-und-karten/kalender-2024-2025#j44933"
)

# ─────────────────── 1) Datei einlesen ────────────────────
suffix = pathlib.Path(SRC_FILE).suffix.lower()
if suffix == ".numbers":
    doc   = Document(SRC_FILE)
    sheet = doc.sheets[0]                    # erste Tabelle
    tbl   = sheet.tables[0]                  # erste „Numbers-Tabelle“
    data  = list(tbl.rows(values_only=True)) # Zeilen als Listen
    hdr   = [str(c).strip() for c in data[0]]
    df    = pd.DataFrame(data[1:], columns=hdr)
else:                                         # .xlsx, .csv, …
    df = pd.read_excel(SRC_FILE, dtype=str).fillna("")

# alles lowercase, Leerzeichen raus – damit Groß-/Kleinschreibung egal ist
df.columns = df.columns.str.strip().str.lower()

# ──────────────── 2) Mapping-Funktion ─────────────────────
def map_row(r: pd.Series) -> dict:
    # helper: liest Spalte, egal ob vorhanden oder leer
    def g(col, default=""):
        return r.get(col.lower(), default)

    return {
        "date":        g("date"),
        "start":       g("start"),
        "type":        g("type of date"),
        "venue":       g("venue"),
        "city":        g("city"),
        "series":      g("series"),
        "programm":    g("programm"),              # 🆕  Programmtitel
        "title":       g("title"),                 #  damit auch der User-Titel bleibt
        "composers":   g("composer"),
        "composerGivenNames":  g("given names composer"),
        "titles":      g("title"),                 # (alter Feldname – falls noch gebraucht)
        "duration":    g("duration"),
        "soloistsLastNames":   g("last names soloists"),
        "soloistsGivenNames":  g("given names solioist(s)"),
        "instruments":         g("instrument(s)"),
        "conductorLastName":   g("conductor"),
        "conductorGivenNames": g("given names conductors"),
        "capacity":    int(g("capacity") or 0),
        "link":        "DEFAULT_CONCERT_LINK"
    }

concerts = [map_row(r) for _, r in df.iterrows()]

# ──────────────── 3) JS-Export  ───────────────────────────
json_block = json.dumps(concerts, indent=2)
json_block = re.sub(r'\"([a-zA-Z_][a-zA-Z0-9_]*)\":', r'\1:', json_block)
json_block = json_block.replace('"DEFAULT_CONCERT_LINK"', 'DEFAULT_CONCERT_LINK')

js_text = f"""export const DEFAULT_CONCERT_LINK = "{DEFAULT_CONCERT_LINK}";

const concerts = {json_block};

export {{ concerts as CONCERTS }};
"""

pathlib.Path(DEST_FILE).write_text(js_text, encoding="utf-8")
print(f"✅  {len(concerts)} Konzerte nach '{DEST_FILE}' geschrieben.")
