'use client';

import { useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const [searchType, setSearchType] = useState<'student' | 'school'>('student');
  const [year, setYear] = useState('2024');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ডেমো স্কুল তালিকা
  const schools = [
    { id: '1', name: 'আদর্শ কিন্টারগার্ডেন স্কুল' },
    { id: '2', name: 'মডার্ন কিন্টারগার্ডেন একাডেমি' },
    { id: '3', name: 'ব্রাইট ফিউচার কিন্টারগার্ডেন' },
    { id: '4', name: 'স্টার কিন্টারগার্ডেন স্কুল' },
    { id: '5', name: 'লিটল এঞ্জেলস কিন্টারগার্ডেন' },
  ];

  // ডেমো ফলাফল
  const demoResults = [
    {
      id: 1,
      student_name: 'মোঃ রহিম',
      roll: '101',
      class: '৩য়',
      school_name: 'আদর্শ কিন্টারগার্ডেন স্কুল',
      total_marks: 92,
      grade: 'Scholarship',
      rank: 1
    },
    {
      id: 2,
      student_name: 'ফাতেমা আক্তার',
      roll: '102',
      class: '৪র্থ',
      school_name: 'আদর্শ কিন্টারগার্ডেন স্কুল',
      total_marks: 85,
      grade: 'Scholarship',
      rank: 3
    },
    {
      id: 3,
      student_name: 'আব্দুল্লাহ আল মামুন',
      roll: '103',
      class: '৫ম',
      school_name: 'আদর্শ কিন্টারগার্ডেন স্কুল',
      total_marks: 75,
      grade: 'Talentpool',
      rank: 7
    },
    {
      id: 4,
      student_name: 'সাদিয়া ইসলাম',
      roll: '201',
      class: '৩য়',
      school_name: 'মডার্ন কিন্টারগার্ডেন একাডেমি',
      total_marks: 88,
      grade: 'Scholarship',
      rank: 2
    },
    {
      id: 5,
      student_name: 'তানভীর আহমেদ',
      roll: '202',
      class: '৪র্থ',
      school_name: 'মডার্ন কিন্টারগার্ডেন একাডেমি',
      total_marks: 62,
      grade: 'Talentpool',
      rank: 12
    },
    {
      id: 6,
      student_name: 'নুসরাত জাহান',
      roll: '203',
      class: '৫ম',
      school_name: 'মডার্ন কিন্টারগার্ডেন একাডেমি',
      total_marks: 45,
      grade: 'General',
      rank: 25
    }
  ];

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

  const handleSearch = () => {
    setHasSearched(true);
    
    if (searchType === 'student' && rollNumber) {
      const results = demoResults.filter(r => r.roll === rollNumber);
      setSearchResults(results);
    } else if (searchType === 'school' && selectedSchool) {
      const school = schools.find(s => s.id === selectedSchool);
      const results = demoResults.filter(r => r.school_name === school?.name);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
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
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="2024">২০২৪</option>
                  <option value="2023">২০২৩</option>
                  <option value="2022">২০২২</option>
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
                    placeholder="রোল নম্বর লিখুন (যেমন: ১০১)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">স্কুল নির্বাচন করুন</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleSearch}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg"
              >
                🔍 ফলাফল অনুসন্ধান করুন
              </button>
            </div>
          </div>

          {/* ফলাফল টেবিল */}
          {hasSearched && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {searchResults && searchResults.length > 0 ? (
                <>
                  <div className="bg-green-600 text-white p-6">
                    <h2 className="text-xl font-bold">
                      ফলাফল পাওয়া গেছে ({searchResults.length} জন)
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
                        {searchResults.map((result, index) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50 transition">
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4 font-semibold text-green-700">{result.roll}</td>
                            <td className="p-4 font-bold">{result.student_name}</td>
                            <td className="p-4">{result.class}</td>
                            <td className="p-4 text-gray-600">{result.school_name}</td>
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
                              {result.rank <= 10 ? (
                                <span className="text-yellow-600 font-bold text-lg">🏅 {result.rank}</span>
                              ) : (
                                <span className="font-semibold">{result.rank}</span>
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

          {/* প্রথমবার ভিজিটরদের জন্য ইনস্ট্রাকশন */}
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
          <p>&copy; ২০২৪ বাংলাদেশ কিন্টারগার্ডেন ওয়েলফেয়ার এসোসিয়েশন</p>
        </div>
      </footer>
    </div>
  );
}