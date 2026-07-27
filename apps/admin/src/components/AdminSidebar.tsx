"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/audit", label: "Audit Log" },
  { href: "/pause", label: "Emergency Stop" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-900">BITBIT Admin</h1>
        <p className="text-xs text-gray-500">Yönetim Paneli</p>
      </div>
      <nav className="px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
