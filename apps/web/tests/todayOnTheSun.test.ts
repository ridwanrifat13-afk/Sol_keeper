import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TodayOnTheSun } from "../src/components/TodayOnTheSun.js";

describe("Today on the Sun (M15 MUST 3)", () => {
  it("renders the Today on the Sun panel component", () => {
    const html = renderToStaticMarkup(createElement(TodayOnTheSun));
    expect(html).toContain("Today on the Sun");
    expect(html).toContain("today-on-the-sun");
  });

  it("includes provenance badge and accessible heading", () => {
    const html = renderToStaticMarkup(createElement(TodayOnTheSun));
    expect(html).toContain("id=\"today-on-sun-heading\"");
    expect(html).toContain("provenance-badge");
  });
});

