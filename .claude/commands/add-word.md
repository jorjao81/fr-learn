---
description: Generate a vocabulary markdown file for a French word or expression
argument-hint: <french word or expression>
---

Generate a vocabulary entry for the French word/expression: **$ARGUMENTS**

Create a new markdown file at `words/$ARGUMENTS.md` (use kebab-case for multi-word expressions).

Follow this exact structure:

```markdown
# [word]

Part of speech
: [e.g., verbe transitif (1er groupe), nom masculin, conjonction, etc.]

Phonétique
: /IPA transcription/

## Wiktionary definition

[Fetch or provide the definition from Wiktionary in French]

## AI definition

[A clear, concise definition in French]

## AI translation and definition

**[English translations]**

[Definition in English. If you need to reference the French word, mark it with ==word== so it can be hidden for flashcards.]

## AI explanation

[Explanation in French targeted at a linguistically knowledgeable learner who is fluent in English and a native Portuguese speaker. Include:]
- Etymology or memorable connections if useful
- Common confusions or false friends
- Comparison with Portuguese equivalents where helpful

### Exemples

> [French sentence with ==target word== marked]
> _[English translation with ==equivalent== marked]_

[Include 2-4 examples showing different usages or contexts]

### Famille de mots

- **[related word]** ([part of speech]) — [English translation]
[List related words if relevant]
```

Reference existing files in `words/` for tone and style.
