// app/explore/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, GraduationCap, Briefcase, Filter, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import PlaceholderAvatar from "@/components/PlaceholderAvatar";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"women" | "men">("women");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DB_ID) throw new Error("Missing Env Variables");

        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
          [Query.limit(100)] 
        );
        
        // جلب الطلبات المنشورة فقط
        const approvedDocs = response.documents.filter(doc => doc.status === "منشور" || doc.status === "مقبول");
        setRequests(approvedDocs);
      } catch (error: any) {
        console.error("Error fetching requests:", error);
        setErrorMsg("حدث خطأ في جلب البيانات، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(req => req.type === activeTab || req.marriage_type === activeTab || (activeTab === 'men' ? req.type === 'رجال' : req.type === 'نساء'));

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f8] font-sans w-full pb-20 md:pb-10" dir="rtl">
      
      {/* 1. الهيدر الكحلي الفخم */}
      <div className="bg-[#051b12] pt-14 pb-28 px-6 text-center rounded-b-[2rem] relative shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10">استكشف الطلبات</h1>
        <p className="text-sm text-[#b3ccbe] relative z-10">تصفح الملفات المعتمدة بكل سرية وموثوقية</p>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 -mt-16 relative z-20">
        
        {/* 2. نظام التبويب (كما في صورتك) */}
        <div className="bg-white p-1.5 rounded-full shadow-md flex mb-8 border border-[#775a19]/10 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab("women")}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "women" ? "bg-[#cf9e46] text-white shadow-md" : "text-[#424844] hover:bg-[#f5f3f3]"}`}
          >
            طلبات النساء
          </button>
          <button 
            onClick={() => setActiveTab("men")}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === "men" ? "bg-[#cf9e46] text-white shadow-md" : "text-[#424844] hover:bg-[#f5f3f3]"}`}
          >
            طلبات الرجال
          </button>
        </div>

        {/* 3. شريط الفلاتر (مطابق لتصميمك) */}
        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#e4e2e2] mb-10">
          <div className="flex items-center gap-2 mb-4 text-[#051b12] font-bold text-sm px-1">
            <Filter size={18} className="text-[#775a19]" />
            <span>تصفية النتائج</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select className="bg-[#fbf9f8] border border-[#e4e2e2] text-sm rounded-xl px-4 py-3 outline-none focus:border-[#775a19] transition text-[#424844]">
              <option>المدينة...</option>
              <option>الرياض</option>
              <option>جدة</option>
            </select>
            <select className="bg-[#fbf9f8] border border-[#e4e2e2] text-sm rounded-xl px-4 py-3 outline-none focus:border-[#775a19] transition text-[#424844]">
              <option>العمر...</option>
              <option>20 - 30</option>
              <option>31 - 40</option>
            </select>
            <select className="bg-[#fbf9f8] border border-[#e4e2e2] text-sm rounded-xl px-4 py-3 outline-none focus:border-[#775a19] transition text-[#424844]">
              <option>الحالة الاجتماعية...</option>
              <option>أعزب / عزباء</option>
            </select>
            <select className="bg-[#fbf9f8] border border-[#e4e2e2] text-sm rounded-xl px-4 py-3 outline-none focus:border-[#775a19] transition text-[#424844]">
              <option>نوع الزواج...</option>
              <option>معلن</option>
              <option>مسيار</option>
            </select>
          </div>
        </div>

        {/* 4. عرض البطاقات */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#cf9e46] animate-spin mb-4" />
            <p className="text-[#424844] font-medium text-sm">جاري جلب الطلبات المعتمدة...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#ba1a1a]/20 shadow-sm text-center px-4">
            <AlertCircle className="w-12 h-12 text-[#ba1a1a] mb-4" />
            <p className="text-[#ba1a1a] font-bold mb-2">عذراً، لم نتمكن من جلب البيانات</p>
            <p className="text-[#424844] text-sm">{errorMsg}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e4e2e2] shadow-sm">
            <p className="text-[#424844] font-medium">لا توجد طلبات معتمدة في هذا القسم حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
              <div key={req.$id} className="bg-white border border-[#e4e2e2] rounded-[1.5rem] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                
                <div className="flex justify-between items-start mb-5 border-b border-[#f5f3f3] pb-5">
                  <div className="flex items-center gap-3">
                    <PlaceholderAvatar gender={activeTab} className="w-14 h-14" />
                    <div>
                      <h3 className="font-bold text-[#051b12] text-lg" dir="ltr">{req.request_id || `#MTQ-${req.$id.substring(0,4)}`}</h3>
                      <div className="flex items-center text-xs text-[#727974] mt-1 font-medium">
                        <MapPin size={12} className="ml-1 text-[#775a19]" /> {req.region || req.city} • {req.age} سنة
                      </div>
                    </div>
                  </div>
                  <span className="bg-[#f5f3f3] border border-[#e4e2e2] text-[#424844] text-[10px] font-bold px-3 py-1.5 rounded-full">
                    {req.marriage_type || req.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 mb-5 text-xs">
                  <div className="flex items-center text-[#424844] font-medium">
                    <GraduationCap size={16} className="ml-1.5 text-[#775a19]" /> {req.education_level || "غير محدد"}
                  </div>
                  <div className="flex items-center text-[#424844] font-medium">
                    <Briefcase size={16} className="ml-1.5 text-[#775a19]" /> {req.job || "غير محدد"}
                  </div>
                </div>

                <p className="text-sm text-[#727974] leading-relaxed mb-6 line-clamp-2 flex-1">
                  "{req.bio || "لا توجد نبذة مكتوبة حالياً في هذا الملف."}"
                </p>

                <Link href={`/explore/${req.$id}`} className="w-full py-3.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all shadow-sm bg-[#051b12] text-white hover:bg-[#1a3026]">
                  عرض التفاصيل <ChevronLeft size={16} />
                </Link>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
