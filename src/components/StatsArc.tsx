import type { CSSProperties } from 'react';
import {
  ARC_CENTER,
  STATS_ARCS,
  describeArc,
  polarToCartesian,
} from '../utils/arcGeometry';

export function StatsArc() {
  return (
    <div
      className="hidden sm:block absolute inset-y-0 right-0 pointer-events-none z-50"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 700"
        preserveAspectRatio="xMaxYMid meet"
        className="h-full w-auto"
      >
        <defs>
          {STATS_ARCS.map((arc) => {
            const { start, end } = describeArc(
              ARC_CENTER,
              arc.radius,
              arc.startAngle,
              arc.endAngle
            );
            return (
              <linearGradient
                key={arc.id}
                id={`arc-grad-${arc.id}`}
                gradientUnits="userSpaceOnUse"
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
                <stop offset="22%" stopColor="#ffffff" stopOpacity={0.5} />
                <stop offset="55%" stopColor="#ffffff" stopOpacity={0.5} />
                <stop offset="85%" stopColor="#ffffff" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>

        {STATS_ARCS.map((arc, i) => {
          const { path, length } = describeArc(
            ARC_CENTER,
            arc.radius,
            arc.startAngle,
            arc.endAngle
          );
          const dot = polarToCartesian(ARC_CENTER, arc.radius, arc.dotAngle);
          const lineDelay = 0.4 + i * 0.22;
          const markDelay = lineDelay + 0.9;

          return (
            <g key={arc.id}>
              <path
                d={path}
                fill="none"
                stroke={`url(#arc-grad-${arc.id})`}
                strokeWidth={1.1}
                className="arc-line"
                style={
                  {
                    '--len': `${length.toFixed(2)}`,
                    animationDelay: `${lineDelay.toFixed(2)}s`,
                  } as CSSProperties
                }
              />

              <circle
                cx={dot.x}
                cy={dot.y}
                r={3.4}
                fill="#ffffff"
                className="arc-dot"
                style={{ animationDelay: `${markDelay.toFixed(2)}s` }}
              />

              <circle
                cx={dot.x}
                cy={dot.y}
                r={7}
                fill="none"
                stroke="#ffffff"
                strokeOpacity={0.35}
                strokeWidth={1}
                className="arc-ring"
                style={{ animationDelay: `${(markDelay + 0.3).toFixed(2)}s` }}
              />

              <text
                x={dot.x + 16}
                y={dot.y + 4}
                fill="#ffffff"
                fontSize={32}
                fontWeight={400}
                className="arc-text"
                style={{ animationDelay: `${(markDelay + 0.15).toFixed(2)}s` }}
              >
                {arc.value}
                <tspan fontSize={19} dy={-10} letterSpacing="-1px">
                  {arc.suffix}
                </tspan>
              </text>

              <text
                x={dot.x + 18}
                y={dot.y + 22}
                fill="#ffffff"
                fillOpacity={0.8}
                fontSize={8.5}
                fontWeight={600}
                letterSpacing="2px"
                className="arc-text"
                style={{ animationDelay: `${(markDelay + 0.3).toFixed(2)}s` }}
              >
                {arc.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
