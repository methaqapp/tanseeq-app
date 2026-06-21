// components/PlaceholderAvatar.tsx
import React from 'react';
import { UserRound } from 'lucide-react';

interface AvatarProps {
  gender: "men" | "women" | "رجال" | "نساء" | string;
  className?: string;
}

export default function PlaceholderAvatar({ gender, className = "w-12 h-12" }: AvatarProps) {
  // التحقق من الجنس لضبط الألوان
  const isMen = gender === 'men' || gender === 'رجال';
  
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden border border-slate-100 shadow-sm ${className}`}>
      {/* خلفية متدرجة فخمة */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${
        isMen ? 'from-slate-400 to-slate-800' : 'from-[#D4AF37] to-amber-700'
      }`}></div>
      
      {/* أيقونة مستخدم احترافية ونظيفة */}
      <UserRound 
        className={`relative z-10 w-1/2 h-1/2 ${
          isMen ? 'text-slate-700' : 'text-[#b5952f]'
        }`} 
        strokeWidth={1.5} 
      />
    </div>
  );
}
