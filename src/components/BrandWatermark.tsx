import logoPng from '../../blacklane-logo.png'

export default function BrandWatermark() {
  const logoUrl = logoPng
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center select-none">
      <img
        src={logoUrl}
        alt="Blacklane"
        className="opacity-[0.35] max-w-[60vw] w-[520px] h-auto object-contain"
        draggable={false}
      />
    </div>
  )
}
