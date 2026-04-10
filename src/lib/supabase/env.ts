function requireSupabaseEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl() {
  return requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

