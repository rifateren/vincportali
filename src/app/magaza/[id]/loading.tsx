export default function MagazaLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-5">
        <div className="h-20 w-20 animate-pulse rounded-full bg-slate-100" />
        <div className="space-y-3">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-100" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="h-52 w-full animate-pulse bg-slate-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
