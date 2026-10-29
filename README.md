# D2F Farmer App (`d2fone`)

A React Native / Expo application for Indian farmers. It combines farm records, drone spray services, agronomy calculators, weather and mandi prices, community feeds, and an AgriCoins rewards wallet in a single Hindi-first mobile app.

- **App name / slug:** `d2fone` / `agriwings`
- **Version:** 2.0.1
- **Bundle identifier:** `com.bestbringer1.agriwings`
- **Platforms:** Android, iOS
- **Languages:** English, Hindi, Punjabi, Gujarati, Marathi, Telugu, Tamil

> A detailed, code-level breakdown of every feature — including what is incomplete — is maintained separately as `D2F-Farmer-App-Feature-Overview.md` (analysis artifact, not part of this repository).

---

## Contents

- [Feature highlights](#feature-highlights)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Available scripts](#available-scripts)
- [Building and releasing](#building-and-releasing)
- [Project structure](#project-structure)
- [Architecture notes](#architecture-notes)
- [Internationalisation](#internationalisation)
- [API and third-party integrations](#api-and-third-party-integrations)
- [Troubleshooting](#troubleshooting)
- [Contributing conventions](#contributing-conventions)
- [License](#license)

---

## Feature highlights

**Onboarding and accounts**

- Language-first onboarding with seven languages
- Phone + OTP login, password login, and farmer self-registration
- Profile editing, avatar upload, password change, account deletion

**Farm management**

- Register farms with crop, acreage, IoT flag, photo, and map-picked coordinates
- Hierarchical address cascade (state → district → sub-district → village → PIN)
- Satellite map view per farm

**Spray services**

- Drone spray booking with crop, acreage, date, remarks, and consent
- Referral codes typed manually or captured by QR scan
- AgriCoins redemption against eligible free acreage
- Request list with edit and cancel actions
- Full order timeline: created → acknowledged → operator assigned → spray started → completed → delivered, including chemical usage, NOC, signatures, and payment breakdown
- Manual, boom, and tractor spray are routed to a "coming soon" screen

**Agronomy tools**

- Spray calculator (water and chemical quantity per tank, by application method)
- Fertilizer calculator (N/P/K recommendation per crop and acreage)
- Yield predictor (expected yield range by crop, soil type, location, sowing date)

**Advisory content**

- Current weather, 7-day forecast with spray-suitability hints, and CAP disaster alerts
- Mandi commodity rates with state/district and keyword filtering
- Agriculture news from Google News RSS

**Community and commerce**

- Chaupal feed with photo/video posts, likes, and shares
- Post composer with client-side image/video compression and upload progress
- "My posts" with moderation status
- Product catalogue with an interest/request form
- AgriCoins wallet and transaction ledger
- Referral code entry and incentive policy page

**Platform**

- Contextual permissions centre (location, notifications, camera, microphone)
- Push notifications with deep-link routing
- In-app update check, FAQ/support, privacy and AgriCoins policies
- Embedded Fyllo advisory portal

---

## Tech stack

| Layer         | Choice                                                                          |
| ------------- | ------------------------------------------------------------------------------- |
| Runtime       | Expo SDK 57, React Native 0.86.3, React 19.2.3, New Architecture enabled        |
| Language      | TypeScript (strict), path aliases `@/*` → `src/*`, `@/assets/*` → `assets/*`    |
| Navigation    | `expo-router` (file-based, typed routes)                                        |
| State         | Redux Toolkit + `redux-persist` (whitelist: `auth`, `colorMode`, `appSlice`)    |
| Networking    | Axios with a shared instance and response interceptor                           |
| Forms         | `react-hook-form`                                                               |
| i18n          | `i18next` + `react-i18next` + `expo-localization`                               |
| UI            | Custom theme system, `expo-image`, `expo-video`, `expo-linear-gradient`, Lottie |
| Maps          | `react-native-maps`                                                             |
| Media         | `expo-camera`, `expo-image-picker`, `react-native-compressor`                   |
| Notifications | `expo-notifications` (Expo push tokens, EAS project)                            |
| Build         | EAS Build (development / preview / production profiles)                         |

---

## Requirements

- **Node.js LTS** — use the version required by Expo SDK 57 (see the versioned Expo docs referenced in `AGENTS.md`)
- **npm** (a `package-lock.json` is not committed; use one package manager consistently)
- **EAS CLI** for cloud builds: `npm install -g eas-cli`
- **Android Studio** (SDK + emulator) or **Xcode** (macOS) for local native builds
- An Expo account with access to the project's EAS project ID

> **Expo Go will not run this app.** `react-native-compressor`, `react-native-maps`, `react-native-permissions`, and `@expo/ui` require custom native code. Use a development build (`npx expo run:android` / `npx expo run:ios` or the EAS `development` profile).

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

The app reads one build-time variable. Create `.env` in the project root:

```bash
EXPO_PUBLIC_API_KEY=<base64-encoded-api-key>
```

Notes:

- Only variables prefixed with `EXPO_PUBLIC_` are inlined into the bundle. Treat this value as public — it is not a secret.
- If the variable is missing, the app still boots but logs `EXPO_PUBLIC_API_KEY is not set — API requests requiring x-api-key will fail.` and authenticated endpoints will reject requests.

### 3. Add the native credential files

`app.json` references two Firebase files that are **not committed** to this repository:

| File                       | Used by                            |
| -------------------------- | ---------------------------------- |
| `google-services.json`     | Android (FCM / push notifications) |
| `GoogleService-Info.plist` | iOS (FCM / push notifications)     |

Obtain these from the Firebase project, or from the EAS credentials store, and place both in the project root. Cloud builds will fail prebuild if they are absent.

### 4. Run the app

```bash
# Development build on a connected device/emulator
npm run android
npm run ios

# Metro only (after a development build is installed)
npm start
```

---

## Environment configuration

### API endpoints

Base URLs are selected by a single flag in `src/constants/appConstant.ts`:

```ts
export const IS_LIVE = true; // true = production, false = development
```

| Setting   | Production                                     | Development                                        |
| --------- | ---------------------------------------------- | -------------------------------------------------- |
| API       | `https://api.d2f.co.in/api`                    | `https://development-api.d2f.co.in/api`            |
| S3 assets | `https://agriwing.s3.ap-south-1.amazonaws.com` | `https://trainingbeta.s3.ap-south-1.amazonaws.com` |

Switching environments currently requires editing this constant and rebuilding — there is no build-profile-driven env selection.

### Keys committed in source

`src/constants/appConstant.ts` contains third-party API keys (weather, mandi data) used directly from the device, and `app.json` contains a Google Maps key. These are readable by anyone with the app bundle.

To rotate or relocate them:

1. Create replacement keys in the respective provider consoles.
2. Move the weather and mandi calls behind the backend and remove the keys from the client.
3. Restrict the Maps key to the app's package name and SHA-1 fingerprint.
4. Remove the leaked values from this file before the next public release.

### App version

`APP_VERSION` in `src/constants/appConstant.ts` must match `expo.version` in `app.json`. The update-check screen and the home screen compare the installed value against `GET /api/check-app-version`.

---

## Available scripts

| Command                 | Description                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `npm start`             | Start the Metro bundler                                                                  |
| `npm run android`       | Build and run the Android development build (`expo run:android`)                         |
| `npm run ios`           | Build and run the iOS development build (`expo run:ios`)                                 |
| `npm run web`           | Start the web target (`expo start --web`); not a supported shipping target               |
| `npm run lint`          | Run `expo lint`                                                                          |
| `npm run reset-project` | **Broken** — the referenced `scripts/reset-project.js` is not present in this repository |

---

## Building and releasing

Builds are produced with EAS. Profiles are defined in `eas.json`:

| Profile       | Output                    | Distribution | Notes                                     |
| ------------- | ------------------------- | ------------ | ----------------------------------------- |
| `development` | Development client        | Internal     | For local development with native modules |
| `preview`     | APK (Android) / IPA (iOS) | Internal     | `autoIncrement` enabled                   |
| `production`  | AAB (Android) / IPA (iOS) | Store        | `autoIncrement` enabled                   |

```bash
# Android APK for internal testing
npx eas build --platform android --profile preview

# Android App Bundle for Play Store
npx eas build --platform android --profile production

# iOS build
npx eas build --platform ios

# Store submission
npx eas submit --platform android
npx eas submit --platform ios
```

Version numbers are sourced remotely (`"appVersionSource": "remote"`), so `autoIncrement` bumps the build number on EAS rather than in `app.json`.

Android release builds enable ProGuard, resource shrinking, and minification via `expo-build-properties`.

---

## Project structure

```
.
├── app.json                 Expo configuration (name, icons, permissions, plugins)
├── eas.json                 EAS build/submit profiles
├── package.json             Dependencies and scripts
├── tsconfig.json            Strict TS + path aliases
├── assets/
│   ├── fonts/               Inter, Montserrat, Open Sans
│   ├── images/              Icons, splash, static illustrations
│   └── lottie/              Success, notification, empty-state animations
└── src/
    ├── app/                 expo-router routes
    │   ├── (auth)/          login, password login, register
    │   ├── (protected)/     farms, sprays, tools, wallet, eCom, account
    │   ├── tabs/            home, chaupal, explore, profile
    │   └── weather/         current, forecast, disaster alerts
    ├── components/
    │   ├── basic/           Design-system primitives and feature UI
    │   └── layout/          Header, back button, tab bar
    ├── hooks/               One hook per domain (data + side effects)
    ├── slices/              Redux slices
    ├── models/              API and domain types
    ├── constants/           Axios client, app constants, theme tokens
    ├── locales/             Translation namespaces per language
    └── utils/               i18n bootstrap, helpers, static state/district data
```

---

## Architecture notes

### Routing and access control

- Route groups map to access tiers: `(auth)` for public sign-in screens, `tabs` for the main shell, `(protected)` for screens that require a session.
- `app/_layout.tsx` mounts the Redux `Provider`, `PersistGate`, fonts, global toast/loader, and the `Stack`.
- `app/(protected)/_layout.tsx` redirects to `/(auth)/login` when `!isLoggedIn`.
- Onboarding is gated with `<Stack.Protected guard={!hasOnboarded}>`; `app/index.tsx` decides between `/landing` and `/tabs/home`.
- Home, Explore, and the Chaupal feed are browsable without an account; posting, liking, and every `(protected)` screen require login.

### Data layer

- A single Axios instance in `src/constants/api.ts` (`baseURL` from `appConstant.ts`, 30 s timeout).
- `app/_layout.tsx` injects `x-api-key` and `Authorization: Bearer <token>` and logs the user out when a response body contains `statuscode == 401`.
- Domain hooks (`useFarms`, `useWeatherData`, `useSprayRequests`, `useMandiBhaav`, …) own fetching and error handling.
- Redux holds durable state only: session/user, weather report, spray request list, liked posts, orders, toast, global processing flag, language, theme.
- **Response contracts are not uniform.** Some endpoints signal success with `statuscode == '200'`, others with `status === 'success'`; error text appears as `msg` in most places and `message` in a few. Check the specific hook before adding a new call.

### UI system

- `constants/theme.ts` defines light and dark palettes (brand green `#255F38`).
- `hooks/use-theme.ts` returns the active palette; `useGlobalStyle` holds shared spacing/layout styles.
- Primitives: `ThemeText`, `ThemeButton`, `ThemeInput`, `SelectInput`, `DateInput`, `NumberCounter`, `BottomSheet`, `Skeleton`, `EmptyData`, `LoadingList`, `Header`, `TabsLayout`.
- Screens compose `ScreenView` + `Header` + content, and use `lazy`/`Suspense` for heavy sections.

---

## Internationalisation

- Translation files live in `src/locales/<language>/<namespace>.json`, aggregated by `src/locales/<code>.ts`.
- Seven locales are registered in `src/utils/i18n.ts`: `en, hi, pa, gu, mr, te, ta`.
- The device locale is used on first launch; the user's selection is stored in AsyncStorage (`user-language`) and Redux (`appSlice.language`).

**To add a language:**

1. Create `src/locales/<code>/` with copies of every namespace, translated.
2. Add `src/locales/<code>.ts` that merges the namespaces.
3. Register the language in `src/utils/i18n.ts` and in `hooks/useLanguage.ts` (label + value).
4. If the language should reach external content, extend the language maps in `hooks/use-agriNews.ts` and the weather request.

**Coverage note:** mandi rates, support, about, permissions, update check, and several error toasts are still hardcoded in English.

---

## API and third-party integrations

| Integration             | Used for                                                           | Notes                                           |
| ----------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `api.d2f.co.in`         | Auth, farms, sprays, community, commerce, AgriCoins, version check | Bearer token + `x-api-key`                      |
| WeatherAPI.com          | Current weather, forecast, alerts                                  | Called directly from the device                 |
| data.gov.in (Agmarknet) | Mandi prices                                                       | Direct call, 100-record limit, no pagination    |
| Google News RSS         | Agriculture news                                                   | Parsed client-side with `fast-xml-parser`       |
| Fyllo                   | IoT/advisory portal                                                | Opened in a WebView with a 24-hour token cache  |
| Google Maps             | Android map tiles                                                  | Key declared in `app.json`                      |
| Expo Push               | Notifications                                                      | Token registered via `POST /api/save-fcm-token` |

The full endpoint table (method, path, purpose) is in section 7 of the feature overview document.

---

## Troubleshooting

| Symptom                                       | Cause and fix                                                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `EXPO_PUBLIC_API_KEY is not set` in logs      | Missing `.env`; add the variable and restart Metro with `npx expo start --clear`                                         |
| EAS build fails during prebuild               | `google-services.json` / `GoogleService-Info.plist` missing from the project root                                        |
| `npm run reset-project` fails                 | The script file does not exist in this repository; ignore or remove the script entry                                     |
| App opens in Expo Go and native modules crash | Use a development build — Expo Go cannot load `react-native-compressor`, `react-native-maps`, `react-native-permissions` |
| Onboarding appears after every logout         | `logout()` calls `AsyncStorage.clear()`, which also clears `hasOnboarded`                                                |
| Maps blank on Android                         | Google Maps key missing, restricted incorrectly, or the package/SHA-1 does not match                                     |
| Weather or mandi screen empty                 | Third-party key rejected or rate-limited; check the provider console                                                     |
| Stale bundle after pulling changes            | `npx expo start --clear` and rebuild the development client                                                              |

---

## Contributing conventions

- Keep route files thin: screens compose UI, hooks own data access, and API calls never live in components.
- Add new endpoints through a domain hook rather than calling `API` directly from a screen.
- Put all user-facing strings in `src/locales/**` (do not add new hardcoded English).
- Use theme tokens instead of literal colours.
- Every new route needs to be registered in its `_layout.tsx` and reachable through a defined entry point.
- Run `npm run lint` and a TypeScript check (`npx tsc --noEmit`) before opening a pull request.
- Do not commit build artifacts (`*.apk`, `*.aab`, `*.ipa`), `.env`, log files, or `.DS_Store`.

---

## License

The `LICENSE` file in this repository is the default Expo template license (MIT, © 650 Industries, Inc.). It has not been replaced with the product owner's license — update it before distributing the app or making the repository public.
