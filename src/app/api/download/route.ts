import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type') || 'apk';

  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

  let filename = 'tibeb.apk';
  let contentType = 'application/vnd.android.package-archive';
  let disposition = 'attachment; filename="tibeb.apk"';

  if (type === 'mobileconfig') {
    filename = 'tibeb.mobileconfig';
    contentType = 'application/x-apple-aspen-config; charset=utf-8';
    // iOS Safari requires inline disposition to trigger native Configuration Profile installer sheet
    disposition = 'inline; filename="tibeb.mobileconfig"';
  } else if (type === 'ipa') {
    filename = 'tibeb.ipa';
    contentType = 'application/octet-stream';
    disposition = 'attachment; filename="tibeb.ipa"';
  } else {
    filename = 'tibeb.apk';
    contentType = 'application/vnd.android.package-archive';
    disposition = 'attachment; filename="tibeb.apk"';
  }

  const filePath = path.join(downloadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  let fileBuffer = fs.readFileSync(filePath);

  // If mobileconfig, dynamically substitute current host so webclip connects directly
  if (type === 'mobileconfig') {
    try {
      const host = req.headers.get('host') || 'tibebexams.com';
      const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      const origin = `${proto}://${host}`;
      let content = fileBuffer.toString('utf-8');
      content = content.replace(/<string>https:\/\/tibebexams\.com<\/string>/g, `<string>${origin}</string>`);
      fileBuffer = Buffer.from(content, 'utf-8');
    } catch (e) {
      // Fallback to static fileBuffer
    }
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
