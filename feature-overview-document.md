# D2F Farmer App — Feature Overview

**Application:** `d2fone` (branded "AgriWings" in-app) · Expo slug `agriwings`
**Version analysed:** 2.0.1 · bundle/package `com.bestbringer1.agriwings`
**Source:** `untitled folder.zip`
**Analysis date:** 22 October 2026
**Method:** full static read of `src/` (265 TypeScript/TSX files, ~37,800 LOC), plus configuration in `app.json`, `eas.json`, `package.json`. Every behaviour described below was traced to code; file paths are given so claims can be re-checked.

---

## 1. What the app is

A Hindi-first (7-language) Android/iOS companion app for Indian farmers. It combines four things in one shell:

1. **Advisory & tools** — weather, 7-day forecast, disaster alerts, mandi (mandi bhaav) commodity prices, agri news, spray/fertilizer calculators, yield prediction.
2. **Service commerce** — book drone spray services on a registered farm, pay with AgriCoins, and track the job through an operator-driven timeline.
3. **Farm records** — register farms with map coordinates, acreage, crop and address; view them on satellite maps.
4. **Community & engagement** — a short-video/photo "Chaupal" feed, post creation, likes, shares, AgriCoins wallet, referrals and rewards.

The app is **farmer-facing only**. Although `models/roles.ts` defines 15 back-office roles (admin, cso, rm, operator, mis, …), the UI ships for the `farmer` role; a few screens branch on `cso`/`client` for timeline detail.

---

## 2. App at a glance

| Area          | Implementation                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Framework     | Expo SDK 57 (`expo ^57.0.9`), React Native 0.86.3, React 19.2.3, New Architecture enabled                       |
| Language      | TypeScript (`~6.0.3`), path alias `@/*` → `src/*`                                                               |
| Navigation    | `expo-router` v57, typed routes + React Compiler experiments enabled                                            |
| Server state  | Axios instance + per-feature hooks (no query cache library)                                                     |
| Client state  | Redux Toolkit + `redux-persist` (whitelist: `auth`, `colorMode`, `appSlice`)                                    |
| Forms         | `react-hook-form` (no resolver library; inline rules)                                                           |
| i18n          | `i18next` / `react-i18next`, 7 locales: `en, hi, pa, gu, mr, te, ta`                                            |
| Styling       | Custom theme tokens (`constants/theme.ts`), light + dark, `ThemeText`/`ThemeButton` primitives                  |
| Media         | `expo-image`, `expo-video`, `expo-camera`, `expo-image-picker`, `react-native-compressor`, Lottie               |
| Maps          | `react-native-maps` (satellite + markers); **no MapLibre implementation** despite `models/mapLibre.ts`          |
| Notifications | `expo-notifications` (Expo push tokens, Android channel `default`)                                              |
| Backend       | `https://api.d2f.co.in/api` (prod) / `https://development-api.d2f.co.in/api` (dev), switched by `IS_LIVE`       |
| Build         | EAS Build; `development` (dev client), `preview` (APK, internal), `production` (AAB); remote app-version source |
| Platforms     | iOS + Android + `react-native-web` present (web output `static`, not a shipped target)                          |

### Build and release configuration

- `app.json` → `newArchEnabled: true`, `userInterfaceStyle: automatic`, `predictiveBackGestureEnabled: false`, ProGuard + resource shrinking + minify enabled for Android release builds.
- Android permissions declared: `POST_NOTIFICATIONS`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `CAMERA`, `RECORD_AUDIO`.
- iOS Info.plist strings: camera, photo library, background remote notifications; `ITSAppUsesNonExemptEncryption: false`.
- EAS `projectId` is committed; `appVersionSource: "remote"` with `autoIncrement` on preview/production.
- README documents the three build commands (`preview` APK, `production` AAB, iOS IPA).

---

## 3. Architecture

```
app/                    expo-router route tree (screens only)
  (auth)/               login, password login, register
  (protected)/          auth-guarded stack: farms, sprays, tools, wallet, eCom, account
  tabs/                 home | chaupal | explore | profile
  weather/              current, forecast, disaster alerts
components/
  basic/                design-system primitives (buttons, inputs, sheets, text, lists)
  basic/pages/          feature UI grouped by domain (home, chaupal, sprays, farms, …)
  layout/navigation/    Header, BackButton, TabsLayout
hooks/                  one hook per domain (useUser, useFarms, useWeatherData, …)
slices/                 9 Redux slices
models/                 API/domain types
constants/              api client, app constants, theme
locales/                JSON translation bundles per language + index files
utils/                  i18n, helpers, static state/district lists, weather codes
```

**Request lifecycle.** Screens call a domain hook → the hook calls the shared `API` Axios instance → Redux is updated only for durable concerns (auth/user, weather report, spray request list, liked posts, order list, toast, global processing flag). Lists, ledgers and catalogue data stay in component state.

**Request pipeline (`app/_layout.tsx`).** On mount and whenever the token changes:

1. `x-api-key` header = `btoa(process.env.EXPO_PUBLIC_API_KEY)`.
2. `Authorization: Bearer <accessToken>` from Redux.
3. Response interceptor logs the user out when `response.data.statuscode == 401`.
4. Network failures are mapped to toasts ("No internet connection", "Connection changed", "Something went wrong on our end").

**Startup gating.** `<Stack.Protected guard={!hasOnboarded}>` exposes `landing` only before onboarding; `app/index.tsx` redirects to `/tabs/home` or `/landing`. `(protected)/_layout.tsx` redirects to `/(auth)/login` when `!isLoggedIn`.

---

## 4. Navigation map

**Root stack:** `landing` (onboarding, guarded) · `index` (redirect) · `(auth)` · `tabs` · `(protected)` · `comingSoon` · `weather` · `latestNews` · `appPermissions` · `myLocation` · `agricoinsPolicy` · `rewards` · `policies` · `feedbacks` · `support` · `aboutUs` · `checkUpdate` · `chooseLanguage` · `logsScreen` · `+not-found`

**Bottom tabs (4):** Home · Chaupal · Explore · Profile

### Route inventory

| Route                                                                                                  | Screen file                        | Access                             |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------- |
| `/landing`                                                                                             | `app/landing.tsx`                  | First run                          |
| `/(auth)/login`                                                                                        | `app/(auth)/login.tsx`             | Public                             |
| `/(auth)/loginWithPassword`                                                                            | `app/(auth)/loginWithPassword.tsx` | Public                             |
| `/(auth)/register`                                                                                     | `app/(auth)/register.tsx`          | Public                             |
| `/tabs/home`                                                                                           | `app/tabs/home.tsx`                | Public (guest allowed)             |
| `/tabs/chaupal`                                                                                        | `app/tabs/chaupal/index.tsx`       | Public read; login for like/create |
| `/tabs/chaupal/[id]`                                                                                   | `app/tabs/chaupal/[id].tsx`        | Login-guarded layout               |
| `/tabs/chaupal/createPost`                                                                             | `app/tabs/chaupal/createPost.tsx`  | Login                              |
| `/tabs/chaupal/myPosts`                                                                                | `app/tabs/chaupal/myPosts.tsx`     | Login                              |
| `/tabs/explore`                                                                                        | `app/tabs/explore.tsx`             | Public                             |
| `/tabs/profile`                                                                                        | `app/tabs/profile/index.tsx`       | Login (redirect)                   |
| `/myFarms` · `/myFarms/addFarm` · `/myFarms/[id]`                                                      | `app/(protected)/myFarms/*`        | Login                              |
| `/sprays` · `/sprays/droneSprays` · `/sprays/bookSpray` · `/sprays/mySprays` · `/sprays/sprayTimeline` | `app/(protected)/sprays/*`         | Login                              |
| `/sprays/manualSprays` · `/boomSprays` · `/tractorSprays`                                              | same folder                        | Login → redirect to `/comingSoon`  |
| `/smartTools` · `/sprayCalculator` · `/fertilizerCalculator` · `/yieldPredictor`                       | `app/(protected)/*`                | Login                              |
| `/eCom` · `/agricoins` · `/mySubscription` · `/fylloServices`                                          | `app/(protected)/*`                | Login                              |
| `/editprofile` · `/manageAccount` · `/myNotifications`                                                 | `app/(protected)/*`                | Login                              |
| `/weather` · `/weather/weatherForecast` · `/weather/disaterAlerts` · `/weather/disaterAlerts/[id]`     | `app/weather/*`                    | Public                             |
| `/mandiRate`                                                                                           | `app/mandiRate/index.tsx`          | Public                             |
| `/latestNews`                                                                                          | `app/latestNews.tsx`               | Public                             |
| `/myLocation` · `/appPermissions` · `/checkUpdate` · `/chooseLanguage`                                 | root                               | Public                             |
| `/support` · `/aboutUs` · `/policies` · `/agricoinsPolicy` · `/rewards` · `/feedbacks` · `/logsScreen` | root                               | Public                             |

---

## 5. Feature inventory

Legend — **Live**: end-to-end implemented · **Partial**: works but with a material limitation · **Shell**: navigable screen with placeholder content · **Absent**: advertised but no implementation.

| #   | Feature                                                                                                                                         | Status                            | Primary implementation                                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| 1   | Onboarding + language selection                                                                                                                 | Live                              | `app/landing.tsx`, `app/chooseLanguage.tsx`, `hooks/useLanguage.ts`       |
| 2   | Phone + OTP login                                                                                                                               | Live                              | `app/(auth)/login.tsx`                                                    |
| 3   | Password login                                                                                                                                  | Live                              | `app/(auth)/loginWithPassword.tsx`                                        |
| 4   | Farmer registration (state + referral)                                                                                                          | Live                              | `app/(auth)/register.tsx`                                                 |
| 5   | Home dashboard                                                                                                                                  | Live                              | `app/tabs/home.tsx` + `components/basic/pages/home/*`                     |
| 6   | Farm list / add / edit / detail                                                                                                                 | Live (no delete)                  | `app/(protected)/myFarms/*`, `components/basic/pages/farms/*`             |
| 7   | Live location + nearby executives                                                                                                               | Partial                           | `hooks/useLiveLocation.ts`, `components/basic/user/locationDetails.tsx`   |
| 8   | Drone spray booking                                                                                                                             | Live                              | `components/basic/pages/services/sprays/sprayBookingForm.tsx`             |
| 9   | Manual / boom / tractor spray                                                                                                                   | Absent                            | `manualSprays.tsx`, `boomSprays.tsx`, `tractorSprays.tsx` → `/comingSoon` |
| 10  | Spray request list, edit, cancel                                                                                                                | Live (status enum mismatch)       | `mySprays/index.tsx`, `farmerActionSheet/*`                               |
| 11  | Spray order timeline + payment detail                                                                                                           | Live                              | `sprayTimeline.tsx`, `timelineStep/*`                                     |
| 12  | Referral QR scan                                                                                                                                | Live                              | `qrScanner/index.tsx`                                                     |
| 13  | AgriCoins redemption at booking                                                                                                                 | Live                              | `agricoinsApplicability.tsx`                                              |
| 14  | Spray calculator                                                                                                                                | Partial (server result unused)    | `components/basic/pages/sprayCalculator/*`                                |
| 15  | Fertilizer calculator                                                                                                                           | Live                              | `app/(protected)/fertilizerCalculator.tsx`                                |
| 16  | Yield predictor                                                                                                                                 | Live                              | `components/basic/pages/yieldPrediction/*`                                |
| 17  | Weather current conditions                                                                                                                      | Live                              | `app/weather/index.tsx`, `hooks/useWeatherData.ts`                        |
| 18  | 7-day forecast + spray suitability                                                                                                              | Live                              | `app/weather/weatherForecast.tsx`                                         |
| 19  | Disaster alerts list + detail                                                                                                                   | Live                              | `app/weather/disaterAlerts/*`                                             |
| 20  | Mandi commodity rates                                                                                                                           | Partial (no pagination)           | `app/mandiRate/index.tsx`, `hooks/useMandiBhaav.ts`                       |
| 21  | Agri news (Google News RSS)                                                                                                                     | Live                              | `hooks/use-agriNews.ts`, `components/basic/pages/news/*`                  |
| 22  | Chaupal community feed                                                                                                                          | Live                              | `app/tabs/chaupal/index.tsx`                                              |
| 23  | Create post with media upload                                                                                                                   | Live                              | `app/tabs/chaupal/createPost.tsx`, `create/mediaUpload.tsx`               |
| 24  | My posts + review status                                                                                                                        | Live                              | `app/tabs/chaupal/myPosts.tsx`                                            |
| 25  | Post detail (shared links)                                                                                                                      | Absent (stub)                     | `app/tabs/chaupal/[id].tsx`                                               |
| 26  | Likes                                                                                                                                           | Partial (single tap no-op)        | `likeButton.tsx`, `hooks/useCommunityPosts.ts`                            |
| 27  | Share post (deep link)                                                                                                                          | Live → dead-end                   | `postShareButton.tsx`                                                     |
| 28  | E-commerce catalogue                                                                                                                            | Live (no pricing shown)           | `app/(protected)/eCom.tsx`, `hooks/useECommerce.tsx`                      |
| 29  | Product interest request                                                                                                                        | Partial (address hardcoded)       | `components/basic/pages/eCom/requestForm.tsx`                             |
| 30  | AgriCoins wallet + ledger                                                                                                                       | Live                              | `app/(protected)/agricoins.tsx`, `hooks/use-agricoins.tsx`                |
| 31  | Rewards / incentive policy                                                                                                                      | Shell (static image)              | `app/rewards.tsx`                                                         |
| 32  | Referral code at signup                                                                                                                         | Live                              | `components/basic/pages/addReferralDrawer.tsx`                            |
| 33  | Subscription / membership                                                                                                                       | Shell (empty state only)          | `app/(protected)/mySubscription.tsx`                                      |
| 34  | Push notifications (opt-in + routing)                                                                                                           | Partial                           | `hooks/usePushNotifications.ts`, `notificationCta.tsx`                    |
| 35  | In-app notification centre                                                                                                                      | Shell (empty state)               | `app/(protected)/myNotifications.tsx`                                     |
| 36  | Profile, edit profile, avatar                                                                                                                   | Live                              | `profilePage.tsx`, `editprofile.tsx`, `profileAvatar.tsx`                 |
| 37  | Change password                                                                                                                                 | Live                              | `updatePassword.tsx`                                                      |
| 38  | Delete account                                                                                                                                  | Live (native close call)          | `deleteAccount.tsx`                                                       |
| 39  | Permissions centre                                                                                                                              | Live (advisory only)              | `app/appPermissions.tsx`, `hooks/usePermissions.ts`                       |
| 40  | Force / soft update check                                                                                                                       | Partial (soft prompt)             | `app/checkUpdate.tsx`, `hooks/use-appVersion.ts`                          |
| 41  | Support / FAQ + call/email                                                                                                                      | Live                              | `app/support.tsx`                                                         |
| 42  | Policies (privacy, AgriCoins)                                                                                                                   | Live (WebView)                    | `policies.tsx`, `agricoinsPolicy.tsx`                                     |
| 43  | About us                                                                                                                                        | Live (static)                     | `app/aboutUs.tsx`                                                         |
| 44  | Fyllo IoT/advisory portal                                                                                                                       | Live (WebView + 24 h token cache) | `app/(protected)/fylloServices.tsx`                                       |
| 45  | Feedback submission / inbox                                                                                                                     | Absent (stub)                     | `app/feedbacks/index.tsx`                                                 |
| 46  | Diagnostics / logs                                                                                                                              | Absent (stub)                     | `app/logsScreen.tsx`                                                      |
| 47  | Coming-soon modules (insurance, soil health, crop calendar, irrigation, kheti centre, knowledge centre, govt schemes, lending, video tutorials) | Absent                            | `hooks/useAppText.tsx` entries with commented-out `link`                  |

---

## 6. Feature specifications

### 6.1 Onboarding and language

**What it does.** First launch shows a branded landing screen with language pills and a single "Get started" CTA, which marks onboarding complete and pushes the user to login. Language can be changed later from Home and Profile.

**Where.** `app/landing.tsx`, `app/chooseLanguage.tsx`, `hooks/useLanguage.ts`, `utils/i18n.ts`.

**How it works.**

- `i18n` initialises with the device locale (`expo-localization`) and the persisted `user-language` key from AsyncStorage; `fallbackLng: "en"`.
- `useLanguage` exposes 7 options (`en, hi, pa, gu, mr, te, ta`); selecting one dispatches `updateAppState({ language })`, calls `i18n.changeLanguage`, and writes AsyncStorage.
- "Get started" dispatches `hasOnboarded: true` (persisted via redux-persist) and `router.replace('/login')`.

**Rules and limits.** Onboarding is one-way per install until AsyncStorage is cleared. Language changes show the global processing overlay with a 1 s fade-out.

**Gaps.**

- `logout()` calls `AsyncStorage.clear()`, which wipes the persisted `appSlice`, so **onboarding reappears after every logout**.
- Landing hero copy is a literal placeholder: `"______ Together we grow better tomorrow ______"`.
- No permission priming during onboarding; the permission drawer call is commented out in `landing.tsx`.
- `chooseLanguage.tsx` declares a dead 2-item `lng` array that is never used.

---

### 6.2 Authentication

**Three entry paths, all phone-number based (`PHONE_REGEX = /^[6789]\d{9}$/`).**

| Path           | Screen                         | Flow                                                                                                                                                                                                                                                                                              |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OTP login      | `(auth)/login.tsx`             | `POST /send_otp_to_user` → returns `otp_id`, `register_user`, `registered_farmer`. Known user → 4-digit OTP step → `POST user_login_request` → `updateAuth` + redirect to `/tabs/home`. Unknown number → redirect to register. Farmer record without a user account → `POST user_create_request`. |
| Password login | `(auth)/loginWithPassword.tsx` | `POST user_login_request` with `{ phone_number, password }`; password rule `minLength: 6`.                                                                                                                                                                                                        |
| Registration   | `(auth)/register.tsx`          | Resend via `POST /send-otp`; submit `POST user_register_request` with `{ phone_number, otp, otp_id, name, address, state, referred_by, role: 'farmer' }`.                                                                                                                                         |

**Session handling.**

- Redux `auth` slice holds `{ isLoggedIn, currentUser, accessToken }`, persisted.
- Token is injected as `Authorization: Bearer …`; `x-api-key` is the base64 of `EXPO_PUBLIC_API_KEY`.
- Any response body with `statuscode == 401` triggers `logout()`, which resets auth/community/spray state and clears AsyncStorage.
- `useUser().fetchUser()` (`GET fetch_single_user`) refreshes the profile, merging `user_data` + `farmer_data`; it aborts any in-flight request before re-fetching.

**Rules and limits.**

- Consent checkbox is **pre-ticked** on both login screens (opt-out) and unticked on register.
- Sandboxed inputs: phone sanitisation strips `+91`, leading zeros and non-digits; OTP is 4 digits, `secureTextEntry`, `autoComplete="sms-otp"`.
- Registration validates name (2–60), address (≤120), state (required), optional referral (8–15, uppercased), consent.
- "Skip & explore" allows unauthenticated browsing of Home/Explore/Chaupal; protected routes redirect.

**Gaps.**

- No password reset / "forgot password" anywhere; accounts created via OTP have no password until one is set in Manage Account.
- Password policy differs between screens: login requires 6 characters, change-password requires 8.
- No OTP resend cooldown — resend is instant and unbounded.
- Guard paths are inconsistent (`/login`, `/(auth)/login`, `/tabs/home`) across layouts and components.
- `send-otp` resend does not check `status`, so an error response can overwrite `otp_id`.

---

### 6.3 Home dashboard

**What it does.** A single scroll surface combining greeting, live weather, farm shortcut, service promotion, tools, community and news.

**Where.** `app/tabs/home.tsx` (437 lines), components under `components/basic/pages/home/`.

**Composition, top to bottom.**

1. Header with user greeting, notification bell → `/myNotifications`, language chip → `/chooseLanguage`.
2. Weather card (`WeatherBlock`) + farm shortcut tile → `/myFarms`.
3. Weather alert banner (only when `alerts.alert.length > 0`).
4. `LocationCta` — location permission / tracking prompt.
5. `HomeCta` — auto-scrolling banner carousel (3 s interval, 4 local images) linking to yield predictor, spray calculator, fertilizer calculator.
6. "Smart services" section → `FeaturedTools` (tool cards).
7. Two recommendation cards: Precision Spraying → `/sprays`; Explore Products → `/eCom`.
8. `Chipfeatures` — feature chips.
9. "Trending topics" → `BlogTypeCommunityPosts` (first 2 posts as blog cards, tap → `/tabs/chaupal`).
10. Horizontal `News` carousel (10 items).
11. Company footer.

**Rules and behaviour.**

- Pull-to-refresh re-runs `fetchWeatherDetails()` and `checkUpdate()`.
- On mount and on version change, the screen compares the server version with `APP_VERSION` and navigates to `/checkUpdate` on any difference.
- Android hardware back opens `ExitPrompt` instead of exiting.
- On `?newUser=yes` (fresh registration) the referral drawer opens.
- `LocationDetails` (small variant) and `NotificationCta` are mounted as invisible helpers.
- Update-check chip renders while `checking`.

**Gaps.**

- `LocationDetails small` returns `null` unconditionally, so the "small" map variant does nothing.
- `FeaturedTools` duplicates the Explore smart-tools grid — two sources of navigation truth.
- Feedback CTA and the feature-nudge `CtaPopup` are commented out in the layout.

---

### 6.4 Explore

**What it does.** Catalogue of every module the app offers, grouped into Smart Tools, Services and Coming Soon.

**Where.** `app/tabs/explore.tsx`, content definitions in `hooks/useAppText.tsx`.

**Live entries (with `link`).**

- Smart tools: Mandi Rate, Fertilizer Calculator, Spray Calculator, Yield Predictor, Weather Forecast.
- Services: Spray Service (`/sprays`), E-commerce (`/eCom`), Subscription (`/mySubscription`), Rewards (`/rewards`), FAQs and Helpline (both `/support`), App Permission (`/appPermissions`).

**Coming-soon entries (no `link`, rendered with `ComingSoonTag`).** Insurance, Soil Health, Crop Calendar, Irrigation, Kheti Center, Knowledge Center, Government Schemes, Lending, Video Tutorials.

**Gaps.** `ComingSoonTag` also renders on service cards whose route is commented out, including entries inside the spray services hub. Descriptions fall back to `" "` when missing.

---

### 6.5 Farm management

**What it does.** Register and maintain farms with crop, acreage, IoT flag, photo, satellite map point and hierarchical address; each farm becomes the context for spray bookings and yield prediction.

**Where.** `app/(protected)/myFarms/{index,addFarm,[id]}.tsx`, `components/basic/pages/farms/**`, `hooks/use-farms.ts`.

**Data flow.**

- `GET /v1/fetch-farm-details` (optional `farmer_id`, `farm_id`) → `patchUser({ userFarms })`.
- Create: `POST /v1/create-farm` (multipart). Update: `POST /v1/update-farm` (multipart).
- Multipart fields: `farmer_id, farm_id, field_area, sub_district, village, district, state, pin_code, location_coordinates, address, acerage, current_crop, iot_devices, farm_image, status`.
- Address cascade: `POST get_location_data` with `{ state, district, sub_district }` returns the next-level list.
- Map: `react-native-maps` satellite view; tapping reverse-geocodes and fills address/city/district/state/PIN; coordinates stored as the string `"latitude: X, longitude: Y"`.

**Rules and limits.**

- Acreage: `/^\d+(\.\d{1,2})?$/`, required, ≤2 decimals.
- PIN: `/^[1-9][0-9]{5}$/`, digits only, max 6.
- Required: farm name, acreage, crop, IoT devices, address, state, district, sub-district, village, PIN.
- Submit throttled to one call per 4 s; 30 s timeout; global processing overlay during submit.
- Edit mode exposes a `status` switch (active/inactive) posted as `'1'`/`'0'`.
- Loading state renders 3 skeleton cards; tapping a card opens `/myFarms/[id]` with a read-only satellite map and an edit bottom sheet.

**Gaps.**

- **No delete or archive action**, and no farm-deletion endpoint is referenced.
- **Area is typed manually — there is no polygon drawing or geodesic area computation anywhere in the codebase.**
- Unparseable coordinates silently fall back to Hisar (29.124003, 75.706207); editing such a farm then saves those fallback coordinates over the real address pin.
- In create mode `LocationPicker` receives a default region of `0,0`, so the map opens at "Null Island" rather than the user's position.
- Existing farm image is never previewed in the edit sheet (`initialImageUri` is declared but unused).
- Farm image is always uploaded as `image/jpeg` with filename `farm.jpg` regardless of source format.
- Two different state lists exist (`utils/stateList.ts` for mandi vs `app-helper.states` for address forms).

---

### 6.6 Spray services

The most developed vertical in the app, and the only one with a real operational lifecycle.

**6.6.1 Service hub.** `app/(protected)/sprays/index.tsx` — hero, drone service card, `ServiceGrid` of four methods, and "View Booked Services" → `/sprays/mySprays`. Only the drone card is wired; tractor/boom/manual cards have no `link` and show `ComingSoonTag`, and their screens are literal `Redirect` components to `/comingSoon`.

**6.6.2 Booking.** `sprayBookingForm.tsx` submits `POST /v1/farmer-spray-request` with `{ crop_id, crop_name, acreage, request_date, remarks, referral, apply_coin, farm_id }`.

Validation and rules actually enforced:

- Farm, crop, acreage required (react-hook-form + a manual `missingFields` guard).
- Acreage: digits only, `maxLength 5`, values above `MAX_ACREAGE = 300` are ignored mid-keystroke.
- Date cannot be in the past; defaults to today; posted as `YYYY-MM-DD`.
- Remarks optional, max 160 characters, live counter.
- Consent checkbox gates submit.
- Referral: 8+ characters, sanitised to `[A-Z0-9-]`, uppercased, max 12; verified on blur via `POST fetch_user_details { emp_id }`; in-flight responses are aborted and stale results discarded.
- AgriCoins: `apply_coin` is clamped to the acreage (`apply_coin > acreage ? acreage : apply_coin`).
- Pre-filled `referenceNumber` route param makes the referral field read-only and hides the QR button.
- Success shows a bottom sheet with the returned `request_id`, then routes to `/sprays/mySprays`.

**6.6.3 AgriCoins applicability.** `POST /agricoin-redeem-details { emp_id }` returns `already_redeemed_free_acre, eligible_total_free_acre, financial_year, remaining_free_acre, total_sprayed_acreage, wallet_balance`. The offer card appears only when `eligible_total_free_acre > 0` **and** `wallet_balance` is truthy. Tapping applies the entire `remaining_free_acre`; tapping again clears it. No partial-acre selection and no server-side reservation at submit time.

**6.6.4 QR referral scan.** `expo-camera` `CameraView` scanning `qr` and `pdf417`; accepts codes of **exactly 10 characters**, uppercases and fills the referral field. Mismatch with the 8-character typed rule is a live inconsistency. Toast text contains a typo (`"Inavlid Referance Code"`).

**6.6.5 My sprays.** `GET /v1/fetch-farmer-spray-requests` (no status filter sent) → Redux `spray-request-slice`. Card shows crop, acreage, date, status chip and a coin indicator; an order-id strip appears only when `service_id` exists and `status == 2`.

Action sheet by status:

- `1` → Edit request / Cancel request.
- `0` → rejection remarks, labelled "cancelled by self" or "rejected by operator".
- `2` → open the order timeline if `service_id` exists, otherwise a "pending" message.
- Edit validates acreage (`min` 0.1, `max` 300, digits only), farm, crop, future-only date → `POST /v1/update-farmer-request`.
- Cancel requires remarks (max 120, sanitised) and posts `status: '0'`.

**6.6.6 Order timeline.** `GET /get_order_timeline/{requestId}` where the order id is normalised by uppercasing and stripping the `AWO-` prefix plus leading zeros. One record is projected into up to 8 steps, sorted newest-first:

`Created` → `Acknowledged` → `Operator Assigned` → `Spray Started` → `Completed` → `Delivered`, plus `Service Request Cancelled` and `Updated` variants.

Each step renders its own detail component: acreage requested/sprayed/drone, chemical IDs, NOC image, farmer and refund signatures, operator name/phone, fresh-water flag, available person, amendment diff, refund amount, selfie images (S3 URLs). Payment block distinguishes `payment_type === '1'` → Prepaid, else Postpaid; `payment_required == 0` → "Payment handled by client."

Role-aware rendering: `cso`/`client` roles hide drone acreage; amendment diff rows show only for logged-in users.

**Gaps in this vertical.**

- **Status enum conflict:** `models/sprayRequest.ts` defines `Created = 1, Accepted = 2`, but the action sheet uses a local map `ACCEPTED = 1, PROCESSED = 2`. Edit/Cancel vs. timeline-link behaviour is therefore driven by contradictory meanings of the same integers.
- Edit and cancel error handlers are empty with `// TODO: surface a user-facing error`.
- `sprayRequestDetails.tsx` is an unused stub; `PaymentDetails` calls `JSON.parse` on `amount_received` without guarding null or already-parsed objects.
- Booking treats any HTTP 2xx as success with no `status` check, unlike every other flow.
- `STATUS_LABEL` is computed at module import, so labels do not update on language change.
- Hardcoded English remains in `PendingRequests`, `Payment Details`, `Order Id`, `Book Spray`.
- The hub's drone entry uses the id `'tractor-spray'` with tractor copy.

---

### 6.7 Agronomy calculators

**6.7.1 Spray calculator.** `app/(protected)/sprayCalculator.tsx` + `components/basic/pages/sprayCalculator/*`.

- Inputs: method (Drone/Tractor/Boom/Manual), chemical class (Insecticide/Fungicide/Herbicide), product (searched via `GET /v1/spray/options?spray_type=&search=`, 350 ms debounce, aborts stale searches), tank capacity, field size.
- `POST /v1/spray/calculate { chemical_id, field_size, tank_capacity }` — **only `similar_products` from the response is used**.
- Water rates are hardcoded client-side: Manual 200, Tractor 120, Boom 100, Drone 10 L/acre. Minimum tank: Manual 1, Tractor 5, Boom 5, Drone 1. Default dose 60 ml/acre when the product has no `base_dose`.
- Derived: `totalWater = field × rate`, `totalChemical = field × dose`, `tanks = ceil(totalWater / tank)`, `chemicalPerTank = totalChemical / tanks` (4 dp).
- Calculate disabled without a product, below minimum tank, or field < 0.1 acre. Reset sets method Drone but tank 200 — inconsistent with the 10 L/acre drone rate.

**6.7.2 Fertilizer calculator.** `GET /v1/fertilizer-crops` for crops (with per-acre N/P/K reference), then `POST /v1/fertilizer-calculator { field_size, crop_id }` returning `{ crop_name, field_size, nitrogen, phosphorus, potassium }`. Calculate requires a crop, is throttled to one call per 5 s, and clears results when crop or acreage changes. The screen is a thin API pass-through — no client-side recomputation.

**6.7.3 Yield predictor.** `GET /v1/yield/options` returns `crops` and `soil_types`; `POST /v1/yield/predict { crop, state, district, soil_type, sowing_date, field_size }` returns `total_expected_yield { min, max, unit }` and a qualitative `yield_expectation.label`. The result card shows the midpoint of min/max.

Rules: farm mode requires a farm with `state` and `district`, otherwise the user must switch to "Others"; field size > 0 (default 1); sowing date defaults to today with **no past/future restriction**; duplicate submits blocked by a ref.

**Gaps.** Success conventions differ within the same module (`statuscode === '200'` vs `status === 'success'`). `/v1/spray/calculate` failures still render a client-computed "success" sheet because `setResult` runs in `.finally`. Similar products are not cleared on reset. A `TODO` for the error colour token remains.

---

### 6.8 Weather, forecast and disaster alerts

**Where.** `app/weather/{index,weatherForecast,disaterAlerts/index,disaterAlerts/[id]}.tsx`, `hooks/useWeatherData.ts`, `slices/weather-report-slice.ts`, `models/weather.ts`.

**Data.** A single third-party call, `GET https://api.weatherapi.com/v1/forecast.json`, with `q = "lat,lng"`, `days: 7`, `aqi: yes`, `alerts: yes`, `lang = app language`. Local `axiosWithRetry` gives 3 attempts; 20 s timeout; `AbortController` cancels superseded calls. Location comes from `expo-location` (foreground permission → last known position → current position raced against a 10 s timeout). Result is stored in Redux (`fetching`, `data`, `errorMessage`) so all three screens share one payload.

**Current conditions:** temperature, condition text and icon (mapped from WeatherAPI condition codes in `utils/weatherConditions.ts`), humidity, wind, rain chance, pressure, "Data provided by Weather API", plus a spray-alert banner when any forecast day has `daily_chance_of_rain > 50`.

**Forecast:** seven rows of day label, average temperature, condition; days with rain chance < 30% render a tappable "good for spraying" block that routes to the booking screen.

**Alerts:** list of CAP alerts with severity chips (`extreme`→error, `severe`→error accent, `moderate`→warning, `minor`→info), loading skeletons, and a detail screen showing event, urgency, affected areas, validity window, parsed description and instruction block. Expiry text is computed locally ("Expired", "Expires in 3d", "Expires in 5h 20m").

**Gaps.**

- No offline cache — every cold entry refetches; the forecast screen has no error branch (empty list on failure).
- Alert detail reads only in-memory Redux, so deep links and app restarts show "not available".
- Air quality and UV are requested but never displayed.
- Rain thresholds differ between the home banner (50%) and the forecast suggestion (30%).
- Forecast title contains a literal placeholder suffix (`… ___`).
- Weather API key is hardcoded in the client bundle (see §11).

---

### 6.9 Mandi rates (mandi bhaav)

**Where.** `app/mandiRate/index.tsx` (494 lines), `hooks/useMandiBhaav.ts`, `components/basic/pages/mandiBhaav/*`.

**Data.** Direct `GET https://api.data.gov.in/resource/9ef84268-…` with `format=json`, `limit=100`, and optional filters `filters[state.keyword]`, `filters[district]`, `filters[market]`, `filters[commodity]`, `filters[variety]`, `filters[grade]`, `filters[arrival_date]`, `offset`. Success requires `status === "ok"`; records carry `arrival_date, commodity, district, grade, market, max_price, min_price, modal_price, state, variety`.

**Behaviour.**

- State selector from `utils/stateList.ts` (sentinel "All States" skipped); district list filtered from the static `utils/districtList.ts`.
- Selected state persisted in AsyncStorage (`mandiState`) and restored on mount.
- In-memory `Map` cache keyed by the stringified filter object; `reset()` clears it.
- Client-side filtering by search text (matches market or commodity, case-insensitive) and by district substring; results grouped by commodity with the first group expanded; prices formatted `₹` + `en-IN` grouping.
- Two empty states distinguish "no network data" from "no matches for your filter".

**Gaps.**

- **No pagination:** `limit=100` caps the dataset; `total` and `hasMore` are never used, and the `offset` branch is unreachable from the UI.
- **Changing district does not refetch** (the fetch effect keys only on state), so district filtering only applies to the first 100 records of the state.
- No date, grade or variety filters despite backend support.
- Cache has no TTL; rates can go stale until `reset()`.
- Entire screen is hardcoded English, and `total: Number(data.total) ?? 0` yields `NaN` when the field is absent.
- data.gov.in key is hardcoded in the client bundle.

---

### 6.10 Agri news

**Where.** `hooks/use-agriNews.ts`, `components/basic/pages/news/{index,NewsView}.tsx`, surfaces on Home (horizontal) and `/latestNews`.

**Data.** Google News RSS (`news.google.com/rss/search`) with a randomly rotated query (`agriculture`, `kisan news india`, `crop msp india`) and language config for `en, hi, gu, ta, te, pa, mr`. Parsed with `fast-xml-parser`; top 10 items; HTML stripped from descriptions; image taken from `media:content` or first `<img>`; published date formatted in the detail modal; "read full article" opens the system browser.

**Gaps.** `fetchNews` captures the language once (`[]` deps), so switching language does not refetch. No pagination, caching or de-duplication. Fallback image is an Unsplash URL duplicated in two files. Error handling uses a DOM-only `e.target.src` assignment that has no effect in React Native.

---

### 6.11 Chaupal community

**6.11.1 Feed.** `app/tabs/chaupal/index.tsx` — full-screen vertical pager (`pagingEnabled`, fixed `REEL_HEIGHT`), 10 posts per page, prefetch on end-reached, pull-to-refresh. Each card shows author avatar, relative time, title, 2-line description, a swipeable media carousel (images + `expo-video` clips that play only when the item is active and the tab is focused), like button and share button. Video slides have their own play/pause and progress bar.

Data: `GET /v1/community-posts?limit=10&page=N` (double-nested `data.data.data`), normalised by `typePostMapper.ts`. `GET /v1/my-liked-community-posts` hydrates `communityPostSlice.likedPosts`.

**6.11.2 Create post.** Two-step composer: media → text. Media picker allows 5 assets, `quality 0.8`, 60 s max video; limits 5 MB/image, 25 MB/video, 125 MB total, checked before **and** after compression (`react-native-compressor`: images max width 1280 @ 0.7, videos max size 1280, concurrency 2). Upload via XHR multipart to `/v1/upload-community-post-media` (field `file[]`, 60 s timeout, progress events). Then `POST /v1/create-community-post` with `{ title, description, image_url[], video_link[], readmore_url, category: 'Agriculture' }`. Title ≤120 and required; description ≤1000, required only when no media; `readmore_url` must be http/https; unknown file types block submit; Android back is intercepted with a discard confirmation.

**6.11.3 My posts.** `GET /v1/my-post?limit=10&page=N`, paginated, with an `approved_status === 1` → "published" chip, otherwise "under review". Tap opens a media viewer sheet. No edit, delete or share actions.

**6.11.4 Likes and shares.** Like/unlike posts `POST /v1/community-post-like { post_id }` and updates Redux membership; a Lottie burst plays on a new like. Share uses the native sheet with a deep link (`Linking.createURL('tabs/chaupal/<id>')`) and falls back to copying the link.

**Gaps.**

- **`/tabs/chaupal/[id]` is a stub screen** (`Header` + the literal text "SinglePost"). Shared links and shares therefore dead-end.
- Single tap on the like button is a no-op (`setTimeout(() => {}, 300)`) — users must double-tap to like, while a single tap on an already-liked post unlikes it.
- Like and unlike send identical payloads; the distinction is client-side only. Like counts do not update locally until refetch.
- **No comment feature exists** anywhere in the app.
- Feed fetching is duplicated: inline in the screen and again in `useCommunityReels`.
- `reelItem.tsx` is dead prototype code with hardcoded counts (`1.2k`) and no-op icons.
- Category is hardcoded to `'Agriculture'`; post status copy uses the wrong i18n key for like counts.
- `useCommunityPosts.likePost` closes over a stale empty `likedPosts` array.

---

### 6.12 E-commerce

**Where.** `app/(protected)/eCom.tsx`, `hooks/useECommerce.tsx`, `components/basic/pages/eCom/*`.

**Flow.** `GET /v1/products` → grid of product cards (image, name, 2-line description, "View >>"). Tapping opens a bottom sheet (90% height) with product detail and an interest form: quantity (`min 1`), address, remark (required, ≤300). Submit `POST /v1/product-requests { product_id, quantity, address, remark }`, throttled to one call per 5 s; success toast closes the sheet.

**Gaps.**

- **`address` is hardcoded to the string `'f'` and there is no address field** — every request posts `"f"`.
- Prices exist in the model but are commented out in both the card and detail sheet, so no pricing is shown.
- **No cart, no checkout, no order placement, no product search/filter, no product detail route.**
- Failure toast is emitted with `severity: 'success'`.
- `hooks/useUserOrders.ts` (`GET farmer-services`) sounds commerce-related but actually feeds the spray orders list.

---

### 6.13 AgriCoins wallet, rewards and referrals

**6.13.1 Wallet.** `app/(protected)/agricoins.tsx`, `hooks/use-agricoins.tsx`, `components/basic/user/myCoins/index.tsx`.

- `GET /v1/user-agricoin` → wallet `{ balance, created_at, lifetime_earned, lifetime_spent }` plus `total_sprayed_acreage`, written into `auth.currentUser.agricoin`.
- `GET /v1/user-agricoin-transaction` → ledger rendered as credit/debit rows with ±amount, timestamp, and copy generated from a `source × type` template map covering `register, spray, referral, spray_redemption, product_redemption, admin, bonus`, appending acreage and reference when present.
- Card on Profile shows the balance; tapping the balance refetches.

**6.13.2 Rewards.** `app/rewards.tsx` is a static page: a banner image plus a server-hosted JPG of the "AW Farmer Incentive Policy". **No API, no coin values, no referral tracking, no share/invite action.**

**6.13.3 Referral.** `addReferralDrawer.tsx` opens after registration (`?newUser=yes`). Code length 10–12, debounced verification (450 ms) via `POST fetch_user_details`, submit disabled until verified, then `POST /v1/add-referral { referred_by }`. "Skip and continue" dismisses.

**Gaps and inconsistencies.**

- Referral length rules diverge three ways: **8** (booking form), **8–15** (registration), **10–12** (drawer), **exactly 10** (QR scanner).
- `updateReferral` treats any truthy response body as success, including `{ status: 'error' }`.
- `onSuccess` is never passed by the only caller, so that callback is dead.
- Wallet spinner is unreachable (`loading && balance == null` can never be true because balance defaults to `0`); a commented-out sample ledger remains in the file.
- `agricoinsPolicy` WebView header reads "D2F One – Privacy Policy" instead of an AgriCoins title.

---

### 6.14 Profile and account

**Profile** (`components/basic/pages/profile/profilePage.tsx`) shows avatar, name, `emp_id` (long-press to copy), phone with a hardcoded `+91`, region, verified badge from `farmerDetails.is_verified === '1'`, AgriCoins card, and three menu groups:

- Find & Connect → `/myLocation`; My Farms; IoT Service → `/fylloServices`; My Posts; My Sprays; Subscriptions.
- Manage Account.
- Language, App Permission, About Us, Contact Us, Privacy Policy, and a red-bordered Logout.

**Edit profile** (`editprofile.tsx`) posts `{ name, farmer_address, farmer_district, farmer_pincode, farmer_state, farmer_sub_district, farmer_village }` to `/v1/update-profile`, then refetches the user.

**Avatar** (`profileAvatar.tsx`) — picker with 1:1 crop, quality 0.8, compression to max width 1080 @ 0.7, hard 5 MB cap, optimistic preview with rollback, multipart `profile_image` upload to `/v1/update-profile`.

**Change password** (`updatePassword.tsx`) — `POST /v1/update-profile { old_password, password }`; minimum 8 characters, new ≠ old, confirmation must match, passwords never trimmed.

**Delete account** (`deleteAccount.tsx`) — two-phase confirmation, then `POST /inactive-user { emp_id, password }`; on success it toasts, logs out, and calls `NativeModules.AppControl.closeApp()`.

**Gaps.**

- Editing profile never confirms success (silent navigation).
- `ProfileFields` declares mobile/email/password/photo fields that the form ignores.
- Change-password error path toasts the raw error object; `logout` is imported into the deps array but never called.
- Delete-account reads `res.data.message` while the rest of the app uses `res.data.msg`; the native module call is unguarded and runs before logout settles.
- `manageAccount` bottom sheet has a no-op `onClose`, so it cannot be dismissed by backdrop or drag.
- No notifications, rewards or order-history entries in the profile menu.

---

### 6.15 Notifications

**Plumbing.** `usePushNotifications` sets a foreground handler (sound, badge, banner, list all true), creates the Android `default` channel at `MAX` importance, requests permission, resolves the EAS `projectId`, and obtains an Expo push token. Taps route through `router.push({ pathname: data.route, params: JSON.parse(data.params) })`. Foreground notifications are surfaced as in-app toasts.

**Token upload.** `POST /save-fcm-token { device_token, device_type, deviceName, deviceId }`, token cached in AsyncStorage under `fcmToken`. Registration is **opt-in** via a bottom-sheet CTA (`notificationCta.tsx`) or the permissions screen; on upload failure the stored token is deliberately removed.

**Gaps.**

- **No notification list** — `myNotifications.tsx` is a hardcoded empty state with no endpoint, and the profile has no entry for it (only the home bell links there).
- No automatic token registration at login; two independent registration paths can double-POST the token.
- `JSON.parse(data.params)` is unguarded and can throw inside the tap handler.
- Device check is commented out, so simulators attempt registration.

---

### 6.16 Support, policies, about

- **Support** (`app/support.tsx`): tap-to-call `+91 9889161313`, tap-to-email `support@agriwings.in`, long-press to copy, and a FAQ list fetched from `${SERVER_URL}/faq.json` (plain `fetch`, no auth), rendered as rows with answer sheets and a "talk to our agent" CTA. Typo in copy: "Still need assitance?".
- **Policies** (`app/policies.tsx`): WebView of `${SERVER_URL}/privacy-policy.html` with `textZoom={200}`. Title says "D2F One – Privacy Policy" while the app brands itself AgriWings.
- **AgriCoins policy** (`app/agricoinsPolicy.tsx`): WebView of `${SERVER_URL}/agri-coins-policy.html`.
- **About us** (`app/aboutUs.tsx`): static mission/vision copy with links to support and privacy. Fully hardcoded English.
- **Feedback** (`app/feedbacks/index.tsx`): **stub** — renders only a header. No form, no list, no endpoint. A feedback CTA on Home is currently commented out.

---

### 6.17 Fyllo services

`GET /v1/get-fyllo-user-token?mobile=<phone>` returns `{ status, data: { url } }`; the URL is opened in a `react-native-webview`. Response cached in AsyncStorage per phone for 24 hours; expired entries are removed and refetched. Errors show a retry state.

**Gaps.** `mobile=undefined` is sent when the user has no phone; the WebView has no `onError`, `originWhitelist`, or loading indicator, so an expired token renders a blank page. A commented-out test phone number remains in the file.

---

### 6.18 Permissions and app update

**Permissions centre** (`app/appPermissions.tsx`, `hooks/usePermissions.ts`). Rows for location, notifications, camera and microphone read OS truth on focus and on app foreground (throttled 750 ms). Tapping a granted or permanently-blocked row opens system settings; otherwise it requests. Per-key in-flight dedupe and stale-commit guards are implemented. Gallery is forced to "granted" on Android (Photo Picker) and the gallery row is commented out.

`hasRequiredPermissions` (default key: location) is exported but **no screen gates navigation on it** — permissions are advisory. There is no first-run permission onboarding.

**Update check** (`app/checkUpdate.tsx`, `hooks/use-appVersion.ts`). `GET check-app-version?app_name=Agriwings` returns the latest version; the screen compares `+version.replaceAll('.','')` against `+APP_VERSION.replaceAll('.','')` and offers "Update" (Play Store) or "Check Update". Home navigates to this screen whenever the server version string differs from the installed one — **including when the server reports an older version**.

**Gaps.** Dot-stripping breaks on multi-digit segments (`2.0.10` vs `2.1.0`); a missing version yields `NaN` and silently reports "up to date". It is a soft prompt only — no minimum-supported-version gate or blocking modal. Store URLs are hardcoded separately from `app.json`.

---

### 6.19 Diagnostics

`app/logsScreen.tsx` is an 11-line stub rendering the literal text "LogsScreen". No logger, no log slice, no export. The route is registered in the public root stack.

---

## 7. Backend API surface

All first-party calls go through `API` (`baseURL = ${SERVER_URL}/api`). Paths without a leading slash resolve directly under `/api`.

### 7.1 Authentication and account

| Method | Path                    | Purpose                                                             |
| ------ | ----------------------- | ------------------------------------------------------------------- |
| POST   | `/send_otp_to_user`     | Request OTP; returns `otp_id`, `register_user`, `registered_farmer` |
| POST   | `/send-otp`             | Resend OTP during registration (with `role: 'farmer'`)              |
| POST   | `user_login_request`    | OTP login or password login                                         |
| POST   | `user_create_request`   | Create user for an existing farmer record                           |
| POST   | `user_register_request` | Farmer registration                                                 |
| GET    | `fetch_single_user`     | Refresh session user + farmer details                               |
| POST   | `fetch_user_details`    | Look up a referral/employee code `{ emp_id }`                       |
| POST   | `/v1/update-profile`    | Update profile, avatar (multipart), or password                     |
| POST   | `/v1/add-referral`      | Attach referral to a new account                                    |
| POST   | `/inactive-user`        | Delete account `{ emp_id, password }`                               |
| POST   | `/save-fcm-token`       | Register push token                                                 |

### 7.2 Farms and location

| Method | Path                     | Purpose                                                                                 |
| ------ | ------------------------ | --------------------------------------------------------------------------------------- |
| GET    | `/v1/fetch-farm-details` | Farm list, or one farm by `farm_id`                                                     |
| POST   | `/v1/create-farm`        | Create farm (multipart)                                                                 |
| POST   | `/v1/update-farm`        | Update farm (multipart)                                                                 |
| POST   | `get_location_data`      | State → district → sub-district cascade                                                 |
| POST   | `/v1/update-coordinates` | Periodic user location sync `{ location_coordinates: "lat,lng", user_id }`              |
| POST   | `/v1/get-nearby-users`   | Nearby executives/operators `{ location_coordinates, radius: 50, role: "operator,rm" }` |

### 7.3 Spray services

| Method | Path                              | Purpose                                                    |
| ------ | --------------------------------- | ---------------------------------------------------------- |
| GET    | `/get_crops`                      | Crop master list                                           |
| POST   | `/v1/farmer-spray-request`        | Create spray booking                                       |
| GET    | `/v1/fetch-farmer-spray-requests` | My spray requests                                          |
| POST   | `/v1/update-farmer-request`       | Edit or cancel (`status: '0'`) a request                   |
| GET    | `/get_order_timeline/{requestId}` | Full order timeline record                                 |
| GET    | `farmer-services`                 | Booked spray orders                                        |
| GET    | `/v1/spray/options`               | Spray products by type + search                            |
| POST   | `/v1/spray/calculate`             | Spray calculation (currently only `similar_products` used) |
| GET    | `/v1/fertilizer-crops`            | Fertilizer crop list with N/P/K reference                  |
| POST   | `/v1/fertilizer-calculator`       | Fertilizer recommendation                                  |
| GET    | `/v1/yield/options`               | Yield crops + soil types                                   |
| POST   | `/v1/yield/predict`               | Yield prediction                                           |

### 7.4 Community and commerce

| Method | Path                              | Purpose                           |
| ------ | --------------------------------- | --------------------------------- |
| GET    | `/v1/community-posts`             | Feed, `?limit=&page=`             |
| GET    | `/v1/my-post`                     | Own posts, `?limit=&page=`        |
| POST   | `/v1/create-community-post`       | Create post                       |
| POST   | `/v1/upload-community-post-media` | Multipart media upload (`file[]`) |
| GET    | `/v1/my-liked-community-posts`    | Liked post ids                    |
| POST   | `/v1/community-post-like`         | Like / unlike `{ post_id }`       |
| GET    | `/v1/products`                    | Product catalogue                 |
| POST   | `/v1/product-requests`            | Product interest request          |

### 7.5 AgriCoins and content

| Method        | Path                                                                           | Purpose                                                        |
| ------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| GET           | `/v1/user-agricoin`                                                            | Wallet balance and lifetime totals                             |
| GET           | `/v1/user-agricoin-transaction`                                                | Coin ledger                                                    |
| POST          | `/agricoin-redeem-details`                                                     | Redemption eligibility for the financial year                  |
| GET           | `app-banner`                                                                   | Role-based banners (`{ role: "farmer" }`) — defined but unused |
| GET           | `check-app-version`                                                            | Latest app version (`app_name: "Agriwings"`)                   |
| GET           | `/v1/get-fyllo-user-token`                                                     | Fyllo portal tokenised URL by mobile                           |
| GET (raw)     | `${SERVER_URL}/faq.json`                                                       | Support FAQ                                                    |
| GET (WebView) | `/privacy-policy.html`, `/agri-coins-policy.html`, `/agri-coins-policy` assets | Legal content                                                  |

### 7.6 Third-party dependencies

| Service                                       | Usage                                       | Notes                                          |
| --------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| WeatherAPI.com                                | Current weather, 7-day forecast, CAP alerts | API key embedded in the client                 |
| data.gov.in (Agmarknet resource `9ef84268-…`) | Mandi prices                                | API key embedded in the client; 100-record cap |
| Google News RSS                               | Agri news                                   | Parsed client-side with `fast-xml-parser`      |
| Fyllo                                         | IoT/advisory web portal                     | Opened in WebView; token cached 24 h           |
| Google Maps (Android)                         | Map tiles for `react-native-maps`           | API key declared in `app.json`                 |
| Expo Push (EAS)                               | Notifications                               | `projectId` from `app.json` extra              |

---

## 8. State management

| Slice                    | Holds                                                                                    | Persisted |
| ------------------------ | ---------------------------------------------------------------------------------------- | --------- |
| `auth`                   | `isLoggedIn`, `currentUser` (profile, farmerDetails, userFarms, agricoin), `accessToken` | Yes       |
| `appSlice`               | `hasOnboarded`, `language`, `locationCoords`                                             | Yes       |
| `colorMode`              | Light/dark preference                                                                    | Yes       |
| `weatherReport`          | `fetching`, `data` (current + forecast + alerts), `errorMessage`                         | No        |
| `spray-request-slice`    | `list`, `loading`, `error`                                                               | No        |
| `communityPostSlice`     | `likedPosts` (plus unused `loading`)                                                     | No        |
| `user-orders-slice`      | Booked spray orders                                                                      | No        |
| `processing-state-slice` | Global blocking-loader flag                                                              | No        |
| `toast-slice`            | Toast title/message/severity                                                             | No        |

Everything else — mandi records, product catalogue, coin ledger, community pagination, permission states — lives in component or hook state. There is no server-state cache, so screens refetch on mount.

**Cross-cutting UX primitives:** global processing overlay + `ThemeLoading`, `ThemeToast` queue, `ThemeButton`, `ThemeInput`, `SelectInput`, `DateInput` calendar, `NumberCounter`, `BottomSheet`, `Skeleton`, `EmptyData`, `LoadingList`, `NotesSection`, `CompanyFooter`, `Header` (with slots), `TabsLayout`.

---

## 9. Localisation

- 7 locales: English, Hindi, Punjabi, Gujarati, Marathi, Telugu, Tamil.
- Each locale directory contains 24 JSON namespaces (`common`, `home`, `chaupal`, `sprays`, `farms`, `weather`, `agriCoins`, `eCom`, `profile`, `screens`, …) aggregated by `locales/<lang>.ts`.
- Device locale is used on first run; the user's choice is persisted in AsyncStorage and Redux.
- Locale is also forwarded to WeatherAPI (`lang`) and Google News (`hl`, `gl`, `ceid`).

**Coverage reality.** The bulk of the UI is translated, but several screens are fully hardcoded English: mandi rates, support, about, permissions, update check, feedbacks, logs, weather alert severity labels, spray calculator result sheet, several spray timeline strings, and most error toasts. Some strings contain literal placeholder underscores (`"Amount Required ___"`, `"… ___"` in the forecast header).

---

## 10. Native configuration and permissions

| Capability                 | Library                                                                     | Declared configuration                                                               |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Camera (QR + crop capture) | `expo-camera`                                                               | `CAMERA`, `RECORD_AUDIO`; iOS camera + mic strings                                   |
| Photo library              | `expo-image-picker`                                                         | iOS photo-library string; Android Photo Picker (no permission)                       |
| Location                   | `expo-location`                                                             | Coarse + fine location; "use your location to map fields"                            |
| Notifications              | `expo-notifications`                                                        | `POST_NOTIFICATIONS`; Android channel `default`; iOS background remote notifications |
| Maps                       | `react-native-maps`                                                         | Google Maps API key in `app.json`                                                    |
| Media                      | `expo-video`, `expo-image`, `lottie-react-native`                           | Background playback and PiP explicitly disabled                                      |
| Storage                    | `@react-native-async-storage/async-storage`, `expo-file-system`             | —                                                                                    |
| Haptics / UI               | `expo-haptics`, `expo-glass-effect`, `expo-symbols`, `expo-linear-gradient` | —                                                                                    |
| Web                        | `react-native-webview`, `expo-web-browser`                                  | Policy, AgriCoins, Fyllo pages                                                       |

**Permission philosophy.** All permissions are requested contextually; none gate core navigation. Location drives weather, nearby-executive discovery and coordinate sync; notifications are opt-in.

---

## 11. Security and configuration observations

These are code-level findings, not an audit. They are listed because they affect release readiness.

1. **Third-party API keys are shipped in the client bundle** — `WEATHER_API_KEY` and `MANDIBHAAV_API_KEY` in `constants/appConstant.ts`, used directly in request params. Anyone can extract and reuse them. Move these calls behind the backend.
2. **`EXPO_PUBLIC_API_KEY` is a public build-time variable** and only base64-encoded — it is not a secret. Authentication relies on the bearer token, which is fine, but the "API key" adds no real protection.
3. **No secure storage** — the access token is persisted through redux-persist into AsyncStorage (unencrypted). `expo-secure-store` is not used.
4. **`AsyncStorage.clear()` on logout** wipes all app keys, including unrelated preferences, and resets onboarding.
5. **Environment switching is a source constant** (`IS_LIVE`) rather than build profiles, so producing a dev build requires editing code.
6. **Inconsistent response contracts** — three success conventions coexist: `statuscode === '200'`, `status === 'success'`, and "any 2xx". Error text is read from `msg` in most places, `message` in two.
7. **Unguarded `JSON.parse`** in the notification-tap handler and in `PaymentDetails`.
8. **Signed URL construction by string concatenation** for S3 images, with inconsistent folder naming (`farmer_img_`, `/noc_image/`).

---

## 12. Implementation gaps and risks

### 12.1 Release-blocking or user-visible defects

| #   | Issue                                                                            | Impact                                                         | Where                                                       |
| --- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Shared post link opens a stub "SinglePost" screen                                | Every share is a dead end                                      | `app/tabs/chaupal/[id].tsx`                                 |
| 2   | Single tap on like does nothing (double-tap required)                            | Users think the button is broken                               | `likeButton.tsx`                                            |
| 3   | Product request always posts `address: "f"`                                      | Orders arrive with unusable delivery data                      | `requestForm.tsx:32`                                        |
| 4   | Spray request status enums contradict each other                                 | Edit/cancel and timeline links can appear for the wrong status | `farmerActionSheet/actions.tsx` vs `models/sprayRequest.ts` |
| 5   | Spray calculator shows a "success" result even when the API fails                | Wrong chemical quantities shown to farmers                     | `sparyCalculatorForm.tsx` `.finally` block                  |
| 6   | Referral length rules differ across four screens (8 / 8–15 / 10–12 / exactly 10) | Valid codes rejected; inconsistent UX                          | booking form, register, drawer, QR scanner                  |
| 7   | Mandi district change does not refetch                                           | Filtering only affects the first 100 state records             | `app/mandiRate/index.tsx`                                   |
| 8   | Editing a farm with unparseable coordinates silently writes Hisar coordinates    | Farm location corruption                                       | `myFarms/[id].tsx`, `parseCoordinates`                      |
| 9   | Version comparison by dot-stripping                                              | False "update available" or missed updates                     | `checkUpdate.tsx`, `home.tsx`                               |
| 10  | Onboarding reappears after every logout                                          | Repetitive first-run flow                                      | `useUser.logout` + `AsyncStorage.clear()`                   |

### 12.2 Functional gaps (advertised or implied, not implemented)

- **Entire moderation loop is missing**: no post edit/delete, no comments, no reporting; "My posts" shows review status but offers no action.
- **Commerce is a lead form**, not a store: no pricing, cart, checkout, orders, or order history.
- **Spray methods**: manual, boom and tractor are redirect stubs although they appear in the services grid.
- **Feedback** and **logs** screens are stubs; the feedback CTA on Home is commented out.
- **Notification centre** is an empty state; there is no notification history endpoint.
- **Subscription** is a static empty state with no plan, price, purchase or entitlement check.
- **Rewards** is a single static policy image with no coin values or referral tracking.
- **Farm deletion** does not exist.
- **Nine Explore entries** are permanently "coming soon" (insurance, soil health, crop calendar, irrigation, kheti centre, knowledge centre, government schemes, lending, video tutorials).

### 12.3 Code quality and maintainability

- **Duplicated implementations**: location cascade (`locationForm.tsx` vs `use-locationData.ts`), push registration (`usePermissions` vs `notificationCta`), feed fetching (screen vs `useCommunityReels`), state lists (`utils/stateList.ts` vs `app-helper.states`), smart-tools navigation (`FeaturedTools` vs `Explore` vs `smartTools/index`).
- **Dead code**: `reelItem.tsx`, `permissionCard.tsx`, `myLocationCard.tsx` (stub), `sprayRequestDetails.tsx` (stub), `sampleSpray.ts` (types only despite the name), `models/mapLibre.ts` (no MapLibre anywhere), commented sample ledger and price renderers.
- **Only four `TODO` comments exist**, all incidental; real gaps manifest as silent placeholders rather than tracked work. `expo-error.log` (113 KB) is committed in the project root.
- **Hook discipline**: several `useCallback`/`useMemo` dependency arrays are incomplete or empty, producing stale closures (`use-agriNews`, `useCommunityPosts.likePost`, `useSprayRequests`, `use-agricoins`). One screen (`myFarms/[id].tsx`) declares hooks after early returns.
- **`any` leakage**: timeline detail props are typed `any` throughout despite `models/timeline.ts`.
- **Styling**: hardcoded colours (`'#865b0020'`, `'red'`, gradient pairs) sit beside the theme system; a `TODO` still marks an error-colour token.

### 12.4 Suggested remediation order

1. Fix the four data-integrity issues: product address, farm coordinate fallback, spray status enum, spray calculator false success.
2. Unify validation contracts: referral length, password minimum, success-response checks.
3. Implement or remove advertised-but-empty surfaces (post detail, feedback, notification centre, subscription) so navigation has no dead ends.
4. Move third-party API calls (weather, mandi) behind the backend and rotate the exposed keys.
5. Consolidate duplicated modules and add a response-unwrapping helper to normalise `status`/`statuscode`/`msg`.
6. Add automated checks: TypeScript strict pass, ESLint with hook rules, and a smoke test per route.

---

## 13. File index for onboarding

| Concern                            | Start here                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| App shell, providers, interceptors | `app/_layout.tsx`, `store/store.ts`, `constants/api.ts`                                             |
| Navigation structure               | `app/tabs/_layout.tsx`, `app/(protected)/_layout.tsx`                                               |
| Design system                      | `constants/theme.ts`, `hooks/use-theme.ts`, `components/basic/*`                                    |
| Auth lifecycle                     | `app/(auth)/*`, `hooks/useUser.ts`, `slices/auth-slice.ts`                                          |
| Spray vertical                     | `app/(protected)/sprays/*`, `components/basic/pages/services/sprays/*`, `hooks/useSprayRequests.ts` |
| Community vertical                 | `app/tabs/chaupal/*`, `components/basic/pages/chaupal/*`, `hooks/useCommunityPosts.ts`              |
| Weather                            | `hooks/useWeatherData.ts`, `slices/weather-report-slice.ts`, `app/weather/*`                        |
| Config and secrets                 | `constants/appConstant.ts`                                                                          |
| Localisation                       | `utils/i18n.ts`, `locales/*`                                                                        |

---

_Prepared from static source analysis. Behaviour described reflects the code as provided; runtime-only behaviour (server responses, native module presence, push delivery) was not executed._
