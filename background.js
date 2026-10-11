/**
 * Chrome (MV3) service worker.
 *
 * 1. The toolbar button opens Facepunch's Rust+ login with the returnUrl the
 *    official app uses, so the login ends in a rust-plus:// redirect.
 * 2. That redirect is observed on the response and the tab is sent to the
 *    credential page's /callback with the token and Steam ID.
 *
 * MV3 webRequest is observe-only, so the Location header is read in
 * onHeadersReceived and the tab is navigated with tabs.update before Chrome
 * gets to the external-protocol prompt. onBeforeRedirect is a second hook in
 * case a Chrome version reports the redirect there instead.
 */
importScripts('auth.js');

chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({ url: RPP.LOGIN_URL });
});

var handled = new Set();

function forward(tabId, requestId, target) {
    if (tabId < 0 || handled.has(requestId)) return;
    var dest = RPP.callbackFor(target);
    if (!dest) return;
    handled.add(requestId);
    if (handled.size > 50) handled.clear();
    chrome.tabs.update(tabId, { url: dest });
}

var filter = { urls: ['https://companion-rust.facepunch.com/*'], types: ['main_frame'] };

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        if (details.statusCode < 300 || details.statusCode > 399) return;
        forward(details.tabId, details.requestId, RPP.locationHeader(details.responseHeaders));
    },
    filter,
    ['responseHeaders'],
);

chrome.webRequest.onBeforeRedirect.addListener(function (details) {
    forward(details.tabId, details.requestId, details.redirectUrl);
}, filter);
