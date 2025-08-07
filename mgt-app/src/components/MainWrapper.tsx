"use client";
import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrintView = pathname.startsWith("/print-view");
  return (
    <main className={isPrintView ? "flex-1" : "flex-1 pl-[256px]"}>{children}</main>
  );
}
