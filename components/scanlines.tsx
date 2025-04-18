export function Scanlines() {
  return (
    <>
      {/* Efecto de scanlines horizontales */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_50%,_rgba(0,0,0,0.6)_50%)] bg-[length:100%_3px] opacity-60 pointer-events-none z-30"></div>

      {/* Efecto de scanlines verticales sutiles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_transparent_98%,_rgba(255,255,255,0.03)_100%)] bg-[length:4px_100%] opacity-30 pointer-events-none z-30"></div>

      {/* Efecto de ruido estático */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none z-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Efecto de reflejo de luz */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_100%)] pointer-events-none z-10"></div>
    </>
  )
}
