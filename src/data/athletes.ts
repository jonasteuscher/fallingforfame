import type {
  Athlete,
  AthleteExperience,
  AthleteOriginStoryBeat,
} from "@/types/athlete";

const emptyMedia = {
  audio: [],
  video: [],
  quotes: [],
  links: [],
  articles: [],
};

function images(
  hero: string | null = null,
  portrait: string | null = null,
): Athlete["images"] {
  return {
    hero,
    portrait,
    gallery: [],
  };
}

function experience(
  skydiveSeasons: number,
  skydives: number,
  baseSeasons: number,
  basejumps: number,
  sponsored: boolean,
  socialMediaReach: number | null,
): AthleteExperience {
  return {
    skydiveSeasons,
    skydives,
    baseSeasons,
    basejumps,
    sponsored,
    socialMediaReach,
  };
}

const originStories: Record<string, AthleteOriginStoryBeat[]> = {
  "marcel-geser": [
    {
      phase: { en: "01 — Before BASE", de: "01 — Vor BASE" },
      title: { en: "A life already shaped by sport", de: "Ein Leben im Sport" },
      body: {
        en: "Sport had been part of Marcel Geser’s life long before BASE jumping appeared. He grew up in a sporty family and spent many years breakdancing, until that chapter ended and left space for a new passion.",
        de: "Sport gehörte schon lange zu Marcel Gesers Leben, bevor BASE Jumping auftauchte. Er wuchs in einer sportlichen Familie auf und verbrachte viele Jahre mit Breakdance, bis diese Zeit endete und Raum für eine neue Leidenschaft entstand.",
      },
    },
    {
      phase: { en: "02 — Paragliding", de: "02 — Gleitschirmfliegen" },
      title: { en: "Aviation enters the picture", de: "Der Weg in die Luft" },
      body: {
        en: "In 2008, while working in intelligence services in Bern, Marcel began paragliding. During breaks he often watched paragliding videos on YouTube, following the sport even when he was away from the mountains.",
        de: "2008 begann Marcel mit dem Gleitschirmfliegen, während er in Bern im Nachrichtendienst arbeitete. In den Pausen schaute er oft Gleitschirmvideos auf YouTube und blieb so auch fern der Berge mit dem Fliegen verbunden.",
      },
      media: { type: "image", src: "/images/athletes/marcel-geser/story.jpg" },
    },
    {
      phase: { en: "03 — The Algorithm", de: "03 — Der Algorithmus" },
      title: { en: "One video changes the direction", de: "Ein Video verändert die Richtung" },
      body: {
        en: "One day, YouTube recommended a BASE jumping video. Marcel describes that moment as the point where the sport first caught hold of him and opened a new direction within aviation sports.",
        de: "Eines Tages schlug ihm YouTube ein BASE-Jumping-Video vor. Marcel beschreibt diesen Moment als den Beginn seiner Faszination für den Sport und als neue Richtung innerhalb des Fliegens.",
      },
      quote: {
        en: "One recommendation was enough for BASE jumping to enter his imagination.",
        de: "Eine Empfehlung reichte, damit BASE Jumping in seiner Vorstellung auftauchte.",
      },
    },
    {
      phase: { en: "04 — Into BASE", de: "04 — Ins BASE Jumping" },
      title: { en: "From paragliding to skydiving to BASE", de: "Vom Gleitschirm zum Fallschirm zu BASE" },
      body: {
        en: "Paragliding led to skydiving, and skydiving later opened the door to BASE jumping. Aviation sports became the centre of his free time and gradually replaced the passion he had once found in breakdance.",
        de: "Aus dem Gleitschirmfliegen wurde Fallschirmspringen, später kam BASE Jumping dazu. Flugsportarten rückten ins Zentrum seiner Freizeit und füllten nach und nach den Platz, den früher Breakdance eingenommen hatte.",
      },
    },
    {
      phase: { en: "05 — Today", de: "05 — Heute" },
      title: { en: "Flying as a natural element", de: "Fliegen als natürliches Element" },
      body: {
        en: "For Marcel, flying became more than a hobby. He describes it as his natural element, and the mountains and the air remain central to how he spends much of his life.",
        de: "Für Marcel wurde Fliegen mehr als ein Hobby. Er beschreibt es als sein natürliches Element, und die Berge und die Luft prägen bis heute einen grossen Teil seines Lebens.",
      },
    },
  ],
  "niclas-strohmeier": [
    {
      phase: { en: "01 — First Images", de: "01 — Erste Bilder" },
      title: { en: "A teenage encounter with flight", de: "Eine frühe Begegnung mit dem Fliegen" },
      body: {
        en: "Niclas Strohmeier first saw wingsuit BASE jumping videos on YouTube when he was around thirteen or fourteen. The images of people flying through the mountains immediately stayed with him.",
        de: "Niclas Strohmeier sah Wingsuit-BASE-Jumping zum ersten Mal auf YouTube, als er etwa dreizehn oder vierzehn Jahre alt war. Die Bilder von Menschen, die durch die Berge flogen, blieben sofort hängen.",
      },
    },
    {
      phase: { en: "02 — Research", de: "02 — Recherche" },
      title: { en: "A dream becomes a pathway", de: "Aus einem Traum wird ein Weg" },
      body: {
        en: "Instead of treating the sport as a distant fantasy, he began researching what it would take to get there. He learned that BASE jumping required a foundation in skydiving and started saving money as a teenager.",
        de: "Statt den Sport nur als entfernten Traum zu betrachten, begann er zu recherchieren, welcher Weg dorthin führt. Er verstand, dass BASE Jumping Fallschirmerfahrung voraussetzt, und sparte schon als Jugendlicher Geld dafür.",
      },
      quote: {
        en: "The videos did not stay a dream. They became a plan.",
        de: "Die Videos blieben kein Traum. Sie wurden zu einem Plan.",
      },
    },
    {
      phase: { en: "03 — Skydiving", de: "03 — Fallschirmspringen" },
      title: { en: "Building the foundation", de: "Die Grundlage schaffen" },
      body: {
        en: "At seventeen, Niclas completed his skydiving licence. He built experience step by step until, at twenty and with around 340 skydives, he attended a BASE course.",
        de: "Mit siebzehn machte Niclas seine Fallschirmlizenz. Danach sammelte er Schritt für Schritt Erfahrung, bis er mit zwanzig und rund 340 Skydives einen BASE-Kurs besuchte.",
      },
      media: { type: "image", src: null },
    },
    {
      phase: { en: "04 — Moving Closer", de: "04 — Näher an die Berge" },
      title: { en: "A life shaped by the sport", de: "Ein Leben näher am Sport" },
      body: {
        en: "What began with online inspiration became a long-term commitment. Over time, it helped shape larger decisions, including his move from Germany to Switzerland to be closer to the mountains.",
        de: "Was mit Online-Videos begann, wurde zu einer langfristigen Verpflichtung. Später prägte diese Entscheidung auch sein Leben ausserhalb des Sports, bis hin zum Umzug von Deutschland in die Schweiz.",
      },
    },
  ],
  "josef-braun": [
    {
      phase: { en: "01 — Movement First", de: "01 — Bewegung zuerst" },
      title: { en: "Speed, control and early risk", de: "Tempo, Kontrolle und frühes Risiko" },
      body: {
        en: "Josef Braun’s path began long before his first skydive. As a child he was drawn to movement-based sports, spending years riding motocross and later working in motorcycle racing environments.",
        de: "Josef Brauns Weg begann lange vor seinem ersten Fallschirmsprung. Schon als Kind zog es ihn zu Sportarten, in denen Bewegung wichtig ist. Viele Jahre fuhr er Motocross und arbeitete später im Umfeld des Motorradrennsports.",
      },
    },
    {
      phase: { en: "02 — A Break", de: "02 — Ein Bruch" },
      title: { en: "An accident changes the direction", de: "Ein Unfall verändert die Richtung" },
      body: {
        en: "After an accident interrupted that path, skydiving moved into focus. It was something he had wanted to do for years, but it was never the final goal on its own.",
        de: "Nach einem Unfall, der diesen Weg unterbrach, rückte Fallschirmspringen in den Vordergrund. Es war etwas, das ihn schon lange interessiert hatte, aber nie das eigentliche Endziel war.",
      },
      media: { type: "image", src: null },
    },
    {
      phase: { en: "03 — Wingsuit Images", de: "03 — Wingsuit-Bilder" },
      title: { en: "A mountain dream appears", de: "Ein Traum von den Bergen" },
      body: {
        en: "Around 2013 and 2014, Josef discovered wingsuit videos. The idea of one day flying through the mountains became the image he wanted to work toward.",
        de: "Um 2013 und 2014 entdeckte Josef Wingsuit-Videos. Daraus entstand der Wunsch, eines Tages selbst durch die Berge zu fliegen.",
      },
      quote: {
        en: "Skydiving was part of the path, but the mountains were the goal.",
        de: "Fallschirmspringen war Teil des Weges, aber die Berge waren das Ziel.",
      },
    },
    {
      phase: { en: "04 — Full Commitment", de: "04 — Volle Hingabe" },
      title: { en: "Everything into progression", de: "Alles in die Entwicklung" },
      body: {
        en: "To move quickly, he invested everything he could into the sport. He moved abroad, completed hundreds of skydives in a short time and transitioned into BASE jumping soon afterwards.",
        de: "Um schnell voranzukommen, setzte er viel auf diese Entwicklung. Er ging ins Ausland, absolvierte in kurzer Zeit Hunderte Fallschirmsprünge und wechselte bald darauf ins BASE Jumping.",
      },
    },
    {
      phase: { en: "05 — A Life Around Flying", de: "05 — Ein Leben ums Fliegen" },
      title: { en: "From challenge to profession", de: "Von der Herausforderung zum Beruf" },
      body: {
        en: "What started as a personal challenge gradually became the centre of his life. Over time, the sport developed into a profession linking daily work, athletic identity and long-term mountain ambitions.",
        de: "Aus einer persönlichen Herausforderung wurde nach und nach der Mittelpunkt seines Lebens. Später entwickelte sich daraus ein Beruf, der Arbeit, sportliche Identität und Projekte in den Bergen miteinander verbindet.",
      },
    },
  ],
  "lukas-loibl": [
    {
      phase: { en: "01 — Shared Videos", de: "01 — Gemeinsame Videos" },
      title: { en: "A dream watched with a friend", de: "Ein Traum mit einem Freund" },
      body: {
        en: "Lukas Loibl grew up watching wingsuit videos on YouTube with a close friend. The idea of flying through alpine terrain quickly became more than a passing interest.",
        de: "Lukas Loibl wuchs mit Wingsuit-Videos auf YouTube auf, die er gemeinsam mit einem engen Freund anschaute. Die Vorstellung, durch alpines Gelände zu fliegen, liess ihn schnell nicht mehr los.",
      },
    },
    {
      phase: { en: "02 — Skateboarding Years", de: "02 — Skateboard-Jahre" },
      title: { en: "Progression before the sky", de: "Fortschritt vor dem Fliegen" },
      body: {
        en: "His friend entered skydiving first, while Lukas initially stayed with skateboarding and other teenage pursuits. The drive for progression was already there, even before he entered aviation sports.",
        de: "Sein Freund begann zuerst mit dem Fallschirmspringen, während Lukas zunächst beim Skateboarden und anderen Interessen seiner Jugend blieb. Der Wunsch nach Fortschritt war schon da, bevor der Flugsport begann.",
      },
      media: { type: "image", src: null },
    },
    {
      phase: { en: "03 — Skydiving", de: "03 — Fallschirmspringen" },
      title: { en: "The same intensity, fewer injuries", de: "Ähnliche Intensität, weniger Verletzungen" },
      body: {
        en: "Two years later he followed the same path. In skydiving, he found the intensity and progression he had known from skateboarding, but with fewer injuries.",
        de: "Zwei Jahre später folgte er demselben Weg. Im Fallschirmspringen fand er eine ähnliche Intensität und Entwicklung wie zuvor beim Skateboarden, nur mit weniger Verletzungen.",
      },
      quote: {
        en: "Skydiving gave him the progression he was looking for.",
        de: "Fallschirmspringen gab ihm die Entwicklung, nach der er gesucht hatte.",
      },
    },
    {
      phase: { en: "04 — Commitment", de: "04 — Hingabe" },
      title: { en: "Working to keep jumping", de: "Arbeiten, um springen zu können" },
      body: {
        en: "The sport soon took over more of his life. He worked alongside school to pay for jumps and put most of his time and energy into becoming better.",
        de: "Der Sport nahm immer mehr Raum in seinem Leben ein. Neben der Schule arbeitete er, um Sprünge zu finanzieren, und steckte den grössten Teil seiner Zeit und Energie in seine Fortschritte.",
      },
    },
    {
      phase: { en: "05 — Into BASE", de: "05 — Ins BASE Jumping" },
      title: { en: "A life built around flying", de: "Ein Leben rund ums Fliegen" },
      body: {
        en: "After three years in skydiving, Lukas moved into BASE jumping with the same commitment. What began with videos and a shared dream gradually became a life built around flying, training and the mountains.",
        de: "Nach drei Jahren im Fallschirmspringen wechselte Lukas ins BASE Jumping. Was mit Videos und einem gemeinsamen Traum begann, wurde Schritt für Schritt zu einem Leben rund ums Fliegen, Training und die Berge.",
      },
    },
    {
      phase: { en: "06 — Today", de: "06 — Heute" },
      title: {
        en: "Pursuing the dream full time",
        de: "Der Traum als Vollzeitweg",
      },
      body: {
        en: "Today, Lukas has quit his job to pursue that dream full time: coaching at his own wingsuit school and working as a wingsuit pilot for sponsored projects.",
        de: "Heute hat Lukas seinen Job gekuendigt, um diesen Traum vollzeit zu verfolgen: als Coach an seiner eigenen Wingsuit-Schule und als Wingsuit-Pilot fuer gesponserte Projekte.",
      },
    },
  ],
  "tim-howell": [
    {
      phase: { en: "01 — Before BASE", de: "01 — Vor BASE" },
      title: { en: "Adventure came first", de: "Das Abenteuer kam zuerst" },
      body: {
        en: "Tim Howell was drawn to risk, movement and adventure before BASE jumping entered his life. Climbing, freeride mountain biking and mountain sports shaped his early years.",
        de: "Tim Howell fühlte sich schon vor dem BASE Jumping von Risiko, Abenteuer und Bewegung angezogen. Klettern, Freeride-Mountainbiken und Bergsport prägten seine frühen Jahre.",
      },
    },
    {
      phase: { en: "02 — Skydiving Detour", de: "02 — Der Umweg über Skydiving" },
      title: { en: "The road, not the destination", de: "Der Weg, nicht das Ziel" },
      body: {
        en: "When Tim began skydiving, it was not because he saw it as the destination. It was a necessary step toward the larger goal of becoming a BASE jumper.",
        de: "Als Tim mit dem Fallschirmspringen begann, war es für ihn nicht das eigentliche Ziel. Es war ein notwendiger Schritt auf dem Weg zum BASE Jumping.",
      },
      quote: {
        en: "Skydiving was never the destination. It was the road to BASE.",
        de: "Fallschirmspringen war nie das Ziel. Es war der Weg zu BASE.",
      },
    },
    {
      phase: { en: "03 — Mountain Objectives", de: "03 — Ziele in den Bergen" },
      title: { en: "Attention shifts to remote terrain", de: "Der Blick geht ins Gelände" },
      body: {
        en: "Around the same period, he joined the military, but his attention increasingly moved toward mountain-based objectives and the possibilities of remote terrain.",
        de: "In derselben Zeit trat er ins Militär ein, doch sein Interesse verlagerte sich zunehmend auf Projekte in den Bergen und auf die Möglichkeiten abgelegener Landschaften.",
      },
      media: { type: "image", src: "/images/athletes/tim-howell/story.JPG" },
    },
    {
      phase: { en: "04 — Discovering BASE", de: "04 — BASE entdecken" },
      title: { en: "More than adrenaline", de: "Mehr als Adrenalin" },
      body: {
        en: "Once he entered BASE jumping, skydiving quickly became less important. What held his interest was the mix of exploration, freedom and self-reliance in mountain environments.",
        de: "Nachdem er ins BASE Jumping eingestiegen war, verlor das reine Fallschirmspringen schnell an Bedeutung. Was ihn festhielt, war die Verbindung aus Erkundung, Freiheit und Eigenverantwortung in den Bergen.",
      },
    },
    {
      phase: { en: "05 — Today", de: "05 — Heute" },
      title: { en: "An endless source of projects", de: "Eine endlose Quelle neuer Projekte" },
      body: {
        en: "Tim continues to see the sport as an endless source of projects. His motivation is shaped more by curiosity, planning and mountain objectives than by simply collecting jumps.",
        de: "Tim sieht den Sport bis heute als endlose Quelle neuer Projekte. Seine Motivation entsteht eher aus Neugier, Planung und Zielen in den Bergen als aus dem blossen Sammeln von Sprüngen.",
      },
    },
  ],
};

export const athletes: Athlete[] = [
  {
    id: "marcel-geser",
    slug: "marcel-geser",
    name: "Marcel Geser",
    age: 45,
    country: "Switzerland",
    platforms: [],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(
      "/images/athletes/marcel-geser/hero.jpg",
      "/images/athletes/marcel-geser/profile.jpg",
    ),
    experience: experience(14, 850, 13, 1500, false, null),
    content: {
      en: {
        title: "Hobby BASE Jumper",
        shortBio:
          "Swiss paragliding pilot and experienced BASE jumper with more than a decade of experience in the sport. A former Swiss BASE Association president for over 10 years, his focus spans terminal, wingsuit and tracking jumps while maintaining a hobby-based approach to BASE jumping.",
        intro:
          "Swiss paragliding pilot, experienced BASE jumper and former Swiss BASE Association president for over 10 years.",
        baseStoryTitle: "Discovering a passion for flight",
        baseStory:
          "Marcel Geser came to BASE jumping through a longer search for a new passion. Sport had always been part of his life. He grew up in a sporty family and spent many years breakdancing before eventually leaving that world behind. When that chapter ended, he began looking for something that could take its place. In 2008, while working in intelligence services in Bern, he started paragliding. During breaks at work he often watched paragliding videos on YouTube. One day, the platform recommended a BASE jumping video. He describes that moment as the point where the sport first caught hold of him. Aviation sports gradually became the centre of his free time. Paragliding led to skydiving, and skydiving later opened the door to BASE jumping. For Marcel, flying became more than a hobby. He describes it as his natural element, a place where his attention, body and environment come together. The mountains and the air remain central to how he spends much of his life.",
        profession: "Paragliding Pilot",
        role: "Hobby BASE Jumper",
        residence: "Switzerland",
        primaryDisciplines: ["Terminal", "Wingsuit", "Tracking"],
      },
      de: {
        title: "Hobby BASE Jumper",
        shortBio:
          "Schweizer Gleitschirmpilot und erfahrener BASE Jumper mit über einem Jahrzehnt Erfahrung im Sport. Als ehemaliger Präsident der Swiss BASE Association über mehr als 10 Jahre liegt sein Schwerpunkt auf Terminal-, Wingsuit- und Tracking-Sprüngen, die er als ambitionierter Hobbysportler ausübt.",
        intro:
          "Schweizer Gleitschirmpilot, erfahrener BASE Jumper und ehemaliger Präsident der Swiss BASE Association über mehr als 10 Jahre.",
        baseStoryTitle: "Die Entdeckung einer Leidenschaft fürs Fliegen",
        baseStory:
          "Marcel Geser fand seinen Weg zum BASE Jumping nicht über einen einzelnen Plan, sondern über die Suche nach einer neuen Leidenschaft. Sport war schon früh ein fester Teil seines Lebens. Er wuchs in einer sportlichen Familie auf und verbrachte viele Jahre mit Breakdance. Als diese Zeit vorbei war, fehlte etwas, das ihn ähnlich stark fesseln konnte. 2008 begann er mit dem Gleitschirmfliegen, während er in Bern im Nachrichtendienst arbeitete. In den Pausen schaute er oft Gleitschirmvideos auf YouTube. Eines Tages schlug ihm der Algorithmus ein BASE-Jumping-Video vor. Diesen Moment beschreibt er als den Beginn seiner Faszination für den Sport. Aus dem Gleitschirmfliegen wurde Fallschirmspringen, später kam BASE Jumping dazu. Nach und nach rückten Flugsportarten ins Zentrum seiner Freizeit. Für Marcel ist Fliegen nicht nur Bewegung oder Technik. Er beschreibt es als sein natürliches Element. Die Berge und die Luft prägen bis heute einen grossen Teil seines Lebens.",
        profession: "Gleitschirmpilot",
        role: "Hobby BASE Jumper",
        residence: "Schweiz",
        primaryDisciplines: ["Terminal", "Wingsuit", "Tracking"],
      },
    },
    originStory: originStories["marcel-geser"],
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "niclas-strohmeier",
    slug: "niclas-strohmeier",
    name: "Niclas Strohmeier",
    age: 28,
    country: "Germany",
    platforms: ["Instagram", "YouTube"],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(),
    experience: experience(12, 630, 9, 1000, false, 500000),
    content: {
      en: {
        title: "Hobby / Semiprofessional",
        shortBio:
          "German athlete living in Switzerland with a background in tourism. Active on Instagram and YouTube, he combines a strong online presence with nearly a decade of BASE jumping experience.",
        intro:
          "German athlete living in Switzerland with a background in tourism.",
        baseStoryTitle: "Inspired by the dream of flying",
        baseStory:
          "Niclas Strohmeier first encountered wingsuit BASE jumping through videos on YouTube when he was around thirteen or fourteen. The images of people flying through the mountains left a strong impression on him. To him, it looked like one of the most extraordinary experiences a person could have. But he did not leave it as a distant fantasy. He began researching what it would actually take to reach that point and learned that BASE jumping required a foundation in skydiving. As a teenager, he started saving money with that goal in mind. At seventeen he completed his skydiving licence and began building experience step by step. By the age of twenty, with around 340 skydives, he attended a BASE course. What began as fascination with online videos became a structured path into the sport. Over time, that commitment shaped larger decisions in his life, including his move from Germany to Switzerland to be closer to the mountains and to the environment where BASE jumping had become part of his everyday world.",
        profession: "Tourism Professional",
        role: "Hobby / Semiprofessional",
        residence: "Switzerland",
        primaryDisciplines: ["Terminal"],
      },
      de: {
        title: "Hobby / Semiprofessionell",
        shortBio:
          "Deutscher Athlet mit Wohnsitz in der Schweiz und beruflichem Hintergrund im Tourismus. Mit einer grossen Reichweite auf Instagram und YouTube verbindet er digitale Sichtbarkeit mit langjähriger BASE-Erfahrung.",
        intro:
          "Deutscher Athlet mit Wohnsitz in der Schweiz und beruflichem Hintergrund im Tourismus.",
        baseStoryTitle: "Inspiriert vom Traum des Fliegens",
        baseStory:
          "Niclas Strohmeier sah Wingsuit-BASE-Jumping zum ersten Mal auf YouTube, als er etwa dreizehn oder vierzehn Jahre alt war. Die Bilder von Menschen, die durch die Berge flogen, blieben ihm sofort im Kopf. Für ihn wirkte es wie eine der aussergewöhnlichsten Erfahrungen, die man machen kann. Dabei blieb es nicht bei einem Traum. Niclas begann zu recherchieren, welcher Weg überhaupt in diesen Sport führt, und verstand schnell, dass BASE Jumping viel Erfahrung im Fallschirmspringen voraussetzt. Schon als Jugendlicher sparte er Geld für dieses Ziel. Mit siebzehn machte er seine Fallschirmlizenz und sammelte danach Schritt für Schritt Sprungerfahrung. Mit zwanzig und rund 340 Skydives besuchte er schliesslich einen BASE-Kurs. Aus der Faszination für Videos wurde ein konkreter Weg. Später beeinflusste diese Entscheidung auch sein Leben ausserhalb des Sports. Der Umzug von Deutschland in die Schweiz brachte ihn näher an die Berge und an den Sport, der heute einen grossen Teil seines Alltags prägt.",
        profession: "Tourismusfachmann",
        role: "Hobby / Semiprofessionell",
        residence: "Schweiz",
        primaryDisciplines: ["Terminal"],
      },
    },
    originStory: originStories["niclas-strohmeier"],
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "josef-braun",
    slug: "josef-braun",
    name: "Josef Braun",
    age: 27,
    country: "Germany",
    platforms: ["Instagram"],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(),
    experience: experience(8, 800, 5, 1500, false, 280000),
    content: {
      en: {
        title: "Semiprofessional",
        shortBio:
          "German athlete based in Switzerland working as a wind tunnel instructor, BASE coach and video creator. His work combines athletic performance, coaching and media production.",
        intro:
          "German athlete based in Switzerland working as a wind tunnel instructor, BASE coach and video creator.",
        baseStoryTitle: "Turning a dream into a profession",
        baseStory:
          "Josef Braun’s path toward BASE jumping began long before he made his first skydive. As a child, he was drawn to movement, speed and physical control. He spent years riding motocross and later worked in motorcycle racing environments. After an accident interrupted that direction, his attention shifted toward skydiving, something he had wanted to try for years. But skydiving was never the final goal on its own. Around 2013 and 2014 he discovered wingsuit videos, and the idea of flying through mountains became the image he wanted to work toward. To move quickly, he invested everything he could into the sport. He moved abroad, completed hundreds of skydives in a short time and transitioned into BASE jumping soon afterwards. What started as a personal challenge gradually became the centre of his life. Over time, the sport developed into a profession, linking his daily work, his athletic identity and his long-term ambitions around flying in mountain terrain.",
        profession: "Wind Tunnel Instructor, BASE Coach and Video Creator",
        role: "Hobby / Semiprofessional",
        residence: "Switzerland",
        primaryDisciplines: ["Tracking"],
      },
      de: {
        title: "Semiprofessionell",
        shortBio:
          "Deutscher Athlet mit Wohnsitz in der Schweiz. Als Tunnelinstruktor, BASE-Coach und Videograf verbindet er sportliche Leistung, Coaching und Medienproduktion.",
        intro:
          "Deutscher Athlet mit Wohnsitz in der Schweiz. Als Tunnelinstruktor, BASE-Coach und Videograf verbindet er sportliche Leistung, Coaching und Medienproduktion.",
        baseStoryTitle: "Vom Traum zum Beruf",
        baseStory:
          "Josef Brauns Weg zum BASE Jumping begann lange vor seinem ersten Fallschirmsprung. Schon als Kind fühlte er sich zu Sportarten hingezogen, in denen Bewegung, Geschwindigkeit und Körpergefühl wichtig sind. Viele Jahre fuhr er Motocross, später arbeitete er im Umfeld des Motorradrennsports. Nach einem Unfall, der diesen Weg unterbrach, rückte Fallschirmspringen in den Vordergrund, etwas, das ihn schon lange interessiert hatte. Das eigentliche Ziel lag jedoch weiter vorne. Als er um 2013 und 2014 Wingsuit-Videos entdeckte, entstand der Wunsch, selbst einmal durch die Berge zu fliegen. Um schnell voranzukommen, setzte er viel auf diese Entwicklung. Er ging ins Ausland, absolvierte in kurzer Zeit Hunderte Fallschirmsprünge und wechselte bald darauf ins BASE Jumping. Aus einer persönlichen Herausforderung wurde nach und nach der Mittelpunkt seines Lebens. Später entwickelte sich daraus ein Beruf, in dem Sport, Arbeit und die Suche nach Projekten in den Bergen eng miteinander verbunden sind.",
        profession: "Tunnelinstruktor, BASE-Coach und Videograf",
        role: "Hobby / Semiprofessionell",
        residence: "Schweiz",
        primaryDisciplines: ["Tracking"],
      },
    },
    originStory: originStories["josef-braun"],
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "lukas-loibl",
    slug: "lukas-loibl",
    name: "Lukas Loibl",
    age: 26,
    country: "Austria",
    platforms: ["Instagram", "YouTube"],
    sponsorship: {
      en: "Multiple sponsors since 2022, including canopies, wingsuits, cameras and clothing.",
      de: "Mehrere Sponsoren seit 2022, darunter Canopies, Wingsuits, Kameras und Kleidung.",
    },
    images: images(
      "/images/athletes/lukas-loibl/hero1-web.jpeg",
      "/images/athletes/lukas-loibl/profile-2.jpg",
    ),
    experience: experience(6, 3500, 6, 3000, true, 200000),
    content: {
      en: {
        title: "Professional",
        shortBio:
          "Austrian professional BASE jumping instructor and coach. With thousands of skydives and BASE jumps, he represents a fully professional approach to the sport and works closely with multiple industry sponsors.",
        intro: "Austrian professional BASE jumping instructor and coach.",
        baseStoryTitle: "From skateboarding to the mountains",
        baseStory:
          "Lukas Loibl grew up watching wingsuit videos on YouTube with a close friend. The idea of flying through alpine terrain quickly became more than a passing interest. His friend entered skydiving first, while Lukas initially stayed with skateboarding and other teenage pursuits. Two years later he followed the same path and found in skydiving the kind of intensity and progression he had known from skateboarding, but with fewer injuries. The sport soon took over more and more of his life. He worked alongside school to pay for jumps and put most of his available time and energy into becoming better. After three years in skydiving, he moved into BASE jumping with the same commitment. Lukas describes that complete focus as one reason he was able to progress quickly. What began with videos and a shared dream with a friend gradually became a life built around flying, training and the mountains.",
        profession: "BASE Jumping Instructor / Coach",
        role: "Professional",
        residence: "Switzerland",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
      de: {
        title: "Professionell",
        shortBio:
          "Österreichischer BASE-Jumping-Instruktor und Coach. Mit mehreren tausend Fallschirm- und BASE-Sprüngen steht er für einen professionellen Zugang zum Sport und arbeitet mit verschiedenen Sponsoren aus der Branche zusammen.",
        intro: "Österreichischer BASE-Jumping-Instruktor und Coach.",
        baseStoryTitle: "Vom Skateboard in die Berge",
        baseStory:
          "Lukas Loibl wuchs mit Wingsuit-Videos auf YouTube auf, die er gemeinsam mit einem engen Freund anschaute. Die Vorstellung, durch alpines Gelände zu fliegen, liess ihn schnell nicht mehr los. Sein Freund begann zuerst mit dem Fallschirmspringen, während Lukas zunächst beim Skateboarden und anderen Interessen seiner Jugend blieb. Zwei Jahre später folgte er demselben Weg. Im Fallschirmspringen fand er eine ähnliche Intensität und Entwicklung wie zuvor beim Skateboarden, nur mit weniger Verletzungen. Der Sport nahm immer mehr Raum in seinem Leben ein. Neben der Schule arbeitete er, um Sprünge zu finanzieren, und steckte den grössten Teil seiner Zeit und Energie in seine Fortschritte. Nach drei Jahren im Fallschirmspringen wechselte er ins BASE Jumping und ging diesen Schritt mit derselben Hingabe an. Diese vollständige Ausrichtung auf den Sport sieht er als einen Grund, warum er schnell vorankam und sich später ein Leben rund ums Fliegen, Training und die Berge aufbauen konnte.",
        profession: "BASE-Jumping-Instruktor / Coach",
        role: "Professionell",
        residence: "Schweiz",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
    },
    originStory: originStories["lukas-loibl"],
    ...emptyMedia,
    sponsors: [
      {
        name: "Atair Canopies",
        logo: "/images/sponsors/atair_white.png",
        url: "https://ataircanopies.com/",
      },
      {
        name: "Moreboards",
        logo: "/images/sponsors/moreboards.avif",
        url: "https://www.moreboards.com/",
      },
      {
        name: "Squirrel",
        logo: "/images/sponsors/squirrel_blue.png",
        url: "https://squirrel.ws/",
      },
      {
        name: "DJI",
        logo: "/images/sponsors/dji_white.webp",
        url: "https://www.dji.com/",
      },
    ],
  },
  {
    id: "tim-howell",
    slug: "tim-howell",
    name: "Tim Howell",
    age: 37,
    country: "United Kingdom",
    platforms: ["Instagram", "Facebook"],
    sponsorship: {
      en: "Multiple sponsors, primarily clothing and equipment. Sponsored for 7 years.",
      de: "Mehrere Sponsoren, vor allem Kleidung und Ausrüstung. Seit 7 Jahren gesponsert.",
    },
    images: images(
      "/images/athletes/tim-howell/hero.jpg",
      "/images/athletes/tim-howell/profile.jpg",
    ),
    experience: experience(2, 250, 14, 1450, true, 100000),
    content: {
      en: {
        title: "Professional",
        shortBio:
          "British professional mountain athlete based in Switzerland. Known for combining mountaineering, climbing and BASE jumping, he has spent more than a decade pursuing complex mountain objectives around the world.",
        intro: "British professional mountain athlete based in Switzerland.",
        baseStoryTitle: "Searching for freedom in the mountains",
        baseStory:
          "Tim Howell was drawn to risk, movement and adventure before BASE jumping entered his life. Climbing, freeride mountain biking and mountain sports shaped his early years and gave him a strong connection to steep terrain. When he began skydiving, it was not because he saw it as the destination. It was a step toward the larger goal of becoming a BASE jumper. Around the same period, he joined the military, but his attention increasingly moved toward mountain-based objectives. Once he entered BASE jumping, skydiving quickly became less important to him. What held his interest was not adrenaline alone. It was the mix of exploration, freedom and self-reliance that BASE jumping offered in remote mountain environments. For Tim, the sport opened a way to connect movement with place, planning and uncertainty. He continues to see it as an endless source of projects, shaped more by curiosity and mountain objectives than by simply collecting jumps.",
        profession: "Professional Mountain Athlete",
        role: "Professional",
        residence: "Switzerland",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
      de: {
        title: "Professionell",
        shortBio:
          "Britischer Bergsportler mit Wohnsitz in der Schweiz. Er verbindet Alpinismus, Klettern und BASE Jumping und verfolgt seit über einem Jahrzehnt anspruchsvolle Projekte in den Bergen weltweit.",
        intro: "Britischer Bergsportler mit Wohnsitz in der Schweiz.",
        baseStoryTitle: "Auf der Suche nach Freiheit in den Bergen",
        baseStory:
          "Tim Howell fühlte sich schon vor dem BASE Jumping von Risiko, Abenteuer und Bewegung angezogen. Klettern, Freeride-Mountainbiken und Bergsport prägten seine frühen Jahre und brachten ihn immer wieder in steiles Gelände. Als er mit dem Fallschirmspringen begann, war das für ihn nicht das eigentliche Ziel. Es war ein notwendiger Schritt auf dem Weg zum BASE Jumping. In derselben Zeit trat er ins Militär ein, doch sein Interesse verlagerte sich zunehmend auf Projekte in den Bergen. Nachdem er ins BASE Jumping eingestiegen war, verlor das reine Fallschirmspringen für ihn schnell an Bedeutung. Was ihn am Sport festhielt, war nicht nur Adrenalin. Es war die Verbindung aus Erkundung, Freiheit und Eigenverantwortung in abgelegenen Berglandschaften. Für Tim wurde BASE Jumping zu einer Möglichkeit, Bewegung, Planung und Unsicherheit miteinander zu verbinden. Bis heute sieht er darin eine endlose Quelle neuer Projekte, getragen von Neugier und der Suche nach anspruchsvollen Zielen in den Bergen.",
        profession: "Professioneller Bergsportler",
        role: "Professionell",
        residence: "Schweiz",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
    },
    originStory: originStories["tim-howell"],
    ...emptyMedia,
    sponsors: [
      {
        name: "Jöttnar",
        logo: "/images/sponsors/jottnar_white.png",
        url: "https://www.jottnar.com/",
      },
      {
        name: "Scarpa",
        logo: "/images/sponsors/scarpa_originla.webp",
        url: "https://scarpa.com/",
      },
      {
        name: "Adrenalin BASE",
        logo: "/images/sponsors/adrenalin_base.png",
        url: "https://www.adrenalinbase.com/",
      },
    ],
  },
];

export function getAthleteBySlug(slug: string) {
  return athletes.find((athlete) => athlete.slug === slug);
}
