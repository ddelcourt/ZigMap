// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR - Diagnostic Tool
// Tracks rendering performance and identifies bottlenecks
// ═══════════════════════════════════════════════════════════════════════════

export class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.drawCallCount = 0;
    this.updateCallCount = 0;
    this.activeLines = 0;
    this.samples = [];
    this.maxSamples = 60;
  }

  startFrame() {
    this.frameStart = performance.now();
    this.drawCallCount = 0;
    this.updateCallCount = 0;
  }

  recordDraw() {
    this.drawCallCount++;
  }

  recordUpdate() {
    this.updateCallCount++;
  }

  endFrame(lineCount) {
    const now = performance.now();
    const frameTime = now - this.frameStart;
    this.activeLines = lineCount;
    
    this.frameCount++;
    
    // Calculate FPS every frame
    const elapsed = now - this.lastTime;
    if (elapsed > 0) {
      this.fps = 1000 / elapsed;
    }
    this.lastTime = now;
    
    // Store sample
    this.samples.push({
      frameTime,
      fps: this.fps,
      drawCalls: this.drawCallCount,
      updateCalls: this.updateCallCount,
      lineCount
    });
    
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  getStats() {
    if (this.samples.length === 0) return null;
    
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const min = arr => Math.min(...arr);
    const max = arr => Math.max(...arr);
    
    const frameTimes = this.samples.map(s => s.frameTime);
    const fpsValues = this.samples.map(s => s.fps);
    
    return {
      currentFPS: this.fps.toFixed(1),
      avgFPS: avg(fpsValues).toFixed(1),
      minFPS: min(fpsValues).toFixed(1),
      maxFPS: max(fpsValues).toFixed(1),
      avgFrameTime: avg(frameTimes).toFixed(2) + 'ms',
      maxFrameTime: max(frameTimes).toFixed(2) + 'ms',
      activeLines: this.activeLines,
      drawCallsPerFrame: this.drawCallCount,
      updateCallsPerFrame: this.updateCallCount,
      samplesCollected: this.samples.length
    };
  }

  printStats() {
    const stats = this.getStats();
    if (!stats) {
      console.log('No performance data yet');
      return;
    }
    
    console.log('═════════════════════════════════════════');
    console.log('PERFORMANCE STATS (last 60 frames)');
    console.log('═════════════════════════════════════════');
    console.log('FPS:');
    console.log('  Current:', stats.currentFPS);
    console.log('  Average:', stats.avgFPS);
    console.log('  Min:', stats.minFPS);
    console.log('  Max:', stats.maxFPS);
    console.log('');
    console.log('Frame Time:');
    console.log('  Average:', stats.avgFrameTime);
    console.log('  Max:', stats.maxFrameTime);
    console.log('  Target: 16.67ms (60fps)');
    console.log('');
    console.log('Rendering:');
    console.log('  Active Lines:', stats.activeLines);
    console.log('  Draw Calls/Frame:', stats.drawCallsPerFrame);
    console.log('  Update Calls/Frame:', stats.updateCallsPerFrame);
    console.log('═════════════════════════════════════════');
    
    // Performance warnings
    const avgFPS = parseFloat(stats.avgFPS);
    if (avgFPS < 30) {
      console.warn('⚠️ SEVERE: FPS below 30 - major performance issue');
    } else if (avgFPS < 50) {
      console.warn('⚠️ WARNING: FPS below 50 - performance degraded');
    } else if (avgFPS >= 55) {
      console.log('✓ Performance OK');
    }
  }
}

// Global monitor instance
let monitor = null;

export function initPerformanceMonitor() {
  monitor = new PerformanceMonitor();
  
  // Add global accessor for console debugging
  window.showPerformanceStats = () => {
    if (monitor) {
      monitor.printStats();
    } else {
      console.log('Performance monitor not initialized');
    }
  };
  
  console.log('Performance monitor initialized. Type showPerformanceStats() in console to view stats.');
  return monitor;
}

export function getPerformanceMonitor() {
  return monitor;
}
