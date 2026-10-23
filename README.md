# 🧭 Cybercore Control Plane

The local-first governance and publishing surface for Cybercore themes, packs, components, effects, assets, site profiles, validation, and Web Kit releases.

## ✨ Live site

Visit the [Cybercore Control Plane Pages site](https://cybercoretech.github.io/cybercore-control-plane/) for the architecture, theme matrix, installation paths, pack model, and extension guide.

## ✨ What belongs here

This repository contains the public documentation and showcase surface for the Control Plane. The implementation contracts live in the [Cybercore framework](https://github.com/cybercoretech/cybercore), browser artifacts in the [Cybercore Web Kit](https://github.com/cybercoretech/cybercore-web-kit), and official installable resources in [Cybercore Packs](https://github.com/cybercoretech/cybercore-packs).

## ✨ Local preview

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. The theme engine uses the shared 254-theme registry and falls back to the embedded Cybercore palette when the registry is unavailable.

## ✨ Pages deployment

Pushes to `main` deploy the static site through `.github/workflows/pages.yml`. The expected public URL is:

```text
https://cybercoretech.github.io/cybercore-control-plane/
```
