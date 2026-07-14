---
name: design-interview-animations
description: Design and implement distinctive scrollytelling animations for frontend interview concepts in the frontend-interview-concept-animations project. Use when adding, redesigning, or reviewing an animation scene, especially when scenes feel repetitive, template-driven, shallow, or hard to understand on mobile.
---

# Design Interview Animations

Design each scene from the concept's own mechanics. Do not begin from a reusable card layout. Reuse color tokens and navigation behavior, but invent the stage, objects, spatial model, and motion for the topic.

## Read the standards

Read `references/gold-standard-scenes.md` before choosing a visual direction. Read `references/quality-rubric.md` before implementation and again before reporting completion.

## Design workflow

1. Verify the technical explanation against the question's sources. Identify the misconception the animation must correct.
2. Decide whether animation is justified. Keep pure recall questions in the question bank unless state, time, causality, comparison, branching, or data movement materially benefits from motion.
3. Classify the concept's dominant behavior: timeline, sequential journey, synchronized comparison, transformation race, branching pipeline, state machine, or resource flow.
4. Choose a topic-specific metaphor and persistent objects. Write one sentence describing what the viewer watches change. Reject directions that could fit three unrelated topics by swapping labels.
5. Storyboard 7-12 causal steps: pain or initial state, mechanism, state transitions, edge or failure path, trade-off, and interview-ready conclusion. Make each step change one visible fact.
6. Implement a scene-specific DOM and CSS vocabulary under `.scene-{id}`. Reuse global colors and typography only. Do not route new scenes through a generic card/flow renderer.
7. Make motion encode meaning: movement for transfer, growth for progress, pulse for active work, dimming for skipped state, branching for alternatives, and reassembly for merge. Avoid decorative motion without information.
8. Preserve interview depth: state the conclusion, show the runtime mechanism, expose boundary conditions, include implementation details, and close with selection criteria or measurable outcomes.
9. Support mobile first: keep the active visual legible in the upper viewport, allow horizontal comparison when necessary, provide 44px touch targets, and never depend on hover.
10. Link the scene to its question record and ensure both the question and animation have stable shareable URLs.
11. Run project checks and score the scene with the rubric. Revise any zero-scored dimension and require at least 12/14.

## URL contract

- Use the question detail URL `question.html?id={question-id}`.
- Use the animation URL `index.html?scene={scene-id}`.
- Update navigation state without destroying a shared URL.
- Keep question IDs and scene IDs stable after publication.

## Report completion

Report the metaphor, visible state changes, explanation depth, edge case covered, mobile behavior, question URL, animation URL, rubric score, and validation result.
