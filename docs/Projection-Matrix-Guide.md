# Projection Matrix Guide: WebGL 3D to SVG 2D Conversion

**ZigzagEmitter Project - Technical Deep Dive**  
*Author: Technical Documentation*  
*Date: March 8, 2026*

---

## 1. Introduction: The Challenge

### The Problem

In modern generative graphics, we often render complex 3D scenes using hardware-accelerated WebGL (GPU) but need to export them as vector graphics (SVG) for print, further editing, or archival purposes. This presents a fundamental technical challenge:

**WebGL uses the GPU's built-in transformation pipeline**, which handles:
- Vertex transformations
- Matrix multiplications
- Perspective division
- Viewport mapping

**SVG is a 2D vector format** that only understands:
- 2D coordinate points
- Paths and polygons
- No concept of 3D depth or projection

**The Challenge:** We must replicate the entire 3D transformation pipeline—normally handled invisibly by the GPU—using pure CPU-based JavaScript calculations to generate correct 2D SVG coordinates that match the visual output of the 3D WebGL scene.

### Why This Matters

1. **Visual Fidelity**: The SVG export must be pixel-perfect with the WebGL render
2. **Reusability**: Understanding the math enables adaptation to other projects
3. **Debugging**: When exports look wrong, you need to know which transformation failed
4. **Flexibility**: CPU-based projection allows depth maps, custom effects, and analytical processing

### The ZigzagEmitter Use Case

The ZigzagEmitter renders animated zigzag ribbons in 3D space with:
- User-controllable camera (rotation, zoom, pan)
- Adjustable field of view
- Near/far clipping planes
- 3D rotations applied to the geometry

The user can export any frame as SVG, requiring real-time reconstruction of all these transformations.

---

## 2. The Logic: A Literal Explanation

### The Transformation Pipeline

Think of the 3D-to-2D process as a series of coordinate system transformations, like changing reference frames in physics:

#### **Step 1: Local Space → World Space**

Each zigzag ribbon exists in its own **local coordinate system**. For example, a ribbon might have vertices at positions like `(-100, 50)` in its own space.

To place this ribbon in the scene, we transform these local coordinates into **world space**:
```
worldX = (lineX - canvasWidth/2 + localX) × scale
worldY = (lineY - canvasHeight/2 + localY) × scale
worldZ = 0  (ribbons are flat in XY plane)
```

**Why subtract canvas center?** p5.js WEBGL mode places the origin `(0,0,0)` at the screen center, not the top-left corner.

#### **Step 2: Apply 3D Rotations**

The geometry undergoes **three sequential rotations**, applied in this specific order:

1. **rotateZ** (emitter rotation): Spins the ribbons around the Z-axis (like a wheel)
2. **rotateY** (horizontal camera orbit): Rotates around the vertical axis (look left/right)
3. **rotateX** (vertical camera orbit): Rotates around the horizontal axis (look up/down)

**Critical insight**: Rotation order matters! `rotateX(rotateY(point))` produces different results than `rotateY(rotateX(point))`.

Each rotation is a **3D coordinate transformation** using trigonometric functions (sine and cosine).

#### **Step 3: Camera Translation**

After rotation, we simulate the camera's distance from the scene:

```
viewZ = rotatedZ - totalCameraDistance
```

**Where:**
- `totalCameraDistance` = default p5 camera position + user's zoom distance
- Subtracting moves points "away" from the camera in negative Z

#### **Step 4: Frustum Clipping**

Before projection, we check if the point is within the viewing frustum (the visible pyramid):

```
if (viewZ >= -near || viewZ <= -far) → discard point
```

Points too close (behind near plane) or too far (beyond far plane) are culled.

#### **Step 5: Perspective Projection**

This is the **magic step** where 3D becomes 2D. Objects farther away appear smaller, creating realistic depth.

**The perspective formula:**
```
scale = defaultCameraZ / -viewZ
screenX = viewX × scale + canvasWidth/2
screenY = viewY × scale + canvasHeight/2
```

**What this means:**
- Points farther away (larger negative `viewZ`) have smaller scale factors
- Points closer have larger scale factors (appear bigger)
- The division by `viewZ` creates the "converging to a point" effect of perspective

#### **Step 6: SVG Output**

The final `(screenX, screenY)` coordinates are written to the SVG file as 2D points. The depth information is lost (or optionally stored for depth maps).

---

## 3. The Algorithm: Code Implementation

### 3.1 High-Level Pseudocode

```
FOR each ribbon in scene:
  localVertices = ribbon.buildVertices()  // e.g., zigzag points
  
  FOR each vertex in localVertices:
    // Transform to world space
    worldPos = localToWorld(vertex, ribbon.position, scale)
    
    // Apply rotations
    rotated1 = rotateZ(worldPos, emitterAngle)
    rotated2 = rotateY(rotated1, cameraYaw)
    rotated3 = rotateX(rotated2, cameraPitch)
    
    // Move to view space
    viewPos = translate(rotated3, -cameraDistance)
    
    // Clip against frustum
    IF viewPos.z outside [near, far]:
      SKIP this vertex
    
    // Perspective divide
    screenPos = perspectiveProject(viewPos, fov, canvasSize)
    
    // Store 2D coordinate
    svgPoints.push(screenPos)
  
  // Create SVG polygon from 2D points
  svgPolygon = new Polygon(svgPoints)
  svgDocument.append(svgPolygon)
```

### 3.2 Actual JavaScript Implementation

Here's the core transformation code from ZigzagEmitter:

```javascript
// Rotation helper functions (rotation matrices as pure functions)
const rotX = (x, y, z, angle) => ({
  x: x,
  y: y * Math.cos(angle) - z * Math.sin(angle),
  z: y * Math.sin(angle) + z * Math.cos(angle)
});

const rotY = (x, y, z, angle) => ({
  x: x * Math.cos(angle) + z * Math.sin(angle),
  y: y,
  z: -x * Math.sin(angle) + z * Math.cos(angle)
});

const rotZ = (x, y, z, angle) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
  z: z
});

// Camera setup (pre-computed once per export)
const fovRad = params.fov * Math.PI / 180;
const defaultCameraZ = (H / 2) / Math.tan(fovRad / 2);
const totalDistance = defaultCameraZ + camera.distance;

// Core projection function
function projectPoint(x, y, z) {
  // Step 1: Rotate around Z (emitter spin)
  let pt = rotZ(x, y, z, params.emitterRotation * Math.PI / 180);
  
  // Step 2: Rotate around Y (horizontal orbit)
  pt = rotY(pt.x, pt.y, pt.z, camera.rotationY);
  
  // Step 3: Rotate around X (vertical orbit)
  pt = rotX(pt.x, pt.y, pt.z, camera.rotationX);
  
  // Step 4: Translate to view space (camera distance)
  pt.z -= totalDistance;
  
  // Step 5: Frustum culling
  if (pt.z >= -params.near || pt.z <= -params.far) {
    return null;  // Point is outside visible range
  }
  
  // Step 6: Perspective projection
  const scale = defaultCameraZ / -pt.z;
  return {
    x: pt.x * scale + W / 2,
    y: pt.y * scale + H / 2
  };
}

// Convert local ribbon coordinates to world space, then project
const scaleVal = params.geometryScale / 100;

const toScreen = (line, localPoints) => localPoints
  .map(pt => ({
    x: ((line.x - W / 2) + pt.x) * scaleVal,
    y: ((line.y - H / 2) + pt.y) * scaleVal,
    z: 0
  }))
  .map(pt => projectPoint(pt.x, pt.y, pt.z))
  .filter(Boolean);  // Remove nulls (clipped points)

// Generate SVG polygon
const screenPoints = toScreen(line, localVertices);
const svgPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
svgPolygon.setAttribute('points', 
  screenPoints.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
);
```

### 3.3 Key Implementation Details

#### Coordinate System Conversion
```javascript
// p5.js WEBGL uses center origin, but line positions are stored in canvas coordinates
worldX = (line.x - W/2 + localX) * scale
worldY = (line.y - H/2 + localY) * scale
```

#### Rotation Order is Critical
The order **Z → Y → X** matches p5.js WEBGL's transformation stack. Changing this order will produce incorrect results.

#### Negative Z Convention
OpenGL (and p5.js) uses a **right-handed coordinate system** where:
- +X = right
- +Y = up  
- **-Z = forward** (into the screen)

This is why we use `-viewZ` in divisions and check `z <= -far`.

#### Camera Distance Calculation
```javascript
// p5.js WEBGL's default camera position
defaultCameraZ = (height / 2) / tan(fov / 2)

// User's zoom adds to this
totalDistance = defaultCameraZ + userZoomDistance
```

This formula ensures the field of view behaves identically to p5's WEBGL renderer.

---

## 4. The Mathematics: Theory and Proofs

### 4.1 Rotation Matrices

Each rotation is a **3×3 orthogonal matrix** multiplication. 

#### Rotation Around X-Axis (Pitch)
```
Rₓ(θ) = ┌ 1    0        0     ┐
        │ 0  cos(θ)  -sin(θ) │
        └ 0  sin(θ)   cos(θ) ┘

[x']   [1    0        0     ] [x]
[y'] = [0  cos(θ)  -sin(θ) ] [y]
[z']   [0  sin(θ)   cos(θ) ] [z]

x' = x
y' = y·cos(θ) - z·sin(θ)
z' = y·sin(θ) + z·cos(θ)
```

#### Rotation Around Y-Axis (Yaw)
```
Rᵧ(θ) = ┌ cos(θ)   0  sin(θ) ┐
        │   0      1    0    │
        └-sin(θ)   0  cos(θ) ┘

x' =  x·cos(θ) + z·sin(θ)
y' =  y
z' = -x·sin(θ) + z·cos(θ)
```

#### Rotation Around Z-Axis (Roll)
```
Rᴢ(θ) = ┌ cos(θ)  -sin(θ)  0 ┐
        │ sin(θ)   cos(θ)  0 │
        └   0        0     1 ┘

x' = x·cos(θ) - y·sin(θ)
y' = x·sin(θ) + y·cos(θ)
z' = z
```

### 4.2 Composite Rotation

When applying rotations in sequence: **Z → Y → X**, the combined transformation is:

```
R_combined = Rₓ · Rᵧ · Rᴢ

[x'']   
[y''] = Rₓ(θₓ) · Rᵧ(θᵧ) · Rᴢ(θᴢ) · [x]
[z'']                               [y]
                                    [z]
```

**Important:** Matrix multiplication is **not commutative**: `A·B ≠ B·A`

This is why rotation order matters. Rotating around X then Y produces different results than Y then X.

### 4.3 Perspective Projection Formula

The perspective transformation is derived from **similar triangles** in 3D space.

#### Geometric Derivation

Imagine looking at a 3D point `P = (x, y, z)` from a camera at position `(0, 0, 0)`:

```
                P(x, y, z)
               /|
              / |
             /  | y
            /   |
           /    |
    Camera ──────┘
         z distance
         
    Screen plane at distance d
```

By similar triangles:
```
screenY / d = y / z
screenY = (y · d) / z
```

The **focal length** `d` is calculated from field of view:
```
d = (canvasHeight / 2) / tan(fov / 2)
```

This ensures the frustum's vertical extent matches the canvas height at the focal plane.

#### Complete Projection Equations

```
Given point (x, y, z) in view space:

scale = focalLength / -z

screenX = x · scale + canvasWidth / 2
screenY = y · scale + canvasHeight / 2
```

**Why divide by `-z`?** The camera looks down the **negative Z axis**. Points with `z = -100` are farther than `z = -10`, so we use the absolute value via negation.

### 4.4 Field of View (FOV) and Focal Length

The relationship between FOV and focal length:

```
tan(fov/2) = (canvasHeight/2) / focalLength

Therefore:
focalLength = (canvasHeight/2) / tan(fov/2)
```

**Intuition:**
- **Larger FOV** (e.g., 90°) → shorter focal length → more "wide angle" distortion
- **Smaller FOV** (e.g., 30°) → longer focal length → more "telephoto" compression

This is identical to physical camera optics!

### 4.5 Frustum Clipping Planes

The viewing frustum is a truncated pyramid defined by:

```
-near ≤ z ≤ -far  (in view space)
```

**Near plane** (e.g., z = -0.1): Points closer than this are behind the camera or too close to render.

**Far plane** (e.g., z = -10000): Points beyond this are culled for performance and numerical stability.

**Clipping condition:**
```
if (z >= -near || z <= -far):
    discard point
```

### 4.6 Complete Transformation Pipeline as Matrix

The entire pipeline can be expressed as a single **4×4 homogeneous transformation matrix**:

```
[x_screen]     [Projection] [View] [Model] [x_local]
[y_screen]  =  [          ] [    ] [     ] [y_local]
[z_depth  ]    [          ] [    ] [     ] [z_local]
[    w    ]    [          ] [    ] [     ] [   1   ]
```

Where:
- **Model matrix** = Translation to world space × Scale × Emitter rotation (Z)
- **View matrix** = Camera rotation (Y then X) × Camera translation
- **Projection matrix** = Perspective division + viewport scaling

The code implementation calculates these transformations sequentially rather than constructing explicit matrices, but the mathematical result is identical.

---

## 5. Common Pitfalls and Solutions

### Problem: SVG export doesn't match WebGL render

**Causes:**
1. Wrong rotation order
2. Incorrect coordinate system conversion (origin at top-left vs center)
3. Missing scale factor
4. FOV calculated incorrectly

**Solution:** The `projectPoint()` function must **exactly replicate** p5.js's transformation stack order.

### Problem: Objects appear stretched or compressed

**Cause:** FOV calculation doesn't account for aspect ratio or is using wrong tangent formula.

**Solution:** Use `(height/2) / tan(fov/2)` for focal length calculation.

### Problem: Clipping artifacts (disappearing geometry)

**Cause:** Near plane is too far, or far plane is too close.

**Solution:** Ensure near ≥ 0.01 and far >> scene depth range.

### Problem: Performance issues with large scenes

**Cause:** Projecting thousands of points per frame is CPU-intensive.

**Solution:** 
- Use WebGL for real-time rendering
- Only run CPU projection on export
- Consider spatial culling before projection

---

## 6. Extending to Other Projects

### Adapting This Approach

To use this projection system in another project:

1. **Identify your 3D coordinate system conventions**
   - Origin location (center, top-left, bottom-left?)
   - Axis directions (+Y up or +Y down?)
   - Handedness (right-handed or left-handed?)

2. **Extract transformation parameters**
   - Camera position and rotation
   - Object positions and rotations
   - Scale factors
   - FOV

3. **Implement rotation functions**
   - Use the matrix formulas from Section 4.1
   - Maintain the correct order for your framework

4. **Calculate projection constants**
   - FOV to focal length conversion
   - Near/far plane values

5. **Apply the pipeline**
   - Local → World → View → Clip → Project → Screen

### Three.js Example

For a Three.js scene:

```javascript
// Extract camera parameters
const camera = scene.camera;
const fov = camera.fov * Math.PI / 180;
const aspect = camera.aspect;
const near = camera.near;
const far = camera.far;

// Get view and projection matrices
const viewMatrix = camera.matrixWorldInverse;
const projectionMatrix = camera.projectionMatrix;

// Project a 3D point
function projectToScreen(worldPosition, width, height) {
  const clipSpace = worldPosition
    .applyMatrix4(viewMatrix)
    .applyMatrix4(projectionMatrix);
  
  // Perspective divide
  const ndc = {
    x: clipSpace.x / clipSpace.w,
    y: clipSpace.y / clipSpace.w
  };
  
  // NDC to screen space
  return {
    x: (ndc.x + 1) * width / 2,
    y: (1 - ndc.y) * height / 2  // Flip Y for SVG
  };
}
```

### Depth Maps and Z-Buffers

The same projection can store depth:

```javascript
function projectWithDepth(x, y, z) {
  // ... rotations and transformations ...
  const scale = defaultCameraZ / -pt.z;
  return {
    x: pt.x * scale + W / 2,
    y: pt.y * scale + H / 2,
    depth: -pt.z  // Store view-space depth
  };
}
```

This enables:
- **Depth maps** (grayscale images encoding distance)
- **Occlusion culling** (discard hidden geometry)
- **Z-buffer rendering** (proper depth sorting)

---

## 7. References and Further Reading

### Mathematical Foundations
- **Computer Graphics: Principles and Practice** (Foley et al.) - Chapters on transformation matrices
- **Real-Time Rendering** (Möller & Haines) - Perspective projection derivations
- **Mathematics for 3D Game Programming** (Lengyel) - Rotation matrices in depth

### p5.js Specifics
- [p5.js WEBGL Mode Documentation](https://p5js.org/reference/#group-3D)
- [p5.js Camera Reference](https://p5js.org/reference/#/p5.Camera)
- [p5.js Transformation Functions](https://p5js.org/reference/#group-Transform)

### Related Concepts
- **OpenGL Transformation Pipeline** - Industry standard 3D graphics flow
- **Homogeneous Coordinates** - 4D representation of 3D transformations
- **Quaternions** - Alternative rotation representation avoiding gimbal lock

---

## 8. Summary

The ZigzagEmitter's 3D-to-SVG conversion demonstrates a **complete reimplementation** of the GPU's transformation pipeline in CPU JavaScript. 

**Key Takeaways:**

1. **Six-stage pipeline**: Local → World → Rotate → Translate → Clip → Project
2. **Critical rotation order**: Z → Y → X (must match p5.js WEBGL)
3. **Perspective formula**: `scale = focalLength / -viewZ`
4. **FOV relationship**: `focalLength = (height/2) / tan(fov/2)`
5. **Coordinate system awareness**: p5.js WEBGL uses center origin and -Z forward

This approach provides **pixel-perfect exports** because it uses identical mathematics to the WebGL renderer. Understanding these principles enables high-quality vector exports from any 3D web graphics project.

---

*Document Version: 1.0*  
*For questions or corrections, refer to the ZigzagEmitter source code: `ZigzagEmitter_12.html`, lines 2200-2250 (SVG export) and lines 1046-1093 (projection functions).*
