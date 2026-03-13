# ZigMap Emitter - Quick User Manual

Startup Guide

---

## Getting Started

1. **Open** `index.html` in your web browser
2. **Watch** the animated zigzag patterns
3. **Interact** using your mouse
4. **Adjust** settings in the left panel
5. **Export** your creation as images or videos


---

## Mouse Controls

| What You Want | How To Do It |
|---------------|--------------|
| **Rotate the view** | Click and drag with left mouse button |
| **Move the view** | Click and drag with right mouse button |
| **Zoom in/out** | Scroll your mouse wheel |

💡 **Tip**: Mouse controls only work when your cursor is over the animation area (not the control panel).

---

## Essential Keyboard Shortcuts

| Key | What It Does |
|-----|--------------|
| **H** | Hide/show the control panel |
| **Enter** | Fullscreen mode |
| **p** | Save current frame as PNG image (includes overlay) |
| **s** | Save current frame as SVG (vector) |
| **d** | Save depth map |
| **v** | Start/stop video recording (includes overlay) |
| **r** | Reset camera to default position |
| **0** (zero) | Reset zoom level |
| **1** | Switch to Color Palette 1 |
| **2** | Switch to Color Palette 2 |
| **3** | Switch to Color Palette 3 |
| **4** | Switch to Color Palette 4 |
| **y** | Toggle stereoscopic (VR/3D) view |

💡 **Tip**: PNG and video exports automatically include your overlay image!

---

## Main Controls (Left Panel)

### 💾 Project

- **Save button**: Download your settings, states, and camera positions as a JSON file
- **Load button**: Open a previously saved project file

💡 **First-Time User**: When you open the app for the first time, it automatically loads a starter project with example states!

### 🎭 States

Save and recall complete snapshots of your parameters, colors, and camera position:

- **List of States**: All your saved states appear here
- **Click a state** to load it (smooth transitions!)
- **Save button**: Capture current setup as a new state
- **Update button**: Overwrite selected state with current setup
- **Delete button**: Remove selected state
- **Rename**: Click on state name to edit it

**Transition Controls**:
- **State Transition** (0-30s): How long it takes to smoothly transition between states
- **Color Transition** (0-30s): How long color palette changes take

**Auto-Trigger**:
- ☑️ Check **Auto-Trigger** to automatically switch between states
- **Frequency slider** (5-120s): How often to switch to a random state
- 💡 Uses truly random selection - no patterns or sequences

### 🎨 Color Palettes

**Four distinct color palettes**, each with 4 color slots:
- **Click palette buttons (1-4)** at the top to switch between palettes (or use keys 1-2-3-4)
- **Click color pickers** to customize each color
- **Set roles** for each color: Line (used for zigzag lines) / Background / None (disabled)
- **Color Depth Separation**: Slider that controls Z-axis spacing between lines of different colors (prevents visual overlapping)

💡 **Tip**: When switching palettes, all existing lines smoothly transition to the new colors.

### 🎬 Rendering

Controls for output resolution (affects exports):

- **Framebuffer Resolution checkbox**: Enable for fixed render size
- **Preset dropdown**: Common sizes (HD, 4K, Square, Instagram formats)
- **Resolution fields**: Custom width × height in pixels

### 👁️ View

Camera and display settings:

- **Field of View**: Adjust the "lens" angle (60° is normal, 90°+ is dramatic)
- **Clipping Planes**: Near/Far visibility range
- **Stereoscopic View (VR)**: ☑️ Check for VR/3D side-by-side mode
- **Eye Separation**: Distance between stereo cameras

### 📐 Geometry

- **Segment Length**: How long each zigzag segment is
- **Line Thickness**: How thick the lines are (bigger = thicker)
- **Emitter Rotation**: Rotate the entire emission pattern
- **Geometry Scale**: Overall size multiplier
- **Fade Duration**: How long lines take to fade in/out

### 🎪 Animation

- **Emit Rate**: How many new lines appear per second (higher = busier)
- **Speed**: How fast lines move (higher = faster animation)
- **Ambient Speed Master**: Global speed multiplier (slows/speeds everything)

### 🎲 Modulations

Add variety to your animations:

- **Random Thickness**: ☑️ Check to vary line thickness randomly
- **Random Speed**: ☑️ Check to vary line speed randomly
- **Thickness Range**: Min/max values for random thickness
- **Speed Range**: Min/max values for random speed
- **Ambient Speed Master**: Fine-tune animation speed

### 🖼️ Overlay

Add static images on top of your animation:

- **Show Overlay checkbox**: Toggle overlay visibility
- **Load Image button**: Import PNG, JPG, or SVG files
- **Scale** (10-200%): Resize the overlay image
- **Opacity** (0-100%): Transparency level
- **Position X/Y** (0-100%): Place the image anywhere on screen
- **Clear Image button**: Remove current overlay

💡 **Tip**: Overlays are included in PNG and video exports!

---

## Exporting Your Work

### Quick Export (Current Frame)

1. **PNG Image**: Press **p** (or click "Export PNG" button)
   - Good for: social media, quick sharing
   - **Includes overlay image** if you have one loaded
   - Automatically adjusts for high-resolution (Retina) displays
   - File downloads automatically

2. **SVG Vector**: Press **s** (or click "Export SVG" button)
   - Good for: printing, design work, logos
   - Can be edited in Illustrator, Inkscape, etc.
   - Does not include overlay (vector only)

3. **Depth Map**: Press **d** (or click "Export Depth Map" button)
   - Good for: 3D effects, post-production
   - White = close to camera, Black = far away

💡 **Overlay Tip**: PNG exports automatically composite your overlay image with the correct scale, opacity, and position!

### Video Recording

1. Set **Duration** (how many seconds)
2. Set **Frame Rate** (30 FPS is standard)
3. Click **Record Video** button (or press **v**)
4. **Wait** - don't touch anything during recording
5. Video downloads automatically when done

⚠️ **Important**: 
- Don't click or interact with the page while recording!
- **Overlay images are included** in video exports
- Recording composites overlay on every frame

---

## Common Tasks

### Switch Color Palettes
1. Click a palette button (1-4) at the top, or press keys **1**, **2**, **3**, or **4**
2. Click any color picker to customize colors
3. Set which colors are used for lines vs background
4. Adjust **Color Transition** slider in States panel for smooth palette changes

### Hide the Controls
Press **H** to get a clean view for screenshots or fullscreen presentations

### Make It Busier
Increase **Emit Rate** slider (more lines appear)

### Make It Calmer
Decrease **Emit Rate** slider (fewer lines)

### Make Lines Thicker/Thinner
Adjust **Line Thickness** slider

### Speed Up or Slow Down
Adjust **Speed** slider or **Ambient Speed Master**

### Add an Overlay Image
1. In the **Overlay** panel, click **Load Image**
2. Choose a PNG, JPG, or SVG file
3. Adjust **Scale**, **Opacity**, and **Position** sliders
4. ☑️ Check **Show Overlay** to make it visible
5. Export with **p** or **v** - overlay is included!

### Create Smooth Transitions Between States
1. Save multiple states with different settings
2. Adjust **State Transition** slider (0-30s) in States panel
3. Click different states - watch them smoothly morph!

### Automatic State Changes
1. Save 3+ states with varied settings
2. In the **States** panel, ☑️ check **Auto-Trigger**
3. Adjust **Frequency** slider (5-120 seconds)
4. Watch as the app randomly switches between states!

### Add Variety
Check ☑️ **Random Thickness** and **Random Speed**

### Reset Everything
- Press **r** to reset camera position
- Press **0** to reset zoom
- Reload the page to reset all settings

---

## Resolution & Output Sizes

### For Fixed Output Size

1. Check ☑️ **Framebuffer Resolution**
2. Choose a **Preset** from dropdown:
   - **1920×1080** - Standard HD (Instagram, YouTube)
   - **1080×1080** - Square (Instagram posts)
   - **3840×2160** - 4K quality
   - **1080×1440** - Instagram portrait
3. Export normally

### For Window Size
Leave **Framebuffer Resolution** unchecked - it will use your browser window size.

---

## Quick Tips

✅ **Best settings for beginners**:
- Emit Rate: 1.5
- Speed: 80
- Line Thickness: 12
- Keep Random options OFF at first
- Try the auto-loaded starter project!

✅ **For smooth animation**:
- Lower emit rate = better performance
- Close other browser tabs
- Use State Transition sliders for smooth changes

✅ **For dramatic effects**:
- Wide Field of View (90°-120°)
- Enable Random Speed and Thickness
- Try different Emitter Rotation angles
- Add a semi-transparent overlay image

✅ **For clean, minimal look**:
- Low Emit Rate (0.5-1.0)
- High Speed (150-300)
- No random modulations
- Long transition times (10-20s) for smooth changes

✅ **For presentations**:
- Save multiple states with different moods
- Enable Auto-Trigger for automatic variety
- Add brand logo as overlay
- Press **H** to hide controls
- Press **Enter** for fullscreen

✅ **For high-quality exports**:
- Enable Framebuffer Resolution
- Choose 4K preset (3840×2160)
- Set up overlay before exporting
- Use 30 FPS for smooth video

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Nothing appears** | Refresh the page; check that Emit Rate > 0 |
| **Too busy/cluttered** | Lower the Emit Rate slider |
| **Too slow** | Increase Speed slider |
| **Lines disappear** | They're moving out of view - this is normal |
| **Can't rotate camera** | Make sure cursor is over animation, not control panel |
| **Video won't download** | Wait longer - large videos take time to process |
| **Fullscreen won't exit** | Press **Escape** key |
| **Overlay not showing** | Check ☑️ Show Overlay is enabled; adjust opacity |
| **States load to wrong position** | Camera position is saved with each state; click state again |
| **Can't rename state** | Click directly on the state name text |
| **Keyboard shortcuts don't work** | Make sure you're not renaming a state or typing in a field |

---

## What the Files Do

- **ZigzagEmitter_12.html** - The main application (open this!)
- **User-Manual.md** - This simple guide (you're reading it)
- **README.md** - Complete detailed guide with all features
- **Documentation.md** - Technical documentation for developers
- **Saved .json files** - Your saved settings (load these to restore)

---

## Need More Help?

📖 **For detailed information**: See [README.md](README.md)  
🔧 **For technical details**: See [Documentation.md](Documentation.md)

---

**Quick reminder**: Your settings automatically save in your browser, so when you reload the page, everything will be as you left it!

Enjoy creating! ✨
