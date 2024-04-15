const ReactNativeWebView = {
    postMessage: function(message) {
        try {
            var auth = JSON.parse(message);
            if (auth && auth.Token && auth.SteamId) {
                const baseUrl = 'https://rustplusplus-credentials.netlify.app/callback';
                const queryParams = `?token=${encodeURIComponent(auth.Token)}&steamId=${encodeURIComponent(auth.SteamId)}`;
                window.location.href = baseUrl + queryParams;
            } else {
                console.error('Invalid authentication message received:', message);
            }
        } catch (e) {
            console.error('Error parsing message:', message, e);
        }
    }
};

if (typeof cloneInto !== 'undefined') {
    window.wrappedJSObject.ReactNativeWebView = cloneInto(
        ReactNativeWebView,
        window, {
            cloneFunctions: true
        }
    );
} else {
    window.ReactNativeWebView = ReactNativeWebView;
}

const rustplusplus_login_description = 'Login to retrieve your credentials for rustplusplus.';
const button = document.querySelector("form button span");
const description = document.querySelector(".overlay-body p");
const container = document.querySelector('.overlay-container');
const login_tag = document.createElement('p');
const image = document.querySelector(".overlay-container img");

if (button && description && image) {
    // Update button text
    // button.textContent = "Login";

    // Set attributes for login_tag
    login_tag.setAttribute('class', 'overlay-footer');
    login_tag.textContent = rustplusplus_login_description; 
    login_tag.style.color = '#A4A6A7';
    login_tag.style.paddingTop = '10px';
    container.appendChild(login_tag);
    
    description.textContent = "The Credentials are required to pair rustplusplus with different Rust servers and Smart Devices. It also allow for different notifications that enhances the gaming experience such as Offline Death notifications, teammate login notifications and more.";
}
