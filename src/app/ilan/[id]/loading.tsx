export default function ListingDetailLoading() {
  return (
    <main className="min-h-screen bg-white text-[#1e3a5f]">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 h-4 w-64 animate-pulse rounded bg-slate-100" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="mt-6 space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-7 w-1/3 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          </section>
          <aside>
            <div className="space-y-4">
              <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
