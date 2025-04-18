import type React from "react"

interface CRTProps {
  children: React.ReactNode
  glitchActive?: boolean
}

export function CRT({ children, glitchActive = false }: CRTProps) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Pantalla CRT con efectos */}
      <div
        id="crt-screen"
        className={`
          relative w-full h-full overflow-hidden
          ${glitchActive ? "animate-glitch" : ""}
        `}
      >
        {/* Líneas de escaneo simplificadas */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_50%,_rgba(0,0,0,0.6)_50%)] bg-[length:100%_3px] opacity-60 pointer-events-none"></div>

        {/* Contenido */}
        <div className="relative z-0 w-full h-full">{children}</div>
      </div>
    </div>
  )
}
