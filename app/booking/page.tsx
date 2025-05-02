"use client";

import Head from "next/head";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "./hooks/useBooking";
import { motion, AnimatePresence } from "framer-motion";
import MasterList from "@/components/sections/MasterList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
              <Input
                type="date"
                value={form.date}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split("T")[0];
                  
                  if (selectedDate < today) {
                    setForm((f) => ({ ...f, date: today }));
                    setDateError('Вы не можете выбрать прошедшую дату.');
                  } else {
                    setForm((f) => ({ 
                      ...f, 
                      date: selectedDate,
                      time: "" 
                    }));
                    setSlots(null);
                    setDateError(null);
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border-pink-300 focus:border-pink-500"
              />

              {dateError && (
                <p className="text-red-600 text-center mt-2">{dateError}</p>
              )}

              {!loading && noSlots && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
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
                        setForm((f) => ({ ...f, time }));
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
                  disabled={!form.time}
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
                  <p><strong>Дата/Время:</strong> {form.date} {form.time}</p>
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
                    type="button"
                    variant="outline"
                    onClick={() => setStep(4)}
                    className="w-full sm:w-auto border-pink-300 text-pink-600 hover:bg-pink-50 transition"
                  >
                    Назад
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || loading || !form.clientName || !form.clientPhone}
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-500 text-white px-8 py-2 rounded-xl shadow-lg hover:opacity-90 transition text-lg font-bold"
                  >
                    {submitting ? "Отправка..." : "Подтвердить"}
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