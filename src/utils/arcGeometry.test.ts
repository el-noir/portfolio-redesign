import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARC_CENTER,
  STATS_ARCS,
  computeArcLength,
  computeGridParallaxTarget,
  describeArc,
  lerp,
  polarToCartesian,
} from './arcGeometry';

test('polarToCartesian computes exact cardinal coordinates', () => {
  const right = polarToCartesian({ x: 0, y: 0 }, 100, 0);
  assert.ok(Math.abs(right.x - 100) < 1e-6);
  assert.ok(Math.abs(right.y - 0) < 1e-6);

  const down = polarToCartesian({ x: 10, y: 20 }, 50, 90);
  assert.ok(Math.abs(down.x - 10) < 1e-6);
  assert.ok(Math.abs(down.y - 70) < 1e-6);
});

test('computeArcLength matches r * deltaRadians', () => {
  const len = computeArcLength(330, -92, 16);
  const expected = 330 * ((108 * Math.PI) / 180);
  assert.ok(Math.abs(len - expected) < 1e-6);
});

test('describeArc produces valid SVG arc path and endpoints for all configured arcs', () => {
  assert.equal(STATS_ARCS.length, 3);
  for (const arc of STATS_ARCS) {
    const geom = describeArc(ARC_CENTER, arc.radius, arc.startAngle, arc.endAngle);
    assert.ok(geom.path.startsWith('M '));
    assert.ok(geom.path.includes(` A ${arc.radius} ${arc.radius} 0 0 1 `));
    assert.ok(geom.length > 0);
    const dot = polarToCartesian(ARC_CENTER, arc.radius, arc.dotAngle);
    assert.ok(dot.x > 0 && dot.x < 380);
    assert.ok(dot.y > 0 && dot.y < 700);
  }
});

test('lerp interpolates smoothly toward target', () => {
  assert.equal(lerp(0, 100, 0.1), 10);
  assert.equal(lerp(50, 50, 0.06), 50);
});

test('computeGridParallaxTarget centers at 0.5 and bounds to [-8, 8] for 16px amplitude', () => {
  assert.equal(computeGridParallaxTarget(0.5, 16), 0);
  assert.equal(computeGridParallaxTarget(0, 16), -8);
  assert.equal(computeGridParallaxTarget(1, 16), 8);
  assert.equal(computeGridParallaxTarget(-0.5, 16), -8);
  assert.equal(computeGridParallaxTarget(1.5, 16), 8);
});
