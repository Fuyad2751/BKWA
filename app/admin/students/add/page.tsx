'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AddStudent() {
  const router = useRouter();
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
  }, []);

  const fetchSchools = async () => {
    const { data } = await supabase
      .from('schools')
      .select('id, name_bn')
      .order('name_bn');
    if (data) setSchools(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.school_id) {
      setMessage('❌ দয়া করে স্কুল নির্বাচন করুন');
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from('students')
      .insert([{
        school_id: formData.school_id,
        name_bn: formData.name_bn,
        father_name: formData.father_name,
        mother_name: formData.mother_name,
        class: formData.class,
        roll: formData.roll,
        gender: formData.gender,
        phone: formData.phone
      }])
      .select()
      .single();

    if (error) {
      setMessage('❌ সমস্যা: ' + error.message);
    } else {
      setMessage('✅ শিক্ষার্থী সফলভাবে যোগ হয়েছে!');
      setFormData({
        school_id: formData.school_id,
        name_bn: "", father_name: "", mother_name: "",
        class: "1", roll: "", gender: "male", phone: ""
      });
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
          <Link href="/admin/students/add" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">
            👨‍🎓 শিক্ষার্থী যোগ
          </Link>
        </nav>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">
            ← ড্যাশবোর্ডে ফিরুন
          </Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">👨‍🎓 নতুন শিক্ষার্থী যোগ করুন</h1>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* স্কুল সিলেক্ট */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">🏫 স্কুল নির্বাচন *</label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({...formData, school_id: e.target.value})}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">স্কুল নির্বাচন করুন</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>{school.name_bn}</option>
                    ))}
                  </select>
                </div>

                {/* নাম */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">নাম (বাংলা) *</label>
                  <input type="text" required value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="শিক্ষার্থীর নাম" />
                </div>

                {/* রোল */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">রোল নম্বর *</label>
                  <input type="text" required value={formData.roll}
                    onChange={(e) => setFormData({...formData, roll: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="যেমন: 101" />
                </div>

                {/* শ্রেণি */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শ্রেণি *</label>
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

                {/* লিঙ্গ */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">লিঙ্গ *</label>
                  <select value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-3 border rounded-lg">
                    <option value="male">ছেলে</option>
                    <option value="female">মেয়ে</option>
                  </select>
                </div>

                {/* পিতা */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">পিতার নাম</label>
                  <input type="text" value={formData.father_name}
                    onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="পিতার নাম" />
                </div>

                {/* মাতা */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">মাতার নাম</label>
                  <input type="text" value={formData.mother_name}
                    onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="মাতার নাম" />
                </div>

                {/* ফোন */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ফোন নম্বর</label>
                  <input type="text" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg" placeholder="অভিভাবকের ফোন" />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                  {loading ? '⏳ যোগ হচ্ছে...' : '✅ শিক্ষার্থী যোগ করুন'}
                </button>
                <button type="reset"
                  onClick={() => setFormData({school_id: "", name_bn: "", father_name: "", mother_name: "", class: "1", roll: "", gender: "male", phone: ""})}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-400">
                  ✖️ রিসেট
                </button>
              </div>
            </form>
          </div>

          {/* সাম্প্রতিক শিক্ষার্থী তালিকা */}
          <RecentStudents />
        </div>
      </div>
    </div>
  );
}

// সাম্প্রতিক শিক্ষার্থী কম্পোনেন্ট
function RecentStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*, schools(name_bn)')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setStudents(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" - শিক্ষার্থী ডিলিট করতে চান?`)) return;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      alert('ডিলিট করতে সমস্যা: ' + error.message);
    } else {
      alert('✅ ডিলিট হয়েছে!');
      fetchStudents();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-8">
      <h2 className="text-xl font-bold mb-4">📋 সাম্প্রতিক শিক্ষার্থী</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">নাম</th>
              <th className="p-3 text-left">রোল</th>
              <th className="p-3 text-left">শ্রেণি</th>
              <th className="p-3 text-left">স্কুল</th>
              <th className="p-3 text-left">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">লোড হচ্ছে...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">কোনো শিক্ষার্থী নেই</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">{student.name_bn}</td>
                  <td className="p-3">{student.roll}</td>
                  <td className="p-3">{student.class}য়</td>
                  <td className="p-3 text-gray-600">{student.schools?.name_bn || '-'}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(student.id, student.name_bn)}
                      className="text-red-600 hover:underline">🗑️ ডিলিট</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}