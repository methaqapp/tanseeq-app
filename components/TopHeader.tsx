"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Bell, X, Home, Search, User, Phone, ShieldCheck } from "lucide-react";

// أيقونة الغصن الجمالية للشعار
const LaurelSvg = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 30 C 10 20, 15 10, 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 17 22 C 14 18, 13 14, 18 12 C 21 16, 22 20, 17 22 Z" fill="currentColor" />
    <path d="M 12 30 C 8 26, 7 21, 12 18 C 15 22, 16 27, 12 30 Z" fill="currentColor" />
    <path d="M 24 14 C 21 10, 20 6, 26 4 C 29 8, 30 13, 24 14 Z" fill="currentColor" />
  </svg>
);

export default function TopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* 1. الشريط العلوي */}
      <div className="relative z-40 max-w-5xl mx-auto flex items-center justify-between mb-8">
        <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition">
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <LaurelSvg className="w-8 h-8 text-[#c29b57] hidden md:block" />
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">ميثاق</h1>
            <p className="text-[10px] md:text-xs text-[#c29b57] font-semibold tracking-wide mt-1">منصة زواج موثوقة</p>
          </div>
          <LaurelSvg className="w-8 h-8 text-[#c29b57] hidden md:block" flipped />
        </div>

        {/* 2. الجرس والإشعارات */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 font-sans text-right animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full p-1 transition">
                  <X size={14} />
                </button>
                <h3 className="font-bold text-[#0f172a] text-sm">الإشعارات</h3>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition cursor-pointer" dir="rtl">
                <div className="w-8 h-8 bg-[#c29b57]/20 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-[#c29b57]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-xs font-bold text-[#0f172a] mb-1">أهلاً بك في ميثاق</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">نسعد بانضمامك لمنصتنا الموثوقة.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. القائمة الجانبية */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity" onClick={closeMenu}></div>}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} dir="rtl">
        <div className="p-6 h-full flex flex-col font-sans">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-[#0f172a]">ميثاق</h2>
            <button onClick={closeMenu} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition">
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-[#0f172a] font-bold transition">
              <Home size={20} className="text-[#c29b57]" /> الرئيسية
            </Link>
            <Link href="/explore" onClick={closeMenu} className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-[#0f172a] font-bold transition">
              <Search size={20} className="text-[#c29b57]" /> استكشف
            </Link>
            <Link href="/profile" onClick={closeMenu} className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-[#0f172a] font-bold transition">
              <User size={20} className="text-[#c29b57]" /> حسابي
            </Link>
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
            <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#0f172a] transition">
              <Phone size={16} /> الدعم الفني (واتساب)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
