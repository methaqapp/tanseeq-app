// components/RecentRequestsSlider.tsx
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { MapPin, User, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RecentRequestsSlider() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_APPWRITE_DB_ID) return;
       const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
          [
            Query.equal("status", ["منشور", "مقبول"]), // سيرفر Appwrite يفلترها
            Query.orderDesc("$createdAt"),            // سيرفر Appwrite يرتبها
            Query.limit(8)                            // سيرفر Appwrite يجلب 8 فقط
          ]
        );
        
        setRequests(res.documents);      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#c29b57] w-8 h-8" /></div>;
  if (requests.length === 0) return null; // إخفاء السلايدر إذا لم تكن هناك طلبات

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4 mt-8" dir="rtl">
      <div className="flex gap-4 px-4 md:px-0 w-max mx-auto md:w-full md:justify-center">
        {requests.map(req => (
          <Link href={`/explore/${req.$id}`} key={req.$id} className="bg-white border border-[#e4e2e2] rounded-[1.5rem] p-5 shadow-sm min-w-[260px] flex flex-col hover:shadow-md transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-[#051b12] text-lg" dir="ltr">{req.request_id || `#MTQ-${req.$id.substring(0,4)}`}</span>
              <span className="bg-[#fbf9f8] text-[#051b12] border border-[#e4e2e2] text-[10px] px-3 py-1.5 rounded-full font-bold">
                {req.type}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#424844] font-medium">
               <div className="flex items-center gap-1.5"><User size={16} className="text-[#c29b57]"/> {req.age} سنة</div>
               <div className="flex items-center gap-1.5"><MapPin size={16} className="text-[#c29b57]"/> {req.region || req.city}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
