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
  
  // Important: The canvas buffer is already sized for high-DPI (e.g., 2356px for a 1178px display)
  // We don't need to apply any additional scaling transforms to the context
  
  // Draw p5 canvas
  ctx.drawImage(sourceCanvas, 0, 0);
  
  // Get the overlay dimensions
  const overlayNaturalWidth = overlayImg.naturalWidth;
  const overlayNaturalHeight = overlayImg.naturalHeight;
  const userScale = ZM.params.overlayScale / 100;
  const opacity = ZM.params.overlayOpacity / 100;
  
  // Calculate overlay size to match on-screen display
  // The overlay displays at naturalWidth × userScale in CSS pixels on-screen
  const displayWidth = overlayNaturalWidth * userScale;
  const displayHeight = overlayNaturalHeight * userScale;
  
  // Scale to match canvas buffer
  // sourceCanvas.width is the actual buffer size (includes pixelDensity in normal mode)
  // ZM.W is the logical canvas size (CSS pixels in normal, actual pixels in framebuffer)
  const bufferToLogicalRatio = sourceCanvas.width / ZM.W;
  
  // Apply the buffer ratio AND an additional × 2 for image pixel to buffer pixel conversion
  // This × 2 accounts for the fact that naturalWidth is in image pixels which map to CSS pixels,
  // but the canvas context draws in buffer pixels (2× on Retina)
  const imgWidth = displayWidth * bufferToLogicalRatio * 2;
  const imgHeight = displayHeight * bufferToLogicalRatio * 2;
  
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
