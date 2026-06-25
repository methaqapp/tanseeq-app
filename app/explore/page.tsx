"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, ChevronDown, Loader2, AlertCircle, User, Bell, Menu, ShieldCheck, Heart, Target, SlidersHorizontal } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import TopHeader from "@/components/TopHeader";
import { useSearchParams } from 'next/navigation';
const RingIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 7.5L12 3l3.5 4.5h-7z" />
    <circle cx="12" cy="15" r="5.5" />
  </svg>
);

const saudiCities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
  "الخبر", "الظهران", "الأحساء", "الجبيل", "الطائف", 
  "تبوك", "بريدة", "عنيزة", "أبها", "خميس مشيط", 
  "جازان", "نجران", "حائل", "عرعر", "سكاكا", "الباحة", "الخفجي", "ينبع"
];

function ExplorePage() {
  const searchParams = useSearchParams();
  const genderQuery = searchParams.get('gender');
  const [activeTab, setActiveTab] = useState(genderQuery === 'male' ? 'men' : 'women');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [filterSocialStatus, setFilterSocialStatus] = useState("");
  const [filterMarriageType, setFilterMarriageType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [visibleCount, setVisibleCount] = useState(10);
  const observerTarget = useRef(null);


  useEffect(() => {
    if (genderQuery === 'male') {
      setActiveTab('men');
    } else if (genderQuery === 'female') {
      setActiveTab('women');
    }
  }, [genderQuery]);
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DB_ID) throw new Error("Missing Env Variables");
       const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
          [
            Query.equal("status", ["منشور", "مقبول"]), 
            Query.limit(100), 
            Query.orderDesc("$createdAt")
          ] 
        );
        
        setRequests(response.documents);
      } catch (error: any) {
        setErrorMsg("حدث خطأ في جلب البيانات، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
 const filteredRequests = requests.filter(req => {
    // 1. فلتر الجنس (تبويب الرجال أو النساء)
    const matchesTab = activeTab === "men" 
      ? (req.type === "men" || req.type === "رجال" || req.type === "رجل" || req.type === "ذكر") 
      : (req.type === "women" || req.type === "نساء" || req.type === "أنثى" || req.type === "انثى");
    
    // 2. فلتر البحث النصي
    const matchesSearch = !searchQuery || req.request_id?.toString().includes(searchQuery) || req.city?.includes(searchQuery) || (req.bio && req.bio.includes(searchQuery));
    
    // 3. فلتر المدينة
    const matchesCity = !filterCity || req.city === filterCity || req.region === filterCity;
    
    // 🔥 4. فلتر العمر المرن (من - إلى) [التعديل الجديد]
    const matchesMinAge = !minAge || req.age >= parseInt(minAge);
    const matchesMaxAge = !maxAge || req.age <= parseInt(maxAge);
    
    // 🔥 5. فلتر الحالة الاجتماعية الذكي [التعديل الجديد]
    // يقبل التطابق التام، أو التطابق مع أصل الكلمة (أعزب/عزباء)
    const matchesSocialStatus = !filterSocialStatus || 
      req.social_status === filterSocialStatus || 
      (req.social_status && req.social_status.includes(filterSocialStatus.replace('ة', '').replace('اء', '')));
      
    // 6. فلتر نوع الزواج
const matchesMarriageType = !filterMarriageType || 
      req.marriage_type === filterMarriageType || 
      req.marriage_type === "أقبل الاثنين" || 
      filterMarriageType === "أقبل الاثنين";

    // إرجاع النتيجة التي تطابق جميع الشروط
    return matchesTab && matchesSearch && matchesCity && matchesMinAge && matchesMaxAge && matchesSocialStatus && matchesMarriageType;
  });

  useEffect(() => { setVisibleCount(10); }, [activeTab, searchQuery, filterCity, minAge, maxAge, filterSocialStatus, filterMarriageType]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + 10);
      }, { threshold: 0.1 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [observerTarget]);

  const hasActiveFilters = filterCity || minAge || maxAge || filterSocialStatus || filterMarriageType;
  const visibleRequests = filteredRequests.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-[#fcfaf6] font-sans antialiased pb-28" dir="rtl">
      
      <div className="bg-[#0f172a] pt-10 pb-20 px-4 relative shadow-lg">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        {/* تم التعديل هنا: استدعاء المكون الذكي بدلاً من الأكواد القديمة الثابتة */}
        <div className="relative z-[70] mb-8">
          <TopHeader 
            title="استكشف الطلبات" 
            subtitle="طلبات موثقة ومراجعة بعناية" 
            showLaurels={false} 
          />
        </div>        <div className="relative z-10 max-w-md mx-auto bg-[#1a233a] p-1.5 rounded-full flex items-center border border-slate-700/50">
          <button onClick={() => setActiveTab('women')} className={`flex-1 py-3 text-[13px] md:text-sm rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'women' ? "bg-[#0f172a] text-[#c29b57] font-bold shadow-md border border-[#c29b57]/20" : "text-white/70 font-medium hover:text-white"}`}>طلبات النساء <User size={16} /></button>
          <button onClick={() => setActiveTab('men')} className={`flex-1 py-3 text-[13px] md:text-sm rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'men' ? "bg-[#0f172a] text-[#c29b57] font-bold shadow-md border border-[#c29b57]/20" : "text-white/70 font-medium hover:text-white"}`}>طلبات الرجال <User size={16} /></button>
        </div>
      </div>

      <div className="bg-[#fcfaf6] rounded-t-[2.5rem] -mt-10 relative z-20 px-4 pt-8 max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto mt-2">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="البحث برقم الملف، المدينة، الكلمات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 bg-white rounded-xl border border-slate-200 pr-11 pl-4 text-[11px] md:text-sm shadow-sm focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all font-medium" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-colors relative ${showFilters || hasActiveFilters ? 'bg-[#0f172a] text-[#c29b57] border-[#0f172a]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              <Filter size={20} strokeWidth={1.5} />
              {hasActiveFilters && !showFilters && <span className="w-2 h-2 bg-[#c29b57] rounded-full animate-pulse absolute top-2.5 left-2.5"></span>}
            </button>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mt-3 pt-3 border-t border-slate-100' : 'max-h-0 opacity-0 m-0 p-0 border-none'}`}>
<select 
  value={filterCity} 
  onChange={(e) => setFilterCity(e.target.value)} 
  className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#c29b57] text-[#0f172a] font-bold shadow-sm"
>
  <option value="">جميع المدن</option>
  {saudiCities.map((city, idx) => (
    <option key={idx} value={city}>{city}</option>
  ))}
</select>            
            {/* فلتر العمر من وإلى */}
            <div className="flex gap-1 items-center bg-white border border-slate-200 rounded-xl px-2 shadow-sm h-[42px]">
              <input 
                type="number" 
                min="18"
                max="90"
                placeholder="من عمر" 
                className="w-full text-xs outline-none text-[#0f172a] font-bold text-center bg-transparent" 
                value={minAge} 
                onChange={(e) => setMinAge(e.target.value)} 
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '.') e.preventDefault(); }}
              />
              <span className="text-slate-300 text-xs">-</span>
              <input 
                type="number" 
                min="18"
                max="90"
                placeholder="إلى" 
                className="w-full text-xs outline-none text-[#0f172a] font-bold text-center bg-transparent" 
                value={maxAge} 
                onChange={(e) => setMaxAge(e.target.value)} 
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '.') e.preventDefault(); }}
              />
            </div>
            {/* فلتر الحالة الاجتماعية الديناميكي */}
            <select value={filterSocialStatus} onChange={(e) => setFilterSocialStatus(e.target.value)} className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#c29b57] text-[#0f172a] font-bold shadow-sm">
              <option value="">الحالة</option>
              {activeTab === 'women' ? (
                <>
                  <option value="عزباء">عزباء</option>
                  <option value="مطلقة">مطلقة</option>
                  <option value="أرملة">أرملة</option>
                </>
              ) : (
                <>
                  <option value="أعزب">أعزب</option>
                  <option value="مطلق">مطلق</option>
                  <option value="أرمل">أرمل</option>
                  <option value="متزوج">متزوج</option>
                </>
              )}
            </select>

            {/* فلتر نوع الزواج */}
            <select value={filterMarriageType} onChange={(e) => setFilterMarriageType(e.target.value)} className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#c29b57] text-[#0f172a] font-bold shadow-sm">
              <option value="">نوع الزواج</option>
              <option value="معلن">معلن</option>
              <option value="مسيار">مسيار</option>
              <option value="أقبل الاثنين">أقبل الاثنين</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-slate-200/60 mb-6 max-w-3xl mx-auto mt-2">
          <span className="text-slate-500 text-[11px] md:text-xs font-semibold">نتائج البحث ({filteredRequests.length})</span>
          <div className="flex items-center gap-2 text-[#0f172a] text-[11px] md:text-xs font-bold cursor-pointer hover:text-[#c29b57]">
            ترتيب: الأحدث <SlidersHorizontal size={14} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#c29b57] animate-spin" /></div>
        ) : errorMsg ? (
          <div className="text-center py-10 text-red-500 font-bold">{errorMsg}</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">لا توجد طلبات مطابقة للبحث.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 max-w-5xl mx-auto">
            {visibleRequests.map((req) => {
              const isWomen = activeTab === "women";
              const avatarBg = isWomen ? "/women-card-bg.png" : "/men-card-bg.png"; 
              const genderText = isWomen ? "أنثى" : "ذكر";
              // العبارة الثابتة حسب الجنس
              const quote = isWomen 
                ? "تبحث عن شريك حياة جاد للاستقرار والزواج" 
                : "يسعى للزواج الجاد وتكوين أسرة مستقرة";

              return (
                <Link href={`/explore/${req.$id}`} key={req.$id} className="bg-white rounded-[1rem] md:rounded-[1.5rem] p-2 md:p-3 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group h-auto min-h-[140px] md:min-h-[180px]">
                  
                  <div className="flex justify-between items-center w-full mb-2 md:mb-3 px-0.5">
                    <span className="bg-[#dcb466] text-[#0f172a] text-[7px] md:text-[9px] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full flex items-center gap-0.5 md:gap-1 shadow-sm">
                      <ShieldCheck size={8} className="md:w-3 md:h-3" strokeWidth={2.5} /> <span className="hidden sm:inline">تم التحقق</span><span className="sm:hidden">موثق</span>
                    </span>
                    <span className="text-[8px] md:text-xs font-extrabold text-[#0f172a] tracking-wide" dir="ltr">
                      #{req.request_id || req.$id.substring(0,4)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-1.5 md:gap-3 flex-1">
                    
                    {/* قسم النصوص والبيانات */}
                    <div className="flex-1 flex flex-col justify-start px-0.5 overflow-hidden pt-1">
                      <h3 className="text-[11px] md:text-lg font-black text-[#0f172a] mb-1.5 md:mb-3 truncate">
                        {genderText} • {req.age} سنة
                      </h3>
                      
                      <div className="space-y-1 md:space-y-2 mb-2">
                        <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[11px] font-semibold text-slate-600 truncate">
                          <MapPin size={10} className="text-[#c29b57] shrink-0 md:w-3.5 md:h-3.5" /> <span className="truncate">{req.city || req.region || "غير محدد"}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[11px] font-semibold text-slate-600 truncate">
                          <RingIcon size={10} className="text-[#c29b57] shrink-0 md:w-3.5 md:h-3.5" /> <span className="truncate">{req.marriage_type || "زواج معلن"}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[11px] font-semibold text-slate-600 truncate">
                          <Heart size={10} className="text-[#c29b57] shrink-0 md:w-3.5 md:h-3.5" /> <span className="truncate">{req.social_status || "غير محدد"}</span>
                        </div>
                      </div>

                      {/* العبارة الثابتة */}
                      <div className="mt-auto pt-1 md:pt-2 border-t border-slate-100">
                        <p className="text-[7.5px] md:text-[10px] text-slate-500/80 font-medium italic leading-relaxed">
                          "{quote}"
                        </p>
                      </div>
                    </div>

                    {/* تكبير صورة الأفاتار */}
                    <div className="w-[75px] sm:w-[90px] md:w-[140px] h-[105px] md:h-[150px] rounded-t-full rounded-b-[0.8rem] md:rounded-b-2xl overflow-hidden relative shadow-inner bg-[#fdfaf4] border border-[#ebd9b4]/50 shrink-0">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90"
                        style={{ backgroundImage: `url('${avatarBg}')` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf6] via-transparent to-transparent"></div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && visibleCount < filteredRequests.length && (
          <div ref={observerTarget} className="flex justify-center py-8 mt-4">
            <Loader2 className="w-6 h-6 text-[#c29b57] animate-spin" />
          </div>
        )}

      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#c29b57] font-bold">جاري تحميل الطلبات...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
