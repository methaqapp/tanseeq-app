import { NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string); 

    const databases = new Databases(client);

    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      ID.unique(),
      data
    );

    // 💡 التعديل هنا: إضافة await
    const cookieStore = await cookies();
    
    cookieStore.set('mithaq_session', data.request_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    
    cookieStore.set('mithaq_auth_status', 'true', {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({ success: true, document: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
