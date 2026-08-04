export default function AuthMarketingPanel() {
  return (
    <div className="flex h-full min-h-[calc(100svh-3rem)] flex-col justify-between overflow-hidden rounded-2xl bg-muted/50 px-10 py-12 lg:px-14">
      <div className="flex max-w-md flex-col gap-10">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl lg:leading-snug">
          Manage Your Business with Clarity, Confidence &amp; Control
        </h2>

        <div className="relative mx-auto w-full max-w-sm">
          <AuthDashboardGraphic />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Organize finances, reduce errors, and gain actionable insights to make
          smarter decisions for your business growth.
        </p>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        For sales &amp; support, contact{" "}
        <span className="whitespace-nowrap">9851221467, 9709088599</span>{" "}
        <a
          href="mailto:info@vidhypro.com"
          className="text-primary underline-offset-2 hover:underline"
        >
          info@vidhypro.com
        </a>
      </p>
    </div>
  )
}

function AuthDashboardGraphic() {
  return (
    <div className="relative rounded-xl border border-border bg-background p-4 shadow-sm">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Cash In vs Cash Out
      </p>
      <svg
        viewBox="0 0 320 140"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M0 100 C40 95, 60 70, 100 75 C140 80, 160 40, 200 45 C240 50, 280 20, 320 30"
          stroke="var(--primary)"
          strokeWidth="2.5"
          fill="url(#cashInFill)"
        />
        <path
          d="M0 110 C50 105, 80 90, 120 95 C160 100, 190 70, 230 78 C270 86, 300 60, 320 65"
          stroke="#e05a5a"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="cashInFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-10 right-3 rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
        <p className="text-sm font-semibold tabular-nums">Rs. 2,59,000</p>
        <p className="text-[11px] text-muted-foreground">Total Payables</p>
        <p className="text-[11px] font-medium text-emerald-600">↑ 0.5%</p>
      </div>
      <div className="absolute right-16 bottom-8 rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
        <p className="text-sm font-semibold tabular-nums">Rs. 5,97,000</p>
        <p className="text-[11px] text-muted-foreground">Total Receivables</p>
        <p className="text-[11px] font-medium text-red-500">↓ 1.3%</p>
      </div>
    </div>
  )
}
