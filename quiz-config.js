/* ------------------------------------------------------------------
   CONFIG  •  METRIC EDITION  •  multilingual (en / de)
   -----------------------------------------------------------------*/

export let LANG = "en";          // current language
export const setLang = (l) => { LANG = l; };

/* ────────────────────────────────────────────────────────────
   GLOBAL UI STRINGS
   ────────────────────────────────────────────────────────────*/
export const TRANSLATIONS = {
  en: {
    discover:        "Discover",
    intro:           "Find out which concert vibe suits you best – and get personalised tips from the Münchner Philharmoniker.",
    takeQuiz:        "Take the Quiz",
    viewResult:      "View Result",
    retakeQuiz:      "Retake Quiz",
    shareImage:      "Share as Image",
    newsletter:      "Sign up for the Newsletter",
    backToStart:     "Back to Start",
    question:        (i, total) => `Question ${i}/${total}`,
    concertPicks:    "Concert Picks",
    yourProfile:     "Your Profile",
    noMatches:       "No matches yet – stay tuned!",
    energizing:      "Energizing",
    calm:            "Calm",
    tradition:       "Tradition",
    discovery:       "Discovery",
    whichConcertType: "Which concert type are you?",
    previous:       "Previous",
    next:           "Next",
    introShort: "Discover your perfect concert vibe with personalised tips from the Münchner Philharmoniker.",
  },
  de: {
    discover:        "Entdecken",
    intro:           "Finden Sie heraus, welches Konzerterlebnis am besten zu Ihnen passt – mit persönlichen Tipps der Münchner Philharmoniker.",
    takeQuiz:        "Quiz starten",
    viewResult:      "Ergebnis anzeigen",
    retakeQuiz:      "Quiz wiederholen",
    shareImage:      "Als Bild teilen",
    newsletter:      "Für den Newsletter anmelden",
    backToStart:     "Zurück zum Start",
    question:        (i, total) => `Frage ${i}/${total}`,
    concertPicks:    "Konzertempfehlungen",
    yourProfile:     "Ihr Profil",
    noMatches:       "Noch keine Empfehlungen – bleiben Sie dran!",
    energizing:      "Belebend",
    calm:            "Ruhig",
    tradition:       "Tradition",
    discovery:       "Entdeckung",
    whichConcertType: "Welcher Konzerttyp sind Sie?",
    previous:       "Vorherige",
    next:           "Nächste",
    introShort: "Entdecken Sie Ihr perfektes Konzerterlebnis mit persönlichen Tipps der Münchner Philharmoniker.",
  }
};

/* ────────────────────────────────────────────────────────────
   COLOR VARIABLES
   ────────────────────────────────────────────────────────────
   */
export const COLORS = {
  green:      "#8BC27D",
  pink:       "#F7C3D9",
  purple:     "#A49DCC",
  blue:       "#78C3E9",
  yellow:     "#FEE843",
  black:      "#000",
  white:      "#fff",
  lightYellow:"#fffbe6"
};


/* ────────────────────────────────────────────────────────────
   QUIZ DATA
   ────────────────────────────────────────────────────────────*/
export const DIMENSIONS = ["energy", "tradition"];

export const QUESTIONS = [
  {
    id: "q1",
    type: "choice",
    text: {
      en: "What kind of mood are you in when you go to a concert?",
      de: "In welcher Stimmung gehen Sie ins Konzert?"
    },
    bgColor: COLORS.green,
    optionBg: COLORS.pink,
    optionText: COLORS.black,
    optionBorder: COLORS.black,
    nextBg: COLORS.yellow,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes3.png", // bottom right
    shapePos: "bottom-right",
    options: [
      {
        value: "energizing",
        label: { en: "Upbeat & Energizing",  de: "Lebhaft & Energetisch" },
        description: {
          en: "Energetic, full of drive",
          de: "Energiegeladen, voller Schwung"
        },
        icon: "fas fa-bolt",
        effects: { energy: +2 }
      },
      {
        value: "reflective",
        label: { en: "Calm & Reflective", de: "Ruhig & Kontemplativ" },
        description: {
          en: "Mellow, emotionally deep",
          de: "Gelassen, emotional tief"
        },
        icon: "fas fa-leaf",
        effects: { energy: -2 }
      }
    ]
  },
  {
    id: "q2",
    type: "choice",
    text: {
      en: "What kind of concert vibe do you enjoy?",
      de: "Welche Art Konzertatmosphäre gefällt Ihnen?"
    },
    bgColor: COLORS.pink,
    optionBg: COLORS.yellow,
    optionText: COLORS.black,
    optionBorder: COLORS.black,
    nextBg: COLORS.yellow,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes4.png", // bottom left
    shapePos: "bottom-left",
    options: [
      {
        value: "tradition",
        label: { en: "Tradition-Oriented", de: "Traditionsbewusst" },
        description: {
          en: "Classic setup, timeless works",
          de: "Klassischer Rahmen, zeitlose Werke"
        },
        icon: "fas fa-university",
        effects: { tradition: +2 }
      },
      {
        value: "discovery",
        label: { en: "Open to Discovery", de: "Offen für Neues" },
        description: {
          en: "Fresh formats, new works",
          de: "Frische Formate, neue Werke"
        },
        icon: "fas fa-flask",
        effects: { tradition: -2 }
      }
    ]
  },
  {
    id: "q3",
    type: "choice",
    text: {
      en: "Who are you most likely to go to a concert with?",
      de: "Mit wem gehen Sie am ehesten ins Konzert?"
    },
    bgColor: COLORS.blue,
    optionBg: COLORS.lightYellow,
    optionText: COLORS.black,
    optionBorder: COLORS.black,
    nextBg: COLORS.purple,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes5.png", // bottom right
    shapePos: "bottom-right",
    options: [
      { value: "romantic",    label: { en: "A date",   de: "Ein Date"    }, icon: "fas fa-heart"        },
      { value: "connected",   label: { en: "Family",   de: "Familie"     }, icon: "fas fa-users"        },
      { value: "social",      label: { en: "Friends",  de: "Freunde"     }, icon: "fas fa-glass-cheers" },
      { value: "independent", label: { en: "Alone",    de: "Allein"      }, icon: "fas fa-user"         }
    ]
  },
  {
    id: "q4",
    type: "choice",
    text: {
      en: "Which concert setting do you prefer?",
      de: "Welches Konzert-Setting bevorzugen Sie?"
    },
    bgColor: COLORS.yellow,
    optionBg: COLORS.black,
    optionText: COLORS.white,
    optionBorder: COLORS.black,
    nextBg: COLORS.blue,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes6.png", // bottom left
    shapePos: "bottom-left",
    options: [
      { value: "formal",   label: { en: "Formal Hall",   de: "Konzertsaal" }, icon: "fas fa-building" },
      { value: "casual",   label: { en: "Casual Venue",  de: "Lockerer Ort" }, icon: "fas fa-coffee"  }
    ]
  },
  {
    id: "q5",
    type: "choice",
    text: {
      en: "Which time of day do you prefer for concerts?",
      de: "Zu welcher Tageszeit gehen Sie am liebsten ins Konzert?"
    },
    bgColor: COLORS.purple,
    optionBg: COLORS.pink,
    optionText: COLORS.black,
    optionBorder: COLORS.black,
    nextBg: COLORS.yellow,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes7.png", // bottom right
    shapePos: "bottom-right",
    options: [
      { value: "evening", label: { en: "Evening", de: "Abends" } },
      { value: "afternoon", label: { en: "Afternoon", de: "Nachmittags" } },
      { value: "morning", label: { en: "Morning", de: "Morgens" } }
    ]
  },
  {
    id: "q6",
    type: "choice",
    text: {
      en: "Which seat do you prefer?",
      de: "Welchen Sitzplatz bevorzugen Sie?"
    },
    bgColor: COLORS.yellow,
    optionBg: COLORS.black,
    optionText: COLORS.white,
    optionBorder: COLORS.black,
    nextBg: COLORS.blue,
    nextText: COLORS.black,
    shapeImg: "assets/shapes/shapes8.png", // bottom left
    shapePos: "bottom-left",
    options: [
      { value: "front", label: { en: "Front row", de: "Vorne" } },
      { value: "middle", label: { en: "Middle", de: "Mitte" } },
      { value: "back", label: { en: "Back", de: "Hinten" } }
    ]
  }
];

export const ARCHETYPES = [
  {
    id: "connoisseur",
    title: { en: "Connoisseur", de: "Kenner" },
    blurb: {
      en: "High-energy & tradition-oriented: you crave iconic masterpieces played with verve.",
      de: "Energiegeladen & traditionsbewusst: Sie sehnen sich nach ikonischen Meisterwerken voller Verve."
    },
    rule: s => s.energy > 0 && s.tradition > 0
  },
  {
    id: "pioneer",
    title: { en: "Pioneer", de: "Pionier" },
    blurb: {
      en: "High-energy & discovery-minded: you love bold formats and new music.",
      de: "Energiegeladen & entdeckungsfreudig: Sie lieben kühne Formate und neue Musik."
    },
    rule: s => s.energy > 0 && s.tradition <= 0
  },
  {
    id: "purist",
    title: { en: "Purist", de: "Purist" },
    blurb: {
      en: "Reflective & tradition-oriented: you enjoy calm depth with a classic touch.",
      de: "Besinnlich & traditionsbewusst: Sie genießen ruhige Tiefe mit klassischem Touch."
    },
    rule: s => s.energy <= 0 && s.tradition > 0
  },
  {
    id: "wanderer",
    title: { en: "Wanderer", de: "Wanderer" },
    blurb: {
      en: "Reflective & discovery-minded: mellow, modern and open-minded.",
      de: "Besinnlich & offen: entspannt, modern und aufgeschlossen."
    },
    rule: s => s.energy <= 0 && s.tradition <= 0
  }
];


export const SUBTYPE_LABEL = {
  romantic:    { en: "Romantic",    de: "Romantisch" },
  connected:   { en: "Connected",   de: "Verbunden"  },
  social:      { en: "Social",      de: "Gesellig"   },
  independent: { en: "Independent", de: "Unabhängig" }
};

export const SUBTYPE_ARCHETYPE_DESCRIPTIONS = {
  romantic: {
    connoisseur: {
      en: "You and your date love the thrill of iconic masterpieces in a classic setting.",
      de: "Sie und Ihr Date lieben den Nervenkitzel ikonischer Meisterwerke in klassischem Ambiente."
    },
    pioneer: {
      en: "You and your date are up for bold, new musical adventures together.",
      de: "Sie und Ihr Date sind gemeinsam für kühne, neue musikalische Abenteuer zu haben."
    },
    purist: {
      en: "You and your date enjoy deep, timeless classics in an intimate mood.",
      de: "Sie und Ihr Date genießen tiefe, zeitlose Klassiker in intimer Atmosphäre."
    },
    wanderer: {
      en: "You and your date love discovering mellow, modern sounds together.",
      de: "Sie und Ihr Date entdecken gern gemeinsam entspannte, moderne Klänge."
    }
  },
  connected: {
    connoisseur: {
      en: "Your family bonds over energetic, timeless orchestral experiences.",
      de: "Ihre Familie verbindet energiegeladene, zeitlose Orchestererlebnisse."
    },
    pioneer: {
      en: "Your family is curious and loves exploring new musical frontiers.",
      de: "Ihre Familie ist neugierig und liebt es, neue musikalische Horizonte zu erkunden."
    },
    purist: {
      en: "Your family cherishes calm, classic concerts and shared tradition.",
      de: "Ihre Familie schätzt ruhige, klassische Konzerte und gemeinsame Tradition."
    },
    wanderer: {
      en: "Your family enjoys relaxed, open-minded evenings with new sounds.",
      de: "Ihre Familie genießt entspannte, aufgeschlossene Abende mit neuen Klängen."
    }
  },
  social: {
    connoisseur: {
      en: "You and your friends thrive on high-energy, classic concert nights.",
      de: "Sie und Ihre Freunde leben für energiegeladene, klassische Konzertabende."
    },
    pioneer: {
      en: "You and your friends are always seeking out the next musical adventure.",
      de: "Sie und Ihre Freunde sind stets auf der Suche nach dem nächsten musikalischen Abenteuer."
    },
    purist: {
      en: "You and your friends appreciate reflective, classic evenings together.",
      de: "Sie und Ihre Freunde schätzen gemeinsame, besinnliche Klassikerabende."
    },
    wanderer: {
      en: "You and your friends love discovering new, chill music scenes.",
      de: "Sie und Ihre Freunde entdecken gern neue, entspannte Musik-Szenerien."
    }
  },
  independent: {
    connoisseur: {
      en: "You savor iconic masterpieces solo, soaking up every detail.",
      de: "Sie genießen ikonische Meisterwerke allein und saugen jedes Detail auf."
    },
    pioneer: {
      en: "You love exploring bold, new music on your own terms.",
      de: "Sie erkunden kühne, neue Musik ganz nach Ihren eigenen Vorstellungen."
    },
    purist: {
      en: "You find peace in classic, reflective concerts by yourself.",
      de: "Sie finden Ruhe in klassischen, besinnlichen Konzerten – ganz für sich."
    },
    wanderer: {
      en: "You enjoy wandering into new, mellow music experiences alone.",
      de: "Sie streifen gern allein durch neue, entspannte Musikerlebnisse."
    }
  }
};

export const ARCHETYPE_COLORS = {
  connoisseur: {
    base:  "#F6DF00",
    romantic:    "#ffe066",
    connected:   "#ffe699",
    social:      "#fff3bf",
    independent: "#fff9db"
  },
  pioneer: {
    base:  "#7DD3FC",
    romantic:    "#bae6fd",
    connected:   "#38bdf8",
    social:      "#0ea5e9",
    independent: "#0369a1"
  },
  purist: {
    base:  "#C4B5FD",
    romantic:    "#ddd6fe",
    connected:   "#a78bfa",
    social:      "#8b5cf6",
    independent: "#6d28d9"
  },
  wanderer: {
    base:  "#6EE7B7",
    romantic:    "#bbf7d0",
    connected:   "#34d399",
    social:      "#059669",
    independent: "#065f46"
  }
};
