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
  onSelect:(masterUuid: Master|null, time: string)=>void
}

export default function MasterList({ loading, slots, onSelect }: Props) {
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const chooseMaster = (master: Master | null, mnaster: string) => {
    setSelectedMaster(master)
    setSelectedSlot(null)
  }

  const chooseSlot = (master: Master, time: string) => {
    // выбрать мастера, если ещё не выбран или выбран другой
    setSelectedMaster(master);
    // выбрать конкретное время
    setSelectedSlot(time);
    // отдать результат наверх
    onSelect(master, time);
  };
  

  if (loading || !slots) return <div className="p-4 text-center">Загружаю…</div>

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
              onChange={() => chooseMaster(m, m.name)}
            />
          </label>

            <>
              <p className="mt-2 font-medium text-gray-600">
                Ближайшее время для записи <span className="font-semibold">сегодня:</span>
              </p>

              <div className="flex flex-wrap gap-3">
                {
                    m.available_slots.length === 0 ? (
                        <p>Нету свободных записей</p>
                    ) : (
                        m.available_slots.map((t) => (
                            <button
                              key={t}
                              onClick={() => chooseSlot(m, t)}
                              style={ selectedSlot === t ? { backgroundColor: 'black' } : {}}
                              className={`rounded-full px-5 py-2 text-sm bg-gray-200 transition
                                          ${selectedSlot === t && 'text-white'}`}
                            >
                              {t}
                            </button>
                          ))
                    )
                }
              </div>
            </>
        </div>
      ))}
    </div>
  )
}
