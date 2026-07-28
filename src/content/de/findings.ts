import type { Finding } from "@/types/story";
import type { FindingsPageContent } from "@/types/findings";

export const findingsPage: FindingsPageContent = {
  metadata: {
    title: "Erkenntnisse | Falling for Fame?",
    description:
      "Qualitative Erkenntnisse zu Social Media, Sponsoring, Risikokompetenz und Sicherheitskultur im modernen BASE Jumping.",
  },
  navigationLabel: "Kapitel der Erkenntnisse",
  skipLabel: "Zum Forschungskontext springen",
  sourcePrefix: "Interpretation der Ergebnisse",
  empiricalLabel: "Empirische Erkenntnis",
  interpretationLabel: "Einordnung",
  quoteSourceLabel: "Interviewteilnehmer",
  hero: {
    eyebrow: "Qualitative Studie",
    title: "Zwischen Sichtbarkeit\nund Sicherheit",
    intro:
      "Fünf erfahrene BASE Athleten über Sichtbarkeit, Risiko und Sicherheitskultur.",
    methodology:
      "Qualitative Studie · 5 Leitfadeninterviews · teilnehmende Beobachtungen · Photo Elicitation",
    centralStatement:
      "Sichtbarkeit verändert die Bedingungen, unter denen Entscheidungen entstehen.",
    scrollCue: "Durch die Erkenntnisse scrollen",
    media: {
      src: "/images/findings/hero.jpg",
      alt: "Ein BASE Jumper fliegt neben einer Felswand.",
    },
    socialPost: {
      sourceLabel: "Scrollen zum Erkunden",
      menuLabel: "Mehr",
      username: "@timhowell",
      role: "Professioneller BASE Athlet",
      caption: "Perfekte Bedingungen heute.",
      hashtags: ["#basejump", "#wingsuit", "#berge"],
      views: "142'381 Aufrufe",
      actions: [
        { icon: "♡", label: "Likes", value: "124K" },
        { icon: "◌", label: "Kommentare", value: "2.3K" },
        { icon: "↗", label: "Teilen", value: "Teilen" },
        { icon: "⌑", label: "Gesponsertes Projekt", value: "Gesponsertes Projekt" },
        { icon: "⌞", label: "Speichern", value: "Speichern" },
      ],
      comments: [
        { author: "Alex", text: "Wahnsinns Linie." },
        { author: "Chris", text: "Einer der saubersten Flüge, die ich gesehen habe." },
      ],
    },
  },
  nav: [
    { id: "visibility", label: "Sichtbarkeit" },
    { id: "recognition", label: "Anerkennung" },
    { id: "sponsorship", label: "Sponsoring" },
    { id: "decision", label: "Entscheidung" },
    { id: "experience", label: "Erfahrung" },
    { id: "no-jump", label: "Nicht Springen" },
    { id: "community", label: "Community" },
    { id: "synthesis", label: "Synthese" },
  ],
  chapters: [
    {
      id: "visibility",
      kind: "media-visibility",
      navLabel: "Sichtbarkeit",
      eyebrow: "Was Social Media sichtbar macht",
      title: "Mehr als Selbstdarstellung",
      summary:
        "Die Interviews deuten darauf hin, dass digitale Plattformen gleichzeitig unterhalten, lehren, vernetzen und warnen können.",
      finding:
        "Digitale Medien öffnen den Zugang zum Sport und beschleunigen den Wissensaustausch. Gleichzeitig zeigen sie häufig nur das sichtbare Ergebnis.",
      accessibleSummary:
        "Social Media erschien als Einstieg, Lernplattform, internationales Netzwerk und Archiv. Der sichtbare Clip enthält aber selten die ganze Vorbereitung dahinter.",
      quote: "Wissen vertreibt Angst.",
      visibilitySequence: {
        media: {
          src: "/images/findings/Visibility.jpg",
          alt: "Ein BASE Jumper fliegt von einer Felswand über eine verschneite alpine Landschaft.",
        },
        states: [
          {
            id: "discovery",
            title: "Entdeckung",
            body: "Ein BASE-Jumping-Clip erscheint über Empfehlung und Neugier.",
            overlayLabel: "Für dich entdeckt",
            visualStatement: "Ein geteilter Clip wird zum ersten Kontaktpunkt.",
            overlayItems: ["Empfohlen", "Neuer Clip"],
          },
          {
            id: "inspiration",
            title: "Inspiration",
            body: "Neue Projekte, Fluglinien und Techniken werden sichtbar.",
            overlayLabel: "Als Referenz gespeichert",
            visualStatement: "Der Clip zeigt Orte, Linien und Möglichkeiten.",
            overlayItems: ["Fluglinie", "Projektreferenz"],
          },
          {
            id: "learning",
            title: "Lernen",
            body: "Planungsnotizen, Routenanalyse und technische Diskussionen können Medien in geteiltes Wissen verwandeln.",
            overlayLabel: "Analyse",
            visualStatement: "Das Bild wird zur Oberfläche, auf der Bedingungen, Route und Gelände gelesen werden.",
            annotations: [
              { id: "exit-point", label: "Exitpunkt", x: 83, y: 23, align: "right" },
              { id: "flight-corridor", label: "Flugkorridor", x: 58, y: 39 },
              { id: "terrain-reference", label: "Geländereferenz", x: 36, y: 74 },
            ],
          },
          {
            id: "reflection",
            title: "Reflexion",
            body: "Beinaheunfälle und Vorfälle können dieselbe Oberfläche von Unterhaltung zu Analyse verschieben.",
            overlayLabel: "Geteilte Erfahrung",
            visualStatement: "Dieselbe Plattform kann zum Ort werden, an dem aus Fehlern gelernt wird.",
            overlayItems: ["Erkenntnisse", "Was ist passiert?"],
          },
        ],
      },
      states: [
        {
          title: "Entdeckung",
          body: "Ein BASE-Jumping-Clip erscheint über Empfehlung und Neugier.",
        },
        {
          title: "Inspiration",
          body: "Neue Projekte, Fluglinien und Techniken werden sichtbar.",
        },
        {
          title: "Lernen",
          body: "Planungsnotizen und technische Diskussionen können Medien in geteiltes Wissen verwandeln.",
        },
        {
          title: "Reflexion",
          body: "Beinaheunfälle und Vorfälle können dieselbe Oberfläche von Unterhaltung zu Analyse verschieben.",
        },
      ],
    },
    {
      id: "camera",
      kind: "camera-equipment",
      eyebrow: "Kamerapräsenz",
      title: "Die Kamera ist Teil des Sprungs",
      summary:
        "Kameras sind im modernen BASE Jumping normalisiert. Die Interviews stützen aber keine einfache Aussage, dass eine Kamera automatisch Risiko erzeugt.",
      finding:
        "Nicht die Kamera entscheidet. Entscheidend ist der Umgang mit ihr.",
      accessibleSummary:
        "Kameras können Planung, Positionierung und Bildkomposition beeinflussen. Sicherheitsrelevante Entscheidungen hängen weiterhin von Vorbereitung, Selbstregulation und Kontext ab.",
      image: {
        src: "/images/sport/equipment/helmet-1.jpg",
        alt: "BASE-Jumping-Helm mit Ausrüstungsdetails.",
      },
      states: [
        { title: "Helm", body: "Schutz und Montagepunkt." },
        { title: "Actionkamera", body: "Ein Medienobjekt wird zu normaler Ausrüstung." },
        { title: "Fallschirm", body: "Das Sicherheitssystem bleibt zentral." },
        { title: "Wetter", body: "Äussere Bedingungen verschieben die Aufmerksamkeit weg vom Bild." },
        { title: "Konzentration", body: "Die Ausführung hängt von Fokus ab, nicht von der Kamera allein." },
      ],
    },
    {
      id: "visible-process",
      kind: "visible-invisible",
      eyebrow: "Was das Video nicht zeigt",
      title: "Das sichtbare Ergebnis ist nicht der ganze Prozess",
      summary:
        "Social Media kann Progression inspirieren. Imitation wird problematisch, wenn das sichtbare Ergebnis von Vorbereitung und Erfahrung getrennt wird.",
      finding:
        "Sichtbar: der Flug. Unsichtbar: die Entscheidungen.",
      accessibleSummary:
        "Ein polierter Clip kann Jahre der Progression, gescheiterte Versuche, Routenstudium, Wetterchecks, Gear-Checks, Mentoring, abgesagte Sprünge, Reflexion und Unsicherheit verbergen.",
      visibleLabel: "Sichtbar: der Flug",
      invisibleLabel: "Unsichtbar: die Entscheidungen",
      left: {
        title: "Polierter Clip",
        items: ["kurz", "spektakulär", "teilbar"],
      },
      right: {
        title: "Verborgener Prozess",
        items: [
          "Jahre der Progression",
          "gescheiterte Versuche",
          "Routenstudium",
          "Wetterchecks",
          "Gear-Checks",
          "Mentoring",
          "abgesagte Sprünge",
          "Reflexion",
          "Unsicherheit",
        ],
      },
    },
    {
      id: "recognition",
      kind: "recognition-comparison",
      navLabel: "Anerkennung",
      eyebrow: "Der Unterschied",
      title: "Reichweite ist\nnicht gleich\nAnerkennung",
      summary:
        "Mehrere Athleten unterschieden digitale Reichweite von langfristiger Anerkennung innerhalb der BASE Community.",
      finding: "Sichtbarkeit kann Türen öffnen. Anerkennung entsteht über Jahre.",
      accessibleSummary:
        "Kurzfristige Sichtbarkeit kann Aufmerksamkeit erzeugen. Anerkennung wurde aber mit Erfahrung, Kompetenz, Urteilskraft und kontinuierlicher sicherer Praxis verbunden.",
      insight: {
        empirical: "Aufmerksamkeit ist sichtbar.\nAnerkennung muss wachsen.",
        interpretation:
          "Während digitale Plattformen Reichweite beschleunigen können, entwickelt sich Anerkennung innerhalb der Community durch langfristig gelebte Kompetenz und verantwortungsbewusstes Handeln.",
      },
      left: {
        title: "Kurzfristige Sichtbarkeit",
        descriptor: "Schnell sichtbar. Schnell vergänglich.",
        items: [
          "Follower",
          "Views",
          "virale Clips",
          "spektakuläre Einzelaktionen",
          "Sponsor-Aufmerksamkeit",
        ],
      },
      right: {
        title: "Langfristige Anerkennung",
        descriptor: "Vertrauen entsteht langsam.",
        items: [
          "Erfahrung",
          "Kompetenz",
          "Konstanz",
          "Urteilskraft",
          "Jahre sicherer Praxis",
        ],
      },
      disclaimer:
        "Konzeptionelle Darstellung der qualitativen Ergebnisse, keine quantitative Messung.",
    },
    {
      id: "sponsorship",
      kind: "sponsorship-spectrum",
      navLabel: "Sponsoring",
      eyebrow: "Das Spektrum des Sponsorings",
      title: "Unterstützung hat viele Formen",
      summary:
        "Sponsoring unterschied sich zwischen den Athleten deutlich und reichte von kleiner Materialunterstützung bis zur Grundlage professioneller Arbeit.",
      finding:
        "Zum professionellen BASE Jumping gehört viel mehr, als nur von Felsen zu springen.",
      accessibleSummary:
        "Professionelles Sponsoring umfasst Ressourcen, Medienarbeit, Kommunikation, Projektentwicklung und mögliche indirekte Erwartungen. Es ist kein einheitlicher Weg, dem alle folgen.",
      quote: "Da steckt viel mehr dahinter, als nur von Klippen zu springen.",
      spectrum: [
        { title: "Materialrabatt", body: "Geringere Kosten für Ausrüstung." },
        { title: "Kostenlose Ausrüstung", body: "Materielle Unterstützung ohne vollständige Existenzgrundlage." },
        { title: "Projektunterstützung", body: "Ressourcen für konkrete Expeditionen oder Produktionen." },
        { title: "Bezahlte Medienproduktion", body: "Fotografie und Video werden Teil der Arbeit." },
        { title: "Coaching und verwandte Arbeit", body: "Wissen wird zu einer professionellen Dienstleistung." },
        { title: "Professionelle Existenz", body: "Sport, Medien und Kommunikation überschneiden sich." },
      ],
      layers: [
        "Sport",
        "Content-Produktion",
        "Projektentwicklung",
        "Marketing",
        "Kommunikation",
      ],
    },
    {
      id: "pressure",
      kind: "pressure-model",
      eyebrow: "Wo Druck tatsächlich entsteht",
      title: "Druck muss nicht ausgesprochen werden",
      summary:
        "Die Teilnehmenden beschrieben selten direkte Anweisungen von Sponsoren. Druck erschien häufiger indirekt oder selbst erzeugt.",
      finding:
        "Kein direkter Befehl. Aber möglicherweise eine selbst erzeugte Verpflichtung.",
      accessibleSummary:
        "Öffentliche Sichtbarkeit, Projektkosten, Deadlines, Publikumserwartungen und persönlicher Ehrgeiz können näher an die Entscheidung rücken, wenn Sicherheitsgrenzen nicht klar bleiben.",
      controlLabel: "Sicherheit vor Erwartung",
      controlResult:
        "Erfahrung, Vertrauen, klare Absprachen, persönliche Grenzen und die Bereitschaft zum Abbruch schaffen wieder Raum um die Entscheidung.",
      centerLabel: "Die Athlet:in",
      layers: [
        "öffentliche Sichtbarkeit",
        "Projektkosten",
        "Deadlines",
        "neue Ausrüstung",
        "finanzielle Anreize",
        "Publikumserwartungen",
        "Sponsorbeziehungen",
        "persönlicher Ehrgeiz",
      ],
    },
    {
      id: "decision",
      kind: "decision-layers",
      navLabel: "Entscheidung",
      eyebrow: "Was vor dem Sprung passiert",
      title: "Der Sprung beginnt lange vor dem Exit",
      summary:
        "Der sichtbare Sprung ist nur der letzte Moment eines längeren Prozesses aus Vorbereitung und Urteilskraft.",
      finding:
        "Risikokompetenz entsteht durch Vorbereitung, Erfahrung, Wissen und Reflexion.",
      accessibleSummary:
        "Entscheidungen erschienen als mehrschichtige Arbeit: Projektwahl, Routenanalyse, Wetter, Ausrüstung, Körper, Kopf, Gruppenverantwortung und finaler Go- oder No-Go-Entscheid.",
      image: {
        src: "/images/athletes/lukas-loibl/world-record-poster.jpg",
        alt: "Eine alpine Exit-Umgebung als visuelle Metapher für Planung vor dem Sprung.",
      },
      controlLabel: "Zeigen, was der Clip nicht zeigt",
      layers: [
        "Ziel und Projektauswahl",
        "Erfahrung und Können",
        "Routen- und Fluglinienanalyse",
        "Wetter und Wind",
        "Ausrüstung",
        "körperlicher Zustand",
        "mentaler Zustand",
        "Visualisierung",
        "Gruppe und Verantwortung",
        "finaler Go- / No-Go-Entscheid",
      ],
    },
    {
      id: "experience",
      kind: "experience-curve",
      navLabel: "Erfahrung",
      eyebrow: "Erfahrung und Selbsteinschätzung",
      title: "Erfahrung macht nicht automatisch sicher",
      summary:
        "Die Interviews legen ein qualitatives Muster von Lernen, wachsendem Vertrauen, möglicher Selbstüberschätzung und später differenzierterem Risikobewusstsein nahe.",
      finding:
        "Risikobewusstsein entsteht nicht trotz Fehlern und Erfahrungen, sondern häufig durch ihre Reflexion.",
      accessibleSummary:
        "Dies ist ein heuristisches Muster, kein statistisches Modell und kein universeller Entwicklungsweg für alle Athleten.",
      states: [
        { title: "Anfängliche Vorsicht", body: "Unsicherheit kann Zurückhaltung erzeugen." },
        { title: "Wachsendes Vertrauen", body: "Kompetenz wächst durch Praxis." },
        { title: "Mögliche Selbstüberschätzung", body: "Wahrgenommenes Können kann näher an Unsicherheit rücken." },
        { title: "Korrektur", body: "Fehler, Beinaheunfälle, Unfälle, Verlust und Beobachtung werden relevant." },
        { title: "Differenziertes Risikobewusstsein", body: "Reflexion verändert, wie Risiko interpretiert wird." },
      ],
    },
    {
      id: "no-jump",
      kind: "no-jump",
      navLabel: "Nicht Springen",
      eyebrow: "Die wichtigste Entscheidung",
      title: "Manchmal ist der sicherste Sprung keiner",
      summary:
        "Ein Abbruch kann auch nach langem Zustieg, Expedition, Vorbereitung oder finanzieller Investition die kompetente Entscheidung bleiben.",
      finding:
        "Nicht Springen ist keine Niederlage. Es ist eine aktive Sicherheitsentscheidung.",
      accessibleSummary:
        "Unsicherer Wind, Wolken, Sicht, körperlicher Zustand, mentale Verfassung, Intuition, Gruppendynamik und Verantwortung können erfahrene Athleten dazu bringen, wieder abzusteigen.",
      quote: "Der Berg steht auch morgen noch dort.",
      image: {
        src: "/images/athletes/lukas-loibl/story.jpeg",
        alt: "Alpines Gelände als Sinnbild für einen möglichen Exit und den Weg zurück.",
      },
      layers: [
        "Wind",
        "Wolken",
        "Sicht",
        "körperlicher Zustand",
        "mentaler Zustand",
        "Intuition",
        "Gruppendynamik",
        "Verantwortung für andere",
      ],
    },
    {
      id: "community",
      kind: "safety-network",
      navLabel: "Community",
      eyebrow: "Sicherheit ist sozial",
      title: "Sicherheit entsteht nicht allein",
      summary:
        "Die Community stellt Wissen, Mentoring und Orientierung bereit, kann sichere Entscheidungen aber nicht garantieren.",
      finding:
        "Die Community stellt Wissen bereit. Anwenden muss es jede Person selbst.",
      accessibleSummary:
        "Informelle Sicherheitskultur kann Feedback und Koordination unterstützen. Dasselbe Netzwerk kann aber auch Imitation, Reputationsdruck oder Schweigen über Fehler enthalten.",
      left: {
        title: "Unterstützender Zustand",
        items: ["Wissen", "Vertrauen", "Feedback", "Koordination", "Verantwortung"],
      },
      right: {
        title: "Ambivalenter Zustand",
        items: [
          "Imitation",
          "einer erfahreneren Person folgen",
          "Reputation",
          "Schweigen über Fehler",
          "Gruppendruck",
        ],
      },
      layers: [
        "Athlet:in",
        "Mentor:in",
        "Sprungpartner:innen",
        "erfahrene Community-Mitglieder",
        "Coaching",
        "Beinaheunfall-Diskussionen",
        "BASE Fatality List",
        "geteilte Routinen",
        "Ausrüstungschecks",
        "Debriefing",
      ],
    },
    {
      id: "synthesis",
      kind: "synthesis-model",
      navLabel: "Synthese",
      eyebrow: "Synthese",
      title: "Der Einfluss ist indirekt",
      summary:
        "Sichtbarkeit führt nicht automatisch zu mehr Risiko. Sie verändert die Bedingungen, unter denen Entscheidungen entstehen.",
      finding:
        "Soziale Medien und Sponsoring beeinflussen die Rahmenbedingungen. Sicherheitsrelevante Entscheidungen werden jedoch stärker durch Erfahrung, Risikokompetenz und die gelebte Sicherheitskultur geprägt.",
      accessibleSummary:
        "Das Modell zeigt äussere Bedingungen, die über soziale Mechanismen und vermittelnde Schutzfaktoren zu individuellen Entscheidungen und Ergebnissen führen.",
      states: [
        {
          title: "Äussere Bedingungen",
          body: "Social Media und Sponsoring.",
        },
        {
          title: "Soziale Mechanismen",
          body: "Sichtbarkeit, Anerkennung, Vergleich, Erwartungen und ökonomische Möglichkeiten.",
        },
        {
          title: "Vermittelnde Faktoren",
          body: "Erfahrung, Risikokompetenz, Sicherheitskultur, informelle Normen, Reflexion und Selbstregulation.",
        },
        {
          title: "Individuelle Entscheidung",
          body: "Risikowahrnehmung, Vorbereitung und Go- / No-Go-Entscheid.",
        },
        {
          title: "Ergebnis",
          body: "Sicherheitsorientierte Praxis oder potenziell erhöhte Exposition, wenn Schutzfaktoren versagen.",
        },
      ],
      paths: [
        {
          title: "Social Media als Lerninfrastruktur",
          steps: ["Social Media", "Inspiration", "Lernen", "mehr Wissen", "informiertere Entscheidung"],
        },
        {
          title: "Social Media als Imitationsumfeld",
          steps: ["spektakulärer Content", "Imitation", "unzureichende Progression", "potenziell problematische Entscheidung"],
        },
        {
          title: "Sponsoring als Ressource",
          steps: ["Ressourcen", "Training und Projekte", "bessere Vorbereitung"],
        },
        {
          title: "Sponsoring als Erwartung",
          steps: ["indirekte Erwartung", "selbst erzeugter Druck", "potenziell veränderte Entscheidung"],
        },
      ],
    },
    {
      id: "research-context",
      kind: "methodology",
      eyebrow: "Forschungskontext",
      title: "Was diese Studie zeigen kann und was nicht",
      summary:
        "Die Erkenntnisse stammen aus einem qualitativen explorativen Design und müssen in diesem Rahmen gelesen werden.",
      finding:
        "Die Ergebnisse beziehen sich auf dieses Sample und erheben keinen Anspruch auf statistische Repräsentativität.",
      accessibleSummary:
        "Die Studie basiert auf fünf erfahrenen männlichen BASE Athleten, Leitfadeninterviews, teilnehmenden Beobachtungen, Photo Elicitation und thematischer Analyse.",
      methodologyItems: [
        "qualitatives exploratives Design",
        "fünf erfahrene männliche BASE Athleten",
        "Leitfadeninterviews",
        "teilnehmende Beobachtungen",
        "Photo Elicitation",
        "thematische Analyse",
        "Ergebnisse beziehen sich auf dieses Sample",
        "kein Anspruch auf statistische Repräsentativität",
      ],
      links: [
        { href: "/project", label: "Kontext der Bachelorarbeit" },
        { href: "/athletes", label: "Athletenporträts" },
      ],
    },
  ],
};

export const findings: Finding[] = [];
