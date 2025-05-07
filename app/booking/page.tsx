"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "./hooks/useBooking";
import { motion, AnimatePresence } from "framer-motion";
import MasterList from "@/components/sections/MasterList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NEXT_PUBLIC_API_URL } from "../lib/consts";

export default function BookingPage() {
  const {
    services,
    masters,
    slots, setSlots,setNoSlots,
    setSelectedMaster, setMasters,
    loading,
    submitting,
    error,
    noMasters,
    noSlots,
    form,
    setForm,
    findSlots,
    fetchMasters,
    selectedMaster,
    handleSubmit,
  } = useBooking();

  const [step, setStep] = useState(1);
  const [dateError, setDateError] = useState<string | null>(null);

  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear]   = useState(today.getFullYear())
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [datesLoading, setDatesLoading] = useState(false)

  useEffect(() => {
    if (!form.serviceIds.length) return
    const service_id = form.serviceIds[0]
  
    const load = async () => {
      setDatesLoading(true)
      try {
        const res = await fetch(
          `${NEXT_PUBLIC_API_URL}/available-dates/?month=${month}&year=${year}&service_id=${service_id}`
        )
        const data = await res.json()
        setAvailableDates(data.available_dates ?? [])
      } catch (e) {
        console.error(e)
        setAvailableDates([])
      } finally {
        setDatesLoading(false)
      }
    }
    load()
  }, [month, year, form.serviceIds])
  
  const currentService = services.find((s) => s.id === form.serviceIds[0]);
  const isLongService = currentService?.is_long === true;

  
  const fade = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-2 font-inter">
      <h1 className="text-center text-5xl font-extrabold text-rose-600 mb-6 tracking-wide">
        VIP Запись в Bantik
      </h1>

      {error && (
        <div className="max-w-lg mx-auto mb-6 bg-rose-100 text-rose-800 p-4 rounded-lg border border-rose-200 text-center">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Шаг 1: услуга */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Card>
              <h2 className="text-2xl font-semibold text-center text-pink-600 mb-6 uppercase tracking-wide">
                1. Выберите услугу
              </h2>
              <div className="space-y-4 overflow-y-auto px-2">
                {services.map((s) => (
                  <label key={s.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={form.serviceIds[0] === s.id}
                      onChange={() =>
                        setForm((f) => ({ ...f, serviceIds: [s.id] }))
                      }
                      className="accent-pink-500"
                    />
                    <span className="text-lg text-gray-800">
                      {s.name} — {s.duration} мин, {s.price} сом
                    </span>
                  </label>
                ))}
              </div>
              <Button 
                onClick={() => setStep(2)}
                disabled={loading || !form.serviceIds.length}
                className="mt-8 w-full bg-gradient-to-r from-rose-600 to-pink-500 text-white py-3 text-lg font-bold rounded-xl shadow-lg hover:opacity-90 transition"
              >
                Далее
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Шаг 2: дата */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Card>
              <h2 className="text-2xl font-semibold text-center text-pink-600 mb-6 uppercase tracking-wide">
                2. Выберите дату
              </h2>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() =>
                      setMonth((m) => (m === 1 ? (setYear(y => y - 1), 12) : m - 1))
                    }
                    className="text-2xl px-2"
                  >
                    ‹
                  </button>
                  <span className="font-medium">
                    {new Date(year, month - 1).toLocaleDateString("ru-RU", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() =>
                      setMonth((m) => (m === 12 ? (setYear(y => y + 1), 1) : m + 1))
                    }
                    className="text-2xl px-2"
                  >
                    ›
                  </button>
                </div>

                {datesLoading ? (
                  <p className="text-center py-6 text-gray-500">Загружаю даты…</p>
                ) : availableDates.length === 0 ? (
                  <p className="text-center py-6 text-yellow-600">Нет свободных дат</p>
                ) : (
                <div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-1 text-gray-500 text-sm select-none">
                    {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {(() => {
                      const elems: JSX.Element[] = []

                      const jsFirstDay = new Date(year, month - 1, 1).getDay()
                      const firstDay = (jsFirstDay + 6) % 7

                      for (let i = 0; i < firstDay; i++) {
                        elems.push(<div key={"empty-"+i} />)
                      }

                      const lastDay = new Date(year, month, 0).getDate()
                      for (let day = 1; day <= lastDay; day++) {
                        const iso = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`
                        const isEnabled  = availableDates.includes(iso)
                        const isSelected = form.date === iso

                        elems.push(
                          <button
                            key={iso}
                            disabled={!isEnabled}
                            onClick={() => {
                              setForm((f) => ({ ...f, date: iso, time: "" }))
                              setSlots(null)
                            }}
                            className={`aspect-square w-full rounded-md text-sm
                              ${isEnabled
                                ? isSelected
                                  ? "bg-rose-600 text-white"
                                  : "bg-gray-100 hover:bg-rose-100"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"}`}
                          >
                            {day}
                          </button>
                        )
                      }
                      return elems
                    })()}
                  </div>
                </div>
                )}
              </div>

              {isLongService && (
                <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-sm">
                  Эта услуга занимает много времени. После записи администратор свяжется с&nbsp;вами и уточнит точное время.
                </div>
              )}

              {dateError && (
                <p className="text-red-600 text-center mt-2">{dateError}</p>
              )}

              {!loading && noSlots && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
                  <p className="text-yellow-700">Нет доступного времени на выбранную дату</p>
                </div>
              )}

              {!loading && slots && slots?.masters.length > 0 && (
                <div className="overflow-y-auto px-2 py-2">
                  {slots.masters.map((slot) => (
                    <MasterList
                      key={slot.uuid}
                      loading={loading}
                      slots={slots}
                      onSelect={(master, time) => {
                        setForm((f) => ({ ...f, time: time ?? "" }));
                        setSelectedMaster(master)
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-pink-300 text-pink-600 hover:bg-pink-50 transition"
                >
                  Назад
                </Button>

                <Button
                  onClick={() => setStep(5)}
                  disabled={isLongService ? !selectedMaster : !form.time}
                  className="bg-gradient-to-r from-rose-600 to-pink-500 text-white px-6 py-2 rounded-xl shadow hover:opacity-90 transition"
                >
                  Далее
                </Button>
              </div>
              
            </Card>
          </motion.div>
        )}

        {/* Шаг 5: данные клиента */}
        {step === 5 && (
          <motion.div
            key="step5"
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleSubmit}>
              <Card className="bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold text-center text-pink-600 mb-6 uppercase tracking-wide">
                  5. Ваши данные
                </h2>

                <div className="mb-6 text-gray-700 leading-relaxed bg-pink-50 p-4 rounded-lg">
                  <p><strong>Услуга:</strong> {services.find((s) => s.id === form.serviceIds[0])?.name}</p>
                  <p>
                    <strong>Дата:</strong> {form.date}
                    {!isLongService && form.time && <> <strong>Время:</strong> {form.time}</>}
                    {isLongService && (
                      <span className="text-sm text-gray-500"> (точное время сообщит администратор)</span>
                    )}
                  </p>
                  <p><strong>Мастер:</strong> {selectedMaster?.name}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Ваше имя</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={form.clientName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, clientName: e.target.value }))
                      }
                      required
                      className="w-full border-pink-300 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder">Напомнить за:</Label>

                    <Select
                      value={String(form.reminder_minutes)}
                      onValueChange={(val) =>
                        setForm((f) => ({ ...f, reminder_minutes: Number(val) }))
                      }                  
                    >
                      <SelectTrigger className="w-full border-pink-300 focus:border-pink-500">
                        <SelectValue placeholder="Выберите интервал" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">За 30 минут</SelectItem>
                        <SelectItem value="60">За 1 час</SelectItem>
                        <SelectItem value="120">За 2 часа</SelectItem>
                        <SelectItem value="180">За 3 часа</SelectItem>
                        <SelectItem value="1440">За 1 день</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                    +996
                  </span>
                  <Input
                    type="tel"
                    name="clientPhone"
                    value={form.clientPhone.slice(3)}
                    onChange={(e) => {
                      let digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setForm((f) => ({ ...f, clientPhone: "996" + digits }));
                    }}
                    maxLength={9}
                    placeholder="XXX XXX XXX"
                    className="pl-16 border-pink-300 focus:border-pink-500"
                    required
                  />
                </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                  <Button
                    type="submit"
                    disabled={submitting || loading || !form.clientName || !form.clientPhone}
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-500 text-white px-8 py-2 rounded-xl shadow-lg hover:opacity-90 transition text-lg font-bold"
                  >
                    {submitting ? "Отправка..." : "Подтвердить"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto border-pink-300 text-pink-600 hover:bg-pink-50 transition"
                  >
                    Назад
                  </Button>
                </div>
              </Card>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}