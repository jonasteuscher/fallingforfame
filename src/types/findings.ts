export type FindingsLocale = "en" | "de";

export type FindingChapterKind =
  | "media-visibility"
  | "recognition-comparison"
  | "camera-equipment"
  | "sponsorship-spectrum"
  | "pressure-model"
  | "decision-layers"
  | "experience-curve"
  | "no-jump"
  | "visible-invisible"
  | "safety-network"
  | "synthesis-model"
  | "methodology";

export type FindingNavItem = {
  id: string;
  label: string;
};

export type FindingsHeroContent = {
  eyebrow: string;
  title: string;
  intro: string;
  methodology: string;
  centralStatement: string;
  scrollCue: string;
  media: {
    src: string;
    alt: string;
  };
  socialPost: {
    sourceLabel: string;
    menuLabel: string;
    username: string;
    role: string;
    caption: string;
    hashtags: string[];
    views: string;
    actions: {
      icon: string;
      label: string;
      value: string;
    }[];
    comments: {
      author: string;
      text: string;
    }[];
  };
};

export type FindingCreditPath = {
  title: string;
  steps: string[];
};

export type MediaVisibilityStateId =
  | "discovery"
  | "inspiration"
  | "learning"
  | "reflection";

export type MediaVisibilityAnnotation = {
  id: string;
  label: string;
  x: number;
  y: number;
  align?: "left" | "right";
};

export type MediaVisibilityState = {
  id: MediaVisibilityStateId;
  title: string;
  body: string;
  overlayLabel: string;
  visualStatement: string;
  overlayItems?: string[];
  annotations?: MediaVisibilityAnnotation[];
};

export type VisibilitySequenceContent = {
  media: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
  states: MediaVisibilityState[];
};

export type FindingChapter = {
  id: string;
  kind: FindingChapterKind;
  navLabel?: string;
  eyebrow: string;
  title: string;
  summary: string;
  finding: string;
  accessibleSummary: string;
  quote?: string;
  quoteSource?: string;
  visibilitySequence?: VisibilitySequenceContent;
  image?: {
    src: string;
    alt: string;
  };
  states?: {
    title: string;
    body: string;
  }[];
  left?: {
    title: string;
    descriptor?: string;
    items: string[];
  };
  right?: {
    title: string;
    descriptor?: string;
    items: string[];
  };
  disclaimer?: string;
  spectrum?: {
    title: string;
    body: string;
  }[];
  layers?: string[];
  paths?: FindingCreditPath[];
  controlLabel?: string;
  controlResult?: string;
  centerLabel?: string;
  visibleLabel?: string;
  invisibleLabel?: string;
  methodologyItems?: string[];
  links?: {
    href: string;
    label: string;
  }[];
};

export type FindingsPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  navigationLabel: string;
  skipLabel: string;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
  hero: FindingsHeroContent;
  chapters: FindingChapter[];
  nav: FindingNavItem[];
};
