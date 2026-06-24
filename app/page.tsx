"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, Users, FileText, ChevronLeft, Download, MessageCircle, 
  Heart, Bell, Menu, BadgeCheck, X, Home, Search, User, Info, Phone 
} from "lucide-react";
import RecentRequestsSlider from "@/components/RecentRequestsSlider";
import TopHeader from "@/components/TopHeader";
import InstallAppModal from "@/components/InstallAppModal";

const LaurelSvg = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 30 C 10 20, 15 10, 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 17 22 C 14 18, 13 14, 18 12 C 21 16, 22 20, 17 22 Z" fill="currentColor" />
    <path d="M 12 30 C 8 26, 7 21, 12 18 C 15 22, 16 27, 12 30 Z" fill="currentColor" />
    <path d="M 24 14 C 21 10, 20 6, 26 4 C 29 8, 30 13, 24 14 Z" fill="currentColor" />
  </svg>
);

export default function HomePage() {
  // 1. حالات (States) القائمة والإشعارات
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // 2. حالات (States) وتأثيرات PWA لتثبيت التطبيق
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // التقاط حدث طلب التثبيت من المتصفح
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

 const handleInstallClick = async () => {
    if (deferredPrompt) {
      // للمتصفحات الداعمة مثل كروم
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // اكتشاف إذا كان المستخدم يستخدم جهاز Apple (آيفون أو آيباد)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      if (isIOS) {
        alert("🍎 لتثبيت التطبيق على الآيفون:\n\n1. اضغط على أيقونة المشاركة (Share) في أسفل المتصفح 📤\n2. اختر (إضافة إلى الصفحة الرئيسية) أو (Add to Home Screen) ➕");
      } else {
        // للمتصفحات الأخرى غير الداعمة أو إذا كان مثبتاً بالفعل
        alert("التطبيق مثبت مسبقاً، أو أن متصفحك الحالي لا يدعم التثبيت المباشر. (يُنصح باستخدام Google Chrome).");
      }
    }
  };
  return (
    <main className="min-h-screen bg-[#fcfaf6] font-sans antialiased overflow-x-hidden pb-28" dir="rtl">
      
  {/* القسم العلوي الكحلي */}
  <div className="bg-[#0f172a] w-full pt-6 pb-24 px-4 relative rounded-b-[3rem] shadow-lg">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
    
    {/* الهيدر الذكي مع z-50 للقوائم المنسدلة */}
    <div className="relative z-70 mb-8">
      <TopHeader />
    </div>

    {/* النصوص الترحيبية تحت الهيدر */}
    <div className="relative z-10 text-center max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#c29b57] mb-2">منصة موثوقة وآمنة</h2>
      <p className="text-sm md:text-base text-slate-200 font-medium mb-1">للزواج الجاد وتنسيق الطلبات الشرعية</p>
      <p className="text-xs md:text-sm text-slate-400 font-medium">آلاف الطلبات الموثقة بانتظارك.</p>
      
      <div className="flex items-center justify-center gap-3 mt-4 text-[#c29b57]">
         <div className="w-1.5 h-1.5 bg-[#c29b57] rotate-45"></div>
         <Heart size={14} fill="currentColor" />
         <div className="w-1.5 h-1.5 bg-[#c29b57] rotate-45"></div>
      </div>
    </div>
  </div>
      {/* شريط الإحصائيات المتداخل (الترتيب الأفقي الأصلي) */}
      <div className="max-w-4xl mx-auto px-4 relative -mt-10 z-[60] mb-8">
        <div className="bg-[#fcfaf6] rounded-[1.5rem] py-3 md:py-4 px-2 md:px-6 shadow-md border border-[#ebd9b4] flex items-center justify-between">
          
          {/* خصوصية */}
          <div className="flex items-center justify-center flex-1 gap-1.5 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-[#0f172a] rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[#c29b57] md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0f172a] text-[8px] md:text-sm leading-tight mb-0.5">خصوصية 100%</p>
              <p className="text-slate-500 text-[7px] md:text-xs leading-tight">بياناتك محمية</p>
            </div>
          </div>

          <div className="w-px h-8 md:h-10 bg-[#ebd9b4]/60"></div>

          {/* أعضاء */}
          <div className="flex items-center justify-center flex-1 gap-1.5 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-[#0f172a] rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
              <Users size={16} className="text-[#c29b57] md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0f172a] text-[8px] md:text-sm leading-tight mb-0.5">+1200</p>
              <p className="text-slate-500 text-[7px] md:text-xs leading-tight">عضو موثق</p>
            </div>
          </div>

          <div className="w-px h-8 md:h-10 bg-[#ebd9b4]/60"></div>

          {/* طلبات */}
          <div className="flex items-center justify-center flex-1 gap-1.5 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-[#0f172a] rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
              <FileText size={16} className="text-[#c29b57] md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0f172a] text-[8px] md:text-sm leading-tight mb-0.5">+2500</p>
              <p className="text-slate-500 text-[7px] md:text-xs leading-tight">طلب زواج</p>
            </div>
          </div>

        </div>
      </div>
      <div className="mb-8">
        <RecentRequestsSlider />
      </div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 gap-3 mb-12">
        <Link href="/explore" className="bg-[#0f172a] rounded-[1.5rem] h-40 md:h-48 flex overflow-hidden shadow-lg relative group border border-[#c29b57]/20 p-4 justify-end items-center">
           <LaurelSvg className="absolute -left-10 top-0 w-32 h-32 text-[#c29b57] opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
           <div className="absolute left-0 top-0 bottom-0 w-[55%] pointer-events-none">
              <div className="w-full h-full bg-[url('/men-card-bg.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f172a]/60 to-[#0f172a]"></div>
           </div>
           <div className="z-10 relative text-right flex flex-col items-start w-[65%] md:w-[50%]">
              <p className="text-white/70 text-[9px] md:text-xs font-medium mb-0.5">أبحث عن</p>
              <h3 className="text-[#c29b57] text-4xl md:text-6xl font-black mb-1 drop-shadow-md">زوج</h3>
              <p className="text-slate-300 text-[8px] md:text-[10px] leading-tight mb-3">ابدأ رحلتك للعثور على شريك حياتك</p>
              <div className="bg-[#c29b57] text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold flex items-center gap-1 hover:bg-[#a8864a] transition shadow-md w-max">
                استكشف <ChevronLeft size={10} strokeWidth={2.5} />
              </div>
           </div>
        </Link>

        <Link href="/explore" className="bg-[#fcfaf6] rounded-[1.5rem] h-40 md:h-48 flex overflow-hidden shadow-lg relative group border border-[#ebd9b4] p-4 justify-end items-center">
           <LaurelSvg className="absolute -left-10 top-0 w-32 h-32 text-[#c29b57] opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
           <div className="absolute left-0 top-0 bottom-0 w-[55%] pointer-events-none">
              <div className="w-full h-full bg-[url('/women-card-bg.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fcfaf6]/60 to-[#fcfaf6]"></div>
           </div>
           <div className="z-10 relative text-right flex flex-col items-start w-[65%] md:w-[50%]">
              <p className="text-slate-500 text-[9px] md:text-xs font-medium mb-0.5">أبحث عن</p>
              <h3 className="text-[#c29b57] text-4xl md:text-6xl font-black mb-1 drop-shadow-sm">زوجة</h3>
              <p className="text-slate-500 text-[8px] md:text-[10px] leading-tight mb-3">ابدأ رحلتك للعثور على شريكة حياتك</p>
              <div className="bg-[#c29b57] text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold flex items-center gap-1 hover:bg-[#a8864a] transition shadow-md w-max">
                استكشف <ChevronLeft size={10} strokeWidth={2.5} />
              </div>
           </div>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-14">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center opacity-80">
             <div className="w-5 md:w-10 h-[1.5px] bg-[#c29b57]"></div>
             <div className="w-1.5 h-1.5 border-[1.5px] border-[#c29b57] rotate-45 mx-1.5"></div>
             <div className="w-2 md:w-6 h-[1.5px] bg-[#c29b57]"></div>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#0f172a]">لماذا ميثاق؟</h2>
          <div className="flex items-center opacity-80">
             <div className="w-2 md:w-6 h-[1.5px] bg-[#c29b57]"></div>
             <div className="w-1.5 h-1.5 border-[1.5px] border-[#c29b57] rotate-45 mx-1.5"></div>
             <div className="w-5 md:w-10 h-[1.5px] bg-[#c29b57]"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-white border border-[#ebd9b4]/50 rounded-2xl p-3 md:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0 mb-3 md:mb-4">
              <Users className="text-[#c29b57] w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#0f172a] text-[10px] md:text-base mb-1.5">تنسيق احترافي</h3>
            <p className="text-slate-500 text-[8px] md:text-xs leading-relaxed">بحث منظم ومتابعة احترافية.</p>
          </div>
          <div className="bg-white border border-[#ebd9b4]/50 rounded-2xl p-3 md:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0 mb-3 md:mb-4">
              <BadgeCheck className="text-[#c29b57] w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#0f172a] text-[10px] md:text-base mb-1.5">مراجعة واعتماد</h3>
            <p className="text-slate-500 text-[8px] md:text-xs leading-relaxed">تدقيق الطلبات لضمان الجدية.</p>
          </div>
          <div className="bg-white border border-[#ebd9b4]/50 rounded-2xl p-3 md:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#0f172a] rounded-full flex items-center justify-center shrink-0 mb-3 md:mb-4">
              <ShieldCheck className="text-[#c29b57] w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#0f172a] text-[10px] md:text-base mb-1.5">خصوصية تامة</h3>
            <p className="text-slate-500 text-[8px] md:text-xs leading-relaxed">بياناتك محمية بسرية تامة.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center opacity-80">
             <div className="w-5 md:w-10 h-[1.5px] bg-[#c29b57]"></div>
             <div className="w-1.5 h-1.5 border-[1.5px] border-[#c29b57] rotate-45 mx-1.5"></div>
             <div className="w-2 md:w-6 h-[1.5px] bg-[#c29b57]"></div>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#0f172a]">خدمات سريعة</h2>
          <div className="flex items-center opacity-80">
             <div className="w-2 md:w-6 h-[1.5px] bg-[#c29b57]"></div>
             <div className="w-1.5 h-1.5 border-[1.5px] border-[#c29b57] rotate-45 mx-1.5"></div>
             <div className="w-5 md:w-10 h-[1.5px] bg-[#c29b57]"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* زر تثبيت التطبيق - تم تحويله إلى Button بدلاً من الرابط */}
          <InstallAppModal />          
          <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="bg-[#0f172a] rounded-xl md:rounded-[1.5rem] py-3.5 px-3 flex items-center justify-center gap-2 md:gap-4 shadow-sm hover:bg-[#16213b] transition">
             <div className="shrink-0 border-[1.5px] border-[#c29b57] rounded-full p-1.5 flex items-center justify-center text-[#c29b57]">
               <MessageCircle size={16} className="md:w-5 md:h-5" strokeWidth={2} />
             </div>
             <div className="text-right">
               <h3 className="font-bold text-white text-[11px] md:text-base mb-1 leading-none">التواصل عبر واتساب</h3>
               <p className="text-white/60 text-[8px] md:text-[11px]">تواصل معنا الآن</p>
             </div>
          </a>
        </div>
      </div>

      {/* ================= القائمة الجانبية (Sidebar) ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={closeMenu}></div>
      )}

      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} dir="rtl">
        <div className="p-6 h-full flex flex-col">
          {/* رأس القائمة الجانبية */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-[#0f172a]">ميثاق</h2>
            <button onClick={closeMenu} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition">
              <X size={18} />
            </button>
          </div>

          {/* روابط القائمة الجانبية */}
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
            <Link href="/" onClick={closeMenu} className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#0f172a] transition">
              <Info size={16} /> عن المنصة
            </Link>
            <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#0f172a] transition">
              <Phone size={16} /> الدعم الفني (واتساب)
            </a>
          </div>
        </div>
      </div>
      
    </main>
  );
}
