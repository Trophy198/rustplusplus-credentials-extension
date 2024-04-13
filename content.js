const inject = document.createElement('script');
inject.src = chrome.runtime.getURL('catcher.js');
inject.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(inject);
const rustplusplus_login_description = 'Login to retrieve your credentials for rustplusplus.'
const button = document.querySelector("form button span");
const description = document.querySelector(".overlay-body p");
const container = document.querySelector('.overlay-container');
const login_tag = document.createElement('p');
const image = document.querySelector(".overlay-container img");


if (button && description && image) {
    // button text
    // button.textContent = "Login";



    // description
    login_tag.setAttribute('class','overlay-footer');
    login_tag.innerHTML = rustplusplus_login_description;
    login_tag.style.color = '#A4A6A7';
    login_tag.style.paddingTop = '10px';
    container.appendChild(login_tag);
    
    description.textContent = "The Credentials are required to pair rustplusplus with different Rust servers and Smart Devices. It also allow for different notifications that enhances the gaming experience such as Offline Death notifications, teammate login notifications and more.";
};
