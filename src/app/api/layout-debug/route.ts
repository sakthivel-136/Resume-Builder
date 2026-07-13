import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const logPath = path.join(process.cwd(), 'layout_debug.log');
    fs.appendFileSync(logPath, JSON.stringify(data, null, 2) + '\n---\n');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
