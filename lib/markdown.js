"use strict";

const fs = require("fs/promises");
const { createStyle } = require("./utils");
const parse = require("postcss/lib/parse");

/**
 * @param {string} name
 */
function markdownThemeAsync(name) {
  const file = require.resolve(`github-markdown-css/github-markdown-${name}.css`);
  return fs.readFile(file, "utf8");
}

module.exports =
  /** @param {import("@types/hexo")} hexo */ async hexo => {
    const theme = hexo.theme.config;
    const light = await markdownThemeAsync("light");
    const dark = await markdownThemeAsync("dark");
    theme.markdown = createStyle(light, dark);
  };
