# Design QA: question bank card redesign

## Evidence

- Source visual: `/var/folders/y1/8hrdxh5n37bbkmp0qj75fhbc0000gn/T/codex-clipboard-eb156def-1d9a-49cd-8c0a-3c5489a4c220.png`
- Implementation capture: `/tmp/question-card-reference-desktop.png`
- Combined comparison input: `/tmp/card-design-comparison.png`
- Mobile capture: `/tmp/question-card-reference-mobile.png`
- Desktop viewport: 1536 × 1024; AI multi-turn question filtered; answer outline visible; formal answer collapsed.
- Mobile viewport: 390 × 844; the same question filtered; formal answer tested both collapsed and expanded.

## Full-view comparison

The combined input compares the supplied reference and the rendered implementation in one view. The implementation follows the same visual hierarchy: kicker and type badges, large title, explanatory prompt, topic tags, company/recent-interview strip, bordered answer panel, action row, publisher footer, and verified-source status. Card width is 1440 px with 40 px desktop padding and a 950.625 px rendered height.

No P0, P1, or P2 layout mismatch remains. The implementation deliberately keeps question-specific outline content and a collapsed formal-answer control, so the answer panel contains one additional row compared with the static reference.

## Focused comparison

The focused top-region comparison checks typography, icons, pills, borders, spacing, and the company strip. The final desktop title renders at 49.152 px. Icons use Phosphor Icons rather than handwritten SVG or CSS drawings. Pills, border radii, dark surfaces, green project metadata, amber project badge, and blue primary action follow the supplied visual.

## Comparison history

1. Initial implementation rendered the right structure but the desktop card was 915 px tall and the typography, tag pills, company strip, and primary action were visibly undersized.
2. Increased the kicker, badges, title, prompt, tags, company strip, source footer, and action sizing.
3. Final comparison renders a 950.625 px card with the intended hierarchy and density.

## Interaction and responsive checks

- Search filtering returns the target card.
- Answer outline remains immediately scannable.
- Formal answer is collapsed by default and expands to two readable paragraphs.
- Formal-answer summary is 54 px high on mobile; the animation action is 48 px high.
- At 390 px, document width equals viewport width and no horizontal overflow occurs.
- Independent-question and animation links are present as separate actions.
- Browser console and runtime error collection returned no errors.
- `npm run check` and `git diff --check` pass.

final result: passed
