export function ArcadeDecoration() {
  return (
    <>
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-15">
        {/* Líneas de grid */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
    </>
  )
}
