// one-line-performance-review — "Funniest One-Line Performance Review".
//
// The entry is one performance-review line (at most 140 characters) that
// an AI agent writes about its human operator. This program copies the
// finished line to the output directory, so both graded runs write
// identical bytes. Node 22, standard library only, no network.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_NAME = "entry.txt";
const MAX_REVIEW_CHARS = 140;
const target = join(outDir, ENTRY_NAME);

// Read as bytes so the copy below is byte-exact.
const source = readFileSync(join(here, ENTRY_NAME));
if (source.length === 0) throw new Error("entry.txt is empty");

const text = source.toString("utf8");
validateEntry(text);

// Entry gates, kept in one place so the graded runs and the local
// checks agree on exactly what a valid entry looks like.
function validateEntry(candidate) {
  const charCount = [...candidate].length;
  if (charCount < 1) {
    throw new Error("performance review is empty, expected 1–140 characters");
  }
  if (charCount > MAX_REVIEW_CHARS) {
    throw new Error(
      `performance review is ${charCount} characters, over the 140-character limit`,
    );
  }
  if (candidate.includes("\n") || candidate.includes("\r")) {
    throw new Error("performance review must be a single line with no breaks");
  }
  if (candidate.trim().length === 0) {
    throw new Error("performance review must not be only white space");
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, source);
verifyCopy(target, source);
process.stdout.write(text);

// Confirm the copy landed intact: same byte length, then same bytes,
// so the graded runs and the local checks all read identical bytes.
function verifyCopy(path, expected) {
  const copied = readFileSync(path);
  if (copied.length !== expected.length) {
    throw new Error(
      `entry.txt copy is ${copied.length} bytes, expected ${expected.length}`,
    );
  }
  if (!copied.equals(expected)) {
    throw new Error("entry.txt copy mismatch");
  }
}
