"use client"

import { useEffect, useRef, useState } from "react"

interface DemoVideoProps {
  onVideoEnd?: () => void
}

export function DemoVideo({ onVideoEnd }: DemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // Función para manejar el final del video
    const handleVideoEnd = () => {
      if (onVideoEnd) {
        onVideoEnd()
      } else {
        // Si no hay callback, reiniciar el video
        try {
          videoElement.currentTime = 0
          const playPromise = videoElement.play()
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Error al reiniciar video:", err)
            })
          }
        } catch (err) {
          console.warn("Error al reiniciar video:", err)
        }
      }
    }

    // Función para manejar cuando el video está listo
    const handleCanPlay = () => {
      setIsVideoReady(true)
    }

    // Función para manejar errores
    const handleError = (e: Event) => {
      console.error("Error en el video:", e)
      setHasError(true)
    }

    // Agregar event listeners
    videoElement.addEventListener("ended", handleVideoEnd)
    videoElement.addEventListener("canplay", handleCanPlay)
    videoElement.addEventListener("error", handleError)

    // Limpiar al desmontar
    return () => {
      videoElement.removeEventListener("ended", handleVideoEnd)
      videoElement.removeEventListener("canplay", handleCanPlay)
      videoElement.removeEventListener("error", handleError)

      // Importante: detener cualquier operación pendiente antes de desmontar
      try {
        const playPromise = videoElement.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              videoElement.pause()
              videoElement.currentTime = 0
            })
            .catch(() => {
              // Ignorar errores al pausar
            })
        } else {
          videoElement.pause()
          videoElement.currentTime = 0
        }
      } catch (err) {
        // Ignorar errores al limpiar
      }
    }
  }, [onVideoEnd])

  // Efecto separado para reproducir el video cuando esté listo
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || !isVideoReady || hasError) return

    // Usar un timeout para evitar conflictos con otros efectos
    const playTimeout = setTimeout(() => {
      try {
        const playPromise = videoElement.play()
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Error reproduciendo video:", err)
            setHasError(true)
          })
        }
      } catch (err) {
        console.error("Error reproduciendo video:", err)
        setHasError(true)
      }
    }, 100)

    return () => {
      clearTimeout(playTimeout)
    }
  }, [isVideoReady, hasError])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {hasError ? (
        <div className="text-red-500 text-center p-4">
          <p>Error al cargar el video</p>
          <button
            className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            onClick={() => {
              setHasError(false)
              setIsVideoReady(false)
              if (videoRef.current) {
                videoRef.current.load()
              }
            }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain"
          src="/videos/animacion-weeddudes.mp4"
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  )
}
