export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to PROVIDHY. Use the sidebar to navigate modules.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open Orders", value: "128" },
          { label: "Low Stock Items", value: "14" },
          { label: "Pending Invoices", value: "37" },
          { label: "Active Employees", value: "246" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
