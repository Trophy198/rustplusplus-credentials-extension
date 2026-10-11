/**
 * Firefox (MV2) background script.
 *
 * Firefox still allows blocking webRequest, so the rust-plus:// redirect from
 * Facepunch's /app endpoint is rewritten in place: the Location header is
 * replaced with the credential page's /callback URL carrying the token and
 * Steam ID. The browser never sees the rust-plus:// URL.
 * auth.js (loaded first, see manifest) provides RPP.
 */
browser.browserAction.onClicked.addListener(function () {
    browser.tabs.create({ url: RPP.LOGIN_URL });
});

browser.webRequest.onHeadersReceived.addListener(
    function (details) {
        if (details.statusCode < 300 || details.statusCode > 399) return {};
        var dest = RPP.callbackFor(RPP.locationHeader(details.responseHeaders));
        if (!dest) return {};
        var headers = details.responseHeaders.map(function (h) {
            return h.name.toLowerCase() === 'location' ? { name: h.name, value: dest } : h;
        });
        return { responseHeaders: headers };
    },
    { urls: ['https://companion-rust.facepunch.com/*'], types: ['main_frame'] },
    ['blocking', 'responseHeaders'],
);
