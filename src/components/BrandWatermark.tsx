export default function BrandWatermark() {
  const envUrl = (import.meta as any).env?.VITE_BRAND_LOGO_URL as string | undefined
  const logoUrl = envUrl || '/Blacklane_logoooo_svg___.svg'
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt="Blacklane"
        className="opacity-30 max-w-[60vw] w-[520px] h-auto object-contain"
        draggable={false}
      />
    </div>
  )
}
