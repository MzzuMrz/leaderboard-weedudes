"use client"

import { useEffect, useState } from "react"

export function ArcadeAnimations() {
  const [showPacman, setShowPacman] = useState(false)
  const [pacmanPosition, setPacmanPosition] = useState({ x: -50, y: Math.random() * 100 })
  const [showSpaceInvader, setShowSpaceInvader] = useState(false)
  const [invaderPosition, setInvaderPosition] = useState({ x: Math.random() * 100, y: -30 })

  // Animación de Pac-Man cruzando la pantalla
  useEffect(() => {
    const showPacmanInterval = setInterval(() => {
      if (Math.random() > 0.7 && !showPacman) {
        setShowPacman(true)
        setPacmanPosition({
          x: -50,
          y: Math.random() * 80 + 10, // Posición vertical aleatoria entre 10% y 90%
        })

        // Ocultar después de la animación
        setTimeout(() => {
          setShowPacman(false)
        }, 8000) // Tiempo suficiente para cruzar la pantalla
      }
    }, 15000)

    // Mover Pac-Man
    let animationId: number

    const animatePacman = () => {
      if (showPacman) {
        setPacmanPosition((prev) => ({
          ...prev,
          x: prev.x + 0.5,
        }))

        animationId = requestAnimationFrame(animatePacman)
      }
    }

    if (showPacman) {
      animationId = requestAnimationFrame(animatePacman)
    }

    return () => {
      clearInterval(showPacmanInterval)
      cancelAnimationFrame(animationId)
    }
  }, [showPacman])

  // Animación de Space Invader cayendo
  useEffect(() => {
    const showInvaderInterval = setInterval(() => {
      if (Math.random() > 0.7 && !showSpaceInvader) {
        setShowSpaceInvader(true)
        setInvaderPosition({
          x: Math.random() * 80 + 10, // Posición horizontal aleatoria entre 10% y 90%
          y: -30,
        })

        // Ocultar después de la animación
        setTimeout(() => {
          setShowSpaceInvader(false)
        }, 5000) // Tiempo suficiente para caer
      }
    }, 12000)

    // Mover Space Invader
    let animationId: number

    const animateInvader = () => {
      if (showSpaceInvader) {
        setInvaderPosition((prev) => ({
          ...prev,
          y: prev.y + 0.5,
        }))

        animationId = requestAnimationFrame(animateInvader)
      }
    }

    if (showSpaceInvader) {
      animationId = requestAnimationFrame(animateInvader)
    }

    return () => {
      clearInterval(showInvaderInterval)
      cancelAnimationFrame(animationId)
    }
  }, [showSpaceInvader])

  return (
    <>
      {/* Pac-Man cruzando la pantalla */}
      {showPacman && (
        <div
          className="absolute z-40 animate-pulse"
          style={{
            left: `${pacmanPosition.x}%`,
            top: `${pacmanPosition.y}%`,
            width: "30px",
            height: "30px",
            background: "yellow",
            borderRadius: "50%",
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
          }}
        />
      )}

      {/* Space Invader cayendo */}
      {showSpaceInvader && (
        <div
          className="absolute z-40"
          style={{
            left: `${invaderPosition.x}%`,
            top: `${invaderPosition.y}%`,
            width: "30px",
            height: "30px",
          }}
        >
          <div className="w-full h-full grid grid-cols-5 grid-rows-5">
            <div className="bg-green-500"></div>
            <div></div>
            <div className="bg-green-500"></div>
            <div></div>
            <div className="bg-green-500"></div>

            <div></div>
            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>
            <div></div>

            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>
            <div className="bg-green-500"></div>

            <div className="bg-green-500"></div>
            <div></div>
            <div className="bg-green-500"></div>
            <div></div>
            <div className="bg-green-500"></div>

            <div></div>
            <div className="bg-green-500"></div>
            <div></div>
            <div className="bg-green-500"></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  )
}
