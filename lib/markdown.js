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
function markdownTheme(name) {
  const file = resolve("github-markdown-css", `github-markdown-${name}.css`);
  return fs.readFileSync(file, "utf8");
}

module.exports =
  /** @param {import("@types/hexo")} hexo */ hexo => {
    const theme = hexo.theme.config;
    const light = markdownTheme("light");
    const dark = markdownTheme("dark");
    theme.markdown = createStyle(light, dark);
  };
