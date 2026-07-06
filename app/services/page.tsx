"use client";

import { Scale, Users, Heart, Sparkles, Camera, Building2, Car, Gift, ChevronLeft, MessageCircle, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";
import TopHeader from "@/components/TopHeader"
// تصميم فروع الشجر الذهبية للعنوان
const LaurelSvg = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 30 C 10 20, 15 10, 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 17 22 C 14 18, 13 14, 18 12 C 21 16, 22 20, 17 22 Z" fill="currentColor" />
    <path d="M 12 30 C 8 26, 7 21, 12 18 C 15 22, 16 27, 12 30 Z" fill="currentColor" />
    <path d="M 24 14 C 21 10, 20 6, 26 4 C 29 8, 30 13, 24 14 Z" fill="currentColor" />
  </svg>
);

export default function ServicesPage() {

  const services = [
    {
      id: 1,
      title: "مأذون شرعي",
      description: "إتمام عقد الزواج بطريقة نظامية ومعتمدة.",
      icon: <Scale className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: true
    },
    {
      id: 2,
      title: "خطابات",
      description: "مساعدة في التوفيق بين الطرفين وترتيب التواصل.",
      icon: <Users className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: true
    },
    {
      id: 3,
      title: "استشارات أسرية",
      description: "استشارات قبل الزواج وبعده مع مختصين.",
      icon: <Heart className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    },
    {
      id: 4,
      title: "كوافيرات وتجهيز العروس",
      description: "ترشيح أفضل الكوافيرات ومراكز التجميل.",
      icon: <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    },
    {
      id: 5,
      title: "تصوير المناسبات",
      description: "حجز مصورين ومصورات لجلسات الزفاف.",
      icon: <Camera className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    },
    {
      id: 6,
      title: "قاعات الزواج",
      description: "مساعدة في اختيار القاعة المناسبة لاحتياجك.",
      icon: <Building2 className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    },
    {
      id: 7,
      title: "تنسيق الضيافة والتنقل",
      description: "خدمات الضيافة والسيارات حسب طلبك.",
      icon: <Car className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    },
    {
      id: 8,
      title: "هدايا وتجهيزات",
      description: "تجهيز الهدايا والشبكات وكافة المستلزمات.",
      icon: <Gift className="w-7 h-7 md:w-8 md:h-8 text-[#8c6b3e]" />,
      available: false
    }
  ];

  return (
  <div className="min-h-screen bg-[#0f172a] font-sans antialiased" dir="rtl">
      
      {/* 1. الهيدر الكحلي العلوي - تم تقليل المسافة السفلية (pb-12 بدلاً من pb-20) لرفع المحتوى الأبيض */}
      <div className="pt-6 pb-12 px-4 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        
        {/* استدعاء المكون الذكي الذي يحتوي على القائمة، الشعار، والجرس */}
        <TopHeader />
        
      </div>
      {/* 2. المحتوى الأبيض المنحني - تم تقليل padding-top (pt-8 بدلاً من pt-10) */}
      <div className="bg-[#fdfdfc] rounded-t-[2.5rem] md:rounded-t-[3rem] px-4 pt-8 pb-28 -mt-6 relative z-20 min-h-screen shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto">
          
          {/* عنوان القسم - تم تقليل المسافة السفلية (mb-6 بدلاً من mb-8) */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-3 mb-1">
              <LaurelSvg className="w-5 h-5 md:w-7 md:h-7 text-[#c29b57]" />
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">خدمات الزواج</h2>
              <LaurelSvg className="w-5 h-5 md:w-7 md:h-7 text-[#c29b57]" flipped />
            </div>
            <p className="text-slate-600 text-[13px] md:text-base font-semibold mt-1">نرافقك في جميع خطوات الزواج</p>
          </div>

          {/* البانر العلوي (مع صورة الخلفية) - تم تصغير الارتفاع بشكل ملحوظ ليكون بانر نحيف وأنيق */}
          <div className="relative rounded-[1.2rem] overflow-hidden mb-8 shadow-sm h-[100px] md:h-32 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
            
            {/* تعتيم متدرج ومناسب لإبراز النص */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/60 to-[#0f172a]/40"></div>
            
            <div className="relative z-10 px-4 w-full flex flex-col items-center justify-center mt-1">
              {/* تصغير حجم الخط ليتناسب مع البانر النحيف */}
              <h3 className="text-lg md:text-xl font-extrabold leading-tight drop-shadow-md">
                <span className="text-[#c29b57]">كل ما تحتاجه لإتمام زواجك</span>
                <span className="text-white block mt-0.5">في مكان واحد</span>
              </h3>
              
              {/* استخدام أيقونة القلب العادية (تأكد من استيراد Heart من lucide-react) */}
              <Heart className="w-4 h-4 text-[#c29b57] mx-auto mt-1.5 drop-shadow-sm" />
            </div>
          </div>
          {/* شبكة الخدمات */}
          <div className="grid grid-cols-2 gap-2 md:gap-6 mb-10">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 border border-slate-100 shadow-sm flex flex-col justify-between text-center md:text-right">
                
               {/* ترتيب المحتوى: عمودي في الجوال (أيقونة ثم نص) وأفقي في الكمبيوتر */}
             <div className="flex flex-col items-center gap-3 mb-4">
  <div className="w-14 h-14 bg-[#fdfaf4] border border-[#ebd9b4] rounded-full flex items-center justify-center flex-shrink-0">
    {service.icon}
  </div>
  <div className="text-center mt-1">
    {/* زيادة سماكة العنوان (font-extrabold) وتغيير اللون للأسود الكحلي وتقارب الحروف قليلاً */}
    <h4 className="text-[15px] md:text-lg font-extrabold text-[#0f172a] mb-1.5 tracking-tight">{service.title}</h4>
    
    {/* تغميق اللون (slate-600)، زيادة الوزن (font-medium)، وزيادة المسافة بين السطور (leading-relaxed) */}
    <p className="text-slate-800 text-[11px] md:text-xs font-semibold leading-relaxed px-1 max-w-[170px] mx-auto">
      {service.description}
    </p>
  </div>
</div>
              {/* إصلاح مسافة الزر ليتمدد بشكل صحيح */}
              <div className="mt-auto w-full">                  {service.available ? (
                    <a 
                      href={`https://wa.me/966565687511?text=السلام عليكم، أود الاستفسار عن خدمة (${service.title}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold flex justify-center items-center gap-2 transition-all border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57] hover:text-white"
                    >
                      لطلب الخدمة <ChevronLeft size={14} />
                    </a>
                  ) : (
                    <div className="w-full py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold flex justify-center items-center gap-2 bg-white text-slate-400 border border-slate-200 cursor-not-allowed">
                      قريباً
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        {/* البانر السفلي (تطابق 100% مع التصميم - مع أيقونة واتساب رسمية وواضحة) */}
<div className="bg-[#0f172a] rounded-[1.5rem] flex flex-col items-center justify-center p-6 mb-6 mt-4 gap-5">
  
  <div className="text-center w-full">
    <h4 className="text-white font-bold text-[15px] md:text-lg mb-2">لا تجد الخدمة التي تبحث عنها؟</h4>
    <p className="text-slate-300 text-[10px] md:text-xs leading-relaxed max-w-[280px] mx-auto">
      نسعد بخدمتك في جميع احتياجات الزواج، ونوفر لك أفضل الحلول والتنسيق من البداية حتى اكتمال المناسبة.
    </p>
  </div>
  
  <a 
    href="https://wa.me/966565687511" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-full bg-transparent border border-[#c29b57] text-[#c29b57] py-2.5 rounded-full font-bold transition-colors flex items-center justify-center gap-3 hover:bg-[#c29b57]/10"
  >
    <span className="text-right leading-tight text-[11px] md:text-xs">تواصل معنا عبر<br/>واتساب</span>
    
    <div className="bg-[#25D366] w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
      {/* تم استخدام أيقونة واتساب القياسية لتعمل بشكل مثالي */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-white">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
      </svg>
    </div>
  </a>
</div>       </div>
      </div>
    </div>
  );
}

