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
    items: string[];
  };
  right?: {
    title: string;
    items: string[];
  };
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
  hero: FindingsHeroContent;
  chapters: FindingChapter[];
  nav: FindingNavItem[];
};
