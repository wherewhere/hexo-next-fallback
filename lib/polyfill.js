module.exports = () => {
  if (!window.globalThis) {
    window.globalThis = window;
  }
}