import Image from "next/image"
import { Press_Start_2P } from "next/font/google"

const arcadeFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
})

export function KonamiFooter() {
  return (
    <div className={`${arcadeFont.className} flex items-center`}>
      {/* Logo con símbolo rojo y texto */}
      <div className="flex items-center">
        <Image src="/images/weedudes-logo.png" alt="Weedudes Logo" width={20} height={20} className="mr-1" />
        <div className="text-gray-300 tracking-wide mx-1 text-xs">WEEDUDES</div>
        <div className="text-gray-300 text-xs">®</div>
        <span className="ml-2 text-gray-300 text-xs">© 2024</span>
      </div>
    </div>
  )
}
