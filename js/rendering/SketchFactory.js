/**
 * SketchFactory — Creates p5.js sketch instances for rendering
 */

import { Emitter } from '../core/Emitter.js';
import { getSpawnDistance, buildRibbonSides } from '../core/utils.js';

let sharedLastTime = 0;

/**
 * Creates main p5 sketch or stereo pair
 */
export function createSketch(ZM, eyeOffset = 0, canvasId = 'left-canvas') {
  return (p) => {
    let emitter = null;
    const isPrimary = canvasId === 'left-canvas' || canvasId === 'mono-canvas';
    
    p.setup = () => {
      const canvas = p.createCanvas(ZM.W, ZM.H, p.WEBGL);
      canvas.parent(canvasId);
      
      p.pixelDensity(1);
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
      }
      
      // Clear background
      p.background(0);
      
      // Setup camera
      const fovRad = ZM.params.fov * (Math.PI / 180);
      const cameraZ = (ZM.H / 2) / Math.tan(fovRad / 2);
      const eyeOffsetX = eyeOffset * ZM.params.eyeSeparation;
      
      p.perspective(fovRad, ZM.W / ZM.H, ZM.params.near, ZM.params.far);
      p.camera(eyeOffsetX, 0, cameraZ, eyeOffsetX, 0, 0, 0, 1, 0);
      
      // Apply camera transforms
      p.translate(ZM.camera.offsetX, ZM.camera.offsetY, -ZM.camera.distance);
      p.rotateX(ZM.camera.rotationX);
      p.rotateY(ZM.camera.rotationY);
      p.rotateZ(ZM.params.emitterRotation * Math.PI / 180);
      
      // Apply geometry scale
      const scaleVal = ZM.params.geometryScale / 100;
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
