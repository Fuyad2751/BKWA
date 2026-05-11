'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResultsPage() {
  const [searchType, setSearchType] = useState<'student' | 'school'>('student');
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    const [examData, schoolData] = await Promise.all([
      supabase.from('scholarship_exams').select('*').order('year', { ascending: false }),
      supabase.from('schools').select('id, name_bn').order('name_bn')
    ]);
    setExams(examData.data || []);
    setSchools(schoolData.data || []);
  };

  const handleSearch = async () => {
    if (!selectedExam) { alert('পরীক্ষা নির্বাচন করুন'); return; }
    setLoading(true);
    setHasSearched(true);

    if (searchType === 'student' && rollNumber) {
      // প্রথমে exam_registrations থেকে student_id বের করুন
      const { data: reg } = await supabase
        .from('exam_registrations')
        .select('student_id, roll')
        .eq('exam_id', selectedExam)
        .eq('roll', rollNumber)
        .single();

      if (reg) {
        const { data: stu } = await supabase
          .from('students')
          .select('*, schools(name_bn)')
          .eq('id', reg.student_id)
          .single();
        setStudentInfo(stu);

        const { data: res } = await supabase
          .from('results')
          .select('*, scholarship_exams(year, title_bn)')
          .eq('exam_id', selectedExam)
          .eq('student_id', reg.student_id);
        setResults(res);
      } else {
        setStudentInfo(null);
        setResults([]);
      }
    } else if (searchType === 'school' && selectedSchool) {
      const { data: regs } = await supabase
        .from('exam_registrations')
        .select('student_id, roll')
        .eq('exam_id', selectedExam)
        .eq('school_id', selectedSchool);
      
      if (regs && regs.length > 0) {
        const studentIds = regs.map(r => r.student_id);
        const { data: res } = await supabase
          .from('results')
          .select('*, students!inner(name_bn, class), scholarship_exams(year, title_bn)')
          .eq('exam_id', selectedExam)
          .in('student_id', studentIds)
          .order('total_marks', { ascending: false });
        
        // রোল ম্যাপ
        const rollMap: any = {};
        regs.forEach(r => { rollMap[r.student_id] = r.roll; });
        const mapped = (res || []).map(r => ({ ...r, exam_roll: rollMap[r.student_id] || '-' }));
        setResults(mapped);
      } else {
        setResults([]);
      }
    }
    setLoading(false);
  };

  const getGradeBadge = (g: string) => {
    if (g === 'Scholarship') return 'bg-yellow-100 text-yellow-800';
    if (g === 'Talentpool') return 'bg-blue-100 text-blue-800';
    if (g === 'General') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getGradeNameBn = (g: string) => {
    if (g === 'Scholarship') return 'স্কলারশিপ';
    if (g === 'Talentpool') return 'ট্যালেন্টপুল';
    if (g === 'General') return 'সাধারণ';
    return g;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-green-200 hover:text-white mb-4 inline-block">← হোম পেজে ফিরুন</Link>
          <h1 className="text-3xl font-bold">ফলাফল অনুসন্ধান</h1>
          <p className="text-green-100 mt-2">বৃত্তি পরীক্ষার ফলাফল দেখুন</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-6">
              <button onClick={() => setSearchType('student')} className={`flex-1 py-3 rounded-lg font-bold ${searchType === 'student' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>👨‍🎓 শিক্ষার্থী অনুসারে</button>
              <button onClick={() => setSearchType('school')} className={`flex-1 py-3 rounded-lg font-bold ${searchType === 'school' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>🏫 স্কুল অনুসারে</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">📅 পরীক্ষা</label>
                <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">পরীক্ষা নির্বাচন করুন</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                </select>
              </div>
              {searchType === 'student' ? (
                <div>
                  <label className="block font-semibold mb-2">🔢 রোল নম্বর</label>
                  <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="রোল নম্বর লিখুন" className="w-full p-3 border rounded-lg" />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold mb-2">🏫 স্কুল</label>
                  <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="w-full p-3 border rounded-lg">
                    <option value="">স্কুল নির্বাচন করুন</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                  </select>
                </div>
              )}
              <button onClick={handleSearch} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                {loading ? '⏳ অনুসন্ধান...' : '🔍 ফলাফল দেখুন'}
              </button>
            </div>
          </div>

          {hasSearched && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {results && results.length > 0 ? (
                <>
                  <div className="bg-green-600 text-white p-6"><h2 className="text-xl font-bold">ফলাফল ({results.length} জন)</h2></div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="bg-gray-50"><th className="p-4 text-left">রোল</th><th className="p-4 text-left">নাম</th><th className="p-4 text-left">শ্রেণি</th>{searchType === 'school' && <th className="p-4 text-left">স্কুল</th>}<th className="p-4 text-left">নম্বর</th><th className="p-4 text-left">গ্রেড</th></tr></thead>
                      <tbody>
                        {results.map((r, i) => (
                          <tr key={r.id} className="border-t hover:bg-gray-50">
                            <td className="p-4 font-semibold text-green-700">{r.exam_roll || r.students?.roll || '-'}</td>
                            <td className="p-4 font-bold">{r.students?.name_bn || studentInfo?.name_bn}</td>
                            <td className="p-4">{r.students?.class || studentInfo?.class}য়</td>
                            {searchType === 'school' && <td className="p-4 text-gray-600">{r.schools?.name_bn || studentInfo?.schools?.name_bn}</td>}
                            <td className="p-4 font-bold text-lg">{r.total_marks}</td>
                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeBadge(r.grade)}`}>{getGradeNameBn(r.grade)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center"><div className="text-6xl mb-4">😔</div><h3 className="text-xl font-bold">কোনো ফলাফল পাওয়া যায়নি</h3></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
