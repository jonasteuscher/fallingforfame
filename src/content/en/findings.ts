import type { Finding } from "@/types/story";
import type { FindingsPageContent } from "@/types/findings";

export const findingsPage: FindingsPageContent = {
  metadata: {
    title: "Findings",
    description:
      "Qualitative findings on social media, sponsorship, risk competence and safety culture in modern BASE jumping.",
  },
  navigationLabel: "Findings chapters",
  skipLabel: "Skip to research context",
  sourcePrefix: "Key insight",
  empiricalLabel: "Empirical finding",
  interpretationLabel: "Interpretation",
  quoteSourceLabel: "Interview participant",
  hero: {
    eyebrow: "Qualitative study",
    title: "Between Visibility\nand Safety",
    intro: "Five experienced BASE athletes on visibility, risk and safety culture.",
    methodology:
      "Qualitative study · 5 guided interviews · participant observations · photo elicitation",
    centralStatement: "Visibility changes the conditions in which decisions are made.",
    scrollCue: "Scroll through the findings",
    media: {
      src: "/images/findings/hero.jpg",
      alt: "A BASE jumper flying beside a mountain wall.",
    },
    socialPost: {
      sourceLabel: "Scroll to explore",
      menuLabel: "More",
      username: "@timhowell",
      role: "Professional BASE Athlete",
      caption: "Perfect conditions today.",
      hashtags: ["#basejump", "#wingsuit", "#mountains"],
      views: "142,381 views",
      actions: [
        { icon: "♡", label: "Likes", value: "124K" },
        { icon: "◌", label: "Comments", value: "2.3K" },
        { icon: "↗", label: "Share", value: "Share" },
        { icon: "⌑", label: "Sponsored project", value: "Sponsored Project" },
        { icon: "⌞", label: "Save", value: "Save" },
      ],
      comments: [
        { author: "Alex", text: "Insane line." },
        { author: "Chris", text: "One of the cleanest flights I've seen." },
      ],
    },
  },
  nav: [
    { id: "visibility", label: "Visibility" },
    { id: "recognition", label: "Recognition" },
    { id: "sponsorship", label: "Sponsorship" },
    { id: "decision", label: "Decision" },
    { id: "experience", label: "Experience" },
    { id: "community", label: "Community" },
    { id: "synthesis", label: "Synthesis" },
  ],
  chapters: [
    {
      id: "visibility",
      kind: "media-visibility",
      navLabel: "Visibility",
      eyebrow: "What social media makes visible",
      title: "More than self-presentation",
      summary:
        "The interviews indicate that digital platforms can entertain, teach, connect and warn at the same time.",
      finding:
        "Digital media provides access to the sport and accelerates knowledge exchange. At the same time, it often shows only the visible outcome.",
      accessibleSummary:
        "Social media appeared as an entry point, learning platform, international network and archive, but the visible clip rarely contains the full preparation behind it.",
      quote: "Knowledge dispels fear.",
      visibilitySequence: {
        media: {
          src: "/images/findings/Visibility.jpg",
          alt: "A BASE jumper flying away from a cliff above a snowy alpine landscape.",
        },
        states: [
          {
            id: "discovery",
            title: "Discovery",
            body: "A BASE jumping clip appears through recommendation and curiosity.",
            overlayLabel: "Discovered for you",
            visualStatement: "A shared clip becomes the first contact point.",
            overlayItems: ["Recommended", "New clip"],
          },
          {
            id: "inspiration",
            title: "Inspiration",
            body: "New projects, flight lines and techniques become visible.",
            overlayLabel: "Saved as reference",
            visualStatement:
              "The clip starts to reveal places, lines and possibilities.",
            overlayItems: ["Flight line", "Project reference"],
          },
          {
            id: "learning",
            title: "Learning",
            body: "Planning notes, route analysis and technical discussion can turn media into shared knowledge.",
            overlayLabel: "Analysis",
            visualStatement:
              "The image becomes a surface for reading conditions, route and terrain.",
            annotations: [
              { id: "exit-point", label: "exit point", x: 83, y: 23, align: "right" },
              { id: "flight-corridor", label: "flight corridor", x: 58, y: 39 },
              { id: "terrain-reference", label: "terrain reference", x: 36, y: 74 },
            ],
          },
          {
            id: "reflection",
            title: "Reflection",
            body: "Close calls and incidents can shift the same interface from entertainment to analysis.",
            overlayLabel: "Shared experience",
            visualStatement:
              "The same platform can become a place for learning from mistakes.",
            overlayItems: ["Lessons", "What happened?"],
          },
        ],
      },
      states: [
        {
          title: "Discovery",
          body: "A BASE jumping clip appears through recommendation and curiosity.",
        },
        {
          title: "Inspiration",
          body: "New projects, flight lines and techniques become visible.",
        },
        {
          title: "Learning",
          body: "Planning notes and technical discussion can turn media into shared knowledge.",
        },
        {
          title: "Reflection",
          body: "Close calls and incidents can shift the same interface from entertainment to analysis.",
        },
      ],
    },
    {
      id: "camera",
      kind: "camera-equipment",
      eyebrow: "Camera presence",
      title: "The camera is part of the jump",
      summary:
        "Cameras are normalised in modern BASE jumping, but the interviews do not support a simple camera-causes-risk claim.",
      finding: "The camera does not make the decision. What matters is how it is used.",
      accessibleSummary:
        "The camera is a visible part of contemporary BASE jumping equipment. It may influence planning, positioning and image composition, but it remains one part of a broader equipment and preparation system. The interviews do not support a simple automatic link between camera use and riskier behaviour; experience, planning and deliberate use remain important.",
      image: {
        src: "/images/findings/Camera.jpg",
        alt: "A BASE athlete prepares for a jump on a mountain. An action camera with an extending side mount is attached to his orange helmet, while another athlete prepares in the background.",
      },
      states: [
        {
          id: "camera",
          title: "Action camera",
          body: "A media object that becomes ordinary equipment.",
          hotspots: [
            {
              id: "camera-arm",
              state: "camera",
              label: "CAMERA",
              description:
                "The camera documents the jump and enables later review and reflection. In the interviews, it is not presented as a source of risk but as a normal part of everyday practice.",
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
          title: "Helmet and mount",
          body: "The camera is attached to protective equipment and becomes part of the athlete's technical setup.",
          hotspots: [
            {
              id: "helmet-mount",
              state: "helmet",
              label: "HELMET AND MOUNT",
              description:
                "The camera is integrated directly into the protective equipment. Rather than being treated as a separate media device, it forms part of a carefully configured technical system.",
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
          title: "Equipment system",
          body: "Helmet, mount, suit and parachute container form a technical setup around the athlete.",
          hotspots: [
            {
              id: "wingsuit",
              state: "equipment",
              label: "WINGSUIT",
              description:
                "The wingsuit demands experience, training and careful preparation. Safe performance depends on competence, not on the camera.",
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
              label: "PARACHUTE SYSTEM",
              description:
                "The visible container highlights that safety relies on a complex system. The camera is only one element within that system.",
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
          title: "Preparation",
          body: "Execution depends on focus, checks and conditions, not the camera alone.",
          hotspots: [
            {
              id: "concentration",
              state: "preparation",
              label: "FOCUS",
              description:
                "The athlete's attention is on the upcoming jump, not on the camera. Decisions are shaped by preparation and focus, not by being filmed.",
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
              label: "Preparation",
              description:
                "The focus is not on capturing the perfect shot, but on making a safe jump. Shared preparation is an essential part of that process.",
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
          title: "Decision",
          body: "Planning, experience and deliberate use of the technology remain decisive.",
          hotspots: [],
        },
      ],
    },
    {
      id: "visible-process",
      kind: "visible-invisible",
      eyebrow: "What the video does not show",
      title: "The visible result is not the whole process",
      summary:
        "Social media shows the final seconds, but usually hides the years of learning, restraint and community knowledge that make those seconds possible.",
      finding: "Visible: the clip. Invisible: the foundation.",
      accessibleSummary:
        "A polished clip may hide years of progression, accumulated experience, mentoring, mistakes, route study, weather knowledge, cancelled jumps, patience, reflection and safety culture.",
      visibleLabel: "Visible: the clip",
      invisibleLabel: "Invisible: the foundation",
      left: {
        title: "Final seconds",
        items: ["spectacular", "short moment", "highly shareable"],
      },
      right: {
        title: "Years behind it",
        items: [
          "years of progression",
          "accumulated experience",
          "mentoring",
          "mistakes",
          "route study",
          "weather knowledge",
          "cancelled jumps",
          "patience",
          "reflection",
          "safety culture",
        ],
      },
    },
    {
      id: "recognition",
      kind: "recognition-comparison",
      navLabel: "Recognition",
      eyebrow: "The difference",
      title: "Attention is not\nrecognition",
      summary:
        "Several athletes distinguished digital reach from long-term recognition inside the BASE community.",
      finding: "Visibility can open doors. Recognition is built over years.",
      accessibleSummary:
        "Short-term visibility can create attention, but recognition was described as being tied to experience, competence, judgement and consistent safe practice.",
      insight: {
        empirical: "Attention is visible.\nRecognition must be earned over time.",
        interpretation:
          "While digital platforms can accelerate visibility, recognition within the community develops through long-term experience, competence and responsible practice.",
      },
      left: {
        title: "Short-term visibility",
        descriptor: "Fast to appear. Fast to fade.",
        items: [
          "followers",
          "views",
          "viral clips",
          "spectacular individual actions",
          "sponsor attention",
        ],
      },
      right: {
        title: "Long-term recognition",
        descriptor: "Trust builds slowly.",
        items: [
          "experience",
          "competence",
          "consistency",
          "judgement",
          "years of safe practice",
        ],
      },
      disclaimer:
        "Conceptual representation of the qualitative findings, not a quantitative measurement.",
    },
    {
      id: "sponsorship",
      kind: "sponsorship-spectrum",
      navLabel: "Sponsorship",
      eyebrow: "The sponsorship spectrum",
      title: "Support takes many forms",
      summary:
        "Sponsorship differed substantially between athletes and ranged from minor material support to a foundation for professional work.",
      finding: "There is a lot more to it than just jumping off cliffs.",
      accessibleSummary:
        "Professional sponsorship includes resources, media work, communication, project development and possible indirect expectations. It is not a single path every athlete follows.",
      quote: "There’s a lot more to it than just jumping off cliffs.",
      spectrum: [
        { title: "Equipment discount", body: "Reduced costs for gear." },
        {
          title: "Free equipment",
          body: "Material support without a full livelihood.",
        },
        {
          title: "Project support",
          body: "Resources for specific expeditions or productions.",
        },
        {
          title: "Paid media production",
          body: "Photography and video become part of the work.",
        },
        {
          title: "Coaching and related work",
          body: "Knowledge becomes a professional service.",
        },
        {
          title: "Professional livelihood",
          body: "Sport, media and communication overlap.",
        },
      ],
      layers: [
        "sport",
        "content production",
        "project development",
        "marketing",
        "communication",
      ],
    },
    {
      id: "pressure",
      kind: "pressure-model",
      eyebrow: "Where pressure actually appears",
      title: "Pressure does not have to be spoken",
      summary:
        "Participants rarely described direct commands from sponsors. Pressure was more often indirect or self-generated.",
      finding: "No direct command. But potentially a self-created obligation.",
      accessibleSummary:
        "Public visibility, project costs, deadlines, audience expectations and personal ambition can move closer to the decision unless safety boundaries remain clear.",
      controlLabel: "Safety over expectation",
      controlResult:
        "Experience, trust, clear agreements, personal limits and willingness to cancel restore space around the decision.",
      centerLabel: "The athlete",
      layers: [
        "public visibility",
        "project costs",
        "deadlines",
        "new equipment",
        "financial incentives",
        "audience expectations",
        "sponsor relationships",
        "personal ambition",
      ],
    },
    {
      id: "decision",
      kind: "decision-layers",
      navLabel: "Decision",
      eyebrow: "What happens before the jump",
      title: "The exit is\nnot the beginning",
      summary:
        "Before the exit, athletes make a chain of operational decisions. Only when the layers fit together does a plan become a jump.",
      finding:
        "A jump decision is an operational pipeline, not a single moment of impulse.",
      accessibleSummary:
        "Decision making emerged as layered operational work before one jump: project selection, experience, route analysis, weather, equipment, physical and mental condition, visualisation, group responsibility and final go or no-go judgement.",
      image: {
        src: "/images/athletes/lukas-loibl/world-record-poster.jpg",
        alt: "A mountain exit environment used as a visual metaphor for pre-jump planning.",
      },
      controlLabel: "Operational Go / No-Go process",
      layers: [
        "Project selection",
        "Experience and skill",
        "Route / flight line analysis",
        "Weather and wind",
        "Equipment",
        "Physical condition",
        "Mental condition",
        "Visualisation",
        "Group responsibility",
        "Final Go / No-Go decision",
      ],
    },
    {
      id: "experience",
      kind: "experience-curve",
      navLabel: "Experience",
      eyebrow: "Experience and self-assessment",
      title: "Risk\nlooks\ndifferent\nwith\nexperience",
      summary:
        "The interviews suggest that growing experience changes how uncertainty is interpreted. Confidence may increase quickly, while mature judgement often develops much later.",
      finding:
        "Risk awareness often develops through reflecting on errors and experience.",
      accessibleSummary:
        "This is a heuristic pattern, not a statistical model or a universal development path for every athlete.",
      states: [
        { title: "Initial caution", body: "Uncertainty can create restraint." },
        { title: "Increasing confidence", body: "Competence grows through practice." },
        {
          title: "Possible overconfidence",
          body: "Perceived ability can move closer to uncertainty.",
        },
        {
          title: "Correction",
          body: "Errors, close calls, accidents, loss and observation matter.",
        },
        {
          title: "Differentiated risk awareness",
          body: "Reflection changes how risk is interpreted.",
        },
      ],
    },
    {
      id: "no-jump",
      kind: "no-jump",
      navLabel: "No Jump",
      eyebrow: "The most important decision",
      title: "Sometimes, not jumping\nis the best decision.",
      summary:
        "Cancelling can remain the competent decision even after a long hike, an expedition, preparation or financial investment.",
      finding: "Not jumping is not failure. It is an active safety decision.",
      accessibleSummary:
        "Uncertain wind, clouds, visibility, physical condition, mental state, intuition, group dynamics and responsibility can all lead an experienced athlete to walk down.",
      quote: "The mountain will still be there tomorrow.",
      image: {
        src: "/images/findings/Walk_down.jpg",
        alt: "A BASE athlete walks down along a rocky mountain ridge as clouds move across the surrounding peaks, illustrating changing conditions.",
      },
      layers: [
        "wind",
        "clouds",
        "visibility",
        "physical condition",
        "mental state",
        "intuition",
        "group dynamics",
        "responsibility for others",
      ],
    },
    {
      id: "community",
      kind: "safety-network",
      navLabel: "Community",
      eyebrow: "Safety is social",
      title: "Safety is not built alone",
      summary:
        "The community provides knowledge, mentoring and orientation, but it cannot guarantee safe decisions.",
      finding:
        "The community provides knowledge. Each person must decide how to use it.",
      accessibleSummary:
        "Informal safety culture can support feedback and coordination, while the same network can also contain imitation, reputation pressure or silence around mistakes.",
      left: {
        title: "Supportive state",
        items: ["knowledge", "trust", "feedback", "coordination", "responsibility"],
      },
      right: {
        title: "Ambivalent state",
        items: [
          "imitation",
          "following a more experienced person",
          "reputation",
          "silence around mistakes",
          "group pressure",
        ],
      },
      layers: [
        "athlete",
        "mentor",
        "jump partners",
        "experienced community members",
        "coaching",
        "close-call discussions",
        "BASE Fatality List",
        "shared routines",
        "equipment checks",
        "debriefing",
      ],
    },
    {
      id: "synthesis",
      kind: "synthesis-model",
      navLabel: "Synthesis",
      eyebrow: "Synthesis",
      title: "The influence is indirect",
      summary:
        "Visibility does not directly create risk. It changes the conditions in which decisions are made.",
      finding:
        "Social media and sponsorship shape the surrounding conditions. Safety-relevant decisions, however, are more strongly shaped by experience, risk competence and lived safety culture.",
      accessibleSummary:
        "The model shows why influence is indirect: external conditions matter, but experience, risk competence and safety culture mediate how they become decisions.",
      states: [
        {
          title: "External conditions",
          body: "Social media and sponsorship change the context around a jump, not the decision itself.",
        },
        {
          title: "Social mechanisms",
          body: "Visibility creates expectations, comparison, recognition and social orientation.",
        },
        {
          title: "Mediating factors",
          body: "Experience, risk competence and safety culture determine how external influences are interpreted.",
        },
        {
          title: "Individual decision",
          body: "Every jump remains an individual decision. Platforms and sponsors do not decide; the athlete does.",
        },
        {
          title: "Outcome",
          body: "The same environment can support informed safety-oriented decisions or create problematic exposure when protective factors fail.",
        },
      ],
      paths: [
        {
          title: "Social media as learning infrastructure",
          steps: [
            "social media",
            "inspiration",
            "learning",
            "greater knowledge",
            "more informed decision",
          ],
        },
        {
          title: "Social media as imitation environment",
          steps: [
            "spectacular content",
            "imitation",
            "insufficient progression",
            "potentially problematic decision",
          ],
        },
        {
          title: "Sponsorship as resource",
          steps: [
            "sponsorship",
            "resources",
            "training",
            "projects",
            "better preparation",
          ],
        },
        {
          title: "Sponsorship as expectation",
          steps: [
            "sponsorship",
            "expectations",
            "self-generated pressure",
            "reduced decision freedom",
            "potentially altered decisions",
          ],
        },
      ],
    },
    {
      id: "research-context",
      kind: "methodology",
      eyebrow: "Research context",
      title: "What this study contributes",
      summary:
        "The findings come from a qualitative exploratory design and should be read within that scope.",
      finding:
        "The findings reflect this sample and do not claim statistical representativeness.",
      accessibleSummary:
        "The study is based on five experienced male BASE athletes, guided interviews, participant observations, photo elicitation and thematic analysis.",
      methodologyItems: [
        "qualitative exploratory design",
        "five experienced male BASE athletes",
        "guided interviews",
        "participant observations",
        "photo elicitation",
        "thematic analysis",
        "findings reflect this sample",
        "no claim of statistical representativeness",
      ],
      links: [
        { href: "/project", label: "Full bachelor thesis context" },
        { href: "/athletes", label: "Athlete stories" },
      ],
    },
  ],
};

export const findings: Finding[] = [];
