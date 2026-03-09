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


---

# Original Technical Documentation


# Zigzag Emitter - Technical Documentation
ddelcourt2026

**Version 12** - Code Architecture & Implementation Guide

This document provides a comprehensive overview of the codebase structure, architecture patterns, and implementation details for developers who want to understand, modify, or extend the Zigzag Emitter.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [File Structure](#file-structure)
- [Core Concepts](#core-concepts)
- [Data Structures](#data-structures)
- [Class Reference](#class-reference)
- [Function Reference](#function-reference)
- [Rendering Pipeline](#rendering-pipeline)
- [Camera System](#camera-system)
- [Export System](#export-system)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Performance Considerations](#performance-considerations)
- [Extension Guide](#extension-guide)
- [Debugging](#debugging)

---

## Architecture Overview

The Zigzag Emitter follows a **single-file architecture** with clear separation of concerns through code organization and namespacing. The application is structured as follows:

```
┌─────────────────────────────────────────────┐
│           HTML Structure & CSS              │
│  (UI Controls, Layout, Visual Styling)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          JavaScript Application             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │     Global State & Parameters         │ │
│  │  (params, camera, instances)          │ │
│  └───────────────────────────────────────┘ │
│                    ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │      Core Classes                     │ │
│  │  • ZigzagLine                         │ │
│  │  • Emitter                            │ │
│  └───────────────────────────────────────┘ │
│                    ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │      p5.js Sketch Factory             │ │
│  │  (createSketch function)              │ │
│  └───────────────────────────────────────┘ │
│                    ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │      Utility Functions                │ │
│  │  • Geometry helpers                   │ │
│  │  • Export functions                   │ │
│  │  • State persistence                  │ │
│  └───────────────────────────────────────┘ │
│                    ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │      UI Event Handlers                │ │
│  │  • Slider wiring                      │ │
│  │  • Button handlers                    │ │
│  │  • Keyboard shortcuts                 │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Design Patterns

1. **Factory Pattern**: `createSketch()` generates p5.js instances
2. **Observer Pattern**: UI controls update `params` object, triggering automatic persistence
3. **Singleton Pattern**: Single `Emitter` instance shared between stereo views
4. **Module Pattern**: Logical grouping of related functions with clear comments

---

## Technology Stack

### Core Libraries

- **[p5.js](https://p5js.org/) v1.9.0**
  - Creative coding framework
  - Provides WebGL renderer and canvas management
  - Handles drawing, transformations, and perspective projection
  
- **[CCapture.js](https://github.com/spite/ccapture.js/) v1.1.0**
  - Frame-by-frame video capture
  - Deterministic rendering for consistent output
  - WebM and other format support

### Browser APIs

- **Canvas 2D API**: PNG export via `toDataURL()`
- **WebGL**: Hardware-accelerated 3D rendering via p5.js
- **LocalStorage**: Settings persistence
- **File API**: JSON configuration import/export
- **Fullscreen API**: Fullscreen mode toggle

### Language Features

- **ES6+ JavaScript**
  - Classes and constructors
  - Arrow functions
  - Destructuring assignment
  - Template literals
  - Spread operator
  - `const`/`let` block scoping

---

## File Structure

```
ZigzagEmitter_10.html    (Single-file application)
├── <!DOCTYPE html>
├── <head>
│   ├── Meta tags
│   ├── External library imports (p5.js, CCapture.js)
│   └── <style> (CSS)
├── <body>
│   ├── .controls (Left sidebar)
│   │   ├── UI section
│   │   ├── File section
│   │   ├── Camera section
│   │   ├── Geometry section
│   │   ├── Behavior section
│   │   ├── Modulations section
│   │   ├── Colors section
│   │   └── Export section
│   └── #canvas-container
│       └── #canvas-wrapper (Dynamic content)
└── <script>
    ├── Global constants & state
    ├── Helper functions
    ├── ZigzagLine class
    ├── Emitter class
    ├── createSketch factory
    ├── Sketch lifecycle
    ├── State management
    ├── Export functions
    └── UI initialization
```

---

## Core Concepts

### 1. Coordinate Systems

The application uses three coordinate systems:

#### Screen Space
- Origin: Top-left corner
- Units: Pixels
- Range: `[0, W)` × `[0, H)`
- Used for: Mouse input, UI elements

#### Canvas Space
- Origin: Center of canvas
- Units: Pixels
- Range: `[-W/2, W/2)` × `[-H/2, H/2)`
- Used for: 2D geometry generation, spawn boundaries

#### World Space
- Origin: Scene center (after transforms)
- Units: Arbitrary (scaled by `geometryScale`)
- Used for: 3D rendering, camera transforms
- Transformations applied: Translate, rotate, scale

### 2. Rendering Modes

#### Monoscopic (Default)
- Single canvas filling viewport
- Standard perspective rendering
- Dark grey border (1px)

#### Stereoscopic (VR Mode)
- Two side-by-side canvases (left/right eye)
- Each canvas: W/2 width
- Camera offset by `±eyeSeparation/2` along X-axis
- Green borders indicate stereo mode
- Synchronized animation via `sharedLastTime`

#### Framebuffer Mode
- Fixed resolution independent of window size
- Canvas scaled to fit viewport
- Enables pixel-perfect export
- Dark grey border around fixed canvas

### 3. Animation Loop

Frame-by-frame update cycle:

```
1. Clear background (black)
2. Update camera from mouse input
3. Calculate delta time (dt)
4. Update emitter (spawn new lines, move existing)
5. Apply camera transforms (translate, rotate, perspective)
6. Draw all zigzag lines
7. (If recording) Capture frame to video encoder
```

### 4. Geometry Generation

Zigzag patterns are generated as:

1. **Centerline**: Series of points forming zigzag path
2. **Ribbon offset**: Perpendicular offsets create thickness
3. **Miter joins**: Smooth connections at vertices
4. **End caps**: Flat vertical caps at start/end
5. **Mesh construction**: Quad strip from left/right sides

---

## Data Structures

### `params` Object

Central configuration object storing all adjustable parameters.

```javascript
const params = {
  // Geometry
  segmentLength: 120,        // Height of each zigzag segment (px)
  lineThickness: 12,         // Width of ribbon (px)
  lineColor: [255,255,255],  // RGB array
  emitterRotation: 0,        // Z-axis rotation (degrees)
  geometryScale: 100,        // Uniform scale (%)
  
  // Animation
  emitRate: 1.5,             // Lines spawned per second
  speed: 80,                 // Base movement speed (px/s)
  
  // Camera
  fov: 60,                   // Field of view (degrees)
  near: 0.01,                // Near clipping plane
  far: 20000,                // Far clipping plane
  cameraRotationX: -0.3,     // X-axis rotation (radians)
  cameraRotationY: 0,        // Y-axis rotation (radians)
  cameraDistance: 600,       // Distance from origin
  cameraOffsetX: 0,          // Pan offset X
  cameraOffsetY: 0,          // Pan offset Y
  
  // Modulation
  randomThickness: false,    // Enable thickness variation
  randomSpeed: false,        // Enable speed variation
  thicknessRangeMin: 10,     // Min thickness multiplier (%)
  thicknessRangeMax: 200,    // Max thickness multiplier (%)
  speedRangeMin: 50,         // Min speed multiplier (%)
  speedRangeMax: 150,        // Max speed multiplier (%)
  ambientSpeedMaster: 100,   // Global speed multiplier (%)
  
  // Rendering
  stereoscopicMode: false,   // Enable dual-camera stereo
  eyeSeparation: 30,         // Distance between cameras
  framebufferMode: false,    // Lock to fixed resolution
  framebufferPreset: '1920x1080',  // Resolution preset name
  framebufferWidth: 1920,    // Canvas width (px)
  framebufferHeight: 1080,   // Canvas height (px)
  
  // Export
  videoDuration: 10,         // Recording length (seconds)
  videoFPS: 30,              // Recording frame rate
  videoFormat: 'webm'        // Video codec
};
```

### `camera` Object

Camera state independent of `params` to avoid circular updates.

```javascript
const camera = {
  rotationX: -0.3,     // Pitch (radians)
  rotationY: 0,        // Yaw (radians)
  distance: 600,       // Zoom distance
  offsetX: 0,          // Pan X offset
  offsetY: 0,          // Pan Y offset
  isDragging: false,   // Left-click drag active
  isPanning: false,    // Right-click drag active
  lastMouseX: 0,       // Previous mouse X (for delta)
  lastMouseY: 0        // Previous mouse Y (for delta)
};
```

### Constants

```javascript
const SEGMENTS = 16;                // Zigzag vertices per line
const FADE_IN_DURATION = 0.3;       // Seconds for opacity fade-in
const FADE_OUT_DISTANCE = 80;       // Pixels from boundary to start fade-out
const STORAGE_KEY = 'zigzagEmitterSettings';  // LocalStorage key
```

### Global State Variables

```javascript
let W, H;                    // Canvas logical dimensions
let noiseOffset;             // Perlin noise time offset
let p5Instance;              // Primary p5 sketch instance
let p5InstanceRight;         // Secondary (stereo right) instance
let emitterInstance;         // Shared Emitter object
let capturer;                // CCapture instance
let isRecording;             // Recording active flag
let recordingFrameCount;     // Current frame in recording
let recordingTotalFrames;    // Target frame count
let sharedLastTime;          // Synchronized timestamp for stereo
let activeCanvasId;          // Which canvas has camera control
let isUpdatingCanvasSize;    // Prevent recursive resize
```

---

## Class Reference

### `ZigzagLine`

Represents a single animated zigzag ribbon.

#### Constructor

```javascript
constructor({ p, x, y, segmentLength, lineThickness, lineColor, vy })
```

**Parameters:**
- `p` (p5): p5.js instance reference
- `x` (Number): Initial X position (canvas space)
- `y` (Number): Initial Y position (canvas space)
- `segmentLength` (Number): Height of each segment
- `lineThickness` (Number): Ribbon width
- `lineColor` (Array): RGB color `[r, g, b]`
- `vy` (Number): Velocity in Y direction (px/s, negative = upward)

**Properties:**
- `segments` (Number): Always 16
- `step` (Number): Diagonal step distance = `segmentLength / √2`
- `totalWidth` (Number): Total horizontal width = `segments × step`
- `alive` (Boolean): Whether line is still visible
- `age` (Number): Seconds since spawn

#### Methods

##### `_buildVertices()`

Generates centerline points for the zigzag pattern.

**Returns:** `Array<{x, y}>` - Array of 2D points in local space

**Algorithm:**
1. Start at left edge: `x = -totalWidth / 2, y = 0`
2. For each segment:
   - Move right by `step`
   - Alternate moving up/down by `step`
3. Produces horizontal zigzag pattern

##### `update(dt)`

Updates position and checks if line should be culled.

**Parameters:**
- `dt` (Number): Delta time in seconds

**Logic:**
1. Increment age by `dt`
2. Move Y position by `vy × dt`
3. Convert to world space: `worldY = y - H/2`
4. Check if outside spawn boundaries, set `alive = false` if so

##### `_alpha()`

Calculates combined opacity from fade-in and fade-out.

**Returns:** `Number` - Alpha value in range [0, 1]

**Algorithm:**
1. **Fade-in**: `min(age / FADE_IN_DURATION, 1)`
2. **Fade-out**: 
   - Calculate distance to nearest spawn boundary
   - `min(distToBoundary / FADE_OUT_DISTANCE, 1)`
3. Return minimum of fade-in and fade-out

##### `draw(p)`

Renders the zigzag line as a filled shape.

**Parameters:**
- `p` (p5): p5.js instance

**Steps:**
1. Calculate alpha (0-255 range)
2. Build ribbon geometry via `buildRibbonSides()`
3. Push matrix (save transform state)
4. Translate to line's world position
5. Set fill color with alpha
6. Draw shape:
   - Vertex loop for left side
   - Reverse vertex loop for right side
   - Close shape to form polygon
7. Pop matrix (restore transform state)

---

### `Emitter`

Manages spawning and updating all zigzag lines.

#### Constructor

```javascript
constructor({ p, x, y })
```

**Parameters:**
- `p` (p5): p5.js instance reference
- `x` (Number): Spawn position X (canvas space)
- `y` (Number): Spawn position Y (canvas space)

**Properties:**
- `lines` (Array): Collection of `ZigzagLine` instances
- `accumulator` (Number): Time buffer for emission timing

#### Methods

##### `update(dt)`

Updates all lines and spawns new ones based on emit rate.

**Parameters:**
- `dt` (Number): Delta time in seconds

**Algorithm:**
1. Add `dt` to accumulator
2. Calculate effective emit rate: `emitRate × (ambientSpeedMaster / 100)`
3. Calculate spawn interval: `1 / effectiveRate`
4. While accumulator ≥ interval:
   - Subtract interval from accumulator
   - Call `_emit()` to spawn new line
5. Update all existing lines
6. Filter out dead lines (`alive === false`)

##### `_emit()`

Spawns a single new zigzag line.

**Algorithm:**
1. **Thickness calculation:**
   - Start with `params.lineThickness`
   - If `randomThickness` enabled:
     - Sample Perlin noise: `noise(noiseOffset)`
     - Sample sine wave: `sin(noiseOffset × 2)`
     - Blend: `variation = noise × 0.7 + sine × 0.3`
     - Map to range: `[thicknessRangeMin%, thicknessRangeMax%]`
     - Multiply by base thickness

2. **Speed calculation:**
   - Start with `params.speed`
   - If `randomSpeed` enabled:
     - Similar noise + sine blending
     - Map to range: `[speedRangeMin%, speedRangeMax%]`
     - Multiply by base speed
   - Apply ambient master: `speed × ambientSpeedMaster / 100`

3. **Create line:**
   - Instantiate `ZigzagLine` with calculated values
   - Velocity is negative (upward movement)
   - Add to `lines` array

##### `draw(p)`

Renders all lines.

**Parameters:**
- `p` (p5): p5.js instance

**Implementation:**
```javascript
for (const line of this.lines) {
  line.draw(p);
}
```

---

## Function Reference

### Helper Functions

#### `getSpawnDistance()`

Calculates the half-width of the spawn field.

**Returns:** `Number` - Distance in pixels

**Formula:**
```javascript
const step = params.segmentLength / Math.SQRT2;
return (SEGMENTS × step) / 2;
```

**Purpose:** Determines when lines should be culled (bounds checking).

---

#### `buildRibbonSides(points, halfWidth)`

Converts a polyline into offset paths for ribbon rendering.

**Parameters:**
- `points` (Array): Centerline vertices `[{x, y}, ...]`
- `halfWidth` (Number): Half of desired ribbon thickness

**Returns:** `Object` - `{ leftSide: [{x,y}, ...], rightSide: [{x,y}, ...] }`

**Algorithm:**

**For endpoints (first/last):**
- Flat vertical caps
- `leftSide`: `{x: curr.x, y: curr.y + halfWidth}`
- `rightSide`: `{x: curr.x, y: curr.y - halfWidth}`

**For middle points:**
1. Get adjacent segments:
   - Previous: `(prev → curr)`
   - Next: `(curr → next)`
2. Calculate perpendicular vectors (normalized):
   - `perp1 = normalize([-dy1, dx1])`
   - `perp2 = normalize([-dy2, dx2])`
3. Average perpendiculars (miter direction):
   - `perp = normalize((perp1 + perp2) / 2)`
4. Offset point by `perp × halfWidth`

**Purpose:** Used by both canvas renderer and SVG export for consistent geometry.

---

### Sketch Lifecycle

#### `createSketch(parentId, cameraOffset, isPrimary)`

Factory function that returns a p5.js sketch.

**Parameters:**
- `parentId` (String): DOM element ID to attach canvas
- `cameraOffset` (Number): X-axis camera offset for stereo (0 for mono)
- `isPrimary` (Boolean): Whether this is the main sketch (controls emitter updates)

**Returns:** `Function` - p5.js sketch function

**Structure:**

```javascript
return function(p) {
  let emitter;        // Local or shared emitter reference
  let lastTime;       // Frame timing
  
  p.setup = function() { /* ... */ };
  p.draw = function() { /* ... */ };
  p.mouseWheel = function(event) { /* ... */ };
  p.windowResized = function() { /* ... */ };
};
```

##### `p.setup()`

Initialization phase called once.

**Steps:**
1. Set pixel density to 1 (performance)
2. Create WebGL canvas: `createCanvas(W, H, WEBGL)`
3. Attach canvas to parent DOM element
4. Initialize or reference shared emitter
5. Set up mouse event handlers:
   - **contextmenu**: Prevent right-click menu
   - **mousePressed**: Detect left/right click, set camera states
   - **mouseReleased**: Clear dragging/panning flags
6. Apply framebuffer sizing if needed
7. Initialize `lastTime` for delta calculation

**Mouse Events:**

```javascript
cnv.mousePressed((event) => {
  if (p.mouseButton === p.LEFT) {
    camera.isDragging = true;
    camera.isPanning = false;
  } else if (p.mouseButton === p.RIGHT || p.mouseButton === p.CENTER) {
    camera.isPanning = true;
    camera.isDragging = false;
  }
  camera.lastMouseX = p.mouseX;
  camera.lastMouseY = p.mouseY;
  return false;  // Prevent default
});
```

##### `p.draw()`

Main rendering loop called every frame.

**Rendering Steps:**

1. **Clear frame:**
   ```javascript
   p.background(0);  // Black
   ```

2. **Camera controls (if active canvas):**
   - Calculate mouse delta: `dx = mouseX - lastMouseX`
   - If dragging (left button):
     - Update rotation: `rotationY += dx × 0.005`
     - Constrain pitch: `rotationX = constrain(rotationX + dy × 0.005, -π/2, π/2)`
   - If panning (right button):
     - Calculate sensitivity: `sens = max(0.5, distance / 500)`
     - Update offsets: `offsetX += dx × sens`
   - Save to params and localStorage

3. **Set perspective projection:**
   ```javascript
   p.perspective(
     fov × π / 180,           // Field of view (radians)
     W / H,                   // Aspect ratio
     max(0.01, params.near),  // Near clipping plane
     params.far               // Far clipping plane
   );
   ```

4. **Calculate delta time:**
   - **Normal**: `dt = (millis() - lastTime) / 1000`
   - **Recording**: `dt = 1 / fps` (fixed timestep)
   - **Stereo**: Primary calculates, secondary uses 0

5. **Apply camera transform:**
   ```javascript
   p.push();
   if (stereo) p.translate(cameraOffset, 0, 0);  // Eye separation
   p.translate(camera.offsetX, camera.offsetY, 0);  // Pan
   p.translate(0, 0, -camera.distance);             // Zoom
   p.rotateX(camera.rotationX);                     // Pitch
   p.rotateY(camera.rotationY);                     // Yaw
   p.rotateZ(emitterRotation × π / 180);            // Z rotation
   p.scale(geometryScale / 100);                    // Uniform scale
   ```

6. **Update simulation (primary only):**
   ```javascript
   if (!stereoscopicMode || isPrimary) {
     noiseOffset += dt × 4;
     emitter.update(dt);
   }
   ```

7. **Draw emitter:**
   ```javascript
   emitter.draw(p);
   ```

8. **Restore transform:**
   ```javascript
   p.pop();
   ```

##### `p.mouseWheel(event)`

Handles zoom via scroll wheel.

**Parameters:**
- `event` (Object): Mouse wheel event with `delta` property

**Logic:**
1. Check if controls panel should scroll instead
2. Update distance: `distance = clamp(distance + delta × 20, 50, 10000)`
3. Save to params and localStorage
4. Return `false` to prevent page scroll

##### `p.windowResized()`

Handles browser window resize.

**Implementation:**
```javascript
if (!isRecording) {
  updateCanvasSize();
}
```

**Note:** Ignores resize during recording to maintain consistent output.

---

### Initialization Functions

#### `initializeSketches()`

Creates or recreates p5.js instances based on current mode.

**Logic:**

1. **Cleanup:**
   - Remove existing p5 instances
   - Clear canvas wrapper HTML
   - Reset shared state

2. **Calculate dimensions:**
   - **Framebuffer mode**: Use `framebufferWidth/Height`
   - **Stereoscopic**: Each canvas gets `windowWidth / 2`
   - **Monoscopic**: Full `windowWidth`

3. **Stereoscopic setup:**
   - Create stereo container with left/right eye divs
   - Instantiate two p5 sketches:
     - Left: `cameraOffset = -eyeSeparation`
     - Right: `cameraOffset = +eyeSeparation`
   - Share single emitter between both

4. **Monoscopic setup:**
   - Create single canvas div
   - Instantiate one p5 sketch
   - `cameraOffset = 0`

5. **Post-processing:**
   - Call `updateCanvasSize()` for framebuffer mode
   - Slight delay (50ms) to ensure DOM update

---

#### `updateCanvasSize()`

Adjusts canvas resolution and scaling.

**Guards:**
- Skip if no p5 instance
- Skip if already updating (prevent recursion)

**Framebuffer Mode:**
1. Set dimensions to `framebufferWidth/Height`
2. Calculate scale to fit window: `min(windowW / canvasW, windowH / canvasH, 1)`
3. Resize canvas(es) to target resolution
4. Apply CSS scale transform if needed
5. Set wrapper size explicitly
6. Add framebuffer-mode class (dark grey border)

**Window-Fit Mode:**
1. Calculate dimensions:
   - Stereo: `W = windowWidth / 2`
   - Mono: `W = windowWidth`
   - `H = windowHeight`
2. Resize canvas(es) to fit window
3. Remove CSS transforms
4. Set wrapper to 100% size
5. Remove framebuffer-mode class

**Emitter Update:**
- Reposition emitter to canvas center: `(W/2, H/2 + getSpawnDistance())`

---

### State Management

#### `saveToLocalStorage()`

Persists current `params` to browser's localStorage.

**Implementation:**
```javascript
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
} catch(e) {
  console.warn('localStorage save failed:', e);
}
```

**Trigger:** Called after every parameter change.

---

#### `loadFromLocalStorage()`

Loads saved settings from localStorage.

**Returns:** `Boolean` - True if data was loaded

**Logic:**
1. Attempt to retrieve item by key
2. If not found, return false
3. Parse JSON string
4. Merge into `params` via `Object.assign()`
5. Validate and fix problematic values:
   - `near < 0.01` → `0.01`
   - `cameraDistance < 50` → `600`
   - `cameraOffsetX/Y === undefined` → `0`
6. Return true

**Trigger:** Called once on page load.

---

#### `syncUIFromParams()`

Updates all UI controls to match current `params` values.

**Purpose:** Keeps UI in sync when params are loaded from file or localStorage.

**Steps:**

1. **Sliders:** For each slider:
   ```javascript
   slider.value = params[key];
   display.textContent = formatValue(params[key]);
   ```

2. **Checkboxes:**
   ```javascript
   checkbox.checked = params[key];
   ```

3. **Number inputs:**
   ```javascript
   input.value = params[key];
   ```

4. **Dropdowns:**
   ```javascript
   select.value = params[key];
   ```

5. **Button toggles:** Set `active` class based on `params[key]`

6. **Camera state:**
   ```javascript
   camera.rotationX = params.cameraRotationX;
   camera.rotationY = params.cameraRotationY;
   camera.distance = max(50, params.cameraDistance);
   camera.offsetX = params.cameraOffsetX || 0;
   camera.offsetY = params.cameraOffsetY || 0;
   ```

7. **Canvas update:** Call `updateCanvasSize()` if needed

---

#### `wire(sliderId, displayId, paramKey, decimals = 0, suffix = '')`

Binds a slider to a parameter with automatic persistence.

**Parameters:**
- `sliderId` (String): HTML ID of range input
- `displayId` (String): HTML ID of value display span
- `paramKey` (String): Property name in `params` object
- `decimals` (Number): Decimal places for display
- `suffix` (String): Text to append to display value

**Setup:**
1. Get DOM elements
2. Set slider value from params
3. Set display text from params
4. Add input event listener:
   - Update param from slider
   - Update display text
   - Call `saveToLocalStorage()`

**Example:**
```javascript
wire('thickness', 'thickness-val', 'lineThickness', 1);
// Wires thickness slider, displays with 1 decimal place
```

---

### Export Functions

#### `downloadJSON()`

Exports current settings as JSON file.

**Implementation:**
1. Stringify params with indentation: `JSON.stringify(params, null, 2)`
2. Create Blob with type `application/json`
3. Create object URL
4. Create temporary `<a>` element
5. Set download filename with timestamp
6. Trigger click
7. Revoke object URL

**Filename format:** `zigzag-emitter-YYYY-MM-DDTHH-MM-SS.json`

---

#### `loadJSON(file)`

Imports settings from uploaded JSON file.

**Parameters:**
- `file` (File): JavaScript File object from input

**Implementation:**
1. Create FileReader
2. On load:
   - Parse JSON
   - Check if stereoscopic mode changed
   - If mode changed, call `initializeSketches()`
   - Call `syncUIFromParams()`
   - Save to localStorage
3. Read file as text

**Error handling:** Try-catch with alert on parse failure.

---

#### `exportPNG()`

Captures current canvas as PNG image.

**Implementation:**
1. Get active p5 instance's canvas element
2. Call `toDataURL('image/png')`
3. Create temporary `<a>` with data URL as href
4. Set download filename with timestamp
5. Trigger click

**Filename format:** `zigzag-emitter-YYYY-MM-DDTHH-MM-SS.png`

**Resolution:** Matches current canvas pixel dimensions.

---

#### `exportSVG()`

Exports current frame as vector SVG.

**Algorithm:**

1. **Setup:**
   - Get canvas dimensions
   - Calculate spawn distance
   - Create SVG header

2. **For each line in emitter:**
   - Build centerline vertices
   - Calculate alpha (for opacity)
   - Build ribbon sides via `buildRibbonSides()`
   - Generate path string:
     ```javascript
     M x,y L ... L ... Z  // Move, Lines, Close
     ```
   - Create `<path>` element with:
     - Fill color
     - Fill opacity (alpha)
     - No stroke

3. **Export:**
   - Close SVG tag
   - Create Blob of type `image/svg+xml`
   - Download via temporary link

**Benefits:**
- Resolution-independent
- Editable in vector software
- Small file size
- Precise geometry

---

#### `startVideoCapture()`

Begins frame-by-frame video recording.

**Setup:**
1. Calculate total frames: `duration × fps`
2. Configure CCapture:
   ```javascript
   capturer = new CCapture({
     format: params.videoFormat,
     framerate: params.videoFPS,
     verbose: false
   });
   ```
3. Start capture: `capturer.start()`
4. Set recording state flags
5. Update UI (progress bar, button state)

**Recording loop:**
- Frames are captured in `p.draw()` after rendering
- Fixed timestep ensures deterministic output
- Progress indicator updates each frame

---

#### `stopVideoCapture()`

Completes recording and saves file.

**Implementation:**
1. Stop capturer: `capturer.stop()`
2. Save file: `capturer.save()`
3. Reset recording state
4. Restore UI (hide progress, reset button)

**Note:** CCapture handles encoding and download automatically.

---

### UI Initialization

#### Collapsible Sections

**Implementation:**
```javascript
document.querySelectorAll('.section-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const content = header.nextElementSibling;
    content.classList.toggle('expanded');
  });
});
```

**Behavior:** Click section title to expand/collapse controls.

---

#### Keyboard Shortcuts

**v12 Centralized System:**

All keyboard shortcuts are defined in a single configuration array:

```javascript
const KEYBOARD_SHORTCUTS = [
  // UI Navigation
  { key: 'Tab',   action: 'toggleControls',       description: 'Toggle controls panel',          preventDefault: true },
  { key: 'Enter', action: 'toggleFullscreen',     description: 'Toggle fullscreen',              preventDefault: true },
  { key: 'h',     action: 'toggleControls',       description: 'Hide/show controls',             preventDefault: true },
  { key: 'f',     action: 'toggleFullscreen',     description: 'Fullscreen',                     preventDefault: true },
  
  // Export Actions
  { key: 'p',     action: 'exportPNG',            description: 'Export PNG',                     preventDefault: true },
  { key: 'P',     action: 'exportPNG',            description: 'Export PNG (Shift+P)',           preventDefault: true, shift: true },
  { key: 's',     action: 'exportSVG',            description: 'Export SVG',                     preventDefault: true },
  { key: 'S',     action: 'exportSVG',            description: 'Export SVG (Shift+S)',           preventDefault: true, shift: true },
  { key: 'd',     action: 'exportDepthMap',       description: 'Export depth map',               preventDefault: true },
  { key: 'D',     action: 'exportDepthMap',       description: 'Export depth map (Shift+D)',     preventDefault: true, shift: true },
  { key: 'v',     action: 'toggleVideoRecording', description: 'Start/stop recording',          preventDefault: true },
  { key: 'j',     action: 'downloadJSON',         description: 'Save settings JSON (J)',         preventDefault: true },
  { key: 's',     action: 'downloadJSON',         description: 'Save settings JSON (Ctrl+S)',    preventDefault: true, ctrl: true },
  
  // Camera Controls
  { key: 'r',     action: 'resetCamera',          description: 'Reset camera position',          preventDefault: true },
  { key: 'R',     action: 'resetCamera',          description: 'Reset camera (Shift+R)',         preventDefault: true, shift: true },
  { key: '0',     action: 'resetZoom',            description: 'Reset zoom to default',          preventDefault: true },
  
  // Modulation Toggles
  { key: 't',     action: 'toggleRandomThickness', description: 'Toggle random thickness',      preventDefault: true },
  { key: 'm',     action: 'toggleRandomSpeed',     description: 'Toggle random speed',          preventDefault: true },
  
  // View Modes
  { key: '3',     action: 'toggleStereoMode',     description: 'Toggle stereoscopic view',       preventDefault: true },
  { key: 'b',     action: 'toggleFramebuffer',    description: 'Toggle framebuffer mode',        preventDefault: true }
];
```

**Keyboard Event Handler:**

```javascript
document.addEventListener('keydown', e => {
  // Find matching shortcut with modifier key support
  const shortcut = KEYBOARD_SHORTCUTS.find(sc => {
    if (sc.key !== e.key) return false;
    
    // Check modifier keys (default to false if not specified)
    const ctrlMatch = (sc.ctrl || false) === (e.ctrlKey || e.metaKey); // metaKey = Cmd on Mac
    const shiftMatch = (sc.shift || false) === e.shiftKey;
    const altMatch = (sc.alt || false) === e.altKey;
    
    return ctrlMatch && shiftMatch && altMatch;
  });
  
  if (shortcut) {
    if (shortcut.preventDefault) e.preventDefault();
    
    // Call the action function by name
    const actionName = shortcut.action;
    if (typeof window[actionName] === 'function') {
      window[actionName]();
    }
  }
});
```

**Action Functions (Examples):**

```javascript
function toggleControls() {
  document.querySelector('.controls').classList.toggle('hidden');
  document.body.classList.toggle('ui-hidden');
}

function exportPNG() {
  // Delegates to button click handler for consistency
  document.getElementById('export-png')?.click();
}

function resetCamera() {
  camera.rotationX = -0.3;
  camera.rotationY = 0;
  camera.offsetX = 0;
  camera.offsetY = 0;
  params.cameraRotationX = camera.rotationX;
  params.cameraRotationY = camera.rotationY;
  params.cameraOffsetX = camera.offsetX;
  params.cameraOffsetY = camera.offsetY;
  saveToLocalStorage();
}
```

**Benefits:**
- Single source of truth for all shortcuts
- Easy to add/modify/remove shortcuts
- Consistent modifier key handling
- Self-documenting with descriptions
- No duplicate code
- Export functions delegate to button handlers (ensures 3D projection consistency)

---

#### Color Swatches

**Implementation:**
```javascript
swatches.querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    const rgb = sw.dataset.color.split(',').map(Number);
    params.lineColor = rgb;
    swatches.querySelector('.active').classList.remove('active');
    sw.classList.add('active');
    saveToLocalStorage();
  });
});
```

**Trigger:** Click swatch → update `params.lineColor` → save.

---

#### Dual-Range Sliders

Used for Near/Far clipping and thickness/speed ranges.

**Constraint logic:**
```javascript
nearSlider.addEventListener('input', () => {
  if (nearSlider.value >= farSlider.value) {
    nearSlider.value = farSlider.value - 1;
  }
  // Update params & display
});

farSlider.addEventListener('input', () => {
  if (farSlider.value <= nearSlider.value) {
    farSlider.value = nearSlider.value + 1;
  }
  // Update params & display
});
```

**Purpose:** Prevents invalid ranges (min ≥ max).

---

#### FOV with Distance Compensation (v10 Feature)

**Implementation:**
```javascript
fovSlider.addEventListener('input', () => {
  const oldFOV = params.fov;
  const newFOV = parseFloat(fovSlider.value);
  
  // Calculate compensation ratio
  const oldFOVRad = oldFOV * Math.PI / 180;
  const newFOVRad = newFOV * Math.PI / 180;
  const ratio = Math.tan(oldFOVRad / 2) / Math.tan(newFOVRad / 2);
  
  // Apply to distance
  const oldDistance = camera.distance;
  const newDistance = clamp(oldDistance * ratio, 50, 10000);
  
  // Update state
  params.fov = newFOV;
  camera.distance = newDistance;
  params.cameraDistance = newDistance;
  
  // Log for debugging
  console.log(`FOV: ${oldFOV}° → ${newFOV}°, Distance: ${oldDistance} → ${newDistance}`);
  
  saveToLocalStorage();
});
```

**Theory:**
For constant apparent size:
```
newDistance = oldDistance × tan(oldFOV/2) / tan(newFOV/2)
```

**Effect:**
- Wider FOV → closer camera (maintains size)
- Narrower FOV → farther camera (maintains size)
- Only perspective distortion changes

---

## Rendering Pipeline

### Frame Rendering Sequence

```
┌─────────────────────────────────────┐
│  1. p.background(0)                 │
│     Clear canvas to black           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Update camera from mouse        │
│     - Rotation (left drag)          │
│     - Pan (right drag)              │
│     - Zoom (wheel)                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. Set projection matrix           │
│     p.perspective(fov, aspect, ...)│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  4. Calculate delta time            │
│     dt = (now - lastTime) / 1000    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  5. Push matrix (save state)        │
│     p.push()                        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  6. Apply camera transforms         │
│     - Stereo offset (if enabled)    │
│     - Pan offset                    │
│     - Zoom (translate Z)            │
│     - Orbit rotation (X, Y)         │
│     - Z-plane rotation              │
│     - Geometry scale                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  7. Update simulation (primary)     │
│     - noiseOffset += dt × 4         │
│     - emitter.update(dt)            │
│       - Spawn new lines             │
│       - Update positions            │
│       - Cull dead lines             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  8. Draw all lines                  │
│     emitter.draw(p)                 │
│     - For each line:                │
│       - Calculate alpha             │
│       - Build ribbon geometry       │
│       - Draw filled shape           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  9. Pop matrix (restore state)      │
│     p.pop()                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  10. Capture frame (if recording)   │
│      capturer.capture(canvas)       │
└─────────────────────────────────────┘
```

---

## Camera System

### Transform Hierarchy

Transforms are applied in this order (inside-out):

```
1. Geometry local space (zigzag vertices)
2. Line position (translate by line.x, line.y)
3. Geometry scale (params.geometryScale)
4. Z-plane rotation (params.emitterRotation)
5. Camera orbit (rotateY, rotateX)
6. Camera zoom (translate Z by -distance)
7. Camera pan (translate XY by offsets)
8. Stereo eye offset (translate X by ±eyeSeparation/2)
9. Projection (perspective with FOV)
```

### Coordinate Transform Example

Point at zigzag vertex `(vx, vy, 0)`:

```javascript
// 1. Line position
worldX = vx + (line.x - W/2)
worldY = vy + (line.y - H/2)
worldZ = 0

// 2. Scale
worldX *= scale / 100
worldY *= scale / 100

// 3. Z rotation
θ = emitterRotation × π/180
x' = worldX × cos(θ) - worldY × sin(θ)
y' = worldX × sin(θ) + worldY × cos(θ)

// 4. Orbit rotation
// Apply rotateX then rotateY matrices

// 5. Zoom + Pan
x'' = x' + offsetX
y'' = y' + offsetY
z'' = z' - distance

// 6. Stereo offset (if applicable)
x''' = x'' + cameraOffset

// 7. Projection
// Perspective divide by depth
```

### Mouse to Camera Mapping

**Rotation (left drag):**
```javascript
const sensitivity = 0.005;  // radians per pixel
rotationY += dx * sensitivity;
rotationX += dy * sensitivity;
rotationX = clamp(rotationX, -π/2, π/2);  // Limit pitch
```

**Panning (right drag):**
```javascript
const sensitivity = max(0.5, distance / 500);
offsetX += dx * sensitivity;
offsetY += dy * sensitivity;
```

**Sensitivity scales with distance** - farther camera = faster pan.

**Zoom (scroll):**
```javascript
const zoomSpeed = 20;  // pixels per scroll tick
distance += event.delta * zoomSpeed;
distance = clamp(distance, 50, 10000);
```

---

## Export System

### Export Comparison

| Feature | PNG | SVG | Depth Map | Video |
|---------|-----|-----|-----------|-------|
| **Type** | Raster | Vector | Greyscale Raster | Video stream |
| **Resolution** | Fixed (canvas) | Infinite | Fixed (canvas) | Fixed (canvas) |
| **Editability** | No | Yes (paths) | No | No |
| **File Size** | ~100KB - 2MB | ~10KB - 500KB | ~50KB - 1MB | ~5MB - 100MB+ |
| **Animation** | Single frame | Single frame | Single frame | Full animation |
| **Quality** | Lossy (resize) | Lossless | Lossless greyscale | Compressed |
| **Best Use** | Quick share | Design work | Post-processing | Presentation |

### Video Export Technical Details

**CCapture.js Integration:**

1. **Fixed Timestep:**
   ```javascript
   if (isRecording) {
     dt = 1 / params.videoFPS;  // e.g., 1/30 = 0.0333...
   }
   ```
   - Ensures consistent animation speed
   - Independent of actual render time
   - Guarantees deterministic output

2. **Frame Capture:**
   ```javascript
   if (isRecording) {
     capturer.capture(p5Instance.canvas);
     recordingFrameCount++;
     updateProgressBar();
     
     if (recordingFrameCount >= recordingTotalFrames) {
       stopVideoCapture();
     }
   }
   ```

3. **Encoding:**
   - Browser-dependent (WebM codec varies)
   - CCapture handles stream encoding
   - File downloads when complete

**Limitations:**
- Cannot interact during recording
- High resolution + long duration = slow process
- File size grows linearly with frames

---

### Depth Map Export Technical Details

**NEW IN v12:** CPU-based depth map generation with auto-ranging.

**Architecture:**
1. Uses exact same camera projection math as SVG export
2. Projects all geometry to 2D screen space
3. Carries depth (Z) values through projection
4. Rasterizes polygons as greyscale based on depth
5. Guarantees pixel-perfect alignment with PNG export

**Implementation Flow:**

```javascript
function exportDepthMap() {
  // 1. Get live geometry
  const lines = emitterInstance.lines.filter(l => l._alpha() > 0);
  
  // 2. Pre-compute projection constants (matches SVG export)
  const fovRad = params.fov * Math.PI / 180;
  const defaultCameraZ = (H / 2) / Math.tan(fovRad / 2);
  const totalDistance = defaultCameraZ + camera.distance;
  
  // 3. Auto-range depth from actual geometry
  const { minDepth, maxDepth } = scanDepthRange(lines);
  
  // 4. Create offscreen canvas
  const offCanvas = document.createElement('canvas');
  offCanvas.width = W;
  offCanvas.height = H;
  const ctx = offCanvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  
  // 5. Project and rasterize each ribbon
  for (const line of lines) {
    const localVerts = line._buildVertices();
    const { leftSide, rightSide } = buildRibbonSides(localVerts, line.lineThickness / 2);
    
    // Project vertices (3D → 2D + depth)
    const leftProj = leftSide.map(pt => depthProjectVertex(line, pt.x, pt.y)).filter(Boolean);
    const rightProj = rightSide.map(pt => depthProjectVertex(line, pt.x, pt.y)).filter(Boolean);
    
    if (leftProj.length < 2 || rightProj.length < 2) continue;
    
    const poly = [...leftProj, ...[...rightProj].reverse()];
    rasteriseDepthPolygon(ctx, poly, minDepth, maxDepth, params.depthInvert, line._alpha());
  }\n  \n  // 6. Download as PNG\n  offCanvas.toBlob(blob => {\n    const url = URL.createObjectURL(blob);\n    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = `zigzag-depthmap-${ts}.png`;\n    a.click();\n    URL.revokeObjectURL(url);\n  }, 'image/png');\n}\n```\n\n**Auto-Ranging Algorithm:**\n\n```javascript\nfunction scanDepthRange(lines) {\n  let minD = Infinity;\n  let maxD = -Infinity;\n  \n  for (const line of lines) {\n    if (line._alpha() <= 0) continue;\n    for (const pt of line._buildVertices()) {\n      const p = depthProjectVertex(line, pt.x, pt.y);\n      if (!p) continue;  // Clipped\n      if (p.depth < minD) minD = p.depth;\n      if (p.depth > maxD) maxD = p.depth;\n    }\n  }\n  \n  // Nudge minDepth down 3% to ensure nearest geometry maps to pure white\n  const nudge = (maxD - minD) * 0.03;\n  return { minDepth: Math.max(0.01, minD - nudge), maxDepth: maxD };\n}\n```\n\n**Depth Encoding:**\n\n```javascript\nfunction rasteriseDepthPolygon(ctx, pts, minDepth, maxDepth, invert, alpha) {\n  // Average depth across polygon vertices\n  let depthSum = 0;\n  for (const p of pts) depthSum += p.depth;\n  const avgDepth = depthSum / pts.length;\n  \n  // Normalize to [0, 1]\n  let t = (avgDepth - minDepth) / (maxDepth - minDepth);\n  t = Math.max(0, Math.min(1, t));\n  \n  // Apply power curve for contrast enhancement\n  t = Math.pow(t, 0.6);  // Gamma 0.6 boosts midtones toward white\n  \n  // Encode as greyscale\n  const grey = Math.round((invert ? t : 1 - t) * 255);\n  \n  // Rasterize polygon\n  ctx.fillStyle = `rgba(${grey},${grey},${grey},${alpha.toFixed(4)})`;\n  ctx.beginPath();\n  ctx.moveTo(pts[0].sx, pts[0].sy);\n  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);\n  ctx.closePath();\n  ctx.fill();\n}\n```\n\n**Key Features:**\n- **Auto-ranging**: No manual near/far cutoff needed\n- **Power curve**: Gamma 0.6 enhances contrast in midtones\n- **Inversion**: Optional black = near, white = far\n- **Alignment**: Exact pixel correspondence with PNG export\n- **Performance**: CPU-based, works on all browsers\n\n---

## Performance Considerations

### Optimization Strategies

1. **Pixel Density:**
   ```javascript
   p.pixelDensity(1);  // Force 1:1 ratio
   ```
   - Prevents high-DPI scaling (Retina displays)
   - Reduces pixel count by up to 4× on 2× displays

2. **Emit Rate:**
   - Each line = ~34 vertices (16 segments × 2 sides + caps)
   - 10 lines/sec @ 60fps = 600 lines active (assuming 60s lifetime)
   - ~20,400 vertices per frame
   - Lower emit rate = fewer active lines

3. **Canvas Culling:**
   - Lines outside spawn boundaries are removed
   - Reduces draw calls and memory

4. **Shared Emitter:**
   - Stereo mode shares single Emitter instance
   - Simulation runs once, rendered twice
   - Halves CPU cost of updates

5. **LocalStorage Throttling:**
   - Could debounce `saveToLocalStorage()` for high-frequency controls
   - Currently saves on every change (acceptable for most parameters)

### Performance Metrics

Typical performance on modern hardware:

| Scenario | FPS | Active Lines |
|----------|-----|--------------|
| Default (1.5/s rate) | 60 | ~90 |
| High (5/s rate) | 55-60 | ~300 |
| Extreme (10/s rate) | 45-55 | ~600 |
| Stereo (default) | 50-55 | ~90 (per eye) |

**Bottlenecks:**
- Vertex processing (WebGL)
- Shape drawing (p5.js)
- Ribbon geometry calculation

---

## Extension Guide

### Adding New Controls

**1. Add HTML:**
```html
<div class="control-group">
  <label>New Parameter</label>
  <div class="slider-row">
    <input type="range" id="new-param" min="0" max="100" value="50"/>
    <span class="value-display" id="new-param-val">50</span>
  </div>
</div>
```

**2. Add to `params`:**
```javascript
const params = {
  // ... existing params
  newParameter: 50
};
```

**3. Wire control:**
```javascript
wire('new-param', 'new-param-val', 'newParameter');
```

**4. Use in code:**
```javascript
// Anywhere params is accessed
const value = params.newParameter;
```

**5. Add to `syncUIFromParams`:**
```javascript
{ id: 'new-param', key: 'newParameter' }
```

---

### Adding Custom Shapes

**1. Create new class:**
```javascript
class CustomShape {
  constructor({ p, x, y, ...customParams }) {
    this.p = p;
    this.x = x;
    this.y = y;
    // Store custom parameters
    this.alive = true;
  }
  
  update(dt) {
    // Update position, check bounds
    // Set this.alive = false when done
  }
  
  draw(p) {
    // Rendering logic
    p.push();
    p.translate(this.x - W/2, this.y - H/2, 0);
    // Draw your shape
    p.pop();
  }
}
```

**2. Modify emitter:**
```javascript
_emit() {
  // Optionally alternate or choose based on params
  if (params.shapeType === 'custom') {
    this.lines.push(new CustomShape({
      p: this.p,
      x: this.x,
      y: this.y,
      // Custom parameters
    }));
  } else {
    // Existing ZigzagLine
  }
}
```

---

### Adding Export Formats

**Example: JPEG export**

```javascript
function exportJPEG() {
  const canvas = p5Instance.canvas;
  const dataURL = canvas.toDataURL('image/jpeg', 0.9);  // 90% quality
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = `zigzag-emitter-${formatTimestamp()}.jpg`;
  a.click();
}
```

Wire to button in HTML.

---

### Custom Color Palettes

**1. Add swatches to HTML:**
```html
<div class="swatch" data-color="128,0,255" style="background:#8000ff"></div>
```

**2. Automatically picks up existing handler.**

**For advanced palettes:**
- Add color picker input: `<input type="color">`
- Convert hex to RGB: `hexToRgb(hex)`
- Update `params.lineColor`

---

## Debugging

### Console Logging

The application includes strategic console logs:

**Page load:**
```
Loaded from localStorage, camera.distance = 600
Setup complete - camera.distance: 600 isPrimary: true
```

**Mouse events:**
```
mousePressed - button: RIGHT, LEFT: LEFT, RIGHT: RIGHT
→ Right/Center button: panning mode
→ camera state: {isDragging: false, isPanning: true}
```

**Panning:**
```
camera.distance before calc: 600 params.cameraDistance: 600
PANNING: {dx: 5, dy: -3, sens: 1.2, distance: 600, offsetX: 6, offsetY: -3.6}
```

**FOV changes:**
```
FOV changed: 60.00° → 90.00°, Distance: 600.0 → 346.4 (ratio: 0.577)
```

**Zoom:**
```
mouseWheel: camera.distance = 720
```

---

### Common Issues

**Lines not appearing:**
- Check `emitRate` > 0
- Verify camera is not too far/close
- Check clipping planes (near/far)
- Ensure canvas dimensions are valid

**Panning not working:**
- Check console for `camera.distance` - should be ≥ 50
- Verify right-click context menu is prevented
- Check `camera.isPanning` state in logs

**Performance issues:**
- Reduce `emitRate`
- Disable random modulations
- Lower canvas resolution
- Check browser hardware acceleration

**Export failures:**
- PNG/SVG: Check browser download permissions
- Video: Ensure page is visible during recording
- Check browser console for errors

---

### Browser Dev Tools

**Useful inspections:**

1. **Console:** `console.log()` statements for state
2. **Network:** Check library loads (p5.js, CCapture.js)
3. **Performance:** Profile frame timing
4. **Application → Local Storage:** View `zigzagEmitterSettings`
5. **Elements:** Inspect canvas dimensions and classes

---

## References

- **p5.js Documentation:** https://p5js.org/reference/
- **CCapture.js GitHub:** https://github.com/spite/ccapture.js/
- **WebGL Fundamentals:** https://webglfundamentals.org/
- **Perlin Noise:** https://en.wikipedia.org/wiki/Perlin_noise
- **Miter Joins:** https://en.wikipedia.org/wiki/Miter_joint

---

## License

[ MIT License — CC BY-NC-SA — ddelcourt 2026 ]

---

**Version:** 10.0  
**Last Updated:** March 7, 2026  
**Author:** [ddelcourt]  
**Project:** Mapping 2026

---
