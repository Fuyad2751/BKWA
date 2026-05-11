'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ExamRegistration() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [existingRegs, setExistingRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

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
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('class')
        .order('name_bn');
      if (data) {
        // আগের রেজিস্ট্রেশন চেক
        const { data: regs } = await supabase
          .from('exam_registrations')
          .select('*')
          .eq('exam_id', selectedExam)
          .eq('school_id', schoolId);
        setExistingRegs(regs || []);

        // রোল ম্যাপ তৈরি
        const rollMap: any = {};
        regs?.forEach((r: any) => { rollMap[r.student_id] = r.roll; });

        const list = data.map((s: any) => ({
          ...s,
          registered: !!rollMap[s.id],
          assignedRoll: rollMap[s.id] || ''
        }));
        setStudents(list);
      }
    }
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    if (examId && selectedSchool) loadStudents(selectedSchool);
  };

  const updateRoll = (index: number, value: string) => {
    const updated = [...students];
    updated[index].assignedRoll = value;
    setStudents(updated);
  };

  const saveRegistrations = async () => {
    if (!selectedExam || !selectedSchool) return alert('পরীক্ষা ও স্কুল সিলেক্ট করুন');
    
    setLoading(true);
    const toSave = students
      .filter(s => !s.registered && s.assignedRoll)
      .map(s => ({
        exam_id: selectedExam,
        student_id: s.id,
        school_id: s.school_id,
        roll: s.assignedRoll,
        class: s.class
      }));

    if (toSave.length === 0) {
      alert('কোনো নতুন রেজিস্ট্রেশন নেই');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('exam_registrations').insert(toSave);
    if (error) {
      setMessage('❌ ' + error.message);
    } else {
      setMessage(`✅ ${toSave.length} জন শিক্ষার্থী রেজিস্ট্রেশন হয়েছে!`);
      loadStudents(selectedSchool);
    }
    setLoading(false);
  };

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

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2">📅 পরীক্ষা *</label>
                <select value={selectedExam} onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full p-3 border rounded-lg">
                  <option value="">পরীক্ষা সিলেক্ট করুন</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">🏫 স্কুল *</label>
                <select value={selectedSchool} onChange={(e) => loadStudents(e.target.value)}
                  className="w-full p-3 border rounded-lg">
                  <option value="">স্কুল সিলেক্ট করুন</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                </select>
              </div>
            </div>

            {students.length > 0 && (
              <>
             
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-green-600 text-white">
                        <th className="p-2 border">নাম</th>
                        <th className="p-2 border">শ্রেণি</th>
                        <th className="p-2 border">রোল</th>
                        <th className="p-2 border">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .sort((a, b) => {
                          if (a.class !== b.class) return parseInt(a.class) - parseInt(b.class);
                          return (a.assignedRoll || '').localeCompare(b.assignedRoll || '');
                        })
                        .map((s, i) => (
                        <tr key={s.id} className={`border-t ${s.registered ? 'bg-green-50' : ''}`}>
                          <td className="p-2 border font-semibold">{s.name_bn}</td>
                          <td className="p-2 border text-center">{s.class}য়</td>
                          <td className="p-2 border">
                            {s.registered ? (
                              <span className="font-bold text-green-700">{s.assignedRoll}</span>
                            ) : (
                              <input type="text" value={s.assignedRoll}
                                onChange={(e) => updateRoll(i, e.target.value)}
                                className="w-20 p-1 border rounded text-center" />
                            )}
                          </td>
                          <td className="p-2 border text-center">
                            {s.registered ? (
                              <span className="text-green-600 font-bold">✅ নিবন্ধিত</span>
                            ) : (
                              <span className="text-yellow-600">⚠️ অপেক্ষমান</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    ✅ নিবন্ধিত: {students.filter(s => s.registered).length} | 
                    ⚠️ বাকি: {students.filter(s => !s.registered).length}
                  </p>
                  <button onClick={saveRegistrations} disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
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
