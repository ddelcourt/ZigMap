# Projection matrices: WebGL 3D to SVG 2D conversion

ddelcourt / March 2026

---

## 1. The challenge

### Context

3D scenes are rendered in GPU-accelerated WebGL, then exported to SVG for print, editing, or archiving. This poses a fundamental technical problem.

WebGL relies on the GPU's integrated transformation pipeline:
- vertex transformations
- matrix multiplications
- perspective division
- viewport mapping

SVG is a 2D vector format that only understands 2D coordinates, paths, and polygons—no concept of depth or projection.

The entire 3D transformation pipeline—normally handled by the GPU—must be replicated in pure JavaScript to generate 2D SVG coordinates that correspond exactly to WebGL output.

### Rationale

- Visual fidelity: SVG export must match WebGL render pixel-for-pixel
- Debugging: identify which transformation failed if export is incorrect
- Flexibility: CPU projection allows depth maps, custom effects, and analytical processing

### ZigzagEmitter context

The ZigzagEmitter renders zigzag ribbons in 3D space with controllable camera (rotation, zoom, pan), adjustable field of view, near/far clipping planes, and 3D rotations applied to geometry. SVG export of any frame requires realtime reconstruction of all these transformations.

---

## 2. The transformation pipeline

The 3D → 2D process consists of a series of coordinate system changes.

### Step 1: local space → world space

Each ribbon exists in its own local coordinate system. To place it in the scene:

```
worldX = (lineX - canvasWidth/2 + localX) × scale
worldY = (lineY - canvasHeight/2 + localY) × scale
worldZ = 0  // ribbons are flat in XY plane
```

p5.js WEBGL mode places the origin `(0,0,0)` at screen center, not top-left corner—hence the canvas-center subtraction.

### Step 2: 3D rotations

Three sequential rotations, in this precise order:

1. rotateZ (emitter rotation): rotation around Z-axis (like a wheel)
2. rotateY (horizontal orbit): rotation around vertical axis (left/right)
3. rotateX (vertical orbit): rotation around horizontal axis (up/down)

Rotation order is critical: `rotateX(rotateY(point))` produces different results from `rotateY(rotateX(point))`.

### Step 3: camera translation

Simulating camera distance from the scene:

```
viewZ = Z_rotated - totalCameraDistance
```

`totalCameraDistance` = default p5 camera position + user zoom distance.

### Step 4: frustum clipping

Verifying the point is within the view frustum:

```
if (viewZ >= -near || viewZ <= -far) → reject point
```

Points too close or too far are eliminated.

### Step 5: perspective projection

Objects farther away appear smaller. Formula:

```
scale = defaultCameraZ / -viewZ
screenX = viewX × scale + canvasWidth/2
screenY = viewY × scale + canvasHeight/2
```

Division by `viewZ` creates the "converging to a point" effect of perspective.

### Step 6: SVG output

Final `(screenX, screenY)` coordinates are written to SVG file as 2D points. Depth information is lost (or optionally stored for depth maps).

---

## 3. Implementation

### 3.1 Core projection code

```javascript
// Rotation functions
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

// Camera setup
const fovRad = params.fov * Math.PI / 180;
const defaultCameraZ = (H / 2) / Math.tan(fovRad / 2);
const totalDistance = defaultCameraZ + camera.distance;

// Projection function
function projectPoint(x, y, z) {
  // Step 1: Rotate around Z
  let pt = rotZ(x, y, z, params.emitterRotation * Math.PI / 180);
  
  // Step 2: Rotate around Y
  pt = rotY(pt.x, pt.y, pt.z, camera.rotationY);
  
  // Step 3: Rotate around X
  pt = rotX(pt.x, pt.y, pt.z, camera.rotationX);
  
  // Step 4: Translate to view space
  pt.z -= totalDistance;
  
  // Step 5: Frustum culling
  if (pt.z >= -params.near || pt.z <= -params.far) {
    return null;
  }
  
  // Step 6: Perspective projection
  const scale = defaultCameraZ / -pt.z;
  return {
    x: pt.x * scale + W / 2,
    y: pt.y * scale + H / 2
  };
}
```

### 3.2 Implementation details

**Coordinate system conversion**
```javascript
worldX = (line.x - W/2 + localX) * scale
worldY = (line.y - H/2 + localY) * scale
```

**Rotation order**
The order Z → Y → X matches p5.js WEBGL's transformation stack. Changing this order produces incorrect results.

**Negative Z convention**
OpenGL (and p5.js) uses a right-handed coordinate system where +X = right, +Y = up, -Z = forward (into screen). Hence `-viewZ` in divisions.

**Camera distance calculation**
```javascript
defaultCameraZ = (height / 2) / tan(fov / 2)
totalDistance = defaultCameraZ + userZoomDistance
```

This formula ensures field of view behaves identically to p5's WEBGL renderer.

---

## 4. Mathematical foundations

### 4.1 Rotation matrices

Each rotation is a 3×3 orthogonal matrix multiplication.

**Rotation around X-axis:**
```
x' = x
y' = y·cos(θ) - z·sin(θ)
z' = y·sin(θ) + z·cos(θ)
```

**Rotation around Y-axis:**
```
x' =  x·cos(θ) + z·sin(θ)
y' =  y
z' = -x·sin(θ) + z·cos(θ)
```

**Rotation around Z-axis:**
```
x' = x·cos(θ) - y·sin(θ)
y' = x·sin(θ) + y·cos(θ)
z' = z
```

### 4.2 Composite rotation

When applying rotations in sequence Z → Y → X, the combined transformation is:

```
R_combined = Rₓ · Rᵧ · Rᴢ
```

Matrix multiplication is not commutative: `A·B ≠ B·A`. This is why rotation order matters.

### 4.3 Perspective projection formula

Perspective transformation is derived from similar triangles in 3D space.

By similar triangles:
```
screenY / d = y / z
screenY = (y · d) / z
```

Focal length `d` is calculated from field of view:
```
d = (canvasHeight / 2) / tan(fov / 2)
```

Complete projection equations:
```
scale = focalLength / -z
screenX = x · scale + canvasWidth / 2
screenY = y · scale + canvasHeight / 2
```

### 4.4 Field of view and focal length

Relationship between FOV and focal length:

```
tan(fov/2) = (canvasHeight/2) / focalLength
focalLength = (canvasHeight/2) / tan(fov/2)
```

Larger FOV (e.g., 90°) produces shorter focal length and more wide-angle distortion. Smaller FOV (e.g., 30°) produces longer focal length and more telephoto compression.

### 4.5 Frustum clipping planes

The viewing frustum is a truncated pyramid defined by:

```
-near ≤ z ≤ -far  (in view space)
```

Near plane (e.g., z = -0.1): points closer than this are behind the camera or too close to render.
Far plane (e.g., z = -10000): points beyond this are culled for performance and numerical stability.

Clipping condition:
```
if (z >= -near || z <= -far): discard point
```

### 4.6 Complete transformation pipeline

The entire pipeline can be expressed as a single 4×4 homogeneous transformation matrix:

```
[x_screen]     [Projection] [View] [Model] [x_local]
[y_screen]  =  [          ] [    ] [     ] [y_local]
[z_depth  ]    [          ] [    ] [     ] [z_local]
[    w    ]    [          ] [    ] [     ] [   1   ]
```

Where:
- Model matrix = Translation to world space × Scale × Emitter rotation (Z)
- View matrix = Camera rotation (Y then X) × Camera translation
- Projection matrix = Perspective division + viewport scaling

The code implementation calculates these transformations sequentially rather than constructing explicit matrices, but the mathematical result is identical.

---

## 5. Common problems

### SVG export does not match WebGL render

Causes: wrong rotation order, incorrect coordinate system conversion, missing scale factor, FOV calculated incorrectly.

Solution: `projectPoint()` function must exactly replicate p5.js's transformation stack order.

### Objects appear stretched or compressed

Cause: FOV calculation does not account for aspect ratio or uses wrong tangent formula.

Solution: use `(height/2) / tan(fov/2)` for focal length calculation.

### Clipping artifacts (disappearing geometry)

Cause: near plane too far or far plane too close.

Solution: ensure near ≥ 0.01 and far >> scene depth range.

### Performance issues with large scenes

Cause: projecting thousands of points per frame is CPU-intensive.

Solution: use WebGL for real-time rendering, run CPU projection on export only, consider spatial culling before projection.

---

## 6. Extension to other projects

### Adapting this approach

To use this projection system in another project:

1. Identify 3D coordinate system conventions (origin location, axis directions, handedness)
2. Extract transformation parameters (camera position/rotation, object positions/rotations, scale factors, FOV)
3. Implement rotation functions using matrix formulas
4. Calculate projection constants (FOV to focal length conversion, near/far plane values)
5. Apply the pipeline: Local → World → View → Clip → Project → Screen

### Three.js example

```javascript
const camera = scene.camera;
const viewMatrix = camera.matrixWorldInverse;
const projectionMatrix = camera.projectionMatrix;

function projectToScreen(worldPosition, width, height) {
  const clipSpace = worldPosition
    .applyMatrix4(viewMatrix)
    .applyMatrix4(projectionMatrix);
  
  const ndc = {
    x: clipSpace.x / clipSpace.w,
    y: clipSpace.y / clipSpace.w
  };
  
  return {
    x: (ndc.x + 1) * width / 2,
    y: (1 - ndc.y) * height / 2
  };
}
```

### Depth maps and Z-buffers

The same projection can store depth:

```javascript
function projectWithDepth(x, y, z) {
  const scale = defaultCameraZ / -pt.z;
  return {
    x: pt.x * scale + W / 2,
    y: pt.y * scale + H / 2,
    depth: -pt.z
  };
}
```

This enables depth maps (grayscale images encoding distance), occlusion culling (discard hidden geometry), and Z-buffer rendering (proper depth sorting).

---

## 7. References

**Mathematical foundations**
- Computer Graphics: Principles and Practice (Foley et al.)
- Real-Time Rendering (Möller & Haines)
- Mathematics for 3D Game Programming (Lengyel)

**p5.js specifics**
- p5.js WEBGL Mode Documentation
- p5.js Camera Reference
- p5.js Transformation Functions

**Related concepts**
- OpenGL Transformation Pipeline
- Homogeneous Coordinates
- Quaternions

---

## 8. Summary

The ZigzagEmitter's 3D-to-SVG conversion demonstrates a complete reimplementation of the GPU's transformation pipeline in CPU JavaScript.

Key points:

1. Six-stage pipeline: Local → World → Rotate → Translate → Clip → Project
2. Critical rotation order: Z → Y → X (must match p5.js WEBGL)
3. Perspective formula: `scale = focalLength / -viewZ`
4. FOV relationship: `focalLength = (height/2) / tan(fov/2)`
5. Coordinate system awareness: p5.js WEBGL uses center origin and -Z forward

This approach provides pixel-perfect exports because it uses identical mathematics to the WebGL renderer.
