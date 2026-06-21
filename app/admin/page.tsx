// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

import { Loader2, Menu, Search, Check, AlertCircle, LayoutDashboard, Users, Settings, X } from "lucide-react";
import PlaceholderAvatar from "@/components/PlaceholderAvatar";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // جلب الطلبات من القاعدة (بدون تعليق التحميل)
  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DB_ID || !process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
        throw new Error("متغيرات البيئة غير مكتملة.");
      }

      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        [Query.limit(100)] 
      );
      
      const sortedDocs = response.documents.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
      setRequests(sortedDocs);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      setErrorMsg("حدث خطأ أثناء جلب البيانات. تأكد من إعدادات قاعدة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // دالة تغيير حالة الطلب
  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
        id,
        { status: newStatus }
      );
      setRequests(requests.map(req => req.$id === id ? { ...req, status: newStatus } : req));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("حدث خطأ أثناء التحديث.");
    } finally {
      setActionLoading(null);
    }
  };

  // فلترة الطلبات حسب التبويب والبحث
  const filteredRequests = requests.filter(req => {
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "pending" && (!req.status || req.status === "قيد المراجعة" || req.status === "pending")) ||
      (activeTab === "approved" && (req.status === "منشور" || req.status === "مقبول" || req.status === "approved")) ||
      (activeTab === "rejected" && (req.status === "مرفوض" || req.status === "rejected"));
    
    const matchesSearch = 
      req.request_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.$id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.region?.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="font-sans bg-[#fbf9f8] text-[#1b1c1c] antialiased flex min-h-screen" dir="rtl">
      
      {/* 1. القائمة الجانبية (Sidebar) */}
      <nav className={`fixed inset-y-0 right-0 z-40 w-64 bg-[#fbf9f8] border-l border-[#775a19]/30 p-6 space-y-2 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#051b12]">ميثاق</span>
            <p className="text-[11px] text-[#424844] mt-1 uppercase tracking-wider font-bold">الإدارة</p>
          </div>
          <button className="md:hidden text-[#424844]" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <ul className="flex flex-col space-y-2">
          <li>
            <a className="flex items-center gap-3 p-3 rounded text-[#424844] hover:bg-[#f5f3f3] transition-all" href="#">
              <LayoutDashboard size={20} />
              <span className="text-sm font-medium">نظرة عامة</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 p-3 rounded text-[#051b12] font-bold bg-[#fed488]/20 hover:bg-[#f5f3f3] transition-all" href="#">
              <Users size={20} />
              <span className="text-sm">دليل المستخدمين</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 p-3 rounded text-[#424844] hover:bg-[#f5f3f3] transition-all" href="#">
              <Settings size={20} />
              <span className="text-sm font-medium">إعدادات النظام</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* خلفية معتمة للجوال */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 2. منطقة المحتوى الرئيسية */}
      <main className="flex-1 flex flex-col md:mr-64 relative z-10 w-full min-h-screen max-w-5xl mx-auto">
        
        {/* الشريط العلوي (TopAppBar) */}
        <header className="w-full top-0 sticky bg-[#fbf9f8]/90 backdrop-blur-md border-b border-[#775a19]/30 z-20 flex justify-between items-center px-6 py-2 h-16">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#051b12] hover:opacity-70 transition-opacity" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#051b12] hidden md:block">دليل المستخدمين</h1>
            <h1 className="text-xl font-bold text-[#051b12] md:hidden">ميثاق</h1>
          </div>
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#775a19]/30 bg-[#e4e2e2] flex items-center justify-center">
              <span className="text-xs font-bold text-[#051b12]">مدير</span>
            </div>
          </div>
        </header>

        {/* مساحة العمل (Canvas) */}
        <div className="flex-1 p-6 md:p-10 pb-32">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#051b12] mb-2">إدارة الطلبات</h2>
              <p className="text-sm text-[#424844]">إدارة ومراجعة جميع الأعضاء في المنصة.</p>
            </div>
            
            {/* الفلاتر والبحث */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#424844]" size={18} />
                <input 
                  className="w-full bg-transparent border-b border-[#775a19]/30 focus:border-[#051b12] py-2 pr-10 pl-3 text-sm text-[#051b12] placeholder-[#424844]/50 focus:outline-none transition-colors" 
                  placeholder="البحث برقم الطلب أو الاسم..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap px-4 py-1.5 rounded-sm font-medium text-xs transition-colors ${activeTab === 'all' ? 'bg-[#051b12] text-white' : 'bg-transparent border border-[#775a19]/30 text-[#051b12] hover:bg-[#fed488]/10'}`}>الكل</button>
                <button onClick={() => setActiveTab('approved')} className={`whitespace-nowrap px-4 py-1.5 rounded-sm font-medium text-xs transition-colors ${activeTab === 'approved' ? 'bg-[#051b12] text-white' : 'bg-transparent border border-[#775a19]/30 text-[#051b12] hover:bg-[#fed488]/10'}`}>النشطة</button>
                <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap px-4 py-1.5 rounded-sm font-medium text-xs transition-colors ${activeTab === 'pending' ? 'bg-[#051b12] text-white' : 'bg-transparent border border-[#775a19]/30 text-[#051b12] hover:bg-[#fed488]/10'}`}>قيد المراجعة</button>
                <button onClick={() => setActiveTab('rejected')} className={`whitespace-nowrap px-4 py-1.5 rounded-sm font-medium text-xs transition-colors ${activeTab === 'rejected' ? 'bg-[#051b12] text-white' : 'bg-transparent border border-[#775a19]/30 text-[#051b12] hover:bg-[#fed488]/10'}`}>المرفوضة</button>
              </div>
            </div>
          </div>

          {/* قائمة المستخدمين (User List) */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#fbf9f8] border border-[#775a19]/30 rounded-lg">
              <Loader2 className="w-8 h-8 text-[#051b12] animate-spin mb-4" />
              <p className="text-[#424844] font-medium text-sm">جاري جلب البيانات...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#fbf9f8] border border-[#ba1a1a]/30 rounded-lg text-center px-4">
              <AlertCircle className="w-10 h-10 text-[#ba1a1a] mb-3" />
              <p className="text-[#ba1a1a] font-bold text-sm mb-1">خطأ في الاتصال</p>
              <p className="text-[#424844] text-xs">{errorMsg}</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-20 bg-[#fbf9f8] border border-[#775a19]/30 rounded-lg flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-[#e4e2e2] rounded-full flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-[#727974]" />
              </div>
              <h3 className="text-base font-bold text-[#051b12] mb-1">القائمة فارغة</h3>
              <p className="text-[#424844] text-xs">لا توجد ملفات تطابق بحثك حالياً.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div key={req.$id} className="bg-[#fbf9f8] border border-[#775a19]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f5f3f3] transition-colors group">
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-[#e4e2e2] flex-shrink-0">
                       <PlaceholderAvatar gender={req.type} className="w-full h-full border-none shadow-none" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#424844]" dir="ltr">
                          ID: {req.request_id || `#MTQ-${req.$id.substring(0,4)}`}
                        </span>
                        {req.status === 'منشور' || req.status === 'مقبول' ? (
                           <span className="px-2 py-0.5 rounded-sm bg-[#cfe9d9]/50 text-[#051b12] text-[10px] uppercase tracking-wider font-bold">نشط</span>
                        ) : req.status === 'مرفوض' ? (
                           <span className="px-2 py-0.5 rounded-sm bg-[#ffdad6] text-[#ba1a1a] text-[10px] uppercase tracking-wider font-bold">مرفوض</span>
                        ) : (
                           <span className="px-2 py-0.5 rounded-sm bg-[#fed488]/50 text-[#775a19] text-[10px] uppercase tracking-wider font-bold">قيد المراجعة</span>
                        )}
                      </div>
                      <h3 className="text-base text-[#051b12] font-bold mt-1">{req.name || 'مستخدم غير معروف'}</h3>
                      <p className="text-xs text-[#424844] mt-1">
                        تاريخ الانضمام: {new Date(req.$createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-1/3 border-t border-[#775a19]/10 sm:border-t-0 pt-3 sm:pt-0">
                     {actionLoading === req.$id ? (
                        <Loader2 className="w-5 h-5 text-[#051b12] animate-spin" />
                     ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                          {(!req.status || req.status === 'قيد المراجعة' || req.status === 'pending') && (
                            <>
                              <button onClick={() => updateStatus(req.$id, 'منشور')} className="flex-1 sm:flex-none px-4 py-2 bg-[#051b12] text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity">قبول</button>
                              <button onClick={() => updateStatus(req.$id, 'مرفوض')} className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-[#ba1a1a] text-[#ba1a1a] text-xs font-bold rounded-sm hover:bg-[#ffdad6] transition-colors">رفض</button>
                            </>
                          )}
                          {(req.status === 'منشور' || req.status === 'مرفوض' || req.status === 'مقبول') && (
                            <button onClick={() => updateStatus(req.$id, 'قيد المراجعة')} className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-[#775a19]/50 text-[#775a19] text-xs font-bold rounded-sm hover:bg-[#fed488]/20 transition-colors">تراجع للمراجعة</button>
                          )}
                        </div>
                     )}
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
