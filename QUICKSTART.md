# ZigMap26 — Quick Start Guide

## 🚀 Running the Application

### Method 1: Python Server (Recommended)
```bash
cd "/Users/ddelcourt/Documents/Area Zero Base/Works/Clients/Mapping 2026/SpaceGenZigMap"
python3 -m http.server 8080
```
Then open: **http://localhost:8080**

### Method 2: Node.js Server
```bash
npx http-server -p 8080
```

### Method 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

⚠️ **Important**: ES6 modules require a web server. Opening `index.html` directly with `file://` protocol will not work.

## 📁 Project Structure

```
ZigMap26/
├── index.html           # Start here
├── css/                 # 3 CSS modules
├── js/                  # 15 JavaScript modules
│   ├── main.js          # Application entry point
│   ├── config/          # Defaults & constants
│   ├── core/            # Core rendering classes
│   ├── storage/         # localStorage integration
│   ├── rendering/       # p5.js sketches
│   ├── export/          # Export functions (SVG, PNG, depth, video)
│   ├── ui/              # UI control bindings
│   └── input/           # Keyboard & mouse handlers
├── config/              # 3 JSON configuration files
├── docs/                # Documentation (6 markdown files)
└── backup/              # Original monolithic file

Total: 25 modular files (from 1 monolithic 2,334-line HTML file)
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** / **h** | Toggle control panel |
| **Enter** / **f** | Fullscreen |
| **p** | Export PNG |
| **s** | Export SVG |
| **Cmd/Ctrl+S** | Save settings JSON |
| **d** | Export depth map |
| **v** | Start/stop video recording |
| **r** | Reset camera |
| **0** | Reset zoom |
| **t** | Toggle random thickness |
| **m** | Toggle random speed |
| **3** | Toggle stereoscopic mode |
| **b** | Toggle framebuffer mode |

Full list: See `config/keyboardShortcuts.json`

## 🖱️ Mouse Controls

- **Left-drag**: Rotate camera
- **Right-drag**: Pan view
- **Scroll wheel**: Zoom in/out

## 🎨 Key Features

### Rendering
- Real-time 3D zigzag ribbons with p5.js WEBGL
- Stereoscopic VR mode (side-by-side dual cameras)
- Framebuffer mode (fixed resolution rendering)
- Random modulation (thickness & speed)

### Export Options
1. **PNG** — Direct canvas raster export
2. **SVG** — Vector graphic with exact projection
3. **Depth Map** — Grayscale depth encoding
4. **Video** — CCapture.js recording (WebM/MP4)

### Settings
- Auto-save to localStorage
- Export/import as JSON files
- 50+ parameters (geometry, camera, modulation, colors)

## 🛠️ Development

### File Organization
- **CSS**: `css/main.css`, `css/canvas.css`, `css/controls.css`
- **Config**: `config/*.json` for keyboard shortcuts, presets, metadata
- **Core Logic**: `js/core/` for ZigzagLine, Emitter, Camera
- **Features**: Separate modules for export, UI, input handling

### Module System
All JavaScript uses ES6 modules:
```javascript
import { ZigzagLine } from './core/ZigzagLine.js';
export function exportSVG(ZM) { /* ... */ }
```

Global namespace: `window.ZigMap26`

### Adding Features

**New export format:**
1. Create `js/export/NewExporter.js`
2. Add function to `main.js`
3. Wire UI button in `UIController.js`

**New parameter:**
1. Add to `js/config/defaults.js`
2. Add HTML control in `index.html`
3. Wire in `UIController.js`

**New keyboard shortcut:**
1. Add to `config/keyboardShortcuts.json`
2. Add action in `KeyboardHandler.js`

## 📚 Documentation

- **User Manual**: [docs/User-Manual.md](docs/User-Manual.md)
- **Technical Docs**: [docs/Documentation.md](docs/Documentation.md)
- **Projection Guide**: [docs/Projection-Matrix-Guide.md](docs/Projection-Matrix-Guide.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)

All docs available in English & French.

## ✅ Testing Checklist

Before committing changes:

1. ✅ Application loads without console errors
2. ✅ Canvas renders zigzag ribbons
3. ✅ Mouse controls work (drag, pan, zoom)
4. ✅ Keyboard shortcuts respond
5. ✅ All exports work (PNG, SVG, depth, video)
6. ✅ Settings save/load correctly
7. ✅ Stereo mode renders two canvases
8. ✅ Framebuffer mode changes resolution

## 🐛 Troubleshooting

### "Module not found" errors
- Verify you're using an HTTP server (not `file://`)
- Check all module paths use `.js` extension

### "Cannot read property of undefined"
- Check browser console for specific module
- Verify all imports in `main.js` are correct

### Canvas not rendering
- Check p5.js loaded (CDN accessible)
- Verify `initializeSketches()` called in `main.js`

### Exports not working
- PNG: Check canvas exists (`ZM.p5Instance.canvas`)
- SVG: Check emitter has lines (`ZM.emitterInstance.lines`)
- Video: Check CCapture.js loaded from CDN

## 🔗 External Dependencies

- **p5.js 1.9.0**: https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js
- **CCapture.js 1.1.0**: https://cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.all.min.js

Both loaded via CDN in `index.html`.

## 📦 Backup

Original monolithic version preserved:
- `backup/ZigzagEmitter_12_backup_20260309.html`

## 🎯 Next Steps

1. Start server: `python3 -m http.server 8080`
2. Open: http://localhost:8080
3. Test all features
4. Read [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive
5. Start building! 🚀

---

**Version**: ZigMap26 v1.0  
**Migration Date**: March 9, 2026  
**Original**: ZigzagEmitter v12 (2,334 lines → 25 modular files)
