import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { addAppointment } from "@/app/lib/redux/slices/appointmentSlice";
import { saveAppointment } from "@/app/lib/localStorageService";
import {
  fetchServices,
  fetchAvailableMasters,
  fetchAvailableSlots,
  createAppointment,
} from "../api/bookingClient";
import { Appointment } from "@/hooks/types";

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface Master {
  uuid: string;
  first_name: string;
  last_name: string;
}

interface BookingForm {
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  serviceIds: number[];
  reminder_minutes: number
}

export interface Slots {
  date: string
  service_id: string
  is_long_service: boolean
  masters: MasterSlots[]
}

interface MasterSlots {
  uuid: string
  name: string
  avatar: string | null
  available_slots: string[]
}

export function useBooking() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [slots, setSlots] = useState<Slots | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<MasterSlots | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noMasters, setNoMasters] = useState(false);
  const [noSlots, setNoSlots] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    clientName: "",
    clientPhone: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    serviceIds: [],
    reminder_minutes: 0
  });

  // 1) загрузка услуг
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setServices(await fetchServices());
    } catch {
      setError("Ошибка при загрузке услуг");
    } finally {
      setLoading(false);
    }
  }, []);

  const findSlots = useCallback(async () => {
    if (!form.serviceIds.length || !form.date) {
      toast({ title: "Ошибка", description: "Выберите услугу и дату" });
      return false;
    }
    setError(null);
    setNoSlots(false);
    setSlots(null);
  
    try {
      setLoading(true);
      const list = await fetchAvailableSlots(
        form.serviceIds[0].toString(),
        form.date
      );
      setSlots(list);

      if (!list || list.masters.length === 0) {
        setNoSlots(true);
        setError(null);
      }
      return true;
    } catch (err: any) {
      setNoSlots(true);
      setError(null);
      toast({
        title: "Ошибка", 
        description: err.message || "Не удалось загрузить слоты"
      });
      return false;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, toast]);

  // 3) получение мастеров
  const fetchMasters = useCallback(async () => {
    if (!form.serviceIds.length || !form.date || !form.time) {
      toast({ title: "Ошибка", description: "Выберите услугу, дату и время" });
      return false;
    }
    setError(null);
    setNoMasters(false);
    setMasters([]);

    try {
      setLoading(true);
      const list = await fetchAvailableMasters(
        form.serviceIds[0].toString(),
        form.date,
        form.time
      );
      setMasters(list);
      if (!list.length) setNoMasters(true);
      return true;
    } catch {
      setError("Не удалось получить мастеров");
      toast({ title: "Ошибка", description: "Не удалось получить мастеров" });
      return false;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, toast]);

  // 4) отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (
      !form.clientName ||
      !form.clientPhone ||
      !form.date ||
      !form.time ||
      !form.serviceIds.length ||
      !selectedMaster
    ) {
      toast({ title: "Ошибка", description: "Заполните все поля" });
      setSubmitting(false);
      return;
    }

    try {
      const localDateTime = `${form.date}T${form.time}:00`;
      await createAppointment({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        date: localDateTime,
        masterUuid: selectedMaster.uuid,
        serviceIds: form.serviceIds,
      });

      const newAppointment: Appointment = {
        id: new Date().getTime().toString(),
        serviceIds: form.serviceIds,
        masterId: selectedMaster.uuid,
        dateTime: localDateTime.replace("T", " "),
        
        clientName: form.clientName,
        masterName: `${selectedMaster.name}`,
        services: services.filter((s) => form.serviceIds.includes(s.id)).map((s) => s.name),
        clientPhone: form.clientPhone,
        status: "pending",
      };

      saveAppointment(newAppointment as any);
      dispatch(addAppointment(newAppointment));

      toast({
        title: "Успешно!",
        description: "Запись создана успешно ✨",
      });
      router.push("/appointments");
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Ошибка", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!form.date || !form.serviceIds.length) return
  
    findSlots()
    setSelectedMaster(null)
    setForm((prev) => ({
      ...prev,
      time: ''
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, form.serviceIds])        

  return {
    services,
    masters,
    slots, setSlots, setNoSlots,
    selectedMaster,
    loading,
    submitting,
    error,
    noMasters,
    noSlots,
    form,
    setForm,
    findSlots,
    fetchMasters,
    setSelectedMaster,
    setMasters,
    handleSubmit,
  };
}