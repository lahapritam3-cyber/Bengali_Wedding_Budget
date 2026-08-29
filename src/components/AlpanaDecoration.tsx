// Bengali alpana-inspired decorative SVG elements

export function LotusMotif({ size = 80, color = '#C8920A', opacity = 0.6 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      {/* Outer petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={40 + 20 * Math.cos((angle * Math.PI) / 180)}
          cy={40 + 20 * Math.sin((angle * Math.PI) / 180)}
          rx={8}
          ry={14}
          transform={`rotate(${angle} ${40 + 20 * Math.cos((angle * Math.PI) / 180)} ${40 + 20 * Math.sin((angle * Math.PI) / 180)})`}
          fill={color}
          opacity={0.4}
        />
      ))}
      {/* Inner petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
        <ellipse
          key={i}
          cx={40 + 14 * Math.cos((angle * Math.PI) / 180)}
          cy={40 + 14 * Math.sin((angle * Math.PI) / 180)}
          rx={5}
          ry={10}
          transform={`rotate(${angle} ${40 + 14 * Math.cos((angle * Math.PI) / 180)} ${40 + 14 * Math.sin((angle * Math.PI) / 180)})`}
          fill={color}
          opacity={0.6}
        />
      ))}
      {/* Center */}
      <circle cx={40} cy={40} r={8} fill={color} opacity={0.8} />
      <circle cx={40} cy={40} r={4} fill={color} />
    </svg>
  );
}

export function AlpanaCorner({ size = 120, color = '#C8920A', opacity = 0.3, flip = false }: {
  size?: number; color?: string; opacity?: number; flip?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={{ opacity, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Corner bracket lines */}
      <path d="M10 10 L10 50 Q10 60 20 60 L60 60" stroke={color} strokeWidth={2} fill="none" />
      <path d="M10 10 L50 10 Q60 10 60 20 L60 60" stroke={color} strokeWidth={2} fill="none" />
      {/* Decorative dots along the path */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={10 + i * 12} cy={10} r={2} fill={color} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={10} cy={10 + i * 12} r={2} fill={color} />
      ))}
      {/* Paisley-like flourish */}
      <path
        d="M30 30 Q50 15 65 30 Q80 45 65 60 Q50 75 35 65 Q20 55 30 30Z"
        fill={color}
        opacity={0.3}
      />
      <circle cx={50} cy={45} r={6} fill={color} opacity={0.5} />
      <circle cx={50} cy={45} r={3} fill={color} />
    </svg>
  );
}

export function DividerOrnament({ color = '#C8920A', opacity = 0.4 }: {
  color?: string; opacity?: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity }}>
      <div style={{ flex: 1, height: 1, background: color }} />
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8Z" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}
