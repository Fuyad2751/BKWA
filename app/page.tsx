'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [stats, setStats] = useState({ schools: 0, students: 0, scholars: 0, talentpool: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [realSchools, setRealSchools] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRealSchools();
  }, []);

  const fetchStats = async () => {
    const [schoolRes, studentRes] = await Promise.all([
      supabase.from('schools').select('*', { count: 'exact' }),
      supabase.from('students').select('*', { count: 'exact' })
    ]);
    setStats({
      schools: schoolRes.count || 0,
      students: studentRes.count || 0,
      scholars: 150,
      talentpool: 300
    });
  };

  const fetchRealSchools = async () => {
    const { data } = await supabase
      .from('schools')
      .select('id, name_bn, eiin, phone')
      .order('name_bn');
    if (data) setRealSchools(data);
  };

  const slides = [
    {
      title: "বাংলাদেশ কিন্ডার গার্টেন",
      subtitle: "ওয়েলফেয়ার এসোসিয়েশন",
      desc: "প্রথম থেকে পঞ্চম শ্রেণীর শিক্ষার্থীদের মেধা বিকাশে আমরা নিবেদিত",
      bg: "from-blue-600 via-indigo-700 to-purple-800",
      emoji: "🎓"
    },
    {
      title: "বৃত্তি পরীক্ষা ২০২৫",
      subtitle: "৩০+ স্কুলের অংশগ্রহণ",
      desc: "মেধাবী শিক্ষার্থীদের জন্য স্কলারশিপ ও ট্যালেন্টপুল বৃত্তির ব্যবস্থা",
      bg: "from-emerald-600 via-green-700 to-teal-800",
      emoji: "🏆"
    },
    {
      title: "সফলতার ১ বছর",
      subtitle: "১০০০+ সফল শিক্ষার্থী",
      desc: "দীর্ঘ এক দশক ধরে শিক্ষার মান উন্নয়নে কাজ করে যাচ্ছে আমাদের সংগঠন",
      bg: "from-orange-500 via-red-600 to-rose-700",
      emoji: "🌟"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== নেভবার ========== */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">B</div>
            <span className="text-xl font-bold text-gray-800">BKWA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-green-600 font-semibold">হোম</Link>
            <Link href="/schools" className="text-gray-600 hover:text-green-600 transition">স্কুল</Link>
            <Link href="/results" className="text-gray-600 hover:text-green-600 transition">ফলাফল</Link>
            <Link href="/merit-list" className="text-gray-600 hover:text-green-600 transition">মেরিট লিস্ট</Link>
            <Link href="/scholarship" className="text-gray-600 hover:text-green-600 transition">স্কলারশিপ</Link>
            <Link href="/certificates" className="text-gray-600 hover:text-green-600 transition">সার্টিফিকেট</Link>
            <Link href="/results" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200">
              ফলাফল দেখুন
            </Link>
          </div>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </nav>

      {/* ========== হিরো স্লাইডার ========== */}
      <section className={`bg-gradient-to-r ${slides[currentSlide].bg} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="text-6xl md:text-8xl mb-6 animate-bounce">{slides[currentSlide].emoji}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {slides[currentSlide].title}
              <br />
              <span className="text-yellow-300">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">{slides[currentSlide].desc}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/results" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl inline-block text-center">
                🔍 ফলাফল দেখুন
              </Link>
              <Link href="/schools" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition transform hover:scale-105 inline-block text-center">
                🏫 স্কুল সমূহ
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ========== স্ট্যাটস কাউন্টার ========== */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🏫", value: `${stats.schools}+`, label: "শিক্ষা প্রতিষ্ঠান", color: "from-green-500 to-emerald-600", shadow: "shadow-green-200" },
            { icon: "👨‍🎓", value: `${stats.students}+`, label: "পরীক্ষার্থী", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
            { icon: "🏆", value: `${stats.scholars}+`, label: "স্কলারশিপ", color: "from-yellow-500 to-orange-600", shadow: "shadow-yellow-200" },
            { icon: "⭐", value: `${stats.talentpool}+`, label: "ট্যালেন্টপুল", color: "from-purple-500 to-pink-600", shadow: "shadow-purple-200" }
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-xl ${stat.shadow} p-6 text-center transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== ফিচার সেকশন ========== */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">আমাদের সেবাসমূহ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">শিক্ষার্থীদের মেধা বিকাশে আমরা বিভিন্ন সেবা প্রদান করে থাকি</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🔍", title: "ফলাফল অনুসন্ধান", desc: "রোল নম্বর বা স্কুলের নাম দিয়ে সহজেই ফলাফল জানুন। দ্রুত এবং নির্ভুল ফলাফল সেবা।", link: "/results", color: "border-green-500" },
            { icon: "📋", title: "মেরিট লিস্ট", desc: "বর্ষসেরা মেধাবীদের তালিকা দেখুন। জেনে নিন কে পেয়েছে সর্বোচ্চ নম্বর।", link: "/merit-list", color: "border-blue-500" },
            { icon: "📚", title: "স্কলারশিপ তথ্য", desc: "স্কলারশিপ ও ট্যালেন্টপুল বৃত্তি সম্পর্কে বিস্তারিত জানুন। জেনে নিন যোগ্যতার মানদণ্ড।", link: "/scholarship", color: "border-purple-500" }
          ].map((feature, i) => (
            <Link key={i} href={feature.link} className="group">
              <div className={`bg-white rounded-2xl shadow-lg p-8 border-t-4 ${feature.color} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.desc}</p>
                <span className="text-green-600 font-semibold group-hover:underline">বিস্তারিত →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== অংশগ্রহণকারী স্কুল ========== */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">অংশগ্রহণকারী স্কুল</h2>
            <p className="text-gray-600">{stats.schools}টিরও বেশি শিক্ষা প্রতিষ্ঠান আমাদের সাথে যুক্ত</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {realSchools.length > 0 ? (
              realSchools.slice(0, 6).map((school) => (
                <Link key={school.id} href={`/schools/${school.id}`}
                  className="bg-gray-50 rounded-xl px-6 py-4 shadow hover:shadow-lg transition cursor-pointer border border-gray-100 hover:border-green-300"
                >
                  <span className="text-lg font-semibold text-gray-700">{school.name_bn}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">এখনো কোনো স্কুল যোগ করা হয়নি</p>
            )}
          </div>
          <div className="text-center mt-10">
            <Link href="/schools" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg inline-block">
              সকল স্কুল দেখুন →
            </Link>
          </div>
        </div>
      </section>
      {/* ========== CTA ========== */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">আপনার ফলাফল জানতে প্রস্তুত?</h2>
          <p className="text-xl opacity-90 mb-8">এখনই রোল নম্বর দিয়ে আপনার ফলাফল জেনে নিন</p>
          <Link href="/results" className="bg-white text-green-700 px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl inline-block">
            ফলাফল দেখুন 🚀
          </Link>
        </div>
      </section>

      {/* ========== ফুটার ========== */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center font-bold">B</div>
                <span className="text-xl font-bold">BKWA</span>
              </div>
              <p className="text-gray-400">বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">গুরুত্বপূর্ণ লিংক</h4>
              <div className="space-y-2 text-gray-400">
                <div><Link href="/results" className="hover:text-white">ফলাফল</Link></div>
                <div><Link href="/schools" className="hover:text-white">স্কুল</Link></div>
                <div><Link href="/merit-list" className="hover:text-white">মেরিট লিস্ট</Link></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">যোগাযোগ</h4>
              <div className="space-y-2 text-gray-400">
                <div>📞 +88 1717-547312</div>
                <div>✉️ info@bkwa.org</div>
                <div>📍 তুলসীঘাট,গাইবান্ধা</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">সোশ্যাল মিডিয়া</h4>
              <div className="flex gap-4 text-2xl">
                <span className="cursor-pointer hover:text-green-400">📘</span>
                <span className="cursor-pointer hover:text-green-400">📺</span>
                <span className="cursor-pointer hover:text-green-400">📱</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; ২০২৫ বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
