export default function Login() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Email" />
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Password" type="password" />
        <button className="w-full rounded bg-black px-3 py-2 text-white text-sm">Sign in</button>
      </div>
    </div>
  )
}
