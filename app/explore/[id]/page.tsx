"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronRight, Share2, Copy, Calendar, Info, 
  User, MapPin, Flag, Users, GraduationCap, 
  Briefcase, FileText, Lock, ArrowRight, Loader2, AlertCircle 
} from "lucide-react";
import { databases } from "@/lib/appwrite";

// أيقونة الخاتم المخصصة (مضبوطة السماكة لتتطابق مع باقي الأيقونات)
const RingIcon = ({ size = 20, className = "", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 7.5L12 3l3.5 4.5h-7z" />
    <circle cx="12" cy="15" r="5.5" />
  </svg>
);

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const reqId = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reqId) return;

    const fetchRequestDetails = async () => {
      try {
        const doc = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
          reqId
        );
        setRequest(doc);
      } catch (err) {
        console.error("Error fetching request:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [reqId]);

  const handleCopy = () => {
    const idToCopy = request?.request_id || `MTQ-${request?.$id?.substring(0,4).toUpperCase()}`;
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfcf9]" dir="rtl">
        <Loader2 className="w-8 h-8 text-[#a47e33] animate-spin mb-4" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfcf9]" dir="rtl">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-6">الطلب غير موجود أو تم حذفه</h2>
        <button onClick={() => router.back()} className="px-8 py-3.5 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-[#16213b] transition">
          العودة للاستكشاف
        </button>
      </div>
    );
  }

  const isMen = request.type === "men" || request.type === "رجال" || request.gender === "ذكر";
  const avatarBg = isMen ? "/men-card-bg.png" : "/women-card-bg.png";
  const displayId = request.request_id || `MTQ-${request.$id.substring(0,4).toUpperCase()}`;
  const displayDate = new Date(request.$createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-[#fdfcf9] font-sans antialiased pb-12" dir="rtl">
      
      {/* 1. الشريط العلوي */}
      <header className="flex items-center justify-between px-5 py-6 bg-transparent">
        <button onClick={() => router.back()} className="text-slate-700 hover:bg-slate-100 p-2 rounded-full transition">
          <ChevronRight size={24} strokeWidth={2} />
        </button>
        <h1 className="text-base font-bold text-slate-800 tracking-wide">تفاصيل الطلب</h1>
        <button className="text-slate-700 hover:bg-slate-100 p-2 rounded-full transition">
          <Share2 size={20} strokeWidth={2} />
        </button>
      </header>

      <div className="max-w-md mx-auto px-5">
        
        {/* 2. الكرت العلوي (مطابق للتصميم الجديد) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex justify-between items-center mb-8">
          
          {/* الجانب الأيمن: الأفاتار */}
          <div className="w-[100px] h-[130px] bg-[#fcfaf6] rounded-t-full rounded-b-[1.5rem] overflow-hidden relative shadow-inner border border-[#ebd9b4]/30 shrink-0">
             <div 
               className="w-full h-full bg-cover bg-center"
               style={{ backgroundImage: `url('${avatarBg}')` }}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#fdfcf9]/30 via-transparent to-transparent"></div>
          </div>

          {/* الجانب الأيسر: المعرف والتاريخ */}
          <div className="flex flex-col items-end gap-4 flex-1 pl-2">
            <button 
              onClick={handleCopy}
              className="bg-[#fdfbf7] border border-[#ebd9b4]/60 text-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 hover:bg-[#f6f2e8] transition"
            >
              {copied ? <span className="text-emerald-600 text-[11px] font-bold">تم النسخ</span> : <Copy size={14} className="text-slate-400" strokeWidth={2} />}
              <span className="font-semibold text-xs tracking-wider" dir="ltr">{displayId}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Calendar size={14} strokeWidth={1.5} className="text-slate-400" /> النشر بتاريخ {displayDate}
            </div>
          </div>
          
        </div>

        {/* 3. المعلومات الأساسية */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 px-1">
            <Info size={20} className="text-[#a47e33]" strokeWidth={1.5} /> المعلومات الأساسية
          </h3>
          
          <div className="bg-white rounded-3xl px-5 py-2 shadow-sm border border-slate-100">
            <div className="flex flex-col divide-y divide-slate-100">
              
              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <User size={20} className="text-[#a47e33]" strokeWidth={1.5} /> العمر
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.age} سنة</span>
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <MapPin size={20} className="text-[#a47e33]" strokeWidth={1.5} /> المدينة
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.region || request.city || "غير محدد"}</span>
              </div>
              
              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Flag size={20} className="text-[#a47e33]" strokeWidth={1.5} /> الجنسية
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.nationality || "سعودي"}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Users size={20} className="text-[#a47e33]" strokeWidth={1.5} /> الحالة الاجتماعية
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.social_status || "غير محدد"}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <RingIcon size={20} className="text-[#a47e33]" strokeWidth={1.5} /> نوع الزواج
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.marriage_type || "معلن"}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <GraduationCap size={20} className="text-[#a47e33]" strokeWidth={1.5} /> المستوى التعليمي
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.education_level || "غير محدد"}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Briefcase size={20} className="text-[#a47e33]" strokeWidth={1.5} /> المهنة
                </span>
                <span className="font-semibold text-slate-700 text-sm">{request.job || "غير محدد"}</span>
              </div>

            </div>
          </div>
        </div>

        {/* 4. نبذة شخصية */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 px-1">
            <FileText size={20} className="text-[#a47e33]" strokeWidth={1.5} /> نبذة شخصية
          </h3>
          <div className="bg-[#fcfaf6] rounded-[1.5rem] p-6 border border-[#ebd9b4]/50">
            <p className="text-slate-600 text-sm leading-8 font-medium text-center">
              {request.bio || "أبحث عن الاستقرار وتكوين أسرة قائمة على المودة والاحترام. أسعى لبناء حياة أسرية سعيدة بإذن الله."}
            </p>
          </div>
        </div>

        {/* 5. صندوق الخصوصية الذهبي */}
        <div className="bg-[#fdf8f0] border border-[#f2e6d0] rounded-[1.2rem] p-5 flex items-center justify-center relative mb-8">
          <p className="text-[#a47e33] text-xs font-bold leading-relaxed text-center">
            بعض المعلومات محفوظة حفاظاً<br/>على خصوصية صاحب الطلب.
          </p>
          <Lock size={20} className="text-[#a47e33] absolute left-6" strokeWidth={1.5} />
        </div>

        {/* 6. الأزرار السفلية */}
        <div className="flex flex-col gap-3">
          <a 
            href={`https://wa.me/966565687511?text=السلام عليكم، مهتم بفتح تواصل بخصوص الطلب رقم ${displayId} وأرغب بمعرفة التفاصيل.`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold hover:bg-[#16213b] transition flex items-center justify-center gap-2 text-sm"
          >
            <Users size={20} strokeWidth={2} />
            طلب التنسيق
          </a>
          
          <button 
            onClick={() => router.back()}
            className="w-full bg-transparent border border-slate-300 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm"
          >
            <ArrowRight size={18} strokeWidth={2} /> 
            عودة إلى النتائج
          </button>
        </div>

      </div>
    </main>
  );
}
