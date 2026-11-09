import { TopNav } from "@/components/layout/top-nav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4">
      <TopNav email={user?.email ?? ""} />
      <main className="rounded-shell bg-shell p-6 md:p-10">{children}</main>
    </div>
  );
}
