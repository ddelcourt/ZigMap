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
  
  // Get the actual displayed size of the overlay in CSS pixels
  const overlayNaturalWidth = overlayImg.naturalWidth;
  const overlayNaturalHeight = overlayImg.naturalHeight;
  const userScale = ZM.params.overlayScale / 100;
  const opacity = ZM.params.overlayOpacity / 100;
  
  // Calculate the CSS display size (what you see on screen)
  const displayWidth = overlayNaturalWidth * userScale;
  const displayHeight = overlayNaturalHeight * userScale;
  
  // The canvas is already high-DPI sized, so we need to scale the overlay to match
  // sourceCanvas.width is the buffer size, ZM.W is the CSS size
  // The ratio gives us the pixel density factor
  const bufferToDisplayRatio = sourceCanvas.width / ZM.W;
  
  // Note: We need to multiply by 2 because overlayImg.naturalWidth returns CSS pixels,
  // but the canvas 2D context draws in buffer pixels. On a 2x display:
  // - naturalWidth is in CSS pixels (e.g., 300px)
  // - Canvas buffer needs 2x that (600px actual pixels)
  // - bufferToDisplayRatio already accounts for the canvas scaling
  // - So we multiply by 2 to convert from CSS to buffer pixels
  const imgWidth = displayWidth * bufferToDisplayRatio * 2;
  const imgHeight = displayHeight * bufferToDisplayRatio * 2;
  
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
