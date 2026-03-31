import { useMemo } from "react";

// ─── Hex Grid Generator ───────────────────────────────────────────────────────
function makeHexGrid(
  startX: number,
  startY: number,
  areaW: number,
  areaH: number,
  r: number,
): string {
  const colW = r * Math.sqrt(3);
  const rowH = r * 1.5;
  const cols = Math.ceil(areaW / colW) + 2;
  const rows = Math.ceil(areaH / rowH) + 2;
  const paths: string[] = [];
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = startX + col * colW + (row % 2 !== 0 ? colW / 2 : 0);
      const cy = startY + row * rowH;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      });
      paths.push(`M${pts.join("L")}Z`);
    }
  }
  return paths.join(" ");
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SHIELD_PATH =
  "M150 22 L272 62 L272 190 Q262 294 150 342 Q38 294 28 190 L28 62 Z";

const NODES = [
  { x: 42, y: 95, dur: 2.5, delay: 0, id: "n0" },
  { x: 258, y: 108, dur: 2.8, delay: 0.5, id: "n1" },
  { x: 20, y: 198, dur: 3.0, delay: 1.0, id: "n2" },
  { x: 280, y: 198, dur: 2.6, delay: 1.5, id: "n3" },
  { x: 75, y: 308, dur: 2.9, delay: 0.8, id: "n4" },
  { x: 225, y: 318, dur: 2.7, delay: 0.3, id: "n5" },
];

const EDGES: { a: number; b: number; id: string }[] = [
  { a: 0, b: 1, id: "e01" },
  { a: 0, b: 2, id: "e02" },
  { a: 1, b: 3, id: "e13" },
  { a: 2, b: 4, id: "e24" },
  { a: 3, b: 5, id: "e35" },
  { a: 4, b: 5, id: "e45" },
];

const PULSE_RINGS = [
  { delay: 0, id: "p0" },
  { delay: 0.7, id: "p1" },
  { delay: 1.4, id: "p2" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ShieldNetAnimation() {
  const hexGrid = useMemo(() => makeHexGrid(30, 25, 244, 322, 15), []);

  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg
        viewBox="-20 0 340 392"
        width="320"
        height="392"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Shield clip */}
          <clipPath id="shieldNetClip">
            <path d={SHIELD_PATH} />
          </clipPath>

          {/* Shield radial gradient fill */}
          <radialGradient id="shieldGrad" cx="50%" cy="38%" r="65%">
            <stop
              offset="0%"
              stopColor="oklch(0.18 0.08 230)"
              stopOpacity={0.9}
            />
            <stop
              offset="100%"
              stopColor="oklch(0.08 0.05 250)"
              stopOpacity={0.95}
            />
          </radialGradient>

          {/* Cyan glow filter */}
          <filter id="cyanGlowF" x="-30%" y="-20%" width="160%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filter */}
          <filter id="nodeGlowF" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Pulse rings ── */}
        {PULSE_RINGS.map((ring) => (
          <circle
            key={ring.id}
            cx={150}
            cy={182}
            r={150}
            fill="none"
            strokeWidth={1.5}
            style={{
              stroke: "oklch(0.55 0.18 230 / 0.45)",
              animation: `shieldPulse 2.1s ${ring.delay}s ease-out infinite`,
              transformBox: "fill-box" as const,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* ── Node connection lines ── */}
        {EDGES.map((edge) => (
          <line
            key={edge.id}
            x1={NODES[edge.a].x}
            y1={NODES[edge.a].y}
            x2={NODES[edge.b].x}
            y2={NODES[edge.b].y}
            strokeWidth={1}
            style={{ stroke: "oklch(0.75 0.14 220 / 0.12)" }}
          />
        ))}

        {/* ── Shield body ── */}
        <path
          d={SHIELD_PATH}
          fill="url(#shieldGrad)"
          strokeWidth={2}
          style={{
            stroke: "oklch(0.75 0.14 220)",
            filter:
              "drop-shadow(0 0 16px oklch(0.55 0.18 230 / 0.85)) drop-shadow(0 0 36px oklch(0.75 0.14 220 / 0.4))",
          }}
        />

        {/* ── Hex net clipped to shield ── */}
        <g clipPath="url(#shieldNetClip)">
          <path
            d={hexGrid}
            fill="none"
            strokeWidth={0.7}
            style={{ stroke: "oklch(0.75 0.14 220 / 0.15)" }}
          />
        </g>

        {/* ── Inner accent rings ── */}
        <circle
          cx={150}
          cy={182}
          r={50}
          fill="none"
          strokeWidth={1}
          style={{ stroke: "oklch(0.75 0.14 220 / 0.22)" }}
        />
        <circle
          cx={150}
          cy={182}
          r={33}
          fill="oklch(0.55 0.18 230 / 0.1)"
          strokeWidth={1.5}
          style={{ stroke: "oklch(0.75 0.14 220 / 0.42)" }}
        />

        {/* ── Checkmark icon ── */}
        <path
          d="M 133 181 L 145 198 L 169 169"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#cyanGlowF)"
          style={{ stroke: "oklch(0.78 0.14 220)" }}
        />

        {/* ── Floating network nodes ── */}
        {NODES.map((n) => (
          <g
            key={n.id}
            style={{
              animation: `nodeFloat ${n.dur}s ${n.delay}s ease-in-out infinite`,
            }}
          >
            {/* Outer ring */}
            <circle
              cx={n.x}
              cy={n.y}
              r={7}
              fill="none"
              strokeWidth={0.8}
              style={{ stroke: "oklch(0.75 0.14 220 / 0.35)" }}
            />
            {/* Core dot */}
            <circle
              cx={n.x}
              cy={n.y}
              r={3}
              strokeWidth={0}
              filter="url(#nodeGlowF)"
              style={{ fill: "oklch(0.78 0.14 220 / 0.9)" }}
            />
          </g>
        ))}

        {/* ── SHIELD NET label ── */}
        <text
          x={150}
          y={372}
          textAnchor="middle"
          fontSize={14}
          fontWeight={800}
          letterSpacing="4"
          fontFamily="'Bricolage Grotesque', sans-serif"
          filter="url(#cyanGlowF)"
          style={{ fill: "oklch(0.75 0.14 220)" }}
        >
          SHIELD NET
        </text>
      </svg>

      {/* ── Protection Active badge ── */}
      <div className="flex items-center gap-2 -mt-3">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "oklch(0.7 0.2 142)" }}
        />
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: "oklch(0.65 0.1 142)" }}
        >
          Protection Active
        </span>
      </div>
    </div>
  );
}
