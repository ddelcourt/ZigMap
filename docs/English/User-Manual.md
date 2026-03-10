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
| **Tab** | Hide/show the control panel |
| **Enter** | Fullscreen mode |
| **p** | Save current frame as PNG image |
| **s** | Save current frame as SVG (vector) |
| **d** | Save depth map |
| **v** | Start/stop video recording |
| **r** | Reset camera to default position |
| **0** (zero) | Reset zoom level |
| **1** | Switch to Color Palette 1 |
| **2** | Switch to Color Palette 2 |
| **3** | Switch to Color Palette 3 |
| **4** | Switch to Color Palette 4 |
| **y** | Toggle stereoscopic (VR/3D) view |

---

## Main Controls (Left Panel)

### 🎨 Color Palettes
**Four distinct color palettes**, each with 4 color slots:
- **Click palette buttons (1-4)** at the top to switch between palettes (or use keys 1-2-3-4)
- **Click color pickers** to customize each color
- **Set roles** for each color: Line (used for zigzag lines) / Background / None (disabled)
- **Color Depth Separation**: Slider that controls Z-axis spacing between lines of different colors (prevents visual overlapping)

💡 **Tip**: When switching palettes, all existing lines smoothly transition to the new colors over 3 seconds.

### 📐 Basic Settings

- **Geometry Height**: How tall each zigzag is (bigger = taller patterns)
- **Line Thickness**: How thick the lines are (bigger = thicker)
- **Emit Rate**: How many new lines appear per second (higher = busier)
- **Speed**: How fast lines move (higher = faster animation)

### 🎬 Animation Effects

- **Random Thickness**: ☑️ Check to vary line thickness rando (or press **y**)mly
- **Random Speed**: ☑️ Check to vary line speed randomly
- **Ambient Speed Master**: Slow down or speed up everything (slider)

### 📷 Camera & View

- **Stereoscopic View**: ☑️ Check for VR/3D side-by-side mode
- **Field of View**: Adjust the "lens" angle (60° is normal)
- **Z-Plane Rotation**: Rotate the entire pattern

### 💾 Save & Load

- **Save button**: Download your settings as a file
- **Load button**: Open a previously saved settings file

---

## Exporting Your Work

### Quick Export (Current Frame)

1. **PNG Image**: Press **p** (or click "Export PNG" button)
   - Good for: social media, quick sharing
   - File downloads automatically

2. **SVG Vector**: Press **s** (or click "Export SVG" button)
   - Good for: printing, design work, logos
   - Can be edited in Illustrator, Inkscape, etc.

3. **Depth Map**: Press **d** (or click "Export Depth Map" button)
   - Good for: 3D effects, post-production
   - White = close to camera, Black = far away

### Video Recording

1. Set **Duration** (how many seconds)
2. Set **Frame Rate** (30 FPS is standard)
3. Click **Record Video** button (or press **v**)
4. **Wait** - don't touch anything during recording
5. Video downloads automatically when done

⚠️ **Important**: Don't click or interact with the page while recording!

---

## Common Tasks

### Make ItColors
1. Click a palette button (1-4) at the top, or press keys **1**, **2**, **3**, or **4**
2. Click any color picker to customize colors
3. Set which colors are used for lines vs backgroundn)

### Hide the Controls
Press **Tab** to get a clean view for screenshots

### Change the Color
Click any color circle in the Colors section

### Make It Busier
Increase **Emit Rate** slider (more lines appear)

### Make It Calmer
Decrease **Emit Rate** slider (fewer lines)

### Make Lines Thicker/Thinner
Adjust **Line Thickness** slider

### Speed Up or Slow Down
Adjust **Speed** slider or **Ambient Speed Master**

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

✅ **For smooth animation**:
- Lower emit rate = better performance
- Close other browser tabs

✅ **For dramatic effects**:
- Wide Field of View (90°-120°)
- Enable Random Speed and Thickness
- Try different Z-Plane Rotation angles

✅ **For clean, minimal look**:
- Low Emit Rate (0.5-1.0)
- High Speed (150-300)
- No random modulations

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
