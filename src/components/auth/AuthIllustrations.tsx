/** Decorative, dependency-free SVGs for the auth screens. All are aria-hidden. */

function Leaf({ angle, opacity }: { angle: number; opacity: number }) {
  return (
    <g transform={`rotate(${angle} 160 300)`} opacity={opacity}>
      <path d="M160 0C250 60 270 170 160 300C50 170 70 60 160 0Z" />
      <path
        d="M160 24V284"
        fill="none"
        stroke="#fff"
        strokeOpacity=".4"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

export function LeafCluster({
  gradientId,
  className,
}: {
  gradientId: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <Leaf angle={-46} opacity={0.5} />
        <Leaf angle={-12} opacity={0.75} />
        <Leaf angle={24} opacity={0.9} />
      </g>
    </svg>
  );
}

export function CapsuleIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="capsule-half" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5a4" />
          <stop offset="1" stopColor="#007bff" />
        </linearGradient>
      </defs>

      <circle
        cx="140"
        cy="58"
        r="46"
        fill="#fff"
        fillOpacity=".6"
        stroke="#0ea5a4"
        strokeOpacity=".35"
        strokeWidth="3"
      />
      <path
        d="M140 38v40M120 58h40"
        stroke="#0ea5a4"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <g transform="rotate(-32 100 142)">
        <rect
          x="22"
          y="114"
          width="152"
          height="58"
          rx="29"
          fill="#fff"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        <path d="M51 114H98V172H51a29 29 0 0 1 0-58z" fill="url(#capsule-half)" />
        <path
          d="M40 126c6-6 14-8 22-8"
          fill="none"
          stroke="#fff"
          strokeOpacity=".6"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
