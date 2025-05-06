import { useState } from 'react'
import Image from 'next/image'

interface Master {
  uuid: string
  name: string
  avatar: string | null
  available_slots: string[]
}

interface SlotsData {
  date: string
  service_id: string
  is_long_service: boolean
  masters: Master[]
}

interface Props {
  loading: boolean
  slots: SlotsData | null
  /** time может быть null, когда выбираем только мастера */
  onSelect: (master: Master | null, time: string | null) => void
}

export default function MasterList({ loading, slots, onSelect }: Props) {
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  if (loading || !slots) return <div className="p-4 text-center">Загружаю…</div>

  const isLong = slots.is_long_service

  const chooseMaster = (master: Master) => {
    setSelectedMaster(master)
    setSelectedSlot(null)

    /* Если услуга длинная — сразу передаём выбор наружу */
    if (isLong) onSelect(master, null)
  }

  const chooseSlot = (master: Master, time: string) => {
    setSelectedMaster(master)
    setSelectedSlot(time)
    onSelect(master, time)
  }

  return (
    <div className="space-y-6 my-5">
      {slots.masters.map((m) => (
        <div key={m.uuid} className="space-y-4">
          <label className="flex items-center gap-4 cursor-pointer">
            {m.avatar ? (
              <Image
                src={m.avatar}
                alt={m.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                {m.name[0]}
              </span>
            )}

            <div className="flex-1">
              <p className="text-lg font-medium">{m.name}</p>
              <p className="text-sm text-gray-500">мастер</p>
            </div>

            <input
              type="radio"
              name="master"
              className="h-5 w-5 accent-primary"
              checked={selectedMaster?.uuid === m.uuid}
              onChange={() => chooseMaster(m)}
            />
          </label>

          {/* Слоты показываем только если услуга короткая */}
          {!isLong && (
            <>
              <p className="mt-2 font-medium text-gray-600">
                Ближайшее время для записи <span className="font-semibold">сегодня:</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {m.available_slots.length === 0 ? (
                  <p>Нет свободных записей</p>
                ) : (
                  m.available_slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => chooseSlot(m, t)}
                      className={`rounded-full px-5 py-2 text-sm bg-gray-200 transition ${
                        selectedSlot === t && 'text-white bg-black'
                      }`}
                    >
                      {t}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
