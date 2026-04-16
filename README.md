# Portfolio — Yahia

Personal portfolio built with **Next.js** (App Router, static export). Bilingual **English** (`/`) and **Arabic** (`/ar`) with RTL, plus light/dark theme.

Live site: [iYahya.github.io](https://iYahya.github.io/)

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000 — English at /, Arabic at /ar
npm run build    # static export → out/
npm run start    # serve production build (after next build without export, optional)
```

For GitHub Pages, deploy the **`out/`** directory (see below).

## Project layout

```
app/
  layout.tsx      # fonts (next/font), metadata, theme script
  page.tsx        # English home
  ar/page.tsx     # Arabic home
  globals.css     # all styles
components/       # Portfolio, nav, timeline, projects, etc.
hooks/            # useInViewOnce
lib/              # messages + types
messages/         # en.json, ar.json (copy)
public/assets/    # profile.png, og-image.png (CV via email — see Portfolio)
```

## GitHub Pages

`next.config.ts` uses `output: "export"` so `npm run build` produces static files in **`out/`**.

In the repo **Settings → Pages**: set the source to **GitHub Actions**. This repo uses `.github/workflows/nextjs.yml` to upload and deploy the static `out` artifact.

If the site is served from a **project** repo (not `username.github.io`), set `basePath` in `next.config.ts` to `/<repo-name>` and `assetPrefix` accordingly, then rebuild.

## Content

Edit `messages/en.json` and `messages/ar.json`. Replace contact placeholders and add files under `public/assets/`.
