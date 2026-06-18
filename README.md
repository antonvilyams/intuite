# Intuite

Model agency website for Intuite. Static site hosted on [GitHub Pages](https://pages.github.com/).

## Structure

```
├── index.html          # Home — logo and model gallery
├── model.html          # Model page (placeholder)
├── models.json         # Model data
├── css/styles.css
├── js/app.js
├── js/model.js
├── images/
│   ├── logo@3x.png     # Logo (@3x, 504×168 px → displayed at 168×56)
│   └── models/         # Model photos
```

## Logo

Place `images/logo@3x.png` at **504×168 px** (3× the on-screen size of 168×56). The site will automatically use the PNG instead of the SVG placeholder.

## Adding a model

1. Add the photo to `images/models/` (recommended format: vertical, ~3:4).
2. Add an entry to `models.json`:

```json
{
  "id": "6",
  "name": "Model Name",
  "photo_url": "images/models/photo.jpg"
}
```

3. Commit and push — the model will appear on the site after deploy.

## GitHub Pages

1. In repository settings: **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` / `/ (root)`
4. Site will be available at `https://<username>.github.io/intuite/`

## Local development

A local server is required for testing (do not open `index.html` via `file://`):

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).
