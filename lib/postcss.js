"use strict";

const { parse } = require("path");
const postcss = require("postcss");
const postcssPresetEnv = require("postcss-preset-env");

module.exports =
  /**
   * @param {string} str
   * @param {{ path: string }} data
   * @this {import('@types/hexo')}
   */
  async function (str, data) {
    if (!str) { return str; }
    const path = data.path;
    try {
      const base = parse(path).base;
      const result = await postcss([postcssPresetEnv({ stage: 0, browsers: "IE >= 5" })]).process(str, { from: base, to: base });
      return result.css;
    }
    catch (err) {
      throw new Error(`Path: ${path}\n${err}`);
    }
  }