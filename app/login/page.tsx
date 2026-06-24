"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 💡 الاتصال بالـ API الآمن الذي بنيناه بدلاً من Appwrite Client
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        // 💡 نستخدم window.location.href لعمل Refresh وتحديث الكوكيز للمتصفح
        window.location.href = "/admin";
      } else {
        setError(data.error || "بيانات الدخول غير صحيحة.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#fcfaf6] flex items-center justify-center p-4 font-sans pb-24" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl border border-slate-100 p-8">
        
        {/* اللوجو والعنوان */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck size={32} className="text-[#c29b57]" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a] mb-1">تسجيل الدخول</h1>
          <p className="text-slate-500 text-sm font-medium">الرجاء إدخال بيانات حسابك للمتابعة</p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-bold mb-6 text-center border border-rose-100">
            {error}
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pr-12 pl-4 text-sm focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all text-left font-medium"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pr-12 pl-4 text-sm focus:outline-none focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] transition-all text-left font-medium tracking-widest"
                dir="ltr"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-[#0f172a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#16213b] transition-colors shadow-md mt-4 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "تسجيل الدخول"}
          </button>
        </form>

      </div>
    </div>
  );
}
