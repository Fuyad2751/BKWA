'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SchoolDetailPage() {
  const params = useParams();
  const [school, setSchool] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchSchoolData(params.id as string);
    }
  }, [params?.id]);

  const fetchSchoolData = async (id: string) => {
    // স্কুল তথ্য
    const { data: schoolData } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (schoolData) setSchool(schoolData);

    // শিক্ষার্থী তালিকা
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', id)
      .order('class')
      .order('roll');
    
    if (studentsData) setStudents(studentsData);

    // ফলাফল
    const { data: resultsData } = await supabase
      .from('results')
      .select(`
        *,
        students!inner(name_bn, class, roll),
        scholarship_exams(year, title_bn)
      `)
      .eq('school_id', id)
      .order('total_marks', { ascending: false })
      .limit(20);

    if (resultsData) setResults(resultsData);
    setLoading(false);
  };

  const getGradeName = (grade: string) => {
    switch(grade) {
      case 'Scholarship': return 'স্কলারশিপ';
      case 'Talentpool': return 'ট্যালেন্টপুল';
      case 'General': return 'সাধারণ';
      case 'Fail': return 'অনুত্তীর্ণ';
      default: return grade;
    }
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'Scholarship': return 'bg-yellow-100 text-yellow-800';
      case 'Talentpool': return 'bg-blue-100 text-blue-800';
      case 'General': return 'bg-green-100 text-green-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-xl">স্কুল পাওয়া যায়নি</p>
          <Link href="/schools" className="text-green-600 hover:underline mt-4 inline-block">স্কুল তালিকায় ফিরুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" id="printable-area">
      {/* স্কুল হেডার */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/schools" className="text-green-200 hover:text-white mb-4 inline-block no-print">
            ← স্কুল তালিকায় ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{school.name_bn}</h1>
          {school.name_en && <p className="mt-2 text-green-100">{school.name_en}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* প্রিন্ট বাটন */}
        <div className="flex justify-end mb-6 no-print">
          <button onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
            🖨️ PDF ডাউনলোড / প্রিন্ট
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* স্কুল তথ্য */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">প্রতিষ্ঠানের তথ্য</h2>
              <div className="space-y-4">
                {school.eiin && (
                  <div>
                    <p className="text-gray-500 text-sm">EIIN নম্বর</p>
                    <p className="font-bold">{school.eiin}</p>
                  </div>
                )}
                {school.address && (
                  <div>
                    <p className="text-gray-500 text-sm">ঠিকানা</p>
                    <p className="font-semibold">{school.address}</p>
                  </div>
                )}
                {school.phone && (
                  <div>
                    <p className="text-gray-500 text-sm">ফোন</p>
                    <p className="font-semibold">{school.phone}</p>
                  </div>
                )}
                {school.email && (
                  <div>
                    <p className="text-gray-500 text-sm">ইমেইল</p>
                    <p className="font-semibold">{school.email}</p>
                  </div>
                )}
                {school.principal && (
                  <div>
                    <p className="text-gray-500 text-sm">প্রধান শিক্ষক</p>
                    <p className="font-semibold">{school.principal}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-gray-500 text-sm">মোট শিক্ষার্থী</p>
                  <p className="text-2xl font-bold text-green-600">{students.length} জন</p>
                </div>
              </div>
            </div>
          </div>

          {/* শিক্ষার্থী + ফলাফল */}
          <div className="md:col-span-2 space-y-8">
            {/* শিক্ষার্থী তালিকা */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">পরীক্ষার্থী তালিকা</h2>
                <p className="text-gray-600 text-sm mt-1">বৃত্তি পরীক্ষায় অংশগ্রহণকারী শিক্ষার্থীরা</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left">ক্রমিক</th>
                      <th className="p-4 text-left">নাম</th>
                      <th className="p-4 text-left">শ্রেণি</th>
                      <th className="p-4 text-left">রোল নম্বর</th>
                      <th className="p-4 text-left">লিঙ্গ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-gray-500">কোনো শিক্ষার্থী নেই</td></tr>
                    ) : (
                      students.map((student, index) => (
                        <tr key={student.id} className="border-t hover:bg-gray-50">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4 font-semibold">{student.name_bn}</td>
                          <td className="p-4">{student.class}য়</td>
                          <td className="p-4">{student.roll}</td>
                          <td className="p-4">{student.gender === 'male' ? 'ছেলে' : 'মেয়ে'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t text-center text-gray-600">
                মোট {students.length} জন শিক্ষার্থী
              </div>
            </div>

            {/* বিদ্যালয়ের ফলাফল */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">বিদ্যালয়ের ফলাফল</h2>
              </div>
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-left">রোল</th>
                        <th className="p-4 text-left">নাম</th>
                        <th className="p-4 text-left">শ্রেণি</th>
                        <th className="p-4 text-left">বছর</th>
                        <th className="p-4 text-left">নম্বর</th>
                        <th className="p-4 text-left">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => (
                        <tr key={r.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-semibold">{r.students?.roll}</td>
                          <td className="p-4">{r.students?.name_bn}</td>
                          <td className="p-4">{r.students?.class}য়</td>
                          <td className="p-4">{r.scholarship_exams?.year}</td>
                          <td className="p-4 font-bold">{r.total_marks}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(r.grade)}`}>
                              {getGradeName(r.grade)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-600">
                  ফলাফল আসন্ন। বিস্তারিত জানতে{" "}
                  <Link href="/results" className="text-green-600 font-semibold hover:underline">
                    ফলাফল পেজ
                  </Link>{" "}
                  ভিজিট করুন।
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* প্রিন্ট স্টাইল */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}