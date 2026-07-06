// app/direct-register/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, CheckCircle2, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const initialFormState = {
  first_name: "", age: "", nationality: "", country: "", region: "", social_status: "", has_children: "", children_count: "", education_level: "",
  job: "", wealth_level: "", housing_type: "", height: "", weight: "", smoking: "", skin_color: "", marriage_type: "", want_children: "", health_status: "",
  bio: "", requirements: "", notes: "", whatsapp_number: "", origin: "", tribe_name: "" 
};

// رقم إدارة المنصة
const ADMIN_WHATSAPP_NUMBER = "966564767611"; 

function DirectRegisterContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as "men" | "women" | null;

  const [formType, setFormType] = useState<"men" | "women" | null>(initialType);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ خط الدفاع المطور: السماح بـ 3 طلبات كحد أقصى خلال 24 ساعة
    const historyStr = localStorage.getItem("mithaq_submit_history");
    let submitHistory: number[] = historyStr ? JSON.parse(historyStr) : [];
    const now = new Date().getTime();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // تنظيف السجل: نحتفظ فقط بالطلبات التي تمت خلال الـ 24 ساعة الماضية
    submitHistory = submitHistory.filter(timestamp => now - timestamp < TWENTY_FOUR_HOURS);

    if (submitHistory.length >= 3) {
      alert("عذراً، لقد استنفدت الحد المسموح به (3 طلبات). يرجى المحاولة بعد 24 ساعة.");
      return;
    }

    setLoading(true);

    try {
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const generatedRequestId = `MTQ-${randomNum}`;

      const isSingle = formData.social_status === "أعزب" || formData.social_status === "عزباء";
      const finalHasChildren = isSingle ? "لا يوجد" : formData.has_children;
      
      let cleanPhone = formData.whatsapp_number.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      const dialCode = getDialCode(formData.country);
      const internationalPhone = `${dialCode}${cleanPhone}`; 

      const submitData = {
        request_id: generatedRequestId,
        type: formType,
        source: "رابط مباشر", // تم التمييز هنا للإدارة
        status: "قيد المراجعة",
        ...formData,
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
      
      // 💾 حفظ وقت الإرسال الناجح في المتصفح لعداد الحماية الجديد
      submitHistory.push(now);
      localStorage.setItem("mithaq_submit_history", JSON.stringify(submitHistory));

      setSubmittedId(generatedRequestId);
      setSuccess(true);
      window.dispatchEvent(new Event("profileCreated"));

    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ غير متوقع أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    // رسالة واتساب قصيرة وبسيطة باسم "أم نواف"
    const whatsappMsg = encodeURIComponent(`السلام عليكم أم نواف، سجلت طلبي وهذا رقم الملف: ${submittedId}`);
    const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${whatsappMsg}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4" dir="rtl">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-200 text-center max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">تم تسجيل طلبك بنجاح</h2>
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 my-6">
            <p className="text-sm text-slate-500 mb-1">رقم الملف الخاص بك:</p>
            <p className="text-2xl font-bold text-[#c29b57]" dir="ltr">{submittedId}</p>
          </div>
          {/* النص هنا أصبح ودياً وشخصياً */}
          <p className="text-slate-600 mb-8 leading-relaxed text-sm font-medium">
            تم حفظ بياناتك بكل سرية وأمان. اضغط على الزر أدناه للتواصل معي عبر الواتساب لتأكيد طلبك ومتابعته.
          </p>
          <div className="flex flex-col gap-3">
            <a 
              href={whatsappLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white px-8 py-4 rounded-xl hover:bg-[#1ebd57] transition font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              إرسال الطلب عبر الواتساب
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans flex flex-col items-center py-10 px-4" dir="rtl">
      {!formType ? (
        <div className="max-w-4xl w-full text-center mt-10 animate-in fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-10">الرجاء اختيار نوع التسجيل للبدء</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            <button onClick={() => setFormType("women")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#c29b57] transition-all flex flex-col items-center group">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden relative border-4 border-slate-50 group-hover:scale-105 transition-transform duration-300">
                 <Image src="/women-card-bg.png" alt="تسجيل النساء" fill sizes="(max-width: 768px) 100vm, 33vm" priority className="object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل النساء</h3>
              <div className="bg-[#0f172a] text-white w-full py-4 rounded-xl font-bold mt-4 transition-colors group-hover:bg-[#c29b57]">ابدأ الآن</div>
            </button>

            <button onClick={() => setFormType("men")} className="bg-white rounded-[2rem] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#c29b57] transition-all flex flex-col items-center group">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden relative border-4 border-slate-50 group-hover:scale-105 transition-transform duration-300">
                 <Image src="/men-card-bg.png" alt="تسجيل الرجال" fill sizes="(max-width: 768px) 100vm, 33vm" priority className="object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-2">تسجيل الرجال</h3>
              <div className="bg-[#c29b57] text-white w-full py-4 rounded-xl font-bold mt-4 transition-colors group-hover:bg-[#0f172a]">ابدأ الآن</div>
            </button>

          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="px-6 pt-8 pb-4 border-b border-[#f5f3f3] relative">
            <h2 className="text-center text-lg font-bold text-[#0f172a] mb-6">تسجيل طلب جديد</h2>
            <div className="flex items-center justify-center max-w-sm mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#f5f3f3] -z-10 transform -translate-y-1/2"></div>
              {[1, 2, 3].map((i) => (
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
            <form onSubmit={step === 3 ? handleFinalSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
              
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-8">
                    <p className="text-[#727974] text-xs mb-1">الخطوة 1 من 3</p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">دولة الإقامة</label>
                      <select name="country" value={formData.country} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-[#424844]">
                        <option value="">اختر الدولة</option>
                        {Object.keys(gulfCountries).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">المدينة / المنطقة</label>
                      <select name="region" value={formData.region} onChange={handleChange} required disabled={!formData.country} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-[#424844] disabled:opacity-50">
                        <option value="">اختر المدينة</option>
                        {formData.country && gulfCountries[formData.country as keyof typeof gulfCountries]?.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold text-[#0f172a]">رقم واتساب للتواصل (بدون رمز الدولة)</label>
                    <div className="flex border border-[#e2e8f0] rounded-xl overflow-hidden focus-within:border-[#c29b57] transition bg-[#f8fafc]" dir="ltr">
                      <span className="inline-flex items-center px-4 bg-white border-r border-[#e2e8f0] text-[#0f172a] font-bold text-sm">
                        {getDialCode(formData.country)}
                      </span>
                      <input 
                        type="tel" name="whatsapp_number" value={formData.whatsapp_number} onChange={handlePhoneChange} required placeholder="مثال: 5XXXXXXXX"
                        className="flex-1 w-full p-4 bg-transparent text-[#0f172a] font-medium outline-none text-left" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-8">
                    <p className="text-[#727974] text-xs mb-1">الخطوة 2 من 3</p>
                    <h2 className="text-xl font-bold text-[#0f172a]">البيانات الشخصية</h2>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">المستوى التعليمي</label>
                      <select name="education_level" value={formData.education_level} onChange={handleChange} required className="w-full p-4 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] focus:border-[#c29b57] outline-none">
                        <option value="">اختر...</option>
                        {["ابتدائي", "متوسط", "ثانوي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه", "أخرى", "أفضل عدم الإفصاح"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوظيفة</label>
                      <select name="job" value={formData.job} onChange={handleChange} required className="w-full p-4 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] focus:border-[#c29b57] outline-none">
                        <option value="">اختر...</option>
                        {formType === 'women' ? (
                          ["طالبة", "موظفة حكومية", "موظفة قطاع خاص", "عسكرية", "سيدة أعمال", "عمل حر", "متقاعدة", "باحثة عن عمل", "ربة منزل", "أخرى", "أفضل عدم الإفصاح"].map(j => <option key={j} value={j}>{j}</option>)
                        ) : (
                          ["طالب", "موظف حكومي", "موظف قطاع خاص", "عسكري", "رجل أعمال", "عمل حر", "متقاعد", "باحث عن عمل", "أخرى", "أفضل عدم الإفصاح"].map(j => <option key={j} value={j}>{j}</option>)
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الطول (سم) <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="مثال: 170" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوزن (كجم) <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="مثال: 70" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">لون البشرة <span className="text-slate-400 font-normal">(اختياري)</span></label>
                      <select name="skin_color" value={formData.skin_color} onChange={handleChange} className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر...</option><option value="أبيض">أبيض</option><option value="حنطي فاتح">حنطي فاتح</option><option value="حنطي">حنطي</option><option value="أسمر">أسمر</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold text-[#0f172a]">القبيلة / الأصل</label>
                      <select name="origin" value={formData.origin} onChange={handleChange} required className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                        <option value="">اختر...</option><option value="قبيلي">قبيلي</option><option value="غير قبيلي">غير قبيلي</option><option value="أفضل عدم الإفصاح">أفضل عدم الإفصاح</option>
                      </select>
                    </div>
                  </div>
                  {formData.origin === "قبيلي" && (
                    <input type="text" name="tribe_name" value={formData.tribe_name} onChange={handleChange} placeholder="اسم القبيلة أو العائلة (اختياري)" className="w-full border border-[#e2e8f0] rounded-xl p-4 bg-[#f8fafc] outline-none focus:border-[#c29b57] animate-in fade-in" />
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-8">
                    <p className="text-[#727974] text-xs mb-1">الخطوة 3 من 3</p>
                    <h2 className="text-xl font-bold text-[#0f172a]">المواصفات المطلوبة</h2>
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

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-6 text-center">
                    <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-amber-800 mb-1">🔒 خصوصيتك تهمنا</p>
                    <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium">
يتم مراجعة جميع الملفات بسرية تامة. لا يتم نشر وسائل التواصل أو البيانات الشخصية، وتبقى التفاصيل محفوظة لغرض التنسيق والمتابعة حفاظاً على خصوصيتك.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 justify-center">
                    <input type="checkbox" required id="privacy" className="w-4 h-4 accent-[#0f172a]" />
                    <label htmlFor="privacy" className="text-sm font-bold text-[#0f172a]">أوافق على سياسة الخصوصية والشروط</label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-[#e2e8f0] mt-8">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-[#0f172a] border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition shadow-sm">
                    السابق
                  </button>
                )}
                <button type="submit" disabled={loading} className="flex-1 py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1a3026] transition shadow-md flex justify-center items-center gap-2">
                  {loading ? "جاري الإرسال..." : (step === 3 ? "تقديم الطلب" : "التالي")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DirectRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-[#c29b57]">جاري التحميل...</div>}>
      <DirectRegisterContent />
    </Suspense>
  );
}
