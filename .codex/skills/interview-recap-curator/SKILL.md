---
name: interview-recap-curator
description: Convert frontend interview recaps into structured, deduplicated, source-backed question-bank records. Use when a user shares interview notes, asks to record companies and question frequencies, add tags or sources, or maintain data/questions.json and data/interviews.json in the frontend-interview-concept-animations project.
---

# Interview Recap Curator

Maintain the repository question bank from raw interview notes. Preserve what the interviewer actually asked, make company frequency traceable, and never invent company evidence or technical sources.

## Locate the project

Work from the repository root containing `data/questions.json`, `data/sources.json`, and `data/interviews.json`. Read `references/question-record-schema.md` before changing data.

## Curate one recap

1. Extract company, date, role when provided, the raw question wording, and any project context. Ask only for missing facts that are necessary to attribute a company occurrence.
2. Search existing questions by title, prompt, tags, and underlying concept. Reuse an existing question ID when it is the same question; create a new ID only when the technical focus is materially different.
3. Keep the raw wording in the interview record when available. Write one concise canonical prompt and a short answer outline in the question record.
4. Add `questionType`, `track`, and technical tags. Do not use company names as technical tags.
5. Add or update the interview record, then update the matching question `companyOccurrences` with the company, count, and interview ID. Do not increase a count without a corresponding recap record.
6. Add at least one source ID. Prefer official documentation, specifications, or primary papers. When a good source is not yet confirmed, add the best available source record and set `sourceStatus` to `needs-source-review`.
7. Link `animationSceneId` only when a matching scene actually exists in `index.html`. Do not create a link just because two titles sound similar.
8. Run `npm run check` and update `CHANGELOG.md` with the user-visible change.

## Source rules

- Keep sources in `data/sources.json`; reuse source IDs instead of copying URLs into questions.
- Treat an interview recap as evidence for “this company asked it,” not as authority for the technical answer.
- Keep source publisher and title specific enough for a reader to judge the authority.
- Never claim a company asked a question based on an unverified internet post.

## Report back

State the question IDs created or updated, the company occurrence changes, source status, validation result, and any source that still needs review.
