"use client"

import { useEffect, useState } from "react"
import { Press_Start_2P } from "next/font/google"
import { KonamiFooter } from "@/components/konami-footer"
import { Scanlines } from "@/components/scanlines"
import { ArcadeAnimations } from "@/components/arcade-animations"
import { VideoPlayer } from "@/components/video-player"
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

export default function HighScores() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(420)
  const [blinkText, setBlinkText] = useState(true)
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const [showHighScoreText, setShowHighScoreText] = useState(false)

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

  // Fallback para el video
  const videoFallback = (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-green-400 text-sm mb-4">Escanea el código QR para jugar</div>
      <div className="w-48 h-48 bg-white flex items-center justify-center rounded">
        <div className="text-black text-xs">QR Code</div>
      </div>
    </div>
  )

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

        {/* Contenedor principal con diseño de pantalla única */}
        <div className="w-full h-full max-h-screen flex flex-col z-10 border-2 border-green-500 rounded-lg p-4 bg-black bg-opacity-80">
          {/* Fila superior con título */}
          <div className={`${arcadeFont.className} flex flex-col items-center mb-2`}>
            {/* Título con logos */}
            <div className="flex items-center gap-5 mb-2">
              <Image
                src="/images/weed-leaf.png"
                alt="Weed Leaf"
                width={30}
                height={30}
                className={`${blinkText ? "opacity-100" : "opacity-80"} transition-opacity duration-300`}
              />
              <h1 className="text-xl text-green-400 animate-pulse">WEEDUDES ARCADE</h1>
              <Image
                src="/images/weed-leaf.png"
                alt="Weed Leaf"
                width={30}
                height={30}
                className={`${blinkText ? "opacity-80" : "opacity-100"} transition-opacity duration-300`}
              />
            </div>

            {/* Línea decorativa */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          </div>

          {/* Contenido principal en dos columnas */}
          <div className="flex-grow flex flex-row gap-4">
            {/* Columna izquierda: Tabla de puntuaciones */}
            <div className="w-3/5 flex flex-col">
              <div className={`${arcadeFont.className} text-center text-green-300 text-sm mb-2`}>HIGH SCORES</div>

              {/* Encabezados de columnas */}
              <div className="grid grid-cols-3 w-full mb-2 text-blue-200 text-xs">
                <div className="text-center">RANK</div>
                <div className="text-center">SCORE (PURITY)</div>
                <div className="text-center">NAME</div>
              </div>

              {/* Filas de puntuaciones */}
              <div className={`${arcadeFont.className} grid grid-rows-10 gap-1 relative`}>
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
                      text-xs
                    `}
                  >
                    <div className="text-center">{index + 1}</div>
                    <div className="text-center">{score.score.toString().padStart(3, "0")}</div>
                    <div className="text-center uppercase">{score.name || "???"}</div>

                    {/* Estrella para el primer lugar */}
                    {index === 0 && (
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 animate-pulse">
                        ★
                      </div>
                    )}
                  </div>
                ))}

                {/* Texto "HIGH SCORE" que aparece cuando se destaca la primera fila */}
                {showHighScoreText && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs animate-pulse">
                    HIGH SCORE!
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha: Video o imagen con QR */}
            <div className="w-2/5 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg overflow-hidden border border-green-500 border-opacity-30">
              <div className={`${arcadeFont.className} text-center text-green-300 text-xs mb-2`}>¡JUEGA AHORA!</div>

              <div className="w-full h-[calc(100%-2rem)]">
                <VideoPlayer src="/animacion-weeddudes.mp4" fallback={videoFallback} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2">
            {/* Línea decorativa antes del footer */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mb-2"></div>

            {/* Footer y créditos */}
            <div className="flex justify-between items-center">
              <KonamiFooter />
              <div className="text-white text-sm">
                CREDIT <span className="text-yellow-300 animate-pulse">{credits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
