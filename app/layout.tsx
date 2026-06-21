import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
// تهيئة خط تجوّل مع جميع الأوزان التي نحتاجها
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap", // لضمان سرعة ظهور النص
  variable: "--font-tajawal"
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
      <body className={`${tajawal.variable} font-sans bg-gray-50 text-[#1D2B4F] pb-16 md:pb-0`}>
        <main className="min-h-screen  bg-white shadow-xl relative overflow-x-hidden">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );}
