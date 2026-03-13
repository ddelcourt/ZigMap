/**
 * PNGExporter — Export canvas as PNG image
 */

/**
 * Create a composite canvas with overlay
 */
function createCompositeCanvas(ZM, sourceCanvas) {
  const overlayImg = document.getElementById('overlay-image');
  const hasOverlay = ZM.params.overlayVisible && ZM.params.overlayImageSrc && overlayImg && overlayImg.complete;
  
  if (!hasOverlay) {
    return sourceCanvas;
  }
  
  // Create composite canvas
  const composite = document.createElement('canvas');
  composite.width = sourceCanvas.width;
  composite.height = sourceCanvas.height;
  const ctx = composite.getContext('2d');
  
  // Draw p5 canvas
  ctx.drawImage(sourceCanvas, 0, 0);
  
  // Get pixel density from p5 instance to match canvas scaling
  const pixelDensity = ZM.p5Instance._pixelDensity || 1;
  
  // Calculate overlay position and size (account for pixel density)
  const scale = ZM.params.overlayScale / 100;
  const opacity = ZM.params.overlayOpacity / 100;
  const imgWidth = overlayImg.naturalWidth * scale * pixelDensity;
  const imgHeight = overlayImg.naturalHeight * scale * pixelDensity;
  
  // Position as percentage of canvas
  const x = (ZM.params.overlayX / 100) * composite.width;
  const y = (ZM.params.overlayY / 100) * composite.height;
  
  // Draw overlay with opacity
  ctx.globalAlpha = opacity;
  ctx.drawImage(
    overlayImg,
    x - imgWidth / 2,
    y - imgHeight / 2,
    imgWidth,
    imgHeight
  );
  ctx.globalAlpha = 1.0;
  
  return composite;
}

export function exportPNG(ZM) {
  if (!ZM.p5Instance) return;
  
  const composite = createCompositeCanvas(ZM, ZM.p5Instance.canvas);
  
  composite.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zigmap26-${ts}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Export composite function for use by other exporters
export { createCompositeCanvas };
