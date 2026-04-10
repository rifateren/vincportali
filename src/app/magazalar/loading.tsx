export default function MagazalarLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
