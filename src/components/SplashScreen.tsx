import { useEffect, useRef } from 'react'
import splashVideo from '../../../src/assets/20251204-2220-50.2320897.mp4'
import splashLogo from '../../../src/assets/Blacklane__logoo_png.png'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const endedRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (!endedRef.current) {
        endedRef.current = true
        onDone()
      }
    }, 8000) // fallback in case onended doesn't fire
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={splashVideo}
        autoPlay
        muted
        playsInline
        onEnded={() => {
          if (!endedRef.current) {
            endedRef.current = true
            onDone()
          }
        }}
        onError={() => {
          if (!endedRef.current) {
            endedRef.current = true
            onDone()
          }
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={splashLogo}
          alt="Blacklane"
          className="w-[280px] max-w-[60vw] h-auto object-contain animate-[zoomOut_2000ms_ease-out_forwards]"
          draggable={false}
        />
      </div>

      <style>{`
        @keyframes zoomOut {
          0% { transform: scale(1.35); opacity: 1; }
          60% { transform: scale(1.0); opacity: 0.9; }
          100% { transform: scale(0.92); opacity: 0.0; }
        }
      `}</style>
    </div>
  )
}
