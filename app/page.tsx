"use client"

import { useEffect, useState, useCallback } from "react"
import { Press_Start_2P } from "next/font/google"
import { KonamiFooter } from "@/components/konami-footer"
import { Scanlines } from "@/components/scanlines"
import { ArcadeAnimations } from "@/components/arcade-animations"
import { DemoVideo } from "@/components/demo-video"
import { ArcadeTransition } from "@/components/arcade-transition"
import Image from "next/image"

// Fuente arcade clásica
const arcadeFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
})

// Interfaz para los puntajes
interface Score {
  name: string
  score: number
  purity: number
  timestamp: number
}

// Estados de la pantalla arcade
type ArcadeMode = "scores" | "demo"

export default function HighScores() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(420)
  const [blinkText, setBlinkText] = useState(true)
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const [showHighScoreText, setShowHighScoreText] = useState(false)
  const [arcadeMode, setArcadeMode] = useState<ArcadeMode>("scores")
  const [autoChangeDisabled, setAutoChangeDisabled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Función para cambiar de modo con seguridad
  const changeMode = useCallback(
    (newMode: ArcadeMode) => {
      if (isTransitioning) return

      setIsTransitioning(true)
      setTimeout(() => {
        setArcadeMode(newMode)
        setIsTransitioning(false)
      }, 500)
    },
    [isTransitioning],
  )

  // Manejar el final del video
  const handleVideoEnd = useCallback(() => {
    changeMode("scores")
  }, [changeMode])

  // Obtener puntuaciones desde la API
  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Efecto de carga con delay más corto
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const response = await fetch("https://rollingweedudes.vercel.app/api/scores")
        const data = await response.json()

        // Ordenar por puntuación descendente
        const sortedScores = data.sort((a: Score, b: Score) => b.score - a.score)
        setScores(sortedScores)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching scores:", error)
        setLoading(false)
      }
    }

    fetchScores()

    // Parpadeo del texto
    const blinkInterval = setInterval(() => {
      setBlinkText((prev) => !prev)
    }, 800)

    // Efecto de glitch aleatorio
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchEffect(true)
        setTimeout(() => setGlitchEffect(false), 150)
      }
    }, 5000)

    // Destacar filas aleatoriamente
    const highlightInterval = setInterval(() => {
      const randomRow = Math.floor(Math.random() * 10)
      setHighlightedRow(randomRow)

      // Mostrar texto "HIGH SCORE" cuando se destaca la primera fila
      if (randomRow === 0) {
        setShowHighScoreText(true)
        setTimeout(() => {
          setShowHighScoreText(false)
        }, 2000)
      }

      setTimeout(() => {
        setHighlightedRow(null)
      }, 800)
    }, 4000)

    return () => {
      clearInterval(blinkInterval)
      clearInterval(glitchInterval)
      clearInterval(highlightInterval)
    }
  }, [])

  // Alternar entre modos automáticamente
  useEffect(() => {
    if (loading || autoChangeDisabled || isTransitioning) return

    let scoreTimeoutId: NodeJS.Timeout
    let demoTimeoutId: NodeJS.Timeout

    // Cambiar a modo demo después de mostrar scores por un tiempo
    if (arcadeMode === "scores") {
      scoreTimeoutId = setTimeout(() => {
        changeMode("demo")
      }, 30000) // 30 segundos mostrando scores
    }

    // Cambiar a modo scores después de mostrar demo por un tiempo
    if (arcadeMode === "demo") {
      demoTimeoutId = setTimeout(() => {
        changeMode("scores")
      }, 60000) // 60 segundos mostrando demo
    }

    return () => {
      if (scoreTimeoutId) clearTimeout(scoreTimeoutId)
      if (demoTimeoutId) clearTimeout(demoTimeoutId)
    }
  }, [arcadeMode, loading, autoChangeDisabled, isTransitioning, changeMode])

  // Colores arcoíris para las filas como en los juegos arcade clásicos
  const rowColors = [
    "text-yellow-300", // Amarillo
    "text-orange-500", // Naranja
    "text-pink-400", // Rosa
    "text-yellow-300", // Amarillo
    "text-white", // Blanco
    "text-green-400", // Verde
    "text-blue-400", // Azul
    "text-cyan-400", // Cian
    "text-yellow-300", // Amarillo
    "text-orange-500", // Naranja
  ]

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <div className={`${arcadeFont.className} text-green-500 text-2xl animate-pulse`}>LOADING...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full w-full text-white p-4 relative">
        {/* Efectos CRT */}
        <Scanlines />

        {/* Animaciones arcade */}
        <ArcadeAnimations />

        {/* Modo Demo (Video) */}
        <ArcadeTransition isActive={arcadeMode === "demo"}>
          <DemoVideo onVideoEnd={handleVideoEnd} />
        </ArcadeTransition>

        {/* Modo Scores (Tabla de puntuaciones) */}
        <ArcadeTransition isActive={arcadeMode === "scores"}>
          {/* Contenedor principal con bordes decorativos */}
          <div className="w-full h-full max-h-screen flex flex-col justify-between z-10 border-2 border-green-500 rounded-lg p-4 bg-black bg-opacity-80">
            {/* Cabecera con logo */}
            <div className={`${arcadeFont.className} flex flex-col items-center`}>
              {/* Título con logos */}
              <div className="flex items-center gap-5 mb-3">
                <Image
                  src="/images/weed-leaf.png"
                  alt="Weed Leaf"
                  width={40}
                  height={40}
                  className={`${blinkText ? "opacity-100" : "opacity-80"} transition-opacity duration-300`}
                />
                <h1 className="text-2xl text-green-400 animate-pulse">HIGH SCORES</h1>
                <Image
                  src="/images/weed-leaf.png"
                  alt="Weed Leaf"
                  width={40}
                  height={40}
                  className={`${blinkText ? "opacity-80" : "opacity-100"} transition-opacity duration-300`}
                />
              </div>

              {/* Línea decorativa */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mb-2"></div>

              {/* Encabezados de columnas con mejor espaciado */}
              <div className="grid grid-cols-3 w-full mb-2 text-blue-200 text-xs">
                <div className="text-center">RANK</div>
                <div className="text-center">SCORE (PURITY)</div>
                <div className="text-center">NAME</div>
              </div>
            </div>

            {/* Filas de puntuaciones - Ajustadas para que entren todas en pantalla */}
            <div className={`${arcadeFont.className} grid grid-rows-10 gap-1 my-2 relative`}>
              {scores.slice(0, 10).map((score, index) => (
                <div
                  key={index}
                  className={`
                    grid grid-cols-3 items-center 
                    ${rowColors[index % rowColors.length]} 
                    ${highlightedRow === index ? "bg-opacity-20 bg-white animate-pulse" : ""}
                    transition-all duration-300 ease-in-out
                    py-1 px-2 rounded
                    border border-opacity-20 border-current
                    ${index === 0 ? "relative" : ""}
                  `}
                >
                  <div className="text-center text-base">{index + 1}</div>
                  <div className="text-center text-base">{score.score.toString().padStart(3, "0")}</div>
                  <div className="text-center text-base uppercase">{score.name || "???"}</div>

                  {/* Estrella para el primer lugar */}
                  {index === 0 && (
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-yellow-300 animate-pulse">
                      ★
                    </div>
                  )}
                </div>
              ))}

              {/* Texto "HIGH SCORE" que aparece cuando se destaca la primera fila */}
              {showHighScoreText && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-300 text-lg animate-pulse">
                  HIGH SCORE!
                </div>
              )}
            </div>

            {/* Footer */}
            <div>
              {/* Línea decorativa antes del footer */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mb-4"></div>

              {/* Footer estilo Konami */}
              <KonamiFooter />

              {/* Contador de créditos con animación */}
              <div className="absolute bottom-4 right-8 text-white text-lg">
                CREDIT <span className="text-yellow-300 animate-pulse">{credits}</span>
              </div>
            </div>
          </div>
        </ArcadeTransition>
      </div>
    </div>
  )
}
