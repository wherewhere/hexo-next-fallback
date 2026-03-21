module.exports = () => {
  if (!window.globalThis) {
    window.globalThis = window;
  }
  if (!window.console) {
    function noop() { }
    window.console = {
      debug: noop,
      error: noop,
      info: noop,
      log: noop,
      warn: noop
    };
  }
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (window.DOMTokenList) {
    if (!DOMTokenList.prototype.forEach) {
      DOMTokenList.prototype.forEach = Array.prototype.forEach;
    }
    if (!DOMTokenList.prototype.replace) {
      DOMTokenList.prototype.replace = function (token, newToken) {
        if (this.contains(token)) {
          this.remove(token);
          this.add(newToken);
        }
      };
    }
  }
  /**
   * @param {string} src
   */
  function addScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    const parentNode = document.head || document.scripts[0].parentNode;
    parentNode.appendChild(script);
    return script;
  }
  if ((() => {
    const element = document.createElement('a');
    element.innerHTML = "<xyz></xyz>";
    return element.childNodes.length !== 1;
  })()) {
    addScript("https://cdn.jsdelivr.net/npm/html5shiv");
  }
  var polyfills = [];
  if (!window.Map) {
    polyfills.push("Map");
  }
  if (!window.Set) {
    polyfills.push("Set");
  }
  if (!window.Symbol) {
    polyfills.push("Symbol");
  }
  if (!window.WeakMap) {
    polyfills.push("WeakMap");
  }
  if (polyfills.length) {
    addScript(`https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=${polyfills.join(',')}`);
  }
}