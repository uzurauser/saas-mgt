"use client";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./SidebarNav";

export default function SidebarNavWrapper() {
  const pathname = usePathname();
  // /print-view配下ではSidebarNavを非表示
  if (pathname.startsWith("/print-view")) return null;
  return <SidebarNav />;
}
