"use client";
import { useState } from "react";
import { databases, uniqueId } from "@/lib/appwrite";
import { ShieldCheck, User, Lock } from "lucide-react";

const gulfCountries = {
  "السعودية": ["الرياض", "مكة المكرمة", "المدينة المنورة", "المنطقة الشرقية", "القصيم", "عسير", "تبوك", "حائل", "جازان", "نجران", "الجوف", "الحدود الشمالية", "الباحة"],
  "الإمارات": ["أبوظبي", "دبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  "الكويت": ["العاصمة", "حولي", "الفروانية", "مبارك الكبير", "الأحمدي", "الجهراء"],
  "قطر": ["الدوحة", "الريان", "الوكرة", "الخور", "الشمال"],
  "البحرين": ["العاصمة", "المحرق", "الشمالية", "الجنوبية"],
  "عمان": ["مسقط", "ظفار", "مسندم", "البريمي", "الداخلية", "شمال الباطنة", "جنوب الباطنة"]
};

export default function Home() {
  const [formType, setFormType] = useState<"men" | "women" | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [hasChildren, setHasChildren] = useState("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    // @ts-ignore
    setRegions(gulfCountries[country] || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // توليد رقم الطلب (R-xxxx للرجال) و (F-xxxx للنساء)
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const generatedRequestId = formType === "men" ? `R-${randomNum}` : `F-${randomNum}`;

    const data = {
      request_id: generatedRequestId,
      type: formType,
      source: "الموقع",
      status: "قيد المراجعة", // سرية تامة كما طلب العميل
      first_name: formData.get("first_name") as string,
      age: parseInt(formData.get("age") as string, 10),
      nationality: formData.get("nationality") as string,
      country: selectedCountry,
      region: formData.get("region") as string,
      social_status: formData.get("social_status") as string,
      has_children: hasChildren,
      children_count: hasChildren === "يوجد أبناء" ? parseInt(formData.get("children_count") as string, 10) : null,
      education_level: formData.get("education_level") as string,
      job: formData.get("job") as string,
      wealth_level: formData.get("wealth_level") as string,
      height: parseInt(formData.get("height") as string, 10),
      weight: parseInt(formData.get("weight") as string, 10),
      smoking: formData.get("smoking") as string,
      health_status: formData.get("health_status") as string,
      housing_type: formType === "men" ? formData.get("housing_type") as string : null,
      marriage_type: formData.get("marriage_type") as string,
      want_children: formData.get("want_children") as string,
      whatsapp_number: formData.get("whatsapp_number") as string,
      bio: formData.get("bio") as string,
      requirements: formData.get("requirements") as string,
      notes: formData.get("notes") as string,
    };

    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
        uniqueId,
        data
      );
      setSubmittedId(generatedRequestId);
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("حدث خطأ، يرجى التأكد من الحقول.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border-t-4 border-yellow-500">
          <ShieldCheck className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">تم استلام طلبك بنجاح</h2>
          <p className="text-xl font-semibold text-slate-700 mb-6">رقم طلبك: <span className="text-yellow-600" dir="ltr">{submittedId}</span></p>
          <p className="text-slate-500 mb-8 leading-relaxed">
            بياناتك في أمان تام. سيقوم فريق الإدارة بمراجعة الطلب والتواصل معك عبر الواتساب لتأكيد التفاصيل قبل النشر بصيغة مختصرة.
          </p>
          <button onClick={() => {setSuccess(false); setFormType(null);}} className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-10 h-10 text-yellow-500" />
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">تنسيق</h1>
        </div>
        <p className="text-lg text-slate-600 font-medium">منصة التوافق والزواج الجاد داخل الخليج بسرية واحترافية</p>
      </div>

      <div className="max-w-3xl w-full">
        {!formType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* بطاقة الرجال */}
            <button onClick={() => setFormType("men")} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors">
                <User className="w-12 h-12 text-slate-400 group-hover:text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">تسجيل استمارة الرجال</h3>
              <p className="text-slate-500 text-center mb-8">سجل بياناتك للبحث عن شريكة حياة تناسبك بسرية تامة</p>
              <div className="bg-slate-900 text-white w-full py-4 rounded-xl font-medium group-hover:bg-yellow-500 transition-colors">
                تسجيل الآن
              </div>
            </button>

            {/* بطاقة النساء */}
            <button onClick={() => setFormType("women")} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col items-center">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-rose-600 transition-colors">
                <User className="w-12 h-12 text-rose-300 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-rose-900 mb-3">تسجيل استمارة النساء</h3>
              <p className="text-slate-500 text-center mb-8">سجلي بياناتك للبحث عن شريك حياة يناسبك بسرية تامة</p>
              <div className="bg-rose-600 text-white w-full py-4 rounded-xl font-medium group-hover:bg-rose-700 transition-colors">
                تسجيل الآن
              </div>
            </button>
          </div>
        ) : (
          
          /* نموذج التسجيل */
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className={`text-2xl font-bold ${formType === "men" ? "text-slate-900" : "text-rose-700"}`}>
                {formType === "men" ? "استمارة طلب زوجة" : "استمارة طلب زوج"}
              </h2>
              <button onClick={() => {setFormType(null); setHasChildren("");}} className="text-sm font-medium text-slate-400 hover:text-slate-700 bg-slate-100 px-4 py-2 rounded-lg transition">
                الرجوع
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* القسم 1: المعلومات الأساسية */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-yellow-600 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">1</span>
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4 border-r-2 border-slate-100">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الاسم الأول أو المستعار</label>
                    <input type="text" name="first_name" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">العمر</label>
                    <input type="number" name="age" min="18" max="99" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الجنسية</label>
                    <input type="text" name="nationality" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">دولة الإقامة</label>
                      <select required value={selectedCountry} onChange={handleCountryChange} className="w-full border border-slate-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                        <option value="">اختر الدولة...</option>
                        {Object.keys(gulfCountries).map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">المنطقة / المدينة</label>
                      <select name="region" required disabled={!selectedCountry} className="w-full border border-slate-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50">
                        <option value="">{selectedCountry ? "اختر المنطقة..." : "اختر الدولة أولاً"}</option>
                        {regions.map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* القسم 2: الحالة الاجتماعية والمادية */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-yellow-600 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">2</span>
                  الحالة الاجتماعية والمادية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pl-4 border-r-2 border-slate-100">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الحالة الاجتماعية</label>
                    <select name="social_status" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      {formType === "men" ? (
                        <><option>أعزب</option><option>مطلق</option><option>أرمل</option><option>متزوج ويرغب بالتعدد</option></>
                      ) : (
                        <><option>عزباء</option><option>مطلقة</option><option>أرملة</option></>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الأبناء</label>
                    <select value={hasChildren} onChange={(e) => setHasChildren(e.target.value)} required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option value="لا يوجد أبناء">لا يوجد أبناء</option>
                      <option value="يوجد أبناء">يوجد أبناء</option>
                    </select>
                  </div>
                  {hasChildren === "يوجد أبناء" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">عدد الأبناء</label>
                      <input type="number" name="children_count" min="1" max="20" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                    </div>
                  )}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">المستوى التعليمي</label>
                    <select name="education_level" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>دكتوراه</option><option>أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الوظيفة</label>
                    <select name="job" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      {formType === "men" ? (
                        <><option>موظف حكومي</option><option>موظف قطاع خاص</option><option>عسكري</option><option>أعمال حرة</option><option>متقاعد</option><option>أخرى</option></>
                      ) : (
                        <><option>موظفة</option><option>ربة منزل</option><option>طالبة</option><option>أعمال حرة</option><option>أخرى</option></>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">المستوى المادي</label>
                    <select name="wealth_level" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option>بسيط</option><option>متوسط</option><option>جيد</option><option>ممتاز</option><option>ميسور جدًا</option>
                    </select>
                  </div>
                  {formType === "men" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">نوع السكن</label>
                      <select name="housing_type" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                        <option value="">اختر...</option>
                        <option>سكن مستقل</option><option>مع العائلة</option><option>أخرى</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* القسم 3: المواصفات البدنية والزواج */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-yellow-600 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">3</span>
                  المواصفات وتفاصيل الزواج
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4 border-r-2 border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block mb-2 text-sm font-medium text-slate-700">الطول (سم)</label>
                      <input type="number" name="height" min="100" max="250" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                    </div>
                    <div className="w-1/2">
                      <label className="block mb-2 text-sm font-medium text-slate-700">الوزن (كجم)</label>
                      <input type="number" name="weight" min="30" max="200" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">التدخين</label>
                    <select name="smoking" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option>لا أدخن</option><option>أدخن</option><option>شيشة / إلكتروني</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">نوع الزواج المطلوب</label>
                    <select name="marriage_type" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option>معلن</option><option>مسيار</option><option>أقبل الاثنين</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الرغبة بالإنجاب</label>
                    <select name="want_children" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition">
                      <option value="">اختر...</option>
                      <option>نعم</option><option>لا</option><option>يناقش لاحقاً</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* القسم 4: النبذة والمواصفات الحرة */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-yellow-600 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">4</span>
                  التفاصيل والوصف
                </h3>
                <div className="space-y-5 pl-4 border-r-2 border-slate-100">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">الحالة الصحية (مفتوح)</label>
                    <input type="text" name="health_status" required className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" placeholder="مثال: سليم ولله الحمد، أو اذكر أي تفاصيل..." />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">نبذة مختصرة عنك</label>
                    <textarea name="bio" required rows={3} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" placeholder="تحدث عن نفسك، طباعك، وأسلوب حياتك..."></textarea>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">{formType === "men" ? "مواصفات الزوجة المطلوبة" : "مواصفات الزوج المطلوب"}</label>
                    <textarea name="requirements" required rows={3} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" placeholder="اكتب المواصفات التي تبحث عنها بحرية..."></textarea>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">ملاحظات إضافية (اختياري)</label>
                    <textarea name="notes" rows={2} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-yellow-500 transition" placeholder="أي معلومات تود إيصالها للإدارة فقط..."></textarea>
                  </div>
                </div>
              </div>

              {/* القسم 5: التواصل والخصوصية */}
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                <ShieldCheck className="absolute -left-10 -bottom-10 w-48 h-48 text-slate-800 opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-yellow-500">التواصل والخصوصية التامة</h3>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-slate-300">رقم الواتساب للتواصل (مع الرمز الدولي)</label>
                    <input type="tel" name="whatsapp_number" dir="ltr" placeholder="+966 5X XXX XXXX" required className="w-full md:w-1/2 border-none rounded-xl p-4 bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yellow-500 transition" />
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <Lock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong className="text-white block mb-1">خصوصيتك أمانة</strong>
                      جميع بياناتك كاملة تبقى خاصة وسرية لدى الإدارة فقط. ولا يتم عرض أي معلومات حساسة (الاسم، الرقم) للزوار، ويتم نشر معلومات مختصرة جداً فقط بعد مراجعة الإدارة وموافقتك حفاظاً على الخصوصية.
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full text-white py-5 rounded-2xl text-xl font-bold transition shadow-lg flex justify-center items-center gap-3 ${loading ? "bg-slate-400" : formType === "men" ? "bg-slate-900 hover:bg-slate-800" : "bg-rose-600 hover:bg-rose-700"}`}>
                {loading ? "جاري تشفير وإرسال الطلب..." : "إرسال الطلب للإدارة بسرية"}
                {!loading && <ShieldCheck className="w-6 h-6" />}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
