var css = function () {
  try {
    if (typeof CSS === "undefined" || typeof CSS.supports === "undefined" || !CSS.supports("visibility", "unset")) {
      /**
       * @param {string} css
       */
      function addStyle(css) {
        var style = document.createElement("style");
        document.scripts[0].parentNode.appendChild(style);
        if (style.styleSheet) {
          style.type = "text/css";
          style.styleSheet.cssText = css;
        }
        else {
          style.innerText = css;
        }
      }
      addStyle("@media (max-width:767px){body.site-nav-on .site-nav{visibility:visible}}.sidebar-nav-active .sidebar-nav,.sidebar-overview-active .sidebar-panel.site-overview-wrap,.sidebar-toc-active .sidebar-panel.post-toc-wrap{pointer-events:auto;visibility:visible}.post-toc .nav .active>.nav-child{visibility:visible}@media (min-width:768px) and (max-width:991px){body.site-nav-on .site-nav{visibility:visible}}")
    }
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
      var script = addScript("https://cdn.jsdelivr.net/npm/css-vars-ponyfill");
      script.onload = function () { cssVars({ watch: true }); };
    }
  }
  catch (e) {
    console.error(e);
  }
};

var flex = function () {
  try {
    if (typeof CSS === "undefined" || typeof CSS.supports === "undefined" || !CSS.supports("display", "flex")) {
      /**
       * @param {string} css
       */
      function addStyle(css) {
        var style = document.createElement("style");
        document.scripts[0].parentNode.appendChild(style);
        if (style.styleSheet) {
          style.type = "text/css";
          style.styleSheet.cssText = css;
        }
        else {
          style.innerText = css;
        }
      }
      var style = ".main>.column,.main+.column{float:left}.main>.main-inner{float:right}@media (max-width:991px){.main>.column{float:none}.main>.main-inner{float:none}}";
      if (typeof document.documentMode === "number" && document.documentMode < 7) {
        style = style + "div.column{float:left}.post-body a,.post-body h1,.post-body h2,.post-body h3,.post-body h4,.post-body h5,.post-body h6,.post-body li,.post-body ol,.post-body p,.post-body ul{direction:ltr}";
      }
      addStyle(style);
    }
  }
  catch (e) {
    console.error(e);
  }
};

const navbar = function () {
  try {
    if (typeof NexT === "undefined" || typeof NexT.boot === "undefined" || typeof NexT.boot.registerEvents === "undefined") {
      if (typeof Element.prototype.addEventListener === "function") {
        var style = document.createElement("style");
        document.scripts[0].parentNode.appendChild(style);
        document.querySelector(".site-nav-toggle .toggle").addEventListener("click", function (event) {
          event.currentTarget.classList.toggle("toggle-close");
          var siteNav = document.querySelector(".site-nav");
          if (!siteNav) return;
          style.innerText = ":root{--scroll-height:" + siteNav.scrollHeight + "px}";
          document.body.classList.toggle("site-nav-on");
        });
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

var motion = function () {
  try {
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
  }
  catch (e) {
    console.error(e);
  }
};

const scroll = function () {
  try {
    if (typeof document.addEventListener === "undefined") { return; }
    if (typeof NexT === "undefined" || typeof NexT.boot === "undefined" || typeof NexT.boot.registerEvents === "undefined") {
      var style = document.createElement("style");
      document.scripts[0].parentNode.appendChild(style);
      document.querySelector(".site-nav-toggle .toggle").addEventListener("click", function (event) {
        event.currentTarget.classList.toggle("toggle-close");
        var siteNav = document.querySelector(".site-nav");
        if (!siteNav) return;
        style.innerText = ":root{--scroll-height:" + siteNav.scrollHeight + "px}";
        document.body.classList.toggle("site-nav-on");
      });
    }
    if (typeof NexT === "undefined" || typeof NexT.utils === "undefined" || typeof NexT.boot.registerScrollPercent === "undefined") {
      var backToTop = document.querySelector(".back-to-top");
      // For init back to top in sidebar if page was scrolled after page refresh.
      window.addEventListener("scroll", function () {
        if (backToTop || readingProgressBar) {
          var contentHeight = document.body.scrollHeight - window.innerHeight;
          var scrollPercent = contentHeight > 0 ? Math.min(100 * window.pageYOffset / contentHeight, 100) : 0;
          if (backToTop) {
            if (typeof backToTop.classList === "undefined") {
              backToTop.className = "back-to-top" + (Math.round(scrollPercent) >= 5 ? " back-to-top-on" : '');
            }
            else {
              backToTop.classList.toggle("back-to-top-on", Math.round(scrollPercent) >= 5);
            }
            backToTop.querySelector("span").innerText = Math.round(scrollPercent) + '%';
          }
        }
      }, { passive: true });
      backToTop && backToTop.addEventListener("click", function () {
        if (typeof document.scrollingElement === "undefined") {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
        else {
          window.anime({
            targets: document.scrollingElement,
            duration: 500,
            easing: "linear",
            scrollTop: 0
          });
        }
      });
    }
  }
  catch (e) {
    console.error(e);
  }
};

const lazyload = function () {
  try {
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
  }
  catch (e) {
    console.error(e);
  }
};

const highlight = function () {
  try {
    if (typeof NexT === "undefined" || typeof NexT.utils === "undefined" || typeof NexT.boot.registerCodeblock === "undefined") {
      if (typeof document.querySelectorAll !== "undefined") {
        var figure = document.querySelectorAll("figure.highlight");
        if (!figure.length) {
          figure = document.querySelectorAll("pre");
        }
        var hasList = typeof document.body.classList !== "undefined";
        for (var i = 0; i < figure.length; i++) {
          var element = figure[i];
          // Skip pre > .mermaid for folding and copy button
          if (element.querySelector(".mermaid")) return;
          var span = element.querySelectorAll(".code .line span");
          if (span.length === 0) {
            // Hljs without line_number and wrap
            span = element.querySelectorAll("code.highlight span");
          }
          for (var j = 0; j < span.length; j++) {
            if (hasList) {
              var list = span[j].classList;
              for (var k = 0; k < list.length; k++) {
                var name = list[k];
                list.add("hljs-".concat(name));
                list.remove(name);
              }
            }
            else {
              var name = '';
              var list = span[j].className.split(" ");
              for (var k = 0; k < list.length; k++) {
                name += "hljs-".concat(list[k]);
              }
              span[j].className = name;
            }
          }
        }
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

module.exports = {
  css,
  flex,
  navbar,
  motion,
  scroll,
  lazyload,
  highlight
}