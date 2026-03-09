/**
 * DepthExporter — CPU-based depth map export
 * Uses exact same projection math as SVG export for pixel-perfect alignment
 */

/**
 * Project point using same math as SVG export
 */
function projectPoint(x, y, z, ZM, defaultCameraZ, totalDistance) {
  const eRad = ZM.params.emitterRotation * Math.PI / 180;
  const rX = ZM.camera.rotationX;
  const rY = ZM.camera.rotationY;
  
  // 1. rotateZ
  let px = x * Math.cos(eRad) - y * Math.sin(eRad);
  let py = x * Math.sin(eRad) + y * Math.cos(eRad);
  let pz = z;
  
  // 2. rotateY
  const px2 = px * Math.cos(rY) + pz * Math.sin(rY);
  const pz2 = -px * Math.sin(rY) + pz * Math.cos(rY);
  px = px2;
  pz = pz2;
  
  // 3. rotateX
  const py3 = py * Math.cos(rX) - pz * Math.sin(rX);
  const pz3 = py * Math.sin(rX) + pz * Math.cos(rX);
  py = py3;
  pz = pz3;
  
  // 4. Camera distance
  pz -= totalDistance;
  
  // 5. Frustum culling
  if (pz >= -ZM.params.near || pz <= -ZM.params.far) return null;
  
  // 6. Perspective projection
  const s = defaultCameraZ / -pz;
  const sx = px * s + ZM.W / 2;
  const sy = py * s + ZM.H / 2;
  
  return { sx, sy, depth: -pz };
}

/**
 * Project vertex from local line space to screen space
 */
function projectVertex(line, localX, localY, ZM, defaultCameraZ, totalDistance) {
  const scale = ZM.params.geometryScale / 100;
  const wx = ((line.x - ZM.W / 2) + localX) * scale;
  const wy = ((line.y - ZM.H / 2) + localY) * scale;
  return projectPoint(wx, wy, 0, ZM, defaultCameraZ, totalDistance);
}

/**
 * Scan all vertices to find depth range for auto-ranging
 */
function scanDepthRange(lines, ZM, defaultCameraZ, totalDistance) {
  let minD = Infinity;
  let maxD = -Infinity;
  
  for (const line of lines) {
    if (line._alpha() <= 0) continue;
    
    for (const pt of line._buildVertices()) {
      const p = projectVertex(line, pt.x, pt.y, ZM, defaultCameraZ, totalDistance);
      if (!p) continue;
      if (p.depth < minD) minD = p.depth;
      if (p.depth > maxD) maxD = p.depth;
    }
  }
  
  if (!isFinite(minD) || !isFinite(maxD) || maxD <= minD) {
    return { minDepth: 1, maxDepth: 1000 };
  }
  
  // Nudge minDepth slightly below to ensure nearest objects map to white
  const nudge = (maxD - minD) * 0.03;
  return { minDepth: Math.max(0.01, minD - nudge), maxDepth: maxD };
}

/**
 * Rasterize depth polygon onto canvas
 */
function rasterizeDepthPolygon(ctx, pts, minDepth, maxDepth, invert, alpha) {
  if (pts.length < 3) return;
  
  // Average depth across vertices
  let depthSum = 0;
  for (const p of pts) depthSum += p.depth;
  const avgDepth = depthSum / pts.length;
  
  let t = (avgDepth - minDepth) / (maxDepth - minDepth);
  t = Math.max(0, Math.min(1, t));
  
  // Power curve for contrast enhancement
  t = Math.pow(t, 0.6);
  
  const grey = Math.round((invert ? t : 1 - t) * 255);
  
  ctx.beginPath();
  ctx.moveTo(pts[0].sx, pts[0].sy);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].sx, pts[i].sy);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${grey},${grey},${grey},${alpha.toFixed(4)})`;
  ctx.fill();
}

/**
 * Main export function
 */
export function exportDepthMap(ZM) {
  if (!ZM.emitterInstance || ZM.emitterInstance.lines.length === 0) {
    alert('No lines to render — let the emitter run for a moment first.');
    return;
  }
  
  const btn = document.getElementById('export-depth-map');
  btn.disabled = true;
  btn.textContent = 'Rendering depth…';
  
  setTimeout(() => {
    try {
      renderDepthMap(ZM);
    } catch (e) {
      console.error('Depth map export failed:', e);
      alert('Depth map export failed: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Export Depth Map';
    }
  }, 30);
}

function renderDepthMap(ZM) {
  const lines = ZM.emitterInstance.lines.filter(l => l._alpha() > 0);
  
  // Calculate projection constants
  const fovRad = ZM.params.fov * Math.PI / 180;
  const defaultCameraZ = (ZM.H / 2) / Math.tan(fovRad / 2);
  const totalDistance = defaultCameraZ + ZM.camera.distance;
  
  // Auto-range from actual geometry
  const { minDepth, maxDepth } = scanDepthRange(lines, ZM, defaultCameraZ, totalDistance);
  console.log(`Depth map: near=${minDepth.toFixed(1)}, far=${maxDepth.toFixed(1)}`);
  
  // Create offscreen canvas
  const offCanvas = document.createElement('canvas');
  offCanvas.width = ZM.W;
  offCanvas.height = ZM.H;
  const ctx = offCanvas.getContext('2d');
  
  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ZM.W, ZM.H);
  
  const invert = ZM.params.depthInvert;
  
  // Render each ribbon
  for (const line of lines) {
    const alpha = line._alpha();
    if (alpha <= 0) continue;
    
    const localVerts = line._buildVertices();
    const { leftSide, rightSide } = ZM.buildRibbonSides(
      localVerts,
      line.lineThickness / 2
    );
    
    // Project vertices
    const leftProj = leftSide
      .map(pt => projectVertex(line, pt.x, pt.y, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    const rightProj = rightSide
      .map(pt => projectVertex(line, pt.x, pt.y, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    
    if (leftProj.length < 2 || rightProj.length < 2) continue;
    
    // Create polygon (same winding as SVG)
    const poly = [...leftProj, ...[...rightProj].reverse()];
    
    rasterizeDepthPolygon(ctx, poly, minDepth, maxDepth, invert, alpha);
  }
  
  // Download
  offCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zigmap26-depthmap-${ts}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
