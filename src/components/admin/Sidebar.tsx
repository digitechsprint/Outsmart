"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  FileText,
  LogOut,
  Users,
  Mail
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Services", href: "/admin/services", icon: Users },
    { name: "Blog", href: "/admin/blog", icon: FileText },
  ];

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col text-gray-800 font-sans z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Outsmart Technology"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-bold ${
                isActive 
                  ? "bg-[#8a198c]/10 text-[#8a198c]" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 text-left font-bold">
          <LogOut size={20} />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
