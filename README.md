# Falling for Fame

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

## Content

- Athlete data: `src/data/athletes.ts`
- English copy: `src/content/en/site.ts`
- German copy: `src/content/de/site.ts`
- Locale config: `src/i18n/config.ts`
- Scrollytelling blocks: `src/components/scrollytelling`
- Media blocks: `src/components/media`
