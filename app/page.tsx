// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Calendar, UserCheck, Globe, Menu, X } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      {/* Nav */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-rose-500" />
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-wide">
              Bantik
            </span>
          </Link>

          {/* Hamburger on mobile */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Links */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } md:flex md:items-center md:space-x-6 mt-4 md:mt-0`}
          >
            <Link
              href="/appointments"
              className="block md:inline-block text-gray-600 hover:text-gray-900 py-2 md:py-0 transition-colors"
            >
              Мои записи
            </Link>
            <Link
              href="/booking"
              className="block md:inline-block bg-rose-500 text-white px-4 py-2 rounded-lg shadow hover:bg-rose-600 transition-colors mt-2 md:mt-0"
            >
              Записаться
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-rose-600 mb-4">
            Добро пожаловать в Bantik VIP
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Исключительный сервис красоты и ухода. Запишитесь к лучшим мастерам
            в уютной атмосфере нашего салона.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-rose-500 text-white px-6 sm:px-10 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:bg-rose-600 transition"
          >
            Записаться на приём
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
            <UserCheck className="h-10 w-10 text-rose-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Профессиональные мастера
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Только сертифицированные специалисты с многолетним опытом работы.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
            <Calendar className="h-10 w-10 text-rose-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Удобное расписание
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Гибкое расписание работы и мгновенный выбор свободного времени.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
            <Globe className="h-10 w-10 text-rose-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Онлайн-запись 24/7
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Запишитесь на процедуру в любое время и из любого устройства.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 bg-rose-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4">
            Готовы к преображению?
          </h2>
          <Link
            href="/booking"
            className="inline-block bg-rose-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow hover:bg-rose-700 transition"
          >
            Забронировать VIP‑сеанс
          </Link>
        </div>
      </footer>
    </div>
  );
}
