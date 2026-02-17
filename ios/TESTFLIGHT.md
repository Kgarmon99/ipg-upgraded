# Send iPG to TestFlight

## Prerequisites
- **Apple Developer account** (paid $99/year) at [developer.apple.com](https://developer.apple.com)
- **Xcode** signed in with your Apple ID (Xcode → Settings → Accounts)

---

## Option A: Using Xcode (recommended)

### 1. Select your team
1. Open **iPG.xcodeproj** in Xcode.
2. Select the **iPG** project in the left sidebar.
3. Select the **iPG** target.
4. Open the **Signing & Capabilities** tab.
5. Under **Team**, choose your Apple Developer team (or “Add an Account…” and sign in).
6. Ensure **Automatically manage signing** is checked.

### 2. Create the app in App Store Connect (first time only)
1. Go to [App Store Connect](https://appstoreconnect.apple.com) → **My Apps**.
2. Click **+** → **New App**.
3. Choose **iOS**, name **iPG**, primary language, bundle ID **com.ipg.app**, SKU (e.g. `ipg1`).

### 3. Archive and upload
1. In Xcode, set the run destination to **Any iOS Device** (not a simulator).
2. Menu: **Product** → **Archive**.
3. When the Organizer appears, select the new archive and click **Distribute App**.
4. Choose **App Store Connect** → **Next**.
5. Choose **Upload** → **Next**.
6. Leave options as default (e.g. upload symbols, manage version/build) → **Next**.
7. Select your **Distribution certificate** (or let Xcode manage it) → **Next**.
8. Click **Upload**. When it finishes, click **Done**.

### 4. Enable TestFlight
1. In App Store Connect, open your app → **TestFlight** tab.
2. After processing (often 5–15 minutes), the build appears under **iOS Builds**.
3. Add **Internal** testers (same org) or submit for **External** testing (requires a short review).

---

## Option B: Command line (after team is set)

After you’ve set your **Team** in Xcode (step 1 above), you can archive from the terminal:

```bash
cd ios
xcodebuild -project iPG.xcodeproj -scheme iPG \
  -destination 'generic/platform=iOS' \
  -configuration Release \
  -archivePath build/iPG.xcarchive \
  archive
```

Then open the archive in Xcode and upload:

```bash
open build/iPG.xcarchive
```

In Organizer: **Distribute App** → **App Store Connect** → **Upload** (same flow as Option A, step 3).

---

## If you see “No accounts with App Store Connect access”

- Add your Apple ID in **Xcode → Settings → Accounts** and ensure the account has **App Manager** or **Admin** role for the app in App Store Connect.

## If you see “Bundle ID is not available”

- The bundle ID **com.ipg.app** must be registered in your Apple Developer account. When creating the app in App Store Connect (step 2), use this same bundle ID.
