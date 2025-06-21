import json, re, pandas as pd, pathlib

SRC_FILE  = "Concerts.xlsx"
DEST_FILE = "concerts.js"
DEFAULT_CONCERT_LINK = (
    "https://www.mphil.de/konzerte-und-karten/kalender-2024-2025#j44933"
)

df = pd.read_excel(SRC_FILE, dtype=str).fillna("")

def map_row(r):
    return {
        "date":                r["Date"],
        "start":               r["start"],
        "type":                r["type of date"],
        "venue":               r["venue"],
        "city":                r["city"],
        "series":              r["series"],
        "composers":           r["composer"],
        "composerGivenNames":  r["Given names composer"],
        "titles":              r["title"],
        "duration":            r["duration"],
        "soloistsLastNames":   r["Last names soloists"],
        "soloistsGivenNames":  r["Given names Solioist(s)"],
        "instruments":         r["Instrument(s)"],
        "conductorLastName":   r["Conductor"],
        "conductorGivenNames": r["Given names Conductors"],
        "capacity":            int(r["Capacity"] or 0),
        "link":                "DEFAULT_CONCERT_LINK"
    }

concerts = [map_row(r) for _, r in df.iterrows()]

# 1) erst normales JSON erzeugen
json_block = json.dumps(concerts, indent=2)

# 2) Schlüssel-Anführungszeichen entfernen
json_block = re.sub(r'\"([a-zA-Z_][a-zA-Z0-9_]*)\":', r'\1:', json_block)

# 3) Platzhalter durch Konstante ersetzen
json_block = json_block.replace('"DEFAULT_CONCERT_LINK"', 'DEFAULT_CONCERT_LINK')

js_text = f"""export const DEFAULT_CONCERT_LINK = "{DEFAULT_CONCERT_LINK}";

const concerts = {json_block};

export {{ concerts as CONCERTS }};
"""

pathlib.Path(DEST_FILE).write_text(js_text, encoding="utf-8")
print(f"✅  {len(concerts)} Konzerte nach '{DEST_FILE}' geschrieben.")
