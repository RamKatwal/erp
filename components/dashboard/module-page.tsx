import { PageHeader } from "@/components/layout/page-header"

type ModulePageProps = {
  title: string
}

export function ModulePage({ title }: ModulePageProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} />

      <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          This module is ready for implementation.
        </p>
      </div>
    </div>
  )
}
