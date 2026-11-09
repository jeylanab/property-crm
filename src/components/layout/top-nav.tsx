"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { signOut } from "@/features/auth/actions/sign-out";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TopNav({ email = "" }: { email?: string }) {
  const pathname = usePathname();

  return (
    <header className="rounded-pill bg-shell px-6 py-3 flex items-center justify-between gap-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-xl font-semibold text-ink shrink-0">
        <Building2 className="size-6" /> Propy
      </Link>

      <nav className="hidden lg:flex items-center gap-7 overflow-x-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 py-3 text-[15px] border-b-2 transition-colors",
                active ? "border-ink text-ink font-semibold" : "border-transparent text-ink-soft hover:text-ink"
              )}
            >
              <Icon className="size-[18px]" /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <span className="size-10 rounded-full bg-ink text-white grid place-items-center text-sm font-semibold uppercase">
          {email.charAt(0) || "U"}
        </span>
        <span className="hidden md:block max-w-[160px] truncate text-sm font-medium text-ink">{email}</span>
        <form action={signOut}>
          <button type="submit" aria-label="Log out" title="Log out"
            className="size-10 rounded-full grid place-items-center text-ink-soft hover:bg-ink/5 hover:text-ink">
            <LogOut className="size-[18px]" />
          </button>
        </form>
      </div>
    </header>
  );
}
