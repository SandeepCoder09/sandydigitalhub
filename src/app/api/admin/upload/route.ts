import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { writeFile, readdir, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const sanitizeFilename = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${sanitizeFilename}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      url: imageUrl, 
      name: file.name,
      message: 'Image uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to upload image' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let files: string[] = [];

    if (existsSync(uploadsDir)) {
      const readFiles = await readdir(uploadsDir);
      files = readFiles
        .filter((file) => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
        .map((file) => `/uploads/${file}`);
    }

    return NextResponse.json({ images: files });
  } catch (error: any) {
    return NextResponse.json({ images: [] });
  }
}
