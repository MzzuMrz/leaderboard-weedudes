"use client"

import { useEffect, useState, useRef } from "react"
import { Press_Start_2P } from "next/font/google"
import { Scanlines } from "@/components/scanlines"
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
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
        // Datos de fallback en caso de error
        const fallbackScores = [
          { name: "WEEDUDES.CLUB", score: 88, purity: 95, timestamp: Date.now() },
          { name: "WEEDUDES.CLUB", score: 75, purity: 90, timestamp: Date.now() },
          { name: "VENDOFASO", score: 52, purity: 85, timestamp: Date.now() },
          { name: "YUAN", score: 42, purity: 80, timestamp: Date.now() },
          { name: "JSJSJSKSJ", score: 22, purity: 75, timestamp: Date.now() },
          { name: "YUAN", score: 18, purity: 70, timestamp: Date.now() },
          { name: "ANGELZK", score: 12, purity: 65, timestamp: Date.now() },
          { name: "JSJSJSKSJ", score: 0, purity: 60, timestamp: Date.now() },
          { name: "ANGELZK", score: 0, purity: 55, timestamp: Date.now() },
          { name: "---", score: 0, purity: 50, timestamp: Date.now() },
        ]
        setScores(fallbackScores)
        setLoading(false)
      }
    }

    fetchScores()

    return () => {}
  }, [])

  // Manejar la reproducción del video
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // Función para manejar cuando el video está listo
    const handleCanPlay = () => {
      console.log("Video listo para reproducir")
      setVideoLoaded(true)

      // Intentar reproducir el video cuando esté listo
      const playPromise = videoElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Error al reproducir video:", err)
          setVideoError(true)

          // Reintentar reproducción (para TVs que pueden tener restricciones)
          setTimeout(() => {
            videoElement.play().catch((e) => {
              console.error("Segundo intento fallido:", e)
            })
          }, 1000)
        })
      }
    }

    // Función para manejar errores del video
    const handleVideoError = (e: Event) => {
      console.error("Error al cargar el video:", e)
      setVideoError(true)
    }

    // Función para reproducir el video en loop
    const handleVideoEnd = () => {
      console.log("Video terminado, reiniciando...")
      videoElement.currentTime = 0

      const playPromise = videoElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Error al reproducir video en loop:", err)
        })
      }
    }

    // Configurar eventos
    videoElement.addEventListener("canplay", handleCanPlay)
    videoElement.addEventListener("error", handleVideoError)
    videoElement.addEventListener("ended", handleVideoEnd)

    // Configurar propiedades del video
    videoElement.loop = true
    videoElement.muted = true
    videoElement.playsInline = true
    videoElement.autoplay = true

    // Cargar el video
    videoElement.load()

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay)
      videoElement.removeEventListener("error", handleVideoError)
      videoElement.removeEventListener("ended", handleVideoEnd)

      // Detener el video al desmontar
      try {
        videoElement.pause()
        videoElement.src = ""
      } catch (err) {
        console.warn("Error al limpiar video:", err)
      }
    }
  }, [])

  // Colores exactos para las filas como en la imagen de referencia
  const rowColors = [
    "text-yellow-300", // Amarillo (1)
    "text-orange-500", // Naranja (2)
    "text-pink-500", // Rosa (3)
    "text-yellow-300", // Amarillo (4)
    "text-white", // Blanco (5)
    "text-green-400", // Verde (6)
    "text-blue-400", // Azul (7)
    "text-cyan-400", // Cian (8)
    "text-yellow-300", // Amarillo (9)
    "text-orange-500", // Naranja (10)
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
    <div className="h-screen w-screen overflow-hidden relative flex items-center justify-center">
      {/* Video de fondo a pantalla completa */}
      <div className="absolute inset-0 z-0 bg-black">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/animacion-weeddudes.mp4"
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <div className="w-full h-full bg-amber-800" style={{ background: "url('/images/background.jpg')" }}></div>
        )}
      </div>

      {/* Contenedor principal centrado - ajustado para asegurar que cabe en viewport */}
      <div className="w-[90%] max-w-4xl mb-24 h-auto max-h-[90vh] relative rounded-xl overflow-hidden border-2 border-green-500 bg-black">
        {/* Efectos CRT */}
        <Scanlines />

        {/* Contenido de la pantalla - se ajustó el padding para pantallas pequeñas */}
        <div className="w-full h-full flex flex-col p-3 sm:p-4 md:p-6 relative z-10">
          {/* Título */}
          <div className={`${arcadeFont.className} text-center mb-2 sm:mb-4`}>
            <div className="flex items-center justify-center gap-2">
              <Image src="/images/weedudes-logo.png" alt="Weedudes Head" width={20} height={20} className="h-12 w-12" />
              <h1 className="text-green-500 text-sm sm:text-lg md:text-xl">ROLLING WEEDUDES</h1>
            </div>
            <h2 className="text-green-500 text-xs sm:text-sm md:text-lg mt-2 md:mt-4">HIGH SCORES</h2>
          </div>

          {/* Encabezados de columnas */}
          <div className="grid grid-cols-3 w-full mb-1 sm:mb-2 text-gray-400 text-xxs sm:text-xs">
            <div className="text-center">RANK</div>
            <div className="text-center">SCORE (PURITY)</div>
            <div className="text-center">NAME</div>
          </div>

          {/* Filas de puntuaciones - ahora con scroll si hay overflow */}
          <div className={`${arcadeFont.className} space-y-1 sm:space-y-2 flex-grow overflow-y-auto`}>
            {scores.slice(0, 10).map((score, index) => (
              <div
                key={index}
                className={`
                  grid grid-cols-3 items-center 
                  ${rowColors[index]} 
                  py-1 sm:py-2 px-2 sm:px-4 rounded
                  border border-opacity-30 border-current
                  text-xxs sm:text-xs
                `}
              >
                <div className="text-center">{index + 1}</div>
                <div className="text-center">{score.score.toString().padStart(3, "0")}</div>
                <div className="text-center uppercase truncate">{score.name || "---"}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-2 sm:mt-4 text-gray-400 text-xxs sm:text-xs flex items-center">
            <span>CHAOS ORDER</span>
            <span className="mx-1">®</span>
            <span className="ml-1">2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}