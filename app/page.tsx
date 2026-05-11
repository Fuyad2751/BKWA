'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [stats, setStats] = useState({ schools: 0, students: 0, scholars: 0, talentpool: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [realSchools, setRealSchools] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [allSlides, setAllSlides] = useState<any[]>([]);

  const defaultSlides = [
    { title: "বাংলাদেশ কিন্ডার গার্টেন", subtitle: "ওয়েলফেয়ার এসোসিয়েশন", desc: "প্রথম থেকে পঞ্চম শ্রেণীর শিক্ষার্থীদের মেধা বিকাশে আমরা নিবেদিত", bg: "from-blue-600 via-indigo-700 to-purple-800", emoji: "🎓", type: "default" },
    { title: "বৃত্তি পরীক্ষা ২০২৫", subtitle: "৩০+ স্কুলের অংশগ্রহণ", desc: "মেধাবী শিক্ষার্থীদের জন্য স্কলারশিপ ও ট্যালেন্টপুল বৃত্তির ব্যবস্থা", bg: "from-emerald-600 via-green-700 to-teal-800", emoji: "🏆", type: "default" },
    { title: "সফলতার পথে", subtitle: "শিক্ষার মান উন্নয়নে আমরা", desc: "শিক্ষার মান উন্নয়নে কাজ করে যাচ্ছে আমাদের সংগঠন", bg: "from-orange-500 via-red-600 to-rose-700", emoji: "🌟", type: "default" }
  ];

  useEffect(() => { fetchAllData(); }, []);

  useEffect(() => {
    if (allSlides.length > 0) {
      const timer = setInterval(() => { setCurrentSlide((prev) => (prev + 1) % allSlides.length); }, 5000);
      return () => clearInterval(timer);
    }
  }, [allSlides]);

  const fetchAllData = async () => {
    const [schoolRes, studentRes, noticeRes, galleryRes, examRes] = await Promise.all([
      supabase.from('schools').select('*', { count: 'exact' }),
      supabase.from('students').select('*', { count: 'exact' }),
      supabase.from('notices').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('gallery').select('*').eq('is_published', true).order('created_at', { ascending: false }),
      supabase.from('scholarship_exams').select('*').in('status', ['upcoming', 'ongoing']).order('exam_date', { ascending: true }).limit(4)
    ]);

    setStats({ schools: schoolRes.count || 0, students: studentRes.count || 0, scholars: 150, talentpool: 300 });
    if (noticeRes.data) setNotices(noticeRes.data);
    if (examRes.data) setUpcomingExams(examRes.data);

    if (galleryRes.data && galleryRes.data.length > 0) {
      const galleryItems = galleryRes.data.slice(0, 5).map((p: any) => ({
        title: p.title_bn || "গ্যালারি", subtitle: p.category || "", desc: "", bg: "from-gray-700 via-gray-800 to-gray-900", emoji: "📸", type: "gallery", image: p.image_url
      }));
      setAllSlides([...galleryItems, ...defaultSlides]);
      setGalleryPreview(galleryRes.data.slice(0, 4));
    } else {
      setAllSlides(defaultSlides);
    }

    const { data: sd } = await supabase.from('schools').select('id, name_bn, eiin, phone').order('name_bn');
    if (sd) setRealSchools(sd);
  };

  const getTypeIcon = (t: string) => { switch(t) { case 'exam': return '📝'; case 'result': return '📊'; case 'event': return '🎉'; case 'urgent': return '🚨'; default: return '📢'; } };
  const getStatusInfo = (status: string) => {
    if (status === 'upcoming') return { icon: '📅', label: 'আসন্ন', color: 'border-blue-500 bg-blue-50' };
    if (status === 'ongoing') return { icon: '🔄', label: 'চলমান', color: 'border-green-500 bg-green-50' };
    return { icon: '📢', label: status, color: 'border-gray-500 bg-gray-50' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== নেভবার ========== */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">B</div>
            <span className="text-xl font-bold text-gray-800">BKWA</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-green-600 font-semibold">হোম</Link>
            <Link href="/schools" className="text-gray-600 hover:text-green-600 transition">স্কুল</Link>
            <Link href="/results" className="text-gray-600 hover:text-green-600 transition">ফলাফল</Link>
            <Link href="/merit-list" className="text-gray-600 hover:text-green-600 transition">মেরিট লিস্ট</Link>
            <Link href="/scholarship" className="text-gray-600 hover:text-green-600 transition">স্কলারশিপ</Link>
            <Link href="/certificates" className="text-gray-600 hover:text-green-600 transition">সার্টিফিকেট</Link>
            <Link href="/notices" className="text-gray-600 hover:text-green-600 transition">নোটিশ</Link>
            <Link href="/gallery" className="text-gray-600 hover:text-green-600 transition">গ্যালারি</Link>
            <Link href="/calendar" className="text-gray-600 hover:text-green-600 transition">ক্যালেন্ডার</Link>
            <Link href="/results" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200">ফলাফল দেখুন</Link>
          </div>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </nav>

      {/* ========== হিরো স্লাইডার ========== */}
      {allSlides.length > 0 && (
        <section className={`bg-gradient-to-r ${allSlides[currentSlide].bg} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <div className="max-w-3xl">
              <div className="text-6xl md:text-8xl mb-6 animate-bounce">{allSlides[currentSlide].emoji}</div>
              {allSlides[currentSlide].type === 'gallery' && allSlides[currentSlide].image ? (
                <div className="mb-6">
                  <img src={allSlides[currentSlide].image} alt={allSlides[currentSlide].title} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{allSlides[currentSlide].title}<br /><span className="text-yellow-300">{allSlides[currentSlide].subtitle}</span></h1>
                  <p className="text-lg md:text-xl opacity-90 mb-8">{allSlides[currentSlide].desc}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/results" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl inline-block text-center">🔍 ফলাফল দেখুন</Link>
                    <Link href="/schools" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition transform hover:scale-105 inline-block text-center">🏫 স্কুল সমূহ</Link>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {allSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`} />
            ))}
          </div>
        </section>
      )}

      {/* ========== স্ট্যাটস ========== */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ icon: "🏫", value: `${stats.schools}+`, label: "শিক্ষা প্রতিষ্ঠান", color: "from-green-500 to-emerald-600", shadow: "shadow-green-200" },{ icon: "👨‍🎓", value: `${stats.students}+`, label: "পরীক্ষার্থী", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },{ icon: "🏆", value: `${stats.scholars}+`, label: "স্কলারশিপ", color: "from-yellow-500 to-orange-600", shadow: "shadow-yellow-200" },{ icon: "⭐", value: `${stats.talentpool}+`, label: "ট্যালেন্টপুল", color: "from-purple-500 to-pink-600", shadow: "shadow-purple-200" }].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-xl ${stat.shadow} p-6 text-center transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== ফিচার ========== */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">আমাদের সেবাসমূহ</h2><p className="text-gray-600 max-w-2xl mx-auto">শিক্ষার্থীদের মেধা বিকাশে আমরা বিভিন্ন সেবা প্রদান করে থাকি</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ icon: "🔍", title: "ফলাফল অনুসন্ধান", desc: "রোল নম্বর বা স্কুলের নাম দিয়ে সহজেই ফলাফল জানুন।", link: "/results", color: "border-green-500" },{ icon: "📋", title: "মেরিট লিস্ট", desc: "বর্ষসেরা মেধাবীদের তালিকা দেখুন।", link: "/merit-list", color: "border-blue-500" },{ icon: "📚", title: "স্কলারশিপ তথ্য", desc: "স্কলারশিপ ও ট্যালেন্টপুল সম্পর্কে বিস্তারিত জানুন।", link: "/scholarship", color: "border-purple-500" }].map((f, i) => (
            <Link key={i} href={f.link} className="group"><div className={`bg-white rounded-2xl shadow-lg p-8 border-t-4 ${f.color} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}><div className="text-5xl mb-6">{f.icon}</div><h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition">{f.title}</h3><p className="text-gray-600 mb-4">{f.desc}</p><span className="text-green-600 font-semibold group-hover:underline">বিস্তারিত →</span></div></Link>
          ))}
        </div>
      </section>

           {/* ========== আসন্ন পরীক্ষা ========== */}
      {upcomingExams.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">📅 আসন্ন পরীক্ষা</h2><p className="text-gray-600">বৃত্তি পরীক্ষার সময়সূচী</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {upcomingExams.map(exam => {
                const info = getStatusInfo(exam.status);
                return (
                  <div key={exam.id} className={`rounded-xl shadow p-6 border-t-4 ${info.color} hover:shadow-lg transition`}>
                    <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{info.icon}</span><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border">{info.label}</span></div>
                    <h3 className="font-bold text-gray-800 mb-2">{exam.title_bn}</h3>
                    {exam.exam_date && <p className="text-sm text-gray-500">📅 {new Date(exam.exam_date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    {exam.description && <p className="text-xs text-gray-400 mt-2">{exam.description}</p>}
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8"><Link href="/calendar" className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 transition shadow-lg inline-block">সম্পূর্ণ ক্যালেন্ডার দেখুন →</Link></div>
          </div>
        </section>
      )}

      {/* ========== ক্যালেন্ডার উইজেট ========== */}
      <CalendarWidget />

      {/* ========== নোটিশ বোর্ড ========== */}
      {notices.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">📢 নোটিশ বোর্ড</h2><p className="text-gray-600">এসোসিয়েশনের সর্বশেষ ঘোষণা</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {notices.map(n => (
                <div key={n.id} className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500 hover:shadow-lg transition">
                  <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{getTypeIcon(n.type)}</span><span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}</span></div>
                  <h3 className="font-bold text-gray-800 mb-2">{n.title_bn}</h3>
                  {n.content && <p className="text-sm text-gray-600">{n.content}</p>}
                </div>
              ))}
            </div>
            <div className="text-center mt-8"><Link href="/notices" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg inline-block">সকল নোটিশ দেখুন →</Link></div>
          </div>
        </section>
      )}

      {/* ========== গ্যালারি প্রিভিউ ========== */}
      {galleryPreview.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">📸 গ্যালারি</h2><p className="text-gray-600">এসোসিয়েশনের স্মরণীয় মুহূর্তগুলো</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {galleryPreview.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
                <img src={p.image_url} alt={p.title_bn} className="w-full h-40 object-cover" />
                {p.title_bn && <p className="p-2 text-sm font-semibold truncate">{p.title_bn}</p>}
              </div>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/gallery" className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg inline-block">সম্পূর্ণ গ্যালারি দেখুন →</Link></div>
        </section>
      )}

      {/* ========== অংশগ্রহণকারী স্কুল ========== */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">অংশগ্রহণকারী স্কুল</h2><p className="text-gray-600">{stats.schools}টিরও বেশি শিক্ষা প্রতিষ্ঠান আমাদের সাথে যুক্ত</p></div>
          <div className="flex flex-wrap justify-center gap-4">
            {realSchools.length > 0 ? realSchools.slice(0, 6).map(s => (
              <Link key={s.id} href={`/schools/${s.id}`} className="bg-gray-50 rounded-xl px-6 py-4 shadow hover:shadow-lg transition cursor-pointer border border-gray-100 hover:border-green-300"><span className="text-lg font-semibold text-gray-700">{s.name_bn}</span></Link>
            )) : <p className="text-gray-500">এখনো কোনো স্কুল যোগ করা হয়নি</p>}
          </div>
          <div className="text-center mt-10"><Link href="/schools" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg inline-block">সকল স্কুল দেখুন →</Link></div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">আপনার ফলাফল জানতে প্রস্তুত?</h2>
          <p className="text-xl opacity-90 mb-8">এখনই রোল নম্বর দিয়ে আপনার ফলাফল জেনে নিন</p>
          <Link href="/results" className="bg-white text-green-700 px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl inline-block">ফলাফল দেখুন 🚀</Link>
        </div>
      </section>

      {/* ========== ফুটার ========== */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center font-bold">B</div><span className="text-xl font-bold">BKWA</span></div><p className="text-gray-400">বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন</p></div>
            <div><h4 className="font-bold mb-4">গুরুত্বপূর্ণ লিংক</h4><div className="space-y-2 text-gray-400"><div><Link href="/results" className="hover:text-white">ফলাফল</Link></div><div><Link href="/schools" className="hover:text-white">স্কুল</Link></div><div><Link href="/merit-list" className="hover:text-white">মেরিট লিস্ট</Link></div><div><Link href="/certificates" className="hover:text-white">সার্টিফিকেট</Link></div><div><Link href="/notices" className="hover:text-white">নোটিশ</Link></div><div><Link href="/gallery" className="hover:text-white">গ্যালারি</Link></div><div><Link href="/calendar" className="hover:text-white">ক্যালেন্ডার</Link></div></div></div>
            <div><h4 className="font-bold mb-4">যোগাযোগ</h4><div className="space-y-2 text-gray-400"><div>📞 +৮৮০ ১৭০০-০০০০০০</div><div>✉️ info@bkwa.org</div><div>📍 ঢাকা, বাংলাদেশ</div></div></div>
            <div><h4 className="font-bold mb-4">সোশ্যাল মিডিয়া</h4><div className="flex gap-4 text-2xl"><span className="cursor-pointer hover:text-green-400">📘</span><span className="cursor-pointer hover:text-green-400">📺</span><span className="cursor-pointer hover:text-green-400">📱</span></div></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500"><p>&copy; ২০২৫ বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন। সর্বস্বত্ব সংরক্ষিত।</p></div>
        </div>
      </footer>
    </div>
  );
function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<any[]>([]);

  const BENGALI_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const BENGALI_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  useEffect(() => { 
    supabase.from('scholarship_exams').select('*').then(({ data }) => { if (data) setEvents(data); });
  }, []);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const today = new Date();

  const getEventsForDate = (day: number) => {
    return events.filter(e => {
      if (!e.exam_date) return false;
      const d = new Date(e.exam_date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📅 ক্যালেন্ডার</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-4 flex justify-between items-center">
            <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }} className="text-xl hover:scale-110">◀</button>
            <h3 className="text-lg font-bold">{BENGALI_MONTHS[currentMonth]} {currentYear}</h3>
            <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }} className="text-xl hover:scale-110">▶</button>
          </div>
          <div className="grid grid-cols-7 bg-gray-50">
            {BENGALI_DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 py-2 border-b">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 p-2">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} className="h-16 p-1"></div>)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
              return (
                <div key={day} className={`h-16 p-1 border rounded-lg m-0.5 cursor-pointer hover:bg-teal-50 transition overflow-hidden ${isToday ? 'border-teal-500 border-2 bg-teal-50' : 'border-gray-100'}`}
                  title={dayEvents.map(e => e.title_bn).join(', ')}>
                  <div className={`text-sm font-bold text-center ${isToday ? 'text-teal-600' : ''}`}>{day}</div>
                  {dayEvents.length > 0 && <div className="flex justify-center gap-0.5 mt-1">{dayEvents.slice(0, 2).map((ev, j) => <div key={j} className={`w-1.5 h-1.5 rounded-full ${ev.status === 'upcoming' ? 'bg-blue-500' : ev.status === 'ongoing' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-4">
          <Link href="/calendar" className="text-teal-600 font-semibold hover:underline text-sm">সম্পূর্ণ ক্যালেন্ডার →</Link>
        </div>
      </div>
    </section>
  );
}
