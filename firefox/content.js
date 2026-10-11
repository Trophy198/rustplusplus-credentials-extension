document.addEventListener('DOMContentLoaded', function () {
    if (location.href.includes('https://rustplusplus-credentials.netlify.app')) {
        const manifest = browser.runtime.getManifest();
        let beacon = document.createElement("div");
        beacon.textContent = manifest.version;
        beacon.style.display = 'none';
        beacon.id = "mozAddon";
        document.body.appendChild(beacon);
    } else {
        // Facepunch login page (2026-10): point the empty returnUrl at the app
        // flow so the login ends in a rust-plus:// redirect that background.js
        // rewrites to the credential page.
        const returnUrl = document.querySelector('form input[name="returnUrl"]');
        if (returnUrl && !returnUrl.value) {
            returnUrl.value = '/app?returnUrl=' + encodeURIComponent('rust-plus://rust-auth-session');
        }
    }
    if (!location.href.includes('https://rustplusplus-credentials.netlify.app') && typeof window.wrappedJSObject.ReactNativeWebView === 'undefined') {
        // Legacy flow (before 2026-10), kept in case Facepunch serves it again.
        const ReactNativeWebView = {
            postMessage: function(message) {
                try {
                    const auth = JSON.parse(message);
                    if (auth && auth.Token && auth.SteamId) {
                        const baseUrl = 'https://rustplusplus-credentials.netlify.app/callback';
                        const queryParams = `?token=${encodeURIComponent(auth.Token)}&steamId=${encodeURIComponent(auth.SteamId)}`;
                        window.location.href = baseUrl + queryParams;
                    }
                } catch (e) {
                    console.error('Error parsing message:', message, e);
                }
            }
        };

        window.wrappedJSObject.ReactNativeWebView = cloneInto(
            ReactNativeWebView,
            window, {
                cloneFunctions: true
            }
        );

        const description = document.querySelector(".overlay-body p");
        const container = document.querySelector('.overlay-container');

        if (description && container) {
            const loginTag = container.querySelector('.overlay-footer');
            if (!loginTag) {
                const login_tag = document.createElement('p');
                login_tag.setAttribute('class', 'overlay-footer');
                login_tag.textContent = 'Login to retrieve your credentials for rustplusplus.';
                login_tag.style.color = '#A4A6A7';
                login_tag.style.paddingTop = '10px';
                container.appendChild(login_tag);
            }
            
            description.textContent = "The Credentials are required to pair rustplusplus with different Rust servers and Smart Devices. It also allows for different notifications that enhance the gaming experience such as Offline Death notifications, teammate login notifications and more.";
        } 
    }
});
