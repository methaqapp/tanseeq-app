import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

// تهيئة عميل السيرفر الآمن
const getSecureClient = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string);
  return new Databases(client);
};

// 🔒 دالة حماية: تتحقق من وجود جلسة إدارة نشطة
const verifyAdminSession = async () => {
  const cookieStore = await cookies();
  // Appwrite يقوم بتخزين جلسة تسجيل الدخول في كوكي يبدأ بهذا الاسم
  const hasAdminSession = cookieStore.getAll().some(cookie => cookie.name.startsWith('a_session_'));
  return hasAdminSession;
};

// 1. جلب جميع الطلبات
export async function GET() {
  try {
    // 🛡️ التحقق الأمني قبل فعل أي شيء
    const isAuthorized = await verifyAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالدخول (Unauthorized)' }, { status: 401 });
    }

    const databases = getSecureClient();
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      [Query.limit(100), Query.orderDesc('$createdAt')]
    );
    return NextResponse.json({ success: true, documents: response.documents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. تحديث حالة الطلب
export async function PATCH(req: Request) {
  try {
    // 🛡️ التحقق الأمني قبل التعديل
    const isAuthorized = await verifyAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالدخول (Unauthorized)' }, { status: 401 });
    }

    const { documentId, newStatus } = await req.json();
    if (!documentId || !newStatus) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const databases = getSecureClient();
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      documentId,
      { status: newStatus }
    );
    return NextResponse.json({ success: true, document: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
