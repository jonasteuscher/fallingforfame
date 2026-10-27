# Apple Design audit

Reviewed on 2026-10-27 using the installed `apple-design` skill.

## Scope and method

The source inventory covers all 70 TSX component modules, including internal subcomponents, plus page composition, global styles, and scroll progress. The review combined a source scan for controls, motion and preference handling, focused inspection of interactive behavior, unit/integration tests, browser interactions, responsive route checks, and normal-motion scroll traversal. Static components inherit shared improvements; a source change is not needed for each module.

The documentary's navy/orange identity and editorial structure remain the design context. The changes prioritize response, agency, familiarity, flexibility and craft. Existing native scrolling and range controls supply direct tracking and momentum. There are no custom draggable sheets requiring a spring engine, so this audit adds no animation dependency or synthetic gesture.

## Shared improvements

- Platform system typography with optical sizing, tighter heading tracking, and the existing responsive hierarchy.
- Immediate press feedback, native cancellation, larger controls, and accessible focus styles.
- Floating chrome with stronger material separation, a soft header edge, and solid fallbacks for reduced transparency and increased contrast.
- Reduced motion retains short color/opacity feedback. Findings content is available without an empty pinned introduction.
- Hidden chapter navigation and collapsed transcripts no longer accept focus.
- Narrow chapter navigation scrolls within its own surface and respects the device safe area.
- Scroll-controlled video copy tracks input directly; the progress indicator uses transform instead of animating width.

## Interaction fixes

| Area | Result |
| --- | --- |
| Site navigation | Current-page cues, 44px controls, localized navigation naming; closing the mobile layout on desktop resize restores scrolling. |
| Athlete gallery | Focus stays on the current control while changing images; image counter is announced; arrow keys do not scroll the page. |
| Project gallery | Focus enters the dialog, wraps inside it, stays stable between images, and returns to the thumbnail on dismissal. |
| Audio stories | Larger seeking target with readable time values; transcript following moves only its own container; collapsed content is inert; failed playback can be retried. |
| Local videos | Native range targets are easier to grab; seek and volume values are readable; loading and playback failures are visible. |
| Interviews | Localized status/error feedback; the play control returns after external-player loading fails; unready player methods no longer throw. |
| Scroll video | Copy follows scroll without an extra CSS delay; changing motion or pointer preferences selects the appropriate fallback. |
| Camera annotations | Larger hotspots/close controls and immediate opening without an artificial delay. |
| Decision layers | Explicit touch/click activation accompanies focus and hover previews. |
| Pressure factors | Descriptive text replaces buttons that had no action. |
| Timeline primitive | Linked tabs/panel, roving focus, arrow/Home/End navigation, and an empty-data fallback. |
| Sport history | Chapter jumps respect reduced motion. |
| Expandable content | Larger summary target; decorative plus is hidden from assistive technology. |
| Responsive findings image | Explicit width and minimum size prevent the reduced-motion image from exceeding phone widths. |
| Athlete statistics | Container-based columns and type sizing keep numeric values intact on tablets and with larger text. |
| Long German headings | Mobile headings hyphenate/wrap inside their reading column. |
| Page landmarks | Home and findings reuse the layout main landmark without nesting another main. |
| Reading progress | One update per animation frame; transform-based drawing and content-height observation. |

## Component inventory

“Shared foundations” means the module was included in the source inventory and receives common typography, focus, press-feedback and preference rules as applicable. Browser coverage applies to public routes; unused primitives have unit coverage where available.

| Component module | Audit coverage |
| --- | --- |
| [LocalizedNotFoundContent.tsx](../src/components/LocalizedNotFoundContent.tsx) | Source inventory; shared foundations. |
| [MobileExperienceNotice.tsx](../src/components/MobileExperienceNotice.tsx) | Direct optimization described above; shared foundations. |
| [NotFoundContent.tsx](../src/components/NotFoundContent.tsx) | Source inventory; shared foundations. |
| [athletes/AthleteArticleList.tsx](../src/components/athletes/AthleteArticleList.tsx) | Source inventory; shared foundations. |
| [athletes/AthleteCard.tsx](../src/components/athletes/AthleteCard.tsx) | Source inventory; shared foundations. |
| [athletes/AthleteDocumentaryPage.tsx](../src/components/athletes/AthleteDocumentaryPage.tsx) | Source inventory; shared foundations. |
| [athletes/AthleteGalleryLightbox.tsx](../src/components/athletes/AthleteGalleryLightbox.tsx) | Direct optimization described above; shared foundations. |
| [athletes/AthleteHero.tsx](../src/components/athletes/AthleteHero.tsx) | Source inventory; shared foundations. |
| [athletes/AthleteNarrativeNav.tsx](../src/components/athletes/AthleteNarrativeNav.tsx) | Direct optimization described above; shared foundations. |
| [athletes/AthleteProfileOverview.tsx](../src/components/athletes/AthleteProfileOverview.tsx) | Container-based statistics layout and typography; shared foundations. |
| [athletes/AthleteSections.tsx](../src/components/athletes/AthleteSections.tsx) | Source inventory; shared foundations. |
| [athletes/AudioStory.tsx](../src/components/athletes/AudioStory.tsx) | Direct optimization described above; shared foundations. |
| [athletes/AudioWaveform.tsx](../src/components/athletes/AudioWaveform.tsx) | Source inventory; shared foundations. |
| [athletes/CinematicVideoPlayer.tsx](../src/components/athletes/CinematicVideoPlayer.tsx) | Direct optimization described above; shared foundations. |
| [athletes/FutureProjectFeature.tsx](../src/components/athletes/FutureProjectFeature.tsx) | Source inventory; shared foundations. |
| [athletes/InterviewFeature.tsx](../src/components/athletes/InterviewFeature.tsx) | Direct optimization described above; shared foundations. |
| [athletes/LocalVideoFeature.tsx](../src/components/athletes/LocalVideoFeature.tsx) | Source inventory; shared foundations. |
| [athletes/ProjectFeature.tsx](../src/components/athletes/ProjectFeature.tsx) | Source inventory; shared foundations. |
| [athletes/ProjectStorySection.tsx](../src/components/athletes/ProjectStorySection.tsx) | Source inventory; shared foundations. |
| [athletes/ScrollScrubVideo.tsx](../src/components/athletes/ScrollScrubVideo.tsx) | Direct optimization described above; shared foundations. |
| [athletes/SectionTitle.tsx](../src/components/athletes/SectionTitle.tsx) | Source inventory; shared foundations. |
| [audio/AudioProvider.tsx](../src/components/audio/AudioProvider.tsx) | Direct optimization described above; shared foundations. |
| [findings/CameraEquipmentSection.tsx](../src/components/findings/CameraEquipmentSection.tsx) | Direct optimization described above; shared foundations. |
| [findings/DecisionLayersSection.tsx](../src/components/findings/DecisionLayersSection.tsx) | Direct optimization described above; shared foundations. |
| [findings/ExperienceJourneySection.tsx](../src/components/findings/ExperienceJourneySection.tsx) | Source inventory; shared foundations. |
| [findings/FindingsChapterNav.tsx](../src/components/findings/FindingsChapterNav.tsx) | Direct optimization described above; shared foundations. |
| [findings/FindingsHero.tsx](../src/components/findings/FindingsHero.tsx) | Reduced-motion scroll-track correction through shared CSS. |
| [findings/FindingsPage.tsx](../src/components/findings/FindingsPage.tsx) | Removed nested main landmark; shared foundations. |
| [findings/FindingsQuote.tsx](../src/components/findings/FindingsQuote.tsx) | Source inventory; shared foundations. |
| [findings/FindingsVisibilitySequence.tsx](../src/components/findings/FindingsVisibilitySequence.tsx) | Source inventory; shared foundations. |
| [findings/NoJumpDecisionSection.tsx](../src/components/findings/NoJumpDecisionSection.tsx) | Corrected responsive media sizing and static reduced-motion placement. |
| [findings/PressureModelSection.tsx](../src/components/findings/PressureModelSection.tsx) | Direct optimization described above; shared foundations. |
| [findings/RecognitionComparison.tsx](../src/components/findings/RecognitionComparison.tsx) | Source inventory; shared foundations. |
| [findings/ResearchContextSection.tsx](../src/components/findings/ResearchContextSection.tsx) | Source inventory; shared foundations. |
| [findings/SafetyNetworkSection.tsx](../src/components/findings/SafetyNetworkSection.tsx) | Source inventory; shared foundations. |
| [findings/SponsorshipSpectrumSection.tsx](../src/components/findings/SponsorshipSpectrumSection.tsx) | Source inventory; shared foundations. |
| [findings/SynthesisSection.tsx](../src/components/findings/SynthesisSection.tsx) | Source inventory; shared foundations. |
| [findings/VisibleInvisibleProcessSection.tsx](../src/components/findings/VisibleInvisibleProcessSection.tsx) | Source inventory; shared foundations. |
| [layout/LocaleDocumentAttributes.tsx](../src/components/layout/LocaleDocumentAttributes.tsx) | Source inventory; shared foundations. |
| [layout/SiteFooter.tsx](../src/components/layout/SiteFooter.tsx) | Source inventory; shared foundations. |
| [layout/SiteHeader.tsx](../src/components/layout/SiteHeader.tsx) | Direct optimization described above; shared foundations. |
| [layout/SiteNavigation.tsx](../src/components/layout/SiteNavigation.tsx) | Direct optimization described above; shared foundations. |
| [legal/ImprintPage.tsx](../src/components/legal/ImprintPage.tsx) | Source inventory; shared foundations. |
| [legal/PrivacyPolicyPage.tsx](../src/components/legal/PrivacyPolicyPage.tsx) | Source inventory; shared foundations. |
| [media/AudioPlayer.tsx](../src/components/media/AudioPlayer.tsx) | Source inventory; shared foundations. |
| [media/CustomVideoPlayer.tsx](../src/components/media/CustomVideoPlayer.tsx) | Direct optimization described above; shared foundations. |
| [media/ImageBlock.tsx](../src/components/media/ImageBlock.tsx) | Source inventory; shared foundations. |
| [media/ImageGallery.tsx](../src/components/media/ImageGallery.tsx) | Source inventory; shared foundations. |
| [media/MediaCaption.tsx](../src/components/media/MediaCaption.tsx) | Source inventory; shared foundations. |
| [media/VideoPlayer.tsx](../src/components/media/VideoPlayer.tsx) | Source inventory; shared foundations. |
| [project/ProjectChapterIndicator.tsx](../src/components/project/ProjectChapterIndicator.tsx) | Direct optimization described above; shared foundations. |
| [project/ProjectDocumentationChapter.tsx](../src/components/project/ProjectDocumentationChapter.tsx) | Direct optimization described above; shared foundations. |
| [project/ProjectPage.tsx](../src/components/project/ProjectPage.tsx) | Source inventory; shared foundations. |
| [scrollytelling/AthleteStoryCard.tsx](../src/components/scrollytelling/AthleteStoryCard.tsx) | Source inventory; shared foundations. |
| [scrollytelling/AudioStoryBlock.tsx](../src/components/scrollytelling/AudioStoryBlock.tsx) | Source inventory; shared foundations. |
| [scrollytelling/ChapterDivider.tsx](../src/components/scrollytelling/ChapterDivider.tsx) | Source inventory; shared foundations. |
| [scrollytelling/ChapterIntro.tsx](../src/components/scrollytelling/ChapterIntro.tsx) | Source inventory; shared foundations. |
| [scrollytelling/FindingCard.tsx](../src/components/scrollytelling/FindingCard.tsx) | Source inventory; shared foundations. |
| [scrollytelling/ImageStoryBlock.tsx](../src/components/scrollytelling/ImageStoryBlock.tsx) | Source inventory; shared foundations. |
| [scrollytelling/InteractiveTimeline.tsx](../src/components/scrollytelling/InteractiveTimeline.tsx) | Direct optimization described above; shared foundations. |
| [scrollytelling/PullQuote.tsx](../src/components/scrollytelling/PullQuote.tsx) | Source inventory; shared foundations. |
| [scrollytelling/ScrollProgressIndicator.tsx](../src/components/scrollytelling/ScrollProgressIndicator.tsx) | Direct optimization described above; shared foundations. |
| [scrollytelling/ScrollySection.tsx](../src/components/scrollytelling/ScrollySection.tsx) | Source inventory; shared foundations. |
| [scrollytelling/StatisticBlock.tsx](../src/components/scrollytelling/StatisticBlock.tsx) | Source inventory; shared foundations. |
| [scrollytelling/StickyMediaBlock.tsx](../src/components/scrollytelling/StickyMediaBlock.tsx) | Source inventory; shared foundations. |
| [scrollytelling/VideoStoryBlock.tsx](../src/components/scrollytelling/VideoStoryBlock.tsx) | Source inventory; shared foundations. |
| [sport/SportPage.tsx](../src/components/sport/SportPage.tsx) | Direct optimization described above; shared foundations. |
| [sport/SportSafetyDisclaimerModal.tsx](../src/components/sport/SportSafetyDisclaimerModal.tsx) | Direct optimization described above; shared foundations. |
| [text/WorkTitleText.tsx](../src/components/text/WorkTitleText.tsx) | Source inventory; shared foundations. |
| [ui/Expandable.tsx](../src/components/ui/Expandable.tsx) | Direct optimization described above; shared foundations. |

## Validation

- Unit/integration suite: 291 tests passed across 46 files.
- Production compilation: Webpack build passed, including TypeScript and static generation. The default Turbopack build fails on this machine with a local-port permission error, including after an escalated retry.
- Focused browser checks: 5 passed (press cancellation, menu resize, transparency/contrast, reduced-motion hero, 200% text).
- Full browser suite: pending final result. Includes English/German routes at 16 viewport sizes, automated accessibility, normal-motion traversal at 5 sizes, and visual captures at 5 sizes.

Playwright now uses its managed Chromium by default instead of a hardcoded, absent Chrome path. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select another browser. `PLAYWRIGHT_BASE_URL` can reuse an existing server; this running development server needs `http://localhost:3000` because its alternate IP hostname blocks development JavaScript.

## Limits

Automated accessibility and emulated device/preference checks do not replace testing with people, physical iOS devices, VoiceOver or Safari. Native fonts vary across operating systems. Visual baselines intentionally change with typography and header improvements.
