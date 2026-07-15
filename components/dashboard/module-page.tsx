type ModulePageProps = {
  title: string
  description: string
}

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          This module is ready for implementation.
        </p>
      </div>
    </div>
  )
}
