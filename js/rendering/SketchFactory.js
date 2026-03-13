/**
 * SketchFactory — Creates p5.js sketch instances for rendering
 */

import { Emitter } from '../core/Emitter.js';
import { getSpawnDistance, buildRibbonSides } from '../core/utils.js';
import { getBackgroundColor, lerpColor } from '../core/colorUtils.js';

let sharedLastTime = 0;

/**
 * Creates main p5 sketch or stereo pair
 */
export function createSketch(ZM, eyeOffset = 0, canvasId = 'left-canvas') {
  // Background color transition state (shared across stereo pair via ZM)
  if (!ZM.bgTransition) {
    const initialBg = getBackgroundColor(ZM.params);
    ZM.bgTransition = {
      current: [...initialBg],   // Cached display color
      start: [...initialBg],      // Start of transition
      target: [...initialBg],     // Target of transition
      progress: 1.0,
      isTransitioning: false
    };
  }
  
  // FOV transition state (shared across stereo pair via ZM)
  if (!ZM.fovTransition) {
    ZM.fovTransition = {
      current: ZM.params.fov,
      start: ZM.params.fov,
      target: ZM.params.fov,
      progress: 1.0,
      isTransitioning: false,
      duration: ZM.params.stateTransitionDuration // Use parameter instead of hardcoded value
    };
  }
  
  // Emitter rotation transition state (shared across stereo pair via ZM)
  if (!ZM.emitterRotationTransition) {
    ZM.emitterRotationTransition = {
      current: ZM.params.emitterRotation,
      start: ZM.params.emitterRotation,
      target: ZM.params.emitterRotation,
      progress: 1.0,
      isTransitioning: false,
      duration: ZM.params.stateTransitionDuration // Use parameter instead of hardcoded value
    };
  }
  
  // Geometry scale transition state (shared across stereo pair via ZM)
  if (!ZM.geometryScaleTransition) {
    ZM.geometryScaleTransition = {
      current: ZM.params.geometryScale,
      start: ZM.params.geometryScale,
      target: ZM.params.geometryScale,
      progress: 1.0,
      isTransitioning: false,
      duration: ZM.params.stateTransitionDuration // Use parameter instead of hardcoded value
    };
  }
  
  return (p) => {
    let emitter = null;
    const isPrimary = canvasId === 'left-canvas' || canvasId === 'mono-canvas';
    
    p.setup = () => {
      const canvas = p.createCanvas(ZM.W, ZM.H, p.WEBGL);
      canvas.parent(canvasId);
      
      // Use native pixel density for smooth retina rendering when not in framebuffer mode
      // Use pixelDensity(1) in framebuffer mode to respect exact dimensions
      if (ZM.params.framebufferMode) {
        p.pixelDensity(1);
      } else {
        p.pixelDensity(p.displayDensity()); // Native retina support
      }
      p.frameRate(60);
      
      // Create or reuse emitter
      if (!ZM.emitterInstance) {
        // First canvas: create new emitter
        emitter = new Emitter({
          p: p,
          x: ZM.W / 2,
          y: ZM.H / 2 + getSpawnDistance(ZM.params.segmentLength),
          params: ZM.params,
          noiseOffsetGetter: () => ZM.noiseOffset,
          canvasWidth: ZM.W,
          canvasHeight: ZM.H,
          getSpawnDistanceFn: getSpawnDistance,
          buildRibbonSidesFn: buildRibbonSides
        });
        ZM.emitterInstance = emitter;
      } else {
        // Second canvas (stereo): reuse existing emitter
        emitter = ZM.emitterInstance;
        emitter.p = p; // Update p5 instance reference
      }
    };
    
    p.draw = () => {
      // Time management (only update on primary canvas)
      if (isPrimary) {
        const now = p.millis() / 1000;
        const dt = sharedLastTime === 0 ? 0.016 : now - sharedLastTime;
        sharedLastTime = now;
        
        // Update noise offset
        ZM.noiseOffset += dt * (ZM.params.ambientSpeedMaster / 100);
        
        // Update emitter (only on primary canvas)
        emitter.update(dt);
        
        // Update camera transition
        if (ZM.camera.transition.isActive) {
          ZM.camera.updateTransition(dt);
          // Sync to params for consistency
          ZM.params.cameraRotationX = ZM.camera.rotationX;
          ZM.params.cameraRotationY = ZM.camera.rotationY;
          ZM.params.cameraDistance = ZM.camera.distance;
          ZM.params.cameraOffsetX = ZM.camera.offsetX;
          ZM.params.cameraOffsetY = ZM.camera.offsetY;
        }
        
        // Update FOV transition
        if (ZM.fovTransition.isTransitioning) {
          ZM.fovTransition.progress += dt / ZM.fovTransition.duration;
          if (ZM.fovTransition.progress >= 1.0) {
            ZM.fovTransition.progress = 1.0;
            ZM.fovTransition.current = ZM.fovTransition.target;
            ZM.params.fov = ZM.fovTransition.target;
            ZM.fovTransition.isTransitioning = false;
          } else {
            // Ease-in-out cubic
            const t = ZM.fovTransition.progress < 0.5
              ? 4 * ZM.fovTransition.progress * ZM.fovTransition.progress * ZM.fovTransition.progress
              : 1 - Math.pow(-2 * ZM.fovTransition.progress + 2, 3) / 2;
            ZM.fovTransition.current = ZM.fovTransition.start + (ZM.fovTransition.target - ZM.fovTransition.start) * t;
          }
        }
        
        // Update emitter rotation transition
        if (ZM.emitterRotationTransition.isTransitioning) {
          ZM.emitterRotationTransition.progress += dt / ZM.emitterRotationTransition.duration;
          if (ZM.emitterRotationTransition.progress >= 1.0) {
            ZM.emitterRotationTransition.progress = 1.0;
            ZM.emitterRotationTransition.current = ZM.emitterRotationTransition.target;
            ZM.params.emitterRotation = ZM.emitterRotationTransition.target;
            ZM.emitterRotationTransition.isTransitioning = false;
          } else {
            // Ease-in-out cubic
            const t = ZM.emitterRotationTransition.progress < 0.5
              ? 4 * ZM.emitterRotationTransition.progress * ZM.emitterRotationTransition.progress * ZM.emitterRotationTransition.progress
              : 1 - Math.pow(-2 * ZM.emitterRotationTransition.progress + 2, 3) / 2;
            ZM.emitterRotationTransition.current = ZM.emitterRotationTransition.start + (ZM.emitterRotationTransition.target - ZM.emitterRotationTransition.start) * t;
          }
        }
        
        // Update geometry scale transition
        if (ZM.geometryScaleTransition.isTransitioning) {
          ZM.geometryScaleTransition.progress += dt / ZM.geometryScaleTransition.duration;
          if (ZM.geometryScaleTransition.progress >= 1.0) {
            ZM.geometryScaleTransition.progress = 1.0;
            ZM.geometryScaleTransition.current = ZM.geometryScaleTransition.target;
            ZM.params.geometryScale = ZM.geometryScaleTransition.target;
            ZM.geometryScaleTransition.isTransitioning = false;
          } else {
            // Ease-in-out cubic
            const t = ZM.geometryScaleTransition.progress < 0.5
              ? 4 * ZM.geometryScaleTransition.progress * ZM.geometryScaleTransition.progress * ZM.geometryScaleTransition.progress
              : 1 - Math.pow(-2 * ZM.geometryScaleTransition.progress + 2, 3) / 2;
            ZM.geometryScaleTransition.current = ZM.geometryScaleTransition.start + (ZM.geometryScaleTransition.target - ZM.geometryScaleTransition.start) * t;
          }
        }
        
        // Update background color transition (only if actively transitioning)
        if (ZM.bgTransition.isTransitioning) {
          ZM.bgTransition.progress += dt / ZM.params.colorTransitionDuration;
          if (ZM.bgTransition.progress >= 1.0) {
            ZM.bgTransition.progress = 1.0;
            ZM.bgTransition.current = [...ZM.bgTransition.target];
            ZM.bgTransition.isTransitioning = false; // Stop checking
          } else {
            // Cache lerped color: interpolate from start to target
            ZM.bgTransition.current = lerpColor(
              ZM.bgTransition.start,
              ZM.bgTransition.target,
              ZM.bgTransition.progress
            );
          }
        }
        
        // Auto-trigger random state switching (only on primary canvas to avoid double-triggering)
        // Each trigger loads a TRULY RANDOM state (excluding current) - no sequence or pattern
        if (isPrimary && ZM.params.autoTriggerStates && ZM.stateManager.states.length > 1) {
          ZM.autoTriggerTimer.elapsed += dt;
          if (ZM.autoTriggerTimer.elapsed >= ZM.params.autoTriggerFrequency) {
            ZM.autoTriggerTimer.elapsed = 0;
            ZM.stateManager.loadRandomState(); // Fresh random selection each time
          }
        }
      }
      
      // Clear background with cached color (no per-frame lerp)
      p.background(...ZM.bgTransition.current);
      
      // Setup camera with transitioning FOV
      const fovRad = ZM.fovTransition.current * (Math.PI / 180);
      const cameraZ = (ZM.H / 2) / Math.tan(fovRad / 2);
      const eyeOffsetX = eyeOffset * ZM.params.eyeSeparation;
      
      p.perspective(fovRad, ZM.W / ZM.H, ZM.params.near, ZM.params.far);
      p.camera(eyeOffsetX, 0, cameraZ, eyeOffsetX, 0, 0, 0, 1, 0);
      
      // Apply camera transforms
      p.translate(ZM.camera.offsetX, ZM.camera.offsetY, -ZM.camera.distance);
      p.rotateX(ZM.camera.rotationX);
      p.rotateY(ZM.camera.rotationY);
      p.rotateZ(ZM.emitterRotationTransition.current * Math.PI / 180);
      
      // Apply geometry scale (use transition value)
      const scaleVal = ZM.geometryScaleTransition.current / 100;
      p.scale(scaleVal);
      
      // Draw emitter (both canvases draw)
      emitter.draw(p);
    };
    
    p.windowResized = () => {
      if (!ZM.params.framebufferMode) {
        p.resizeCanvas(ZM.W, ZM.H);
      }
    };
  };
}

/**
 * Initialize sketches (single or stereo)
 */
export function initializeSketches(ZM) {
  // Remove existing sketches
  if (ZM.p5Instance) {
    ZM.p5Instance.remove();
    ZM.p5Instance = null;
  }
  if (ZM.p5InstanceRight) {
    ZM.p5InstanceRight.remove();
    ZM.p5InstanceRight = null;
  }
  
  // Clear emitter instance so it gets recreated
  ZM.emitterInstance = null;
  
  // Clear canvas wrapper
  const wrapper = document.getElementById('canvas-wrapper');
  wrapper.innerHTML = '';
  wrapper.className = ''; // Clear all classes
  
  sharedLastTime = 0;
  
  // Update dimensions for stereo mode
  if (ZM.params.framebufferMode) {
    ZM.W = ZM.params.framebufferWidth;
    ZM.H = ZM.params.framebufferHeight;
    wrapper.classList.add('framebuffer-mode');
  } else if (ZM.params.stereoscopicMode) {
    ZM.W = Math.floor(window.innerWidth / 2);
    ZM.H = window.innerHeight;
  } else {
    ZM.W = window.innerWidth;
    ZM.H = window.innerHeight;
  }
  
  if (ZM.params.stereoscopicMode) {
    // Stereo mode: create proper HTML structure
    wrapper.classList.add('stereoscopic');
    
    const container = document.createElement('div');
    container.className = 'stereo-container';
    
    ['left', 'right'].forEach(side => {
      const eye = document.createElement('div');
      eye.className = 'stereo-eye';
      eye.id = `${side}-eye-container`;
      const canvasDiv = document.createElement('div');
      canvasDiv.id = `${side}-canvas`;
      eye.appendChild(canvasDiv);
      container.appendChild(eye);
    });
    
    wrapper.appendChild(container);
    
    const eyeSep = ZM.params.eyeSeparation;
    ZM.p5Instance = new p5(createSketch(ZM, -eyeSep / 100, 'left-canvas'));
    ZM.p5InstanceRight = new p5(createSketch(ZM, eyeSep / 100, 'right-canvas'));
    
    if (ZM.params.framebufferMode) {
      setTimeout(() => updateCanvasSize(ZM), 50);
    }
  } else {
    // Single canvas mode
    wrapper.innerHTML = '<div id="mono-canvas"></div>';
    ZM.p5Instance = new p5(createSketch(ZM, 0, 'mono-canvas'));
    ZM.p5InstanceRight = null;
    
    if (ZM.params.framebufferMode) {
      setTimeout(() => updateCanvasSize(ZM), 50);
    }
  }
}

/**
 * Updates canvas size based on framebuffer mode
 */
export function updateCanvasSize(ZM) {
  if (!ZM.p5Instance) return;
  
  const wrapper = document.getElementById('canvas-wrapper');
  const W = ZM.params.framebufferWidth;
  const H = ZM.params.framebufferHeight;
  
  if (ZM.params.framebufferMode) {
    ZM.W = W;
    ZM.H = H;
    wrapper.classList.add('framebuffer-mode');
    
    // Set pixel density to 1 for exact framebuffer dimensions
    ZM.p5Instance.pixelDensity(1);
    if (ZM.p5InstanceRight) ZM.p5InstanceRight.pixelDensity(1);
    
    // Calculate scale to fit canvas in viewport
    const scaleX = window.innerWidth / (ZM.params.stereoscopicMode ? W * 2 : W);
    const scaleY = window.innerHeight / H;
    const scale = Math.min(scaleX, scaleY, 1);
    
    ZM.p5Instance.resizeCanvas(W, H);
    if (ZM.p5InstanceRight) ZM.p5InstanceRight.resizeCanvas(W, H);
    
    if (scale < 1) {
      // Apply CSS transform for smooth scaling
      const cssScale = `scale(${scale})`;
      ZM.p5Instance.canvas.style.transform = cssScale;
      ZM.p5Instance.canvas.style.transformOrigin = 'center center';
      if (ZM.p5InstanceRight) {
        ZM.p5InstanceRight.canvas.style.transform = cssScale;
        ZM.p5InstanceRight.canvas.style.transformOrigin = 'center center';
      }
      
      // Set explicit wrapper dimensions
      const wrapperW = ZM.params.stereoscopicMode ? W * scale * 2 : W * scale;
      wrapper.style.width = `${wrapperW}px`;
      wrapper.style.height = `${H * scale}px`;
    } else {
      ZM.p5Instance.canvas.style.transform = 'none';
      if (ZM.p5InstanceRight) ZM.p5InstanceRight.canvas.style.transform = 'none';
      
      wrapper.style.width = `${ZM.params.stereoscopicMode ? W * 2 : W}px`;
      wrapper.style.height = `${H}px`;
    }
  } else {
    // Set pixel density to native display density for smooth retina rendering
    ZM.p5Instance.pixelDensity(ZM.p5Instance.displayDensity());
    if (ZM.p5InstanceRight) ZM.p5InstanceRight.pixelDensity(ZM.p5InstanceRight.displayDensity());
    
    wrapper.classList.remove('framebuffer-mode');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    
    if (ZM.params.stereoscopicMode) {
      ZM.W = Math.floor(window.innerWidth / 2);
      ZM.H = window.innerHeight;
    } else {
      ZM.W = window.innerWidth;
      ZM.H = window.innerHeight;
    }
    
    ZM.p5Instance.resizeCanvas(ZM.W, ZM.H);
    if (ZM.p5InstanceRight) ZM.p5InstanceRight.resizeCanvas(ZM.W, ZM.H);
    
    ZM.p5Instance.canvas.style.transform = 'none';
    if (ZM.p5InstanceRight) ZM.p5InstanceRight.canvas.style.transform = 'none';
  }
}

// Export wrapped functions that will be attached to ZM
export function attachToZM(ZM) {
  ZM.initializeSketches = () => initializeSketches(ZM);
  ZM.updateCanvasSize = () => updateCanvasSize(ZM);
}
