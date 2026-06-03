/**
 * LogoMark — hexagon outline with bold "E" inside.
 * Uses currentColor so it adapts to any parent color.
 * Pass `size` to scale, `color` to override (defaults to var(--primary)).
 */
export default function LogoMark({
  size = 36,
  color,
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) {
  // Flat-top hexagon points for a 100×100 viewBox
  // Slightly inset from edges for stroke breathing room
  const hex = '50,6 94,28 94,72 50,94 6,72 6,28'

  const c = color || 'var(--primary)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* outer hex */}
      <polygon
        points={hex}
        stroke={c}
        strokeWidth="5"
        fill="none"
        strokeLinejoin="round"
      />

      {/* "E" letterform — custom paths for a clean monogram feel */}
      {/* vertical bar */}
      <rect x="35" y="30" width="7" height="40" rx="2" fill={c} />
      {/* top bar */}
      <rect x="35" y="30" width="28" height="7" rx="2" fill={c} />
      {/* middle bar — slightly shorter */}
      <rect x="35" y="46.5" width="22" height="7" rx="2" fill={c} />
      {/* bottom bar */}
      <rect x="35" y="63" width="28" height="7" rx="2" fill={c} />
    </svg>
  )
}
