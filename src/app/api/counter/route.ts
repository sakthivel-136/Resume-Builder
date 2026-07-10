import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Define path to counter file in the project root data directory
const counterDir = path.join(process.cwd(), 'data');
const counterFilePath = path.join(counterDir, 'counter.txt');

// Helper to calculate time-based drift since July 1, 2026
function getTimeDrift(): number {
  const START_DATE = new Date('2026-07-01').getTime();
  const daysElapsed = Math.max(0, Math.floor((Date.now() - START_DATE) / (1000 * 60 * 60 * 24)));
  return daysElapsed * 5; // Simulates 5 downloads per day
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
  } catch (err) {
    console.error('Error reading counter file:', err);
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
  } catch (err) {
    console.error('Error writing counter file:', err);
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
