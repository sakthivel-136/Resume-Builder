import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Define path to counter file in the project root data directory
const counterDir = path.join(process.cwd(), 'data');
const counterFilePath = path.join(counterDir, 'counter.txt');

// Helper to calculate weekdays elapsed since July 1, 2026 and multiply by 17
function getTimeDrift(): number {
  try {
    const START_DATE = new Date('2026-07-01');
    const CURRENT_DATE = new Date();
    
    // Normalize dates to midnight
    const curDate = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const endDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), CURRENT_DATE.getDate());
    
    let weekdaysCount = 0;
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
      if (!isWeekend) {
        weekdaysCount++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    
    return weekdaysCount * 17;
  } catch {
    return 0;
  }
}

// Helper to safely read count
function getCount(): number {
  try {
    if (!fs.existsSync(counterDir)) {
      fs.mkdirSync(counterDir, { recursive: true });
    }
    if (!fs.existsSync(counterFilePath)) {
      fs.writeFileSync(counterFilePath, '0', 'utf-8');
      return 142 + getTimeDrift();
    }
    const data = fs.readFileSync(counterFilePath, 'utf-8').trim();
    const recorded = parseInt(data, 10);
    const validRecorded = isNaN(recorded) ? 0 : recorded;
    
    return 142 + getTimeDrift() + validRecorded;
  } catch {
    return 142 + getTimeDrift();
  }
}

// Helper to safely increment count
function incrementCount(): number {
  try {
    if (!fs.existsSync(counterDir)) {
      fs.mkdirSync(counterDir, { recursive: true });
    }
    let currentRecorded = 0;
    if (fs.existsSync(counterFilePath)) {
      const data = fs.readFileSync(counterFilePath, 'utf-8').trim();
      const parsed = parseInt(data, 10);
      if (!isNaN(parsed)) {
        currentRecorded = parsed;
      }
    }
    const nextRecorded = currentRecorded + 1;
    fs.writeFileSync(counterFilePath, nextRecorded.toString(), 'utf-8');
    return 142 + getTimeDrift() + nextRecorded;
  } catch {
    return getCount();
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
