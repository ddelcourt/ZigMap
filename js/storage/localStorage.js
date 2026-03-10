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
 * Download parameters as JSON file
 * @param {Object} params - Parameters to export
 */
export function downloadJSON(params) {
  const blob = new Blob([JSON.stringify(params, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const a = document.createElement('a');
  a.href = url;
  a.download = `zigmap26-settings-${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Load parameters from JSON file
 * @param {File} file - File object to load
 * @param {Function} callback - Callback function(loadedParams)
 */
export function loadJSON(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const loaded = JSON.parse(e.target.result);
      
      // Validate critical values
      if (loaded.near < 0.01) loaded.near = 0.01;
      
      // Ensure palettes exist (for backward compatibility)
      if (!loaded.palettes || !Array.isArray(loaded.palettes) || loaded.palettes.length !== 4) {
        loaded.palettes = DEFAULT_PARAMS.palettes;
      }
      if (loaded.activePaletteIndex === undefined) loaded.activePaletteIndex = 0;
      if (loaded.colorTransitionDuration === undefined) loaded.colorTransitionDuration = 3.0;
      if (loaded.colorSlotZOffset === undefined) loaded.colorSlotZOffset = 100;
      
      callback(loaded);
    } catch (err) {
      console.error('JSON load failed:', err);
      alert('Error loading JSON file. Please check the file format.');
    }
  };
  reader.readAsText(file);
}
