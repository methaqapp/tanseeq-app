// app/page.tsx
import Link from "next/link";
import { ShieldCheck, User, Lock, FileCheck, Users, Clock, ChevronLeft, FileText, ClipboardCheck, Search, Handshake, Headphones } from "lucide-react";
import RecentRequestsSlider from "@/components/RecentRequestsSlider";
// تصميم فروع الشجر الذهبية للبطاقات (من كودك الأصلي)
const LaurelSvg = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 30 C 10 20, 15 10, 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 17 22 C 14 18, 13 14, 18 12 C 21 16, 22 20, 17 22 Z" fill="currentColor" />
    <path d="M 12 30 C 8 26, 7 21, 12 18 C 15 22, 16 27, 12 30 Z" fill="currentColor" />
    <path d="M 24 14 C 21 10, 20 6, 26 4 C 29 8, 30 13, 24 14 Z" fill="currentColor" />
  </svg>
);

// تصميم أيقونة النساء (من كودك الأصلي)
const FemaleAvatar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a5 5 0 0 0-5 5v2c0 1.5-1 3-2 4v7h14v-7c-1-1-2-2.5-2-4V7a5 5 0 0 0-5-5z" />
    <path d="M8.5 10a4 4 0 0 0 7 0" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans" dir="rtl">
      <div className="w-full pb-10">
        
        {/* 1. الشريط العلوي (Top Bar) */}
        <div className="bg-[#0f172a] text-[#c29b57] text-xs md:text-sm py-2 px-4 flex justify-center items-center gap-2 border-b border-slate-800">
          <LaurelSvg className="w-4 h-4 hidden md:block" />
          <Lock className="w-3.5 h-3.5" />
          <span>جميع الطلبات تخضع للمراجعة والاعتماد قبل النشر حفاظاً على خصوصيتك</span>
          <LaurelSvg className="w-4 h-4 hidden md:block" flipped />
        </div>

        {/* 2. الهيدر */}
        <div className="bg-[#0f172a] w-full rounded-b-[3rem] px-4 pt-10 pb-24 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <ShieldCheck className="w-20 h-20 text-[#c29b57] mx-auto mb-4" /> 
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">ميثاق</h1>
            <p className="text-lg md:text-xl text-white font-medium mb-3">منصة موثوقة للتوافق والزواج الجاد داخل الخليج</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-[#c29b57] transform rotate-45"></div>
              <p className="text-[#c29b57] text-xs md:text-sm font-medium">بإشراف ومتابعة بشرية للحفاظ على الجدية والخصوصية</p>
              <div className="w-2 h-2 bg-[#c29b57] transform rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mt-16 mb-16">
         <RecentRequestsSlider />
        </div>

        {/* 3. الميزات العلوية */}
        <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
              <Lock className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">خصوصية وسرية كاملة</h3>
              <p className="text-slate-400 text-xs leading-relaxed">لا يتم نشر أي بيانات شخصية أو وسيلة تواصل</p>
            </div>
            <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
              <FileCheck className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">مراجعة واعتماد يدوي</h3>
              <p className="text-slate-400 text-xs leading-relaxed">جميع الطلبات يتم تدقيقها قبل الاعتماد</p>
            </div>
            <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
              <Users className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">تنسيق احترافي</h3>
              <p className="text-slate-400 text-xs leading-relaxed">عبر الإدارة والخطابات المعتمدة بطريقة آمنة</p>
            </div>
          </div>
        </div>

        {/* 4. ماذا تبحث عن؟ */}
        <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">
            ماذا تبحث عن ؟
          </h2>
          <p className="text-slate-500 text-sm mb-10">اختر نوع التسجيل المناسب وسيتم توجيهك لخطوات التسجيل خلال دقائق</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <Link href="/explore" className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
              <div className="w-28 h-28 bg-[#c29b57] rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                <FemaleAvatar className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">أبحث عن زوج</h3>
              <p className="text-slate-500 text-sm mb-6">تسجيل امرأة ترغب في الزواج</p>
              <div className="flex items-center gap-2 text-xs text-[#c29b57] bg-yellow-50 px-5 py-2.5 rounded-full mb-8 font-medium">
                <Clock className="w-4 h-4" /> التسجيل يستغرق أقل من دقيقتين
              </div>
              <div className="bg-[#c29b57] text-white w-full py-4 rounded-xl font-bold hover:bg-[#a8864a] transition-colors flex items-center justify-center gap-2 text-lg">
               استكشف <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              <p className="mt-5 text-xs text-slate-400 font-medium">تسجيل النساء</p>
            </Link>

            <Link href="/explore" className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
              <div className="w-28 h-28 bg-[#0f172a] rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                <User className="w-12 h-12 text-[#c29b57]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">أبحث عن زوجة</h3>
              <p className="text-slate-500 text-sm mb-6">تسجيل رجل يرغب في الزواج</p>
              <div className="flex items-center gap-2 text-xs text-[#c29b57] bg-yellow-50 px-5 py-2.5 rounded-full mb-8 font-medium">
                <Clock className="w-4 h-4" /> التسجيل يستغرق أقل من دقيقتين
              </div>
              <div className="bg-[#0f172a] text-white w-full py-4 rounded-xl font-bold hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 text-lg">
                استكشف <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              <p className="mt-5 text-xs text-slate-400 font-medium">تسجيل الرجال</p>
            </Link>
          </div>

          {/* 5. قسم (كيف تعمل المنصة ؟) */}
          <div className="mt-24 mb-16">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-[#c29b57] to-transparent"></div>
              <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">كيف تعمل المنصة ؟</h2>
              <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-[#c29b57] to-transparent"></div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">
              <div className="flex flex-col items-center text-center w-40">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                  <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">1</span>
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-xs font-bold text-[#0f172a] leading-relaxed">سجل بياناتك<br/>خلال دقائق</p>
              </div>

              <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

              <div className="flex flex-col items-center text-center w-40">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                  <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">2</span>
                  <ClipboardCheck className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-xs font-bold text-[#0f172a] leading-relaxed">تتم مراجعة الطلب<br/>من الإدارة</p>
              </div>

              <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

              <div className="flex flex-col items-center text-center w-40">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                  <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">3</span>
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-xs font-bold text-[#0f172a] leading-relaxed">يتم البحث عن<br/>حالة مناسبة لك</p>
              </div>

              <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

              <div className="flex flex-col items-center text-center w-40">
                <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                  <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">4</span>
                  <Handshake className="w-8 h-8 text-[#0f172a]" />
                </div>
                <p className="text-xs font-bold text-[#0f172a] leading-relaxed">يتم التنسيق والتواصل<br/>عند وجود توافق</p>
              </div>
            </div>
          </div>

          {/* 6. قسم الخصوصية والدعم */}
          <div className="bg-[#faf7f2] rounded-3xl p-8 border border-[#eae0d1] flex flex-col md:flex-row items-center justify-between text-right gap-6 mb-8">
             <div>
               <h3 className="font-bold text-[#0f172a] mb-2 text-lg">خصوصيتك أولويتنا</h3>
               <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">لن يتم عرض رقم الجوال أو أي وسيلة تواصل للطرف الآخر. ويتم التنسيق فقط عبر إدارة المنصة حفاظاً على الخصوصية والأمان.</p>
             </div>
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae0d1] flex-shrink-0">
               <Lock className="w-10 h-10 text-[#c29b57]" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-md">
               <div className="text-right">
                  <h4 className="text-white font-bold mb-2 text-lg">دعم ومتابعة</h4>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">فريق مختص لخدمتك والإجابة على جميع استفساراتك</p>
               </div>
               <Headphones className="w-12 h-12 text-[#c29b57]" />
            </div>

            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-md">
               <div className="text-right flex-1">
                  <h4 className="text-white font-bold mb-1 text-lg">تواصل معنا عبر واتساب</h4>
                  <p className="text-slate-400 text-xs mb-4">للرد على استفساراتك ومتابعة طلبك</p>
                  <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="inline-block border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57] hover:text-white transition-colors px-6 py-2 rounded-xl text-xs font-bold">
                    تواصل عبر واتساب
                  </a>
               </div>
               <div className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.666.598 1.216.774 1.388.86.173.086.275.072.376-.043.101-.115.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z" />
                  </svg>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* الفوتر (Footer) */}
      <footer className="bg-[#0f172a] py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-white text-xs border-t border-slate-800 mt-auto">
         <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Lock className="w-4 h-4 text-[#c29b57]" />
            <span>جميع الحقوق محفوظة © 2026 ميثاق</span>
         </div>
         <div className="text-center md:text-left flex items-center gap-3">
            <div className="text-right">
               <span className="text-white font-bold text-sm block">ميثاق</span>
               <span className="text-slate-400">منصة موثوقة للتوافق والزواج الجاد داخل الخليج</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#c29b57]" />
         </div>
      </footer>
    </main>
  );
}
