function requireSupabaseEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** True when public Supabase env is set (e.g. on Vercel). Middleware/layout can skip client creation when false. */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

export function getSupabaseUrl() {
  return requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

