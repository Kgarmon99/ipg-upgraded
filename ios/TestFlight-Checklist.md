# TestFlight checklist — iPG

Configured in the project (no action needed unless you change teams):

- **Bundle ID:** `com.ipg.app` (must match App Store Connect exactly)
- **Version:** 1.0.0 (CFBundleShortVersionString)
- **Build number:** 2 (CFBundleVersion) — increment for each new upload (3, 4, 5…)
- **Team:** 8JT84X2GNT (Apple Development — Kahlil Garmon)
- **Signing:** Automatic (Xcode manages certificates and provisioning)
- **Architectures:** Default (arm64 included); no bitcode

---

## 1) App Store Connect (you do this once)

- [ ] **Create app (if needed):** [App Store Connect](https://appstoreconnect.apple.com) → **My Apps** → **+** → **New App**
  - Platform: **iOS**
  - Name: **IPG2**
  - Bundle ID: **com.ipg.app** (must match Xcode exactly)
  - SKU: e.g. `ipg1`
- [ ] **Your Apple ID** has a role that can upload builds: **Admin**, **App Manager**, or **Developer** (in App Store Connect → Users and Access).

---

## 2) Signing and provisioning (already set in Xcode project)

- **Team:** 8JT84X2GNT is set for Debug and Release.
- **Automatically manage signing:** Enabled (CODE_SIGN_STYLE = Automatic).
- **Provisioning:** Xcode will create/use an “App Store” / “iOS Distribution” profile for `com.ipg.app` when you archive.
- **Certificates:** Ensure you have a valid **Apple Distribution** certificate (Xcode can create one: Xcode → Settings → Accounts → [Your account] → Manage Certificates).

---

## 3) Build settings (already set)

- Archive uses **Release**.
- **Build number** is **2**; increment in Xcode (Target → General → Build) or in `Info.plist` / `CURRENT_PROJECT_VERSION` for each new upload.
- **Version** 1.0.0 and **Build** 2 are valid; arm64 is included; bitcode not required.

---

## 4) Archive and upload (in Xcode)

1. Open **iPG.xcodeproj** in Xcode.
2. Set run destination to **Any iOS Device**.
3. **Product** → **Archive**.
4. In **Organizer**, select the new archive → **Distribute App**.
5. **App Store Connect** → **Next**.
6. **Upload** → **Next**.
7. Leave options default → **Next**.
8. Signing: use **Automatically manage** or select the correct distribution profile → **Next**.
9. **Upload** → **Done** when finished.
10. In App Store Connect → **TestFlight**, wait for the build to process, then add testers.

If upload fails, copy the exact error message from Xcode or Organizer and fix from that (e.g. missing App in App Store Connect, wrong bundle ID, or certificate issue).
