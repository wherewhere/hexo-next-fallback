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

var motion = function () {
  if (typeof NexT === "undefined" || typeof NexT.boot === "undefined" || typeof NexT.boot.motion === "undefined") {
    var body = document.body;
    if (typeof body.classList === "undefined") {
      body.className = body.className.replace("use-motion", '');
    }
    else {
      body.classList.remove("use-motion");
    }
  }
  else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        const posts = document.querySelectorAll(".use-motion .post-block");
        if (posts.length && !Array.prototype.some.call(posts, function (x) { return x instanceof HTMLElement && x.classList.contains("animated") })) {
          document.body.classList.remove("use-motion");
        }
      }, 220);
    });
  }
}

module.exports = {
  css,
  motion
}