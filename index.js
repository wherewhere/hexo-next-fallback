const { transformAsync } = require("@babel/core");
const { readFile } = require("fs");
const { dirname, resolve } = require("path");
const polyfill = require("./lib/polyfill.js")
const fallback = require("./lib/fallback.js");

/**
 * @param {"jsdelivr" | "unpkg" | "cdnjs"} type 
 */
function getCSSVars(type) {
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
 * @param {"jsdelivr" | "unpkg" | "cdnjs"} type 
 */
function getFontAwesome(type) {
  switch (type) {
    case "jsdelivr":
      return {
        regx: "https:\\/\\/cdn\\.jsdelivr\\.net\\/npm\\/@fortawesome\\/fontawesome-free@\\S+\\/css\\/all\\.min\\.css",
        src: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/css/all.min.css"
      };
    case "unpkg":
      return {
        regx: "https:\\/\\/unpkg\\.com\\/@fortawesome\\/fontawesome-free@\\S+\\/css\\/all\\.min\\.css",
        src: "https://unpkg.com/@fortawesome/fontawesome-free@6.6.0/css/all.min.css"
      };
    case "cdnjs":
    default:
      return {
        regx: "https:\\/\\/cdnjs\\.cloudflare\\.com\\/ajax\\/libs\\/font-awesome\\/\\S+\\/css\\/all\\.min\\.css",
        src: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      };
  }
}

/**
 * @param {string} text
 */
async function babelAsync(text) {
  const result = await transformAsync(text, { presets: [["@babel/preset-env"]], sourceType: "script", targets: { ie: "5" } });
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
  script.push(`(${fallback.search})();`);
  script.push(`(${fallback.scroll})();`);
  script.push(`(${fallback.sidebar})();`);
  script.push(`(${fallback.highlight})();`);
  const awesome = getFontAwesome(theme.vendors?.plugins || "cdnjs");
  script.push(`(${fallback.css.toString().replace("${css-vars-ponyfill}", getCSSVars(theme.vendors?.plugins || "cdnjs")).replace("${font-awesome-regx}", awesome.regx).replace("${font-awesome}", awesome.src)})();`);
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

hexo.extend.filter.register("after_render:css", require("./lib/postcss.js"));

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

hexo.extend.filter.register("theme_inject", injects =>
  injects.bodyEnd.raw("fallback-js", '<script src="/js/third-party/next-fallback/fallback.js" defer></script>', {}, { cache: true }));

if (!hexo.config.bilibili_card?.enable) {
  hexo.extend.filter.register("after_post_render", require("./lib/bilibili-card.js"));
}

hexo.extend.generator.register("wap", async locals => {
  const path = resolve(dirname(require.resolve("./package.json")), "layout/wap.njk");
  const layout = await new Promise((/** @type {(string) => void} */ resolve, reject) =>
    readFile(path, { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    }));
  if (hexo.config.syntax_highlighter === 'highlight.js' || hexo.config.highlight.enable) {
    require("./lib/highlight.js")(hexo);
  }
  require("./lib/markdown.js")(hexo);
  hexo.theme.setView("wap.njk", layout);
  return [
    {
      path: "wap/index.html",
      data: locals,
      layout: "wap"
    },
    ...locals.posts.map(post => {
      return {
        path: `wap/${post.path}`,
        data: post,
        layout: "wap"
      };
    })];
});