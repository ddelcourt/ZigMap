# ZigMap26 — Quick Start Guide

## 🚀 Running the Application

### Method 1: Python Server (Recommended)
```bash
cd [the directory where you are storing the files]]
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


---

# Complete User Manual


# ZigMap Emitter - User Guide
ddelcourt2026

**Version 12** - Centralized Keyboard Shortcuts & Depth Map Export

A real-time generative art tool that creates animated zigzag patterns in 3D space with advanced camera controls, stereoscopic viewing, and export capabilities.

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

---

## Quick Start

1. Open `ZigzagEmitter_12.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. Use left-click + drag to rotate the camera
3. Use right-click + drag to pan the camera
4. Scroll to zoom in/out
5. Adjust sliders in the left panel to modify the animation
6. Press **Tab** to hide/show controls
7. Press **Return/Enter** for fullscreen

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
| **Tab** | Toggle UI panel visibility |
| **h** | Hide/show controls (alternate for Tab) |
| **Return/Enter** | Toggle fullscreen mode |
| **f** | Fullscreen (alternate for Enter) |
| **p** | Export PNG |
| **P** (Shift+P) | Export PNG (alternate) |
| **s** | Export SVG |
| **S** (Shift+S) | Export SVG (alternate) |
| **d** | Export depth map |
| **D** (Shift+D) | Export depth map (alternate) |
| **v** | Start/stop video recording |
| **j** | Save settings to JSON file |
| **Ctrl+S** (⌘+S on Mac) | Save settings to JSON file (alternate) |
| **r** | Reset camera position |
| **R** (Shift+R) | Reset camera position (alternate) |
| **0** | Reset zoom to default (600 units) |
| **t** | Toggle random thickness modulation |
| **m** | Toggle random speed modulation |
| **3** | Toggle stereoscopic (VR) mode |
| **b** | Toggle framebuffer mode |

---

## UI Controls

### UI Section

Controls for interface visibility and display modes.

#### Hide Controls
- **Shortcuts**: Tab or h
- Hides the left control panel for a clean view
- Press Tab or h again to show controls

#### Fullscreen
- **Shortcuts**: Return/Enter or f
- Enters browser fullscreen mode
- Maximizes the canvas for presentation or recording
- Press Escape to exit fullscreen

---

### File Section

Save and load your configurations.

#### Save
- **Shortcuts**: j or Ctrl+S (⌘+S on Mac)
- Downloads current settings as a `.json` file
- Filename includes timestamp: `zigzag-emitter-YYYY-MM-DD-HHMMSS.json`
- Saves all parameters including camera position
- Stored in browser's downloads folder

#### Load
- Opens file picker to load a previously saved `.json` configuration
- Instantly applies all settings from the file
- Automatically persists to localStorage

**Note**: Settings are automatically saved to browser localStorage on every change.

---

### Camera Section

Configure viewing modes, resolution, and projection parameters.

#### Stereoscopic View (VR)
- **Shortcut**: 3
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
- Adjust based on viewing distance and screen size

#### Framebuffer Resolution
- **Shortcut**: b
- **Type**: Checkbox
- **Default**: Off
- Locks canvas to a specific pixel resolution instead of window size
- Useful for consistent output dimensions across different screens
- Enables the Preset and Resolution controls below
- Shows a gray border around the fixed-size canvas
- Canvas scales down to fit window if needed

#### Preset
- **Type**: Dropdown menu
- **Default**: 1920×1080 (HD Horizontal)
- Quick selection of common resolutions:
  - **1920×1080** - HD Horizontal (standard widescreen)
  - **1080×1920** - HD Vertical (portrait orientation)
  - **1080×1080** - HD Small Square
  - **1920×1920** - HD Big Square
  - **3840×2160** - 4K Horizontal (ultra HD)
  - **2160×3840** - 4K Vertical (portrait 4K)
  - **2160×2160** - 4K Small Square
  - **3840×3840** - 4K Big Square
  - **3500×1500** - Website Banner (wide aspect)
  - **1080×1440** - Instagram Post (4:5 ratio)
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
- Use for precise output sizing before export

#### Clipping Planes
- **Type**: Dual-range slider
- **Near Plane Range**: 0.01 – 500
- **Far Plane Range**: 500 – 20000
- **Defaults**: Near = 0.01, Far = 20000
- Controls which parts of 3D space are visible
- **Near**: Objects closer than this are not rendered
- **Far**: Objects farther than this are not rendered
- Adjust if geometry appears clipped at extreme zoom levels
- Near plane minimum is enforced at 0.01 to prevent visual glitches

---

### Geometry Section

Control the appearance and scale of the zigzag patterns.

#### Geometry Height
- **Range**: 10 – 240
- **Default**: 120
- **Units**: Pixels
- Controls the vertical height of each zigzag segment
- Higher values = taller zigzag patterns
- Affects the overall scale of each line
- Also influences the spawn distance boundary

#### Line Thickness
- **Range**: 1 – 20
- **Default**: 12
- **Units**: Pixels
- **Precision**: 0.1 increments
- Controls the width of the zigzag ribbons
- Higher values = thicker lines
- Can be modulated with Random Thickness (see Modulations section)

#### Z-Plane Rotation
- **Range**: 0° – 360°
- **Default**: 0°
- **Units**: Degrees
- Rotates the entire geometry around the Z-axis (perpendicular to screen)
- 0° = standard horizontal zigzag orientation
- 90° = vertical zigzag orientation
- Useful for creating different compositions

#### Scale
- **Range**: 100% – 400%
- **Default**: 100%
- **Units**: Percentage
- Uniformly scales all geometry
- Does not affect screen-space measurements (like spawn distance)
- 200% = geometry appears twice as large
- Use to zoom geometry without changing camera distance

#### Field of View
- **Range**: 0.01° – 180°
- **Default**: 60°
- **Units**: Degrees
- **Precision**: 0.01 increments
- Controls the camera's field of view (lens angle)
- **Lower values** (20°-40°) = telephoto lens, less distortion, flattened perspective
- **Default** (60°) = standard perspective similar to human vision
- **Higher values** (90°-120°) = wide-angle lens, more distortion, fisheye effect
- **NEW IN v10**: Automatically adjusts camera distance to maintain apparent size
  - Only the perspective distortion changes, not the geometry scale
  - Console logs show the distance compensation calculation

---

### Behavior Section

Control animation timing and movement.

#### Emit Rate
- **Range**: 0.1 – 10 lines/second
- **Default**: 1.5
- **Units**: Lines emitted per second
- **Precision**: 0.1 increments
- Controls how frequently new zigzag lines spawn
- Higher values = more lines on screen, denser animation
- Affected by Ambient Speed Master multiplier
- Lower values (0.1-0.5) = sparse, minimal aesthetic
- Higher values (5-10) = dense, busy animation

#### Speed
- **Range**: 10 – 500 px/second
- **Default**: 80
- **Units**: Pixels per second
- **Step**: 5
- Controls how fast lines move through space
- Higher values = faster animation
- Can be modulated with Random Speed (see Modulations section)
- Affected by Ambient Speed Master multiplier
- Lower speeds (10-30) = slow, meditative
- Higher speeds (200-500) = rapid, energetic

---

### Modulations Section

Add variation and organic movement to the animation.

#### Random Thickness
- **Shortcut**: t (toggles checkbox on/off)
- **Type**: Checkbox
- **Default**: Off
- When enabled, each line gets a randomly varied thickness
- Variation is controlled by the Thickness Range sliders below
- Uses Perlin noise + sine wave for smooth, organic variation
- Creates visual interest and breaks uniformity

#### Thickness Range
- **Type**: Dual-range slider
- **Range**: 10% – 400%
- **Defaults**: Min = 10%, Max = 200%
- **Units**: Percentage of base Line Thickness
- Only active when Random Thickness is enabled
- **Min**: Minimum thickness multiplier (10% = very thin lines)
- **Max**: Maximum thickness multiplier (200% = twice as thick)
- Range between min and max determines variation intensity
- Example: Base thickness 12px with range 50%-150% produces lines between 6px and 18px

#### Random Speed
- **Shortcut**: m (toggles checkbox on/off)
- **Type**: Checkbox
- **Default**: Off
- When enabled, each line gets a randomly varied speed
- Variation is controlled by the Speed Range sliders below
- Uses Perlin noise + sine wave for smooth variation
- Creates depth and organic rhythm

#### Speed Range
- **Type**: Dual-range slider
- **Range**: 50% – 200%
- **Defaults**: Min = 50%, Max = 150%
- **Units**: Percentage of base Speed
- Only active when Random Speed is enabled
- **Min**: Minimum speed multiplier (50% = half speed)
- **Max**: Maximum speed multiplier (150% = 50% faster)
- Example: Base speed 80px/s with range 50%-150% produces speeds between 40-120 px/s

#### Ambient Speed Master
- **Range**: 5% – 100%
- **Default**: 100%
- **Units**: Percentage
- Global speed multiplier affecting both emit rate and line speed
- Does not affect individual random variations, only the base values
- Lower values (5%-30%) = slow motion effect
- 50% = half speed
- 100% = normal speed
- Useful for fine-tuning animation tempo without changing individual parameters

---

### Colors Section

Choose the color of your zigzag patterns.

#### Color Palette
- **Type**: Color swatches
- **Default**: White
- Click any swatch to change the line color
- Active color shows white border
- **Available colors**:
  - White (#FFFFFF)
  - Light Blue (#50C8FF)
  - Pink/Red (#FF5078)
  - Mint Green (#50FFA0)
  - Gold/Yellow (#FFC83C)
  - Purple (#C850FF)
- Color applies to all lines with alpha transparency for fade effects
- More colors can be added by editing the HTML

---

### Export Section

Export your creations as images or videos.

#### Export PNG
- **Shortcuts**: p or Shift+P
- Captures current frame as PNG image
- Uses canvas data URL
- Downloads immediately to browser's downloads folder
- Filename: `zigzag-emitter-YYYY-MM-DD-HHMMSS.png`
- Resolution matches current canvas size (respects Framebuffer Resolution if enabled)

#### Export SVG
- **Shortcuts**: s or Shift+S
- Exports current frame as vector SVG file
- Resolution-independent format
- Perfectly scalable to any size
- All lines are exported as `<path>` elements with precise geometry
- Filename: `zigzag-emitter-YYYY-MM-DD-HHMMSS.svg`
- Ideal for print, web graphics, or further editing in vector tools

#### Export Depth Map
- **Shortcuts**: d or Shift+D
- **NEW IN v12**: Exports depth information as greyscale PNG image
- Uses CPU-based projection with exact camera math matching SVG export
- **White pixels** = closest objects to camera
- **Black pixels** = farthest objects from camera
- Depth range is **auto-calculated** from live geometry at export time
- Applies power curve (gamma 0.6) for enhanced contrast
- **Invert checkbox**: Reverses depth encoding (black = near, white = far)
- Perfect pixel alignment with PNG export (same projection)
- **Use cases**:
  - Displacement maps for post-processing
  - Depth-based effects in After Effects/Blender
  - Z-depth compositing
  - 3D reconstruction reference
  - Focus effects simulation
- Filename: `zigzag-depthmap-YYYY-MM-DD-HHMMSS.png`
- Technical: Uses `scanDepthRange()` for automatic near/far cutoff detection

#### Duration
- **Range**: 1 – 60 seconds
- **Default**: 10 seconds
- Sets the length of video recording
- Preview shows total frame count based on frame rate

#### Frame Rate (FPS)
- **Range**: 24 – 60 frames/second
- **Default**: 30 FPS
- Controls video smoothness and file size
- 24 FPS = cinematic, smaller file
- 30 FPS = standard web video
- 60 FPS = ultra-smooth, larger file

#### Format
- **Type**: Toggle buttons
- **Options**: WebM, MP4
- **Default**: WebM
- **WebM**: Better quality, browser-native, no encoding needed
- **MP4**: Wider compatibility, may require conversion
- Note: Actual format depends on browser capabilities

#### Record Video
- **Shortcut**: v
- Starts frame-by-frame video capture using CCapture.js
- Animation runs at fixed timestep regardless of actual framerate
- Progress indicator shows percentage complete
- Deterministic rendering ensures consistent output
- When complete, video downloads automatically
- **Important**: Do not interact with page during recording
- Large durations at high FPS may take several minutes to process

---

## Export Formats

### PNG Export
- **Format**: Raster image (Portable Network Graphics)
- **Use case**: Social media, presentations, quick sharing
- **Resolution**: Matches current canvas resolution
- **Transparency**: Opaque black background
- **Quality**: Lossless compression
- **File size**: ~100KB - 2MB depending on resolution

### SVG Export
- **Format**: Vector graphics (Scalable Vector Graphics)
- **Use case**: Print, web graphics, Illustrator/Inkscape editing
- **Resolution**: Infinite (vector)
- **Transparency**: Defined per path element
- **Editability**: Full - can modify paths, colors, transforms
- **File size**: ~10KB - 500KB depending on line count
- **Note**: Export captures current frame only; does not animate

### Depth Map Export
- **Format**: Greyscale PNG (Portable Network Graphics)
- **Use case**: Displacement mapping, Z-depth compositing, post-processing effects
- **Resolution**: Matches current canvas resolution
- **Encoding**: White = near objects, Black = far objects (invertible)
- **Depth range**: Auto-calculated from live geometry
- **Quality**: Lossless greyscale with gamma 0.6 power curve
- **File size**: ~50KB - 1MB depending on resolution
- **Technical**: CPU-based projection with pixel-perfect alignment to PNG export
- **Note**: Captures current frame depth information only

### Video Export
- **Format**: WebM or MP4 (browser-dependent)
- **Use case**: Video platforms, social media, portfolio
- **Resolution**: Matches current canvas resolution
- **Frame capture**: Sequential frame-by-frame recording
- **Determinism**: Identical output for same settings
- **File size**: Varies greatly by duration, FPS, and resolution
  - Example: 10 sec @ 30fps @ 1920×1080 ≈ 5-20MB
- **Processing time**: Real-time to several minutes depending on complexity

---

## Tips & Best Practices

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
- **Z-Plane rotation** creates diagonal or vertical compositions

### VR / Stereoscopic Viewing
- Enable Stereoscopic View for side-by-side output
- Start with **Eye Separation = 30**, adjust to taste
- Larger separation = stronger 3D effect but may cause eye strain
- For cross-eyed viewing: sit ~2 feet from screen, cross eyes until images merge
- For VR headsets: export video in framebuffer mode at appropriate resolution

### Camera Control
- **Zoom out** (scroll) before rotating to see full spatial structure
- **Pan** to reframe composition without rotating
- **Reset camera** (r or R key): Restores default camera position and rotation
- **Reset zoom** (0 key): Returns camera distance to default 600 units
- Camera state is saved with your configuration

### Recording High-Quality Videos
1. Set desired **Framebuffer Resolution** (e.g., 3840×2160 for 4K)
2. Choose appropriate **Duration** (5-15 seconds often sufficient)
3. Select **Frame Rate**: 30 FPS is standard, 60 FPS for smooth motion
4. Click **Record Video** and wait for processing
5. **Do not interact** with the browser during recording
6. Video downloads automatically when complete

### Exporting for Web/Social
- **Instagram**: Use 1080×1080 or 1080×1440 preset
- **Twitter/X**: 1920×1080 works well
- **Website banner**: Use 3500×1500 preset
- **High-quality still**: Export SVG, then rasterize at target size
- **Animated GIF**: Record video, convert using external tool

### Troubleshooting
- **Lines not appearing**: Check Emit Rate > 0, adjust camera distance
- **Clipping issues**: Adjust Near/Far clipping planes
- **Panning not working**: Ensure camera distance ≥ 50 (check console logs)
- **Settings not saving**: Check browser localStorage permissions
- **Video file too large**: Reduce duration, FPS, or resolution
- **Choppy animation**: Lower emit rate or close other programs

---

## Version History

### v12 (Current)
- **NEW**: Centralized keyboard shortcuts system
  - All 22 keyboard shortcuts defined in one configuration array
  - Support for modifier keys (Ctrl, Shift)
  - Consistent action dispatch via named functions
- **NEW**: Depth map export feature
  - CPU-based depth projection with auto-ranging
  - Greyscale PNG output with gamma correction
  - Pixel-perfect alignment with main PNG export
  - Invertible depth encoding
- **IMPROVED**: Export functions consolidated
  - Keyboard shortcuts trigger actual button click handlers
  - Removes duplicate export logic
  - Ensures 3D projection consistency
- **FIXED**: Code cleanup
  - Removed eval() fallback in keyboard handler (security)
  - Removed unused depth map parameters
  - Removed dead CSS rules
  - Consolidated button styling into CSS classes

### v11 (Experimental)
- Depth map export development
- CPU projection technique refinement

### v10
- **NEW**: FOV changes automatically compensate camera distance
  - Field of view adjustments no longer scale geometry
  - Only perspective distortion changes
  - Maintains consistent apparent size in frame
- **FIXED**: FOV maximum limited to 180° (was 240°)

### v9
- Mouse-based camera controls (orbit, pan, zoom)
- Console logging for debugging
- Improved camera distance validation
- Enhanced panning sensitivity

### Earlier Versions
- Stereoscopic viewing mode
- Framebuffer resolution control
- Random thickness/speed modulations
- SVG export capability
- Video recording with CCapture.js
- Real-time parameter adjustment
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
.
.
.
.
.
.
.


