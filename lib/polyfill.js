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
  if ((() => {
    const element = document.createElement('a');
    element.innerHTML = "<xyz></xyz>";
    return element.childNodes.length !== 1;
  })()) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/html5shiv";
    script.async = false;
    const parentNode = document.head || document.scripts[0].parentNode;
    parentNode.appendChild(script);
    return script;
  }
}