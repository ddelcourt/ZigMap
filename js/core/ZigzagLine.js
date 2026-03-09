// ═══════════════════════════════════════════════════════════════════════════
// ZIG MAP26 - ZigzagLine Class
// Represents a single zigzag ribbon in 3D space
// ═══════════════════════════════════════════════════════════════════════════

import { SEGMENTS, FADE_IN_DURATION, FADE_OUT_DISTANCE } from '../config/constants.js';

export class ZigzagLine {
  constructor({
    p,
    x,
    y,
    segmentLength,
    lineThickness,
    lineColor,
    vy,
    canvasWidth,
    canvasHeight,
    getSpawnDistanceFn,
    buildRibbonSidesFn
  }) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.segmentLength = segmentLength;
    this.lineThickness = lineThickness;
    this.lineColor = [...lineColor];
    this.vy = vy;
    this.segments = SEGMENTS;
    this.step = segmentLength / Math.SQRT2;
    this.totalWidth = this.segments * this.step;
    this.alive = true;
    this.age = 0;

    // Dependencies
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.getSpawnDistance = getSpawnDistanceFn;
    this.buildRibbonSides = buildRibbonSidesFn;
  }

  _buildVertices() {
    const pts = [];
    let x = -this.totalWidth / 2;
    let y = 0;
    pts.push({ x, y });
    for (let i = 0; i < this.segments; i++) {
      x += this.step;
      y += i % 2 === 0 ? this.step : -this.step;
      pts.push({ x, y });
    }
    return pts;
  }

  update(dt) {
    this.age += dt;
    this.y += this.vy * dt;
    const worldY = this.y - this.canvasHeight / 2;
    const dist = this.getSpawnDistance(this.segmentLength);
    if (worldY > dist || worldY < -dist) this.alive = false;
  }

  _alpha() {
    const fadeIn = Math.min(this.age / FADE_IN_DURATION, 1);
    const spawnDist = this.getSpawnDistance(this.segmentLength);
    const worldY = this.y - this.canvasHeight / 2;
    const distToBoundary = Math.min(
      Math.abs(worldY - (-spawnDist)),
      Math.abs(worldY - spawnDist)
    );
    const fadeOut = Math.min(distToBoundary / FADE_OUT_DISTANCE, 1);
    return Math.min(fadeIn, fadeOut);
  }

  draw(p) {
    const alpha = this._alpha() * 255;
    const { leftSide, rightSide } = this.buildRibbonSides(
      this._buildVertices(),
      this.lineThickness / 2
    );

    p.push();
    p.translate(
      this.x - this.canvasWidth / 2,
      this.y - this.canvasHeight / 2,
      0
    );
    p.fill(...this.lineColor, alpha);
    p.noStroke();
    p.beginShape();
    for (const pt of leftSide) {
      p.vertex(pt.x, pt.y, 0);
    }
    for (let i = rightSide.length - 1; i >= 0; i--) {
      p.vertex(rightSide[i].x, rightSide[i].y, 0);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }
}
