export default function IletisimLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4 h-9 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mb-8 h-4 w-72 animate-pulse rounded bg-slate-100" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-28 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
