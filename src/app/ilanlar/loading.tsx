export default function IlanlarLoading() {
  return (
    <main className="min-h-screen bg-white text-[#1e3a5f]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="h-[600px] animate-pulse rounded-xl bg-slate-100" />
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="h-52 w-full animate-pulse bg-slate-100" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
