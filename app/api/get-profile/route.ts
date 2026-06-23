import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { whatsapp_number } = await req.json();
    if (!whatsapp_number) return NextResponse.json({ error: 'Missing phone' }, { status: 400 });

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string);
    const databases = new Databases(client);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      [Query.equal("whatsapp_number", whatsapp_number)]
    );

    if (response.documents.length > 0) {
      const user = response.documents[0];
      
      // 💡 التعديل هنا: إضافة await
      const cookieStore = await cookies();
      cookieStore.set('mithaq_session', user.request_id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 2592000, path: '/' });
      cookieStore.set('mithaq_auth_status', 'true', { secure: process.env.NODE_ENV === 'production', maxAge: 2592000, path: '/' });
      
      return NextResponse.json({ success: true, user });
    }
    return NextResponse.json({ success: false, error: "لم يتم العثور على المستخدم" });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 💡 التعديل هنا: إضافة await
    const cookieStore = await cookies();
    const reqId = cookieStore.get('mithaq_session')?.value;
    
    if (!reqId) return NextResponse.json({ success: false });

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string);
    const databases = new Databases(client);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      [Query.equal("request_id", reqId)]
    );

    if (response.documents.length > 0) {
      return NextResponse.json({ success: true, user: response.documents[0] });
    }
    return NextResponse.json({ success: false });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
