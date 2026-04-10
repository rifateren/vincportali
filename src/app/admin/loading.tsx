export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-slate-100" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-5 w-5/12 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-2/12 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-2/12 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-2/12 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
