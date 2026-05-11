'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const BENGALI_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const BENGALI_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export default function EventCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('scholarship_exams')
      .select('*')
      .order('exam_date', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  // ক্যালেন্ডার তৈরি
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(e => {
      if (!e.exam_date) return false;
      const eventDate = new Date(e.exam_date);
      return eventDate.getFullYear() === date.getFullYear() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getDate() === date.getDate();
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'published': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100';
    }
  };

  const getStatusName = (status: string) => {
    switch(status) {
      case 'upcoming': return 'আসন্ন';
      case 'ongoing': return 'চলমান';
      case 'completed': return 'সম্পন্ন';
      case 'published': return 'প্রকাশিত';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-teal-200 hover:text-white mb-4 inline-block">← হোম পেজে ফিরুন</Link>
          <h1 className="text-3xl font-bold">📅 ইভেন্ট ক্যালেন্ডার</h1>
          <p className="text-teal-100 mt-2">পরীক্ষার সময়সূচী ও গুরুত্বপূর্ণ তারিখ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ক্যালেন্ডার */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* ক্যালেন্ডার হেডার */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 flex justify-between items-center">
                <button onClick={prevMonth} className="text-2xl hover:scale-110 transition">◀</button>
                <h2 className="text-2xl font-bold">{BENGALI_MONTHS[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth} className="text-2xl hover:scale-110 transition">▶</button>
              </div>

              {/* ক্যালেন্ডার বডি */}
              <div className="p-4">
                {/* দিনের নাম */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {BENGALI_DAYS.map(d => (
                    <div key={d} className="text-center text-sm font-bold text-gray-500 py-2">{d}</div>
                  ))}
                </div>

                {/* তারিখ */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="h-24 p-1"></div>
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDate(day);
                    const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                    
                    return (
                      <div key={day} onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                        className={`h-24 p-1 border rounded-lg cursor-pointer hover:bg-teal-50 transition overflow-hidden ${isToday ? 'border-teal-500 border-2' : 'border-gray-100'} ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth ? 'bg-teal-100' : ''}`}>
                        <div className={`text-sm font-bold mb-1 ${isToday ? 'text-teal-600' : ''}`}>{day}</div>
                        {dayEvents.slice(0, 2).map(ev => (
                          <div key={ev.id} className={`text-xs px-1 py-0.5 rounded mb-0.5 truncate ${getStatusColor(ev.status)}`}
                            title={ev.title_bn}>
                            {ev.title_bn}
                          </div>
                        ))}
                        {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} আরো</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ইভেন্ট তালিকা */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-3">
                {selectedDate ? 
                  `${selectedDate.getDate()} ${BENGALI_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` :
                  '📋 সকল ইভেন্ট'}
              </h2>

              {selectedDate ? (
                (() => {
                  const dayEvents = getEventsForDate(selectedDate.getDate());
                  return dayEvents.length > 0 ? (
                    <div className="space-y-3">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className={`p-4 rounded-lg border ${getStatusColor(ev.status)}`}>
                          <h3 className="font-bold mb-1">{ev.title_bn}</h3>
                          <p className="text-sm">📅 {ev.exam_date ? new Date(ev.exam_date).toLocaleDateString('bn-BD') : 'তারিখ নেই'}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-2 ${getStatusColor(ev.status)}`}>
                            {getStatusName(ev.status)}
                          </span>
                          {ev.description && <p className="text-sm mt-2">{ev.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">কোনো ইভেন্ট নেই</p>
                  );
                })()
              ) : (
                <div className="space-y-3">
                  {events.length > 0 ? events.map(ev => (
                    <div key={ev.id} className={`p-4 rounded-lg border ${getStatusColor(ev.status)}`}>
                      <h3 className="font-bold mb-1">{ev.title_bn}</h3>
                      <p className="text-sm">📅 {ev.exam_date ? new Date(ev.exam_date).toLocaleDateString('bn-BD') : 'তারিখ নেই'}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-2 ${getStatusColor(ev.status)}`}>
                        {getStatusName(ev.status)}
                      </span>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">কোনো ইভেন্ট নেই</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
