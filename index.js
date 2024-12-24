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

hexo.extend.generator.register(
  "hexo-next-fallback",
  () => {
    return {
      path: "js/third-party/next-fallback/fallback.js",
      data: `${hexo.config.theme_config.motion?.enable ?? true ? `(${fallback.motion})();\n` : ''}${hexo.config.theme_config.lazyload ?? false ? `(${fallback.lazyload})();\n` : ''}(${fallback.flex})();\n(${fallback.navbar})();\n(${fallback.scroll})();\n(${fallback.highlight})();\n(${fallback.css.toString().replace("${css-vars-ponyfill}", getVendor(hexo.config.theme_config.vendors?.plugins || "cdnjs"))})();`
    };
  });

hexo.extend.injector.register(
  "body_end",
  '<script src="/js/third-party/next-fallback/fallback.js" defer></script>');