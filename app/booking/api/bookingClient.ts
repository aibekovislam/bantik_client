import { Slots } from "../hooks/useBooking";

// api/bookingClient.ts
export async function fetchServices() {
  const response = await fetch("/api/services/");
  if (!response.ok) throw new Error("Ошибка при загрузке услуг");
  const { results } = await response.json();
  return results;
}

export async function fetchAvailableMasters(
  serviceId: string,
  date?: string,
  time?: string
) {
  const params = new URLSearchParams();
  params.append("service", serviceId);
  if (date) params.append("date", date);
  if (time) params.append("time", time);

  const url = `/api/employees/?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Ошибка при загрузке мастеров");
  const { results } = await response.json();
  return results;
}

export async function fetchAvailableSlots(serviceId: string, date: string): Promise<Slots> {
  const url = `/api/available-slots/?service_id=${serviceId}&date=${date}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('data', data)
  return data;
}

export async function createAppointment(form: {
  clientName: string;
  clientPhone: string;
  date: string;       // ISO‑строка с датой+временем
  masterUuid: string;
  serviceIds: number[];
}) {
  const response = await fetch("/api/create-appointment/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      date: form.date,
      masterId: form.masterUuid,
      serviceId: form.serviceIds[0],
    }),
  });

  const contentType = response.headers.get("content-type") || "";
  let payload: any;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    const text = await response.text();
    throw new Error("Ошибка сервера: " + text);
  }

  if (!response.ok) {
    let message = payload.message || `Ошибка ${response.status}`;
    if (response.status === 400 && typeof payload === "object") {
      message = Object.entries(payload)
        .map(([k, v]) =>
          Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
        )
        .join("; ");
    }
    throw new Error(message);
  }

  return payload;
}
