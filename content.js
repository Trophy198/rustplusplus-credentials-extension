document.addEventListener('DOMContentLoaded', function () {
    if (location.href.includes('https://rustplusplus-credentials.netlify.app')) {
        const manifest = chrome.runtime.getManifest();
        let beacon = document.createElement("div");
        beacon.innerText = manifest.version;
        beacon.style.display = 'none';
        beacon.id = "chromeAddon";
        document.body.appendChild(beacon);
    } else {
        const inject = document.createElement('script');
        inject.src = chrome.runtime.getURL('catcher.js');
        inject.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(inject);

        const rustplusplus_login_description = 'Login to retrieve your credentials for rustplusplus.';
        const button = document.querySelector("form button span");
        const description = document.querySelector(".overlay-body p");
        const container = document.querySelector('.overlay-container');
        const login_tag = document.createElement('p');
        const image = document.querySelector(".overlay-container img");

        if (button && description && image) {
            // description
            login_tag.setAttribute('class', 'overlay-footer');
            login_tag.textContent = rustplusplus_login_description;
            login_tag.style.color = '#A4A6A7';
            login_tag.style.paddingTop = '10px';
            container.appendChild(login_tag);
            
            description.textContent = "The Credentials are required to pair rustplusplus with different Rust servers and Smart Devices. It also allows for different notifications that enhance the gaming experience such as Offline Death notifications, teammate login notifications and more.";
        };
    }
});
