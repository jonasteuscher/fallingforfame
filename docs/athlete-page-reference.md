# Athlete Page Reference System

Tim Howell and Lukas Loibl define the reference system for all athlete pages in
*Falling for Fame?*. Future athlete pages must use the same shared implementation
language while keeping their own content, media and narrative rhythm.

## Architecture

Every athlete detail route is rendered through the shared `AthletePage` template
exported from `src/components/athletes`. The route must not assemble an
athlete-specific JSX tree.

Athlete-specific page composition belongs in typed athlete data:

```ts
page: {
  navAriaLabel: { en: "...", de: "..." },
  progress: [
    { id: "career", label: { en: "Career", de: "Karriere" } },
  ],
  sections: [
    {
      id: "planning-comes-first",
      type: "interview-video",
      featureId: "planning-comes-first",
      layout: "text-first",
      spacing: "immersive",
      includeInProgress: true,
    },
  ],
}
```

The route converts this data into the shared documentary section union. New page
sections should be added as reusable section types only when the existing
modules cannot represent the content.

## Allowed Variation

Athlete pages may vary by story, quote, media availability, section count,
section order, project status, gallery count and emotional pacing.

Intentional variation must be expressed through typed data:

- `layout: "stacked" | "text-first" | "media-first"`
- `spacing: "compact" | "standard" | "immersive"`
- `status: "current" | "future" | "completed"`
- `includeInProgress: boolean`

Do not add slug-based layout or styling branches to shared components.

## Shared Requirements

All athlete pages use the same shared modules for hero, profile, statistics,
origin story, interviews, audio stories, waveform player, scroll video, project
feature, gallery, external links, media coverage, related athletes and progress
navigation.

Future athlete pages must preserve:

- one `h1` per page and semantic `h2` chapter headings
- non-heading eyebrows
- stable section IDs and progress labels from localized data
- shared media loading and controls
- reduced-motion support
- responsive behaviour across mobile, tablet and desktop
- keyboard and screen-reader accessible controls
- no placeholder sections when content is missing

## Definition Of Done

A new athlete page is complete only when its content is stored in the typed
athlete schema, it renders through `AthletePage`, it contains no custom page JSX
or slug-based layout conditions, and it passes the shared athlete page tests.
