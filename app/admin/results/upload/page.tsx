'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function UploadResults() {
  const [exams, setExams] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('manual');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [examRes, schoolRes] = await Promise.all([
      supabase.from('scholarship_exams').select('*').order('year', { ascending: false }),
      supabase.from('schools').select('id, name_bn').order('name_bn')
    ]);
    if (examRes.data) setExams(examRes.data);
    if (schoolRes.data) setSchools(schoolRes.data);
  };

  // স্কুল সিলেক্ট করলে শিক্ষার্থী লোড
  const handleSchoolChange = async (schoolId: string) => {
    setSelectedSchool(schoolId);
    if (schoolId) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('class')
        .order('roll');
      if (data) {
        setStudents(data);
        // অটোমেটিক রেজাল্ট ফর্ম তৈরি
        const resultData = data.map(s => ({
          student_id: s.id,
          school_id: s.school_id,
          student_name: s.name_bn,
          roll: s.roll,
          class: s.class,
          bangla: '',
          english: '',
          math: '',
          science: '',
          total: 0,
          grade: ''
        }));
        setResults(resultData);
      }
    }
  };

  // নম্বর আপডেট
  const updateMark = (index: number, subject: string, value: string) => {
    const newResults = [...results];
    const student = newResults[index];
    const studentClass = parseInt(student.class);
    
    // নম্বর সেট
    if (subject === 'bangla') student.bangla = value;
    if (subject === 'english') student.english = value;
    if (subject === 'math') student.math = value;
    if (subject === 'science') student.science = value;

    // টোটাল ক্যালকুলেশন
    const b = parseFloat(student.bangla) || 0;
    const e = parseFloat(student.english) || 0;
    const m = parseFloat(student.math) || 0;
    const s = parseFloat(student.science) || 0;

    if (studentClass >= 3) {
      // তৃতীয়-পঞ্চম: ৪ বিষয় → মোট ৪০০, স্কেল ১০০ তে
      student.total = ((b + e + m + s) / 4).toFixed(2);
    } else {
      // প্রথম-দ্বিতীয়: ৩ বিষয় → মোট ৩০০, স্কেল ১০০ তে
      student.total = ((b + e + m) / 3).toFixed(2);
    }

    // গ্রেড
    const total = parseFloat(student.total);
    if (total >= 80) student.grade = 'Scholarship';
    else if (total >= 60) student.grade = 'Talentpool';
    else if (total >= 40) student.grade = 'General';
    else student.grade = 'Fail';

    setResults(newResults);
  };

  // সব রেজাল্ট সেভ
  const saveResults = async () => {
    if (!selectedExam) return alert('পরীক্ষা সিলেক্ট করুন');
    if (!selectedSchool) return alert('স্কুল সিলেক্ট করুন');
    
    setLoading(true);
    const dataToSave = results.map(r => ({
      exam_id: selectedExam,
      student_id: r.student_id,
      school_id: r.school_id,
      bangla_marks: parseFloat(r.bangla) || 0,
      english_marks: parseFloat(r.english) || 0,
      math_marks: parseFloat(r.math) || 0,
      science_marks: parseFloat(r.science) || 0,
      total_marks: parseFloat(r.total),
      grade: r.grade,
      subject_count: parseInt(r.class) >= 3 ? 4 : 3
    }));

    const { error } = await supabase.from('results').upsert(dataToSave, { onConflict: 'exam_id,student_id' });
    
    if (error) {
      alert('❌ ' + error.message);
    } else {
      setSuccess('✅ ' + results.length + ' জন শিক্ষার্থীর ফলাফল সেভ হয়েছে!');
      setTimeout(() => setSuccess(''), 5000);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📊 ফলাফল</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">📊 ফলাফল এন্ট্রি</h1>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">{success}</div>
            )}

            {/* সিলেক্ট */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">📅 পরীক্ষা *</label>
                <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full p-3 border rounded-lg">
                  <option value="">পরীক্ষা সিলেক্ট করুন</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">🏫 স্কুল সিলেক্ট করুন</label>
                <select value={selectedSchool} onChange={(e) => handleSchoolChange(e.target.value)}
                  className="w-full p-3 border rounded-lg">
                  <option value="">স্কুল সিলেক্ট করুন</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                </select>
              </div>
            </div>

            {/* রেজাল্ট টেবিল */}
            {results.length > 0 && (
              <>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-green-600 text-white">
                        <th className="p-2 border text-sm">রোল</th>
                        <th className="p-2 border text-sm">নাম</th>
                        <th className="p-2 border text-sm">শ্রেণি</th>
                        <th className="p-2 border text-sm">বাংলা</th>
                        <th className="p-2 border text-sm">ইংরেজি</th>
                        <th className="p-2 border text-sm">গণিত</th>
                        {results.some(r => parseInt(r.class) >= 3) && (
                          <th className="p-2 border text-sm">সমাজ/বিজ্ঞান</th>
                        )}
                        <th className="p-2 border text-sm">গড়</th>
                        <th className="p-2 border text-sm">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-2 border text-center font-semibold">{r.roll}</td>
                          <td className="p-2 border">{r.student_name}</td>
                          <td className="p-2 border text-center">{r.class}য়</td>
                          <td className="p-2 border">
                            <input type="number" min="0" max="100"
                              value={r.bangla}
                              onChange={(e) => updateMark(i, 'bangla', e.target.value)}
                              className="w-16 p-1 border rounded text-center text-sm" />
                          </td>
                          <td className="p-2 border">
                            <input type="number" min="0" max="100"
                              value={r.english}
                              onChange={(e) => updateMark(i, 'english', e.target.value)}
                              className="w-16 p-1 border rounded text-center text-sm" />
                          </td>
                          <td className="p-2 border">
                            <input type="number" min="0" max="100"
                              value={r.math}
                              onChange={(e) => updateMark(i, 'math', e.target.value)}
                              className="w-16 p-1 border rounded text-center text-sm" />
                          </td>
                          {parseInt(r.class) >= 3 && (
                            <td className="p-2 border">
                              <input type="number" min="0" max="100"
                                value={r.science}
                                onChange={(e) => updateMark(i, 'science', e.target.value)}
                                className="w-16 p-1 border rounded text-center text-sm" />
                            </td>
                          )}
                          <td className="p-2 border text-center font-bold">{r.total}</td>
                          <td className="p-2 border text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              r.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' :
                              r.grade === 'Talentpool' ? 'bg-blue-100 text-blue-800' :
                              r.grade === 'General' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>{r.grade}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={saveResults} disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                  {loading ? '⏳ সেভ হচ্ছে...' : '💾 সবার ফলাফল সেভ করুন'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}