// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Calendar, LogOut, Loader2, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import PlaceholderAvatar from "@/components/PlaceholderAvatar";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const gulfCountries = ["السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان"];

const getDialCode = (countryName: string) => {
  const codes: Record<string, string> = { "السعودية": "+966", "الإمارات": "+971", "الكويت": "+965", "قطر": "+974", "البحرين": "+973", "عمان": "+968" };
  return codes[countryName] || "+966";
};

export default function ProfilePage() {
  const router = useRouter();
  
  // حالات الصفحة
  const [viewState, setViewState] = useState<"checking" | "login_phone" | "login_otp" | "authenticated">("checking");
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // بيانات تسجيل الدخول
  const [loginCountry, setLoginCountry] = useState("السعودية");
  const [loginPhone, setLoginPhone] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    checkLocalSession();
  }, []);

  // 1. التحقق من وجود جلسة آمنة (عبر السيرفر والكوكيز)
  const checkLocalSession = async () => {
    setViewState("checking");
    try {
      const res = await fetch('/api/get-profile');
      const data = await res.json();
      
      if (data.success && data.user) {
        setRequest(data.user);
        setViewState("authenticated");
      } else {
        setViewState("login_phone");
      }
    } catch (err) {
      console.error("Session check error:", err);
      setViewState("login_phone");
    }
  };

  // 2. إرسال SMS للمستخدم العائد عبر Firebase
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let cleanPhone = loginPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); 
      const internationalPhone = `+966${cleanPhone}`;
      //const internationalPhone = `${getDialCode(loginCountry)}${cleanPhone}`;

      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      }
      const appVerifier = (window as any).recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, internationalPhone, appVerifier);
      setConfirmationResult(confirmation);
      setViewState("login_otp");

    } catch (err) {
      console.error(err);
      if ((window as any).recaptchaVerifier) {
         (window as any).recaptchaVerifier.clear();
         (window as any).recaptchaVerifier = null;
      }
      setError("فشل إرسال رسالة التحقق، تأكد من الرقم وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  // 3. التحقق من الـ OTP والبحث عبر السيرفر الآمن لتسجيل الدخول
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // التحقق من الرمز مع Firebase
      await confirmationResult.confirm(enteredOtp);

      // استدعاء السيرفر للبحث وزراعة الكوكيز
      let cleanPhone = loginPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); 
      const internationalPhone = `+966${cleanPhone}`;
      //for accpeting all GCC country phone numbers  const internationalPhone = `${getDialCode(loginCountry)}${cleanPhone}`;

      const res = await fetch('/api/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_number: internationalPhone }),
      });
      
      const data = await res.json();

      if (data.success && data.user) {
        setRequest(data.user);
        setViewState("authenticated");
      } else {
        setError("لا يوجد ملف مسجل برقم الجوال هذا. يرجى التأكد من الرقم أو إنشاء ملف جديد.");
        setViewState("login_phone");
      }
    } catch (err) {
      console.error(err);
      setError("رمز التحقق غير صحيح أو منتهي الصلاحية.");
    } finally {
      setLoading(false);
    }
  };

  // 4. تسجيل الخروج (مسح الكوكيز عبر السيرفر)
  const handleLogout = async () => {
    if (window.confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
      try {
        await fetch('/api/logout', { method: 'POST' });
        setRequest(null);
        setViewState("login_phone");
        setLoginPhone("");
        setEnteredOtp("");
      } catch (err) {
        console.error("Logout failed", err);
      }
    }
  };

  // ================= شاشات العرض ================= //

  if (viewState === "checking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 text-[#c29b57] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#0f172a]">جاري تحميل بياناتك...</h2>
      </div>
    );
  }

  // 1. شاشة الدخول - إدخال رقم الجوال
  if (viewState === "login_phone") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-16 px-4" dir="rtl">
        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-sm border border-slate-200 p-8 relative animate-in fade-in zoom-in-95 duration-300">
          <Link href="/" className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] transition">
             <ChevronRight className="w-6 h-6" />
          </Link>
          <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-6 mt-4 shadow-md">
            <User size={30} className="text-[#c29b57]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2 text-center">تسجيل الدخول لملفك</h2>
          <p className="text-slate-500 text-sm font-medium text-center mb-8">أدخل رقم الجوال الذي قمت بالتسجيل به للوصول إلى بياناتك.</p>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">{error}</div>}

          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-bold text-[#0f172a] text-center">رقم الجوال</label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#c29b57] transition bg-white" dir="ltr">
                <span className="inline-flex items-center px-4 bg-[#f8fafc] border-r border-slate-200 text-[#0f172a] font-bold text-sm">
                  +966 <span className="ml-2">🇸🇦</span>
                </span>
                <input 
                  type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} required placeholder="05XXXXXXXX"
                  className="flex-1 w-full p-4 bg-transparent text-[#0f172a] font-bold tracking-wider outline-none text-left" 
                />
              </div>            </div>
            <div id="recaptcha-container"></div>
            <button type="submit" disabled={loading} className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold hover:bg-[#1e293b] transition shadow-md flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال رمز الدخول"}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
             <p className="text-sm text-slate-500 mb-3 font-medium">ليس لديك ملف شخصي بعد؟</p>
             <Link href="/register" className="text-[#c29b57] font-bold text-base hover:underline">إنشاء ملف جديد الآن</Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. شاشة الدخول - إدخال رمز التحقق (OTP)
  if (viewState === "login_otp") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-16 px-4" dir="rtl">
        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-sm border border-slate-200 p-8 animate-in slide-in-from-left-8 duration-300">
          <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
             <ShieldCheck className="w-8 h-8 text-[#c29b57]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2 text-center">إدخال رمز التحقق</h2>
          <p className="text-slate-500 text-sm font-medium text-center mb-8">تم إرسال الرمز للرقم: <span dir="ltr" className="font-bold text-[#0f172a]">+966 {loginPhone}</span></p>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">{error}</div>}

          <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
            <div className="max-w-xs mx-auto mb-2">
              <input type="text" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} maxLength={6} placeholder="------" required className="w-full text-center text-3xl tracking-[1em] font-bold border-b-2 border-slate-200 bg-transparent py-4 outline-none focus:border-[#c29b57] transition text-[#0f172a]" dir="ltr" />
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button type="submit" disabled={loading} className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold hover:bg-[#1e293b] transition shadow-md flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تحقق من الرمز"}
              </button>
              <button type="button" onClick={() => setViewState("login_phone")} disabled={loading} className="w-full bg-white border border-slate-200 text-[#0f172a] py-4 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm">
                تعديل الرقم
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. شاشة الحساب الشخصي (إذا كان المستخدم مسجلاً)
  const isMen = request.type === "men" || request.type === "رجال" || request.gender === "ذكر";
  const statusColor = request.status === "منشور" || request.status === "مقبول" ? "bg-green-50 text-green-600 border-green-200" : 
                      request.status === "مرفوض" ? "bg-red-50 text-red-600 border-red-200" : 
                      "bg-yellow-50 text-yellow-600 border-yellow-200";

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-10 pt-4 md:pt-10 px-4 flex justify-center animate-in fade-in duration-500" dir="rtl">
      <div className="max-w-2xl w-full">
        
        <div className="flex justify-between items-center mb-6 px-2">
          <Link href="/" className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-[#0f172a] hover:bg-slate-50 transition">
            <ChevronRight size={20} />
          </Link>
          <span className="font-bold text-[#0f172a]">حسابي وطلبي</span>
          <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition" title="تسجيل الخروج">
            <LogOut size={20} />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-[#0f172a] pt-8 pb-16 px-6 text-center relative">
             <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full p-1.5 shadow-md border border-slate-100">
                <PlaceholderAvatar gender={isMen ? "men" : "women"} className="w-full h-full" />
             </div>
          </div>
          
          <div className="pt-14 pb-8 px-6 text-center border-b border-slate-50">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{request.first_name || "مستخدم ميثاق"}</h2>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1 text-slate-500"><MapPin size={14} className="text-[#c29b57]" /> {request.region || request.city}</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-[#0f172a]" dir="ltr"> {request.request_id} <User size={14} className="text-[#c29b57]" /></span>
            </div>
            
            <div className="mt-6 flex justify-center">
               <span className={`px-5 py-2 rounded-full text-xs font-bold border ${statusColor}`}>
                 حالة الطلب: {request.status || "قيد المراجعة"}
               </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              <FileText size={18} className="text-[#c29b57]" /> البيانات المسجلة
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div>
                <span className="block text-slate-400 text-xs mb-1.5">العمر</span>
                <span className="font-bold text-slate-700">{request.age} سنة</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs mb-1.5">الحالة الاجتماعية</span>
                <span className="font-bold text-slate-700">{request.social_status || "غير محدد"}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs mb-1.5">المهنة</span>
                <span className="font-bold text-slate-700">{request.job || "غير محدد"}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xs mb-1.5">نوع الزواج</span>
                <span className="font-bold text-slate-700">{request.marriage_type || "غير محدد"}</span>
              </div>
            </div>

            <h3 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#c29b57]" /> نبذتي
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
              {request.bio || "لم يتم كتابة نبذة."}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-4 border-t border-slate-100">
               <span className="flex items-center gap-1.5"><Calendar size={14} /> تاريخ التسجيل:</span>
               <span dir="ltr">{new Date(request.$createdAt).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        <button disabled className="w-full bg-white border border-slate-200 text-slate-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm cursor-not-allowed">
          تعديل البيانات (مغلق من قبل الإدارة)
        </button>

      </div>
    </div>
  );
}
