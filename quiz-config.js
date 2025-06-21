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
    question:        (i, total) => `Question ${i} of ${total}`,
    concertPicks:    "Concert Picks",
    yourProfile:     "Your Profile",
    noMatches:       "No matches yet – stay tuned!",
    energizing:      "Energizing",
    calm:            "Calm",
    tradition:       "Tradition",
    discovery:       "Discovery",
    whichConcertType: "Which concert type are you?",
    previous:        "Previous",
    next:            "Next",
    introShort:      "Discover your perfect concert match.",
    playAudio:       "Play audio",
    pauseAudio:      "Pause audio"
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
    previous:        "Zurück",
    next:            "Weiter",
    introShort:      "Entdecken Sie Ihre perfekte Konzertstimmung mit persönlichen Tipps der Münchner Philharmoniker.",
    playAudio:       "Audio abspielen",
    pauseAudio:      "Audio pausieren"
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
  orange:     "#F6DF00",
  lightYellow:"#fffbe6"
};

// The color sequence for quiz backgrounds and answer options
export const COLOR_SEQUENCE = [
  {
    bgColor: COLORS.green,      // page background
    optionBg: COLORS.pink,      // answer background
    optionText: COLORS.black,
    optionBorder: COLORS.black
  },
  {
    bgColor: COLORS.pink,
    optionBg: COLORS.blue,
    optionText: COLORS.black,
    optionBorder: COLORS.black
  },
  {
    bgColor: COLORS.blue,
    optionBg: COLORS.orange,
    optionText: COLORS.black,
    optionBorder: COLORS.black
  },
  {
    bgColor: COLORS.orange,
    optionBg: COLORS.purple,
    optionText: COLORS.black,
    optionBorder: COLORS.black
  },
  {
    bgColor: COLORS.purple,
    optionBg: COLORS.yellow,
    optionText: COLORS.black,
    optionBorder: COLORS.black
  },
  {
    bgColor: COLORS.yellow,
    optionBg: COLORS.black,
    optionText: COLORS.white,
    optionBorder: COLORS.black
  }
];

/* ────────────────────────────────────────────────────────────
   QUIZ DATA
   ────────────────────────────────────────────────────────────*/
export const DIMENSIONS = ["energy", "tradition"];

export const QUESTIONS = [
  // 1. How should a concert make you feel?
  {
    id: "q1",
    type: "choice",
    text: {
      en: "How should a concert make you feel?",
      de: "Wie soll ein Konzert Sie fühlen lassen?"
    },
    shapeImg: "assets/shapes/shapes3.png",
    shapePos: "bottom-right",
    nextBg: COLORS.yellow,
    nextText: COLORS.black,
    options: [
      {
        value: "energizing",
        label: { en: "Upbeat & Energized",  de: "Lebhaft & Energetisch" },
        description: {
          en: "",
          de: ""
        },
        icon: "fas fa-bolt",
        effects: { energy: +2 }
      },
      {
        value: "reflective",
        label: { en: "Calm & Reflective", de: "Ruhig & Kontemplativ" },
        description: {
          en: "",
          de: ""
        },
        icon: "fas fa-leaf",
        effects: { energy: -2 }
      }
    ]
  },

  // 2. Social Battery Slider
  {
    id: "qSocialBattery",
    type: "slider",
    text: {
      en: "What's your energy level before a concert?",
      de: "Wie hoch ist Ihr Energielevel vor einem Konzert?"
    },
    // The rendering code should default this to 3 and always enable "Next"
    effects: value => ({
      energy: value - 3  // 1 → -2, 3 → 0, 6 → +3
    })
  },

  // 3. Who are you most likely to go to a concert with?
  {
    id: "q3",
    type: "choice",
    text: {
      en: "With whom do you want to go?",
      de: "Mit wem willst du hingehen?"
    },
    shapeImg: "assets/shapes/shapes5.png",
    shapePos: "bottom-right",
    nextBg: COLORS.purple,
    nextText: COLORS.black,
    options: [
      { value: "romantic",    label: { en: "A date",   de: "Einem Date"    }, icon: "fas fa-heart"        },
      { value: "connected",   label: { en: "With younger kids",   de: "Mit jüngeren Kindern"     }, icon: "fas fa-users"        },
      { value: "social",      label: { en: "My friends",  de: "Meinen Freunden"     }, icon: "fas fa-glass-cheers" },
      { value: "independent", label: { en: "I want to spend some time alone",    de: "Ich will Zeit alleine verbringen"      }, icon: "fas fa-user"         }
    ]
  },

  // 4. Which song vibe do you like most? (audio)
  {
    id: "q4",
    type: "audio",
    text: {
      en: "Which song vibe do you like most?",
      de: "Welcher Song-Vibe gefällt Ihnen am meisten?"
    },
    shapeImg: "assets/shapes/shapes6.png",
    shapePos: "bottom-left",
    nextBg: COLORS.blue,
    nextText: COLORS.black,
    options: [
      {
        value: "boneym",
        label: { en: "Boney M – Daddy Cool", de: "Boney M – Daddy Cool" },
        description: {
          en: "Disco, fun, energetic",
          de: "Disco, Spaß, energiegeladen"
        },
        img: "assets/answers/boneym.png",
        audio: "audio/boneym.mp3",
        effects: { energy: +2, tradition: +2 }
      },
      {
        value: "cro",
        label: { en: "CRO – Einmal um die Welt", de: "CRO – Einmal um die Welt" },
        description: {
          en: "Modern, upbeat, catchy",
          de: "Modern, mitreißend, eingängig"
        },
        img: "assets/answers/cro.png",
        audio: "audio/cro.mp3",
        effects: { energy: +2, tradition: -2 }
      },
      {
        value: "lana",
        label: { en: "Lana Del Rey – Video Games", de: "Lana Del Rey – Video Games" },
        description: {
          en: "Dreamy, melancholic, atmospheric",
          de: "Verträumt, melancholisch, atmosphärisch"
        },
        img: "assets/answers/lana.png",
        audio: "audio/lana.mp3",
        effects: { energy: -2, tradition: -2 }
      },
      {
        value: "adele",
        label: { en: "Adele – Chasing Pavements", de: "Adele – Chasing Pavements" },
        description: {
          en: "Soulful, emotional, powerful",
          de: "Gefühlvoll, emotional, kraftvoll"
        },
        img: "assets/answers/adele.png",
        audio: "audio/adele.mp3",
        effects: { energy: -2, tradition: +2 }
      }
    ]
  },

  // 5. Time of day preference
  {
    id: "q5",
    type: "choice",
    text: {
      en: "Are you an early bird or a night owl when it comes to concerts?",
      de: "Sind Sie bei Konzerten eher Frühaufsteher oder Nachteule?"
    },
    shapeImg: "assets/shapes/shapes7.png",
    shapePos: "bottom-right",
    options: [
      {
        value: "nightowl",
        label: { en: "Night owl", de: "Nachteule" },
        icon: "fa-solid fa-moon"
      },
      {
        value: "earlybird",
        label: { en: "Early bird", de: "Frühaufsteher" },
        icon: "fa-solid fa-dove"
      }
    ]
  },

  // 6. With whom would you be most interested in having a conversation? (image only)
  {
    id: "q6",
    type: "image",
    text: {
      en: "With whom would you be most interested in having a conversation?",
      de: "Mit wem würden Sie sich am liebsten unterhalten?"
    },
    shapeImg: "assets/shapes/shapes8.png",
    shapePos: "bottom-left",
    nextBg: COLORS.blue,
    nextText: COLORS.black,
    options: [
      {
        value: "connoisseur",
        img: "assets/answers/connoisseurperson.png",
        effects: { energy: +2, tradition: +2 }
      },
      {
        value: "pioneer",
        img: "assets/answers/pioneerperson.png",
        effects: { energy: +2, tradition: -2 }
      },
      {
        value: "purist",
        img: "assets/answers/puristperson.png",
        effects: { energy: -2, tradition: +2 }
      },
      {
        value: "bohemian",
        img: "assets/answers/bohemianperson.png",
        effects: { energy: -2, tradition: -2 }
      }
    ]
  },

  // 7. Which artwork fits your concert experience?
  {
    id: "q7",
    type: "image",
    text: {
      en: "Which artwork best captures your concert-going vibe?",
      de: "Welches Kunstwerk passt am besten zu Ihrem Konzerterlebnis?"
    },
    shapeImg: "assets/shapes/shapes8.png",
    shapePos: "bottom-right",
    nextBg: COLORS.green,
    nextText: COLORS.black,
    options: [
      {
        value: "connoisseur",
        img: "assets/answers/connoisseurpainting.png",
        effects: { energy: +2, tradition: +2 }
      },
      {
        value: "pioneer",
        img: "assets/answers/pioneerpainting.png",
        effects: { energy: +2, tradition: -2 }
      },
      {
        value: "purist",
        img: "assets/answers/puristpainting.png",
        effects: { energy: -2, tradition: +2 }
      },
      {
        value: "bohemian",
        img: "assets/answers/bohemianpainting.png",
        effects: { energy: -2, tradition: -2 }
      }
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
    id: "bohemian",
    title: { en: "Bohemian", de: "Bohemian" },
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
    Bohemian: {
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
    Bohemian: {
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
    Bohemian: {
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
    Bohemian: {
      en: "You enjoy wandering into new, mellow music experiences alone.",
      de: "Sie streifen gern allein durch neue, entspannte Musikerlebnisse."
    }
  }
};

export const ARCHETYPE_COLORS = {
  connoisseur: {
    base:  COLORS.orange,
    romantic:    "#ffe066",
    connected:   "#ffe699",
    social:      "#fff3bf",
    independent: "#fff9db"
  },
  pioneer: {
    base:  COLORS.blue,
    romantic:    "#bae6fd",
    connected:   "#38bdf8",
    social:      "#0ea5e9",
    independent: "#0369a1"
  },
  purist: {
    base:  COLORS.purple,
    romantic:    "#ddd6fe",
    connected:   "#a78bfa",
    social:      "#8b5cf6",
    independent: "#6d28d9"
  },
  bohemian: {
    base:  "#6EE7B7",
    romantic:    "#bbf7d0",
    connected:   "#34d399",
    social:      "#059669",
    independent: "#065f46"
  }
};
