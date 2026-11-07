import { describe, expect, it } from "vitest";
import { listHref, parseListQuery } from "./list-query";

describe("parseListQuery", () => {
  it("reads a valid status and page", () => {
    expect(parseListQuery(new URLSearchParams("status=contacted&page=3"))).toEqual({
      status: "contacted",
      page: 3,
    });
  });

  it("falls back to no filter and the first page for unexpected values", () => {
    expect(parseListQuery(new URLSearchParams("status=hacked&page=-2"))).toEqual({
      status: undefined,
      page: 1,
    });
    expect(parseListQuery(new URLSearchParams("page=1.5"))).toEqual({ status: undefined, page: 1 });
    expect(parseListQuery(new URLSearchParams())).toEqual({ status: undefined, page: 1 });
  });
});

describe("listHref", () => {
  it("only includes what differs from the defaults", () => {
    expect(listHref("/admin/tryouts", {})).toBe("/admin/tryouts");
    expect(listHref("/admin/tryouts", { status: "new", page: 1 })).toBe(
      "/admin/tryouts?status=new",
    );
    expect(listHref("/admin/tryouts", { status: "new", page: 2 })).toBe(
      "/admin/tryouts?status=new&page=2",
    );
  });
});
