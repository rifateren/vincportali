import AdminAppShell from "@/components/admin/AdminAppShell";
import { adminDisplayName, requireAdmin } from "@/lib/admin/requireAdmin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();

  return <AdminAppShell displayName={adminDisplayName(profile)}>{children}</AdminAppShell>;
}
