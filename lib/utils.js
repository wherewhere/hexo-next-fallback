"use strict";

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
  createStyle
};
