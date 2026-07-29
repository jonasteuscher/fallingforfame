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
        "Die Kamera ist ein sichtbarer Teil zeitgenössischer BASE-Jumping-Ausrüstung. Sie kann Planung, Positionierung und Bildkomposition beeinflussen, bleibt aber nur ein Teil eines breiteren Ausrüstungs- und Vorbereitungssystems. Die Interviews stützen keinen einfachen automatischen Zusammenhang zwischen Kameranutzung und riskanterem Verhalten; Erfahrung, Planung und bewusster Umgang bleiben wichtig.",
      image: {
        src: "/images/findings/Camera.jpg",
        alt: "Ein BASE-Athlet bereitet sich an einem Berg auf einen Sprung vor. An seinem orangefarbenen Helm ist eine Actionkamera mit seitlich ausragender Halterung montiert. Im Hintergrund bereitet sich ein weiterer Athlet vor.",
      },
      states: [
        {
          id: "camera",
          title: "Actionkamera",
          body: "Ein Medienobjekt wird zu normaler Ausrüstung.",
          hotspots: [
            {
              id: "camera-arm",
              state: "camera",
              label: "KAMERA",
              description: "Die Kamera dokumentiert den Sprung und ermöglicht spätere Analyse und Reflexion. In den Interviews erscheint sie nicht als Auslöser von Risiko, sondern als selbstverständlicher Bestandteil der Praxis.",
              x: 30,
              y: 40,
              preferredSide: "right",
              calloutX: 10,
              calloutY: 3,
              calloutLineStartX: 42,
              calloutLineStartY: 17,
            },
          ],
        },
        {
          id: "helmet",
          title: "Helm und Halterung",
          body: "Die Kamera ist an Schutzausrüstung befestigt und wird Teil des technischen Setups des Athleten.",
          hotspots: [
            {
              id: "helmet-mount",
              state: "helmet",
              label: "HELM UND HALTERUNG",
              description: "Die Kamera ist direkt in die Schutzausrüstung integriert. Sie wird nicht als separates Medienobjekt verstanden, sondern als Teil eines abgestimmten technischen Systems.",
              x: 45,
              y: 45,
              preferredSide: "right",
              calloutX: 42,
              calloutY: 4,
              calloutLineStartX: 48,
              calloutLineStartY: 18,
            },
          ],
        },
        {
          id: "equipment",
          title: "Ausrüstungssystem",
          body: "Helm, Halterung, Suit und Container bilden ein technisches Setup rund um den Athleten.",
          hotspots: [
            {
              id: "wingsuit",
              state: "equipment",
              label: "WINGSUIT",
              description: "Der Wingsuit verlangt Erfahrung, Training und präzise Vorbereitung. Sicherheit entsteht durch Kompetenz - nicht durch die Kamera.",
              x: 67,
              y: 66,
              preferredSide: "right",
              calloutX: 56,
              calloutY: 8,
              calloutLineStartX: 67,
              calloutLineStartY: 23,
            },
            {
              id: "container",
              state: "equipment",
              label: "SCHIRMSYSTEM",
              description: "Der sichtbare Container erinnert daran, dass Sicherheit auf einem komplexen System basiert. Die Kamera ist darin nur ein einzelnes Element.",
              x: 82,
              y: 60,
              preferredSide: "right",
              calloutX: 58,
              calloutY: 9,
              calloutLineStartX: 70,
              calloutLineStartY: 24,
            },
          ],
        },
        {
          id: "preparation",
          title: "Vorbereitung",
          body: "Die Ausführung hängt von Fokus, Checks und Bedingungen ab, nicht von der Kamera allein.",
          hotspots: [
            {
              id: "concentration",
              state: "preparation",
              label: "KONZENTRATION",
              description: "Der Athlet richtet seine Aufmerksamkeit auf den bevorstehenden Sprung, nicht auf die Kamera. Entscheidungen entstehen durch Vorbereitung und Fokus, nicht durch die Aufnahme selbst.",
              x: 48,
              y: 53,
              preferredSide: "right",
              calloutX: 58,
              calloutY: 9,
              calloutLineStartX: 70,
              calloutLineStartY: 24,
            },
            {
              id: "partner-context",
              state: "preparation",
              label: "Vorbereitung",
              description:
                "Der Fokus liegt nicht auf dem perfekten Bild, sondern auf einem sicheren Sprung. Die gemeinsame Vorbereitung ist Teil dieses Prozesses.",
              x: 31,
              y: 73,
              preferredSide: "right",
              calloutX: 1,
              calloutY: 42,
              calloutLineStartX: 30,
              calloutLineStartY: 54,
            },
          ],
        },
        {
          id: "decision",
          title: "Entscheidung",
          body: "Planung, Erfahrung und bewusster Umgang mit der Technik bleiben entscheidend.",
          hotspots: [],
        },
      ],
    },
    {
      id: "visible-process",
      kind: "visible-invisible",
      eyebrow: "Was das Video nicht zeigt",
      title: "Das sichtbare Ergebnis ist nicht der ganze Prozess",
      summary:
        "Social Media zeigt die letzten Sekunden. Meist unsichtbar bleiben die Jahre des Lernens, der Zurückhaltung und des Community-Wissens, die diesen Moment erst möglich machen.",
      finding:
        "Sichtbar: der Clip. Unsichtbar: die Grundlage.",
      accessibleSummary:
        "Ein polierter Clip kann Jahre der Progression, gesammelte Erfahrung, Mentoring, Fehler, Routenstudium, langfristig aufgebautes Wetterwissen, abgesagte Sprünge, Geduld, Reflexion und Sicherheitskultur verbergen.",
      visibleLabel: "Sichtbar: der Clip",
      invisibleLabel: "Unsichtbar: die Grundlage",
      processDensity: "compact",
      left: {
        title: "Letzte Sekunden",
        items: ["spektakulär", "kurzer Moment", "leicht teilbar"],
      },
      right: {
        title: "Jahre dahinter",
        items: [
          "Jahre der Progression",
          "gesammelte Erfahrung",
          "Mentoring",
          "Fehler",
          "Routenstudium",
          "Wetterwissen",
          "abgesagte Sprünge",
          "Geduld",
          "Reflexion",
          "Sicherheitskultur",
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
        { title: "Projekt\nUnterstützung", body: "Ressourcen für konkrete Expeditionen oder Produktionen." },
        { title: "Bezahlte Medienproduktion", body: "Fotografie und Video werden Teil der Arbeit." },
        { title: "Coaching und verwandte Arbeit", body: "Wissen wird zu einer professionellen Dienstleistung." },
        { title: "Professionelle Existenz", body: "Sport, Medien und Kommunikation überschneiden sich." },
      ],
      layers: [
        "Sport",
        "Content-Produktion",
        "Projekt-\nEntwicklung",
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
      title: "Der Exit ist\nnicht der\nAnfang",
      summary:
        "Vor dem Exit treffen Athlet:innen eine Kette operativer Entscheidungen. Erst wenn alle Ebenen zusammenpassen, wird aus einer Planung ein Sprung.",
      finding:
        "Die Sprungentscheidung ist ein operativer Ablauf, kein einzelner Impuls.",
      accessibleSummary:
        "Entscheidungen erschienen als mehrschichtige operative Arbeit vor einem einzelnen Sprung: Projektauswahl, Erfahrung, Routenanalyse, Wetter, Ausrüstung, körperlicher und mentaler Zustand, Visualisierung, Gruppenverantwortung und finaler Go- oder No-Go-Entscheid.",
      image: {
        src: "/images/athletes/lukas-loibl/world-record-poster.jpg",
        alt: "Eine alpine Exit-Umgebung als visuelle Metapher für Planung vor dem Sprung.",
      },
      controlLabel: "Operativer Go- / No-Go-Prozess",
      layers: [
        "Projektauswahl",
        "Erfahrung und Können",
        "Routen- und Fluglinienanalyse",
        "Wetter und Wind",
        "Ausrüstung",
        "körperlicher Zustand",
        "mentaler Zustand",
        "Visualisierung",
        "Gruppenverantwortung",
        "finaler Go- / No-Go-Entscheid",
      ],
    },
    {
      id: "experience",
      kind: "experience-curve",
      navLabel: "Erfahrung",
      eyebrow: "Erfahrung und Selbsteinschätzung",
      title: "Risiko\nsieht mit\nErfahrung\nanders aus",
      summary:
        "Die Interviews legen nahe, dass wachsende Erfahrung verändert, wie Unsicherheit interpretiert wird. Vertrauen kann schnell wachsen, während reife Urteilskraft oft erst später entsteht.",
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
      title: "Nicht zu springen\nist manchmal\ndie beste Entscheidung.",
      summary:
        "Ein Abbruch kann auch nach langem Zustieg, Expedition, Vorbereitung oder finanzieller Investition die kompetente Entscheidung bleiben.",
      finding:
        "Nicht Springen ist keine Niederlage. Es ist eine aktive Sicherheitsentscheidung.",
      accessibleSummary:
        "Unsicherer Wind, Wolken, Sicht, körperlicher Zustand, mentale Verfassung, Intuition, Gruppendynamik und Verantwortung können erfahrene Athleten dazu bringen, wieder abzusteigen.",
      quote: "Der Berg steht auch morgen noch dort.",
      image: {
        src: "/images/findings/Walk_down.jpg",
        alt: "Ein BASE-Athlet steigt über einen felsigen Berggrat ab. Wolken ziehen über die umliegenden Gipfel und verdeutlichen die wechselnden Bedingungen.",
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
        "Das Modell zeigt, warum der Einfluss indirekt ist: Äussere Bedingungen spielen eine Rolle, aber Erfahrung, Risikokompetenz und Sicherheitskultur vermitteln, wie daraus Entscheidungen entstehen.",
      states: [
        {
          title: "Äussere Bedingungen",
          body: "Social Media und Sponsoring verändern den Kontext eines Sprungs, nicht die Entscheidung selbst.",
        },
        {
          title: "Soziale Mechanismen",
          body: "Sichtbarkeit erzeugt Erwartungen, Vergleich, Anerkennung und soziale Orientierung.",
        },
        {
          title: "Vermittelnde Faktoren",
          body: "Erfahrung, Risikokompetenz und Sicherheitskultur bestimmen, wie äussere Einflüsse interpretiert werden.",
        },
        {
          title: "Individuelle Entscheidung",
          body: "Jeder Sprung bleibt eine individuelle Entscheidung. Plattformen und Sponsoren entscheiden nicht; die Athlet:in entscheidet.",
        },
        {
          title: "Ergebnis",
          body: "Dasselbe Umfeld kann informierte, sicherheitsorientierte Entscheidungen unterstützen oder problematische Exposition begünstigen, wenn Schutzfaktoren fehlen.",
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
          steps: ["Sponsoring", "Ressourcen", "Training", "Projekte", "bessere Vorbereitung"],
        },
        {
          title: "Sponsoring als Erwartung",
          steps: ["Sponsoring", "Erwartungen", "selbst erzeugter Druck", "reduzierte Entscheidungsfreiheit", "potenziell veränderte Entscheidungen"],
        },
      ],
    },
    {
      id: "research-context",
      kind: "methodology",
      eyebrow: "Forschungskontext",
      title: "Was diese Studie beiträgt",
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
