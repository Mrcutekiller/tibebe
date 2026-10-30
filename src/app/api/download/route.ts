import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type') || 'apk';

  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

  let filename = 'tibeb.apk';
  let contentType = 'application/vnd.android.package-archive';

  if (type === 'mobileconfig') {
    filename = 'tibeb.mobileconfig';
    contentType = 'application/x-apple-aspen-config';
  } else if (type === 'ipa') {
    filename = 'tibeb.ipa';
    contentType = 'application/octet-stream';
  } else {
    filename = 'tibeb.apk';
    contentType = 'application/vnd.android.package-archive';
  }

  const filePath = path.join(downloadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

