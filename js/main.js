/**
 * ZigMap26 — Main Application Entry Point
 * Orchestrates all modules and initializes the application
 */

// Import configurations
import { DEFAULT_PARAMS } from './config/defaults.js';
import { SEGMENTS, FADE_IN_DURATION, FADE_OUT_DISTANCE, STORAGE_KEY } from './config/constants.js';

// Import core classes
import { ZigzagLine } from './core/ZigzagLine.js';
import { Emitter } from './core/Emitter.js';
import { Camera } from './core/Camera.js';
import { getSpawnDistance, buildRibbonSides } from './core/utils.js';

// Import storage
import { loadFromLocalStorage, saveToLocalStorage, downloadJSON, loadJSON } from './storage/localStorage.js';

// Import rendering
import { attachToZM } from './rendering/SketchFactory.js';

// Import export
import { exportSVG } from './export/SVGExporter.js';
import { exportPNG } from './export/PNGExporter.js';
import { startVideoRecording, stopVideoRecording, isRecording as getVideoRecordingStatus } from './export/VideoRecorder.js';
import { exportDepthMap } from './export/DepthExporter.js';

// Import UI
import { initializeUI } from './ui/UIController.js';

// Import input
import { setupKeyboardHandlers } from './input/KeyboardHandler.js';
import { setupMouseHandlers } from './input/MouseHandler.js';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL APPLICATION STATE
// ═══════════════════════════════════════════════════════════════════════════

// Create global ZigMap26 namespace
window.ZigMap26 = {
  // Parameters
  params: { ...DEFAULT_PARAMS },
  
  // Constants
  SEGMENTS,
  FADE_IN_DURATION,
  FADE_OUT_DISTANCE,
  STORAGE_KEY,
  
  // State
  noiseOffset: 0,
  W: window.innerWidth,
  H: window.innerHeight,
  camera: null,
  p5Instance: null,
  p5InstanceRight: null,
  emitterInstance: null,
  
  // Utilities
  getSpawnDistance,
  buildRibbonSides,
  
  // Core classes
  ZigzagLine,
  Emitter,
  Camera,
  
  // Storage functions
  saveToLocalStorage: () => saveToLocalStorage(window.ZigMap26.params),
  loadFromLocalStorage: () => {
    const loaded = loadFromLocalStorage(DEFAULT_PARAMS);
    if (loaded) {
      Object.assign(window.ZigMap26.params, loaded);
      return true;
    }
    return false;
  },
  downloadJSON: () => downloadJSON(window.ZigMap26.params),
  loadJSON: (file) => loadJSON(file, (loadedParams) => {
    Object.assign(window.ZigMap26.params, loadedParams);
    window.ZigMap26.syncUIFromParams();
  }),
  
  // Export functions
  exportSVG: () => exportSVG(window.ZigMap26),
  exportPNG: () => exportPNG(window.ZigMap26),
  exportDepthMap: () => exportDepthMap(window.ZigMap26),
  startVideoRecording: () => startVideoRecording(window.ZigMap26),
  stopVideoRecording: () => stopVideoRecording(window.ZigMap26),
  isVideoRecording: () => getVideoRecordingStatus(),
  
  // UI sync function (will be set by UIController)
  syncUIFromParams: null,
  
  // Canvas size update (will be set by SketchFactory)  
  updateCanvasSize: null,
  
  // Initialize sketches (will be set by SketchFactory)
  initializeSketches: null
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

function init() {
  const ZM = window.ZigMap26;
  
  // Initialize camera
  ZM.camera = new Camera(ZM.params);
  
  // Load saved settings
  const hadSavedSettings = ZM.loadFromLocalStorage();
  
  // Attach rendering functions
  attachToZM(ZM);
  
  // Initialize UI
  initializeUI(ZM);
  
  // Setup input handlers
  setupKeyboardHandlers(ZM);
  setupMouseHandlers(ZM);
  
  // Create p5 sketches
  ZM.initializeSketches();
  
  // If had saved stereo settings, reinitialize
  if (hadSavedSettings && ZM.params.stereoscopicMode) {
    ZM.initializeSketches();
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!ZM.params.framebufferMode) {
      if (ZM.params.stereoscopicMode) {
        ZM.W = Math.floor(window.innerWidth / 2);
        ZM.H = window.innerHeight;
      } else {
        ZM.W = window.innerWidth;
        ZM.H = window.innerHeight;
      }
      if (ZM.updateCanvasSize) ZM.updateCanvasSize();
    }
  });
  
  console.log('ZigMap26 initialized ✓');
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
