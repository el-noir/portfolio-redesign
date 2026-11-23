export interface Point {
  x: number;
  y: number;
}

export interface StatArcConfig {
  id: string;
  radius: number;
  startAngle: number;
  endAngle: number;
  dotAngle: number;
  value: string;
  suffix: string;
  label: string;
}

export const ARC_CENTER: Point = { x: -110, y: 300 };

export const STATS_ARCS: StatArcConfig[] = [
  {
    id: 'years-real',
    radius: 330,
    startAngle: -92,
    endAngle: 16,
    dotAngle: -46,
    value: '10',
    suffix: '+',
    label: 'YEARS REAL',
  },
  {
    id: 'use-forms',
    radius: 395,
    startAngle: -56,
    endAngle: 60,
    dotAngle: 2,
    value: '40',
    suffix: '+',
    label: 'USE FORMS',
  },
  {
    id: 'repeat-members',
    radius: 460,
    startAngle: -14,
    endAngle: 72,
    dotAngle: 44,
    value: '95',
    suffix: '%',
    label: 'REPEAT MEMBERS',
  },
];

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function polarToCartesian(
  center: Point,
  radius: number,
  angleDeg: number
): Point {
  const rad = degToRad(angleDeg);
  return {
    x: center.x + radius * Math.cos(rad),
    y: center.y + radius * Math.sin(rad),
  };
}

export function computeArcLength(
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
): number {
  return radius * Math.abs(degToRad(endAngleDeg - startAngleDeg));
}

export function describeArc(
  center: Point,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
): { path: string; start: Point; end: Point; length: number } {
  const start = polarToCartesian(center, radius, startAngleDeg);
  const end = polarToCartesian(center, radius, endAngleDeg);
  const delta = Math.abs(endAngleDeg - startAngleDeg);
  const largeArcFlag = delta > 180 ? 1 : 0;
  const sweepFlag = endAngleDeg >= startAngleDeg ? 1 : 0;

  return {
    path: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    start,
    end,
    length: computeArcLength(radius, startAngleDeg, endAngleDeg),
  };
}

export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function computeGridParallaxTarget(
  normalizedPos: number,
  amplitude = 16
): number {
  const clamped = Math.max(0, Math.min(1, normalizedPos));
  return (clamped - 0.5) * amplitude;
}
