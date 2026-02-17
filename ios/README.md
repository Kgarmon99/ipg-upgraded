# iPG — iOS App

Native iOS wrapper for the iPG web app. Opens in Xcode and runs on device or simulator.

## Open in Xcode

1. Open **`iPG.xcodeproj`** in Xcode (double‑click or **File → Open**).
2. Select the **iPG** scheme and a simulator or your device.
3. Press **⌘R** to build and run.

## Ship to App Store

1. **Signing:** In Xcode, select the **iPG** target → **Signing & Capabilities**. Choose your Team and set a unique **Bundle Identifier** (e.g. `com.yourname.ipg`).
2. **App icon:** Add a 1024×1024 px icon in **Assets.xcassets → AppIcon** (or remove `ASSETCATALOG_COMPILER_APPICON_NAME` in Build Settings if you use a single asset).
3. **Archive:** **Product → Archive**, then **Distribute App** → **App Store Connect**.
4. In App Store Connect, create the app, fill in metadata, and submit for review.

## Updating the web app inside the iOS build

When you change the web app (HTML/CSS/JS in the repo root), copy the updated files into **`iPG/Web/`** so the iOS app bundle stays in sync:

- `index.html` → `iPG/Web/index.html`
- `style.css` → `iPG/Web/style.css`
- `app.js` → `iPG/Web/app.js`
- `data.js` → `iPG/Web/data.js`
- `pg.jpg` → `iPG/Web/pg.jpg`

Then rebuild in Xcode.

## Requirements

- Xcode 14+
- iOS 15.0+
- Swift 5

## Structure

- **iPG/** — Swift app: `AppDelegate`, `SceneDelegate`, `ViewController` (full‑screen `WKWebView`).
- **iPG/Web/** — Bundled web app (HTML, CSS, JS, image). Loaded from the app bundle at launch.
- **iPG/Assets.xcassets** — App icon and accent color.

External links (e.g. GitHub) open in Safari.
