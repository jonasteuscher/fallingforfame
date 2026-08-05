import { describe, expect, it } from "vitest";

import { athletes } from "@/data/athletes";
import * as englishContent from "@/content/en/site";

const forbiddenGermanPhrases = [
  "Mythos oder Realität",
  "Wenn jemand",
  "Ich glaube",
  "Die langsame",
  "Sicherheit",
  "Sponsoring",
  "soziale Medien",
];

function collectEnglishStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectEnglishStrings);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  if ("en" in record && "de" in record) {
    return collectEnglishStrings(record.en);
  }

  return Object.values(record).flatMap(collectEnglishStrings);
}

describe("English website content", () => {
  it("does not contain known German fallback phrases", () => {
    const englishStrings = [
      ...collectEnglishStrings(englishContent),
      ...collectEnglishStrings(athletes),
    ];
    const renderedEnglishCopy = englishStrings
      // The German thesis title is a proper title and is intentionally retained.
      .filter((text) => !text.includes("Zwischen Sichtbarkeit und Sicherheit"))
      .join("\n");

    for (const phrase of forbiddenGermanPhrases) {
      expect(renderedEnglishCopy, `unexpected German phrase: ${phrase}`).not.toContain(
        phrase,
      );
    }
  });
});
