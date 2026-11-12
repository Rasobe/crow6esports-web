import { describe, expect, it } from "vitest";
import { decodeEmail, encodeEmail } from "./email-obfuscation";

describe("email obfuscation", () => {
  const email = "club.contact+web@example.com";

  it("keeps the address out of the encoded value", () => {
    const encoded = encodeEmail(email);

    expect(encoded).not.toContain("@");
    expect(encoded).not.toContain("example");
  });

  it("decodes back to the original address", () => {
    expect(decodeEmail(encodeEmail(email))).toBe(email);
  });
});
