"use strict";

const fs = require("fs");
const { resolve, createStyle } = require("./utils");

/** @type {import("@adobe/css-tools")} */
let css;
try {
  css = require("@adobe/css-tools");
} catch {
  css = require("css");
}

/**
 * @param {string} name
 */
function highlightTheme(name) {
  const file = resolve("highlight.js", `styles/${name}.css`);
  const content = fs.readFileSync(file, "utf8");

  const style = css.parse(content);
  const rules = style.stylesheet.rules;

  for (const rule of rules) {
    if (rule.type === "rule") {
      const selectors = rule.selectors;
      /** @type {string[]} */
      const result = [];
      for (const selector of selectors) {
        if (selector.includes(".hljs-")) {
          result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
        }
      }
      selectors.push(...result);
    }
    else if (rule.type === "media") {
      for (const inner of rule.rules) {
        if (inner.type === "rule") {
          const selectors = inner.selectors;
          /** @type {string[]} */
          const result = [];
          for (const selector of selectors) {
            if (selector.includes(".hljs-")) {
              result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
            }
          }
          selectors.push(...result);
        }
      }
    }
  }

  return css.stringify(style);
}

module.exports =
  /** @param {import("@types/hexo")} hexo */ hexo => {
    const theme = hexo.theme.config;
    const light = highlightTheme(theme.codeblock.theme.light);
    const dark = highlightTheme(theme.codeblock.theme.dark);
    theme.highlight.fallback = createStyle(light, dark);
  };
