const init = () => {
  try {
    if (!window.NexT) {
      window.NexT = { isFallback: true };
    }
    if (!NexT.boot) {
      NexT.boot = {
        isFallback: true,
        /** @type {Function[]} */
        refreshHandle: [],
        refresh() {
          for (let i = 0; i < this.refreshHandle.length; i++) {
            try { this.refreshHandle[i](); }
            catch (e) { console.error(e); }
          }
        }
      }
    }
    if (!NexT.utils) {
      NexT.utils = {
        isFallback: true
      };
    }
    NexT.fallback = {
      /**
       * @param {string} css
       */
      addStyle(css) {
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
      },
      /**
      * @param {Element} element
      * @param {(element: Element) => boolean} predicate
      */
      findDescendant(element, predicate) {
        if (!element) { return; }
        const children = element.children;
        if (!children) { return; }
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (predicate(child)) {
            return child;
          }
          /** @type {Element} */
          const descendant = this.findDescendant(child, predicate);
          if (descendant) {
            return descendant;
          }
        }
      },
      /**
      * @param {Element} element
      * @param {(element: Element) => boolean} predicate
      */
      findDescendants(element, predicate) {
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
          /** @type {Element[]} */
          const descendant = this.findDescendants(child, predicate);
          if (descendant) {
            for (let j = 0; j < descendant.length; j++) {
              results.push(descendant[j]);
            }
          }
        }
        return results;
      }
    }
    if (!window.CONFIG) {
      const className = "next-config";
      /**
       * @param {string} name
       */
      function getConfig(name) {
        /** @type {HTMLScriptElement?} */
        const target = document.querySelector
          ? document.querySelector(`script.${className}[data-name="${name}"]`)
          : NexT.fallback.findDescendant(document.documentElement,
            /** @param {Element} element */
            element => element.tagName.toLowerCase() === "script" && new RegExp(`(^|\\s)${className}(\\s|$)`).test(element.className) && element.attributes?.getNamedItem("data-name")?.value === name);
        if (!target) { return {}; }
        return window.JSON ? JSON.parse(target.text || "{}") : eval(`(${target.text || "{}"})`);
      }
      /** @type {Object<string, any>} */
      const staticConfig = getConfig("main");
      if (Object.keys) {
        window.CONFIG = {
          isFallback: true,
          ...staticConfig,
          page: getConfig("page"),
        };
      }
      else {
        window.CONFIG = {
          isFallback: true,
          page: getConfig("page"),
        };
        for (const key in staticConfig) {
          if (staticConfig.hasOwnProperty(key)) {
            CONFIG[key] = staticConfig[key];
          }
        }
      }
      if (document.addEventListener) {
        document.addEventListener("pjax:success", () => CONFIG.page = getConfig("page"));
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const css = () => {
  try {
    if (!window.CSS?.supports("visibility", "unset")) {
      NexT.fallback.addStyle("@media (max-width:767px){body.site-nav-on .site-nav{visibility:visible}}.sidebar-nav-active .sidebar-nav,.sidebar-overview-active .sidebar-panel.site-overview-wrap,.sidebar-toc-active .sidebar-panel.post-toc-wrap{pointer-events:auto;visibility:visible}.post-toc .nav .active>.nav-child{visibility:visible}@media (min-width:768px) and (max-width:991px){body.site-nav-on .site-nav{visibility:visible}}")
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
      let style = ".main>.column,.main+.column{float:left}.main>.main-inner{float:right}@media (max-width:991px){.main>.column{float:none}.main>.main-inner{float:none}}";
      if (typeof document.documentMode === "number" && document.documentMode < 7) {
        style = style + "div.column{float:left}.post-body a,.post-body h1,.post-body h2,.post-body h3,.post-body h4,.post-body h5,.post-body h6,.post-body li,.post-body ol,.post-body p,.post-body ul{direction:ltr}";
      }
      NexT.fallback.addStyle(style);
    }
  }
  catch (e) {
    console.error(e);
  }
};

const pjax = () => {
  if (NexT.isFallback && typeof Pjax !== "undefined" && typeof pjax === "undefined" && history?.replaceState) {
    const pjax = new Pjax({
      selectors: [
        "head title",
        'meta[property="og:title"]',
        'script[type="application/json"]',
        // Precede .main-inner to prevent placeholder TOC changes asap
        ".post-toc-wrap",
        ".main-inner",
        ".languages",
        ".pjax"
      ],
      switches: {
        ".post-toc-wrap"(oldWrap, newWrap) {
          if (newWrap.querySelector(".post-toc")) {
            Pjax.switches.outerHTML.call(this, oldWrap, newWrap);
          }
          else {
            const curTOC = oldWrap.querySelector(".post-toc");
            if (curTOC) {
              curTOC.classList.add("placeholder-toc");
            }
            this.onSwitch();
          }
        }
      },
      analytics: false,
      cacheBust: false,
      scrollTo: !CONFIG.bookmark.enable
    });
    Pjax.prototype.executeScripts =
      /**
       * @param {NodeListOf<HTMLScriptElement>} elements
       */
      function (elements) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const code = element.text || element.textContent || element.innerHTML || '';
          const script = document.createElement("script");
          if (element.id) {
            script.id = element.id;
          }
          if (element.className) {
            script.className = element.className;
          }
          if (element.type) {
            script.type = element.type;
          }
          if (element.src) {
            script.src = element.src;
            // Force synchronous loading of peripheral JS.
            script.async = false;
          }
          if (typeof script.dataset?.pjax !== "undefined") {
            script.dataset.pjax = '';
          }
          if (code !== '') {
            script.appendChild(document.createTextNode(code));
          }
          element.parentNode.replaceChild(script, element);
        }
      };
    document.addEventListener("pjax:success", () => {
      const elements = document.querySelectorAll("script[data-pjax]");
      pjax.executeScripts(elements);
      NexT.boot.refresh();
      if (CONFIG.sidebar.display !== 'remove') {
        const hasTOC = document.querySelector('.post-toc:not(.placeholder-toc)');
        const inner = document.querySelector('.sidebar-inner');
        if (hasTOC) {
          if (inner.classList) {
            if (!inner.classList.contains("sidebar-nav-active")) {
              inner.classList.add("sidebar-nav-active");
            }
          }
          else {
            if (!/(^|\s)sidebar-nav-active(\s|$)/.test(inner.className)) {
              inner.className += " sidebar-nav-active";
            }
          }
        }
        else {
          if (inner.classList) {
            inner.classList.remove("sidebar-nav-active");
          }
          else {
            inner.className = inner.className.replace(/(^|\s)sidebar-nav-active(\s|$)/g, '');
          }
        }
      }
    });
    window.pjax = pjax;
  }
};

const navbar = () => {
  try {
    if (!NexT.boot.registerEvents) {
      if (document.addEventListener) {
        const siteNav = document.querySelector(".site-nav");
        if (!siteNav) return;
        const style = document.createElement("style");
        style.innerText = `:root{--scroll-height:${siteNav.scrollHeight}px}`;
        const parentNode = document.head || document.scripts[0].parentNode;
        parentNode.appendChild(style);
        document.querySelector(".site-nav-toggle .toggle").addEventListener("click", event => {
          event.currentTarget.classList.toggle("toggle-close");
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
    if (NexT.boot.motion) {
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

const search = () => {
  try {
    if (!window.LocalSearch) {
      if (document.getElementsByClassName) {
        const trigger = document.getElementsByClassName("popup-trigger");
        for (let i = 0; i < trigger.length; i++) {
          const search = trigger[i];
          if (search instanceof HTMLAnchorElement) {
            if (typeof pjax === "undefined") {
              search.href = "/search";
            }
            else {
              search.onclick = () => pjax.loadUrl("/search");
            }
          }
          else {
            search.onclick = () => {
              if (typeof pjax === "undefined") {
                location.href = "/search";
              }
              else {
                pjax.loadUrl("/search");
              }
            }
          }
        }
      }
      else {
        /** @type {Element[]} */
        const trigger = NexT.fallback.findDescendants(document.documentElement,
          /** @param {Element} element */
          element => /(^|\s)popup-trigger(\s|$)/.test(element.className));
        for (let i = 0; i < trigger.length; i++) {
          const search = trigger[i];
          if (search.tagName.toLowerCase() === 'a') {
            search.href = "/search";
          }
          else {
            search.onclick = () => location.href = "/search";
          }
        }
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const scroll = () => {
  try {
    if (!NexT.utils.registerScrollPercent) {
      const backToTop = document.querySelector
        ? document.querySelector(".back-to-top")
        : NexT.fallback.findDescendant(document.documentElement,
          /** @param {Element} element */
          element => /(^|\s)back-to-top(\s|$)/.test(element.className));
      // For init back to top in sidebar if page was scrolled after page refresh.
      if (backToTop) {
        if (window.addEventListener) {
          addEventListener("scroll", () => {
            const contentHeight = document.body.scrollHeight - innerHeight;
            const scrollPercent = contentHeight > 0 ? Math.min(100 * window.pageYOffset / contentHeight, 100) : 0;
            const isShow = Math.round(scrollPercent) >= 5;
            if (backToTop.classList) {
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
            else {
              backToTop.className = `back-to-top${isShow ? " back-to-top-on" : ''}`;
            }
            backToTop.querySelector("span").innerText = Math.round(scrollPercent) + '%';
            if (NexT.utils.updateActiveNav) {
              NexT.utils.updateActiveNav();
            }
          }, { passive: true });
        }
        backToTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (!window.addEventListener) { return; }
    if (!window.CSS || (!CSS?.supports("position", "sticky") && !CSS?.supports("position", "-webkit-sticky"))) {
      const header = document.querySelector(".header");
      /** @type {HTMLElement} */
      const sidebar = document.querySelector(".sidebar");
      function onchange() {
        if (innerWidth > 991) {
          const rect = header.getBoundingClientRect();
          if (rect.top + rect.height < 12) {
            sidebar.style.position = "fixed";
            sidebar.style.width = "240px";
            return;
          }
        }
        sidebar.style.position = '';
        sidebar.style.width = '';
      }
      addEventListener("scroll", onchange);
      addEventListener("resize", onchange);
    }
  }
  catch (e) {
    console.error(e);
  }
};

const sidebar = () => {
  try {
    if (!NexT.boot.motion) {
      NexT.fallback.addStyle("@media all and (min-width:992px){.sidebar-inner{visibility: inherit}}");
    }
    const utils = NexT.utils;
    if (utils.isFallback || !utils.activateSidebarPanel) {
      NexT.fallback.addStyle(".sidebar-inner{display:block}");
      if (document.addEventListener && document.querySelector && document.querySelectorAll) {
        utils.sections = [];
        utils.updateActiveNav = function () {
          try {
            /** @type {HTMLElement[]} */
            const sections = utils.sections;
            if (!sections.length) { return; }
            const index = (() => {
              for (let i = 0; i < sections.length; i++) {
                if (utils.sections[i]?.getBoundingClientRect().top > 58) {
                  return i > 0 ? --i : i;
                }
              }
              return sections.length - 1;
            })();
            utils.activateNavByIndex(index);
          }
          catch (e) {
            console.error(e);
          }
        };
        utils.registerSidebarTOC = function () {
          try {
            utils.sections = [];
            const elements = document.querySelectorAll(".post-toc:not(.placeholder-toc) li a.nav-link");
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              const target = document.getElementById(decodeURI(element.getAttribute("href")).replace('#', ''));
              utils.sections.push(target);
            }
            utils.updateActiveNav();
          }
          catch (e) {
            console.error(e);
          }
        };
        utils.activateNavByIndex =
          /**
           * @param {number} index
           */
          function (index) {
            try {
              const nav = document.querySelector(".post-toc:not(.placeholder-toc) .nav");
              if (!nav) { return; }
              const navItemList = nav.querySelectorAll(".nav-item");
              const target = navItemList[index];
              const hasList = !!target.classList;
              if (!target || (hasList ? target.classList.contains("active-current") : /(^|\s)active-current(\s|$)/.test(target.className))) { return; }
              const actives = nav.querySelectorAll(".active");
              for (let i = 0; i < actives.length; i++) {
                const navItem = actives[i];
                if (hasList) {
                  navItem.classList.remove("active", "active-current");
                }
                else {
                  navItem.className = navItem.className.replace(/(^|\s)active(\s|$)/g, '');
                }
              }
              if (hasList) {
                target.classList.add("active", "active-current");
              }
              else {
                target.className += " active active-current";
              }
              let activateEle = target.querySelector(".nav-child") || target.parentElement;
              while (nav.contains(activateEle)) {
                if (hasList) {
                  if (activateEle.classList.contains("nav-item")) {
                    activateEle.classList.add("active");
                  }
                }
                else {
                  if (!/(^|\s)active(\s|$)/.test(activateEle.className)) {
                    activateEle.className += " active";
                  }
                }
                activateEle = activateEle.parentElement;
              }
            }
            catch (e) {
              console.error(e);
            }
          };
        utils.activateSidebarPanel =
          /**
           * @param {0 | 1} index
           */
          function (index) {
            try {
              const sidebar = document.querySelector(".sidebar-inner");
              const activeClassNames = ["sidebar-toc-active", "sidebar-overview-active"];
              if (sidebar.classList) {
                if (sidebar.classList.contains(activeClassNames[index])) {
                  return;
                }
                sidebar.classList.remove(activeClassNames[1 - index]);
                sidebar.classList.add(activeClassNames[index]);
              }
              else {
                if (new RegExp(`(^|\\s)${activeClassNames[index]}(\\s|$)`).test(sidebar.className)) {
                  return;
                }
                sidebar.className = sidebar.className.replace(new RegExp(`(^|\\s)${activeClassNames[1 - index]}(\\s|$)`, 'g'), '');
                sidebar.className += ` ${activeClassNames[index]}`;
              }
            }
            catch (e) {
              console.error(e);
            }
          };
        const sidebar = document.querySelectorAll('.sidebar-nav li');
        for (let i = 0; i < sidebar.length; i++) {
          sidebar[i].addEventListener("click", () => utils.activateSidebarPanel(i));
        }
        NexT.boot.refreshHandle.push(utils.registerSidebarTOC);
      }
      if (NexT.isFallback && document.addEventListener && document.querySelector) {
        function clickHandler() {
          if (document.body.classList) {
            if (document.body.classList.contains("sidebar-active")) {
              document.body.classList.remove("sidebar-active");
            }
            else {
              document.body.classList.add("sidebar-active");
            }
          }
          else {
            if (/(^|\s)sidebar-active(\s|$)/.test(document.body.className)) {
              document.body.className = document.body.className.replace(/(^|\s)sidebar-active(\s|$)/g, '');
            }
            else {
              document.body.className += " sidebar-active";
            }
          }
        }
        document.querySelector(".sidebar-dimmer").addEventListener("click", clickHandler);
        document.querySelector(".sidebar-toggle").addEventListener("click", clickHandler);
      }
    }
  }
  catch (e) {
    console.error(e);
  }
};

const lazyload = () => {
  if (NexT.isFallback) {
    NexT.boot.refreshHandle.push(() => {
      try {
        lozad(".post-body img").observe();
      }
      catch {
        try {
          if (document.querySelectorAll) {
            const elements = document.querySelectorAll("[data-src]");
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              element.setAttribute("src", element.getAttribute("data-src"));
            }
          }
          else {
            const elements = NexT.fallback.findDescendants(document.documentElement,
              /** @param {Element} element */
              element => !!element.attributes?.getNamedItem("data-src"))
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              const data = element.attributes.getNamedItem("data-src");
              const src = document.createAttribute("src");
              src.value = data.value;
              element.attributes.setNamedItem(src);
            }
          }
        }
        catch (e) {
          console.error(e);
        }
      }
    });
  }
};

const highlight = () => {
  if (NexT.isFallback && document.querySelectorAll) {
    NexT.boot.refreshHandle.push(() => {
      try {
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
      catch (e) {
        console.error(e);
      }
    });
  }
};

const refresh = () => {
  if (NexT.isFallback) {
    NexT.boot.refresh();
  }
};

module.exports = {
  init,
  css,
  flex,
  pjax,
  navbar,
  motion,
  search,
  scroll,
  sidebar,
  lazyload,
  highlight,
  refresh
}