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
    name_bn: "", name_en: "", eiin: "", address: "", phone: "", email: "", principal: ""
  });

  useEffect(() => {
    if (params?.id) {
      fetchSchool(params.id as string);
    }
  }, [params?.id]);

  const fetchSchool = async (id: string) => {
    const { data } = await supabase.from('schools').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        name_bn: data.name_bn || "", name_en: data.name_en || "", eiin: data.eiin || "",
        address: data.address || "", phone: data.phone || "", email: data.email || "",
        principal: data.principal || ""
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('schools').update(formData).eq('id', params?.id);
    if (error) setMessage('❌ ' + error.message);
    else { setMessage('✅ আপডেট হয়েছে!'); setTimeout(() => router.push("/admin/dashboard"), 1500); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
      </div>
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-6">✏️ স্কুল এডিট</h1>
          {message && <div className="p-4 mb-6 rounded-lg bg-green-50 text-green-700">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">নাম (বাংলা) *</label>
              <input type="text" required value={formData.name_bn}
                onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">EIIN</label>
              <input type="text" value={formData.eiin}
                onChange={(e) => setFormData({...formData, eiin: e.target.value})}
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">ফোন</label>
              <input type="text" value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">প্রধান শিক্ষক</label>
              <input type="text" value={formData.principal}
                onChange={(e) => setFormData({...formData, principal: e.target.value})}
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">ঠিকানা</label>
              <textarea rows={3} value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border rounded-lg" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">
              {loading ? '⏳...' : '💾 আপডেট করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}