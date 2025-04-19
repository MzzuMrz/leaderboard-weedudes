"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  src: string
  fallback?: React.ReactNode
}

export function VideoPlayer({ src, fallback }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // Función para manejar cuando el video está listo
    const handleCanPlay = () => {
      console.log("Video listo para reproducir")
      setIsLoaded(true)

      // Intentar reproducir el video cuando esté listo
      const playPromise = videoElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Error al reproducir video:", err)
          setHasError(true)
        })
      }
    }

    // Función para manejar errores del video
    const handleVideoError = (e: Event) => {
      console.error("Error al cargar el video:", e)
      setHasError(true)
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
  }, [src])

  // Si hay error y existe un fallback, mostrarlo
  if (hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-green-400 animate-pulse">Cargando video...</div>
        </div>
      )}

      <video
        ref={videoRef}
        className="max-w-full max-h-full object-contain"
        src={src}
        muted
        playsInline
        autoPlay
        loop
      />
    </div>
  )
}
