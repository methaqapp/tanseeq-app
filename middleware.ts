import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. حماية مسار الإدارة
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const hasAdminCookie = request.cookies.has('mithaq_admin_session');
    
    // إذا لم يجد كوكي الإدارة، يطرده فوراً لصفحة تسجيل دخول الإدارة
    if (!hasAdminCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. إذا كان المستخدم يفتح صفحة الدخول وهو مسجل دخول فعلياً، لا داعي لتكرار الدخول
  if (request.nextUrl.pathname === '/login') {
    const hasAdminCookie = request.cookies.has('mithaq_admin_session');
    if (hasAdminCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي يجب أن يعمل عليها هذا الحارس الأمني
export const config = {
  matcher: ['/admin/:path*', '/login'], 
};
