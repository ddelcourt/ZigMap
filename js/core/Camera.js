// ═══════════════════════════════════════════════════════════════════════════
// ZIGMAP26 - Camera State
// Camera position, rotation, and interaction state
// ═══════════════════════════════════════════════════════════════════════════

export class Camera {
  constructor(params) {
    this.rotationX = params.cameraRotationX;
    this.rotationY = params.cameraRotationY;
    this.distance = params.cameraDistance;
    this.offsetX = params.cameraOffsetX ||  0;
    this.offsetY = params.cameraOffsetY || 0;
    this.isDragging = false;
    this.isPanning = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
  }

  syncToParams(params) {
    params.cameraRotationX = this.rotationX;
    params.cameraRotationY = this.rotationY;
    params.cameraDistance = this.distance;
    params.cameraOffsetX = this.offsetX;
    params.cameraOffsetY = this.offsetY;
  }

  reset() {
    this.rotationX = -0.3;
    this.rotationY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  resetZoom() {
    this.distance = 600;
  }
}
