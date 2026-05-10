'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AddExam() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title_bn: "",
    year: new Date().getFullYear().toString(),
    exam_date: "",
    status: "upcoming",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from('scholarship_exams')
      .insert([{
        title_bn: formData.title_bn,
        year: parseInt(formData.year),
        exam_date: formData.exam_date || null,
        status: formData.status,
        description: formData.description
      }])
      .select()
      .single();

    if (error) {
      setMessage('❌ সমস্যা: ' + error.message);
    } else {
      setMessage('✅ পরীক্ষা সফলভাবে যোগ হয়েছে!');
      setFormData({
        title_bn: "",
        year: new Date().getFullYear().toString(),
        exam_date: "",
        status: "upcoming",
        description: ""
      });
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* সাইডবার */}
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
            📊 ড্যাশবোর্ড
          </Link>
          <Link href="/admin/exams/add" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">
            📝 পরীক্ষা যোগ
          </Link>
          <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
            📊 ফলাফল আপলোড
          </Link>
          <Link href="/admin/merit-list" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
            🏆 মেরিট লিস্ট
          </Link>
        </nav>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">📝 নতুন পরীক্ষা তৈরি করুন</h1>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">পরীক্ষার নাম *</label>
                <input type="text" required value={formData.title_bn}
                  onChange={(e) => setFormData({...formData, title_bn: e.target.value})}
                  className="w-full p-3 border rounded-lg" 
                  placeholder="যেমন: বৃত্তি পরীক্ষা ২০২৫" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">বছর *</label>
                  <select value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full p-3 border rounded-lg">
                    <option value="2024">২০২৪</option>
                    <option value="2025">২০২৫</option>
                    <option value="2026">২০২৬</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">পরীক্ষার তারিখ</label>
                  <input type="date" value={formData.exam_date}
                    onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">স্ট্যাটাস *</label>
                <select value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-3 border rounded-lg">
                  <option value="upcoming">📅 আসন্ন</option>
                  <option value="ongoing">🔄 চলমান</option>
                  <option value="completed">✅ সম্পন্ন</option>
                  <option value="published">📢 প্রকাশিত</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">বিবরণ</label>
                <textarea rows={3} value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border rounded-lg" 
                  placeholder="পরীক্ষা সম্পর্কে বিস্তারিত (ঐচ্ছিক)" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                {loading ? '⏳ তৈরি হচ্ছে...' : '✅ পরীক্ষা তৈরি করুন'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}