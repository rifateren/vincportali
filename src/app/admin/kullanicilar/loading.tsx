export default function AdminKullanicilarLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex gap-4 border-b border-slate-100 px-5 py-3">
          <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-slate-50 px-5 py-4">
            <div className="flex w-1/4 items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-1/6 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
