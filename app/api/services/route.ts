
import { NextResponse } from 'next/server';
import { NEXT_PUBLIC_API_URL } from '@/app/lib/consts';
export async function GET() {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/services/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch services',
      },
      { status: 500 }
    );
  }
}
