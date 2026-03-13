/**
 * ZigMap26 — Main Application Entry Point
 * Orchestrates all modules and initializes the application
 */

// Import configurations
import { DEFAULT_PARAMS } from './config/defaults.js';
import { SEGMENTS, STORAGE_KEY } from './config/constants.js';

// Import core classes
import { ZigzagLine } from './core/ZigzagLine.js';
import { Emitter } from './core/Emitter.js';
import { Camera } from './core/Camera.js';
import { getSpawnDistance, buildRibbonSides } from './core/utils.js';

// Import storage
import { loadFromLocalStorage, saveToLocalStorage, downloadJSON, loadJSON } from './storage/localStorage.js';
import { initializeStateManager } from './storage/StateManager.js';

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
  downloadJSON: () => downloadJSON(window.ZigMap26),
  loadJSON: (file) => loadJSON(file, (loadedData) => {
    // Update params
    Object.assign(window.ZigMap26.params, loadedData.params);
    
    // Restore states if present (v2 format)
    if (loadedData.states && Array.isArray(loadedData.states)) {
      window.ZigMap26.stateManager.states = loadedData.states;
      window.ZigMap26.stateManager.activeStateId = loadedData.activeStateId;
      window.ZigMap26.stateManager.saveToStorage();
      
      // Update state UI
      if (window.ZigMap26.updateStatePanel) {
        window.ZigMap26.updateStatePanel();
      }
      
      // Load the first state in the list to ensure proper state initialization
      if (loadedData.states.length > 0) {
        const firstState = loadedData.states[0];
        window.ZigMap26.stateManager.load(firstState.id);
      }
    } else {
      // No states in project - sync camera from loaded params
      window.ZigMap26.camera.syncFromParams(window.ZigMap26.params);
      
      // Sync main UI
      window.ZigMap26.syncUIFromParams();
    }
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

/**
 * Load initial preset for first-time users
 */
async function loadInitialPreset(ZM) {
  try {
    const response = await fetch('config/presets/zigmap_init.json');
    if (!response.ok) {
      console.warn('Initial preset not found, using defaults');
      return false;
    }
    
    const loadedData = await response.json();
    
    // Update params
    Object.assign(ZM.params, loadedData.params);
    
    // Restore states if present
    if (loadedData.states && Array.isArray(loadedData.states)) {
      ZM.stateManager.states = loadedData.states;
      ZM.stateManager.activeStateId = loadedData.activeStateId;
      ZM.stateManager.saveToStorage();
      
      // Load the first state
      if (loadedData.states.length > 0) {
        const firstState = loadedData.states[0];
        // Store for later use after UI initialization
        ZM._initialStateId = firstState.id;
      }
      
      // Update state panel UI will be called after UI initialization
    } else {
      // Sync camera from loaded params
      ZM.camera.syncFromParams(ZM.params);
    }
    
    // Save to localStorage so this only happens once
    ZM.saveToLocalStorage();
    
    console.log('✓ Loaded initial preset from config/presets/zigmap_init.json');
    return true;
  } catch (err) {
    console.warn('Could not load initial preset:', err);
    return false;
  }
}

async function init() {
  const ZM = window.ZigMap26;
  
  // Initialize camera
  ZM.camera = new Camera(ZM.params);
  
  // Load saved settings or initial preset
  const hadSavedSettings = ZM.loadFromLocalStorage();
  
  // Initialize preset manager
  initializeStateManager(ZM);
  
  // Load initial preset for first-time users
  if (!hadSavedSettings) {
    await loadInitialPreset(ZM);
  }
  
  // Attach rendering functions
  attachToZM(ZM);
  
  // Initialize UI
  initializeUI(ZM);
  
  // Load initial state if we loaded the preset
  if (!hadSavedSettings && ZM._initialStateId && ZM.stateManager.load) {
    // Update state panel UI first
    if (ZM.updateStatePanel) {
      ZM.updateStatePanel();
    }
    // Then load the first state
    ZM.stateManager.load(ZM._initialStateId);
    delete ZM._initialStateId;
  } else if (hadSavedSettings && ZM.syncUIFromParams) {
    // Sync UI if we loaded saved settings
    ZM.syncUIFromParams();
  } else {
    // Create p5 sketches
    ZM.initializeSketches();
  }
  
  // Setup input handlers
  setupKeyboardHandlers(ZM);
  setupMouseHandlers(ZM);
  
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
