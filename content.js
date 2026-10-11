// Must match RPP.LOGIN_RETURN in auth.js (content scripts cannot import it).
var RPP_LOGIN_RETURN = '/app?returnUrl=' + encodeURIComponent('rust-plus://rust-auth-session');

document.addEventListener('DOMContentLoaded', function () {
    if (location.href.includes('https://rustplusplus-credentials.netlify.app')) {
        // Tell the credential page the extension is installed (and which version).
        const manifest = chrome.runtime.getManifest();
        let beacon = document.createElement("div");
        beacon.innerText = manifest.version;
        beacon.style.display = 'none';
        beacon.id = "chromeAddon";
        document.body.appendChild(beacon);
        return;
    }

    // Facepunch login page (2026-10 version): a POST form with a hidden
    // returnUrl. Empty means "go to rust.facepunch.com/companion" after login.
    // Point it at the app flow so the login ends in a rust-plus:// redirect,
    // which background.js forwards to the credential page.
    const returnUrl = document.querySelector('form input[name="returnUrl"]');
    if (returnUrl && !returnUrl.value) {
        returnUrl.value = RPP_LOGIN_RETURN;
    }
    if (returnUrl) {
        const form = returnUrl.closest('form');
        if (form && !form.querySelector('.rpp-note')) {
            const note = document.createElement('p');
            note.className = 'rpp-note';
            note.textContent = 'Logging in for rustplusplus credentials. You will be sent back to the credential page.';
            note.style.color = '#A4A6A7';
            note.style.paddingTop = '10px';
            note.style.fontSize = '0.9em';
            form.appendChild(note);
        }
    }

    // Legacy flow (before 2026-10): the result was posted to a
    // ReactNativeWebView bridge. Kept in case Facepunch serves it again.
    const inject = document.createElement('script');
    inject.src = chrome.runtime.getURL('catcher.js');
    inject.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(inject);
});
