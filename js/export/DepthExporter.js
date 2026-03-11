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
function projectVertex(line, localX, localY, localZ, ZM, defaultCameraZ, totalDistance) {
  const scale = ZM.params.geometryScale / 100;
  const wx = ((line.x - ZM.W / 2) + localX) * scale;
  const wy = ((line.y - ZM.H / 2) + localY) * scale;
  const wz = (localZ || 0) * scale;
  return projectPoint(wx, wy, wz, ZM, defaultCameraZ, totalDistance);
}

/**
 * Scan to find depth range based on all depths that contribute to rendered pixels
 * Collects all vertex depths from visible ribbons to capture the full depth span
 */
function scanDepthRange(lines, ZM, defaultCameraZ, totalDistance) {
  const allDepths = [];
  let ribbonCount = 0;
  
  for (const line of lines) {
    if (line._alpha() <= 0) continue;
    
    const localVerts = line._buildVertices();
    const { leftSide, rightSide } = ZM.buildRibbonSides(
      localVerts,
      line.lineThickness / 2
    );
    
    // Project vertices
    const leftProj = leftSide
      .map(pt => projectVertex(line, pt.x, pt.y, pt.z, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    const rightProj = rightSide
      .map(pt => projectVertex(line, pt.x, pt.y, pt.z, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    
    if (leftProj.length < 2 || rightProj.length < 2) continue;
    
    // Create polygon
    const poly = [...leftProj, ...[...rightProj].reverse()];
    
    // Check if polygon is on screen (any vertex visible)
    const onScreen = poly.some(p => 
      p.sx >= 0 && p.sx <= ZM.W && p.sy >= 0 && p.sy <= ZM.H
    );
    
    if (onScreen) {
      // Collect ALL depths from this ribbon (these contribute to pixel rendering)
      for (const p of poly) {
        allDepths.push(p.depth);
      }
      ribbonCount++;
    }
  }
  
  console.log(`  On-screen ribbons: ${ribbonCount}, total depth samples: ${allDepths.length}`);
  
  if (allDepths.length < 10) {
    console.log('  Warning: Too few depth samples, using fallback range');
    return { minDepth: 1, maxDepth: 1000 };
  }
  
  // Sort all depths
  allDepths.sort((a, b) => a - b);
  
  // Use 1st to 99th percentile for maximum contrast on visible content
  const idx1 = Math.max(0, Math.floor(allDepths.length * 0.01));
  const idx99 = Math.min(allDepths.length - 1, Math.floor(allDepths.length * 0.99));
  
  const minD = allDepths[idx1];
  const maxD = allDepths[idx99];
  
  console.log(`  Full depth span: ${allDepths[0].toFixed(2)} - ${allDepths[allDepths.length-1].toFixed(2)}`);
  console.log(`  Using range (1st-99th percentile): ${minD.toFixed(2)} - ${maxD.toFixed(2)}`);
  
  if (!isFinite(minD) || !isFinite(maxD) || maxD <= minD) {
    return { minDepth: 1, maxDepth: 1000 };
  }
  
  // Small expansion for full white/black on extremes
  const expand = (maxD - minD) * 0.03;
  const finalMinDepth = Math.max(0.01, minD - expand);
  const finalMaxDepth = maxD + expand;
  
  console.log(`  Final range: minDepth=${finalMinDepth.toFixed(2)}, maxDepth=${finalMaxDepth.toFixed(2)}`);
  
  return { minDepth: finalMinDepth, maxDepth: finalMaxDepth };
}

/**
 * Rasterize depth polygon onto canvas with gradient interpolation
 * Uses linear gradient along ribbon length for smooth depth transitions
 */
function rasterizeDepthPolygon(ctx, pts, minDepth, maxDepth, invert, alpha) {
  if (pts.length < 3) return;

  // Map a depth value → grey level (0–255)
  function depthToGrey(depth) {
    let t = (depth - minDepth) / (maxDepth - minDepth);
    t = Math.max(0, Math.min(1, t));
    t = Math.pow(t, 0.85);
    return Math.round((invert ? t : 1 - t) * 255);
  }

  // For a quad [p0, p1, p2, p3] from segment rendering:
  // pts = [leftProj[i], leftProj[i+1], rightProj[i+1], rightProj[i]]
  //        TL (p0)       BL (p1)        BR (p2)         TR (p3)

  const [p0, p1, p2, p3] = pts;

  // Create gradient along ribbon LENGTH (from leading edge to trailing edge)
  // Leading edge: midpoint of p0→p3 (across ribbon width)
  // Trailing edge: midpoint of p1→p2 (across ribbon width)
  const x0 = (p0.sx + p3.sx) / 2;
  const y0 = (p0.sy + p3.sy) / 2;
  const x1 = (p1.sx + p2.sx) / 2;
  const y1 = (p1.sy + p2.sy) / 2;

  const depth0 = (p0.depth + p3.depth) / 2; // leading edge avg depth
  const depth1 = (p1.depth + p2.depth) / 2; // trailing edge avg depth

  const grey0 = depthToGrey(depth0);
  const grey1 = depthToGrey(depth1);

  // Avoid zero-length gradient (degenerate quad)
  const dx = x1 - x0, dy = y1 - y0;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;

  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0, `rgba(${grey0},${grey0},${grey0},${alpha.toFixed(4)})`);
  grad.addColorStop(1, `rgba(${grey1},${grey1},${grey1},${alpha.toFixed(4)})`);

  ctx.beginPath();
  ctx.moveTo(p0.sx, p0.sy);
  ctx.lineTo(p1.sx, p1.sy);
  ctx.lineTo(p2.sx, p2.sy);
  ctx.lineTo(p3.sx, p3.sy);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}

/**
 * Main export function
 */
export function exportDepthMap(ZM) {
  if (!ZM.emitterInstance || ZM.emitterInstance.lines.length === 0) {
    if (ZM.showToast) ZM.showToast('No lines to render — let the emitter run for a moment first.');
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
      if (ZM.showToast) ZM.showToast('Depth map export failed: ' + e.message);
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
  console.log(`Depth map export:`);
  console.log(`  Canvas dimensions: ${ZM.W} × ${ZM.H}`);
  console.log(`  Stereo mode: ${ZM.params.stereoscopicMode}`);
  console.log(`  Active lines: ${lines.length}`);
  console.log(`  Depth range: near=${minDepth.toFixed(1)}, far=${maxDepth.toFixed(1)}`);
  console.log(`  defaultCameraZ=${defaultCameraZ.toFixed(1)}, totalDistance=${totalDistance.toFixed(1)}`);
  
  // Create offscreen canvas
  const offCanvas = document.createElement('canvas');
  offCanvas.width = ZM.W;
  offCanvas.height = ZM.H;
  const ctx = offCanvas.getContext('2d');
  
  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ZM.W, ZM.H);
  
  const invert = ZM.params.depthInvert;
  
  // Render each ribbon SEGMENT-BY-SEGMENT for depth gradients
  let renderedCount = 0;
  let segmentCount = 0;
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
      .map(pt => projectVertex(line, pt.x, pt.y, pt.z, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    const rightProj = rightSide
      .map(pt => projectVertex(line, pt.x, pt.y, pt.z, ZM, defaultCameraZ, totalDistance))
      .filter(Boolean);
    
    if (leftProj.length < 2 || rightProj.length < 2) continue;
    
    // Diagnostic: log first ribbon's depth range
    if (renderedCount === 0) {
      console.log('  First ribbon sample depths:', leftProj.slice(0, 5).map(p => p.depth.toFixed(2)));
    }
    
    // Render segment-by-segment (quad by quad) instead of whole ribbon
    for (let i = 0; i < leftProj.length - 1; i++) {
      const quad = [
        leftProj[i],
        leftProj[i + 1],
        rightProj[i + 1],
        rightProj[i]
      ];
      rasterizeDepthPolygon(ctx, quad, minDepth, maxDepth, invert, alpha);
      segmentCount++;
    }
    
    renderedCount++;
  }
  
  console.log(`  Rendered ${renderedCount} ribbons (${segmentCount} segments)`);
  
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
