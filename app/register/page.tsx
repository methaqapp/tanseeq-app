// app/register/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, User, Lock, CheckCircle2, ChevronRight, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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

const initialFormState = {
  first_name: "", age: "", nationality: "", country: "", region: "", social_status: "", has_children: "", children_count: "", education_level: "",
  job: "", wealth_level: "", housing_type: "", height: "", weight: "", smoking: "", marriage_type: "", want_children: "", health_status: "",
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
  
  // 💡 إضافة State جديد لحفظ جلسة التحقق من Firebase
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

  //  إرسال الرقم إلى Firebase
  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let cleanPhone = formData.whatsapp_number.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1); 
      const internationalPhone = `${getDialCode(formData.country)}${cleanPhone}`;

      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      }
      const appVerifier = (window as any).recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, internationalPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpScreen(true);

    } catch (error: any) {
      console.error("Firebase SMS Error:", error);
      if ((window as any).recaptchaVerifier) {
         (window as any).recaptchaVerifier.clear();
         (window as any).recaptchaVerifier = null;
      }
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى التأكد من الرقم أو المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  //  التحقق من الكود وحفظ البيانات
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. التحقق من الكود المدخل مع Firebase
      await confirmationResult.confirm(otp);

      // 2. تجهيز البيانات
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const generatedRequestId = `MTQ-${randomNum}`;

      const isSingle = formData.social_status === "أعزب" || formData.social_status === "عزباء";
      const finalHasChildren = isSingle ? "لا يوجد" : formData.has_children;
      
      let finalPhoneNumber = formData.whatsapp_number;
      if (finalPhoneNumber.startsWith('0')) finalPhoneNumber = finalPhoneNumber.substring(1); 
      const internationalPhone = `${getDialCode(formData.country)}${finalPhoneNumber}`;

      const submitData = {
        request_id: generatedRequestId,
        type: formType,
        source: "الموقع",
        status: "قيد المراجعة",
        ...formData,
        whatsapp_number: internationalPhone, 
        age: parseInt(formData.age, 10) || null,
        height: parseInt(formData.height, 10) || null,
        weight: parseInt(formData.weight, 10) || null,
        has_children: finalHasChildren,
        children_count: finalHasChildren === "يوجد أبناء" ? parseInt(formData.children_count, 10) : null,
        housing_type: formType === "men" ? formData.housing_type : null,
        tribe_name: formData.origin === "قبلي" ? formData.tribe_name : null,
      };

      // 3.  هنا التغيير الجذري: نرسل البيانات للـ API الآمن الخاص بنا
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || "حدث خطأ أثناء حفظ البيانات في السيرفر");
      }
      
      // 4. إكمال خطوات النجاح وحفظ الجلسة
      setSubmittedId(generatedRequestId);
      setSuccess(true);

    } catch (error: any) {
      console.error("Error verifying OTP or submitting:", error);
      // إظهار رسالة خطأ دقيقة للمستخدم
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
            <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition font-bold flex items-center justify-center gap-2">
              <Phone size={18} /> تواصل مع الدعم
            </a>
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
            <button onClick={() => setFormType("women")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
              <div className="w-28 h-28 bg-[#c29b57] rounded-full flex items-center justify-center mb-8"><span className="material-symbols-outlined text-white text-5xl">face_3</span></div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل النساء</h3>
              <div className="bg-[#0f172a] text-white w-full py-4 rounded-xl font-bold mt-4">ابدأ الآن</div>
            </button>
            <button onClick={() => setFormType("men")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
              <div className="w-28 h-28 bg-[#0f172a] rounded-full flex items-center justify-center mb-8"><span className="material-symbols-outlined text-[#c29b57] text-5xl">person</span></div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل الرجال</h3>
              <div className="bg-[#c29b57] text-white w-full py-4 rounded-xl font-bold mt-4">ابدأ الآن</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="px-6 pt-8 pb-4 border-b border-[#f5f3f3] relative">
            <Link href="/" className="absolute top-8 right-6 text-slate-400 hover:text-[#0f172a] transition">
              <ChevronRight className="w-6 h-6" />
            </Link>
            <h2 className="text-center text-lg font-bold text-[#0f172a] mb-6">التسجيل</h2>
            
            <div className="flex items-center justify-center max-w-sm mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#f5f3f3] -z-10 transform -translate-y-1/2"></div>
              {[1, 2, 3, 4, 5].map((i) => (
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
                
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 1 من 5</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">المعلومات الأساسية</h2>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الاسم الأول أو المستعار <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="مثال: أبو محمد، أم خالد..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
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
                      <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required placeholder="اكتب جنسيتك" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
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

                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 2 من 5</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">البيانات العامة</h2>
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

                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">المستوى التعليمي</label>
                      <select name="education_level" value={formData.education_level} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر مستواك التعليمي</option><option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>دكتوراه</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوظيفة</label>
                      <input type="text" name="job" value={formData.job} onChange={handleChange} required placeholder="اختر وظيفتك" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الحالة المادية</label>
                      <select name="wealth_level" value={formData.wealth_level} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر حالتك المادية</option><option>بسيط</option><option>متوسط</option><option>جيد</option><option>ممتاز</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الرغبة في الإنجاب</label>
                      <select name="want_children" value={formData.want_children} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر رغبتك</option><option>نعم</option><option>لا</option><option>يناقش لاحقاً</option>
                      </select>
                    </div>

                    {formType === "men" && (
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">نوع السكن</label>
                        <select name="housing_type" value={formData.housing_type} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                          <option value="">اختر نوع السكن</option><option>سكن مستقل</option><option>مع العائلة</option><option>أخرى</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">التدخين</label>
                      <select name="smoking" value={formData.smoking} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر موقفك من التدخين</option><option>لا أدخن</option><option>أدخن</option><option>شيشة / إلكتروني</option>
                      </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الطول (سم)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                      </div>
                      <div className="w-1/2">
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوزن (كجم)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                      <p className="text-[#727974] text-xs mb-1">الخطوة 3 من 5</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">نبذة ومواصفات الطرف الآخر</h2>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">نوع الزواج المطلوب</label>
                      <select name="marriage_type" value={formData.marriage_type} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر نوع الزواج</option><option>معلن</option><option>مسيار</option><option>لا يوجد تفضيل</option>
                      </select>
                    </div>
                    
                    <div className="space-y-5 border-r-2 border-[#c29b57] pr-4 bg-yellow-50/30 p-4 rounded-xl">
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الأصل</label>
                        <select name="origin" value={formData.origin} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57]">
                          <option value="">اختر...</option><option>قبلي</option><option>غير قبلي</option><option>لا يهم</option>
                        </select>
                      </div>
                      {formData.origin === "قبلي" && (
                        <div>
                          <label className="block mb-2 text-sm font-bold text-[#0f172a]">اسم القبيلة <span className="text-slate-400 font-normal">(اختياري)</span></label>
                          <input type="text" name="tribe_name" value={formData.tribe_name} onChange={handleChange} placeholder="اكتب اسم القبيلة" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-white outline-none focus:border-[#c29b57]" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">نبذة عنك</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={4} placeholder="اكتب نبذة مختصرة عنك..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">مواصفات الطرف الآخر</label>
                      <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows={4} placeholder="المواصفات المطلوبة..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الحالة الصحية</label>
                      <input type="text" name="health_status" value={formData.health_status} onChange={handleChange} required placeholder="مثال: سليم ولله الحمد..." className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">ملاحظات إضافية <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="text-center mb-6">
                      <p className="text-slate-500 text-xs mb-1">الخطوة 4 من 5</p>
                      <h2 className="text-xl font-bold text-[#0f172a]">التحقق والتواصل</h2>
                      <Phone className="w-12 h-12 text-[#c29b57] mx-auto mt-4 opacity-80" />
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                      <p className="text-xs leading-relaxed text-blue-800 font-medium">
                        رقم الجوال محفوظ بسرية تامة، ويستخدم فقط للتحقق من جدية الطلب والتواصل المتعلق بملفك، ولن يتم نشره أو مشاركته مع أي طرف آخر.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a] text-center">رقم الجوال</label>
                      <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#c29b57] transition bg-white" dir="ltr">
                        <span className="inline-flex items-center px-4 bg-[#f8fafc] border-r border-slate-200 text-[#0f172a] font-bold text-sm">
                          {formData.country ? getDialCode(formData.country) : "+966"} <span className="mr-2">🇸🇦</span>
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
                    
                    {/* 💡 حاوية ريكابتشا مخفية مهمة جداً لـ Firebase */}
                    <div id="recaptcha-container"></div>
                  </div>
                )}
                <div className="flex gap-4 pt-6 mt-4">
                  {step > 1 && (
                    <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-[#0f172a] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition">
                      السابق
                    </button>
                  )}

                  <button type="submit" disabled={loading} className="flex-1 py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1a3026] transition shadow-md flex justify-center items-center gap-2">
                    {loading ? "جاري الإرسال..." : (step === 4 ? "إرسال رمز التحقق" : "التالي")}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in zoom-in-95 duration-300 text-center">
                <div className="text-center mb-8">
                  <ShieldCheck className="w-12 h-12 text-[#c29b57] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-[#0f172a] mb-2">إدخال رمز التحقق</h2>
                  <p className="text-[#424844] text-sm">تم إرسال رمز التحقق إلى: <span className="font-bold text-[#0f172a]" dir="ltr">{getDialCode(formData.country)} {formData.whatsapp_number}</span></p>
                </div>
                <div className="max-w-xs mx-auto mb-8">
                  {/* 💡 تغيير طول الرمز إلى 6 لأن Firebase ترسل 6 أرقام */}
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
