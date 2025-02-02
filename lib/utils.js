/** Based on [`scripts/events/lib/utils.js` from hexo-theme-next](https://github.com/next-theme/hexo-theme-next/blob/master/scripts/events/lib/utils.js) **/
"use strict";

const path = require("path");

/**
 * @param {string} name
 */
function resolve(name, file = '') {
  try {
    const dir = path.dirname(require.resolve(`${name}/package.json`));
    return `${dir}/${file}`;
  } catch {
    return '';
  }
}

/**
 * @param {import("@types/hexo")} hexo
 * @param {string} path
 * @param {string} name
 * @param {string} file
 */
function renderGeneratorAsync(hexo, path, name, file) {
  return {
    path: `${hexo.theme.config.js}/${path}`,
    data: () => hexo.render.render({ path: resolve(name, file) })
  };
}

/**
 * @param {string} light
 * @param {string} dark
 */
const createStyle = (light, dark) => `<style>
${light}

@media (prefers-color-scheme: dark) {
  ${dark}
}
</style>`;

module.exports = {
  resolve,
  renderGeneratorAsync,
  createStyle
};
