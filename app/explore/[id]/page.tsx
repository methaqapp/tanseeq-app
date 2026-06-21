// app/explore/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, MapPin, ShieldCheck, HeartHandshake, Info, Loader2 } from "lucide-react";
import PlaceholderAvatar from "@/components/PlaceholderAvatar";
import { databases } from "@/lib/appwrite";

export default function RequestDetails() {
  const params = useParams();
  const router = useRouter();
  const reqId = params.id as string; // استخراج الـ ID من الرابط

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // جلب بيانات الطلب الحقيقية من Appwrite
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

  // حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#1D2B4F]">جاري تحميل تفاصيل الطلب...</h2>
      </div>
    );
  }

  // حالة الخطأ أو الطلب غير موجود
  if (error || !request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <h2 className="text-xl font-bold text-[#1D2B4F] mb-4">الطلب غير موجود أو تم حذفه</h2>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#D4AF37] text-white rounded-full font-bold">العودة</button>
      </div>
    );
  }

  const isMen = request.type === "men" || request.type === "رجال";
  // تنسيق الأصل والقبيلة إذا كان قبلي
  const originDisplay = request.origin === "قبلي" && request.tribe_name 
    ? `قبلي (${request.tribe_name})` 
    : request.origin;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10 pt-4 md:pt-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full">
        
        {/* شريط التنقل العلوي للصفحة */}
        <div className="flex justify-between items-center mb-6 px-2">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1D2B4F] hover:bg-gray-50 transition">
            <ChevronRight size={20} />
          </button>
          <span className="font-bold text-[#1D2B4F]" dir="ltr">
            طلب {request.request_id || `#${request.$id.substring(0,5)}`}
          </span>
          <div className="w-10"></div> {/* مساحة فارغة لضبط التوسيط */}
        </div>

        {/* الكرت الرئيسي للمعلومات */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className={`h-24 ${isMen ? 'bg-[#1D2B4F]/10' : 'bg-[#D4AF37]/10'} flex items-center justify-center relative`}>
             <div className="absolute -bottom-10 w-20 h-20 bg-white rounded-full p-1.5 shadow-md">
                {/* استخدام المكون الموحد للأفاتار */}
                <PlaceholderAvatar gender={isMen ? "men" : "women"} className="w-full h-full" />
             </div>
          </div>
          
          <div className="pt-14 pb-8 px-6 text-center border-b border-gray-50">
            <h2 className="text-xl font-bold text-[#1D2B4F] mb-1">{request.age} سنة</h2>
            <div className="flex items-center justify-center text-sm text-gray-500 gap-2 font-medium">
              <MapPin size={14} className="text-[#D4AF37]" /> {request.region || request.country}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info size={18} className="text-[#D4AF37]" /> المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 text-sm">
              <div>
                <span className="block text-gray-400 text-xs mb-1">المستوى التعليمي</span>
                <span className="font-semibold text-gray-800">{request.education_level}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">المهنة</span>
                <span className="font-semibold text-gray-800">{request.job}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">الحالة الاجتماعية</span>
                <span className="font-semibold text-gray-800">{request.social_status}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">نوع الزواج</span>
                <span className="font-semibold text-gray-800">{request.marriage_type}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-gray-400 text-xs mb-1">القبيلة / الأصل</span>
                <span className="font-semibold text-gray-800">{originDisplay || "غير محدد"}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#D4AF37]" /> النبذة الشخصية
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl">
              {request.bio || "لا توجد نبذة مكتوبة."}
            </p>

            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HeartHandshake size={18} className="text-[#D4AF37]" /> مواصفات الشريك
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl">
              {request.requirements || "لم يتم تحديد مواصفات معينة."}
            </p>
          </div>
        </div>

        {/* رسالة التنبيه وزر التواصل */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-6 text-center">
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            المعلومات المعروضة هي جزء من البيانات المسموح بنشرها، أما بقية التفاصيل والاستفسارات فتتم عبر الوسائل الخاصة المعتمدة حفاظاً على خصوصية أصحاب الملفات.
          </p>
        </div>

        <a 
          href={`https://wa.me/966527585083?text=السلام عليكم، مهتم بفتح تواصل بخصوص الطلب رقم ${request.request_id || request.$id} وأرغب بمعرفة التفاصيل.`}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#1D2B4F] text-white py-4 rounded-xl font-bold hover:bg-[#15203b] transition-colors shadow-lg shadow-[#1D2B4F]/20 flex items-center justify-center gap-2 text-lg"
        >
          <HeartHandshake size={20} />
          طلب فتح تواصل
        </a>
        <p className="text-center text-xs text-gray-400 mt-4 mb-8">
          يتم التنسيق والترتيب عبر الوسائل المعتمدة من المنصة حفاظاً على الخصوصية والجدية.
        </p>

      </div>
    </div>
  );
}
