export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded border bg-white p-4 space-y-3">
        <div className="font-semibold">Office Address</div>
        <div className="text-sm">5B, Abdou Douif Crescent, Asokoro, Abuja.</div>

        <div className="font-semibold pt-2">WhatsApp</div>
        <a
          href="https://wa.me/2348108971777"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 underline"
        >
          +234-8108971777
        </a>
      </div>
    </div>
  )
}
