"use client"

import { useEffect, useRef, useState } from "react"

interface DemoVideoProps {
  onVideoEnd?: () => void
}

export function DemoVideo({ onVideoEnd }: DemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  // Verificar que el video existe y registrar información
  useEffect(() => {
    // Verificar que el video existe
    const checkVideoExists = async () => {
      try {
        const videoPath = "/videos/animacion-weeddudes.mp4"
        const response = await fetch(videoPath, { method: "HEAD" })

        if (!response.ok) {
          console.error(`Video no encontrado en la ruta: ${videoPath}. Estado: ${response.status}`)
          setErrorDetails(`Video no encontrado (${response.status})`)
          setHasError(true)
        } else {
          console.log(`Video encontrado en la ruta: ${videoPath}`)
        }
      } catch (err) {
        console.error("Error verificando el video:", err)
        setErrorDetails(`Error verificando el video: ${err instanceof Error ? err.message : String(err)}`)
        setHasError(true)
      }
    }

    checkVideoExists()
  }, [])

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
      console.log("Video listo para reproducir")
      setIsVideoReady(true)
      setHasError(false)
    }

    // Función para manejar errores
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      const errorCode = target.error ? target.error.code : "desconocido"
      const errorMessage = target.error ? target.error.message : "Error desconocido"

      console.error(`Error en el video (código ${errorCode}):`, errorMessage)
      setErrorDetails(`Error de reproducción (${errorCode}): ${errorMessage}`)
      setHasError(true)
    }

    // Registrar información sobre el video
    console.log("Información del video:", {
      src: videoElement.src,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState,
      paused: videoElement.paused,
      error: videoElement.error,
    })

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
        console.log("Intentando reproducir el video...")
        const playPromise = videoElement.play()
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Error reproduciendo video:", err)
            setErrorDetails(`Error reproduciendo: ${err instanceof Error ? err.message : String(err)}`)
            setHasError(true)
          })
        }
      } catch (err) {
        console.error("Error reproduciendo video:", err)
        setErrorDetails(`Error reproduciendo: ${err instanceof Error ? err.message : String(err)}`)
        setHasError(true)
      }
    }, 100)

    return () => {
      clearTimeout(playTimeout)
    }
  }, [isVideoReady, hasError])

  // Intentar nuevamente si hay error
  const handleRetry = () => {
    if (retryCount >= 3) {
      // Si ya intentamos 3 veces, mejor volver a los scores
      if (onVideoEnd) {
        onVideoEnd()
      }
      return
    }

    setRetryCount((prev) => prev + 1)
    setHasError(false)
    setIsVideoReady(false)

    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  // Fallback a una imagen estática si hay error después de varios intentos
  const renderFallback = () => {
    if (retryCount >= 2) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-red-500 mb-4">No se pudo cargar el video</div>
          <div className="text-white text-sm mb-4">Escanea el QR para jugar</div>
          {/* Imagen de QR como fallback */}
          <div className="w-64 h-64 bg-white flex items-center justify-center">
            <div className="text-black">QR Code</div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            onClick={() => onVideoEnd && onVideoEnd()}
          >
            Volver a Scores
          </button>
        </div>
      )
    }

    return (
      <div className="text-red-500 text-center p-4">
        <p>Error al cargar el video</p>
        <p className="text-xs mt-2 text-gray-400">{errorDetails}</p>
        <button className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700" onClick={handleRetry}>
          Reintentar ({retryCount}/3)
        </button>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => onVideoEnd && onVideoEnd()}
        >
          Volver a Scores
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {hasError ? (
        renderFallback()
      ) : (
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain"
          src="/animacion-weeddudes.mp4"
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  )
}
