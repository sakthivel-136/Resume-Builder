import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define path to counter file in the project root data directory
const counterDir = path.join(process.cwd(), 'data');
const counterFilePath = path.join(counterDir, 'counter.txt');

// Helper to safely read count
function getCount(): number {
  try {
    if (!fs.existsSync(counterDir)) {
      fs.mkdirSync(counterDir, { recursive: true });
    }
    if (!fs.existsSync(counterFilePath)) {
      fs.writeFileSync(counterFilePath, '142', 'utf-8');
      return 142;
    }
    const data = fs.readFileSync(counterFilePath, 'utf-8').trim();
    const parsed = parseInt(data, 10);
    return isNaN(parsed) ? 142 : parsed;
  } catch (err) {
    console.error('Error reading counter file:', err);
    return 142;
  }
}

// Helper to safely increment count
function incrementCount(): number {
  try {
    const current = getCount();
    const next = current + 1;
    fs.writeFileSync(counterFilePath, next.toString(), 'utf-8');
    return next;
  } catch (err) {
    console.error('Error writing counter file:', err);
    return 142;
  }
}

export async function GET() {
  const count = getCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = incrementCount();
  return NextResponse.json({ count });
}
