'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const getGradeColor = (grade: string) => {
  switch(grade) {
    case 'Scholarship': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Talentpool': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'General': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getGradeName = (grade: string) => {
  switch(grade) {
    case 'Scholarship': return 'স্কলারশিপ';
    case 'Talentpool': return 'ট্যালেন্টপুল';
    case 'General': return 'সাধারণ';
    default: return grade;
  }
};

export default function MeritListPage() {
  const [meritList, setMeritList] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState("বৃত্তি পরীক্ষা");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeritList();
  }, []);

  const fetchMeritList = async () => {
    // প্রথমে সর্বশেষ পরীক্ষা খুঁজুন
    const { data: exams } = await supabase
      .from('scholarship_exams')
      .select('*')
      .eq('status', 'published')
      .order('year', { ascending: false })
      .limit(1);

    if (exams && exams.length > 0) {
      setExamTitle(exams[0].title_bn + ' ' + exams[0].year);

      // ফলাফল লোড
      const { data: results } = await supabase
        .from('results')
        .select(`
          *,
          students(name_bn, class),
          schools(name_bn)
        `)
        .eq('exam_id', exams[0].id)
        .order('total_marks', { ascending: false })
        .limit(10);

      if (results) setMeritList(results);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-yellow-200 hover:text-white mb-4 inline-block">
            ← হোম পেজে ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">🏆 মেরিট লিস্ট {examTitle.split(' ').pop()}</h1>
          <p className="mt-2 text-yellow-100">বর্ষসেরা মেধাবী শিক্ষার্থীদের তালিকা</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {meritList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-gray-600">ফলাফল প্রকাশিত হলে এখানে মেরিট লিস্ট দেখাবে</p>
          </div>
        ) : (
          <>
            {/* টপ ৩ */}
            {meritList.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {meritList.slice(0, 3).map((student, index) => (
                  <div key={student.id} className={`bg-white rounded-xl shadow-lg p-8 text-center ${
                    index === 0 ? 'border-4 border-yellow-400 transform md:scale-110' :
                    index === 1 ? 'border-4 border-gray-300' :
                    'border-4 border-orange-400'
                  }`}>
                    <div className="text-6xl mb-4">{getMedalEmoji(index + 1)}</div>
                    <h3 className="text-2xl font-bold mb-2">{student.students?.name_bn}</h3>
                    <p className="text-gray-600 mb-2">{student.schools?.name_bn}</p>
                    <p className="text-lg">শ্রেণি: {student.students?.class}য়</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-green-600">{student.total_marks}</span>
                      <span className="text-gray-500">/১০০</span>
                    </div>
                    <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                      {getGradeName(student.grade)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* সম্পূর্ণ তালিকা */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <h2 className="text-2xl font-bold">সেরা ১০ মেধাবী</h2>
                <p className="text-green-100 mt-1">{examTitle}</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-left">মেধাক্রম</th>
                      <th className="p-4 text-left">রোল</th>
                      <th className="p-4 text-left">নাম</th>
                      <th className="p-4 text-left">শ্রেণি</th>
                      <th className="p-4 text-left">শিক্ষা প্রতিষ্ঠান</th>
                      <th className="p-4 text-left">নাম্বার</th>
                      <th className="p-4 text-left">গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meritList.map((student, index) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                          {index < 3 ? (
                            <span className="text-2xl">{getMedalEmoji(index + 1)}</span>
                          ) : (
                            <span className="font-bold text-lg text-gray-600">{index + 1}</span>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-green-700">{student.students?.roll}</td>
                        <td className="p-4 font-bold">{student.students?.name_bn}</td>
                        <td className="p-4">{student.students?.class}য়</td>
                        <td className="p-4 text-gray-600">{student.schools?.name_bn}</td>
                        <td className="p-4">
                          <span className="font-bold text-lg">{student.total_marks}</span>
                          <span className="text-gray-500">/১০০</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                            {getGradeName(student.grade)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; ২০২৫ বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন</p>
        </div>
      </footer>
    </div>
  );
}
