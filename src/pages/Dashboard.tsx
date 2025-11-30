export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded border bg-white p-4">Total Trips</div>
        <div className="rounded border bg-white p-4">Active Drivers</div>
        <div className="rounded border bg-white p-4">Pending Payouts</div>
        <div className="rounded border bg-white p-4">Open Tickets</div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded border bg-white p-4 h-64">Trips Chart</div>
        <div className="rounded border bg-white p-4 h-64">Revenue Chart</div>
      </div>
    </div>
  )
}
