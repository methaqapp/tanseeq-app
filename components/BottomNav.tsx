// components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, UserPlus, Grid } from "lucide-react"; // تأكد من تثبيت lucide-react

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "استكشف", href: "/explore", icon: Compass },
    { name: "إنشاء ملفي", href: "/register", icon: UserPlus },
    { name: "الخدمات", href: "/services", icon: Grid },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-[#1D2B4F]"
              } transition-colors duration-200`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
