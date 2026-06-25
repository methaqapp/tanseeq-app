"use client";

import { useState } from 'react';
import { ChevronDown, User, RefreshCw, Lock, ShieldCheck, Heart, Users, CheckCircle2 } from 'lucide-react';
import TopHeader from '@/components/TopHeader';

const accordionItems = [
  {
    title: "من نحن؟",
    icon: <User className="w-5 h-5 text-[#c29b57]" />,
    content: (
      <div className="space-y-3 pt-1">
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          ميثاق هي منصة زواج شرعي متخصصة، أُسست لتكون جسراً آمناً يربط بين الباحثين عن الاستقرار وفق قيمنا الأصيلة.
        </p>
        <div className="bg-[#fcfaf6] border border-[#ebd9b4] p-3 rounded-xl flex items-start gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c29b57] mt-1.5 shrink-0"></div>
          <p className="text-[#0f172a] text-xs font-bold leading-relaxed">
            نعتمد أعلى معايير الخصوصية لضمان تجربة تليق بتطلعات أعضائنا، ونسعى لأن نكون الوجهة الأولى للزواج الجاد.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "كيف نعمل؟",
    icon: <RefreshCw className="w-5 h-5 text-[#c29b57]" />,
    content: (
      <div className="pt-1">
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { step: "1", title: "إنشاء الملف", desc: "سجل بياناتك ومواصفات شريك حياتك بدقة." },
            { step: "2", title: "التحقق", desc: "نتحقق من جدية الهوية عبر الرقم الموحد." },
            { step: "3", title: "المراجعة", desc: "يراجع فريقنا طلبك لضمان جدية البيانات." },
            { step: "4", title: "التواصل", desc: "ننسق لفتح قنوات التواصل الآمنة." },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#fcfaf6] p-2.5 rounded-xl border border-[#ebd9b4]/70">
              <div className="w-8 h-8 rounded-full bg-white border border-[#c29b57] flex items-center justify-center text-[#c29b57] font-bold shrink-0 text-sm shadow-sm">
                {s.step}
              </div>
              <div>
                <h4 className="text-[#0f172a] text-sm font-bold">{s.title}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5 font-medium">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: "خصوصيتك أمانة",
    icon: <Lock className="w-5 h-5 text-[#c29b57]" />,
    content: (
      <div className="space-y-3 pt-1">
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          في ميثاق، الخصوصية ليست خياراً بل ركيزة أساسية. جميع بياناتك مشفرة ومحفوظة بعناية.
        </p>
        <ul className="space-y-2 mt-2">
          <li className="flex items-start gap-2 text-xs font-medium text-slate-600 bg-[#fcfaf6] p-2 rounded-lg border border-[#ebd9b4]/70">
            <CheckCircle2 size={14} className="text-[#c29b57] mt-0.5 shrink-0" />
            <span>لا يتم الكشف عن تفاصيل الاتصال أو رقم جوالك علناً.</span>
          </li>
          <li className="flex items-start gap-2 text-xs font-medium text-slate-600 bg-[#fcfaf6] p-2 rounded-lg border border-[#ebd9b4]/70">
            <CheckCircle2 size={14} className="text-[#c29b57] mt-0.5 shrink-0" />
            <span>التواصل يتم حصراً ضمن إطار رسمي وموافق عليه.</span>
          </li>
        </ul>
      </div>
    )
  }
];

export default function MorePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    // تم إرجاع الخلفية الأساسية للون العاجي الفاتح لتطابق باقي التطبيق
    <main className="min-h-screen bg-[#fcfaf6] font-sans antialiased overflow-x-hidden pb-28" dir="rtl">
      
      {/* القسم العلوي الكحلي بالانحناء السفلي (مطابق لصفحة الاستكشاف والخدمات) */}
      <div className="bg-[#0f172a] w-full pt-6 pb-20 px-4 relative rounded-b-[2.5rem] shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-50 mb-6">
          <TopHeader />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto mt-4">
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

      {/* شريط الإحصائيات المتداخل */}
      <div className="max-w-4xl mx-auto px-5 relative -mt-8 z-[60] mb-8">
        <div className="bg-[#fcfaf6] rounded-2xl py-3 px-5 shadow-xl border border-[#ebd9b4] flex items-center justify-between">
          <div className="flex items-center justify-center flex-1 gap-2.5">
            <div className="w-9 h-9 bg-[#0f172a] rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-[#c29b57]" />
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0f172a] text-sm leading-tight">خصوصية 100%</p>
              <p className="text-slate-500 text-[10px]">بياناتك محمية</p>
            </div>
          </div>
          <div className="w-px h-8 bg-[#ebd9b4]/60"></div>
          <div className="flex items-center justify-center flex-1 gap-2.5">
            <div className="w-9 h-9 bg-[#0f172a] rounded-lg flex items-center justify-center shrink-0">
              <Users size={18} className="text-[#c29b57]" />
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0f172a] text-sm leading-tight">+1200</p>
              <p className="text-slate-500 text-[10px]">عضو موثق</p>
            </div>
          </div>
        </div>
      </div>

      {/* قسم الأسئلة (تم تعديله ليصبح ببطاقات بيضاء وحدود ذهبية مثل صفحة الخدمات) */}
      <div className="px-5 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-[#0f172a] mb-5 text-center flex items-center justify-center gap-2">
          المزيد عن ميثاق
        </h1>
        
        <div className="space-y-3">
          {accordionItems.map((item, index) => (
            <div key={index} className="border border-[#ebd9b4] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex justify-between items-center text-[#0f172a] font-bold"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.title}
                </div>
                <ChevronDown className={`text-[#c29b57] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-0 border-t border-[#ebd9b4]/30">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
