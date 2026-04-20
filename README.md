# 3DGS Scrolly Pipeline Template

A template for building scroll‑driven story pages that blend 3D Gaussian Splatting scrollytellings with an interactive viewer. Written to be usable by journalists and editors who want a repeatable workflow in a new immersive way of interactive news telling.

## What This Template Includes

- A scrollable video section for narrative pacing
- Two embedded 3DGS viewer sections (currently using a SuperSplat .html export) that give the user the ability to navigate through the scene via keyboards
- A local development setup using Vite

---

## Tools You Can Use (Viewer/Export Options)

Pick based on your deadline, audience, and technical comfort.

### [Kiriengine](https://kiriengine.app)
**Best for:** fast, no‑code web sharing.
- Upload images or video in the browser
- Generates a hosted interactive viewer
- Provides an embed component for a web page
- Great for quick newsroom demos, but limited customization and no local control

### [SuperSplat](https://supersplat.app)
**Best for:** high‑quality interactive exports that allow keyboard navigation/exploration.
- Exports a complete HTML viewer package
- Ideal when you want to host the viewer yourself

### [Story Splat](https://storysplat.com)
**Best for:** editorial storytelling with "tour" style navigation.
- Built around step‑based narrative moments
- Usually includes guided camera or annotation steps
- Useful when you want readers to follow a sequence rather than explore freely

### [Nerfstudio-Splatfacto](https://docs.nerf.studio)
**Best for:** full control and highest‑quality 3DGS output.
- Train from your own image sets
- Export `.ply` and MP4 video with customized camera path
- Higher setup cost but full ownership of the pipeline

---

## End‑to‑End Pipeline

### 1. Capture and Gather Data

1. Shoot a video walk‑through or take a structured photo set
2. Keep lighting stable and avoid motion blur
3. Aim for overlapping angles of the same scene
4. Vides or Photos should be taken from various distance and angles

### 2. Generate the 3DGS Scene

Use one of the four workflows depending on your setup.

#### Option A: Server Workflow (Nerfstudio + Conda)

SSH into the server, move to the working directory, and place input images in `data/images/`.
```bash
ssh <user>@<server>
cd <working-directory>
conda create -n nerfstudio-3dgs python=3.10 -y
conda activate nerfstudio-3dgs
pip install nerfstudio
ns-install-cli
```

Process the images with COLMAP through Nerfstudio:
```bash
ns-process-data images \
  --data data/images \
  --output-dir data/processed
```

Train with `splatfacto`:
```bash
ns-train splatfacto \
  --data data/processed/transforms.json
```

**Adding keyframes and exporting to MP4:**

1. After training completes, the Nerfstudio viewer opens in your browser
2. Navigate to the camera angle you want
3. Click **Add keyframe** in the top-right corner of the viewer
4. Repeat for each shot in your sequence
5. Once all keyframes are set, click **Export to MP4** in the viewer to render your camera path

To export the `.ply` instead:
```bash
ns-export gaussian-splat \
  --load-config outputs/<experiment-name>/splatfacto/<timestamp>/config.yml \
  --output-dir exported
```

> Replace `<experiment-name>` and `<timestamp>` with your actual run path.


#### Option B: Kiriengine (web, no setup required)

Open the [Kiriengine web app](https://kiriengine.app):

1. Click **Upload** in the top left
2. Click **3DGS**
3. Upload images or video
4. Wait for the run to finish
5. Export the result or use the **`</>` embed** option

> Note: the embed option is for viewing and sharing only — it does not support adding keyframes.


### 3. Build the Story Page

1. Use a scroll‑scrubbed video for the narrative section
2. Place the interactive 3D viewer after the narrative
3. Use clear labels and instructions for the reader

### 4. Run Locally
```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4175
```

Then open: `http://127.0.0.1:4175/`

### 5. Publish
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
| Keyframe export is blank | Make sure training finished fully before adding keyframes — a partially trained model will produce a blurry or empty render. |
