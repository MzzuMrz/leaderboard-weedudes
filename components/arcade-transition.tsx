"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ArcadeTransitionProps {
  isActive: boolean
  children: React.ReactNode
}

export function ArcadeTransition({ isActive, children }: ArcadeTransitionProps) {
  const [isVisible, setIsVisible] = useState(isActive)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isActive && !isVisible) {
      // Activar animación de entrada
      setIsAnimating(true)
      timeoutId = setTimeout(() => {
        setIsVisible(true)
        timeoutId = setTimeout(() => {
          setIsAnimating(false)
        }, 500)
      }, 100)
    } else if (!isActive && isVisible) {
      // Activar animación de salida
      setIsAnimating(true)
      timeoutId = setTimeout(() => {
        setIsVisible(false)
        timeoutId = setTimeout(() => {
          setIsAnimating(false)
        }, 500)
      }, 100)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isActive, isVisible])

  if (!isActive && !isVisible && !isAnimating) return null

  return (
    <div
      className={`
        absolute inset-0 z-20 transition-all duration-500
        ${isAnimating ? "animate-pixelate" : ""}
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      {children}
    </div>
  )
}
