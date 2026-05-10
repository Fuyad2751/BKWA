'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditStudent() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    school_id: "",
    name_bn: "",
    father_name: "",
    mother_name: "",
    class: "1",
    roll: "",
    gender: "male",
    phone: ""
  });

  useEffect(() => {
    fetchSchools();
    if (params?.id) fetchStudent(params.id as string);
  }, [params?.id]);

  const fetchSchools = async () => {
    const { data } = await supabase.from('schools').select('id, name_bn').order('name_bn');
    if (data) setSchools(data);
  };

  const fetchStudent = async (id: string) => {
    const { data } = await supabase.from('students').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        school_id: data.school_id || "",
        name_bn: data.name_bn || "",
        father_name: data.father_name || "",
        mother_name: data.mother_name || "",
        class: data.class || "1",
        roll: data.roll || "",
        gender: data.gender || "male",
        phone: data.phone || ""
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('students').update(formData).eq('id', params?.id);
    if (error) setMessage('❌ ' + error.message);
    else {
      setMessage('✅ শিক্ষার্থী আপডেট হয়েছে!');
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-4">
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
            <h1 className="text-2xl font-bold mb-6">✏️ শিক্ষার্থী তথ্য এডিট</h1>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">🏫 স্কুল</label>
                  <select value={formData.school_id}
                    onChange={(e) => setFormData({...formData, school_id: e.target.value})}
                    required className="w-full p-3 border rounded-lg">
                    <option value="">স্কুল নির্বাচন করুন</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">নাম (বাংলা) *</label>
                  <input type="text" required value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">রোল নম্বর *</label>
                  <input type="text" required value={formData.roll}
                    onChange={(e) => setFormData({...formData, roll: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শ্রেণি</label>
                  <select value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full p-3 border rounded-lg">
                    <option value="1">প্রথম</option>
                    <option value="2">দ্বিতীয়</option>
                    <option value="3">তৃতীয়</option>
                    <option value="4">চতুর্থ</option>
                    <option value="5">পঞ্চম</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">লিঙ্গ</label>
                  <select value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-3 border rounded-lg">
                    <option value="male">ছেলে</option>
                    <option value="female">মেয়ে</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">পিতার নাম</label>
                  <input type="text" value={formData.father_name}
                    onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">মাতার নাম</label>
                  <input type="text" value={formData.mother_name}
                    onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ফোন</label>
                  <input type="text" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg" />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                  {loading ? '⏳ আপডেট হচ্ছে...' : '💾 আপডেট করুন'}
                </button>
                <button type="button" onClick={() => router.push("/admin/dashboard")}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-400">
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