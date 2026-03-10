// ═══════════════════════════════════════════════════════════════════════════
// ZIGMAP26 - Color Utilities
// Helper functions for palette and color management
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get background color from active palette
 * @param {Object} params - Application parameters
 * @returns {Array} RGB array [r, g, b]
 */
export function getBackgroundColor(params) {
  const palette = params.palettes[params.activePaletteIndex];
  const bgColor = palette.find(c => c.role === 'background');
  return bgColor ? [...bgColor.rgb] : [0, 0, 0]; // Default black
}

/**
 * Get all line colors from active palette
 * @param {Object} params - Application parameters
 * @returns {Array} Array of RGB arrays
 */
export function getLineColors(params) {
  const palette = params.palettes[params.activePaletteIndex];
  const lineColors = palette.filter(c => c.role === 'line').map(c => [...c.rgb]);
  return lineColors.length > 0 ? lineColors : [[255, 255, 255]]; // Default white
}

/**
 * Pick a random line color from active palette
 * @param {Object} params - Application parameters
 * @returns {Object} { color: [r,g,b], slotIndex: 0-3 }
 */
export function pickRandomLineColor(params) {
  const palette = params.palettes[params.activePaletteIndex];
  const lineColorSlots = palette
    .map((c, idx) => ({ color: c, slotIndex: idx }))
    .filter(slot => slot.color.role === 'line');
  
  if (lineColorSlots.length === 0) {
    return { color: [255, 255, 255], slotIndex: 0 }; // Default white, slot 0
  }
  
  const picked = lineColorSlots[Math.floor(Math.random() * lineColorSlots.length)];
  return { color: [...picked.color.rgb], slotIndex: picked.slotIndex };
}

/**
 * Lerp between two RGB colors
 * @param {Array} from - Start RGB [r, g, b]
 * @param {Array} to - End RGB [r, g, b]
 * @param {number} t - Progress 0-1
 * @returns {Array} Interpolated RGB [r, g, b]
 */
export function lerpColor(from, to, t) {
  return [
    Math.round(from[0] + (to[0] - from[0]) * t),
    Math.round(from[1] + (to[1] - from[1]) * t),
    Math.round(from[2] + (to[2] - from[2]) * t)
  ];
}

/**
 * Trigger palette change - transitions all existing lines and background
 * @param {Object} ZM - Global ZigMap instance
 */
export function triggerPaletteChange(ZM) {
  // Transition all existing lines to random colors from new palette
  if (ZM.emitterInstance && ZM.emitterInstance.lines) {
    for (const line of ZM.emitterInstance.lines) {
      const colorData = pickRandomLineColor(ZM.params);
      line.transitionToColor(colorData.color);
      // Note: z-offset stays constant - lines keep their original depth layer
    }
  }
  
  // Transition background
  if (ZM.bgTransition) {
    const newBg = getBackgroundColor(ZM.params);
    ZM.bgTransition.start = [...ZM.bgTransition.current];  // Remember where we started
    ZM.bgTransition.target = newBg;
    ZM.bgTransition.progress = 0.0;
    ZM.bgTransition.isTransitioning = true;
  }
}
