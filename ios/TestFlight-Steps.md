# TestFlight — do this in Xcode (about 2 minutes)

Xcode is open with the iPG project. Follow these steps:

---

## 1. Set destination
At the top of Xcode, next to the **iPG** scheme, click the device dropdown and choose **Any iOS Device** (not a simulator).

## 2. Archive
Menu bar: **Product** → **Archive**

Wait for the build to finish. The **Organizer** window will open.

## 3. Upload to TestFlight
In the Organizer:
1. Select the **iPG** archive you just created.
2. Click **Distribute App**.
3. **App Store Connect** → **Next**.
4. **Upload** → **Next**.
5. Leave the options as default → **Next**.
6. Choose your signing certificate (or leave default) → **Next**.
7. Click **Upload** → **Done** when it finishes.

## 4. In App Store Connect
- Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps**.
- Open **iPG** (or create it: **+** → **New App**, bundle ID `com.ipg.app`).
- Open the **TestFlight** tab. Your build will appear after processing (usually 5–15 minutes).
- Add testers and install via the TestFlight app.

Done.
