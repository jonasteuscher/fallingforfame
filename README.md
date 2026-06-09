# Falling for Fame?

Myth or Reality in Modern BASE Jumping?

A bilingual Next.js scrollytelling documentary foundation for a Bachelor thesis
project about social media, visibility, sponsorship, risk-taking, safety culture,
community norms and athlete identity in modern BASE jumping.

## Development

```bash
npm run dev
npm run lint
npm run format:check
npm run build
```

Routes are locale based:

- `/en`
- `/en/athletes`
- `/en/athletes/[slug]`
- `/en/findings`
- `/en/sport`
- `/en/project`
- `/de`
- `/de/athletes`
- `/de/athletes/[slug]`
- `/de/findings`
- `/de/sport`
- `/de/project`

English is the default root redirect.

## Folder Structure

```text
src/
  app/
    page.tsx                  Root redirect to the default locale
    layout.tsx                Global metadata, fonts and styles
    globals.css               Global CSS and design tokens
    [locale]/                 Localized App Router segment
      layout.tsx              Locale validation and shared page chrome
      page.tsx                Localized homepage
      athletes/               Athlete overview and detail routes
      findings/               Findings page
      sport/                  About the Sport page
      project/                About the Project page
  components/
    layout/                   Header, navigation and footer
    media/                    Image, video and audio rendering components
    scrollytelling/           Reusable longform story sections
    ui/                       Small generic UI components
  content/
    en/                       English page copy
    de/                       German page copy
  data/
    athletes.ts              Structured athlete profile data
  hooks/                      Shared React hooks
  i18n/                       Locale config, dictionary loading and URL helpers
  lib/                        Shared utilities
  types/                      Shared TypeScript content and media types
tests/
  integration/                Page and navigation integration tests
  unit/                       Component and data unit tests
public/
  images/                    Static image assets
  audio/                     Static audio assets
  video/                     Static video assets
```

## Content Structure

Page copy is split by locale and page so longer texts stay maintainable:

```text
src/content/en/home.ts
src/content/en/sport.ts
src/content/en/athletes.ts
src/content/en/project.ts
src/content/en/findings.ts

src/content/de/home.ts
src/content/de/sport.ts
src/content/de/athletes.ts
src/content/de/project.ts
src/content/de/findings.ts
```

`src/content/en/site.ts` and `src/content/de/site.ts` are aggregators. They combine
the page files into the dictionary shape consumed by `getDictionary(locale)`.

Athlete profile data lives separately in `src/data/athletes.ts` because it is
structured data shared by overview cards, athlete detail pages and tests.
