import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // 💡 التعديل هنا: إضافة await
  const cookieStore = await cookies();
  cookieStore.delete('mithaq_session');
  cookieStore.delete('mithaq_auth_status');
  return NextResponse.json({ success: true });
}
