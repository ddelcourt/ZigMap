/**
 * UIController — Binds UI controls to parameters
 */

import { triggerPaletteChange, getBackgroundColor } from '../core/colorUtils.js';

export function initializeUI(ZM) {
  // Load JSON configs for UI presets
  loadUIConfigs().then(() => {
    initializeAllControls(ZM);
    setupExportButtons(ZM);
    setupCollapsibleSections();
    setupLanguageFilter();
    setupDocumentationButtons();
  });
  
  // Store sync function
  ZM.syncUIFromParams = () => syncUIFromParams(ZM);
  ZM.updatePaletteUI = () => updatePaletteUI(ZM);
}

/**
 * Load UI configuration files
 */
async function loadUIConfigs() {
  try {
    const [keyboardShortcuts, uiPresets, appInfo] = await Promise.all([
      fetch('config/keyboardShortcuts.json').then(r => r.json()),
      fetch('config/uiPresets.json').then(r => r.json()),
      fetch('config/appInfo.json').then(r => r.json())
    ]);
    
    window.ZigMap26.config = { keyboardShortcuts, uiPresets, appInfo };
  } catch (err) {
    console.error('Failed to load UI configs:', err);
  }
}

/**
 * Initialize all UI controls
 */
function initializeAllControls(ZM) {
  // Standard sliders
  wireSlider(ZM, 'thickness', 'thickness-val', 'lineThickness', 1);
  wireSlider(ZM, 'emit-rate', 'emit-rate-val', 'emitRate');
  wireSlider(ZM, 'speed', 'speed-val', 'speed');
  wireSlider(ZM, 'emitter-rotation', 'emitter-rotation-val', 'emitterRotation');
  wireSlider(ZM, 'geometry-scale', 'geometry-scale-val', 'geometryScale');
  wireSlider(ZM, 'fade-duration', 'fade-duration-val', 'fadeDuration');
  wireSlider(ZM, 'color-slot-z-offset', 'color-slot-z-offset-val', 'colorSlotZOffset');
  wireSlider(ZM, 'ambient-speed-master', 'ambient-speed-master-val', 'ambientSpeedMaster');
  wireSlider(ZM, 'video-duration', 'video-duration-val', 'videoDuration');
  wireSlider(ZM, 'video-fps', 'video-fps-val', 'videoFPS');
  wireSlider(ZM, 'eye-separation', 'eye-separation-val', 'eyeSeparation');
  
  // FOV with distance compensation
  setupFOVControl(ZM);
  
  // Near/Far clipping planes
  setupClippingPlanes(ZM);
  
  // Thickness range
  setupRangeControl(ZM, 'thickness-range', 'thicknessRange', '%');
  
  // Speed range
  setupRangeControl(ZM, 'speed-range', 'speedRange', '%');
  
  // Checkboxes
  wireCheckbox(ZM, 'random-thickness', 'randomThickness');
  wireCheckbox(ZM, 'random-speed', 'randomSpeed');
  wireCheckbox(ZM, 'depth-invert', 'depthInvert');
  
  // Stereoscopic controls
  setupStereoscopicControls(ZM);
  
  // Framebuffer controls
  setupFramebufferControls(ZM);
  
  // Palette UI
  setupPaletteUI(ZM);
  
  // Video format buttons
  setupVideoFormatButtons(ZM);
  
  // File save/load
  setupFileSaveLoad(ZM);
  
  // UI buttons
  setupUIButtons(ZM);
}

/**
 * Wire a simple slider to a parameter
 */
function wireSlider(ZM, sliderId, displayId, paramKey, decimals = 0) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  
  if (!slider || !display) return;
  
  slider.value = ZM.params[paramKey];
  display.textContent = decimals > 0 ? 
    ZM.params[paramKey].toFixed(decimals) : 
    ZM.params[paramKey];
  
  slider.addEventListener('input', () => {
    ZM.params[paramKey] = parseFloat(slider.value);
    display.textContent = decimals > 0 ? 
      ZM.params[paramKey].toFixed(decimals) : 
      ZM.params[paramKey];
    ZM.saveToLocalStorage();
  });
}

/**
 * Wire a checkbox to a parameter
 */
function wireCheckbox(ZM, checkboxId, paramKey) {
  const checkbox = document.getElementById(checkboxId);
  if (!checkbox) return;
  
  checkbox.checked = ZM.params[paramKey];
  checkbox.addEventListener('change', (e) => {
    ZM.params[paramKey] = e.target.checked;
    ZM.saveToLocalStorage();
  });
}

/**
 * Setup FOV control with distance compensation
 */
function setupFOVControl(ZM) {
  const slider = document.getElementById('fov');
  const display = document.getElementById('fov-val');
  
  if (!slider || !display) return;
  
  slider.value = ZM.params.fov;
  display.textContent = ZM.params.fov.toFixed(2);
  
  slider.addEventListener('input', () => {
    const oldFOV = ZM.params.fov;
    const newFOV = parseFloat(slider.value);
    const oldFOVRad = oldFOV * Math.PI / 180;
    const newFOVRad = newFOV * Math.PI / 180;
    const ratio = Math.tan(oldFOVRad / 2) / Math.tan(newFOVRad / 2);
    const newDist = Math.max(50, Math.min(10000, ZM.camera.distance * ratio));
    
    ZM.params.fov = newFOV;
    ZM.camera.distance = newDist;
    ZM.params.cameraDistance = newDist;
    display.textContent = newFOV.toFixed(2);
    ZM.saveToLocalStorage();
  });
}

/**
 * Setup clipping planes controls
 */
function setupClippingPlanes(ZM) {
  const nearSlider = document.getElementById('near');
  const farSlider = document.getElementById('far');
  const nearDisplay = document.getElementById('near-val');
  const farDisplay = document.getElementById('far-val');
  
  if (!nearSlider || !farSlider) return;
  
  nearSlider.value = ZM.params.near;
  farSlider.value = ZM.params.far;
  nearDisplay.textContent = ZM.params.near.toFixed(2);
  farDisplay.textContent = ZM.params.far;
  
  nearSlider.addEventListener('input', () => {
    ZM.params.near = Math.max(0.01, parseFloat(nearSlider.value));
    nearDisplay.textContent = ZM.params.near.toFixed(2);
    ZM.saveToLocalStorage();
  });
  
  farSlider.addEventListener('input', () => {
    ZM.params.far = parseFloat(farSlider.value);
    farDisplay.textContent = ZM.params.far;
    ZM.saveToLocalStorage();
  });
}

/**
 * Setup range control (min/max sliders)
 */
function setupRangeControl(ZM, baseId, paramBase, suffix = '') {
  const minSlider = document.getElementById(`${baseId}-min`);
  const maxSlider = document.getElementById(`${baseId}-max`);
  const minDisplay = document.getElementById(`${baseId}-min-val`);
  const maxDisplay = document.getElementById(`${baseId}-max-val`);
  
  if (!minSlider || !maxSlider) return;
  
  const minKey = `${paramBase}Min`;
  const maxKey = `${paramBase}Max`;
  
  minSlider.value = ZM.params[minKey];
  maxSlider.value = ZM.params[maxKey];
  minDisplay.textContent = ZM.params[minKey] + suffix;
  maxDisplay.textContent = ZM.params[maxKey] + suffix;
  
  minSlider.addEventListener('input', () => {
    if (+minSlider.value > +maxSlider.value) {
      minSlider.value = maxSlider.value;
    }
    ZM.params[minKey] = +minSlider.value;
    minDisplay.textContent = minSlider.value + suffix;
    ZM.saveToLocalStorage();
  });
  
  maxSlider.addEventListener('input', () => {
    if (+maxSlider.value < +minSlider.value) {
      maxSlider.value = minSlider.value;
    }
    ZM.params[maxKey] = +maxSlider.value;
    maxDisplay.textContent = maxSlider.value + suffix;
    ZM.saveToLocalStorage();
  });
}

/**
 * Setup stereoscopic mode controls
 */
function setupStereoscopicControls(ZM) {
  const checkbox = document.getElementById('stereoscopic-mode');
  const eyeSeparationSlider = document.getElementById('eye-separation');
  const eyeSeparationDisplay = document.getElementById('eye-separation-val');
  
  if (!checkbox) return;
  
  // Function to update eye separation control state
  const updateEyeSeparationState = (enabled) => {
    if (eyeSeparationSlider) {
      eyeSeparationSlider.disabled = !enabled;
    }
    if (eyeSeparationDisplay) {
      if (enabled) {
        eyeSeparationDisplay.classList.remove('disabled');
      } else {
        eyeSeparationDisplay.classList.add('disabled');
      }
    }
  };
  
  checkbox.checked = ZM.params.stereoscopicMode;
  updateEyeSeparationState(ZM.params.stereoscopicMode);
  
  checkbox.addEventListener('change', (e) => {
    ZM.params.stereoscopicMode = e.target.checked;
    updateEyeSeparationState(e.target.checked);
    ZM.initializeSketches();
    if (ZM.params.framebufferMode) {
      setTimeout(() => ZM.updateCanvasSize(), 100);
    }
    ZM.saveToLocalStorage();
  });
}

/**
 * Setup framebuffer resolution controls
 */
function setupFramebufferControls(ZM) {
  const modeCheckbox = document.getElementById('framebuffer-mode');
  const presetSelect = document.getElementById('framebuffer-preset');
  const widthInput = document.getElementById('framebuffer-width');
  const heightInput = document.getElementById('framebuffer-height');
  
  if (!modeCheckbox) return;
  
  // Mode checkbox
  modeCheckbox.checked = ZM.params.framebufferMode;
  modeCheckbox.addEventListener('change', (e) => {
    ZM.params.framebufferMode = e.target.checked;
    ZM.updateCanvasSize();
    ZM.saveToLocalStorage();
  });
  
  // Preset selector
  if (presetSelect) {
    presetSelect.value = ZM.params.framebufferPreset;
    presetSelect.addEventListener('change', (e) => {
      ZM.params.framebufferPreset = e.target.value;
      if (e.target.value !== 'custom') {
        const [w, h] = e.target.value.split('x').map(Number);
        ZM.params.framebufferWidth = w;
        ZM.params.framebufferHeight = h;
        widthInput.value = w;
        heightInput.value = h;
        if (ZM.params.framebufferMode) ZM.updateCanvasSize();
      }
      ZM.saveToLocalStorage();
    });
  }
  
  // Width/height inputs
  if (widthInput) {
    widthInput.value = ZM.params.framebufferWidth;
    widthInput.addEventListener('input', (e) => {
      ZM.params.framebufferWidth = Math.max(320, parseInt(e.target.value) || 1920);
      if (ZM.params.framebufferMode) ZM.updateCanvasSize();
      ZM.params.framebufferPreset = getPresetForDimensions(
        ZM.params.framebufferWidth, 
        ZM.params.framebufferHeight
      );
      presetSelect.value = ZM.params.framebufferPreset;
      ZM.saveToLocalStorage();
    });
  }
  
  if (heightInput) {
    heightInput.value = ZM.params.framebufferHeight;
    heightInput.addEventListener('input', (e) => {
      ZM.params.framebufferHeight = Math.max(240, parseInt(e.target.value) || 1080);
      if (ZM.params.framebufferMode) ZM.updateCanvasSize();
      ZM.params.framebufferPreset = getPresetForDimensions(
        ZM.params.framebufferWidth, 
        ZM.params.framebufferHeight
      );
      presetSelect.value = ZM.params.framebufferPreset;
      ZM.saveToLocalStorage();
    });
  }
}

/**
 * Get preset name for dimensions
 */
function getPresetForDimensions(w, h) {
  const presets = {
    '1920x1080': [1920, 1080],
    '1080x1920': [1080, 1920],
    '1080x1080': [1080, 1080],
    '1920x1920': [1920, 1920],
    '3840x2160': [3840, 2160],
    '2160x3840': [2160, 3840],
    '2160x2160': [2160, 2160],
    '3840x3840': [3840, 3840],
    '3500x1500': [3500, 1500],
    '1080x1440': [1080, 1440]
  };
  
  for (const [key, [pw, ph]] of Object.entries(presets)) {
    if (pw === w && ph === h) return key;
  }
  return 'custom';
}

/**
 * Setup color swatches
 */
/**
 * Setup palette UI controls
 */
function setupPaletteUI(ZM) {
  // Initialize UI from current params
  updatePaletteUI(ZM);
  
  // Palette selector buttons
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const paletteIndex = parseInt(btn.dataset.palette);
      
      // Update active button
      document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update params and trigger color transitions
      ZM.params.activePaletteIndex = paletteIndex;
      updatePaletteUI(ZM);
      triggerPaletteChange(ZM);
      ZM.saveToLocalStorage();
    });
  });
  
  // Color pickers
  document.querySelectorAll('.color-picker').forEach(picker => {
    picker.addEventListener('input', () => {
      const slotIndex = parseInt(picker.dataset.slot);
      const hex = picker.value;
      const rgb = hexToRgb(hex);
      
      ZM.params.palettes[ZM.params.activePaletteIndex][slotIndex].rgb = rgb;
      triggerPaletteChange(ZM);
      ZM.saveToLocalStorage();
    });
  });
  
  // Role selectors
  document.querySelectorAll('.color-role').forEach(select => {
    select.addEventListener('change', () => {
      const slotIndex = parseInt(select.dataset.slot);
      const newRole = select.value;
      const activePalette = ZM.params.palettes[ZM.params.activePaletteIndex];
      
      // Enforce background exclusivity
      if (newRole === 'background') {
        activePalette.forEach((color, idx) => {
          if (idx !== slotIndex && color.role === 'background') {
            color.role = 'none';
          }
        });
        updatePaletteUI(ZM); // Refresh all dropdowns
      }
      
      activePalette[slotIndex].role = newRole;
      triggerPaletteChange(ZM);
      ZM.saveToLocalStorage();
    });
  });
}

/**
 * Update palette UI from current params
 */
function updatePaletteUI(ZM) {
  const activePalette = ZM.params.palettes[ZM.params.activePaletteIndex];
  
  activePalette.forEach((color, idx) => {
    // Update color picker
    const picker = document.querySelector(`.color-picker[data-slot="${idx}"]`);
    if (picker) {
      picker.value = rgbToHex(color.rgb);
    }
    
    // Update role dropdown
    const roleSelect = document.querySelector(`.color-role[data-slot="${idx}"]`);
    if (roleSelect) {
      roleSelect.value = color.role;
    }
  });
}

/**
 * Convert RGB array to hex string
 */
function rgbToHex(rgb) {
  return '#' + rgb.map(c => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert hex string to RGB array
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * Setup video format buttons
 */
function setupVideoFormatButtons(ZM) {
  document.querySelectorAll('[data-format]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ZM.params.videoFormat = btn.dataset.format;
      ZM.saveToLocalStorage();
    });
  });
}

/**
 * Setup file save/load buttons
 */
function setupFileSaveLoad(ZM) {
  const saveBtn = document.getElementById('save-json');
  const loadBtn = document.getElementById('load-json');
  const loadInput = document.getElementById('load-json-input');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => ZM.downloadJSON());
  }
  
  if (loadBtn && loadInput) {
    loadBtn.addEventListener('click', () => loadInput.click());
    loadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        ZM.loadJSON(file);
      }
    });
  }
}

/**
 * Setup UI control buttons
 */
function setupUIButtons(ZM) {
  const hideBtn = document.getElementById('hide-controls-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  if (hideBtn) {
    hideBtn.addEventListener('click', () => {
      document.querySelector('.controls').classList.toggle('hidden');
      document.body.classList.toggle('ui-hidden');
    });
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
  
  // Listen for fullscreen changes to transition background
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      document.body.classList.add('fullscreen');
    } else {
      document.body.classList.remove('fullscreen');
    }
  });
}

/**
 * Setup export buttons
 */
function setupExportButtons(ZM) {
  const pngBtn = document.getElementById('export-png');
  const svgBtn = document.getElementById('export-svg');
  const depthBtn = document.getElementById('export-depth-map');
  const videoBtn = document.getElementById('export-video');
  
  if (pngBtn) {
    pngBtn.addEventListener('click', () => ZM.exportPNG());
    setupHoverEffect(pngBtn, '#26527a', '#1a3a5f');
  }
  
  if (svgBtn) {
    svgBtn.addEventListener('click', () => ZM.exportSVG());
    setupHoverEffect(svgBtn, '#267526', '#1a5f1a');
  }
  
  if (depthBtn) {
    depthBtn.addEventListener('click', () => ZM.exportDepthMap());
  }
  
  if (videoBtn) {
    videoBtn.addEventListener('click', () => {
      if (ZM.isVideoRecording()) {
        ZM.stopVideoRecording();
      } else {
        ZM.startVideoRecording();
      }
    });
    
    videoBtn.addEventListener('mouseenter', () => {
      if (!ZM.isVideoRecording()) {
        videoBtn.style.background = '#752626';
        videoBtn.style.transform = 'scale(1.02)';
      }
    });
    videoBtn.addEventListener('mouseleave', () => {
      if (!ZM.isVideoRecording()) {
        videoBtn.style.background = '#5f1a1a';
        videoBtn.style.transform = 'scale(1)';
      }
    });
  }
}

/**
 * Setup hover effect for button
 */
function setupHoverEffect(element, hoverBg, normalBg) {
  element.addEventListener('mouseenter', () => {
    element.style.background = hoverBg;
    element.style.transform = 'scale(1.02)';
  });
  element.addEventListener('mouseleave', () => {
    element.style.background = normalBg;
    element.style.transform = 'scale(1)';
  });
}

/**
 * Setup collapsible sections
 */
function setupCollapsibleSections() {
  document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const open = content.classList.toggle('expanded');
      header.classList.toggle('active', open);
    });
  });
}

/**
 * Setup language filter
 */
function setupLanguageFilter() {
  document.querySelectorAll('.lang-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.langFilter;
      
      // Update active state
      document.querySelectorAll('.lang-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide documentation buttons
      document.querySelectorAll('.about-btn[data-lang]').forEach(docBtn => {
        if (docBtn.dataset.lang === selectedLang) {
          docBtn.classList.remove('hidden');
        } else {
          docBtn.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Setup documentation buttons
 */
function setupDocumentationButtons() {
  const docButtons = {
    'doc-manual-en': 'User-Manual.md',
    'doc-manual-fr': 'User-Manual-fr.md',
    'doc-readme-en': 'README.md',
    'doc-readme-fr': 'README-fr.md',
    'doc-tech-en': 'Documentation.md',
    'doc-tech-fr': 'Documentation-fr.md',
    'doc-projection-en': 'Projection-Matrix-Guide.md',
    'doc-projection-fr': 'Projection-Matrix-Guide-fr.md'
  };
  
  for (const [id, doc] of Object.entries(docButtons)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        window.open(`docs/markdown-viewer.html?doc=${doc}`, '_blank');
      });
    }
  }
}

/**
 * Sync UI from params (for when params are loaded from file)
 */
function syncUIFromParams(ZM) {
  // Update all controls to reflect loaded params
  Object.keys(ZM.params).forEach(key => {
    const slider = document.querySelector(`[data-param="${key}"]`);
    if (slider) {
      slider.value = ZM.params[key];
      const display = document.getElementById(slider.id + '-val');
      if (display) display.textContent = ZM.params[key];
    }
  });
  
  // Update palette UI
  updatePaletteUI(ZM);
  
  // Update active palette button
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.palette) === ZM.params.activePaletteIndex);
  });
  
  // Update background transition state if needed
  if (ZM.bgTransition) {
    const newBg = getBackgroundColor(ZM.params);
    ZM.bgTransition.current = newBg;
    ZM.bgTransition.start = newBg;
    ZM.bgTransition.target = newBg;
    ZM.bgTransition.progress = 1.0;
    ZM.bgTransition.isTransitioning = false;
  }
  
  // Sync camera
  ZM.camera.syncToParams(ZM.params);
  
  // Reinitialize sketches if needed
  if (ZM.initializeSketches) {
    ZM.initializeSketches();
  }
}
