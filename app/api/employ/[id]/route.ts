import { NextResponse } from 'next/server';

const NEXT_PUBLIC_API_URL = "https://qrm.bantik.soulist.life"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const uuid = params.id;
  console.log(`Fetching employee with id: ${uuid}`);
  console.log(`API URL: ${NEXT_PUBLIC_API_URL}`);

  try {
    const url = `${NEXT_PUBLIC_API_URL}/users/${uuid}/`;
    console.log(`Fetching from URL: ${url}`);
    console.log(`Response ID: ${uuid}`);
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response text: ${errorText}`);
      if (response.status === 404) {
        return NextResponse.json({ error: 'Master not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch master data');
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching master data:', error);
    return NextResponse.json({ error: 'Failed to fetch master data' }, { status: 500 });
  }
}