"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Building2, Layers, ListChecks } from "lucide-react"

const navItems = [
  { href: "/clients", label: "Clients", icon: <Users size={18} /> },
  { href: "/vendors", label: "Vendors", icon: <Building2 size={18} /> },
  { href: "/csp", label: "CSPs", icon: <Building2 size={18} /> },
  {
    href: "/outsourcing-partners",
    label: "Outsourcing Partners",
    icon: <Building2 size={18} />,
  },
  {
    href: "/vendor-services",
    label: "Vendor Services",
    icon: <Layers size={18} />,
  },
  {
    href: "/checklist-cycles",
    label: "Checklist Cycles",
    icon: <ListChecks size={18} />,
  },
  {
    href: "/checklist-statuses",
    label: "Checklist Statuses",
    icon: <ListChecks size={18} />,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-2 p-6 min-w-[220px] bg-gradient-to-b from-slate-100 to-white border-r h-full shadow-lg rounded-tr-2xl">
      <Link
        href="/"
        className="flex items-center gap-2 font-extrabold text-2xl text-slate-700 mb-8 tracking-wide"
      >
        <Home size={24} />
        SaaS Mgt
      </Link>
      <div className="flex flex-col gap-4">
        {navItems.slice(0, 1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-slate-100 transition font-medium",
              pathname.startsWith(item.href)
                ? "bg-slate-200 text-slate-800 font-bold shadow"
                : "text-slate-700"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="my-4 border-t border-slate-300" />
        {navItems.slice(1, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-slate-100 transition font-medium",
              pathname.startsWith(item.href)
                ? "bg-slate-200 text-slate-800 font-bold shadow"
                : "text-slate-700"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="my-4 border-t border-slate-300" />
        {navItems.slice(4, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-slate-100 transition font-medium",
              pathname.startsWith(item.href)
                ? "bg-slate-200 text-slate-800 font-bold shadow"
                : "text-slate-700"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="my-4 border-t border-slate-300" />
        {navItems.slice(5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-slate-100 transition font-medium",
              pathname.startsWith(item.href)
                ? "bg-slate-200 text-slate-800 font-bold shadow"
                : "text-slate-700"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
