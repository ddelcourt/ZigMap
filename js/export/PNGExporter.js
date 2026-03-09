/**
 * PNGExporter — Export canvas as PNG image
 */

export function exportPNG(ZM) {
  if (!ZM.p5Instance) return;
  
  ZM.p5Instance.canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zigmap26-${ts}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
