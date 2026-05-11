'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CLASS_NAMES: any = { '1': 'প্রথম', '2': 'দ্বিতীয়', '3': 'তৃতীয়', '4': 'চতুর্থ', '5': 'পঞ্চম' };

export default function AdminDashboard() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schools' | 'students'>('schools');
  const [selectedClass, setSelectedClass] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    const [schoolRes, studentRes] = await Promise.all([
      supabase.from('schools').select('*').order('created_at', { ascending: false }),
      supabase.from('students').select('*, schools(name_bn)').order('class').order('roll')
    ]);
    if (schoolRes.data) setSchools(schoolRes.data);
    if (studentRes.data) setStudents(studentRes.data);
    setLoading(false);
  };

  const handleDeleteSchool = async (id: string, name: string) => {
    if (!confirm(`"${name}" - স্কুলটি ডিলিট করতে চান?`)) return;
    await supabase.from('schools').delete().eq('id', id);
    fetchData();
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`"${name}" - ডিলিট করতে চান?`)) return;
    await supabase.from('students').delete().eq('id', id);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const filteredStudents = selectedClass === 'all' ? students : students.filter(s => s.class === selectedClass);

  // শ্রেণীভিত্তিক গ্রুপিং
  const groupedStudents: any = {};
  filteredStudents.forEach(s => {
    const cls = s.class;
    if (!groupedStudents[cls]) groupedStudents[cls] = [];
    groupedStudents[cls].push(s);
  });

  return (
    <div className="flex min-h-screen">
      {/* সাইডবার */}
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">📊 ড্যাশবোর্ড</Link>
          <Link href="/admin/schools/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">🏫 স্কুল যোগ</Link>
          <Link href="/admin/students/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">👨‍🎓 শিক্ষার্থী যোগ</Link>
          <Link href="/admin/exams/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📝 পরীক্ষা যোগ</Link>
          <Link href="/admin/exams/register" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📋 রেজিস্ট্রেশন</Link>
          <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ফলাফল আপলোড</Link>
          <Link href="/admin/merit-list" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">🏆 মেরিট লিস্ট</Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📈 অ্যানালিটিক্স</Link>
          <Link href="/admin/notices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📢 নোটিশ</Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📸 গ্যালারি</Link>
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
          <div className="bg-white rounded-xl shadow p-6"><div className="text-4xl mb-2">🏫</div><div className="text-3xl font-bold">{schools.length}</div><div className="text-gray-600">মোট স্কুল</div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="text-4xl mb-2">👨‍🎓</div><div className="text-3xl font-bold">{students.length}</div><div className="text-gray-600">শিক্ষার্থী</div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="text-4xl mb-2">🏆</div><div className="text-3xl font-bold">-</div><div className="text-gray-600">স্কলারশিপ</div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="text-4xl mb-2">⭐</div><div className="text-3xl font-bold">-</div><div className="text-gray-600">ট্যালেন্টপুল</div></div>
        </div>

        {/* ট্যাব */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('schools')} className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'schools' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 shadow'}`}>🏫 স্কুল তালিকা</button>
          <button onClick={() => setActiveTab('students')} className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'students' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 shadow'}`}>👨‍🎓 শিক্ষার্থী তালিকা</button>
        </div>

        {/* স্কুল ট্যাব */}
        {activeTab === 'schools' && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">🏫 স্কুল তালিকা</h2>
              <Link href="/admin/schools/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ স্কুল যোগ</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50"><th className="p-4 text-left">নাম</th><th className="p-4 text-left">EIIN</th><th className="p-4 text-left">ফোন</th><th className="p-4 text-left">প্রধান শিক্ষক</th><th className="p-4 text-left">অ্যাকশন</th></tr></thead>
                <tbody>
                  {schools.map(s => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-semibold">{s.name_bn}</td>
                      <td className="p-4">{s.eiin || '-'}</td>
                      <td className="p-4">{s.phone || '-'}</td>
                      <td className="p-4">{s.principal || '-'}</td>
                      <td className="p-4"><div className="flex gap-2"><Link href={`/admin/schools/edit/${s.id}`} className="text-blue-600 hover:underline text-sm">✏️ এডিট</Link><button onClick={() => handleDeleteSchool(s.id, s.name_bn)} className="text-red-600 hover:underline text-sm">🗑️ ডিলিট</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* শিক্ষার্থী ট্যাব - শ্রেণীভিত্তিক */}
        {activeTab === 'students' && (
          <div>
            {/* শ্রেণী ফিল্টার */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => setSelectedClass('all')} className={`px-4 py-2 rounded-full text-sm font-bold ${selectedClass === 'all' ? 'bg-green-600 text-white' : 'bg-white shadow text-gray-700'}`}>সব শ্রেণী</button>
              {['1','2','3','4','5'].map(cls => (
                <button key={cls} onClick={() => setSelectedClass(cls)} className={`px-4 py-2 rounded-full text-sm font-bold ${selectedClass === cls ? 'bg-green-600 text-white' : 'bg-white shadow text-gray-700'}`}>{CLASS_NAMES[cls]}</button>
              ))}
            </div>

            {/* শ্রেণীভিত্তিক কার্ড */}
            {selectedClass === 'all' ? (
              // সব শ্রেণী - গ্রুপ আকারে
              [1,2,3,4,5].map(cls => {
                const list = groupedStudents[String(cls)] || [];
                if (list.length === 0) return null;
                return (
                  <div key={cls} className="bg-white rounded-xl shadow mb-6">
                    <div className="p-6 border-b bg-green-50 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-green-700">{CLASS_NAMES[String(cls)]} শ্রেণী</h2>
                        <p className="text-sm text-gray-600">মোট {list.length} জন শিক্ষার্থী</p>
                      </div>
                      <Link href="/admin/students/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ যোগ</Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="bg-gray-50"><th className="p-3 text-left">ক্রমিক</th><th className="p-3 text-left">নাম</th><th className="p-3 text-left">রোল</th><th className="p-3 text-left">স্কুল</th><th className="p-3 text-left">লিঙ্গ</th><th className="p-3 text-left">অ্যাকশন</th></tr></thead>
                        <tbody>
                          {list.map((s: any, i: number) => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                              <td className="p-3">{i + 1}</td>
                              <td className="p-3 font-semibold">{s.name_bn}</td>
                              <td className="p-3">{s.roll || '-'}</td>
                              <td className="p-3 text-gray-600">{s.schools?.name_bn || '-'}</td>
                              <td className="p-3">{s.gender === 'male' ? 'ছেলে' : 'মেয়ে'}</td>
                              <td className="p-3"><div className="flex gap-2"><Link href={`/admin/students/edit/${s.id}`} className="text-blue-600 hover:underline text-sm">✏️</Link><button onClick={() => handleDeleteStudent(s.id, s.name_bn)} className="text-red-600 hover:underline text-sm">🗑️</button></div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              // নির্দিষ্ট শ্রেণী
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b bg-green-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-green-700">{CLASS_NAMES[selectedClass]} শ্রেণী</h2>
                    <p className="text-sm text-gray-600">মোট {filteredStudents.length} জন শিক্ষার্থী</p>
                  </div>
                  <Link href="/admin/students/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">+ যোগ</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50"><th className="p-3 text-left">ক্রমিক</th><th className="p-3 text-left">নাম</th><th className="p-3 text-left">রোল</th><th className="p-3 text-left">স্কুল</th><th className="p-3 text-left">লিঙ্গ</th><th className="p-3 text-left">অ্যাকশন</th></tr></thead>
                    <tbody>
                      {filteredStudents.map((s: any, i: number) => (
                        <tr key={s.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{i + 1}</td>
                          <td className="p-3 font-semibold">{s.name_bn}</td>
                          <td className="p-3">{s.roll || '-'}</td>
                          <td className="p-3 text-gray-600">{s.schools?.name_bn || '-'}</td>
                          <td className="p-3">{s.gender === 'male' ? 'ছেলে' : 'মেয়ে'}</td>
                          <td className="p-3"><div className="flex gap-2"><Link href={`/admin/students/edit/${s.id}`} className="text-blue-600 hover:underline text-sm">✏️</Link><button onClick={() => handleDeleteStudent(s.id, s.name_bn)} className="text-red-600 hover:underline text-sm">🗑️</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
