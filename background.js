/**
 * The page used when the extension is clicked
 */
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({url: "https://companion-rust.facepunch.com/login"});
});