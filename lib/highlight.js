"use strict";

const fs = require("fs/promises");
const { createStyle } = require("./utils");
const parse = require("postcss/lib/parse");

/**
 * @param {string} name
 */
async function highlightThemeAsync(name) {
  const file = require.resolve(`highlight.js/styles/${name}.css`);
  const content = await fs.readFile(file, "utf8");

  const style = parse(content);

  style.walkRules(rule => {
    const selectors = rule.selectors;
    /** @type {string[]} */
    const result = [];
    for (const selector of selectors) {
      if (selector.includes(".hljs-")) {
        result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
      }
    }
    rule.selectors = [...selectors, ...result];
  });

  return style.toResult().css;
}

module.exports =
  /** @param {import("@types/hexo")} hexo */ async hexo => {
    const theme = hexo.theme.config;
    const light = await highlightThemeAsync(theme.codeblock.theme.light);
    const dark = await highlightThemeAsync(theme.codeblock.theme.dark);
    theme.highlight.fallback = createStyle(light, dark);
  };
