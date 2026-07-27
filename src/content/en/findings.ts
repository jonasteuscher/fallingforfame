import type { Finding } from "@/types/story";
import type { FindingsPageContent } from "@/types/findings";

export const findingsPage: FindingsPageContent = {
  metadata: {
    title: "Findings | Falling for Fame?",
    description:
      "Qualitative findings on social media, sponsorship, risk competence and safety culture in modern BASE jumping.",
  },
  navigationLabel: "Findings chapters",
  skipLabel: "Skip to research context",
  sourcePrefix: "Qualitative finding",
  empiricalLabel: "Empirical finding",
  interpretationLabel: "Interpretation",
  hero: {
    eyebrow: "Qualitative study",
    title: "Between Visibility\nand Safety",
    intro:
      "Five experienced BASE athletes on visibility, risk and safety culture.",
    methodology:
      "Qualitative study · 5 guided interviews · participant observations · photo elicitation",
    centralStatement:
      "Visibility changes the conditions in which decisions are made.",
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
    { id: "no-jump", label: "No Jump" },
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
      id: "recognition",
      kind: "recognition-comparison",
      navLabel: "Recognition",
      eyebrow: "Attention is not recognition",
      title: "Attention is not recognition",
      summary:
        "Several athletes distinguished digital reach from long-term recognition inside the BASE community.",
      finding: "Visibility can open doors. Respect is built over years.",
      accessibleSummary:
        "Short-term visibility can create attention, but recognition was described as being tied to experience, competence, judgement and consistent safe practice.",
      left: {
        title: "Short-term visibility",
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
        items: [
          "experience",
          "competence",
          "consistency",
          "judgement",
          "years of safe practice",
        ],
      },
    },
    {
      id: "camera",
      kind: "camera-equipment",
      eyebrow: "The camera",
      title: "The camera is part of the jump",
      summary:
        "Cameras are normalised in modern BASE jumping, but the interviews do not support a simple camera-causes-risk claim.",
      finding:
        "The camera does not make the decision. What matters is how it is used.",
      accessibleSummary:
        "Camera use may influence planning, positioning and image composition, while safety-relevant judgement still depends on preparation, self-regulation and context.",
      image: {
        src: "/images/sport/equipment/helmet-1.jpg",
        alt: "BASE jumping helmet with equipment details.",
      },
      states: [
        { title: "Helmet", body: "Protection and mounting point." },
        { title: "Action camera", body: "A media object that becomes ordinary equipment." },
        { title: "Parachute", body: "The safety system remains central." },
        { title: "Weather", body: "External conditions redirect attention away from image making." },
        { title: "Concentration", body: "Execution depends on focus, not the camera alone." },
      ],
    },
    {
      id: "sponsorship",
      kind: "sponsorship-spectrum",
      navLabel: "Sponsorship",
      eyebrow: "The sponsorship spectrum",
      title: "Support takes many forms",
      summary:
        "Sponsorship differed substantially between athletes and ranged from minor material support to a foundation for professional work.",
      finding:
        "There is a lot more to it than just jumping off cliffs.",
      accessibleSummary:
        "Professional sponsorship includes resources, media work, communication, project development and possible indirect expectations. It is not a single path every athlete follows.",
      quote: "There’s a lot more to it than just jumping off cliffs.",
      spectrum: [
        { title: "Equipment discount", body: "Reduced costs for gear." },
        { title: "Free equipment", body: "Material support without a full livelihood." },
        { title: "Project support", body: "Resources for specific expeditions or productions." },
        { title: "Paid media production", body: "Photography and video become part of the work." },
        { title: "Coaching and related work", body: "Knowledge becomes a professional service." },
        { title: "Professional livelihood", body: "Sport, media and communication overlap." },
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
      finding:
        "No direct command. But potentially a self-created obligation.",
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
      title: "The jump begins long before the exit",
      summary:
        "The final visible jump is only the last moment of a longer process of preparation and judgement.",
      finding:
        "Risk competence is built through preparation, experience, knowledge and reflection.",
      accessibleSummary:
        "Decision making emerged as layered work: project selection, route analysis, weather, equipment, body, mind, group responsibility and final go or no-go judgement.",
      image: {
        src: "/images/athletes/lukas-loibl/world-record-poster.jpg",
        alt: "A mountain exit environment used as a visual metaphor for pre-jump planning.",
      },
      controlLabel: "Reveal what the clip does not show",
      layers: [
        "Objective and project selection",
        "Experience and skill",
        "Route and flight-line analysis",
        "Weather and wind",
        "Equipment",
        "Physical condition",
        "Mental condition",
        "Visualisation",
        "Group and responsibility",
        "Final go / no-go decision",
      ],
    },
    {
      id: "experience",
      kind: "experience-curve",
      navLabel: "Experience",
      eyebrow: "Experience and self-assessment",
      title: "Experience does not automatically make you safe",
      summary:
        "The interviews suggest a qualitative pattern of learning, confidence, possible overconfidence and later differentiated risk awareness.",
      finding:
        "Risk awareness often develops through reflecting on errors and experience.",
      accessibleSummary:
        "This is a heuristic pattern, not a statistical model or a universal development path for every athlete.",
      states: [
        { title: "Initial caution", body: "Uncertainty can create restraint." },
        { title: "Increasing confidence", body: "Competence grows through practice." },
        { title: "Possible overconfidence", body: "Perceived ability can move closer to uncertainty." },
        { title: "Correction", body: "Errors, close calls, accidents, loss and observation matter." },
        { title: "Differentiated risk awareness", body: "Reflection changes how risk is interpreted." },
      ],
    },
    {
      id: "no-jump",
      kind: "no-jump",
      navLabel: "No Jump",
      eyebrow: "The most important decision",
      title: "Sometimes the safest jump is no jump",
      summary:
        "Cancelling can remain the competent decision even after a long hike, an expedition, preparation or financial investment.",
      finding:
        "Not jumping is not failure. It is an active safety decision.",
      accessibleSummary:
        "Uncertain wind, clouds, visibility, physical condition, mental state, intuition, group dynamics and responsibility can all lead an experienced athlete to walk down.",
      quote: "The mountain will still be there tomorrow.",
      image: {
        src: "/images/athletes/lukas-loibl/story.jpeg",
        alt: "Mountain terrain representing a possible exit and the decision to walk back.",
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
      id: "visible-process",
      kind: "visible-invisible",
      eyebrow: "What the video does not show",
      title: "The visible result is not the whole process",
      summary:
        "Social media can inspire progression, but imitation becomes problematic when the visible result is separated from preparation.",
      finding:
        "Visible: the flight. Invisible: the decisions.",
      accessibleSummary:
        "A polished clip may hide years of progression, failed attempts, route study, weather checks, gear checks, mentoring, cancelled jumps, reflection and uncertainty.",
      visibleLabel: "Visible: the flight",
      invisibleLabel: "Invisible: the decisions",
      left: {
        title: "Polished clip",
        items: ["short", "spectacular", "shareable"],
      },
      right: {
        title: "Hidden process",
        items: [
          "years of progression",
          "failed attempts",
          "route study",
          "weather checks",
          "gear checks",
          "mentoring",
          "cancelled jumps",
          "reflection",
          "uncertainty",
        ],
      },
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
        "The model shows external conditions moving through social mechanisms and mediating safeguards before they reach individual decisions and outcomes.",
      states: [
        {
          title: "External conditions",
          body: "Social media and sponsorship.",
        },
        {
          title: "Social mechanisms",
          body: "Visibility, recognition, comparison, expectations and economic opportunities.",
        },
        {
          title: "Mediating factors",
          body: "Experience, risk competence, safety culture, informal norms, reflection and self-regulation.",
        },
        {
          title: "Individual decision",
          body: "Risk perception, preparation and go / no-go judgement.",
        },
        {
          title: "Outcome",
          body: "Safety-oriented practice, or potentially increased exposure when safeguards fail.",
        },
      ],
      paths: [
        {
          title: "Social media as learning infrastructure",
          steps: ["social media", "inspiration", "learning", "greater knowledge", "more informed decision"],
        },
        {
          title: "Social media as imitation environment",
          steps: ["spectacular content", "imitation", "insufficient progression", "potentially problematic decision"],
        },
        {
          title: "Sponsorship as resource",
          steps: ["resources", "training and projects", "improved preparation"],
        },
        {
          title: "Sponsorship as expectation",
          steps: ["indirect expectation", "self-created pressure", "potentially altered decision"],
        },
      ],
    },
    {
      id: "research-context",
      kind: "methodology",
      eyebrow: "Research context",
      title: "What this study can and cannot claim",
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
