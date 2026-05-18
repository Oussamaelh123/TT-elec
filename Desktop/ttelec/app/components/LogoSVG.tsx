// SVG logo — no background, stroke-draw animation on load

export default function LogoSVG() {
  return (
    <svg
      viewBox="0 0 220 44"
      className="logo-svg"
      aria-label="TT Elec"
      role="img"
    >
      {/* T1 — crossbar */}
      <line className="ls l-t1c" x1="4"   y1="4"  x2="30"  y2="4"  />
      {/* T1 — stem */}
      <line className="ls l-t1s" x1="17"  y1="4"  x2="17"  y2="40" />
      {/* T2 — crossbar */}
      <line className="ls l-t2c" x1="34"  y1="4"  x2="60"  y2="4"  />
      {/* T2 — stem */}
      <line className="ls l-t2s" x1="47"  y1="4"  x2="47"  y2="40" />
      {/* ⚡ bolt */}
      <polyline className="ls l-bolt" points="76,4 68,22 74,22 68,40" />
      {/* E — stem */}
      <line className="ls l-e1s"  x1="90"  y1="4"  x2="90"  y2="40" />
      {/* E — top bar */}
      <line className="ls l-e1t"  x1="90"  y1="4"  x2="112" y2="4"  />
      {/* E — mid bar */}
      <line className="ls l-e1m"  x1="90"  y1="22" x2="108" y2="22" />
      {/* E — bot bar */}
      <line className="ls l-e1b"  x1="90"  y1="40" x2="112" y2="40" />
      {/* L — stem */}
      <line className="ls l-ls"   x1="120" y1="4"  x2="120" y2="40" />
      {/* L — base */}
      <line className="ls l-lb"   x1="120" y1="40" x2="142" y2="40" />
      {/* E2 — stem */}
      <line className="ls l-e2s"  x1="150" y1="4"  x2="150" y2="40" />
      {/* E2 — top bar */}
      <line className="ls l-e2t"  x1="150" y1="4"  x2="172" y2="4"  />
      {/* E2 — mid bar */}
      <line className="ls l-e2m"  x1="150" y1="22" x2="168" y2="22" />
      {/* E2 — bot bar */}
      <line className="ls l-e2b"  x1="150" y1="40" x2="172" y2="40" />
      {/* C — arc (center≈192,22 r=17, opens right) */}
      <path className="ls l-c"    d="M204,10 A17,17 0 1 0 204,34"    />
    </svg>
  )
}
