import { describe, expect, it } from "vitest";
import { splitInlineLinks } from "./inline-links";

const KEYS = ["team", "news"] as const;

describe("splitInlineLinks", () => {
  it("splits text and known links in order", () => {
    expect(splitInlineLinks("See the [roster](team) and the [news](news).", KEYS)).toEqual([
      { kind: "text", text: "See the " },
      { kind: "link", text: "roster", key: "team" },
      { kind: "text", text: " and the " },
      { kind: "link", text: "news", key: "news" },
      { kind: "text", text: "." },
    ]);
  });

  it("keeps the label of an unknown key as plain text", () => {
    expect(splitInlineLinks("Go to [the store](store) now", KEYS)).toEqual([
      { kind: "text", text: "Go to the store now" },
    ]);
  });

  it("returns a single text segment when there are no links", () => {
    expect(splitInlineLinks("Plain text", KEYS)).toEqual([{ kind: "text", text: "Plain text" }]);
  });
});
