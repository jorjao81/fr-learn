# French Learning Repository

A structured repository for learning French vocabulary with Anki flashcard integration.

## Prerequisites

- [Deno](https://deno.land/) (v2.0+)
- [lefthook](https://github.com/evilmartians/lefthook) (for git hooks)
- [lychee](https://github.com/lycheeverse/lychee) (for link checking)

### Installation

```bash
# macOS (Homebrew)
brew install deno lefthook lychee

# Or install individually:
# Deno: https://docs.deno.com/runtime/getting_started/installation/
# lefthook: https://github.com/evilmartians/lefthook/blob/master/docs/install.md
# lychee: https://github.com/lycheeverse/lychee#installation
```

## Setup

```bash
# Install git hooks
lefthook install

# Cache Deno dependencies
deno cache scripts/md-to-tsv.ts
```

## Project Structure

```
├── words/          # French vocabulary markdown files
├── scripts/        # Deno TypeScript scripts
├── templates/      # Anki HTML card templates
├── styles/         # Anki CSS styles
└── output/         # Generated TSV files (gitignored)
```

## Usage

### Adding Vocabulary

Create markdown files in `words/` following this format:

```markdown
# Bonjour

**Part of speech:** interjection

**Definition:** Hello, good day

**Example:**
> Bonjour, comment allez-vous ?
> (Hello, how are you?)

**Notes:**
- Used as a greeting during the day
- More formal than "Salut"

---
```

### Converting to Anki Format

```bash
deno task convert
```

This generates `output/vocabulary.tsv` which can be imported into Anki.

## Available Tasks

| Task | Description |
|------|-------------|
| `deno task convert` | Convert markdown to TSV for Anki |
| `deno task fmt` | Format TypeScript/JSON files |
| `deno task lint` | Lint TypeScript files |
| `deno task check` | Type-check TypeScript files |
| `deno task md:fmt` | Format markdown files |
| `deno task md:lint` | Lint markdown files |
| `deno task md:links` | Check markdown links |
| `deno task all:check` | Run all checks |

## Pre-commit Hooks

The following checks run automatically on commit:

- **deno fmt** - TypeScript/JSON formatting
- **deno lint** - TypeScript linting
- **prettier** - Markdown/HTML/CSS formatting
- **markdownlint** - Markdown style rules
- **lychee** - Broken link detection

## Anki Import

1. Run `deno task convert` to generate the TSV file
2. In Anki, go to File → Import
3. Select `output/vocabulary.tsv`
4. Map fields: Word, Part of Speech, Definition, Example, Notes
5. Apply the card template from `templates/basic-card.html`
6. Apply styles from `styles/card.css`
