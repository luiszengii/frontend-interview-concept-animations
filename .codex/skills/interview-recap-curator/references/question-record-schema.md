# Question record schema

## questions.json

Each question requires:

- `id`: stable kebab-case identifier
- `title`: concise canonical question
- `questionType`: `concept` or `scenario`
- `track`: knowledge direction
- `prompt`: full canonical prompt
- `answerOutline`: ordered answer skeleton
- `tags`: technical search terms
- `sources`: non-empty list of source IDs
- `companyOccurrences`: array of company occurrence records
- `sourceStatus`: `verified` or `needs-source-review`
- `createdAt` and `updatedAt`: ISO date

Use this shape for a company occurrence:

    {
      "company": "Example Corp",
      "count": 1,
      "interviewIds": ["interview-2026-07-14-example"]
    }

## interviews.json

Each interview record requires `id`, `date`, `company`, and `questionIds`. Add `role`, `rawQuestions`, and `notes` when the user provides them. Keep raw wording distinct from the canonical question prompt.

## sources.json

Each source requires `id`, `title`, `publisher`, `url`, and `kind`. Use HTTPS URLs. Prefer `official-docs`, `specification`, or `paper` when available.
