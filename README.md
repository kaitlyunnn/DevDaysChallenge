# DevDaysChallenge

One codebase → iOS, Android, and web. Expo + Supabase + Gemini, deployed on Vercel.

## Stack

| Piece | Choice |
| --- | --- |
| App (all 3 platforms) | Expo SDK 57 + Expo Router 5 |
| Web rendering | react-native-web (static export) |
| Backend | Node serverless functions in `/api` |
| Auth + DB | Supabase (Postgres) |
| AI | Gemini via `@google/genai` |
| Hosting | Vercel |

The Gemini key lives only on the server. The app calls `/api/generate` with the
user's Supabase access token; the function verifies it before spending a request.

## Layout

```
app/                 Expo Router — each file is a screen AND a web URL
  _layout.jsx        root layout, wraps everything in SessionProvider
  index.jsx          "/"        Gemini prompt screen (requires auth)
  sign-in.jsx        "/sign-in" email + password
lib/
  supabase.js        platform-aware client (AsyncStorage on native)
  api.js             fetch wrapper, attaches auth token
  auth.jsx           SessionProvider / useSession
  theme.js           shared StyleSheet
api/                 Vercel Node functions (.mjs = ES modules)
  _lib/              supabase admin + getUser, gemini client, CORS
  generate.mjs       POST — auth'd Gemini call, logs to Postgres
  me.mjs             GET  — current user
  health.mjs         GET  — env sanity check
supabase/schema.sql  messages table + RLS policies
```

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npx expo start
```

Then pick a target from the terminal:

- **`w`** — opens the website in your browser
- **Scan the QR code** with [Expo Go](https://expo.dev/go) on your phone — the app
  runs on the device, no Xcode or Android Studio needed
- **`i`** / **`a`** — simulator, if you have one installed

## Environment variables

Anything prefixed `EXPO_PUBLIC_` is **bundled into the app** and readable by
anyone who installs it. Never put a secret behind that prefix.

| Variable | Where | Public? |
| --- | --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | app | yes |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | app | yes — RLS is what protects data |
| `EXPO_PUBLIC_API_URL` | app | yes — absolute `/api` base for native |
| `SUPABASE_URL` | `/api` | no |
| `SUPABASE_SECRET_KEY` | `/api` | **no — bypasses RLS** |
| `GEMINI_API_KEY` | `/api` | **no** |

`EXPO_PUBLIC_API_URL` is only needed on phones. A phone has no origin to resolve
`/api/generate` against, so it needs the full `https://…vercel.app` URL. On web
it stays blank and requests are same-origin.

## Deploy

Push to `main` — Vercel builds `npx expo export --platform web` into `dist/` and
picks up `api/*.mjs` as functions automatically (see `vercel.json`).

Add all six variables under Settings → Environment Variables, then redeploy.

In Supabase → Authentication → URL Configuration, add your Vercel domain plus
`devdays://` to the redirect allow-list so email confirmation works on both web
and device.

## Adding a screen

Drop a file in `app/`. `app/history.jsx` becomes the `/history` route on web and
a pushable screen on native:

```jsx
import { Text, View } from 'react-native'
import { shared } from '../lib/theme'

export default function History() {
  return (
    <View style={shared.container}>
      <Text style={shared.title}>History</Text>
    </View>
  )
}
```

## Gotchas

- No HTML tags, no CSS files, no `className`. Use `View`/`Text`/`Pressable` and
  `StyleSheet`. A bare string must be inside `<Text>`.
- Changing `app.json` or installing a native module requires restarting
  `expo start` — Metro caches the config.
- Free Supabase projects pause after ~7 days idle. If `/api` starts 500ing, check
  the dashboard.
