const { transformAsync } = require("@babel/core");
const polyfill = require("./lib/polyfill.js")
const fallback = require("./lib/fallback.js");

/**
 * @param {"jsdelivr" | "unpkg" | "cdnjs"} type 
 */
function getVendor(type) {
  switch (type) {
    case "jsdelivr":
      return "https://cdn.jsdelivr.net/npm/css-vars-ponyfill";
    case "unpkg":
      return "https://unpkg.com/css-vars-ponyfill";
    case "cdnjs":
    default:
      return "https://cdnjs.cloudflare.com/ajax/libs/css-vars-ponyfill/2.4.9/css-vars-ponyfill.min.js";
  }
}

/**
 * @param {string} text
 */
async function babelAsync(text) {
  const result = await transformAsync(text, { presets: [["@babel/preset-env"]], targets: { ie: "5" } });
  return result.code;
}

/**
 * @param {import("@types/hexo")} hexo 
 */
function createFallbackAsync(hexo) {
  /** @type {string[]} */
  const script = [];
  const theme = hexo.config.theme_config;
  script.push(`(${fallback.init})();`);
  if (theme.motion?.enable ?? true) {
    script.push(`(${fallback.motion})();`);
  }
  if (theme.lazyload ?? false) {
    script.push(`(${fallback.lazyload})();`);
  }
  if (theme.pjax ?? false) {
    script.push(`(${fallback.pjax})();`);
  }
  script.push(`(${fallback.flex})();`);
  script.push(`(${fallback.navbar})();`);
  script.push(`(${fallback.scroll})();`);
  script.push(`(${fallback.sidebar})();`);
  script.push(`(${fallback.highlight})();`);
  script.push(`(${fallback.css.toString().replace("${css-vars-ponyfill}", getVendor(theme.vendors?.plugins || "cdnjs"))})();`);
  script.push(`(${fallback.refresh})();`);
  return babelAsync(script.join('\n'));
}

/**
 * @param {import("@types/hexo")} hexo
 * @param {string} path
 * @param {() => Promise<string>} getTextAsync
 */
function renderGenerator(hexo, path, getTextAsync, engine = "js") {
  return {
    path: path,
    data: async () => {
      const text = await getTextAsync();
      return await hexo.render.render({ text: text, engine: engine })
    }
  };
}

hexo.extend.generator.register(
  "hexo-next-polyfill",
  () => renderGenerator(
    hexo,
    "js/third-party/next-fallback/polyfill.js",
    () => babelAsync(`(${polyfill})();`)));

hexo.extend.injector.register(
  "head_begin",
  '<script src="/js/third-party/next-fallback/polyfill.js"></script>');

hexo.extend.generator.register(
  "hexo-next-fallback",
  () => renderGenerator(
    hexo,
    "js/third-party/next-fallback/fallback.js",
    () => createFallbackAsync(hexo)));

hexo.extend.injector.register(
  "body_end",
  '<script src="/js/third-party/next-fallback/fallback.js" defer></script>');