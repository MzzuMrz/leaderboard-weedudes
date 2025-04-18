import Image from "next/image"
import { Press_Start_2P } from "next/font/google"

const arcadeFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
})

export function KonamiFooter() {
  return (
    <div className={`${arcadeFont.className} flex flex-col items-center mb-1`}>
      {/* Logo con símbolo rojo y texto */}
      <div className="flex items-center justify-center mb-1">
        <div className="flex items-center">
          <Image src="/images/weedudes-logo.png" alt="Weedudes Logo" width={24} height={24} className="mr-1" />
          <div className="text-gray-300 tracking-wide mx-1 text-xs">WEEDUDES</div>
          <div className="text-gray-300 text-xs">®</div>
        </div>
      </div>

      {/* Línea de copyright */}
      <div className="flex items-center justify-center text-gray-300 text-xs">
        <span className="mr-1">©</span>
        <span className="mr-1">WEEDUDES</span>
        <span>2024</span>
      </div>
    </div>
  )
}
