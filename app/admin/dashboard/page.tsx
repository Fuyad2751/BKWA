'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const [schoolRes, studentRes] = await Promise.all([
      supabase.from('schools').select('*').order('created_at', { ascending: false }),
      supabase.from('students').select('*, schools(name_bn)').order('created_at', { ascending: false }).limit(20)
    ]);
    if (schoolRes.data) setSchools(schoolRes.data);
    if (studentRes.data) setStudents(studentRes.data);
    setLoading(false);
  };

  const handleDeleteSchool = async (id: string, name: string) => {
    if (!confirm(`"${name}" - স্কুলটি ডিলিট করতে চান?`)) return;
    const { error } = await supabase.from('schools').delete().eq('id', id);
    if (error) alert('❌ ' + error.message);
    else { alert('✅ ডিলিট হয়েছে!'); fetchData(); }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`"${name}" - ডিলিট করতে চান?`)) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) alert('❌ ' + error.message);
    else { alert('✅ ডিলিট হয়েছে!'); fetchData(); }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* সাইডবার */}
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">📊 ড্যাশবোর্ড</Link>
          <Link href="/admin/exams/register" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📋 রেজিস্ট্রেশন</Link>
          <Link href="/admin/schools/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">🏫 স্কুল যোগ</Link>
          <Link href="/admin/students/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">👨‍🎓 শিক্ষার্থী যোগ</Link>
          <Link href="/admin/exams/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📝 পরীক্ষা যোগ</Link>
          <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ফলাফল আপলোড</Link>
          <Link href="/admin/merit-list" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">🏆 মেরিট লিস্ট</Link>
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 w-full mt-4 border-t border-gray-700 pt-4">🚪 লগআউট</button>
        </nav>
      </div>

      {/* মেইন */}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        </div>

        {/* স্ট্যাটস */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-2">🏫</div>
            <div className="text-3xl font-bold">{schools.length}</div>
            <div className="text-gray-600">মোট স্কুল</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-2">👨‍🎓</div>
            <div className="text-3xl font-bold">{students.length}</div>
            <div className="text-gray-600">শিক্ষার্থী</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold">-</div>
            <div className="text-gray-600">স্কলারশিপ</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold">-</div>
            <div className="text-gray-600">ট্যালেন্টপুল</div>
          </div>
        </div>

        {/* স্কুল তালিকা */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">🏫 স্কুল তালিকা</h2>
            <Link href="/admin/schools/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ স্কুল যোগ</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">নাম</th>
                  <th className="p-4 text-left">EIIN</th>
                  <th className="p-4 text-left">ফোন</th>
                  <th className="p-4 text-left">প্রধান শিক্ষক</th>
                  <th className="p-4 text-left">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-4 text-center">⏳ লোড হচ্ছে...</td></tr>
                ) : schools.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center">কোনো স্কুল নেই</td></tr>
                ) : (
                  schools.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-semibold">{s.name_bn}</td>
                      <td className="p-4">{s.eiin || '-'}</td>
                      <td className="p-4">{s.phone || '-'}</td>
                      <td className="p-4">{s.principal || '-'}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/schools/edit/${s.id}`} 
                            className="text-blue-600 hover:underline text-sm">✏️ এডিট</Link>
                          <button onClick={() => handleDeleteSchool(s.id, s.name_bn)} 
                            className="text-red-600 hover:underline text-sm">🗑️ ডিলিট</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* শিক্ষার্থী তালিকা */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">👨‍🎓 শিক্ষার্থী তালিকা</h2>
            <Link href="/admin/students/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ শিক্ষার্থী যোগ</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">নাম</th>
                  <th className="p-4 text-left">রোল</th>
                  <th className="p-4 text-left">শ্রেণি</th>
                  <th className="p-4 text-left">স্কুল</th>
                  <th className="p-4 text-left">লিঙ্গ</th>
                  <th className="p-4 text-left">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-4 text-center">⏳ লোড হচ্ছে...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center">কোনো শিক্ষার্থী নেই</td></tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-semibold">{s.name_bn}</td>
                      <td className="p-4">{s.roll}</td>
                      <td className="p-4">{s.class}য়</td>
                      <td className="p-4 text-gray-600">{s.schools?.name_bn || '-'}</td>
                      <td className="p-4">{s.gender === 'male' ? 'ছেলে' : 'মেয়ে'}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/students/edit/${s.id}`}
                            className="text-blue-600 hover:underline text-sm">✏️ এডিট</Link>
                          <button onClick={() => handleDeleteStudent(s.id, s.name_bn)}
                            className="text-red-600 hover:underline text-sm">🗑️ ডিলিট</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
