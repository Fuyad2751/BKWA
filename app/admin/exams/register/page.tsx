'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CLASS_NAMES: any = { '1': 'প্রথম', '2': 'দ্বিতীয়', '3': 'তৃতীয়', '4': 'চতুর্থ', '5': 'পঞ্চম' };

export default function ExamRegistration() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [existingRegs, setExistingRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [e, s] = await Promise.all([
      supabase.from('scholarship_exams').select('*').order('year', { ascending: false }),
      supabase.from('schools').select('id, name_bn').order('name_bn')
    ]);
    if (e.data) setExams(e.data);
    if (s.data) setSchools(s.data);
  };

  const loadStudents = async (schoolId: string) => {
    setSelectedSchool(schoolId);
    if (schoolId && selectedExam) {
      const { data } = await supabase.from('students').select('*').eq('school_id', schoolId).order('class').order('name_bn');
      if (data) {
        const { data: regs } = await supabase.from('exam_registrations').select('*').eq('exam_id', selectedExam).eq('school_id', schoolId);
        setExistingRegs(regs || []);
        const rollMap: any = {};
        regs?.forEach((r: any) => { rollMap[r.student_id] = r.roll; });
        const list = data.map((s: any) => ({ ...s, registered: !!rollMap[s.id], assignedRoll: rollMap[s.id] || '' }));
        setStudents(list);
      }
    }
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    if (examId && selectedSchool) loadStudents(selectedSchool);
  };

  const updateRoll = (studentId: string, value: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, assignedRoll: value } : s));
  };

  const saveRegistrations = async () => {
    if (!selectedExam || !selectedSchool) return alert('পরীক্ষা ও স্কুল সিলেক্ট করুন');
    setLoading(true);
    const toSave = students.filter(s => !s.registered && s.assignedRoll).map(s => ({
      exam_id: selectedExam, student_id: s.id, school_id: s.school_id, roll: s.assignedRoll, class: s.class
    }));
    if (toSave.length === 0) { alert('কোনো নতুন রেজিস্ট্রেশন নেই'); setLoading(false); return; }
    const { error } = await supabase.from('exam_registrations').insert(toSave);
    if (error) setMessage('❌ ' + error.message);
    else { setMessage(`✅ ${toSave.length} জন রেজিস্ট্রেশন হয়েছে!`); loadStudents(selectedSchool); }
    setLoading(false);
  };

  const filteredStudents = selectedClass === 'all' ? students : students.filter(s => s.class === selectedClass);
  const groupedStudents: any = {};
  filteredStudents.forEach(s => {
    const cls = s.class;
    if (!groupedStudents[cls]) groupedStudents[cls] = [];
    groupedStudents[cls].push(s);
  });

  const registeredCount = students.filter(s => s.registered).length;
  const pendingCount = students.filter(s => !s.registered).length;

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/exams/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 mt-2">📝 পরীক্ষা যোগ</Link>
        <Link href="/admin/exams/register" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📋 রেজিস্ট্রেশন</Link>
        <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 mt-2">📊 ফলাফল</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">📋 পরীক্ষা রেজিস্ট্রেশন</h1>

            {message && <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2">📅 পরীক্ষা *</label>
                <select value={selectedExam} onChange={(e) => handleExamChange(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">পরীক্ষা সিলেক্ট করুন</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">🏫 স্কুল *</label>
                <select value={selectedSchool} onChange={(e) => loadStudents(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">স্কুল সিলেক্ট করুন</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                </select>
              </div>
            </div>

            {students.length > 0 && (
              <>
                {/* স্ট্যাটাস বার + ফিল্টার */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 font-bold">✅ নিবন্ধিত: {registeredCount}</span>
                    <span className="text-yellow-600 font-bold">⚠️ বাকি: {pendingCount}</span>
                    <span className="text-gray-600">| মোট: {students.length}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setSelectedClass('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${selectedClass === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>সব</button>
                    {['1','2','3','4','5'].map(cls => (
                      <button key={cls} onClick={() => setSelectedClass(cls)} className={`px-3 py-1 rounded-full text-xs font-bold ${selectedClass === cls ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>{CLASS_NAMES[cls]}</button>
                    ))}
                  </div>
                </div>

                {/* শ্রেণীভিত্তিক টেবিল */}
                {selectedClass === 'all' ? (
                  [1,2,3,4,5].map(cls => {
                    const list = groupedStudents[String(cls)] || [];
                    if (list.length === 0) return null;
                    const clsRegistered = list.filter((s: any) => s.registered).length;
                    return (
                      <div key={cls} className="mb-6 border rounded-xl overflow-hidden">
                        <div className="bg-green-50 p-4 flex justify-between items-center">
                          <h3 className="font-bold text-green-700">{CLASS_NAMES[String(cls)]} শ্রেণী ({list.length} জন)</h3>
                          <span className="text-sm text-green-600">✅ {clsRegistered} নিবন্ধিত</span>
                        </div>
                        <div className="overflow-x-auto bg-white">
                          <table className="w-full text-sm">
                            <thead><tr className="bg-gray-50"><th className="p-2 text-left">নাম</th><th className="p-2 text-center w-20">রোল</th><th className="p-2 text-center w-24">স্ট্যাটাস</th></tr></thead>
                            <tbody>
                              {list.map((s: any) => (
                                <tr key={s.id} className={`border-t ${s.registered ? 'bg-green-50/50' : ''}`}>
                                  <td className="p-2 font-semibold">{s.name_bn}</td>
                                  <td className="p-2 text-center">
                                    {s.registered ? (
                                      <span className="font-bold text-green-700">{s.assignedRoll}</span>
                                    ) : (
                                      <input type="text" value={s.assignedRoll} onChange={(e) => updateRoll(s.id, e.target.value)}
                                        className="w-16 p-1 border rounded text-center text-sm" placeholder="রোল" />
                                    )}
                                  </td>
                                  <td className="p-2 text-center">
                                    {s.registered ? <span className="text-green-600 text-xs font-bold">✅</span> : <span className="text-yellow-600 text-xs">⚠️</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border rounded-xl overflow-hidden">
                    <div className="bg-green-50 p-4"><h3 className="font-bold text-green-700">{CLASS_NAMES[selectedClass]} শ্রেণী ({filteredStudents.length} জন)</h3></div>
                    <div className="overflow-x-auto bg-white">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-gray-50"><th className="p-2 text-left">নাম</th><th className="p-2 text-center w-20">রোল</th><th className="p-2 text-center w-24">স্ট্যাটাস</th></tr></thead>
                        <tbody>
                          {filteredStudents.map((s: any) => (
                            <tr key={s.id} className={`border-t ${s.registered ? 'bg-green-50/50' : ''}`}>
                              <td className="p-2 font-semibold">{s.name_bn}</td>
                              <td className="p-2 text-center">
                                {s.registered ? <span className="font-bold text-green-700">{s.assignedRoll}</span> : <input type="text" value={s.assignedRoll} onChange={(e) => updateRoll(s.id, e.target.value)} className="w-16 p-1 border rounded text-center text-sm" placeholder="রোল" />}
                              </td>
                              <td className="p-2 text-center">{s.registered ? <span className="text-green-600 text-xs font-bold">✅</span> : <span className="text-yellow-600 text-xs">⚠️</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button onClick={saveRegistrations} disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 w-full">
                    {loading ? '⏳ সেভ হচ্ছে...' : '💾 রেজিস্ট্রেশন সেভ করুন'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
