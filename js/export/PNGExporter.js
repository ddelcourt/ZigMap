/**
 * PNGExporter — Export canvas as PNG image
 * VERSION: 2026-03-16-02:00 LATEST
 */

console.log('🚨🚨🚨 PNGExporter.js VERSION 2026-03-16-02:00 LOADED 🚨🚨🚨');
console.log('If you see this message, the NEW code is running!');

/**
 * Create a composite canvas with overlay
 */
function createCompositeCanvas(ZM, sourceCanvas) {
  const overlayImg = document.getElementById('overlay-image');
  
  console.log('🔍 PNG Export - Checking overlay status:');
  console.log('  overlayImg element exists:', !!overlayImg);
  console.log('  ZM.params.overlayVisible:', ZM.params.overlayVisible);
  console.log('  ZM.params.overlayImageSrc:', ZM.params.overlayImageSrc ? 'YES (length: ' + ZM.params.overlayImageSrc.length + ')' : 'NO');
  if (overlayImg) {
    console.log('  overlayImg.complete:', overlayImg.complete);
    console.log('  overlayImg.naturalWidth:', overlayImg.naturalWidth);
    console.log('  overlayImg.src length:', overlayImg.src ? overlayImg.src.length : 'NO SRC');
  }
  
  const hasOverlay = ZM.params.overlayVisible && ZM.params.overlayImageSrc && overlayImg && overlayImg.complete;
  console.log('  hasOverlay:', hasOverlay);
  
  if (!hasOverlay) {
    console.log('⚠️  No overlay to composite - exporting canvas only');
    return sourceCanvas;
  }
  
  // Get computed style of overlay to see actual on-screen size
  // Use getBoundingClientRect() which includes ALL transforms (including scale)
  const rect = overlayImg.getBoundingClientRect();
  const onScreenWidth = rect.width;
  const onScreenHeight = rect.height;
  
  // Log all relevant dimensions
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║          PNG EXPORT COMPREHENSIVE DIMENSION ANALYSIS              ║');
  console.log('╠═══════════════════════════════════════════════════════════════════╣');
  console.log('│ 1. WINDOW DIMENSIONS');
  console.log('│    innerWidth:', window.innerWidth);
  console.log('│    innerHeight:', window.innerHeight);
  console.log('│    devicePixelRatio:', window.devicePixelRatio);
  console.log('│');
  console.log('│ 2. CANVAS DIMENSIONS');
  console.log('│    sourceCanvas.width (buffer):', sourceCanvas.width);
  console.log('│    sourceCanvas.height (buffer):', sourceCanvas.height);
  console.log('│    sourceCanvas.style.width (CSS):', sourceCanvas.style.width);
  console.log('│    sourceCanvas.style.height (CSS):', sourceCanvas.style.height);
  console.log('│    ZM.W (logical width):', ZM.W);
  console.log('│    ZM.H (logical height):', ZM.H);
  console.log('│');
  console.log('│ 3. MODE SETTINGS');
  console.log('│    framebufferMode:', ZM.params.framebufferMode);
  console.log('│    stereoscopicMode:', ZM.params.stereoscopicMode);
  if (ZM.params.framebufferMode) {
    console.log('│    framebufferWidth:', ZM.params.framebufferWidth);
    console.log('│    framebufferHeight:', ZM.params.framebufferHeight);
  }
  console.log('│');
  console.log('│ 4. OVERLAY IMAGE');
  console.log('│    naturalWidth:', overlayImg.naturalWidth);
  console.log('│    naturalHeight:', overlayImg.naturalHeight);
  console.log('│    overlayScale param:', ZM.params.overlayScale + '%');
  console.log('│    ON-SCREEN computed width:', onScreenWidth + 'px');
  console.log('│    ON-SCREEN computed height:', onScreenHeight + 'px');
  console.log('│    overlayX:', ZM.params.overlayX + '%');
  console.log('│    overlayY:', ZM.params.overlayY + '%');
  console.log('╠═══════════════════════════════════════════════════════════════════╣');
  
  // Create composite canvas
  const composite = document.createElement('canvas');
  composite.width = sourceCanvas.width;
  composite.height = sourceCanvas.height;
  const ctx = composite.getContext('2d');
  
  console.log('│ 5. EXPORT CANVAS');
  console.log('│    composite.width:', composite.width);
  console.log('│    composite.height:', composite.height);
  console.log('│');
  
  // Draw p5 canvas
  ctx.drawImage(sourceCanvas, 0, 0);
  
  // Get the overlay dimensions
  const overlayNaturalWidth = overlayImg.naturalWidth;
  const overlayNaturalHeight = overlayImg.naturalHeight;
  const userScale = ZM.params.overlayScale / 100;
  const opacity = ZM.params.overlayOpacity / 100;
  
  // ALWAYS use the measured on-screen size - it accounts for ALL CSS transforms
  // including manual scale, auto-fit, and any other styling
  const displayWidth = onScreenWidth;
  const displayHeight = onScreenHeight;
  
  console.log('│    Using MEASURED on-screen size: ' + displayWidth + ' × ' + displayHeight);
  console.log('│    (This accounts for all CSS transforms and auto-fit)');
  console.log('│');
  
  console.log('│ 6. CALCULATION STEPS');
  console.log('│    Step 1: Get overlay on-screen size');
  console.log('│            Measured: ' + displayWidth.toFixed(1) + ' × ' + displayHeight.toFixed(1) + ' CSS pixels');
  console.log('│');
  
  // Get canvas on-screen CSS size (may be smaller than window due to UI)
  const canvasRect = sourceCanvas.getBoundingClientRect();
  const canvasCSSWidth = canvasRect.width;
  const canvasCSSHeight = canvasRect.height;
  
  console.log('│    Step 2: Get canvas on-screen CSS size');
  console.log('│            Canvas CSS: ' + canvasCSSWidth.toFixed(1) + ' × ' + canvasCSSHeight.toFixed(1) + ' px');
  console.log('│            Canvas buffer: ' + sourceCanvas.width + ' × ' + sourceCanvas.height + ' px');
  console.log('│');
  
  // Calculate buffer-to-CSS ratio for the canvas
  const scaleX = sourceCanvas.width / canvasCSSWidth;
  const scaleY = sourceCanvas.height / canvasCSSHeight;
  
  console.log('│    Step 3: Calculate canvas buffer-to-CSS ratio');
  console.log('│            scaleX: ' + sourceCanvas.width + ' / ' + canvasCSSWidth.toFixed(1) + ' = ' + scaleX.toFixed(3) + 'x');
  console.log('│            scaleY: ' + sourceCanvas.height + ' / ' + canvasCSSHeight.toFixed(1) + ' = ' + scaleY.toFixed(3) + 'x');
  console.log('│');
  
  // Apply same ratio to overlay
  const imgWidth = displayWidth * scaleX;
  const imgHeight = displayHeight * scaleY;
  
  console.log('│    Step 4: Apply same ratio to overlay');
  console.log('│            imgWidth: ' + displayWidth.toFixed(1) + ' × ' + scaleX.toFixed(3) + ' = ' + imgWidth.toFixed(1) + ' px');
  console.log('│            imgHeight: ' + displayHeight.toFixed(1) + ' × ' + scaleY.toFixed(3) + ' = ' + imgHeight.toFixed(1) + ' px');
  console.log('│');
  console.log('│ 7. FINAL OVERLAY SIZE IN EXPORT');
  console.log('│    imgWidth:', imgWidth + ' px');
  console.log('│    imgHeight:', imgHeight + ' px');
  console.log('│');
  console.log('│ 8. COMPARISON');
  console.log('│    ON-SCREEN overlay:', onScreenWidth + ' × ' + onScreenHeight);
  console.log('│    IN EXPORT overlay:', imgWidth + ' × ' + imgHeight);
  console.log('│    Export canvas size:', composite.width + ' × ' + composite.height);
  console.log('│    Ratio (export/screen):', (imgWidth / onScreenWidth).toFixed(2) + 'x');
  console.log('│    Expected ratio (canvas/window):', (composite.width / window.innerWidth).toFixed(2) + 'x');
  console.log('╚═══════════════════════════════════════════════════════════════════╝');
  
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
  console.log('📸 exportPNG() called');
  console.log('  ZM.p5Instance exists:', !!ZM.p5Instance);
  
  if (!ZM.p5Instance) {
    console.log('⚠️  No p5Instance - aborting export');
    return;
  }
  
  console.log('  ZM.p5Instance.canvas:', ZM.p5Instance.canvas);
  console.log('  Calling createCompositeCanvas...');
  
  const composite = createCompositeCanvas(ZM, ZM.p5Instance.canvas);
  
  console.log('  Composite canvas created:', composite.width, 'x', composite.height);
  
  composite.toBlob(blob => {
    console.log('  Blob created, size:', blob.size, 'bytes');
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zigmap26-${ts}.png`;
    a.click();
    console.log('✅ PNG download triggered:', a.download);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Export composite function for use by other exporters
export { createCompositeCanvas };
