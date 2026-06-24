"use client";

import { useEffect, useState } from "react";
import { Loader2, Menu, Heart, Search, CheckCircle2, AlertCircle, LayoutDashboard, Users, User, Settings, X, ShieldCheck, Clock, XCircle, Bell, ChevronLeft, Save, Eye, MapPin } from "lucide-react";
import PlaceholderAvatar from "@/components/PlaceholderAvatar";

const RingIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 7.5L12 3l3.5 4.5h-7z" />
    <circle cx="12" cy="15" r="5.5" />
  </svg>
);

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<"overview" | "users" | "settings">("users");

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // جلب البيانات مباشرة لأن Middleware قد تحقق من الهوية مسبقاً
  useEffect(() => {
    fetchRequests();
  }, []);

  // جلب الطلبات من الـ API الآمن (السيرفر)
  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      
      if (data.success) {
        setRequests(data.documents);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      setErrorMsg("حدث خطأ أثناء جلب البيانات. تأكد من إعدادات قاعدة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب عبر الـ API الآمن
  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, newStatus })
      });
      const data = await res.json();

      if (data.success) {
        setRequests(requests.map(req => req.$id === id ? { ...req, status: newStatus } : req));
        if (selectedUser && selectedUser.$id === id) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("حدث خطأ أثناء التحديث.");
    } finally {
      setActionLoading(null);
    }
  };

  // تسجيل الخروج الخاص بالإدارة
  const handleLogout = async () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/login';
      } catch (error) {
        console.error("Logout error", error);
      }
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "pending" && (!req.status || req.status === "قيد المراجعة" || req.status === "pending")) ||
      (activeTab === "approved" && (req.status === "منشور" || req.status === "مقبول" || req.status === "approved")) ||
      (activeTab === "rejected" && (req.status === "مرفوض" || req.status === "rejected"));
    
    const matchesSearch = 
      req.request_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.$id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.region?.includes(searchQuery) ||
      req.city?.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  const handleOpenDetails = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // ================= واجهة الإدارة الرئيسية =================

  return (
    <div className="font-sans bg-[#fcfaf6] text-[#0f172a] antialiased flex min-h-screen" dir="rtl">
      
      {/* القائمة الجانبية */}
      <nav className={`fixed inset-y-0 right-0 z-40 w-64 bg-[#0f172a] shadow-2xl flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-[#c29b57]/20 to-transparent pointer-events-none"></div>

        <div className="p-6 mb-4 flex justify-between items-center relative z-10 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              ميثاق <span className="bg-[#c29b57] text-[#0f172a] text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">Admin</span>
            </h2>
          </div>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col space-y-1.5 px-4 relative z-10 flex-1 mt-4">
          <li>
            <button 
              onClick={() => { setCurrentMenu("overview"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${currentMenu === "overview" ? "bg-[#c29b57] text-[#0f172a] font-bold shadow-md" : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm">نظرة عامة</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentMenu("users"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${currentMenu === "users" ? "bg-[#c29b57] text-[#0f172a] font-bold shadow-md" : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"}`}
            >
              <Users size={20} />
              <span className="text-sm">إدارة الطلبات</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setCurrentMenu("settings"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${currentMenu === "settings" ? "bg-[#c29b57] text-[#0f172a] font-bold shadow-md" : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"}`}
            >
              <Settings size={20} />
              <span className="text-sm">إعدادات النظام</span>
            </button>
          </li>
        </ul>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2 bg-white/5 py-2 rounded-lg">
            تسجيل الخروج
          </button>
          <p className="text-[10px] text-slate-500 font-medium text-center">نظام إدارة ميثاق V1.0</p>
        </div>
      </nav>

      {/* خلفية معتمة للجوال */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* منطقة المحتوى الرئيسية */}
      <main className="flex-1 flex flex-col md:mr-64 relative z-10 w-full min-h-screen">
        
        {/* الشريط العلوي */}
        <header className="w-full top-0 sticky bg-[#fcfaf6]/80 backdrop-blur-xl border-b border-slate-200 z-20 flex justify-between items-center px-4 md:px-8 py-3 h-16 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#0f172a] p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-extrabold text-[#0f172a]">
              {currentMenu === "overview" && "نظرة عامة والإحصائيات"}
              {currentMenu === "users" && "إدارة ومراجعة الطلبات"}
              {currentMenu === "settings" && "إعدادات النظام"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#c29b57] transition-colors shadow-sm">
              <Bell size={18} />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c29b57] bg-[#fdfaf4] flex items-center justify-center shadow-sm">
              <ShieldCheck size={18} className="text-[#c29b57]" />
            </div>
          </div>
        </header>

        {/* مساحة العمل */}
        <div className="flex-1 p-4 md:p-8 pb-32 max-w-6xl mx-auto w-full">
          
          {/* عرض: نظرة عامة */}
          {currentMenu === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!loading && !errorMsg ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8">
                    <div className="bg-[#0f172a] rounded-[1.5rem] p-5 shadow-lg border border-[#c29b57]/30 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -left-4 -bottom-4 opacity-5 text-white transform group-hover:scale-110 transition-transform"><Users size={100} /></div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-[#c29b57] text-[11px] md:text-sm font-bold">إجمالي المسجلين</span>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><Users size={14} className="text-white" /></div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white relative z-10 mt-2">{requests.length}</h3>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-emerald-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 text-[11px] md:text-sm font-bold leading-tight">الطلبات النشطة<br/>(منشور)</span>
                        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><CheckCircle2 size={16} className="text-emerald-500" /></div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mt-2">{requests.filter(r => r.status === 'منشور' || r.status === 'مقبول').length}</h3>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-amber-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 text-[11px] md:text-sm font-bold">قيد المراجعة</span>
                        <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Clock size={16} className="text-amber-500" /></div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mt-2">{requests.filter(r => !r.status || r.status === 'قيد المراجعة' || r.status === 'pending').length}</h3>
                    </div>

                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-rose-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 text-[11px] md:text-sm font-bold leading-tight">مرفوضة /<br/>محذوفة</span>
                        <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><XCircle size={16} className="text-rose-500" /></div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mt-2">{requests.filter(r => r.status === 'مرفوض' || r.status === 'rejected').length}</h3>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0f172a] mb-4">أحدث التسجيلات</h3>
                  <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                    {requests.slice(0, 5).map((req, index) => (
                      <div key={req.$id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer ${index !== 4 ? 'border-b border-slate-100' : ''}`} onClick={() => handleOpenDetails(req)}>
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><User size={16} className="text-slate-500"/></div>
                           <div>
                             <p className="text-sm font-bold text-[#0f172a]">{req.first_name || 'مستخدم غير معروف'}</p>
                             <p className="text-[10px] text-slate-500" dir="ltr">#{req.request_id || req.$id.substring(0,6)}</p>
                           </div>
                         </div>
                         <div className="text-left flex items-center gap-3">
                            <p className="text-xs font-bold text-slate-600">{new Date(req.$createdAt).toLocaleDateString('ar-EG')}</p>
                            <span className="text-[9px] text-[#c29b57] bg-[#c29b57]/10 px-2 py-0.5 rounded-sm">{req.status || "قيد المراجعة"}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                 <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#c29b57] animate-spin" /></div>
              )}
            </div>
          )}

          {/* عرض: إدارة الطلبات */}
          {currentMenu === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c29b57] focus:ring-1 focus:ring-[#c29b57] py-2.5 pr-11 pl-4 text-xs md:text-sm text-[#0f172a] outline-none transition-all" 
                    placeholder="البحث برقم الطلب أو الاسم..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'approved', label: 'النشطة' },
                    { id: 'pending', label: 'قيد المراجعة' },
                    { id: 'rejected', label: 'المرفوضة' }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)} 
                      className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${activeTab === tab.id ? 'bg-[#0f172a] text-white border border-[#0f172a]' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                  <Loader2 className="w-8 h-8 text-[#c29b57] animate-spin mb-4" />
                  <p className="text-slate-500 font-medium text-sm">جاري جلب البيانات...</p>
                </div>
              ) : errorMsg ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-red-100 rounded-[1.5rem] text-center px-4 shadow-sm">
                  <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                  <p className="text-red-600 font-bold text-sm mb-1">خطأ في الاتصال</p>
                  <p className="text-slate-500 text-xs">{errorMsg}</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">القائمة فارغة</h3>
                  <p className="text-slate-500 text-xs">لا توجد ملفات تطابق بحثك حالياً.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredRequests.map((req) => (
                    <div key={req.$id} className="bg-white border border-slate-100 p-4 md:p-5 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow group">
                      
                      <div className="flex items-center gap-3 md:gap-4 cursor-pointer flex-1" onClick={() => handleOpenDetails(req)}>
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden bg-[#fdfaf4] border border-[#ebd9b4] flex-shrink-0 shadow-inner">
                           <PlaceholderAvatar gender={req.type} className="w-full h-full" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-wide" dir="ltr">
                              #{req.request_id || req.$id.substring(0,4)}
                            </span>
                            {req.status === 'منشور' || req.status === 'مقبول' ? (
                               <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold border border-emerald-100">نشط</span>
                            ) : req.status === 'مرفوض' ? (
                               <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-bold border border-rose-100">مرفوض</span>
                            ) : (
                               <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold border border-amber-100">قيد المراجعة</span>
                            )}
                          </div>
                          <h3 className="text-sm md:text-base text-[#0f172a] font-extrabold">{req.first_name || 'مستخدم غير معروف'}</h3>
                          <p className="text-[10px] md:text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" /> {new Date(req.$createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-1/3 border-t border-slate-100 sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                         {actionLoading === req.$id ? (
                            <div className="flex w-full justify-center"><Loader2 className="w-5 h-5 text-[#c29b57] animate-spin" /></div>
                         ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                              {(!req.status || req.status === 'قيد المراجعة' || req.status === 'pending') && (
                                <>
                                  <button onClick={() => updateStatus(req.$id, 'منشور')} className="flex-1 sm:flex-none px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-xl hover:bg-[#16213b] transition shadow-sm">قبول</button>
                                  <button onClick={() => updateStatus(req.$id, 'مرفوض')} className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition shadow-sm">رفض</button>
                                </>
                              )}
                              {(req.status === 'منشور' || req.status === 'مرفوض' || req.status === 'مقبول') && (
                                <button onClick={() => updateStatus(req.$id, 'قيد المراجعة')} className="flex-1 w-full sm:w-auto px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-sm flex items-center justify-center gap-2">
                                  <ChevronLeft size={14} /> تراجع
                                </button>
                              )}
                            </div>
                         )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* عرض: إعدادات النظام */}
          {currentMenu === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 md:p-8">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-6 border-b border-slate-100 pb-4">الإعدادات العامة للمنصة</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">اسم المنصة</label>
                    <input type="text" disabled value="منصة ميثاق للزواج" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] font-medium outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">البريد الإلكتروني للإدارة</label>
                    <input type="email" disabled value="admin@methaq.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0f172a] font-medium outline-none cursor-not-allowed" />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-sm">وضع الصيانة</h4>
                        <p className="text-xs text-slate-500 mt-1">إيقاف الموقع مؤقتاً للتحديثات (تظهر رسالة قريباً)</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-60">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-sm">القبول التلقائي للطلبات</h4>
                        <p className="text-xs text-slate-500 mt-1">نشر الطلبات الجديدة بدون مراجعة الإدارة أولاً</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-60">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8">
                    <button disabled className="w-full sm:w-auto bg-[#c29b57] text-[#0f172a] font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                      <Save size={18} /> حفظ الإعدادات
                    </button>
                    <p className="text-[10px] text-slate-400 mt-3">* هذه الواجهة تجريبية (Mockup) وسيتم تفعيل ربطها لاحقاً.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* النافذة المنبثقة للتفاصيل الكاملة */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
            
            <div className="bg-[#0f172a] p-5 flex justify-between items-center relative">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#c29b57]">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm md:text-base">تفاصيل طلب الزواج</h3>
                  <p className="text-[10px] text-slate-400" dir="ltr">#{selectedUser.request_id || selectedUser.$id.substring(0,6).toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedUser(null); }}
                className="w-8 h-8 bg-white/10 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 hide-scrollbar">
              
              <div className="flex items-center gap-4 bg-[#fcfaf6] border border-[#ebd9b4]/40 p-4 rounded-2xl">
                <div className="w-14 h-14 bg-white border border-[#ebd9b4] rounded-full overflow-hidden shrink-0">
                  <PlaceholderAvatar gender={selectedUser.type} className="w-full h-full" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#0f172a]">{selectedUser.first_name || "مستخدم غير معروف"}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mt-1">
                    <span>{selectedUser.type === 'women' ? 'أنثى' : 'ذكر'}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{selectedUser.age} سنة</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">المدينة والمنطقة</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                    <MapPin size={14} className="text-[#c29b57]" /> {selectedUser.city || selectedUser.region || "غير محدد"}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">نوع الزواج</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                    <RingIcon size={14} className="text-[#c29b57]" /> {selectedUser.marriage_type || "زواج معلن"}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">الحالة الاجتماعية</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                    <Heart size={14} className="text-[#c29b57]" /> {selectedUser.social_status || "غير محدد"}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 mb-1">المستوى التعليمي</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                    <User size={14} className="text-[#c29b57]" /> {selectedUser.education_level || "غير محدد"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">النبذة التعريفية والمواصفات:</span>
                <div className="bg-[#fcfaf6] p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    "{selectedUser.bio || "لا توجد تفاصيل إضافية مكتوبة في هذا الملف حالياً."}"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              {actionLoading === selectedUser.$id ? (
                <div className="w-full flex justify-center py-2"><Loader2 className="w-6 h-6 text-[#c29b57] animate-spin" /></div>
              ) : (
                <>
                  {(!selectedUser.status || selectedUser.status === 'قيد المراجعة' || selectedUser.status === 'pending') && (
                    <>
                      <button 
                        onClick={() => updateStatus(selectedUser.$id, 'منشور')} 
                        className="flex-1 bg-[#0f172a] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#16213b] transition shadow-sm"
                      >
                        قبول واعتماد الملف
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedUser.$id, 'مرفوض')} 
                        className="flex-1 bg-white border border-rose-200 text-rose-600 py-3 rounded-xl text-xs font-bold hover:bg-rose-50 transition shadow-sm"
                      >
                        رفض الطلب
                      </button>
                    </>
                  )}
                  {(selectedUser.status === 'منشور' || selectedUser.status === 'مرفوض' || selectedUser.status === 'مقبول') && (
                    <button 
                      onClick={() => updateStatus(selectedUser.$id, 'قيد المراجعة')} 
                      className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-sm flex items-center justify-center gap-2"
                    >
                      إعادة الملف إلى وضع قيد المراجعة
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
