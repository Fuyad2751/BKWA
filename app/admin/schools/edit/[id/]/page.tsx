'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditSchool() {
  const router = useRouter();
  const params = useParams();
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

  useEffect(() => {
    if (params?.id) {
      fetchSchool(params.id as string);
    }
  }, [params?.id]);

  const fetchSchool = async (id: string) => {
    const { data } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      setFormData({
        name_bn: data.name_bn || "",
        name_en: data.name_en || "",
        eiin: data.eiin || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        principal: data.principal || ""
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from('schools')
      .update(formData)
      .eq('id', params?.id);

    if (error) {
      setMessage('❌ সমস্যা: ' + error.message);
    } else {
      setMessage('✅ স্কুল সফলভাবে আপডেট হয়েছে!');
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
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">✏️ স্কুল তথ্য এডিট করুন</h1>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">নাম (বাংলা) *</label>
                  <input type="text" required value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">EIIN</label>
                  <input type="text" value={formData.eiin}
                    onChange={(e) => setFormData({...formData, eiin: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ফোন</label>
                  <input type="text" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">প্রধান শিক্ষক</label>
                  <input type="text" value={formData.principal}
                    onChange={(e) => setFormData({...formData, principal: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">ঠিকানা</label>
                  <textarea rows={3} value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                  {loading ? '⏳ আপডেট হচ্ছে...' : '💾 আপডেট করুন'}
                </button>
                <button type="button" onClick={() => router.push("/admin/dashboard")}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}