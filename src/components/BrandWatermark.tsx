export default function BrandWatermark() {
  const envUrl = (import.meta as any).env?.VITE_BRAND_LOGO_URL as string | undefined
  const defaultUrl = 'https://raw.githubusercontent.com/yakyakyak14/blacklane-suvs/main/src/assets/Blacklane__logoo_png.png'
  const logoUrl = envUrl || defaultUrl
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
