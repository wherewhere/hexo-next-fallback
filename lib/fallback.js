const css = () => {
  try {
    if (!window.CSS?.supports("visibility", "unset")) {
      /**
       * @param {string} css
       */
      function addStyle(css) {
        const style = document.createElement("style");
        const parentNode = document.head || document.scripts[0].parentNode;
        parentNode.appendChild(style);
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
    if (!window.CSS?.supports("--a", 0)) {
      /** 
       * @param {string} src 
       */
      function addScript(src) {
        const script = document.createElement("script");
        script.src = src;
        const parentNode = document.head || document.scripts[0].parentNode;
        parentNode.appendChild(script);
        return script;
      };
      const script = addScript("https://cdn.jsdelivr.net/npm/css-vars-ponyfill");
      script.onload = () => cssVars({ watch: true });
    }
  }
  catch (e) {
    console.error(e);
  }
};

const flex = () => {
  try {
    if (!window.CSS?.supports("display", "flex")) {
      /**
       * @param {string} css
       */
      function addStyle(css) {
        const style = document.createElement("style");
        const parentNode = document.head || document.scripts[0].parentNode;
        parentNode.appendChild(style);
        if (style.styleSheet) {
          style.type = "text/css";
          style.styleSheet.cssText = css;
        }
        else {
          style.innerText = css;
        }
      }
      let style = ".main>.column,.main+.column{float:left}.main>.main-inner{float:right}@media (max-width:991px){.main>.column{float:none}.main>.main-inner{float:none}}";
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

const navbar = () => {
  try {
    if (!window.NexT?.boot?.registerEvents) {
      if (document.addEventListener) {
        const style = document.createElement("style");
        const parentNode = document.head || document.scripts[0].parentNode;
        parentNode.appendChild(style);
        document.querySelector(".site-nav-toggle .toggle").addEventListener("click", event => {
          event.currentTarget.classList.toggle("toggle-close");
          const siteNav = document.querySelector(".site-nav");
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

const motion = () => {
  try {
    if (window.NexT?.boot?.motion) {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          const posts = document.querySelectorAll(".use-motion .post-block");
          if (posts.length && !Array.prototype.some.call(posts, x => x instanceof HTMLElement && x.classList.contains("animated"))) {
            document.body.classList.remove("use-motion");
          }
        }, 1000);
      });
    }
    else {
      const body = document.body;
      if (body.classList) {
        body.classList.remove("use-motion");
      }
      else {
        body.className = body.className.replace("use-motion", '');
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const scroll = () => {
  try {
    if (!document.addEventListener) { return; }
    if (!window.NexT?.boot?.registerEvents) {
      const style = document.createElement("style");
      const parentNode = document.head || document.scripts[0].parentNode;
      parentNode.appendChild(style);
      document.querySelector(".site-nav-toggle .toggle").addEventListener("click", event => {
        event.currentTarget.classList.toggle("toggle-close");
        const siteNav = document.querySelector(".site-nav");
        if (!siteNav) { return; }
        style.innerText = `:root{--scroll-height:${siteNav.scrollHeight}px}`;
        document.body.classList.toggle("site-nav-on");
      });
    }
    if (!window.NexT?.utils?.registerScrollPercent) {
      const backToTop = document.querySelector(".back-to-top");
      // For init back to top in sidebar if page was scrolled after page refresh.
      if (backToTop) {
        window.addEventListener("scroll", () => {
          const contentHeight = document.body.scrollHeight - window.innerHeight;
          const scrollPercent = contentHeight > 0 ? Math.min(100 * window.pageYOffset / contentHeight, 100) : 0;
          const isShow = Math.round(scrollPercent) >= 5;
          if (!backToTop.classList) {
            backToTop.className = `back-to-top${isShow ? " back-to-top-on" : ''}`;
          }
          else {
            if (isShow) {
              if (!backToTop.classList.contains("back-to-top-on")) {
                backToTop.classList.add("back-to-top-on");
              }
            }
            else {
              if (backToTop.classList.contains("back-to-top-on")) {
                backToTop.classList.remove("back-to-top-on");
              }
            }
          }
          backToTop.querySelector("span").innerText = Math.round(scrollPercent) + '%';
        }, { passive: true });
        backToTop.addEventListener("click", () => {
          if (document.scrollingElement) {
            window.anime({
              targets: document.scrollingElement,
              duration: 500,
              easing: "linear",
              scrollTop: 0
            });
          }
          else {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        });
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const lazyload = () => {
  try {
    if (!window.NexT?.boot?.refresh) {
      try {
        lozad(".post-body img").observe();
      }
      catch (_) {
        if (document.querySelectorAll) {
          const elements = document.querySelectorAll("[data-src]");
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.setAttribute("src", element.getAttribute("data-src"));
          }
        }
        else {
          /**
           * @param {Element} element
           * @param {(element: Element) => boolean} predicate
           */
          function findDescendants(element, predicate) {
            /** @type {Element[]} */
            const results = [];
            if (!element) { return results; }
            const children = element.children;
            if (!children) { return results; }
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (predicate(child)) {
                results.push(child);
              }
              const descendant = findDescendants(child, predicate);
              if (descendant) {
                for (let j = 0; j < descendant.length; j++) {
                  results.push(descendant[j]);
                }
              }
            }
            return results;
          }
          const elements = findDescendants(document.documentElement, element => !!element.attributes?.getNamedItem("data-src"))
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const data = element.attributes.getNamedItem("data-src");
            const src = document.createAttribute("src");
            src.value = data.value;
            element.attributes.setNamedItem(src);
          }
        }
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const highlight = () => {
  try {
    if (!window.NexT?.utils?.registerCodeblock) {
      if (document.querySelectorAll) {
        let figure = document.querySelectorAll("figure.highlight");
        if (!figure.length) {
          figure = document.querySelectorAll("pre");
        }
        const hasList = !!document.body.classList;
        for (let i = 0; i < figure.length; i++) {
          const element = figure[i];
          // Skip pre > .mermaid for folding and copy button
          if (element.querySelector(".mermaid")) return;
          let span = element.querySelectorAll(".code .line span");
          if (!span.length) {
            // Hljs without line_number and wrap
            span = element.querySelectorAll("code.highlight span");
          }
          for (let j = 0; j < span.length; j++) {
            if (hasList) {
              const list = span[j].classList;
              for (let k = 0; k < list.length; k++) {
                const name = list[k];
                list.add("hljs-".concat(name));
                list.remove(name);
              }
            }
            else {
              let name = '';
              const list = span[j].className.split(" ");
              for (let k = 0; k < list.length; k++) {
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