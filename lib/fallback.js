var css = function () {
  if (typeof CSS === "undefined" || typeof CSS.supports === "undefined" || !CSS.supports("--a", 0)) {
    /** 
     * @param {string} src 
     */
    function addScript(src) {
      var script = document.createElement("script");
      script.src = src;
      document.scripts[0].parentNode.appendChild(script);
      return script;
    };
    var script = addScript("${css-vars-ponyfill}");
    script.onload = function () {
      cssVars({ watch: true });
    };
  }
};

var flex = function () {
  if (typeof CSS === "undefined" || typeof CSS.supports === "undefined" || !CSS.supports("display", "flex")) {
    function addStyle(css) {
      var style = document.createElement("style");
      document.scripts[0].parentNode.appendChild(style);
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      }
      else {
        style.innerText = css;
      }
    }
    addStyle(".main>.column,.main+.column{float:left;}.main>.main-inner{float:right;}@media (max-width:991px){.main>.column{float:none;}.main>.main-inner{float:none;}}");
  }
};

var motion = function () {
  if (typeof CONFIG === "undefined" || typeof NexT === "undefined" || typeof NexT.boot === "undefined" || typeof NexT.boot.motion === "undefined") {
    var body = document.body;
    if (typeof body.classList === "undefined") {
      body.className = body.className.replace("use-motion", '');
    }
    else {
      body.classList.remove("use-motion");
    }
  }
  else {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(function () {
        var posts = document.querySelectorAll(".use-motion .post-block");
        if (posts.length && !Array.prototype.some.call(posts, function (x) { return x instanceof HTMLElement && x.classList.contains("animated") })) {
          document.body.classList.remove("use-motion");
        }
      }, 220);
    });
  }
};

const lazyload = function () {
  if (typeof CONFIG === "undefined" || typeof NexT === "undefined" || typeof NexT.boot === "undefined" || typeof NexT.boot.refresh === "undefined") {
    try {
      lozad(".post-body img").observe();
    }
    catch (_) {
      if (typeof document.querySelectorAll === "undefined") {
        /**
         * @param {Element} element
         * @param {(Element) => boolean} predicate
         */
        function findDescendants(element, predicate) {
          /** @type {Element[]} */
          var results = [];
          if (!element) { return results; }
          var children = element.children;
          if (!children) { return results; }
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (predicate(child)) {
              results.push(child);
            }
            var descendant = findDescendants(child, predicate);
            if (descendant) {
              for (var j = 0; j < descendant.length; j++) {
                results.push(descendant[j]);
              }
            }
          }
          return results;
        }
        var elements = findDescendants(document.documentElement, function (/** @type {Element} */ element) {
          return !!element.attributes.getNamedItem("data-src");
        })
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          var data = element.attributes.getNamedItem("data-src");
          var src = document.createAttribute("src");
          src.value = data.value;
          element.attributes.setNamedItem(src);
        }
      }
      else {
        var elements = document.querySelectorAll("[data-src]");
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.setAttribute("src", element.getAttribute("data-src"));
        }
      }
    }
  }
};

module.exports = {
  css,
  flex,
  motion,
  lazyload
}