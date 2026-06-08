"use client";
import { useState, useEffect } from "react";
import { databases, uniqueId } from "@/lib/appwrite";
import { 
  ShieldCheck, User, Lock, CheckCircle2, ChevronLeft, ChevronRight, 
  Phone, FileCheck, Users, Clock, FileText, ClipboardCheck, Search, Handshake, Headphones
} from "lucide-react";

// تصميم فروع الشجر الذهبية للبطاقات (تمت إزالتها من العنوان كما طلبت)
const LaurelSvg = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 30 C 10 20, 15 10, 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 17 22 C 14 18, 13 14, 18 12 C 21 16, 22 20, 17 22 Z" fill="currentColor" />
    <path d="M 12 30 C 8 26, 7 21, 12 18 C 15 22, 16 27, 12 30 Z" fill="currentColor" />
    <path d="M 24 14 C 21 10, 20 6, 26 4 C 29 8, 30 13, 24 14 Z" fill="currentColor" />
  </svg>
);

// تصميم أيقونة النساء
const FemaleAvatar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a5 5 0 0 0-5 5v2c0 1.5-1 3-2 4v7h14v-7c-1-1-2-2.5-2-4V7a5 5 0 0 0-5-5z" />
    <path d="M8.5 10a4 4 0 0 0 7 0" />
  </svg>
);

const gulfCountries = {
  "السعودية": ["الرياض", "مكة المكرمة", "المدينة المنورة", "المنطقة الشرقية", "القصيم", "عسير", "تبوك", "حائل", "جازان", "نجران", "الجوف", "الحدود الشمالية", "الباحة"],
  "الإمارات": ["أبوظبي", "دبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  "الكويت": ["العاصمة", "حولي", "الفروانية", "مبارك الكبير", "الأحمدي", "الجهراء"],
  "قطر": ["الدوحة", "الريان", "الوكرة", "الخور", "الشمال"],
  "البحرين": ["العاصمة", "المحرق", "الشمالية", "الجنوبية"],
  "عمان": ["مسقط", "ظفار", "مسندم", "البريمي", "الداخلية", "شمال الباطنة", "جنوب الباطنة"]
};

const getDialCode = (countryName: string) => {
  const codes: Record<string, string> = { 
    "السعودية": "+966", "الإمارات": "+971", "الكويت": "+965", 
    "قطر": "+974", "البحرين": "+973", "عمان": "+968" 
  };
  return codes[countryName] || "+966";
};

const initialFormState = {
  first_name: "", age: "", nationality: "", country: "", region: "",
  social_status: "", has_children: "", children_count: "", education_level: "",
  job: "", wealth_level: "", housing_type: "", height: "", weight: "",
  smoking: "", marriage_type: "", want_children: "", health_status: "",
  bio: "", requirements: "", notes: "", whatsapp_number: ""
};

export default function Home() {
  const [formType, setFormType] = useState<"men" | "women" | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);

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
      const savedOtpScreen = localStorage.getItem("mithaq_otp_screen");
      
      if (savedData) setFormData(JSON.parse(savedData));
      if (savedType) setFormType(savedType as "men" | "women");
      if (savedStep) setStep(parseInt(savedStep, 10));
      if (savedOtpScreen === "true") setShowOtpScreen(true);
    }
  }, []);

  useEffect(() => {
    if (formType) {
      localStorage.setItem("mithaq_form_data", JSON.stringify(formData));
      localStorage.setItem("mithaq_form_type", formType);
      localStorage.setItem("mithaq_form_step", step.toString());
      localStorage.setItem("mithaq_otp_screen", showOtpScreen.toString());
    }
  }, [formData, formType, step, showOtpScreen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9+]/g, ''); 
    const dialCode = getDialCode(formData.country);
    
    if (val.startsWith(dialCode)) {
      val = val.substring(dialCode.length);
    } else if (val.startsWith(dialCode.replace('+', '00'))) {
      val = val.substring(dialCode.length + 1);
    }
    
    setFormData({ ...formData, whatsapp_number: val });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handlePhoneVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpScreen(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "1234") {
      alert("رمز التحقق غير صحيح. (الرمز التجريبي هو 1234)");
      return;
    }

    setLoading(true);
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const generatedRequestId = `MTQ-${randomNum}`;

    const isSingle = formData.social_status === "أعزب" || formData.social_status === "عزباء";
    const finalHasChildren = isSingle ? "لا يوجد" : formData.has_children;
    const finalChildrenCount = finalHasChildren === "يوجد أبناء" ? parseInt(formData.children_count, 10) : null;

    let finalPhoneNumber = formData.whatsapp_number;
    if (finalPhoneNumber.startsWith('0')) {
      finalPhoneNumber = finalPhoneNumber.substring(1); 
    }
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
      children_count: finalChildrenCount,
      housing_type: formType === "men" ? formData.housing_type : null,
    };

    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
        uniqueId,
        submitData
      );
      
      localStorage.setItem("mithaq_submitted", "true");
      localStorage.setItem("mithaq_req_id", generatedRequestId);
      localStorage.removeItem("mithaq_form_data");
      localStorage.removeItem("mithaq_form_type");
      localStorage.removeItem("mithaq_form_step");
      localStorage.removeItem("mithaq_otp_screen");

      setSubmittedId(generatedRequestId);
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4" dir="rtl">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">تم استلام طلبك بنجاح</h2>
          <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4 my-6">
            <p className="text-sm text-slate-500 mb-1">رقم الطلب:</p>
            <p className="text-2xl font-bold text-[#c29b57]" dir="ltr">{submittedId}</p>
          </div>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm">
            سيتم مراجعة الطلب من الإدارة قبل الاعتماد والتواصل معك عند الحاجة.
          </p>
          
          <div className="flex flex-col gap-3">
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-[#0f172a] text-white px-8 py-4 rounded-xl hover:bg-[#1e293b] transition font-bold flex justify-center items-center gap-2">
               العودة للرئيسية
            </button>
            <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="w-full bg-white text-[#0f172a] border border-slate-200 px-8 py-4 rounded-xl hover:bg-slate-50 transition font-bold flex justify-center items-center gap-2">
               التواصل مع الإدارة
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isSingle = formData.social_status === "أعزب" || formData.social_status === "عزباء";

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans" dir="rtl">
      
      {!formType ? (
        <div className="w-full pb-10">
          
          {/* 1. الشريط العلوي (Top Bar) */}
          <div className="bg-[#0f172a] text-[#c29b57] text-xs md:text-sm py-2 px-4 flex justify-center items-center gap-2 border-b border-slate-800">
            <LaurelSvg className="w-4 h-4 hidden md:block" />
            <Lock className="w-3.5 h-3.5" />
            <span>جميع الطلبات تخضع للمراجعة والاعتماد قبل النشر حفاظاً على خصوصيتك</span>
            <LaurelSvg className="w-4 h-4 hidden md:block" flipped />
          </div>

          <div className="bg-[#0f172a] w-full rounded-b-[3rem] px-4 pt-10 pb-24 text-center relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c29b57] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <ShieldCheck className="w-20 h-20 text-[#c29b57] mx-auto mb-4" /> {/* الشعار */}
              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">ميثاق</h1>
              <p className="text-lg md:text-xl text-white font-medium mb-3">منصة موثوقة للتوافق والزواج الجاد داخل الخليج</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-[#c29b57] transform rotate-45"></div>
                <p className="text-[#c29b57] text-xs md:text-sm font-medium">بإشراف ومتابعة بشرية للحفاظ على الجدية والخصوصية</p>
                <div className="w-2 h-2 bg-[#c29b57] transform rotate-45"></div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
                <Lock className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">خصوصية وسرية كاملة</h3>
                <p className="text-slate-400 text-xs leading-relaxed">لا يتم نشر أي بيانات شخصية أو وسيلة تواصل</p>
              </div>
              <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
                <FileCheck className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">مراجعة واعتماد يدوي</h3>
                <p className="text-slate-400 text-xs leading-relaxed">جميع الطلبات يتم تدقيقها قبل الاعتماد</p>
              </div>
              <div className="bg-[#1e293b] rounded-3xl p-6 text-center border border-slate-700 shadow-xl">
                <Users className="w-10 h-10 text-[#c29b57] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">تنسيق احترافي</h3>
                <p className="text-slate-400 text-xs leading-relaxed">عبر الإدارة والخطابات المعتمدة بطريقة آمنة</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
            {/* تمت إزالة الأوراق من هنا كما طلبت */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">
              ماذا تبحث عن ؟
            </h2>
            <p className="text-slate-500 text-sm mb-10">اختر نوع التسجيل المناسب وسيتم توجيهك لخطوات التسجيل خلال دقائق</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              
              <button onClick={() => setFormType("women")} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
                <div className="w-28 h-28 bg-[#c29b57] rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                  <FemaleAvatar className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-2">أبحث عن زوج</h3>
                <p className="text-slate-500 text-sm mb-6">تسجيل امرأة ترغب في الزواج</p>
                <div className="flex items-center gap-2 text-xs text-[#c29b57] bg-yellow-50 px-5 py-2.5 rounded-full mb-8 font-medium">
                  <Clock className="w-4 h-4" /> التسجيل يستغرق أقل من دقيقتين
                </div>
                <div className="bg-[#c29b57] text-white w-full py-4 rounded-xl font-bold hover:bg-[#a8864a] transition-colors flex items-center justify-center gap-2 text-lg">
                  ابدأ الآن <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </div>
                <p className="mt-5 text-xs text-slate-400 font-medium">تسجيل النساء</p>
              </button>

              <button onClick={() => setFormType("men")} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center group">
                <div className="w-28 h-28 bg-[#0f172a] rounded-full flex items-center justify-center mb-8 relative shadow-inner">
                  <User className="w-12 h-12 text-[#c29b57]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-2">أبحث عن زوجة</h3>
                <p className="text-slate-500 text-sm mb-6">تسجيل رجل يرغب في الزواج</p>
                <div className="flex items-center gap-2 text-xs text-[#c29b57] bg-yellow-50 px-5 py-2.5 rounded-full mb-8 font-medium">
                  <Clock className="w-4 h-4" /> التسجيل يستغرق أقل من دقيقتين
                </div>
                <div className="bg-[#0f172a] text-white w-full py-4 rounded-xl font-bold hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 text-lg">
                  ابدأ الآن <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </div>
                <p className="mt-5 text-xs text-slate-400 font-medium">تسجيل الرجال</p>
              </button>

            </div>

            {/* 2. قسم (كيف تعمل المنصة ؟) */}
            <div className="mt-24 mb-16">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-[#c29b57] to-transparent"></div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">كيف تعمل المنصة ؟</h2>
                <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-[#c29b57] to-transparent"></div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">
                
                <div className="flex flex-col items-center text-center w-40">
                  <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">1</span>
                    <FileText className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] leading-relaxed">سجل بياناتك<br/>خلال دقائق</p>
                </div>

                <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

                <div className="flex flex-col items-center text-center w-40">
                  <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">2</span>
                    <ClipboardCheck className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] leading-relaxed">تتم مراجعة الطلب<br/>من الإدارة</p>
                </div>

                <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

                <div className="flex flex-col items-center text-center w-40">
                  <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#c29b57] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">3</span>
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] leading-relaxed">يتم البحث عن<br/>حالة مناسبة لك</p>
                </div>

                <ChevronLeft className="hidden md:block text-[#c29b57] opacity-50" />

                <div className="flex flex-col items-center text-center w-40">
                  <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mb-4 relative shadow-sm">
                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">4</span>
                    <Handshake className="w-8 h-8 text-[#0f172a]" />
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] leading-relaxed">يتم التنسيق والتواصل<br/>عند وجود توافق</p>
                </div>

              </div>
            </div>

            {/* 3. قسم (خصوصيتك أولويتنا) */}
            <div className="bg-[#faf7f2] rounded-3xl p-8 border border-[#eae0d1] flex flex-col md:flex-row items-center justify-between text-right gap-6 mb-8">
               <div>
                 <h3 className="font-bold text-[#0f172a] mb-2 text-lg">خصوصيتك أولويتنا</h3>
                 <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">لن يتم عرض رقم الجوال أو أي وسيلة تواصل للطرف الآخر. ويتم التنسيق فقط عبر إدارة المنصة حفاظاً على الخصوصية والأمان.</p>
               </div>
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eae0d1] flex-shrink-0">
                 <Lock className="w-10 h-10 text-[#c29b57]" />
               </div>
            </div>

            {/* 4. قسم الدعم والواتساب */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-md">
                 <div className="text-right">
                    <h4 className="text-white font-bold mb-2 text-lg">دعم ومتابعة</h4>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">فريق مختص لخدمتك والإجابة على جميع استفساراتك</p>
                 </div>
                 <Headphones className="w-12 h-12 text-[#c29b57]" />
              </div>

              <div className="bg-[#0f172a] rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-md">
                 <div className="text-right flex-1">
                    <h4 className="text-white font-bold mb-1 text-lg">تواصل معنا عبر واتساب</h4>
                    <p className="text-slate-400 text-xs mb-4">للرد على استفساراتك ومتابعة طلبك</p>
                    <a href="https://wa.me/966527585083" target="_blank" rel="noopener noreferrer" className="inline-block border border-[#c29b57] text-[#c29b57] hover:bg-[#c29b57] hover:text-white transition-colors px-6 py-2 rounded-xl text-xs font-bold">
                      تواصل عبر واتساب
                    </a>
                 </div>
                 <div className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                    {/* أيقونة واتساب بسيطة باستخدام SVG */}
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.666.598 1.216.774 1.388.86.173.086.275.072.376-.043.101-.115.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z" />
                    </svg>
                 </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-16">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 pt-8 pb-4 border-b border-slate-100 relative">
              <button onClick={() => {setFormType(null); setStep(1); setShowOtpScreen(false);}} className="absolute top-8 right-6 text-slate-400 hover:text-slate-700">
                <ChevronRight className="w-6 h-6" />
              </button>
              <h2 className="text-center text-lg font-bold text-[#0f172a] mb-6">التسجيل</h2>
              
              <div className="flex items-center justify-center max-w-sm mx-auto relative">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -z-10 transform -translate-y-1/2"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 flex justify-center relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                      step === i ? "bg-[#c29b57] border-[#c29b57] text-white" : 
                      step > i ? "bg-[#0f172a] border-[#0f172a] text-white" : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {!showOtpScreen ? (
                <form onSubmit={step === 4 ? handlePhoneVerification : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                  
                  {step === 1 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <div className="text-center mb-8">
                        <p className="text-slate-500 text-xs mb-1">الخطوة 1 من 5</p>
                        <h2 className="text-xl font-bold text-[#0f172a]">المعلومات الأساسية</h2>
                        <User className="w-12 h-12 text-[#c29b57] mx-auto mt-4 opacity-80" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الاسم الأول أو المستعار</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="اكتب اسمك..." className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">العمر</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} min="18" max="99" required placeholder="اختر عمرك" className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الجنسية</label>
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required placeholder="اكتب جنسيتك" className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">دولة الإقامة</label>
                        <select name="country" value={formData.country} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-slate-700">
                          <option value="">اختر دولة الإقامة</option>
                          {Object.keys(gulfCountries).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    <div>
  <label className="block mb-2 text-sm font-bold text-[#0f172a]">المدينة / المنطقة</label>
  <select 
    name="region" 
    value={formData.region} 
    onChange={handleChange} 
    required 
    disabled={!formData.country}
    className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] focus:bg-white focus:border-[#c29b57] outline-none transition text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <option value="">اختر مدينتك أو منطقتك</option>
    {formData.country && gulfCountries[formData.country as keyof typeof gulfCountries]?.map(city => (
      <option key={city} value={city}>{city}</option>
    ))}
  </select>
</div>                        </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <div className="text-center mb-8">
                        <p className="text-slate-500 text-xs mb-1">الخطوة 2 من 5</p>
                        <h2 className="text-xl font-bold text-[#0f172a]">البيانات العامة</h2>
                        <FileCheck className="w-12 h-12 text-[#c29b57] mx-auto mt-4 opacity-80" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الحالة الاجتماعية</label>
                        <select name="social_status" value={formData.social_status} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                          <option value="">اختر حالتك الاجتماعية</option>
                          {formType === "men" ? <><option>أعزب</option><option>مطلق</option><option>أرمل</option><option>متزوج</option></> : <><option>عزباء</option><option>مطلقة</option><option>أرملة</option></>}
                        </select>
                      </div>
                      
                      {formData.social_status && !isSingle && (
                        <div className="space-y-5 border-r-2 border-[#c29b57] pr-4 bg-yellow-50/30 p-4 rounded-xl">
                          <div>
                            <label className="block mb-2 text-sm font-bold text-[#0f172a]">الأبناء</label>
                            <select name="has_children" value={formData.has_children} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-white outline-none focus:border-[#c29b57]">
                              <option value="">هل يوجد أبناء؟</option><option>لا يوجد</option><option>يوجد أبناء</option>
                            </select>
                          </div>
                          {formData.has_children === "يوجد أبناء" && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                              <label className="block mb-2 text-sm font-bold text-[#0f172a]">عدد الأبناء</label>
                              <input type="number" name="children_count" value={formData.children_count} onChange={handleChange} min="1" required placeholder="كم عدد الأبناء؟" className="w-full border border-slate-200 rounded-xl p-3 bg-white outline-none focus:border-[#c29b57]" />
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">المستوى التعليمي</label>
                        <select name="education_level" value={formData.education_level} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
                          <option value="">اختر مستواك التعليمي</option><option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>دكتوراه</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوظيفة</label>
                        <input type="text" name="job" value={formData.job} onChange={handleChange} required placeholder="اختر وظيفتك" className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                      </div>
                        <div>
  <label className="block mb-2 text-sm font-bold text-[#0f172a]">الحالة المادية</label>
  <select name="wealth_level" value={formData.wealth_level} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
    <option value="">اختر حالتك المادية</option>
    <option>بسيط</option><option>متوسط</option><option>جيد</option><option>ممتاز</option>
  </select>
</div>

<div>
  <label className="block mb-2 text-sm font-bold text-[#0f172a]">الرغبة في الإنجاب</label>
  <select name="want_children" value={formData.want_children} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
    <option value="">اختر رغبتك</option>
    <option>نعم</option><option>لا</option><option>يناقش لاحقاً</option>
  </select>
</div>

{/* نوع السكن يظهر عادة في استمارة الرجال فقط بناءً على التصميم */}
{formType === "men" && (
  <div>
    <label className="block mb-2 text-sm font-bold text-[#0f172a]">نوع السكن</label>
    <select name="housing_type" value={formData.housing_type} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]">
      <option value="">اختر نوع السكن</option>
      <option>سكن مستقل</option><option>مع العائلة</option><option>أخرى</option>
    </select>
  </div>
)}
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block mb-2 text-sm font-bold text-[#0f172a]">الطول (سم)</label>
                          <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                        </div>
                        <div className="w-1/2">
                          <label className="block mb-2 text-sm font-bold text-[#0f172a]">الوزن (كجم)</label>
                          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <div className="text-center mb-8">
                        <p className="text-slate-500 text-xs mb-1">الخطوة 3 من 5</p>
                        <h2 className="text-xl font-bold text-[#0f172a]">نبذة ومواصفات الطرف الآخر</h2>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">نبذة عنك</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={4} placeholder="اكتب نبذة مختصرة عنك (مثال: رجل جاد أبحث عن الاستقرار وتكوين أسرة مستقرة...)" className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                        <div className="text-left text-xs text-slate-400 mt-1">{formData.bio.length}/500</div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a]">مواصفات الطرف الآخر</label>
                        <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows={4} placeholder="اكتب المواصفات التي تبحث عنها في الطرف الآخر (مثال: متدينة، متفهمة، ترغب في الاستقرار الأسري...)" className="w-full border border-slate-200 rounded-xl p-3 bg-[#f8fafc] outline-none focus:border-[#c29b57] resize-none" />
                        <div className="text-left text-xs text-slate-400 mt-1">{formData.requirements.length}/500</div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="text-center mb-8">
                        <p className="text-slate-500 text-xs mb-1">الخطوة 4 من 5</p>
                        <h2 className="text-xl font-bold text-[#0f172a]">التحقق والتواصل</h2>
                        <Phone className="w-12 h-12 text-[#c29b57] mx-auto mt-4 opacity-80" />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-bold text-[#0f172a] text-center">رقم الجوال</label>
                        <div className="flex border border-slate-300 rounded-xl overflow-hidden focus-within:border-[#c29b57] transition bg-white" dir="ltr">
                          <span className="inline-flex items-center px-4 bg-slate-50 border-r border-slate-300 text-slate-700 font-bold text-sm">
                            {formData.country ? getDialCode(formData.country) : "+966"} <span className="mr-2">🇸🇦</span>
                          </span>
                          <input 
                            type="tel" 
                            name="whatsapp_number" 
                            value={formData.whatsapp_number} 
                            onChange={handlePhoneChange}
                            required 
                            placeholder="05XXXXXXXX"
                            className="flex-1 w-full p-4 bg-transparent text-slate-900 font-medium outline-none text-left" 
                          />
                        </div>
                      </div>

                      <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 flex items-start gap-3 mt-4">
                        <ShieldCheck className="w-6 h-6 text-[#c29b57] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          يستخدم رقم الجوال للتحقق من ملكية الطلب والتواصل معك عند وجود حالة مناسبة. فقط. ولن يتم نشر رقمك أو مشاركته مع أي طرف.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-4 justify-center">
                        <input type="checkbox" required id="privacy" className="w-4 h-4 accent-[#0f172a]" />
                        <label htmlFor="privacy" className="text-sm font-bold text-[#0f172a]">أوافق على سياسة الخصوصية</label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6 mt-4">
                    {step > 1 && (
                      <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition">
                        السابق
                      </button>
                    )}
                    <button type="submit" className="flex-1 py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] transition shadow-md">
                      {step === 4 ? "إرسال رمز التحقق" : "التالي"}
                    </button>
                  </div>
                  <div className="text-center mt-4 text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> جميع البيانات سرية وآمنة
                  </div>
                </form>
              ) : (
                
                <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in zoom-in-95 duration-300 text-center">
                  <div className="text-center mb-8">
                    <ShieldCheck className="w-12 h-12 text-[#c29b57] mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-[#0f172a] mb-2">إدخال رمز التحقق</h2>
                    <p className="text-slate-500 text-sm">تم إرسال رمز التحقق إلى:</p>
                    <p className="font-bold text-[#0f172a] mt-1" dir="ltr">{getDialCode(formData.country)} {formData.whatsapp_number}</p>
                  </div>
                  
                  <div className="max-w-xs mx-auto mb-8">
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={4} 
                      placeholder="----" 
                      required
                      className="w-full text-center text-3xl tracking-[1em] font-bold border-b-2 border-slate-300 bg-transparent py-4 outline-none focus:border-[#c29b57] transition" 
                      dir="ltr"
                    />
                  </div>

                  <p className="text-sm text-slate-500 mb-6">
                    لم تصلك الرسالة؟ <br/>
                    <button type="button" className="text-[#c29b57] font-bold mt-1">إعادة إرسال الرمز (00:45)</button>
                  </p>

                  <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] transition shadow-md">
                      {loading ? "جاري الاعتماد..." : "تحقق من الرمز"}
                    </button>
                    <button type="button" onClick={() => setShowOtpScreen(false)} disabled={loading} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition">
                      السابق
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 5. الفوتر (Footer) يظهر في كل الصفحات */}
      <footer className="bg-[#0f172a] py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-white text-xs border-t border-slate-800 mt-auto">
         <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Lock className="w-4 h-4 text-[#c29b57]" />
            <span>جميع الحقوق محفوظة © 2026 ميثاق</span>
         </div>
         <div className="text-center md:text-left flex items-center gap-3">
            <div className="text-right">
               <span className="text-white font-bold text-sm block">ميثاق</span>
               <span className="text-slate-400">منصة موثوقة للتوافق والزواج الجاد داخل الخليج</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#c29b57]" />
         </div>
      </footer>

    </main>
  );
}
