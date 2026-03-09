# ZigMap26 — Modular Architecture

## Overview

ZigMap26 is a complete modularization of the original ZigzagEmitter application. The monolithic HTML file has been transformed into a modern ES6 module-based architecture with proper separation of concerns.

## Project Structure

```
ZigMap26/
├── index.html                    # Main HTML entry point
├── css/                          # Stylesheets
│   ├── main.css                  # Base styles and layout
│   ├── canvas.css                # Canvas rendering styles
│   └── controls.css              # UI control panel styles
├── js/
│   ├── main.js                   # Application orchestrator
│   ├── config/                   # Configuration modules
│   │   ├── defaults.js           # DEFAULT_PARAMS export
│   │   └── constants.js          # Application constants
│   ├── core/                     # Core rendering classes
│   │   ├── ZigzagLine.js         # Single zigzag ribbon object
│   │   ├── Emitter.js            # Line emission and lifecycle
│   │   ├── Camera.js             # Camera state management
│   │   ├── utils.js              # Shared utility functions
│   │   └── Projection.js         # 3D-to-2D projection math
│   ├── storage/                  # Persistence
│   │   └── localStorage.js       # Settings save/load
│   ├── rendering/                # p5.js integration
│   │   └── SketchFactory.js      # p5 sketch creation
│   ├── export/                   # Export functionality
│   │   ├── SVGExporter.js        # Vector graphic export
│   │   ├── PNGExporter.js        # Raster image export
│   │   ├── DepthExporter.js      # Depth map export
│   │   └── VideoRecorder.js      # CCapture.js integration
│   ├── ui/                       # User interface
│   │   └── UIController.js       # Control binding
│   └── input/                    # Input handling
│       ├── KeyboardHandler.js    # Keyboard shortcuts
│       └── MouseHandler.js       # Camera mouse controls
├── config/                       # JSON configurations
│   ├── keyboardShortcuts.json    # Centralized shortcuts
│   ├── uiPresets.json            # Framebuffer/color presets
│   └── appInfo.json              # Application metadata
├── docs/                         # Documentation
│   ├── User-Manual.md            # User guide (EN)
│   ├── User-Manual-fr.md         # User guide (FR)
│   ├── Documentation.md          # Technical docs (EN)
│   ├── Documentation-fr.md       # Technical docs (FR)
│   ├── Projection-Matrix-Guide.md      # Math guide (EN)
│   ├── Projection-Matrix-Guide-fr.md   # Math guide (FR)
│   └── markdown-viewer.html      # Documentation viewer
└── backup/                       # Original files
    └── ZigzagEmitter_12_backup_20260309.html
```

## Architecture Principles

### 1. **Separation of Concerns**
- **CSS Modules**: Styling separated into thematic files (main, canvas, controls)
- **JavaScript Modules**: Code organized by function (core, rendering, export, UI, input)
- **JSON Configs**: External configuration for keyboard shortcuts, presets, metadata

### 2. **Dependency Injection**
Core classes accept dependencies as parameters rather than using global variables:
```javascript
const line = new ZigzagLine(
  canvasWidth,
  canvasHeight,
  getSpawnDistanceFn,
  buildRibbonSidesFn
);
```

### 3. **ES6 Module System**
All JavaScript uses modern module syntax:
```javascript
import { ZigzagLine } from './core/ZigzagLine.js';
export function exportSVG(ZM) { /* ... */ }
```

### 4. **Global Namespace**
A single `window.ZigMap26` object provides organized global access:
```javascript
window.ZigMap26 = {
  params,        // Application parameters
  camera,        // Camera state
  emitterInstance, // Main emitter reference
  exportSVG(),   // Export functions
  // ...
};
```

## Running the Application

### Development Server
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

### File Server Requirements
ES6 modules require a web server (not `file://` protocol). Any HTTP server works:
- Python: `python3 -m http.server`
- Node.js: `npx http-server`
- VS Code: Live Server extension

## Key Features

### Core Rendering
- **WebGL 3D**: p5.js WEBGL renderer with camera controls
- **Zigzag Ribbons**: Procedurally generated zigzag geometry
- **Modulation**: Random thickness and speed variations
- **Stereoscopic Mode**: VR-ready dual-canvas rendering

### Export Capabilities
- **PNG**: Direct canvas export
- **SVG**: Vector export with exact projection math
- **Depth Map**: CPU-based depth rendering with auto-ranging
- **Video**: CCapture.js integration (WebM/MP4)

### Settings Persistence
- **localStorage**: Auto-save all parameters
- **JSON Export/Import**: Share configurations as files
- **Validation**: Critical parameter bounds checking

### Input Handling
- **Keyboard Shortcuts**: 20+ configurable shortcuts
- **Mouse Controls**: 
  - Left-drag: Rotate camera
  - Right-drag: Pan view
  - Scroll: Zoom
- **Framebuffer Mode**: Fixed resolution rendering

## Configuration Files

### `config/keyboardShortcuts.json`
Centralized keyboard shortcut definitions:
```json
[
  {
    "key": "p",
    "action": "exportPNG",
    "description": "Export PNG",
    "preventDefault": true
  }
]
```

### `config/uiPresets.json`
Framebuffer presets and color swatches:
```json
{
  "framebufferPresets": [
    { "name": "1920x1080", "width": 1920, "height": 1080 }
  ],
  "colorSwatches": [
    [255, 255, 255],
    [80, 200, 255]
  ]
}
```

### `config/appInfo.json`
Application metadata and documentation links:
```json
{
  "name": "ZigMap26",
  "version": "1.0.0",
  "documentation": { ... }
}
```

## Module Details

### Core Classes

#### `ZigzagLine`
```javascript
class ZigzagLine {
  constructor(canvasWidth, canvasHeight, getSpawnDistanceFn, buildRibbonSidesFn)
  update(dt)
  draw(p5Instance)
  _alpha()  // Fade in/out
  _buildVertices()  // Generate zigzag points
}
```

#### `Emitter`
```javascript
class Emitter {
  constructor(params, noiseOffsetGetter, canvasWidth, canvasHeight, utilFns)
  update(dt)
  draw(p5Instance)
  _emit()  // Create new line
}
```

#### `Camera`
```javascript
class Camera {
  constructor(params)
  syncToParams(params)
  reset()
  resetZoom()
}
```

### Projection System

The projection system uses identical mathematics for all exports (SVG, PNG, depth) to ensure pixel-perfect alignment:

1. **Rotation Order**: Z → Y → X (matches p5.js WEBGL)
2. **Camera Model**: `total_distance = default_camera_z + user_distance`
3. **Perspective**: `screen_x = world_x * (camera_z / -view_z) + width/2`

See [docs/Projection-Matrix-Guide.md](docs/Projection-Matrix-Guide.md) for detailed mathematics.

## Migration from Original

The original `ZigzagEmitter_12.html` (2,334 lines) has been split into:
- 1 HTML file (330 lines)
- 3 CSS files (total ~400 lines)
- 15 JavaScript modules (total ~1,500 lines)
- 3 JSON config files (total ~200 lines)

### Breaking Changes
- None for users (localStorage keys preserved)
- Developers must use HTTP server (not `file://`)

### Preserved Features
- All original functionality maintained
- Settings auto-load from localStorage
- Keyboard shortcuts unchanged
- Export formats identical

## Development

### Adding New Features

#### New Export Format
1. Create `js/export/NewExporter.js`
2. Export a function: `export function exportNew(ZM) { ... }`
3. Import in `main.js` and add to `window.ZigMap26`
4. Wire to UI button in `UIController.js`

#### New Parameter
1. Add to `js/config/defaults.js` in `DEFAULT_PARAMS`
2. Add UI control in `index.html`
3. Wire slider/checkbox in `UIController.js`
4. Use via `ZM.params.newParameter`

#### New Keyboard Shortcut
1. Add entry to `config/keyboardShortcuts.json`
2. Add action handler in `KeyboardHandler.js::executeAction()`

## Browser Compatibility

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (ES6 modules)
- **Mobile**: ⚠️ Limited (no right-click for pan)

## Dependencies

- **p5.js 1.9.0**: 3D rendering engine
- **CCapture.js 1.1.0**: Video recording
- Both loaded via CDN in `index.html`

## License

Same as original project.

## Contributing

When adding new modules:
1. Use ES6 `import`/`export` syntax
2. Pass dependencies via parameters (no globals except `window.ZigMap26`)
3. Follow camelCase naming convention
4. Document complex functions with JSDoc comments
5. Test with HTTP server before committing

## Credits

**Original Monolithic Version**: ZigzagEmitter v1-12  
**Modular Architecture**: ZigMap26 v1.0  
**Refactoring Date**: March 9, 2026
