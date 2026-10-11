/**
 * Shared constants and helpers for the Rust+ login capture.
 *
 * Since October 2026 Facepunch's Rust+ login (companion-rust.facepunch.com) no
 * longer hands the auth result to a ReactNativeWebView bridge. Instead the app
 * logs in with
 *
 *   /login?returnUrl=/app?returnUrl=rust-plus://rust-auth-session
 *
 * and after Steam sign-in Facepunch's /app endpoint redirects to
 *
 *   rust-plus://rust-auth-session/?token=<token>&steamId=<steam id>
 *
 * /app only accepts the rust-plus:// scheme, so a desktop browser cannot open
 * the result. The extension catches that redirect and forwards token and
 * steamId to the credential page's /callback, which already expects them.
 */
var RPP = (function () {
    var SITE = 'https://rustplusplus-credentials.netlify.app';
    var CALLBACK = SITE + '/callback';
    var APP_RETURN = 'rust-plus://rust-auth-session';
    var LOGIN_RETURN = '/app?returnUrl=' + encodeURIComponent(APP_RETURN);
    var LOGIN_URL = 'https://companion-rust.facepunch.com/login?returnUrl=' + encodeURIComponent(LOGIN_RETURN);

    /** Read a query parameter case-insensitively (Facepunch has used Token/token, SteamId/steamId). */
    function param(searchParams, name) {
        var lower = name.toLowerCase();
        var found = null;
        searchParams.forEach(function (value, key) {
            if (found === null && key.toLowerCase() === lower) found = value;
        });
        return found;
    }

    /**
     * Map a rust-plus:// redirect target to our callback URL.
     * Returns null when the URL is not a Rust+ auth redirect.
     */
    function callbackFor(redirectUrl) {
        if (typeof redirectUrl !== 'string' || redirectUrl.indexOf('rust-plus:') !== 0) return null;
        var url;
        try {
            url = new URL(redirectUrl);
        } catch (e) {
            return null;
        }
        var token = param(url.searchParams, 'token');
        var steamId = param(url.searchParams, 'steamId');
        if (token && steamId) {
            return CALLBACK + '?token=' + encodeURIComponent(token) + '&steamId=' + encodeURIComponent(steamId);
        }
        var error = param(url.searchParams, 'error') || 'missing_token';
        return CALLBACK + '?error=' + encodeURIComponent(error);
    }

    /** Find the Location header in a webRequest responseHeaders array. */
    function locationHeader(headers) {
        if (!headers) return null;
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].name.toLowerCase() === 'location') return headers[i].value;
        }
        return null;
    }

    return {
        SITE: SITE,
        CALLBACK: CALLBACK,
        LOGIN_RETURN: LOGIN_RETURN,
        LOGIN_URL: LOGIN_URL,
        callbackFor: callbackFor,
        locationHeader: locationHeader,
    };
})();

if (typeof module !== 'undefined') module.exports = RPP;
