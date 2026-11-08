# 🧭 Cybercore Control Plane

The local-first governance and publishing surface for Cybercore themes, packs, components, effects, assets, site profiles, validation, and Web Kit releases.

## ✨ Live site

Visit the [Cybercore Control Plane Pages site](https://cybercore-control-plane.pages.dev/) for the architecture, theme matrix, installation paths, pack model, and extension guide.

## ✨ What belongs here

This repository contains the public documentation and showcase surface for the Control Plane. The implementation contracts live in the [Cybercore framework](https://github.com/cybercoretech/cybercore), browser artifacts in the [Cybercore Web Kit](https://github.com/cybercoretech/cybercore-web-kit), and official installable resources in [Cybercore Packs](https://github.com/cybercoretech/cybercore-packs).

## ✨ Download and install

The Control Plane is a static browser application. The simplest installation is
to open the hosted [Control Plane](https://cybercore-control-plane.pages.dev/)
and bookmark it—no package manager or local runtime is required.

For a local copy, clone the repository and serve it from the repository root:

```bash
git clone https://github.com/cybercoretech/cybercore-control-plane.git
cd cybercore-control-plane
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. The page loads the canonical registry live: 50 families × 12 source themes plus the 12
signature mashups, 612 themes total today. Counts are never hardcoded.

The Rust checker, Web Kit, and pack registry are companion distribution paths;
they are optional and are not required to use the Control Plane.

## ✨ Local preview

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. The theme engine uses the shared live theme
registry and falls back to the embedded Cybercore palette when the registry is
unavailable.

## ✨ Pages deployment

Pushes to `main` run `.github/workflows/pages.yml`, which bundles the site once and
deploys the same bundle to Cloudflare Pages (primary) and then GitHub Pages (exact
mirror). The mirror only deploys after Cloudflare succeeds, so it never drifts.
The workflow needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

Primary URL:

```text
https://cybercore-control-plane.pages.dev/
```

The pack CLI currently exposes these installable registry IDs:

```text
cybercore.themes@1.0.0
cybercore.effects@1.0.0
cybercore.components@1.0.0
cybercore.cyberdark-wallpapers@1.0.0
cybercore.snippets@1.0.0
cybercore.fonts@1.0.0
cybercore.svg-assets@1.0.0
cybercore.web-templates@1.0.0
```
