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
        setLoading(false)
      }
    }

    fetchScores()

    // Destacar filas aleatoriamente
    const highlightInterval = setInterval(() => {
      const randomRow = Math.floor(Math.random() * 10)
      setHighlightedRow(randomRow)

      setTimeout(() => {
        setHighlightedRow(null)
      }, 800)
    }, 4000)

    return () => {
      clearInterval(highlightInterval)
    }
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

  // Colores arcoíris para las filas como en los juegos arcade clásicos
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
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0">
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

      {/* Logo Weedudes en esquina superior izquierda */}
      <div className="absolute top-6 left-6 z-20">
        <div className={`${arcadeFont.className} text-white text-3xl`}>WEEDUDES™</div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="flex items-center justify-center h-full w-full p-4 relative">
        {/* Pantalla arcade con borde verde */}
        <div className="w-full max-w-4xl h-[80vh] relative rounded-xl overflow-hidden border-4 border-green-500 bg-black">
          {/* Efectos CRT */}
          <Scanlines />

          {/* Contenido de la pantalla */}
          <div className="w-full h-full flex flex-col p-6 relative z-10">
            {/* Título */}
            <div className={`${arcadeFont.className} text-center mb-4`}>
              <div className="flex items-center justify-center gap-2">
                <Image src="/images/weed-leaf.png" alt="Weed Leaf" width={20} height={20} />
                <h1 className="text-green-500 text-xl">WEEDUDES ARCADE</h1>
              </div>
              <h2 className="text-green-500 text-lg mt-4">HIGH SCORES</h2>
            </div>

            {/* Encabezados de columnas */}
            <div className="grid grid-cols-3 w-full mb-2 text-gray-400 text-xs">
              <div className="text-center">RANK</div>
              <div className="text-center">SCORE (PURITY)</div>
              <div className="text-center">NAME</div>
            </div>

            {/* Filas de puntuaciones */}
            <div className={`${arcadeFont.className} space-y-2 flex-grow`}>
              {scores.slice(0, 10).map((score, index) => (
                <div
                  key={index}
                  className={`
                    grid grid-cols-3 items-center 
                    ${rowColors[index]} 
                    ${highlightedRow === index ? "bg-opacity-20 bg-white" : ""}
                    transition-all duration-300 ease-in-out
                    py-2 px-4 rounded
                    border border-opacity-30 border-current
                  `}
                >
                  <div className="text-center">{index + 1}</div>
                  <div className="text-center">{score.score.toString().padStart(3, "0")}</div>
                  <div className="text-center uppercase">{score.name || "---"}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 text-gray-400 text-xs flex items-center">
              <span>WEEDUDES</span>
              <span className="mx-1">®</span>
              <span>©</span>
              <span className="ml-1">2024</span>
            </div>
          </div>
        </div>

        {/* QR Code en esquina inferior izquierda */}
        <div className="absolute bottom-20 left-20 z-20">
          <Image src="/images/qr-code.png" alt="QR Code" width={120} height={120} />
        </div>
      </div>

      {/* Instrucciones en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-amber-700 bg-opacity-80 flex items-center justify-between px-4 z-20">
        <div className="flex items-center">
          <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
            1
          </div>
          <div className={`${arcadeFont.className} text-white text-xs`}>ESCANEA EL QR!</div>
        </div>

        <div className="flex items-center">
          <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
            2
          </div>
          <div className={`${arcadeFont.className} text-white text-xs`}>
            ARMA EL TRONCHO
            <br />
            MÁS PURO
            <br />
            DE LA FIESTA!
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
            3
          </div>
          <div className={`${arcadeFont.className} text-white text-xs`}>
            ARROBATE CON
            <br />
            TU INSTAGRAM!
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
            4
          </div>
          <div className={`${arcadeFont.className} text-white text-xs`}>
            SEGUINOS PARA
            <br />
            PARTICIPAR!
          </div>
        </div>
      </div>
    </div>
  )
}
