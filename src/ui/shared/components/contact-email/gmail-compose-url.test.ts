import { describe, expect, it } from "vitest";
import { getGmailComposeUrl } from "./gmail-compose-url";

describe("getGmailComposeUrl", () => {
  it("opens the Gmail composer addressed to the given email", () => {
    expect(getGmailComposeUrl("club@example.com")).toBe(
      "https://mail.google.com/mail/?view=cm&fs=1&to=club%40example.com",
    );
  });
});
