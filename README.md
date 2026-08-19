# Boilerplate

React + Node (Vercel functions) + Supabase + Gemini.

## Stack

| Piece | Choice |
| --- | --- |
| Frontend | React 19 + Vite |
| Backend | Node serverless functions in `/api` |
| Auth + DB | Supabase (Postgres) |
| Hosting | Vercel |
| AI | Gemini via `@google/genai` |

The Gemini key lives only on the server. The browser calls `/api/generate` with
the user's Supabase access token; the function verifies it before doing anything.

## Layout

```
api/                 Node backend (one file = one endpoint)
  _lib/supabase.js   admin client + getUser(req) token check
  _lib/gemini.js     Gemini client
  generate.js        POST — auth'd Gemini call, logs to Postgres
  me.js              GET  — current user
  health.js          GET  — env sanity check
src/
  lib/supabase.js    browser Supabase client
  lib/api.js         fetch wrapper that attaches the auth token
  components/        Auth.jsx, Chat.jsx
supabase/schema.sql  messages table + RLS policies
```

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Supabase** — create a project at [supabase.com](https://supabase.com), then
   run `supabase/schema.sql` in the SQL editor. Grab the URL, anon key, and
   service role key from Project Settings → API.

3. **Gemini** — get a key at [aistudio.google.com](https://aistudio.google.com/apikey).

4. **Env**

   ```bash
   cp .env.example .env.local
   ```

   Fill it in. `VITE_*` vars are public (shipped to the browser); everything else
   is server-only. Never expose `SUPABASE_SERVICE_ROLE_KEY`.

5. **Run** — `vercel dev` serves the React app and `/api` together:

   ```bash
   npm i -g vercel
   npm run dev
   ```

   `npm run dev:web` runs Vite alone, but `/api` calls will 404.

## Deploy

```bash
git init && git add -A && git commit -m "Initial commit"
gh repo create <name> --private --source=. --push
```

Import the repo at [vercel.com/new](https://vercel.com/new). Vite is detected
automatically. Add all five non-`VITE_` vars **and** the two `VITE_` vars under
Settings → Environment Variables, then redeploy.

Finally, in Supabase → Authentication → URL Configuration, add your Vercel domain
to Site URL and Redirect URLs so email confirmation links work.

## Adding an endpoint

Drop a file in `api/`. `api/foo.js` becomes `/api/foo`:

```js
import { getUser } from './_lib/supabase.js'

export default async function handler(req, res) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  res.status(200).json({ hello: user.email })
}
```
