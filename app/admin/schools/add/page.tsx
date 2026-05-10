'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AddSchool() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name_bn: "",
    name_en: "",
    eiin: "",
    address: "",
    phone: "",
    email: "",
    principal: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from('schools')
      .insert([{
        name_bn: formData.name_bn,
        name_en: formData.name_en,
        eiin: formData.eiin,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        principal: formData.principal
      }])
      .select()
      .single();

    if (error) {
      setMessage('❌ সমস্যা: ' + error.message);
    } else {
      setMessage('✅ স্কুল সফলভাবে যোগ হয়েছে!');
      setFormData({
        name_bn: "", name_en: "", eiin: "", address: "", 
        phone: "", email: "", principal: ""
      });
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
          📊 ড্যাশবোর্ড
        </Link>
        <Link href="/admin/schools/add" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">
          🏫 স্কুল যোগ
        </Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">🏫 নতুন স্কুল যোগ করুন</h1>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">স্কুলের নাম (বাংলা) *</label>
                  <input type="text" required value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="যেমন: আদর্শ কিন্টারগার্ডেন" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">EIIN নম্বর</label>
                  <input type="text" value={formData.eiin}
                    onChange={(e) => setFormData({...formData, eiin: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="যেমন: 123456" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ফোন</label>
                  <input type="text" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="০১৭১২৩৪৫৬৭৮" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ইমেইল</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="school@email.com" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">প্রধান শিক্ষক</label>
                  <input type="text" value={formData.principal}
                    onChange={(e) => setFormData({...formData, principal: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="প্রধান শিক্ষকের নাম" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ঠিকানা</label>
                <textarea rows={3} value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border rounded-lg" placeholder="পূর্ণ ঠিকানা" />
              </div>

              <button type="submit" disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                {loading ? '⏳ যোগ হচ্ছে...' : '✅ স্কুল যোগ করুন'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}