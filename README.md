rustplusplus-credentials-extension

[chrome](https://chromewebstore.google.com/detail/rustplusplus-credential-a/ooahmkklkanfgfmphpknpcgdpdcoikhe) <br/>
[firefox](https://addons.mozilla.org/en-US/firefox/addon/rustplusplus-credential-app/)

Browser extension that captures the Rust+ login result so
[rustplusplus-credentials](https://rustplusplus-credentials.netlify.app) can generate
credentials for the rustplusplus Discord bot.

## How it works (since October 2026)

Facepunch's Rust+ login now ends in a redirect to the app's custom scheme:

```
/login?returnUrl=/app?returnUrl=rust-plus://rust-auth-session
  -> Steam OpenID -> /signin-steam -> /app
  -> rust-plus://rust-auth-session/?token=<token>&steamId=<steam id>
```

A desktop browser cannot open `rust-plus://`, so the extension:

1. fills the login form's empty `returnUrl` with the app flow (`content.js`), so the
   site's Log In button and the toolbar button both work;
2. watches redirects on `companion-rust.facepunch.com` and sends the tab to
   `https://rustplusplus-credentials.netlify.app/callback?token=…&steamId=…`
   (`background.js`; Chrome reads the Location header and navigates the tab,
   Firefox rewrites the header with blocking webRequest).

The pre-October-2026 `ReactNativeWebView.postMessage` capture (`catcher.js`) is kept as
a fallback.

## Layout

- repository root: Chrome (Manifest V3)
- `firefox/`: Firefox (Manifest V2). `firefox/auth.js` is a copy of `auth.js`.

## Test locally

Chrome: `chrome://extensions` → Developer mode → Load unpacked → this folder.
Firefox: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → `firefox/manifest.json`.

Then open the credential site, click Log In, sign in with Steam; you should land on
`/display` with your `/credentials add …` command.

`node -e "require('./auth.js')"` loads the shared helper for quick checks.
