'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const classNames: any = { '1': 'প্রথম', '2': 'দ্বিতীয়', '3': 'তৃতীয়', '4': 'চতুর্থ', '5': 'পঞ্চম' };

export default function SchoolDetailPage() {
  const params = useParams();
  const [school, setSchool] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    if (params?.id) fetchSchoolData(params.id as string);
  }, [params?.id]);

  const fetchSchoolData = async (id: string) => {
    const { data: s } = await supabase.from('schools').select('*').eq('id', id).single();
    if (s) setSchool(s);

    const { data: st } = await supabase
  .from('students')
  .select('*')
  .eq('school_id', id)
  .order('class')
  .order('name_bn');

// আলাদাভাবে exam_registrations fetch করুন
if (st) {
  // সর্বশেষ পরীক্ষা খুঁজুন
  const { data: latestExam } = await supabase
    .from('scholarship_exams')
    .select('id')
    // .eq('status', 'published')
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (latestExam) {
    const { data: registrations } = await supabase
      .from('exam_registrations')
      .select('student_id, roll')
      .eq('exam_id', latestExam.id)
      .eq('school_id', id);

    const rollMap: any = {};
    registrations?.forEach((r: any) => { rollMap[r.student_id] = r.roll; });

    const mapped = st.map((student: any) => ({
      ...student,
      exam_roll: rollMap[student.id] || 'অনিবন্ধিত'
    }));
    setStudents(mapped);
  } else {
    const mapped = st.map((student: any) => ({ ...student, exam_roll: 'অনিবন্ধিত' }));
    setStudents(mapped);
  }
}
    
    if (st) {
      const mapped = st.map((student: any) => ({
        ...student,
        exam_roll: student.exam_registrations?.roll || 'অনিবন্ধিত'
      }));
      setStudents(mapped);
    }

    // ফলাফল
    const { data: r } = await supabase
      .from('results')
      .select('*, students!inner(name_bn, class), scholarship_exams(year, title_bn)')
      .eq('school_id', id)
      .order('total_marks', { ascending: false });
    if (r) setResults(r);

    setLoading(false);
  };

  const viewResultCard = (student: any) => {
    const result = results.find((r: any) => r.student_id === student.id);
    setSelectedStudent(student);
    setSelectedResult(result || null);
  };

  const getGradeName = (g: string) => {
    if (g === 'Scholarship') return 'স্কলারশিপ';
    if (g === 'Talentpool') return 'ট্যালেন্টপুল';
    if (g === 'General') return 'সাধারণ';
    return g;
  };

  const groupedStudents: any = {};
  students.forEach(s => {
    const cls = s.class;
    if (!groupedStudents[cls]) groupedStudents[cls] = [];
    groupedStudents[cls].push(s);
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">⏳ লোড হচ্ছে...</div>;
  if (!school) return <div className="min-h-screen flex items-center justify-center text-xl">স্কুল পাওয়া যায়নি</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* রেজাল্ট কার্ড মোডাল */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="text-xl font-bold">📋 রেজাল্ট কার্ড</h3>
                <button onClick={() => { setSelectedStudent(null); setSelectedResult(null); }} className="text-2xl">✕</button>
              </div>
              <div id="printable-area" className="p-4">
                <div className="text-center border-b-2 border-green-600 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-green-700">বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন</h2>
                  <p className="text-sm">বৃত্তি পরীক্ষার ফলাফল</p>
                  {selectedResult && <p className="text-sm font-bold">{selectedResult.scholarship_exams?.title_bn} - {selectedResult.scholarship_exams?.year}</p>}
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">নাম</span><span>{selectedStudent.name_bn}</span></div>
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">পিতা</span><span>{selectedStudent.father_name || '-'}</span></div>
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">মাতা</span><span>{selectedStudent.mother_name || '-'}</span></div>
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">বিদ্যালয়</span><span>{school.name_bn}</span></div>
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">শ্রেণি</span><span>{classNames[selectedStudent.class]}</span></div>
                  <div className="flex justify-between border-b py-1"><span className="font-semibold">রোল</span><span className="font-bold text-green-700">{selectedStudent.exam_roll || 'অনিবন্ধিত'}</span></div>
                </div>
                {selectedResult ? (
                  <>
                    <table className="w-full text-sm mb-4 border">
                      <thead><tr className="bg-green-600 text-white"><th className="p-2 border">বাংলা</th><th className="p-2 border">ইংরেজি</th><th className="p-2 border">গণিত</th>{selectedResult.subject_count >= 4 && <th className="p-2 border">সাঃ/বিঃ</th>}</tr></thead>
                      <tbody><tr className="text-center font-semibold"><td className="p-2 border">{selectedResult.bangla_marks || '-'}</td><td className="p-2 border">{selectedResult.english_marks || '-'}</td><td className="p-2 border">{selectedResult.math_marks || '-'}</td>{selectedResult.subject_count >= 4 && <td className="p-2 border">{selectedResult.science_marks || '-'}</td>}</tr></tbody>
                    </table>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-gray-600">মোট নম্বর</p><p className="text-2xl font-bold text-green-700">{selectedResult.total_marks}</p></div>
                      <div className={`rounded-lg p-3 border ${selectedResult.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' : selectedResult.grade === 'Talentpool' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}><p className="text-xs">গ্রেড</p><p className="text-xl font-bold">{getGradeName(selectedResult.grade)}</p></div>
                    </div>
                    {selectedResult.rank && <p className="text-center mt-3 font-bold text-lg">🏅 মেধাক্রম: {selectedResult.rank}</p>}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">ফলাফল এখনো প্রকাশিত হয়নি</div>
                )}
              </div>
              <div className="flex gap-3 mt-4 no-print">
                <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">🖨️ প্রিন্ট</button>
                <button onClick={() => { setSelectedStudent(null); setSelectedResult(null); }} className="flex-1 bg-gray-300 py-2 rounded-lg font-bold">বন্ধ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* মূল পেজ */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/schools" className="text-green-200 hover:text-white mb-4 inline-block">← স্কুল তালিকায় ফিরুন</Link>
          <h1 className="text-3xl font-bold">{school.name_bn}</h1>
          {school.name_en && <p className="text-green-100">{school.name_en}</p>}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">প্রতিষ্ঠানের তথ্য</h2>
            <div className="space-y-3">
              {school.eiin && <p><span className="text-gray-500 text-sm">EIIN</span><br/><span className="font-bold">{school.eiin}</span></p>}
              {school.address && <p><span className="text-gray-500 text-sm">ঠিকানা</span><br/><span className="font-semibold">{school.address}</span></p>}
              {school.phone && <p><span className="text-gray-500 text-sm">ফোন</span><br/><span className="font-semibold">{school.phone}</span></p>}
              {school.principal && <p><span className="text-gray-500 text-sm">প্রধান শিক্ষক</span><br/><span className="font-semibold">{school.principal}</span></p>}
              <p className="pt-4 border-t"><span className="text-gray-500 text-sm">মোট শিক্ষার্থী</span><br/><span className="text-2xl font-bold text-green-600">{students.length} জন</span></p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            {[1,2,3,4,5].map(cls => {
              const list = groupedStudents[String(cls)] || [];
              if (list.length === 0) return null;
              return (
                <div key={cls} className="bg-white rounded-xl shadow">
                  <div className="p-6 border-b bg-green-50"><h2 className="text-xl font-bold text-green-700">{classNames[String(cls)]} শ্রেণী</h2><p className="text-sm text-gray-600 mt-1">মোট {list.length} জন</p></div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="bg-gray-50"><th className="p-4 text-left">ক্রমিক</th><th className="p-4 text-left">নাম</th><th className="p-4 text-left">রোল</th><th className="p-4 text-left">লিঙ্গ</th><th className="p-4 text-left">ফলাফল</th></tr></thead>
                      <tbody>
                        {list.map((s: any, i: number) => {
                          const hasResult = results.find((r: any) => r.student_id === s.id);
                          return (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                              <td className="p-4">{i + 1}</td>
                              <td className="p-4 font-semibold">{s.name_bn}</td>
                              <td className="p-4 text-green-700 font-bold">{s.exam_roll || '-'}</td>
                              <td className="p-4">{s.gender === 'male' ? 'ছেলে' : 'মেয়ে'}</td>
                              <td className="p-4">
                                <button onClick={() => viewResultCard(s)}
                                  className={`px-4 py-1 rounded-full text-sm font-bold ${hasResult ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500'}`}>
                                  {hasResult ? '📋 রেজাল্ট কার্ড' : 'অপেক্ষমান'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
}
