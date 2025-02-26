const bilibiliCardBuilder = require("hexo-tag-bilibili-card/components/bilibili-card-builder/bilibili-card-builder.js");

/**
 * @param {"system" | "light" | "dark"} theme
 * @param {string} baseUrl
 */
function getTheme(theme, baseUrl) {
    switch (theme.toLowerCase()) {
        case '1':
        case "light":
            return new URL("bilibili-card.light.css", baseUrl).href;
        case '2':
        case "dark":
            return new URL("bilibili-card.dark.css", baseUrl).href;
        case '0':
        case "auto":
        case "system":
        case "default":
        case "component":
            return new URL("bilibili-card.css", baseUrl).href;
        case "fd":
        case "fd2":
        case "fluent":
        case "fluentui":
            return new URL("bilibili-card.fluent.css", baseUrl).href;
        case "windose":
            return new URL("bilibili-card.windose.css", baseUrl).href;
        case "-1":
        case "none":
            return '';
        default:
            return theme;
    }
}

module.exports =
    /**
     * @this {import("@types/hexo")}
     */
    function (data) {
        /** @type {import("jsdom").DOMWindow} */
        const window = bilibiliCardBuilder.window;
        const dom = new window.DOMParser().parseFromString(data.content, "text/html");
        const cards = [...dom.getElementsByTagName("bilibili-card")];
        if (cards.length) {
            const script = [...dom.querySelectorAll("script[src]")].find(script => script.src?.includes("bilibili-card.js"));
            if (script instanceof window.HTMLScriptElement) {
                const link = dom.createElement("link");
                link.rel = "stylesheet";
                link.href = getTheme(this.config.bilibili_card?.mode || "system", script.src);
                script.parentNode.replaceChild(link, script);
            }
            for (const card of cards) {
                bilibiliCardBuilder.praseElement(card);
                card.parentNode.replaceChild(card.firstElementChild, card);
            }
            data.content = dom.body.innerHTML;
        }
        return data;
    }