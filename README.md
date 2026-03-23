# 3DGS Scrolly Pipeline Template

A template for building scroll‑driven story pages that blend 3D Gaussian Splatting scrollytellings with an interactive viewer. Written to be usable by journalists and editors who want a repeatable workflow in a new immersive way of interactive news telling.

## What This Template Includes

- A scroll‑scrubbed video section for narrative pacing
- An embedded 3DGS viewer section (currently using a SuperSplat export)
- A local development setup using Vite
- Optional conversion tooling to create lighter `.ksplat` files for faster web delivery

---

## Tools You Can Use (Viewer/Export Options)

Pick based on your deadline, audience, and technical comfort.

### Kiriengine
**Best for:** fast, no‑code web sharing.
- Upload images or video in the browser
- Generates a hosted interactive viewer
- Provides an embed snippet for a web page
- Great for quick newsroom demos, but limited customization and no local control

### SuperSplat
**Best for:** high‑quality interactive exports and self‑hosting.
- Exports a complete HTML viewer package
- Outputs a `scene.sog` + `settings.json` bundle
- Ideal when you want to host the viewer yourself

### Story Splat
**Best for:** editorial storytelling with "tour" style navigation.
- Built around step‑based narrative moments
- Usually includes guided camera or annotation steps
- Useful when you want readers to follow a sequence rather than explore freely

### Nerfstudio (3DGS / Splatfacto)
**Best for:** full control and highest‑quality 3DGS output.
- Train from your own image sets
- Export `.ply` and other formats
- Higher setup cost but full ownership of the pipeline

---

## End‑to‑End Pipeline

### 1. Capture

1. Shoot a video walk‑through or take a structured photo set
2. Keep lighting stable and avoid motion blur
3. Aim for overlapping angles of the same scene

### 2. Generate the 3DGS Scene

#### Option A: Nerfstudio (server or local)

```bash
conda create -n nerfstudio-3dgs python=3.10 -y
conda activate nerfstudio-3dgs
pip install nerfstudio
ns-install-cli

ns-process-data images \
  --data data/images \
  --output-dir data/processed

ns-train splatfacto \
  --data data/processed/transforms.json

ns-export gaussian-splat \
  --load-config outputs/<experiment-name>/splatfacto/<timestamp>/config.yml \
  --output-dir exported
```

Output: `.ply`

#### Option B: Kiriengine (web)

1. Upload images or a video
2. Let it process
3. Use the embed code or exported viewer

#### Option C: SuperSplat (web)

1. Upload your data
2. Export the viewer package (`settings.json` + `scene.sog`)
3. Host it in your site

### 3. Optimize for Web

If you export `.ply`, convert it to `.ksplat` to reduce file size and load time.

```bash
node scripts/convert-ksplat.mjs public/model.ply public/model.ksplat 1 5
```

### 4. Build the Story Page

1. Use a scroll‑scrubbed video for the narrative section
2. Place the interactive 3D viewer after the narrative
3. Use clear labels and instructions for the reader

### 5. Run Locally

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4175
```

Then open: `http://127.0.0.1:4175/`

### 6. Publish

```bash
npm run build
```

Deploy the `dist/` folder to your host.

---

## Project‑Specific Notes

- The current 3D viewer is embedded via `public/supersplat.html`
- The SuperSplat export expects these files in `public/`:
  - `scene.sog`
  - `settings.json`
- If those files are missing, the viewer will be blank

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Browser freezes | Scene is too large or dense. Convert `.ply` to `.ksplat` and/or reduce splat density. |
| Viewer is blank | Confirm `scene.sog` + `settings.json` are present in `public/`. |
