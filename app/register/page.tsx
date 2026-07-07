// app/register/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, User, Lock, CheckCircle2, ChevronRight, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Image from "next/image";

const gulfCountries = {
  "السعودية": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران", "الطائف", "القصيم", "أبها", "خميس مشيط", "تبوك", "حائل", "جازان", "نجران", "الباحة", "الجبيل", "الأحساء", "ينبع"],
  "الإمارات": ["أبوظبي", "دبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  "الكويت": ["العاصمة", "حولي", "الفروانية", "مبارك الكبير", "الأحمدي", "الجهراء"],
  "قطر": ["الدوحة", "الريان", "الوكرة", "الخور", "الشمال"],
  "البحرين": ["العاصمة", "المحرق", "الشمالية", "الجنوبية"],
  "عمان": ["مسقط", "ظفار", "مسندم", "البريمي", "الداخلية", "شمال الباطنة", "جنوب الباطنة"]
};

const getDialCode = (countryName: string) => {
  const codes: Record<string, string> = { "السعودية": "+966", "الإمارات": "+971", "الكويت": "+965", "قطر": "+974", "البحرين": "+973", "عمان": "+968" };
  return codes[countryName] || "+966";
};

// 💡 أضفنا skin_color هنا واحتفظنا بالباقي لتجنب كسر الباك إند
const initialFormState = {
  first_name: "", age: "", nationality: "", country: "", region: "", social_status: "", has_children: "", children_count: "", education_level: "",
  job: "", wealth_level: "", housing_type: "", height: "", weight: "", smoking: "", skin_color: "", marriage_type: "", want_children: "", health_status: "",
  bio: "", requirements: "", notes: "", whatsapp_number: "", origin: "", tribe_name: "" 
};

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as "men" | "women" | null;

  const [formType, setFormType] = useState<"men" | "women" | null>(initialType);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    const isSubmitted = localStorage.getItem("mithaq_submitted");
    const savedReqId = localStorage.getItem("mithaq_req_id");
    if (isSubmitted === "true" && savedReqId) {
      setSuccess(true);
      setSubmittedId(savedReqId);
    } else {
      const savedData = localStorage.getItem("mithaq_form_data");
      const savedType = localStorage.getItem("mithaq_form_type");
      const savedStep = localStorage.getItem("mithaq_form_step");
      
      if (savedData) setFormData(JSON.parse(savedData));
      if (savedType) setFormType(savedType as "men" | "women");
      if (savedStep) setStep(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    if (formType) {
      localStorage.setItem("mithaq_form_data", JSON.stringify(formData));
      localStorage.setItem("mithaq_form_type", formType);
      localStorage.setItem("mithaq_form_step", step.toString());
    } else {
      // تنظيف الذاكرة فوراً عند الضغط على زر الرجوع
      localStorage.removeItem("mithaq_form_type");
      localStorage.removeItem("mithaq_form_step");
    }
  }, [formData, formType, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9+]/g, ''); 
    const dialCode = getDialCode(formData.country);
    if (val.startsWith(dialCode)) val = val.substring(dialCode.length);
    else if (val.startsWith(dialCode.replace('+', '00'))) val = val.substring(dialCode.length + 1);
    setFormData({ ...formData, whatsapp_number: val });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let cleanPhone = formData.whatsapp_number.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); 
      const isMyDevNumber = cleanPhone === "557745653"; // 👈 ضع رقمك الإماراتي هنا
      const internationalPhone = isMyDevNumber ? `+971${cleanPhone}` : `+966${cleanPhone}`;
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
      }

      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      const appVerifier = (window as any).recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, internationalPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpScreen(true);

    } catch (error: any) {
      console.error("Firebase SMS Error:", error);
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى التأكد من الرقم أو المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmationResult.confirm(otp);

      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const generatedRequestId = `MTQ-${randomNum}`;

      const isSingle = formData.social_status === "أعزب" || formData.social_status === "عزباء";
      const finalHasChildren = isSingle ? "لا يوجد" : formData.has_children;
      
      let finalPhoneNumber = formData.whatsapp_number;
      if (finalPhoneNumber.startsWith('0')) finalPhoneNumber = finalPhoneNumber.substring(1); 
      const isMyDevNumber = finalPhoneNumber === "557745653"; // 👈 ضع رقمك الإماراتي هنا
      const internationalPhone = isMyDevNumber ? `+971${finalPhoneNumber}` : `+966${finalPhoneNumber}`;
      const submitData = {
        request_id: generatedRequestId,
        type: formType,
        source: "الموقع",
        status: "قيد المراجعة",
        ...formData, // هذا السطر سيحمل skin_color الجديد تلقائياً
        whatsapp_number: internationalPhone, 
        age: parseInt(formData.age, 10) || null,
        height: parseInt(formData.height, 10) || null,
        weight: parseInt(formData.weight, 10) || null,
        has_children: finalHasChildren,
        children_count: finalHasChildren === "يوجد أبناء" ? parseInt(formData.children_count, 10) : null,
        tribe_name: formData.origin === "قبيلي" ? formData.tribe_name : null,
      };

      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || "حدث خطأ أثناء حفظ البيانات في السيرفر");
      }
      
      setSubmittedId(generatedRequestId);
      setSuccess(true);
      
      localStorage.setItem("mithaq_submitted", "true");
      localStorage.setItem("mithaq_req_id", generatedRequestId);

      window.dispatchEvent(new Event("profileCreated"));

    } catch (error: any) {
      console.error("Error verifying OTP or submitting:", error);
      alert(error.message.includes("auth/invalid-verification-code") 
        ? "رمز التحقق غير صحيح، يرجى المحاولة مجدداً." 
        : "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4" dir="rtl">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">تم استلام طلبك بنجاح</h2>
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 my-6">
            <p className="text-sm text-slate-500 mb-1">رقم الملف:</p>
            <p className="text-2xl font-bold text-[#c29b57]" dir="ltr">{submittedId}</p>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed text-sm font-medium">
            يرجى الاحتفاظ برقم الملف لمتابعة التحديثات مستقبلاً. سيتم مراجعة الطلب من الإدارة، وسنتواصل معك عند الحاجة عبر وسيلة التواصل الرسمية المعتمدة.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/" className="w-full bg-[#0f172a] text-white px-8 py-4 rounded-xl hover:bg-[#1e293b] transition font-bold block text-center">
               العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center py-10 px-4" dir="rtl">
      
      {!formType ? (
        <div className="max-w-4xl w-full text-center mt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-10">الرجاء اختيار نوع التسجيل للبدء</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* 💡 بطاقة النساء المحدثة بالصورة */}
            <button onClick={() => setFormType("women")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#c29b57] transition-all flex flex-col items-center group">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden relative border-4 border-slate-50 group-hover:scale-105 transition-transform duration-300">
                 <Image src="/women-card-bg.png" alt="تسجيل النساء" fill sizes="(max-width: 768px) 100vw, 33vw" priority className="object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل النساء</h3>
              <div className="bg-[#0f172a] text-white w-full py-4 rounded-xl font-bold mt-4 transition-colors group-hover:bg-[#c29b57]">ابدأ الآن</div>
            </button>
            {/* 💡 بطاقة الرجال المحدثة بالصورة */}
            <button onClick={() => setFormType("men")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#c29b57] transition-all flex flex-col items-center group">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden relative border-4 border-slate-50 group-hover:scale-105 transition-transform duration-300">
                 <Image src="/men-card-bg.png" alt="تسجيل الرجال" fill sizes="(max-width: 768px) 100vw, 33vw" priority className="object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل الرجال</h3>
              <div className="bg-[#c29b57] text-white w-full py-4 rounded-xl font-bold mt-4 transition-colors group-hover:bg-[#0f172a]">ابدأ الآن</div>
            </button>
          </div>
        </div>      ) : (
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="px-6 pt-8 pb-4 border-b border-[#f5f3f3] relative">
           {/* زر التراجع المطور */}
<button 
  type="button" 
  onClick={() => {
    if (step === 1) {
                        setFormType(null); // يرجع لشاشة اختيار الجنس
                        localStorage.removeItem("mithaq_form_type"); // تنظيف الذاكرة
                        localStorage.removeItem("mithaq_form_step");
                      } else {
                        prevStep(); // يرجع للخطوة السابقة في الاستمارة
                      }  }} 
  className="absolute top-8 right-6 text-slate-400 hover:text-rose-600 transition cursor-pointer z-10"
>
  <ChevronRight className="w-6 h-6" />
</button>            <h2 className="text-center text-lg font-bold text-[#0f172a] mb-6">التسجيل</h2>
            
            <div className="flex items-center justify-center max-w-sm mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#f5f3f3] -z-10 transform -translate-y-1/2"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 flex justify-center relative bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                    step === i ? "bg-[#c29b57] border-[#c29b57] text-white" : 
                    step > i ? "bg-[#0f172a] border-[#0f172a] text-white" : "bg-white border-[#e2e8f0] text-[#727974]"
                  }`}>
                    {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-10">
            {!showOtpScreen ? (
              <form onSubmit={step === 4 ? handlePhoneVerification : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                
                {/* 💡 الخطوة 1: البيانات الأساسية */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 1 من 4</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">البيانات الأساسية</h2>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الاسم الأول أو اسم مستعار <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="مثال: فهد، أم خالد..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">العمر</label>
                      <select name="age" value={formData.age} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-[#424844]">
                        <option value="">اختر عمرك</option>
                        {Array.from({ length: 53 }, (_, i) => i + 18).map(age => <option key={age} value={age}>{age}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الجنسية</label>
                      <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required placeholder="مثال: سعودي" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">دولة الإقامة</label>
                      <select name="country" value={formData.country} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-[#424844]">
                        <option value="">اختر دولة الإقامة</option>
                        {Object.keys(gulfCountries).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">المدينة / المنطقة</label>
                      <select name="region" value={formData.region} onChange={handleChange} required disabled={!formData.country} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-[#424844] disabled:opacity-50">
                        <option value="">اختر مدينتك أو منطقتك</option>
                        {formData.country && gulfCountries[formData.country as keyof typeof gulfCountries]?.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* 💡 الخطوة 2: معلومات الحالة (تم الترتيب حسب رغبة العميل) */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 2 من 4</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">معلومات الحالة</h2>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الحالة الاجتماعية</label>
                      <select name="social_status" value={formData.social_status} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر حالتك الاجتماعية</option>
                        {formType === "men" ? <><option>أعزب</option><option>مطلق</option><option>أرمل</option><option>متزوج</option></> : <><option>عزباء</option><option>مطلقة</option><option>أرملة</option></>}
                      </select>
                    </div>
                    
                    {formData.social_status && !(formData.social_status === "أعزب" || formData.social_status === "عزباء") && (
                      <div className="space-y-5 border-r-2 border-[#c29b57] pr-4 bg-yellow-50/30 p-4 rounded-xl">
                        <div>
                          <label className="block mb-2 text-sm font-bold text-[#0f172a]">الأبناء</label>
                          <select name="has_children" value={formData.has_children} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57]">
                            <option value="">هل يوجد أبناء؟</option><option>لا يوجد</option><option>يوجد أبناء</option>
                          </select>
                        </div>
                        {formData.has_children === "يوجد أبناء" && (
                          <div>
                            <label className="block mb-2 text-sm font-bold text-[#0f172a]">عدد الأبناء</label>
                            <input type="number" name="children_count" value={formData.children_count} onChange={handleChange} min="1" required placeholder="كم عدد الأبناء؟" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57]" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 1. التعليم */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-[#0f172a] mb-2">المستوى التعليمي</label>
        <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:border-[#c29b57] outline-none">
          <option value="">اختر المستوى التعليمي...</option>
          {["ابتدائي", "متوسط", "ثانوي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه", "أخرى", "أفضل عدم الإفصاح"].map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>                    <div className="mb-4">
        <label className="block text-sm font-bold text-[#0f172a] mb-2">الوظيفة</label>
        <select name="job" value={formData.job === "أخرى" ? "أخرى" : formData.job} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:border-[#c29b57] outline-none">
          <option value="">اختر الوظيفة...</option>
          {formType === 'women' ? (
            ["طالبة", "موظفة حكومية", "موظفة قطاع خاص", "عسكرية", "سيدة أعمال", "عمل حر", "متقاعدة", "باحثة عن عمل", "ربة منزل", "أخرى", "أفضل عدم الإفصاح"].map(j => <option key={j} value={j}>{j}</option>)
          ) : (
            ["طالب", "موظف حكومي", "موظف قطاع خاص", "عسكري", "رجل أعمال", "عمل حر", "متقاعد", "باحث عن عمل", "أخرى", "أفضل عدم الإفصاح"].map(j => <option key={j} value={j}>{j}</option>)
          )}
        </select>
        
        {/* 3. إظهار الإدخال النصي إذا اختار أخرى */}
        {formData.job === "أخرى" || (formData.job && !["طالب", "موظف حكومي", "موظف قطاع خاص", "عسكري", "رجل أعمال", "عمل حر", "متقاعد", "باحث عن عمل", "أخرى", "أفضل عدم الإفصاح", "طالبة", "موظفة حكومية", "موظفة قطاع خاص", "عسكرية", "سيدة أعمال", "متقاعدة", "باحثة عن عمل", "ربة منزل"].includes(formData.job)) ? (
          <input type="text" name="job" placeholder="يرجى كتابة المسمى الوظيفي" value={formData.job !== "أخرى" ? formData.job : ""} onChange={handleChange} className="w-full p-3 mt-3 border border-slate-200 rounded-xl bg-white focus:border-[#c29b57] outline-none" />
        ) : null}
      </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الطول (سم) <span className="text-slate-400 font-normal">(اختياري)</span></label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوزن (كجم) <span className="text-slate-400 font-normal">(اختياري)</span></label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">لون البشرة <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <select name="skin_color" value={formData.skin_color} onChange={handleChange} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">أفضل عدم الإفصاح</option>
                        <option value="أبيض">أبيض</option>
                        <option value="حنطي فاتح">حنطي فاتح</option>
                        <option value="حنطي">حنطي</option>
                        <option value="أسمر">أسمر</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">القبيلة / الأصل</label>
                      <select name="origin" value={formData.origin} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57] mb-3">
                        <option value="">اختر...</option><option value="قبيلي">قبيلي</option><option value="غير قبيلي">غير قبيلي</option><option value="أفضل عدم الإفصاح">أفضل عدم الإفصاح</option>
                      </select>
                      {formData.origin === "قبيلي" && (
                        <input type="text" name="tribe_name" value={formData.tribe_name} onChange={handleChange} placeholder="اسم القبيلة أو العائلة (اختياري)" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57] animate-in fade-in" />
                      )}
                    </div>
                  </div>
                )}

                {/* 💡 الخطوة 3: الطلب والتفضيلات */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 3 من 4</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">الطلب والتفضيلات</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">نوع الزواج المطلوب</label>
                        <select name="marriage_type" value={formData.marriage_type} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                          <option value="">اختر...</option><option>معلن</option><option>مسيار</option><option>أقبل الاثنين</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الرغبة بالإنجاب</label>
                        <select name="want_children" value={formData.want_children} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                          <option value="">اختر...</option><option>نعم</option><option>لا</option><option>حسب الاتفاق</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">نبذة مختصرة عنك</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={3} placeholder="عرف بنفسك بشكل مختصر، واذكر اهتماماتك أو ما تحب أن يعرفه الطرف الآخر عنك." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">
                        {formType === 'men' ? 'مواصفات الزوجة المطلوبة' : 'مواصفات الزوج المطلوب'}
                      </label>
                      <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows={3} placeholder="اذكر أهم المواصفات التي تبحث عنها مثل الأخلاق، الجدية، العمر، أو غيرها..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">تفضيلات إضافية <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="يمكنك إضافة أي شروط إضافية مثل الجنسية، المنطقة، القبيلة..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>

                    {/* رسالة الطمأنينة التي طلبها العميل */}
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-6 text-center">
                      <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-amber-800 mb-1">🔒 خصوصيتك تهمنا</p>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium">
                        يتم مراجعة جميع الملفات قبل نشرها. لا يتم نشر وسائل التواصل أو البيانات الشخصية. تُعرض نبذة مختصرة فقط، وتبقى بقية التفاصيل لدى إدارة المنصة لغرض التنسيق والمتابعة حفاظاً على خصوصيتك.
                      </p>
                    </div>
                  </div>
                )}

                {/* 💡 الخطوة 4: بيانات التواصل (لم يتم تغييرها) */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="text-center mb-6">
                      <p className="text-slate-500 text-xs mb-1">الخطوة 4 من 4</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">التحقق والتواصل</h2>
                      <Phone className="w-12 h-12 text-[#c29b57] mx-auto mt-4 opacity-80" />
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                      <p className="text-xs leading-relaxed text-blue-800 font-medium">
                        رقم الجوال محفوظ بسرية تامة، ويستخدم فقط للتحقق من جدية الطلب والتواصل المتعلق بملفك، ولن يتم نشره أو مشاركته مع أي طرف آخر.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a] text-center">رقم الجوال (للسعودية فقط حالياً)</label>
                      <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#c29b57] transition bg-white" dir="ltr">
                        <span className="inline-flex items-center px-4 bg-[#f8fafc] border-r border-slate-200 text-[#0f172a] font-bold text-sm">
                          +966 <span className="ml-2">🇸🇦</span>
                        </span>
                        <input 
                          type="tel" name="whatsapp_number" value={formData.whatsapp_number} onChange={handlePhoneChange} required placeholder="05XXXXXXXX"
                          className="flex-1 w-full p-4 bg-transparent text-[#0f172a] font-medium outline-none text-left" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 justify-center">
                      <input type="checkbox" required id="privacy" className="w-4 h-4 accent-[#0f172a]" />
                      <label htmlFor="privacy" className="text-sm font-bold text-[#0f172a]">أوافق على سياسة الخصوصية</label>
                    </div>
                    
                    <div id="recaptcha-container"></div>
                  </div>
                )}

                {/* أزرار التنقل */}
                <div className="flex gap-4 pt-6 mt-4">
                  
                  {/* زر "السابق" الذكي (بدون شرط الإخفاء) */}
                  <button 
                    type="button" 
                    onClick={() => {
                      if (step === 1) {
                        setFormType(null); // يرجع لشاشة اختيار الجنس
                        localStorage.removeItem("mithaq_form_type"); // تنظيف الذاكرة
                        localStorage.removeItem("mithaq_form_step");
                      } else {
                        prevStep(); // يرجع للخطوة السابقة في الاستمارة
                      }
                    }} 
                    className="px-6 py-4 rounded-xl font-bold text-[#0f172a] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition shadow-sm"
                  >
                    السابق
                  </button>

                  <button type="submit" disabled={loading} className="flex-1 py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1a3026] transition shadow-md flex justify-center items-center gap-2">
                    {loading ? "جاري المعالجة..." : (step === 4 ? "إرسال رمز التحقق" : "التالي")}
                  </button>
                  
                </div>              </form>
            ) : (
              // شاشة التحقق OTP (لم يتم تغييرها)
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in zoom-in-95 duration-300 text-center">
                <div className="text-center mb-8">
                  <ShieldCheck className="w-12 h-12 text-[#c29b57] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-[#0f172a] mb-2">إدخال رمز التحقق</h2>
                  <p className="text-[#424844] text-sm">تم إرسال رمز التحقق إلى: <span className="font-bold text-[#0f172a]" dir="ltr">{getDialCode(formData.country)} {formData.whatsapp_number}</span></p>
                </div>
                <div className="max-w-xs mx-auto mb-8">
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="------" required className="w-full text-center text-3xl tracking-[1em] font-bold border-b-2 border-[#e2e8f0] bg-transparent py-4 outline-none focus:border-[#c29b57] transition" dir="ltr" />
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1a3026] transition shadow-md">
                    {loading ? "جاري الاعتماد..." : "تحقق من الرمز"}
                  </button>
                  <button type="button" onClick={() => setShowOtpScreen(false)} disabled={loading} className="w-full py-4 rounded-xl font-bold text-[#0f172a] bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] transition">
                    السابق
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <div id="recaptcha-container" className="mt-4"></div>

    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-[#c29b57]">جاري التحميل...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
