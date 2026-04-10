export default function KayitLoading() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
