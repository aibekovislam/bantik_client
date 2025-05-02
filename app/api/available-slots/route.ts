import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_API_URL } from "@/app/lib/consts";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  // используем service_id/master_id/date из Swagger
  const qs = searchParams.toString();
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/employees/available-slots/?${qs}`);

  if (!res.ok) {
    if (res.status === 400) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData }, { status: 400 });
    }
    return NextResponse.json({ error: "Произошла ошибка" }, { status: res.status });
  }
  const data = await res.json();
  // Swagger возвращает { date, master_id, service_id, available_slots: string[] }
  return NextResponse.json(data);
}