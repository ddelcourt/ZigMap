// ═══════════════════════════════════════════════════════════════════════════
// ZIGMAP26 - State Manager Module
// Manage multiple states/states of the application
// ═══════════════════════════════════════════════════════════════════════════

import { triggerPaletteChange } from '../core/colorUtils.js';

const STATES_STORAGE_KEY = 'ZigMap26_states';
const ACTIVE_STATE_KEY = 'ZigMap26_activeState';

/**
 * Initialize state manager
 * @param {Object} ZM - Main application object
 */
export function initializeStateManager(ZM) {
  ZM.stateManager = {
    states: loadStates(),
    activeStateId: loadActiveStateId(),
    
    // Core operations
    save: (name) => saveState(ZM, name),
    load: (id) => loadState(ZM, id),
    update: (id) => updateState(ZM, id),
    delete: (id) => deleteState(ZM, id),
    rename: (id, newName) => renameState(ZM, id, newName),
    duplicate: (id) => duplicateState(ZM, id),
    
    // Import/Export
    exportState: (id) => exportStateToFile(ZM, id),
    exportAll: () => exportAllStates(ZM),
    importState: (jsonData) => importStateFromData(ZM, jsonData),
    
    // Utilities
    getStateById: (id) => getStateById(ZM, id),
    getAllStates: () => ZM.stateManager.states,
    setActive: (id) => setActiveState(ZM, id),
    saveToStorage: () => saveStatesToStorage(ZM),
    
    // Auto-trigger
    loadRandomState: () => loadRandomState(ZM)
  };
  
  // Initialize auto-trigger timer
  ZM.autoTriggerTimer = {
    elapsed: 0,
    lastTriggerTime: 0
  };
  
  // Create initial state if none exist
  if (ZM.stateManager.states.length === 0) {
    const initialState = captureCurrentState(ZM, 'Initial State');
    ZM.stateManager.states.push(initialState);
    ZM.stateManager.activeStateId = initialState.id;
    saveStatesToStorage(ZM);
  }
}

/**
 * Capture current application state
 * @param {Object} ZM - Main application object
 * @param {String} name - State name
 * @returns {Object} State object
 */
function captureCurrentState(ZM, name) {
  // Deep clone all parameters
  const params = JSON.parse(JSON.stringify(ZM.params));
  
  // Exclude project-wide settings from state capture
  delete params.stateTransitionDuration;
  delete params.colorTransitionDuration;
  delete params.autoTriggerStates;
  delete params.autoTriggerFrequency;
  
  // Exclude overlay settings (these are project-wide, not state-specific)
  delete params.overlayImageSrc;
  delete params.overlayVisible;
  delete params.overlayScale;
  delete params.overlayOpacity;
  delete params.overlayX;
  delete params.overlayY;
  
  // Exclude rendering/camera settings (only FOV is state-specific)
  delete params.near;
  delete params.far;
  delete params.framebufferMode;
  delete params.framebufferPreset;
  delete params.framebufferWidth;
  delete params.framebufferHeight;
  delete params.stereoscopicMode;
  delete params.eyeSeparation;
  
  // Verify palettes are captured correctly
  if (!params.palettes || params.palettes.length !== 4) {
    console.error('Warning: Palettes not properly captured', params.palettes);
  }
  
  // Capture camera state
  const camera = {
    rotationX: ZM.camera.rotationX,
    rotationY: ZM.camera.rotationY,
    distance: ZM.camera.distance,
    offsetX: ZM.camera.offsetX,
    offsetY: ZM.camera.offsetY
  };
  
  // Create state object
  const state = {
    id: `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || `State ${Date.now()}`,
    timestamp: Date.now(),
    params: params,
    camera: camera,
    metadata: {
      version: '1.0'
    }
  };
  
  console.log('State captured:', state.name, 'Active palette:', params.activePaletteIndex);
  
  return state;
}

/**
 * Restore state state with smooth transitions
 * @param {Object} ZM - Main application object
 * @param {Object} state - State to restore
 */
function restoreState(ZM, state) {
  console.log('Restoring state:', state.name, 'Palettes:', state.params.palettes);
  
  // Store old values for transition
  const oldParams = JSON.parse(JSON.stringify(ZM.params));
  const oldCamera = {
    rotationX: ZM.camera.rotationX,
    rotationY: ZM.camera.rotationY,
    distance: ZM.camera.distance,
    offsetX: ZM.camera.offsetX,
    offsetY: ZM.camera.offsetY
  };
  
  // Deep clone state params to avoid reference issues
  const restoredParams = JSON.parse(JSON.stringify(state.params));
  
  console.log('Restored params active palette:', restoredParams.activePaletteIndex);
  
  // Preserve project-wide settings
  const preservedSettings = {
    stateTransitionDuration: ZM.params.stateTransitionDuration,
    colorTransitionDuration: ZM.params.colorTransitionDuration,
    autoTriggerStates: ZM.params.autoTriggerStates,
    autoTriggerFrequency: ZM.params.autoTriggerFrequency,
    // Overlay settings
    overlayImageSrc: ZM.params.overlayImageSrc,
    overlayVisible: ZM.params.overlayVisible,
    overlayScale: ZM.params.overlayScale,
    overlayOpacity: ZM.params.overlayOpacity,
    overlayX: ZM.params.overlayX,
    overlayY: ZM.params.overlayY,
    // Rendering/camera settings (only FOV is state-specific)
    near: ZM.params.near,
    far: ZM.params.far,
    framebufferMode: ZM.params.framebufferMode,
    framebufferPreset: ZM.params.framebufferPreset,
    framebufferWidth: ZM.params.framebufferWidth,
    framebufferHeight: ZM.params.framebufferHeight,
    stereoscopicMode: ZM.params.stereoscopicMode,
    eyeSeparation: ZM.params.eyeSeparation
  };
  
  // Update params with deep cloned values
  Object.assign(ZM.params, restoredParams);
  
  // Restore preserved project-wide settings
  Object.assign(ZM.params, preservedSettings);
  
  console.log('ZM.params after assign, active palette:', ZM.params.activePaletteIndex);
  console.log('ZM.params.palettes:', ZM.params.palettes);
  
  // Trigger camera transition (4.5 seconds)
  if (state.camera) {
    ZM.camera.transitionTo(
      state.camera.rotationX,
      state.camera.rotationY,
      state.camera.distance,
      state.camera.offsetX,
      state.camera.offsetY
    );
  }
  
  // Trigger FOV transition
  if (ZM.fovTransition && state.params.fov !== undefined) {
    ZM.fovTransition.start = ZM.fovTransition.current;
    ZM.fovTransition.target = state.params.fov;
    ZM.fovTransition.progress = 0.0;
    ZM.fovTransition.duration = ZM.params.stateTransitionDuration; // Use current transition duration
    ZM.fovTransition.isTransitioning = true;
  }
  
  // Trigger emitter rotation transition
  if (ZM.emitterRotationTransition && state.params.emitterRotation !== undefined) {
    ZM.emitterRotationTransition.start = ZM.emitterRotationTransition.current;
    ZM.emitterRotationTransition.target = state.params.emitterRotation;
    ZM.emitterRotationTransition.progress = 0.0;
    ZM.emitterRotationTransition.duration = ZM.params.stateTransitionDuration; // Use current transition duration
    ZM.emitterRotationTransition.isTransitioning = true;
  }
  
  // Trigger geometry scale transition
  if (ZM.geometryScaleTransition && state.params.geometryScale !== undefined) {
    ZM.geometryScaleTransition.start = ZM.geometryScaleTransition.current;
    ZM.geometryScaleTransition.target = state.params.geometryScale;
    ZM.geometryScaleTransition.progress = 0.0;
    ZM.geometryScaleTransition.duration = ZM.params.stateTransitionDuration; // Use current transition duration
    ZM.geometryScaleTransition.isTransitioning = true;
  }
  
  // Check if palette changed - trigger smooth transition
  const paletteChanged = oldParams.activePaletteIndex !== ZM.params.activePaletteIndex ||
                         JSON.stringify(oldParams.palettes) !== JSON.stringify(ZM.params.palettes);
  
  console.log('Palette changed?', paletteChanged);
  
  if (paletteChanged) {
    triggerPaletteChange(ZM);
  }
  
  // Update all UI elements WITHOUT triggering events
  syncUIWithoutRestart(ZM);
  
  // Save to main localStorage
  ZM.saveToLocalStorage();
  
  // Reset auto-trigger timer to prevent immediate re-triggering
  if (ZM.autoTriggerTimer) {
    ZM.autoTriggerTimer.elapsed = 0;
  }
  
  console.log('State restored with camera transition');
}

/**
 * Sync UI without restarting sketches or resetting transitions
 * @param {Object} ZM - Main application object
 */
function syncUIWithoutRestart(ZM) {
  // Mapping of slider IDs to parameter keys with decimal precision
  const sliderMap = {
    'thickness': { param: 'lineThickness', decimals: 1 },
    'emit-rate': { param: 'emitRate', decimals: 1 },
    'speed': { param: 'speed', decimals: 0 },
    'emitter-rotation': { param: 'emitterRotation', decimals: 0 },
    'geometry-scale': { param: 'geometryScale', decimals: 0 },
    'fade-duration': { param: 'fadeDuration', decimals: 1 },
    'color-slot-z-offset': { param: 'colorSlotZOffset', decimals: 0 },
    'ambient-speed-master': { param: 'ambientSpeedMaster', decimals: 0 },
    'video-duration': { param: 'videoDuration', decimals: 0 },
    'video-fps': { param: 'videoFPS', decimals: 0 },
    'eye-separation': { param: 'eyeSeparation', decimals: 0 },
    'fov': { param: 'fov', decimals: 2 },
    'near': { param: 'near', decimals: 2 },
    'far': { param: 'far', decimals: 0 },
    'state-transition-duration': { param: 'stateTransitionDuration', decimals: 1 },
    'color-transition-duration': { param: 'colorTransitionDuration', decimals: 1 },
    'auto-trigger-frequency': { param: 'autoTriggerFrequency', decimals: 0 },
    'overlay-scale': { param: 'overlayScale', decimals: 0 },
    'overlay-opacity': { param: 'overlayOpacity', decimals: 0 },
    'overlay-x': { param: 'overlayX', decimals: 0 },
    'overlay-y': { param: 'overlayY', decimals: 0 }
  };
  
  // Update all sliders
  Object.entries(sliderMap).forEach(([sliderId, config]) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(sliderId + '-val');
    
    if (slider && ZM.params[config.param] !== undefined) {
      slider.value = ZM.params[config.param];
      if (display) {
        display.textContent = config.decimals > 0 ? 
          ZM.params[config.param].toFixed(config.decimals) : 
          Math.round(ZM.params[config.param]);
      }
    }
  });
  
  // Update range sliders (thickness-range, speed-range)
  updateRangeSlider('thickness-range', ZM.params.thicknessRangeMin, ZM.params.thicknessRangeMax, '%');
  updateRangeSlider('speed-range', ZM.params.speedRangeMin, ZM.params.speedRangeMax, '%');
  
  // Update checkboxes
  const checkboxMap = {
    'random-thickness': 'randomThickness',
    'random-speed': 'randomSpeed',
    'depth-invert': 'depthInvert',
    'stereoscopic-mode': 'stereoscopicMode',
    'framebuffer-mode': 'framebufferMode',
    'auto-trigger-states': 'autoTriggerStates',
    'overlay-visible': 'overlayVisible'
  };
  
  Object.entries(checkboxMap).forEach(([checkboxId, paramKey]) => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && ZM.params[paramKey] !== undefined) {
      checkbox.checked = ZM.params[paramKey];
    }
  });
  
  // Update framebuffer preset dropdown
  const fbPreset = document.getElementById('framebuffer-preset');
  if (fbPreset && ZM.params.framebufferPreset) {
    fbPreset.value = ZM.params.framebufferPreset;
  }
  
  // Update framebuffer dimensions
  const fbWidth = document.getElementById('framebuffer-width');
  const fbHeight = document.getElementById('framebuffer-height');
  if (fbWidth) fbWidth.value = ZM.params.framebufferWidth;
  if (fbHeight) fbHeight.value = ZM.params.framebufferHeight;
  
  // Update eye separation control state (enable/disable based on stereoscopic mode)
  const eyeSeparationSlider = document.getElementById('eye-separation');
  const eyeSeparationDisplay = document.getElementById('eye-separation-val');
  if (eyeSeparationSlider) {
    eyeSeparationSlider.disabled = !ZM.params.stereoscopicMode;
  }
  if (eyeSeparationDisplay) {
    if (ZM.params.stereoscopicMode) {
      eyeSeparationDisplay.classList.remove('disabled');
    } else {
      eyeSeparationDisplay.classList.add('disabled');
    }
  }
  
  // Update palette UI
  if (ZM.updatePaletteUI) {
    ZM.updatePaletteUI();
  }
  
  // Update overlay image
  if (ZM.updateOverlay) {
    ZM.updateOverlay();
  }
  
  // Update active palette button
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.palette) === ZM.params.activePaletteIndex);
  });
  
  // Update camera controls display
  updateCameraDisplays(ZM);
}

/**
 * Update range slider display
 */
function updateRangeSlider(baseId, minVal, maxVal, suffix = '') {
  const minSlider = document.getElementById(`${baseId}-min`);
  const maxSlider = document.getElementById(`${baseId}-max`);
  const minDisplay = document.getElementById(`${baseId}-min-val`);
  const maxDisplay = document.getElementById(`${baseId}-max-val`);
  
  if (minSlider && minVal !== undefined) {
    minSlider.value = minVal;
  }
  if (maxSlider && maxVal !== undefined) {
    maxSlider.value = maxVal;
  }
  if (minDisplay && minVal !== undefined) {
    minDisplay.textContent = minVal + suffix;
  }
  if (maxDisplay && maxVal !== undefined) {
    maxDisplay.textContent = maxVal + suffix;
  }
}

/**
 * Update camera control displays
 * @param {Object} ZM - Main application object
 */
function updateCameraDisplays(ZM) {
  // Update any camera-related displays
  const rotXDisplay = document.getElementById('camera-rotation-x-val');
  const rotYDisplay = document.getElementById('camera-rotation-y-val');
  const distDisplay = document.getElementById('camera-distance-val');
  
  if (rotXDisplay) rotXDisplay.textContent = ZM.camera.rotationX.toFixed(2);
  if (rotYDisplay) rotYDisplay.textContent = ZM.camera.rotationY.toFixed(2);
  if (distDisplay) distDisplay.textContent = Math.round(ZM.camera.distance);
}

/**
 * Save new state
 * @param {Object} ZM - Main application object
 * @param {String} name - State name
 * @returns {Object} Created state
 */
function saveState(ZM, name) {
  const state = captureCurrentState(ZM, name);
  ZM.stateManager.states.push(state);
  ZM.stateManager.activeStateId = state.id;
  saveStatesToStorage(ZM);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  return state;
}

/**
 * Load state by ID
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 * @returns {Boolean} Success status
 */
function loadState(ZM, id) {
  const state = getStateById(ZM, id);
  if (!state) {
    console.warn('State not found:', id);
    return false;
  }
  
  restoreState(ZM, state);
  ZM.stateManager.activeStateId = id;
  saveActiveStateId(id);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  return true;
}

/**
 * Update state with current state
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID to update
 * @returns {Boolean} Success status
 */
function updateState(ZM, id) {
  const stateIndex = ZM.stateManager.states.findIndex(p => p.id === id);
  if (stateIndex === -1) {
    console.warn('State not found:', id);
    return false;
  }
  
  const existingState = ZM.stateManager.states[stateIndex];
  
  // Capture current state
  const updatedState = captureCurrentState(ZM, existingState.name);
  
  // Keep the original ID and creation timestamp
  updatedState.id = existingState.id;
  updatedState.timestamp = Date.now(); // Update timestamp to show it was modified
  
  // Replace the state
  ZM.stateManager.states[stateIndex] = updatedState;
  
  saveStatesToStorage(ZM);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  console.log('State updated:', updatedState.name);
  
  return true;
}

/**
 * Delete state
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 * @returns {Boolean} Success status
 */
function deleteState(ZM, id) {
  const index = ZM.stateManager.states.findIndex(p => p.id === id);
  if (index === -1) {
    console.warn('State not found:', id);
    return false;
  }
  
  // Don't allow deleting the last state
  if (ZM.stateManager.states.length === 1) {
    if (ZM.showToast) ZM.showToast('Cannot delete the last state');
    return false;
  }
  
  ZM.stateManager.states.splice(index, 1);
  
  // If deleted state was active, switch to first state
  if (ZM.stateManager.activeStateId === id) {
    loadState(ZM, ZM.stateManager.states[0].id);
  }
  
  saveStatesToStorage(ZM);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  return true;
}

/**
 * Rename state
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 * @param {String} newName - New name
 * @returns {Boolean} Success status
 */
function renameState(ZM, id, newName) {
  const state = getStateById(ZM, id);
  if (!state) {
    console.warn('State not found:', id);
    return false;
  }
  
  state.name = newName;
  saveStatesToStorage(ZM);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  return true;
}

/**
 * Duplicate state
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID to duplicate
 * @returns {Object|null} New state or null if failed
 */
function duplicateState(ZM, id) {
  const state = getStateById(ZM, id);
  if (!state) {
    console.warn('State not found:', id);
    return null;
  }
  
  const newState = {
    ...JSON.parse(JSON.stringify(state)),
    id: `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${state.name} (Copy)`,
    timestamp: Date.now()
  };
  
  ZM.stateManager.states.push(newState);
  saveStatesToStorage(ZM);
  
  // Update UI if state panel exists
  if (ZM.updateStatePanel) {
    ZM.updateStatePanel();
  }
  
  return newState;
}

/**
 * Export state to JSON file
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 */
function exportStateToFile(ZM, id) {
  const state = getStateById(ZM, id);
  if (!state) {
    console.warn('State not found:', id);
    return;
  }
  
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zigmap26-state-${state.name.replace(/[^a-z0-9]/gi, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export all states to JSON file
 * @param {Object} ZM - Main application object
 */
function exportAllStates(ZM) {
  const data = {
    version: '1.0',
    states: ZM.stateManager.states,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zigmap26-states-bank-${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import state from JSON data
 * @param {Object} ZM - Main application object
 * @param {Object} jsonData - State data
 * @returns {Boolean} Success status
 */
function importStateFromData(ZM, jsonData) {
  try {
    // Check if it's a single state or state bank
    if (jsonData.states && Array.isArray(jsonData.states)) {
      // State bank
      jsonData.states.forEach(state => {
        // Generate new ID to avoid conflicts
        state.id = `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Remove project-wide settings if they exist in imported state
        if (state.params) {
          delete state.params.stateTransitionDuration;
          delete state.params.colorTransitionDuration;
          delete state.params.autoTriggerStates;
          delete state.params.autoTriggerFrequency;
          delete state.params.near;
          delete state.params.far;
          delete state.params.framebufferMode;
          delete state.params.framebufferPreset;
          delete state.params.framebufferWidth;
          delete state.params.framebufferHeight;
          delete state.params.stereoscopicMode;
          delete state.params.eyeSeparation;
        }
        ZM.stateManager.states.push(state);
      });
    } else if (jsonData.id && jsonData.params) {
      // Single state
      jsonData.id = `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Remove project-wide settings if they exist in imported state
      delete jsonData.params.stateTransitionDuration;
      delete jsonData.params.colorTransitionDuration;
      delete jsonData.params.autoTriggerStates;
      delete jsonData.params.autoTriggerFrequency;
      delete jsonData.params.near;
      delete jsonData.params.far;
      delete jsonData.params.framebufferMode;
      delete jsonData.params.framebufferPreset;
      delete jsonData.params.framebufferWidth;
      delete jsonData.params.framebufferHeight;
      delete jsonData.params.stereoscopicMode;
      delete jsonData.params.eyeSeparation;
      ZM.stateManager.states.push(jsonData);
    } else {
      console.error('Invalid state format');
      return false;
    }
    
    saveStatesToStorage(ZM);
    
    // Update UI if state panel exists
    if (ZM.updateStatePanel) {
      ZM.updateStatePanel();
    }
    
    return true;
  } catch (err) {
    console.error('Failed to import state:', err);
    return false;
  }
}

/**
 * Get state by ID
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 * @returns {Object|null} State or null
 */
function getStateById(ZM, id) {
  return ZM.stateManager.states.find(p => p.id === id) || null;
}

/**
 * Set active state (without loading)
 * @param {Object} ZM - Main application object
 * @param {String} id - State ID
 */
function setActiveState(ZM, id) {
  ZM.stateManager.activeStateId = id;
  saveActiveStateId(id);
}

/**
 * Load states from localStorage
 * @returns {Array} Array of states
 */
function loadStates() {
  try {
    const stored = localStorage.getItem(STATES_STORAGE_KEY);
    if (!stored) return [];
    const states = JSON.parse(stored);
    
    // Clean up project-wide settings from states (for backward compatibility)
    states.forEach(state => {
      if (state.params) {
        delete state.params.stateTransitionDuration;
        delete state.params.colorTransitionDuration;
        delete state.params.autoTriggerStates;
        delete state.params.autoTriggerFrequency;
        delete state.params.near;
        delete state.params.far;
        delete state.params.framebufferMode;
        delete state.params.framebufferPreset;
        delete state.params.framebufferWidth;
        delete state.params.framebufferHeight;
        delete state.params.stereoscopicMode;
        delete state.params.eyeSeparation;
      }
    });
    
    return states;
  } catch (e) {
    console.warn('Failed to load states:', e);
    return [];
  }
}

/**
 * Save states to localStorage
 * @param {Object} ZM - Main application object
 */
function saveStatesToStorage(ZM) {
  try {
    localStorage.setItem(STATES_STORAGE_KEY, JSON.stringify(ZM.stateManager.states));
  } catch (e) {
    console.warn('Failed to save states:', e);
  }
}

/**
 * Load active state ID
 * @returns {String|null} Active state ID or null
 */
function loadActiveStateId() {
  try {
    return localStorage.getItem(ACTIVE_STATE_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * Save active state ID
 * @param {String} id - State ID
 */
function saveActiveStateId(id) {
  try {
    localStorage.setItem(ACTIVE_STATE_KEY, id);
  } catch (e) {
    console.warn('Failed to save active state ID:', e);
  }
}

/**
 * Load a random state (excluding current active state)
 * TRULY RANDOM: Uses Math.random() with fresh generation each call.
 * NO SEQUENCE: No history or pattern tracking - each selection is independent.
 * ALWAYS DIFFERENT: Filters out the currently active state before random selection.
 * 
 * @param {Object} ZM - Main application object
 * @returns {Boolean} Success status
 */
function loadRandomState(ZM) {
  const states = ZM.stateManager.states;
  const activeId = ZM.stateManager.activeStateId;
  
  // Need at least 2 states to select a different one
  if (states.length < 2) {
    return false;
  }
  
  // Filter out the currently active state (ensures we NEVER pick the same state)
  const availableStates = states.filter(state => state.id !== activeId);
  
  if (availableStates.length === 0) {
    return false;
  }
  
  // Generate fresh random number (0 to 1) and select state
  // This is TRUE RANDOM - no memory, no sequence, no pattern
  const randomIndex = Math.floor(Math.random() * availableStates.length);
  const randomState = availableStates[randomIndex];
  
  // Load the random state (this updates activeStateId for next call)
  return loadState(ZM, randomState.id);
}
