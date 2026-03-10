/**
 * SVGExporter — Export scene as SVG vector graphic
 */

export function exportSVG(ZM) {
  if (!ZM.p5Instance || !ZM.emitterInstance) return;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', ZM.W);
  svg.setAttribute('height', ZM.H);
  svg.setAttribute('viewBox', `0 0 ${ZM.W} ${ZM.H}`);
  
  // Rotation helpers
  const rotX = (x, y, z, a) => ({ 
    x, 
    y: y * Math.cos(a) - z * Math.sin(a), 
    z: y * Math.sin(a) + z * Math.cos(a) 
  });
  const rotY = (x, y, z, a) => ({ 
    x: x * Math.cos(a) + z * Math.sin(a), 
    y, 
    z: -x * Math.sin(a) + z * Math.cos(a) 
  });
  const rotZ = (x, y, z, a) => ({ 
    x: x * Math.cos(a) - y * Math.sin(a), 
    y: x * Math.sin(a) + y * Math.cos(a), 
    z 
  });
  
  // Camera projection setup
  const fovRad = ZM.params.fov * Math.PI / 180;
  const defaultCameraZ = (ZM.H / 2) / Math.tan(fovRad / 2);
  const totalDistance = defaultCameraZ + ZM.camera.distance;
  
  function projectPoint(x, y, z) {
    // Apply rotations: Z → Y → X (matches p5.js WEBGL order)
    let pt = rotZ(x, y, z, ZM.params.emitterRotation * Math.PI / 180);
    pt = rotY(pt.x, pt.y, pt.z, ZM.camera.rotationY);
    pt = rotX(pt.x, pt.y, pt.z, ZM.camera.rotationX);
    
    // Apply camera distance
    pt.z -= totalDistance;
    
    // Frustum culling
    if (pt.z >= -ZM.params.near || pt.z <= -ZM.params.far) return null;
    
    // Perspective projection
    const s = defaultCameraZ / -pt.z;
    return { 
      x: pt.x * s + ZM.W / 2, 
      y: pt.y * s + ZM.H / 2 
    };
  }
  
  const scaleVal = ZM.params.geometryScale / 100;
  
  // Process each line
  ZM.emitterInstance.lines.forEach(line => {
    const localVerts = line._buildVertices();
    const { leftSide: leftLocal, rightSide: rightLocal } = 
      ZM.buildRibbonSides(localVerts, line.lineThickness / 2);
    
    // Project to screen space
    const toScreen = localPts => localPts
      .map(pt => ({
        x: ((line.x - ZM.W / 2) + pt.x) * scaleVal,
        y: ((line.y - ZM.H / 2) + pt.y) * scaleVal,
        z: 0
      }))
      .map(pt => projectPoint(pt.x, pt.y, pt.z))
      .filter(Boolean);
    
    const leftScreen = toScreen(leftLocal);
    const rightScreen = toScreen(rightLocal);
    
    if (leftScreen.length < 2 || rightScreen.length < 2) return;
    
    // Create polygon
    const alpha = line._alpha();
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const pts = [...leftScreen, ...rightScreen.reverse()]
      .map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    
    polygon.setAttribute('points', pts);
    polygon.setAttribute('fill', `rgba(${line.currentColor.join(',')},${alpha})`);
    polygon.setAttribute('stroke', 'none');
    svg.appendChild(polygon);
  });
  
  // Download
  const blob = new Blob(
    [new XMLSerializer().serializeToString(svg)],
    { type: 'image/svg+xml' }
  );
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zigmap26-${ts}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
