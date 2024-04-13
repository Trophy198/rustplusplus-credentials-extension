/**
* Rust+ recently changed the login flow, which no longer sends auth data in the URL callback.
* Auth data is now sent to a ReactNativeWebView.postMessage handler, which is available to the Rust+ app since
* it is a ReactNative app.
*/
setInterval(() => {
    if (window.ReactNativeWebView === undefined){
        window.ReactNativeWebView = {
            postMessage: function(message) {
                var auth = JSON.parse(message);
                window.location.href =
                'https://rustplusplus-credentials.netlify.app/callback?token=' +
                encodeURIComponent(auth.Token) + '&steamId=' + encodeURIComponent(auth.SteamId)                
            },
        };
    }
}, 500);