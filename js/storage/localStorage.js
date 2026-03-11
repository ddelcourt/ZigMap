// ═══════════════════════════════════════════════════════════════════════════
// ZIGMAP26 - Local Storage Module
// Save and load application settings
// ═══════════════════════════════════════════════════════════════════════════

import { STORAGE_KEY } from '../config/constants.js';
import { DEFAULT_PARAMS } from '../config/defaults.js';

/**
 * Save parameters to localStorage
 * @param {Object} params - Parameters object to save
 */
export function saveToLocalStorage(params) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

/**
 * Load parameters from localStorage
 * @param {Object} defaultParams - Default parameters to merge with
 * @returns {Object|null} Loaded parameters or null if failed
 */
export function loadFromLocalStorage(defaultParams) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const loaded = JSON.parse(stored);
    
    // Ensure critical values are valid
    if (loaded.near < 0.01) loaded.near = 0.01;
    if (loaded.cameraDistance < 50) loaded.cameraDistance = 600;
    if (loaded.cameraOffsetX === undefined) loaded.cameraOffsetX = 0;
    if (loaded.cameraOffsetY === undefined) loaded.cameraOffsetY = 0;
    if (loaded.depthInvert === undefined) loaded.depthInvert = false;
    
    // Ensure palettes exist (for backward compatibility with old saves)
    if (!loaded.palettes || !Array.isArray(loaded.palettes) || loaded.palettes.length !== 4) {
      loaded.palettes = defaultParams.palettes;
    }
    if (loaded.activePaletteIndex === undefined) loaded.activePaletteIndex = 0;
    if (loaded.colorTransitionDuration === undefined) loaded.colorTransitionDuration = 3.0;
    if (loaded.colorSlotZOffset === undefined) loaded.colorSlotZOffset = 100;
    
    return { ...defaultParams, ...loaded };
  } catch (e) {
    console.warn('localStorage load failed:', e);
    return null;
  }
}

/**
 * Download project (parameters + presets) as JSON file
 * @param {Object} ZM - Main application object (or just params for backward compat)
 */
export function downloadJSON(ZM) {
  // Support backward compatibility if just params are passed
  const data = ZM.params ? {
    version: '2.0',
    params: ZM.params,
    states: ZM.stateManager?.states || [],
    activeStateId: ZM.stateManager?.activeStateId || null,
    saveDate: new Date().toISOString()
  } : ZM; // Fallback to old format if ZM is actually params
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const a = document.createElement('a');
  a.href = url;
  a.download = `zigmap26-project-${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Load project from JSON file (parameters + presets)
 * @param {File} file - File object to load
 * @param {Function} callback - Callback function(loadedData)
 */
export function loadJSON(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const loaded = JSON.parse(e.target.result);
      
      // Detect format: v2 has "params" field, v1 is just params at root
      const isV2 = loaded.version === '2.0' && loaded.params;
      const params = isV2 ? loaded.params : loaded;
      
      // Validate critical values
      if (params.near < 0.01) params.near = 0.01;
      
      // Ensure palettes exist (for backward compatibility)
      if (!params.palettes || !Array.isArray(params.palettes) || params.palettes.length !== 4) {
        params.palettes = DEFAULT_PARAMS.palettes;
      }
      if (params.activePaletteIndex === undefined) params.activePaletteIndex = 0;
      if (params.colorTransitionDuration === undefined) params.colorTransitionDuration = 3.0;
      if (params.colorSlotZOffset === undefined) params.colorSlotZOffset = 100;
      
      // Pass back full data structure or just params for v1
      callback(isV2 ? {
        params: params,
        states: loaded.states || [],
        activeStateId: loaded.activeStateId || null
      } : { params: params });
    } catch (err) {
      console.error('JSON load failed:', err);
      if (window.ZigMap26 && window.ZigMap26.showToast) {
        window.ZigMap26.showToast('Error loading JSON file. Please check the file format.');
      }
    }
  };
  reader.readAsText(file);
}
