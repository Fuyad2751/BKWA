'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const getGradeBadge = (grade: string) => {
  switch(grade) {
    case 'Scholarship':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'Talentpool':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'General':
      return 'bg-green-100 text-green-800 border border-green-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getGradeNameBn = (grade: string) => {
  switch(grade) {
    case 'Scholarship': return 'স্কলারশিপ';
    case 'Talentpool': return 'ট্যালেন্টপুল';
    case 'General': return 'সাধারণ';
    default: return grade;
  }
};

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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // পরীক্ষা লোড
    const { data: examData } = await supabase
      .from('scholarship_exams')
      .select('*')
      .order('year', { ascending: false });
    setExams(examData || []);

    // স্কুল লোড
    const { data: schoolData } = await supabase
      .from('schools')
      .select('id, name_bn')
      .order('name_bn');
    setSchools(schoolData || []);
  };

  const handleSearch = async () => {
    if (!selectedExam) {
      alert('পরীক্ষা নির্বাচন করুন');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    let query = supabase
      .from('results')
      .select(`
        *,
        students!inner(name_bn, class, roll, school_id),
        schools!inner(name_bn)
      `)
      .eq('exam_id', selectedExam);

    if (searchType === 'student' && rollNumber) {
      query = query.eq('students.roll', rollNumber);
    } else if (searchType === 'school' && selectedSchool) {
      query = query.eq('school_id', selectedSchool);
    }

    const { data } = await query.order('rank', { ascending: true });
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-green-200 hover:text-white mb-4 inline-block">
            ← হোম পেজে ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">ফলাফল অনুসন্ধান</h1>
          <p className="mt-2 text-green-100">বৃত্তি পরীক্ষার ফলাফল দেখুন</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* সার্চ ফর্ম */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchType('student')}
                className={`flex-1 py-3 rounded-lg font-bold text-lg transition ${
                  searchType === 'student'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👨‍🎓 শিক্ষার্থী অনুসারে
              </button>
              <button
                onClick={() => setSearchType('school')}
                className={`flex-1 py-3 rounded-lg font-bold text-lg transition ${
                  searchType === 'school'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🏫 স্কুল অনুসারে
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  📅 পরীক্ষার বছর
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">পরীক্ষা নির্বাচন করুন</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title_bn} ({exam.year})
                    </option>
                  ))}
                </select>
              </div>

              {searchType === 'student' ? (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🔢 রোল নম্বর
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="রোল নম্বর লিখুন"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🏫 স্কুল নির্বাচন
                  </label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">স্কুল নির্বাচন করুন</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name_bn}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? '⏳ অনুসন্ধান চলছে...' : '🔍 ফলাফল অনুসন্ধান করুন'}
              </button>
            </div>
          </div>

          {/* ফলাফল টেবিল */}
          {hasSearched && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-xl">ফলাফল লোড হচ্ছে...</p>
                </div>
              ) : results && results.length > 0 ? (
                <>
                  <div className="bg-green-600 text-white p-6">
                    <h2 className="text-xl font-bold">
                      ফলাফল পাওয়া গেছে ({results.length} জন)
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-4 text-left">ক্রমিক</th>
                          <th className="p-4 text-left">রোল</th>
                          <th className="p-4 text-left">নাম</th>
                          <th className="p-4 text-left">শ্রেণি</th>
                          <th className="p-4 text-left">স্কুল</th>
                          <th className="p-4 text-left">মোট নাম্বার</th>
                          <th className="p-4 text-left">গ্রেড</th>
                          <th className="p-4 text-left">মেধাক্রম</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, index) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50 transition">
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4 font-semibold text-green-700">{result.students?.roll}</td>
                            <td className="p-4 font-bold">{result.students?.name_bn}</td>
                            <td className="p-4">{result.students?.class}য়</td>
                            <td className="p-4 text-gray-600">{result.schools?.name_bn}</td>
                            <td className="p-4">
                              <span className="font-bold text-lg">{result.total_marks}</span>
                              <span className="text-gray-500">/১০০</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadge(result.grade)}`}>
                                {getGradeNameBn(result.grade)}
                              </span>
                            </td>
                            <td className="p-4">
                              {result.rank && result.rank <= 10 ? (
                                <span className="text-yellow-600 font-bold text-lg">🏅 {result.rank}</span>
                              ) : (
                                <span className="font-semibold">{result.rank || '-'}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                  <p className="text-gray-600">
                    দয়া করে সঠিক রোল নম্বর বা স্কুল নির্বাচন করে আবার চেষ্টা করুন
                  </p>
                </div>
              )}
            </div>
          )}

          {/* প্রথমবার ভিজিটরদের জন্য */}
          {!hasSearched && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">ℹ️</div>
                <div>
                  <h3 className="font-bold text-lg text-blue-800 mb-2">কিভাবে ফলাফল দেখবেন?</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• শিক্ষার্থী অনুসারে: রোল নম্বর লিখে সার্চ করুন</li>
                    <li>• স্কুল অনুসারে: স্কুল সিলেক্ট করে সার্চ করুন</li>
                    <li>• পরীক্ষার বছর সিলেক্ট করতে ভুলবেন না</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; ২০২৫র বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন</p>
        </div>
      </footer>
    </div>
  );
}