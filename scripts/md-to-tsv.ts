/**
 * Converts French vocabulary markdown files to TSV format for Anki import.
 *
 * Usage:
 *   deno run --allow-read --allow-write scripts/md-to-tsv.ts
 *
 * Input: words/*.md
 * Output: output/vocabulary.tsv
 */

import { walk } from "@std/fs";
import { join } from "@std/path";

interface VocabularyEntry {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  notes: string;
}

/**
 * Parse a markdown file and extract vocabulary entries.
 */
function parseMarkdown(content: string): VocabularyEntry[] {
  const entries: VocabularyEntry[] = [];
  const sections = content.split(/^# /m).filter((s) => s.trim());

  for (const section of sections) {
    const lines = section.split("\n");
    const word = lines[0]?.trim() ?? "";

    if (!word) continue;

    const entry: VocabularyEntry = {
      word,
      partOfSpeech: "",
      definition: "",
      example: "",
      notes: "",
    };

    let currentField = "";
    const fieldContent: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i] ?? "";

      if (line.startsWith("**Part of speech:**")) {
        if (currentField && fieldContent.length) {
          setField(entry, currentField, fieldContent.join("\n").trim());
        }
        currentField = "partOfSpeech";
        fieldContent.length = 0;
        fieldContent.push(line.replace("**Part of speech:**", "").trim());
      } else if (line.startsWith("**Definition:**")) {
        if (currentField && fieldContent.length) {
          setField(entry, currentField, fieldContent.join("\n").trim());
        }
        currentField = "definition";
        fieldContent.length = 0;
        fieldContent.push(line.replace("**Definition:**", "").trim());
      } else if (line.startsWith("**Example:**")) {
        if (currentField && fieldContent.length) {
          setField(entry, currentField, fieldContent.join("\n").trim());
        }
        currentField = "example";
        fieldContent.length = 0;
      } else if (line.startsWith("**Notes:**")) {
        if (currentField && fieldContent.length) {
          setField(entry, currentField, fieldContent.join("\n").trim());
        }
        currentField = "notes";
        fieldContent.length = 0;
      } else if (line === "---") {
        // End of entry
        if (currentField && fieldContent.length) {
          setField(entry, currentField, fieldContent.join("\n").trim());
        }
        break;
      } else if (currentField) {
        fieldContent.push(line);
      }
    }

    // Handle last field if no separator
    if (currentField && fieldContent.length) {
      setField(entry, currentField, fieldContent.join("\n").trim());
    }

    entries.push(entry);
  }

  return entries;
}

function setField(entry: VocabularyEntry, field: string, value: string): void {
  switch (field) {
    case "partOfSpeech":
      entry.partOfSpeech = value;
      break;
    case "definition":
      entry.definition = value;
      break;
    case "example":
      entry.example = cleanExample(value);
      break;
    case "notes":
      entry.notes = cleanNotes(value);
      break;
  }
}

function cleanExample(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/^>\s*/, "").trim())
    .filter((line) => line)
    .join(" | ");
}

function cleanNotes(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line)
    .join("; ");
}

/**
 * Escape a field for TSV format.
 */
function escapeTsv(value: string): string {
  // Replace tabs and newlines, escape quotes if needed
  return value.replace(/\t/g, " ").replace(/\n/g, " ").replace(/\r/g, "");
}

/**
 * Convert entries to TSV format.
 */
function toTsv(entries: VocabularyEntry[]): string {
  const header = ["Word", "Part of Speech", "Definition", "Example", "Notes"].join("\t");
  const rows = entries.map((e) =>
    [
      escapeTsv(e.word),
      escapeTsv(e.partOfSpeech),
      escapeTsv(e.definition),
      escapeTsv(e.example),
      escapeTsv(e.notes),
    ].join("\t")
  );

  return [header, ...rows].join("\n");
}

async function main(): Promise<void> {
  const wordsDir = "words";
  const outputDir = "output";
  const outputFile = join(outputDir, "vocabulary.tsv");

  // Ensure output directory exists
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  const allEntries: VocabularyEntry[] = [];

  // Walk through all markdown files
  for await (const entry of walk(wordsDir, { exts: [".md"] })) {
    console.log(`Processing: ${entry.path}`);
    const content = await Deno.readTextFile(entry.path);
    const entries = parseMarkdown(content);
    allEntries.push(...entries);
  }

  if (allEntries.length === 0) {
    console.log("No vocabulary entries found.");
    return;
  }

  // Write TSV file
  const tsv = toTsv(allEntries);
  await Deno.writeTextFile(outputFile, tsv);

  console.log(`\nConverted ${allEntries.length} entries to ${outputFile}`);
}

main();
