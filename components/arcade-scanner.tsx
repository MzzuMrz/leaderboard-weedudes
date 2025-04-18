"use client"

import { useEffect, useRef, useState } from "react"

export function ArcadeScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  })

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Configurar listener para cambios de tamaño
    window.addEventListener("resize", handleResize)

    // Llamar una vez para inicializar
    handleResize()

    // Limpiar al desmontar
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let scanLinePos = 0
    let isMounted = true

    // Establecer dimensiones del canvas
    try {
      canvas.width = dimensions.width
      canvas.height = dimensions.height
    } catch (error) {
      console.error("Error setting canvas dimensions:", error)
    }

    const renderScanLine = () => {
      if (!isMounted || !ctx) return

      try {
        const { width, height } = canvas

        // Limpiar canvas
        ctx.clearRect(0, 0, width, height)

        // Dibujar línea de escaneo
        const gradient = ctx.createLinearGradient(0, scanLinePos - 10, 0, scanLinePos + 10)
        gradient.addColorStop(0, "rgba(0, 255, 0, 0)")
        gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.8)")
        gradient.addColorStop(1, "rgba(0, 255, 0, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, scanLinePos - 10, width, 20)

        // Mover la línea de escaneo
        scanLinePos += 5
        if (scanLinePos > height + 10) {
          scanLinePos = -10
        }

        animationFrameId = requestAnimationFrame(renderScanLine)
      } catch (error) {
        console.error("Error rendering scan line:", error)
      }
    }

    renderScanLine()

    return () => {
      isMounted = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />
}
