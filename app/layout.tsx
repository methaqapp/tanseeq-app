import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

// تهيئة خط تجوّل مع جميع الأوزان التي نحتاجها
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap", // لضمان سرعة ظهور النص
});

export const metadata: Metadata = {
  title: "ميثاق | منصة التوافق والزواج الجاد",
  description: "منصة موثوقة للتوافق والزواج الجاد داخل الخليج، بإشراف ومتابعة بشرية للحفاظ على الجدية والخصوصية.",
};

export const viewport: Viewport = {
  themeColor: "#0f172a", // لون كحلي ليتناسب مع الهوية في متصفحات الجوال
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      {/* تطبيق الخط على كامل جسم الموقع مع تحسين نعومة الخطوط (antialiased) */}
      <body className={`${tajawal.className} antialiased bg-[#f8fafc] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
