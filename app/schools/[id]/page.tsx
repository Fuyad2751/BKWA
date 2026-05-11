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

    // শিক্ষার্থী লোড
    const { data: st } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', id)
      .order('class')
      .order('name_bn');

    if (st) {
      // সর্বশেষ পরীক্ষা (published বা completed)
      const { data: latestExam } = await supabase
        .from('scholarship_exams')
        .select('id')
        .in('status', ['published', 'completed'])
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
      {selectedStudent && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print" onClick={() => { setSelectedStudent(null); setSelectedResult(null); }}>
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
      {/* হেডার */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">📋 রেজাল্ট কার্ড</h3>
          <button onClick={() => { setSelectedStudent(null); setSelectedResult(null); }} className="text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        {selectedResult && <p className="text-green-100 mt-1">{selectedResult.scholarship_exams?.title_bn} - {selectedResult.scholarship_exams?.year}</p>}
      </div>

      <div className="p-6">
        {/* ছাত্র তথ্য */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">শিক্ষার্থীর নাম</span><p className="font-bold text-gray-800 text-lg">{selectedStudent.name_bn}</p></div>
            <div><span className="text-gray-500">রোল নম্বর</span><p className="font-bold text-green-700 text-lg">{selectedStudent.exam_roll || selectedStudent.roll || '-'}</p></div>
            <div><span className="text-gray-500">পিতার নাম</span><p className="font-semibold">{selectedStudent.father_name || '-'}</p></div>
            <div><span className="text-gray-500">মাতার নাম</span><p className="font-semibold">{selectedStudent.mother_name || '-'}</p></div>
            <div><span className="text-gray-500">বিদ্যালয়</span><p className="font-semibold">{school.name_bn}</p></div>
            <div><span className="text-gray-500">শ্রেণি</span><p className="font-semibold">{classNames[selectedStudent.class]}</p></div>
          </div>
        </div>

        {selectedResult ? (
          <>
            {/* বিষয়ভিত্তিক নম্বর */}
            <h4 className="font-bold text-gray-800 mb-3">📊 বিষয়ভিত্তিক নম্বর</h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">বাংলা</p>
                <p className="text-2xl font-bold text-blue-700">{selectedResult.bangla_marks || 0}</p>
                <p className={`text-xs font-bold mt-1 ${(selectedResult.bangla_marks || 0) >= 33 ? 'text-green-600' : 'text-red-600'}`}>
                  {(selectedResult.bangla_marks || 0) >= 33 ? '✅ পাস' : '❌ ফেল'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">ইংরেজি</p>
                <p className="text-2xl font-bold text-purple-700">{selectedResult.english_marks || 0}</p>
                <p className={`text-xs font-bold mt-1 ${(selectedResult.english_marks || 0) >= 33 ? 'text-green-600' : 'text-red-600'}`}>
                  {(selectedResult.english_marks || 0) >= 33 ? '✅ পাস' : '❌ ফেল'}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">গণিত</p>
                <p className="text-2xl font-bold text-orange-700">{selectedResult.math_marks || 0}</p>
                <p className={`text-xs font-bold mt-1 ${(selectedResult.math_marks || 0) >= 33 ? 'text-green-600' : 'text-red-600'}`}>
                  {(selectedResult.math_marks || 0) >= 33 ? '✅ পাস' : '❌ ফেল'}
                </p>
              </div>
              {/* ৩-৫ শ্রেণীর জন্য সমাজ/বিজ্ঞান */}
              {(selectedResult.subject_count >= 4 || parseInt(selectedStudent.class) >= 3) && (
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">সমাজ/বিজ্ঞান</p>
                  <p className="text-2xl font-bold text-teal-700">{selectedResult.science_marks || 0}</p>
                  <p className={`text-xs font-bold mt-1 ${(selectedResult.science_marks || 0) >= 33 ? 'text-green-600' : 'text-red-600'}`}>
                    {(selectedResult.science_marks || 0) >= 33 ? '✅ পাস' : '❌ ফেল'}
                  </p>
                </div>
              )}
            </div>

            {/* ফলাফল সারাংশ */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">মোট নম্বর</p>
                  <p className="text-3xl font-bold text-green-700">{selectedResult.total_marks}</p>
                  <p className="text-xs text-gray-500">/১০০</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">গ্রেড</p>
                  <span className={`inline-block mt-1 px-4 py-1 rounded-full text-lg font-bold ${
                    selectedResult.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' :
                    selectedResult.grade === 'Talentpool' ? 'bg-blue-100 text-blue-800' :
                    selectedResult.grade === 'General' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>{getGradeName(selectedResult.grade)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">মেধাক্রম</p>
                  <p className="text-3xl font-bold text-yellow-600">{selectedResult.rank ? `🏅 ${selectedResult.rank}` : '-'}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl">ফলাফল এখনো প্রকাশিত হয়নি</p>
          </div>
        )}

        {/* বাটন */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
            🖨️ প্রিন্ট / PDF
          </button>
          <button onClick={() => { setSelectedStudent(null); setSelectedResult(null); }} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400">
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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
     <style jsx>{`
  @media print {
    body * {
      visibility: hidden;
    }
    #printable-area, #printable-area * {
      visibility: visible;
    }
    #printable-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 40px;
      background: white;
    }
    .no-print {
      display: none !important;
    }
  }
`}</style>
    </div>
  );
}
