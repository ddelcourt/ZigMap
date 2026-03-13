# ZigMap Emitter - User Guide
ddelcourt2026

Real-time generative tool that creates animated patterns in 3D space. Advanced camera controls, stereoscopic viewing, 2D vectors export function.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Mouse Controls](#mouse-controls)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [UI Controls](#ui-controls)
  - [UI Section](#ui-section)
  - [File Section](#file-section)
  - [Camera Section](#camera-section)
  - [Geometry Section](#geometry-section)
  - [Behavior Section](#behavior-section)
  - [Modulations Section](#modulations-section)
  - [Colors Section](#colors-section)
  - [Export Section](#export-section)
- [Export Formats](#export-formats)
- [Tips & Best Practices](#tips--best-practices)
- [Quick Start Guide](#quick-start-guide)

---

## Quick Start

1. Open in a web browser (Chrome, Firefox, Safari, Edge)
2. **First-time users**: A starter project with example states loads automatically!
3. Use left-click + drag to rotate the camera
4. Use right-click + drag to pan the camera
5. Scroll to zoom in/out
6. Adjust sliders in the left panel to modify the animation
7. Click between saved states to see smooth transitions
8. Press **H** to hide/show controls
9. Press **Enter** for fullscreen

---

## Mouse Controls

| Action | Control |
|--------|---------|
| **Rotate Camera** | Left-click + drag |
| **Pan Camera** | Right-click + drag (or middle-click + drag) |
| **Zoom** | Mouse wheel scroll |

### Notes:
- Camera controls only work when the mouse is over the canvas (not over the UI panel)
- In stereoscopic mode, controls are active on the canvas you clicked on
- Panning sensitivity is proportional to camera distance

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **H** | Toggle UI panel visibility |
| **Enter** | Toggle fullscreen mode |
| **p** | Export PNG (includes overlay) |
| **s** | Export SVG (vector only) |
| **d** | Export depth map |
| **v** | Start/stop video recording (includes overlay) |
| **r** | Reset camera position |
| **0** | Reset zoom to default (600 units) |
| **1** | Switch to color palette 1 |
| **2** | Switch to color palette 2 |
| **3** | Switch to color palette 3 |
| **4** | Switch to color palette 4 |
| **y** | Toggle stereoscopic (VR) mode |

💡 **Note**: PNG and video exports automatically include your overlay image!

---

## UI Controls

### Project Section

Save and load your complete projects with states and camera positions.

#### Save
- Downloads current project as a `.json` file
- Includes all parameters, all saved states, and camera positions
- Filename includes timestamp: `zigmap-project-YYYY-MM-DD-HHMMSS.json`
- Stored in browser's downloads folder

#### Load
- Opens file picker to load a previously saved `.json` project
- Loads parameters and all states from the file
- **NEW**: Uses first state in project and synchronizes camera/orbit controls
- Automatically persists to localStorage

**Note**: Settings are automatically saved to browser localStorage on every change.

---

### States Section

**NEW IN v26**: Complete state management system with transition controls and auto-trigger.

#### State List
- Shows all saved states
- Click a state to load it with smooth transitions
- Click state name to rename it (avoid pressing keyboard shortcuts while renaming)

#### Save/Update/Delete
- **Save**: Capture current setup as a new state
- **Update**: Overwrite selected state with current settings  
- **Delete**: Remove selected state

#### State Transition Duration
- **Range**: 0–30 seconds
- **Default**: 5.0 seconds
- Controls how long smooth transitions take when switching states
- Affects: geometry, camera, modulations, speed, emit rate (NOT colors)
- 0 seconds = instant switch
- Longer durations = smoother, more cinematic transitions

#### Color Transition Duration
- **Range**: 0–30 seconds
- **Default**: 3.0 seconds
- Controls how long color palette transitions take
- Independent from state transition duration
- Allows smooth color morphing when switching palettes or states

#### Auto-Trigger **NEW**
- **Checkbox**: Enable/disable automatic state switching
- **Frequency**: 5–120 seconds between switches
- Automatically switches to a **random state** at set intervals
- Uses truly random selection (no patterns or sequences)
- Requires 2+ states to function
- Timer resets when manually switching states
- Perfect for unattended displays or presentations

---

### Color Palettes Section

Choose colors for your zigzag patterns using the advanced palette system.

#### Color Palettes
- **Type**: 4 distinct palettes with 4 color slots each
- **Shortcuts**: Keys 1, 2, 3, 4 to switch between palettes
- **UI**: Click palette buttons (numbered 1-4) at top of section

#### Color Customization
Each palette has 4 color slots:
- **Color Picker**: Click to customize RGB values
- **Color Role**: Dropdown menu to assign role:
  - **Line**: Color used for zigzag ribbons (randomly selected at spawn)
  - **Background**: Color used for canvas background
  - **None**: Color slot disabled
- Colors can have duplicate roles (multiple colors as lines or backgrounds)

#### Color Depth Separation
- **Range**: 10-500
- **Default**: 100
- **Purpose**: Controls Z-axis spacing between lines of different colors
- Higher values increase depth separation, preventing visual overlap (z-fighting)
- Formula: Each color slot offset = `(slotIndex - 2) × multiplier`

#### Color Transitions
- When switching palettes, all existing lines smoothly transition to new colors
- Transition duration controlled by Color Transition Duration in States section
- Background also transitions smoothly
- Uses RGB linear interpolation for smooth color blending

---

### Rendering Section

**NEW IN v26**: Separated from View controls for clarity.

Configure output resolution for exports.

#### Framebuffer Resolution
- **Type**: Checkbox
- **Default**: Off
- Locks canvas to a specific pixel resolution instead of window size
- Useful for consistent export dimensions across different screens
- Enables the Preset and Resolution controls below
- Shows a gray border around the fixed-size canvas
- Canvas scales down to fit window if needed

#### Preset
- **Type**: Dropdown menu
- **Default**: 1920×1080 (HD)
- Quick selection of common resolutions:
  - **1920×1080** - HD Horizontal
  - **1080×1080** - Square (Instagram)
  - **3840×2160** - 4K Horizontal
  - **1080×1440** - Instagram Portrait
  - **Custom** - Manual width/height entry
- Automatically updates Width and Height fields
- Only active when Framebuffer Resolution is enabled

#### Resolution (Width × Height)
- **Type**: Number inputs
- **Default**: 1920 × 1080
- **Minimum**: 320 × 240
- Manual control over canvas pixel dimensions
- Changing these values sets the Preset dropdown to "Custom"
- Higher resolutions impact performance
- **Use for precise export sizing**

---

### View Section

**NEW IN v26**: Camera and display settings separated from Rendering.

#### Field of View
- **Range**: 10° – 120°
- **Default**: 60°
- **Units**: Degrees
- Controls the camera's field of view (lens angle)
- **Lower values** (20°-40°) = telephoto lens, less distortion
- **Default** (60°) = standard perspective
- **Higher values** (90°-120°) = wide-angle lens, more distortion

#### Clipping Planes
- **Near Plane Range**: 0.01 – 500
- **Far Plane Range**: 500 – 20000
- **Defaults**: Near = 0.01, Far = 20000
- Controls which parts of 3D space are visible
- Adjust if geometry appears clipped at extreme zoom levels

#### Stereoscopic View (VR)
- **Shortcut**: y
- **Type**: Checkbox
- **Default**: Off
- Splits the view into left and right eye perspectives
- Creates side-by-side views for VR headsets or cross-eyed viewing
- Green borders indicate stereoscopic mode is active
- Each eye gets half the window width

#### Eye Separation
- **Range**: 0 – 100
- **Default**: 30
- **Units**: World space units
- Controls the distance between left and right camera positions
- Higher values = stronger 3D effect
- Only active when Stereoscopic View is enabled

---

### Geometry Section

Control the appearance and scale of the zigzag patterns.

#### Segment Length
- **Range**: 10 – 240
- **Default**: 30
- **Units**: Pixels
- Controls the height of each zigzag segment
- Higher values = taller zigzag patterns

#### Line Thickness
- **Range**: 1 – 50
- **Default**: 12
- **Units**: Pixels
- Controls the width of the zigzag ribbons
- Can be modulated with Random Thickness

#### Emitter Rotation
- **Range**: 0° – 360°
- **Default**: 0°
- **Units**: Degrees
- Rotates the entire emission pattern around the Z-axis
- 0° = standard horizontal zigzag orientation
- 90° = vertical zigzag orientation

#### Geometry Scale
- **Range**: 50% – 200%
- **Default**: 100%
- **Units**: Percentage
- Uniformly scales all geometry
- Supports smooth transitions between states

#### Fade Duration
- **Range**: 0 – 5 seconds
- **Default**: 0.8 seconds
- Controls how long lines take to fade in/out
- Affects alpha transparency at birth and death

---

### Animation Section

Control animation timing and movement.

#### Emit Rate
- **Range**: 0.1 – 10 lines/second
- **Default**: 1.5
- **Units**: Lines emitted per second
- Controls how frequently new zigzag lines spawn
- Higher values = more lines on screen, denser animation

#### Speed
- **Range**: 10 – 500 px/second
- **Default**: 80
- **Units**: Pixels per second
- Controls how fast lines move through space
- Can be modulated with Random Speed

#### Ambient Speed Master
- **Range**: 5% – 100%
- **Default**: 100%
- **Units**: Percentage
- Global speed multiplier affecting both emit rate and line speed
- Useful for fine-tuning animation tempo

---

### Modulations Section

Add variation and organic movement to the animation.

#### Random Thickness
- **Type**: Checkbox
- **Default**: Off
- When enabled, each line gets a randomly varied thickness
- Variation is controlled by the Thickness Range sliders below

#### Random Speed
- **Type**: Checkbox
- **Default**: Off
- When enabled, each line gets a randomly varied speed
- Variation is controlled by the Speed Range sliders below

#### Thickness Range
- **Type**: Dual-range slider
- **Range**: 10% – 400%
- **Defaults**: Min = 10%, Max = 200%
- Only active when Random Thickness is enabled

#### Speed Range
- **Type**: Dual-range slider
- **Range**: 50% – 200%
- **Defaults**: Min = 50%, Max = 150%
- Only active when Random Speed is enabled

---

### Overlay Section

**NEW IN v26**: Add static images on top of your animation for branding, watermarks, or design elements.

#### Show Overlay
- **Type**: Checkbox
- **Default**: Off
- Toggle overlay image visibility
- Image remains loaded when hidden

#### Load Image
- Opens file picker to import image
- **Supported formats**: PNG, JPG, SVG
- **Recommendation**: Use PNG with transparency for logos
- Image encoded as Base64 and saved to project
- Automatically enables Show Overlay checkbox

#### Scale
- **Range**: 10% – 200%
- **Default**: 100%
- Resize the overlay image
- 50% = half size, 200% = double size

#### Opacity
- **Range**: 0% – 100%
- **Default**: 100%
- Control overlay transparency
- 0% = fully transparent (invisible)
- 30-50% = subtle watermark
- 100% = fully opaque

#### Position X / Position Y
- **Range**: 0% – 100%
- **Default**: 50% / 50% (centered)
- Place the overlay anywhere on screen
- 0%, 0% = top-left corner
- 100%, 100% = bottom-right corner
- 50%, 50% = centered

#### Clear Image
- Removes current overlay image
- Resets all overlay settings to defaults

#### Export Behavior **Important**
- **PNG Exports**: Automatically composite overlay with correct positioning
- **Video Exports**: Overlay included on every frame
- **SVG Exports**: Overlay NOT included (vector only)
- **Depth Maps**: Overlay NOT included
- Automatic pixelDensity correction for high-resolution (Retina) displays

---

### Export Section

Export your creations as images or videos.

#### Export PNG
- **Shortcuts**: p
- Captures current frame as PNG image
- **NEW**: Automatically includes overlay with correct scale/position/opacity
- Supports high-resolution (Retina) displays with pixelDensity correction
- Resolution matches current canvas size (respects Framebuffer Resolution if enabled)
- Filename: `zigzag-TIMESTAMP.png`

#### Export SVG
- **Shortcuts**: s
- Exports current frame as vector SVG file
- Resolution-independent format
- All lines exported as `<path>` elements
- Overlay NOT included (vector only)
- Ideal for print or vector editing
- Filename: `zigzag-TIMESTAMP.svg`

#### Export Depth Map
- **Shortcuts**: d
- Exports depth information as greyscale PNG
- White pixels = closest to camera
- Black pixels = farthest from camera
- Auto-calculated depth range from live geometry
- Perfect pixel alignment with PNG export
- Use cases: post-processing, After Effects, Blender
- Filename: `zigzag-depthmap-TIMESTAMP.png`

#### Video Recording

**Duration**
- **Range**: 1 – 60 seconds
- **Default**: 10 seconds
- Sets the length of video recording

**Frame Rate (FPS)**
- **Range**: 24 – 60 frames/second
- **Default**: 30 FPS
- 24 FPS = cinematic, smaller file
- 30 FPS = standard web video
- 60 FPS = ultra-smooth, larger file

**Record Video Button** (or press **v**)
- Starts frame-by-frame video capture using CCapture.js
- **NEW**: Automatically includes overlay on every frame
- Animation runs at fixed timestep for deterministic output
- Progress indicator shows percentage complete
- When complete, video downloads automatically
- **Important**: Do not interact with page during recording
- WebM format (browser-dependent)

---

## Export Formats

### PNG Export
- **Format**: Raster image (Portable Network Graphics)
- **Use case**: Social media, presentations, quick sharing
- **Resolution**: Matches current canvas resolution
- **Transparency**: Opaque black background
- **Overlay**: **Automatically included** with correct positioning, scale, and opacity
- **PixelDensity**: Automatic correction for high-resolution (Retina) displays
- **Quality**: Lossless compression
- **File size**: ~100KB - 2MB depending on resolution

### SVG Export
- **Format**: Vector graphics (Scalable Vector Graphics)
- **Use case**: Print, web graphics, Illustrator/Inkscape editing
- **Resolution**: Infinite (vector)
- **Transparency**: Defined per path element
- **Overlay**: Not included (vector only)
- **Editability**: Full - can modify paths, colors, transforms
- **File size**: ~10KB - 500KB depending on line count
- **Note**: Export captures current frame only; does not animate

### Depth Map Export
- **Format**: Greyscale PNG (Portable Network Graphics)
- **Use case**: Displacement mapping, Z-depth compositing, post-processing effects
- **Resolution**: Matches current canvas resolution
- **Encoding**: White = near objects, Black = far objects
- **Overlay**: Not included (depth data only)
- **Depth range**: Auto-calculated from live geometry
- **Quality**: Lossless greyscale with gamma 0.6 power curve
- **File size**: ~50KB - 1MB depending on resolution
- **Note**: Captures current frame depth information only

### Video Export
- **Format**: WebM (browser-dependent)
- **Use case**: Video platforms, social media, portfolio
- **Resolution**: Matches current canvas resolution
- **Overlay**: **Automatically composited on every frame**
- **Frame compositing**: Uses createCompositeCanvas() for each frame
- **Deterministic**: Fixed timestep ensures consistent output
- **File size**: ~5MB - 100MB+ depending on duration, FPS, and resolution
- **Performance**: Overlay adds ~1-2ms per frame (negligible impact)
- **Frame capture**: Sequential frame-by-frame recording
- **Determinism**: Identical output for same settings
- **File size**: Varies greatly by duration, FPS, and resolution
  - Example: 10 sec @ 30fps @ 1920×1080 ≈ 5-20MB
- **Processing time**: Real-time to several minutes depending on complexity

---

## Tips & Best Practices

### First-Time Users
- **Starter project loads automatically** on first visit!
- Explore the example states to see how parameters affect the animation
- Click between states to watch smooth transitions
- Adjust transition durations for different effects
- **Press H** to hide controls for a clean view

### Performance Optimization
- **Lower emit rate** (0.5-2) for smoother performance
- **Disable Random Thickness/Speed** if experiencing lag
- **Use Framebuffer Resolution** for consistent frame timing
- **Lower canvas resolution** (1280×720) for faster rendering
- Close other browser tabs during video recording

### Visual Composition
- **Slow emit rate + high speed** = sparse, minimal aesthetic
- **High emit rate + slow speed** = dense, layered composition
- **Random modulations** add organic, hand-drawn quality
- **Narrow FOV (30-40°)** = clean, architectural look
- **Wide FOV (90-120°)** = dramatic, immersive perspective
- **Emitter rotation** creates diagonal or vertical compositions

### Using States
- **Save multiple moods**: Create states for different animation styles
- **Transition timing**: Use long transitions (10-20s) for smooth morphing
- **Color transitions**: Set separate duration for palette changes
- **Auto-trigger**: Enable for unattended displays or presentations
- **Camera positions**: Each state saves its own camera view
- **Live performance**: Switch states during recording for dynamic videos

### Overlay Best Practices
- **PNG with transparency** for logos/watermarks
- **Opacity 30-50%** for subtle branding
- **Corner positioning** (X/Y: 10% or 90%) for unobtrusive branding
- **Center positioning** (X/Y: 50%) for main design elements
- **Scale down** (50-80%) for non-intrusive overlays
- **Check exports**: PNG and video automatically include overlay
- **Brand consistency**: Overlay persists across all states

### VR / Stereoscopic Viewing
- Enable Stereoscopic View for side-by-side output
- Start with **Eye Separation = 30**, adjust to taste
- Larger separation = stronger 3D effect but may cause eye strain
- For cross-eyed viewing: sit ~2 feet from screen, cross eyes until images merge
- For VR headsets: export video in framebuffer mode at appropriate resolution

### Camera Control
- **Zoom out** (scroll) before rotating to see full spatial structure
- **Pan** to reframe composition without rotating
- **Reset camera** (r key): Restores default camera position and rotation
- **Reset zoom** (0 key): Returns camera distance to default 600 units
- Camera state is saved with states and projects

### Recording High-Quality Videos
1. Set desired **Framebuffer Resolution** (e.g., 3840×2160 for 4K)
2. Set up **overlay image** before recording (included automatically)
3. Choose appropriate **Duration** (5-15 seconds often sufficient)
4. Select **Frame Rate**: 30 FPS is standard, 60 FPS for smooth motion
5. Click **Record Video** and wait for processing
6. **Do not interact** with the browser during recording
7. Video downloads automatically when complete with overlay composited

### Exporting for Web/Social
- **Instagram**: Use 1080×1080 or 1080×1440 preset
- **Twitter/X**: 1920×1080 works well
- **Website banner**: Custom resolution as needed
- **High-quality still**: Export PNG with overlay (includes Retina correction)
- **Vector graphics**: Export SVG (no overlay, but editable)
- **Depth effects**: Export depth map for post-processing

### Troubleshooting
- **Lines not appearing**: Check Emit Rate > 0, adjust camera distance
- **Clipping issues**: Adjust Near/Far clipping planes in View section
- **Panning not working**: Ensure camera distance ≥ 50
- **Settings not saving**: Check browser localStorage permissions
- **Video file too large**: Reduce duration, FPS, or resolution
- **Choppy animation**: Lower emit rate or close other programs
- **Overlay not showing**: Check ☑️ Show Overlay box and adjust opacity
- **State won't rename**: Click directly on state name text
- **Keyboard shortcuts not working**: Make sure you're not renaming a state

---

## Version History

### v26 (Current)
- **NEW**: State management system
  - Save/load multiple states
  - Smooth transitions with adjustable duration (0-30s)
  - Separate color transition duration control
  - Auto-trigger random state switching (5-120s intervals)
  - Camera positions saved per state
- **NEW**: Overlay image system
  - Import PNG/JPG/SVG images
  - Adjustable scale (10-200%), opacity (0-100%), position (0-100% X/Y)
  - Automatic compositing in PNG and video exports
  - PixelDensity correction for Retina displays
  - Project-wide persistence (not per-state)
- **NEW**: First-time user experience
  - Automatically loads curated starter project (zigmap26-init.json)
  - Includes example states demonstrating features
  - Smooth onboarding with immediate visual interest
- **NEW**: Separated control panes
  - Rendering section: Framebuffer settings
  - View section: FOV, clipping, stereoscopic
  - Clearer organization of controls
- **IMPROVED**: Project loading
  - Uses first state in project list
  - Synchronizes camera/orbit controls with state
  - Bidirectional camera sync (syncToParams/syncFromParams)
- **IMPROVED**: Modular ES6 architecture
  - Separate files for each class/system
  - Better code organization and maintainability
  - Explicit import/export structure
- **CHANGED**: Keyboard shortcuts
  - **H** key for hiding controls (was Tab)
  - Removed Interface control pane (functions kept as shortcuts)
  - Keyboard shortcuts disabled during state renaming

### Earlier Versions (v12 and below)
- Depth map export with auto-ranging
- CPU-based projection for depth maps
- Centralized keyboard shortcuts system
- FOV compensation for camera distance
- Mouse-based camera controls (orbit, pan, zoom)
- Stereoscopic viewing mode
- Framebuffer resolution control
- Random thickness/speed modulations
- SVG/PNG/Video export capabilities
- LocalStorage persistence

---

## Browser Compatibility

- **Chrome/Edge**: Full support ✓
- **Firefox**: Full support ✓
- **Safari**: Full support ✓
- **Mobile browsers**: Limited (no mouse controls)

**Minimum requirements**: 
- WebGL support
- ES6 JavaScript
- Canvas 2D API
- File download support

---

## Credits

- **p5.js** (v1.9.0) - Creative coding framework
- **CCapture.js** (v1.1.0) - Frame capture for video export
- ddelcourt2026 / Developed for TheSpaceLab / Mapping 2026

---

## License

[ MIT License — CC BY-NC-SA — ddelcourt 2026 ]

.
.
.

---

# Quick Start Guide

## 🚀 Running the Application

### Method 1: Python Server (Recommended)
```bash
cd [the directory where you are storing the files]
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

**Note:** Keyboard shortcuts and mouse controls are documented in the [User Manual](docs/English/User-Manual.md#essential-keyboard-shortcuts).

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
**Original**: ZigzagEmitter monolithic file (2,334 lines → 25 modular files)

.
.
.
.
.
.
.