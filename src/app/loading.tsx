export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#f97316]" />
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </div>
    </main>
  );
}
