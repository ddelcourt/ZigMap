// ═══════════════════════════════════════════════════════════════════════════
// ZIGMAP26 - Default Parameters
// Default runtime parameters for the application
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_PARAMS = {
  // Geometry
  segmentLength: 120,
  lineThickness: 12,
  lineColor: [255, 255, 255],
  emitterRotation: 0,
  geometryScale: 100,

  // Animation
  emitRate: 1.5,
  speed: 80,
  ambientSpeedMaster: 100,

  // Modulation
  randomThickness: false,
  randomSpeed: false,
  thicknessRangeMin: 10,
  thicknessRangeMax: 200,
  speedRangeMin: 50,
  speedRangeMax: 150,

  // Camera
  fov: 60,
  near: 0.01,
  far: 20000,
  cameraRotationX: -0.3,
  cameraRotationY: 0,
  cameraDistance: 600,
  cameraOffsetX: 0,
  cameraOffsetY: 0,

  // Stereoscopic
  stereoscopicMode: false,
  eyeSeparation: 30,

  // Framebuffer
  framebufferMode: false,
  framebufferPreset: '1920x1080',
  framebufferWidth: 1920,
  framebufferHeight: 1080,

  // Video Export
  videoDuration: 10,
  videoFPS: 30,
  videoFormat: 'webm',

  // Depth Map
  depthInvert: false
};
