"use client"

import { useEffect, useRef, useState } from "react"

export function useSound(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Create audio element
    const audio = new Audio()

    // Set up event listeners
    audio.addEventListener("canplaythrough", () => {
      setIsLoaded(true)
      setHasError(false)
    })

    audio.addEventListener("error", (e) => {
      console.warn(`Could not load audio file: ${url}`, e)
      setHasError(true)
      setIsLoaded(false)
    })

    // Set source after adding event listeners
    audio.src = url
    audio.load()

    audioRef.current = audio

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current.removeEventListener("canplaythrough", () => {})
        audioRef.current.removeEventListener("error", () => {})
        audioRef.current = null
      }
    }
  }, [url])

  const play = () => {
    if (audioRef.current && isLoaded && !hasError) {
      // Reset audio if already playing
      audioRef.current.currentTime = 0

      // Play with error handling
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            // Handle autoplay restrictions or other errors
            console.warn("Error playing sound:", error)
            setIsPlaying(false)
          })
      }
    } else {
      // Silently fail if audio isn't loaded - don't break the UI
      console.warn("Audio not loaded or has error:", url)
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return { play, stop, isPlaying, isLoaded, hasError }
}
