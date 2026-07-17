# Design QA: question bank masonry layout

## Evidence

- Source visual truth: `/var/folders/y1/8hrdxh5n37bbkmp0qj75fhbc0000gn/T/codex-clipboard-58326fbd-783b-428b-be5d-a1c601a94b2f.png`
- Browser-rendered implementation: `/tmp/question-bank-masonry-desktop-v2.png`
- Combined comparison input: `/tmp/question-bank-masonry-comparison-v2.png`
- Mobile implementation: `/tmp/question-bank-masonry-mobile.png`
- Desktop viewport: 1536 × 1024, question bank default filter state, formal answers collapsed.
- Mobile viewport: 390 × 844, question bank default filter state.

## Full-view comparison

The source shows the problem state: both cards stretch to one row height, leaving unused space below the shorter left card. In the combined comparison, the implementation uses a natural-height masonry grid. The first left card is about 38 px shorter than the first right card, and the next left card begins before the first right card ends. This removes the equal-row gap while preserving the existing card design, typography, colors, borders, icons, and content hierarchy.

## Focused region comparison

The full two-card region is large enough to inspect the required change directly: both complete first cards, their bottoms, and the beginning of both following cards are visible together. A separate detail crop is unnecessary because typography, icons, controls, and card boundaries remain readable at this scale and were not redesigned.

## Required fidelity surfaces

- Fonts and typography: unchanged from the approved question-card design; no new wrapping or truncation was introduced.
- Spacing and layout rhythm: 20 px vertical and horizontal gaps are consistent; each card keeps its natural content height.
- Colors and visual tokens: unchanged; existing dark surfaces and semantic green, amber, and blue colors are preserved.
- Image and icon fidelity: no raster assets were added or replaced; existing Phosphor icons remain intact.
- Copy and content: all 56 questions and their original ordering are preserved in the single-column layout.

## Interaction and responsive checks

- Desktop renders a 2-column masonry grid and all 56 cards while keeping every card as a direct child in its original DOM order.
- Expanding the first right-column formal answer increases only that card and moves only the next right-column card; the left column stays in place.
- Crossing below the 1280 px breakpoint clears masonry row spans without rebuilding cards, so the original linear order, expanded state, and focus can be preserved.
- At 390 px, all 56 cards render in the original order, formal answers are collapsed by default, and no horizontal overflow occurs.
- Search and filter rendering continue to rebuild the layout from the filtered result set.
- Browser console/runtime checks found no page errors.

## Comparison history

1. Previous implementation used a two-column CSS Grid. Grid row stretching made shorter cards match the height of their taller neighbor and left visible empty space.
2. An initial two-wrapper implementation removed the gaps but changed keyboard and screen-reader traversal to read an entire column at a time and measured layout after every insertion.
3. Replaced the wrappers with a single DOM-order CSS Grid, batched row-span measurements, and a resize observer for expansion and viewport changes.
4. Browser evidence confirms the next left card starts earlier, expansion remains column-local, mobile keeps the original order and expanded state, and all 56 cards remain direct list children.

## Findings

No actionable P0, P1, or P2 findings remain. The implementation intentionally differs from the supplied problem screenshot by removing equal card heights, which is the requested outcome.

final result: passed
