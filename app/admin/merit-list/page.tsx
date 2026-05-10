'use client';

import { useState } from "react";
import Link from "next/link";

export default function GenerateMeritList() {
  const [selectedExam, setSelectedExam] = useState("");
  const [generated, setGenerated] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const meritData = [
    { rank: 1, roll: "101", name: "মোঃ রহিম", class: "৩য়", school: "আদর্শ কিন্টারগার্ডেন", marks: 92, grade: "Scholarship" },
    { rank: 2, roll: "201", name: "সাদিয়া ইসলাম", class: "৩য়", school: "মডার্ন একাডেমি", marks: 88, grade: "Scholarship" },
    { rank: 3, roll: "102", name: "ফাতেমা আক্তার", class: "৪র্থ", school: "আদর্শ কিন্টারগার্ডেন", marks: 85, grade: "Scholarship" },
  ];

  const handleGenerate = () => {
    if (!selectedExam) {
      alert("দয়া করে পরীক্ষা নির্বাচন করুন");
      return;
    }
    setGenerated(true);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      alert("✅ মেরিট লিস্ট সফলভাবে পাবলিশ হয়েছে!");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">
            📊 ড্যাশবোর্ড
          </Link>
          <Link href="/admin/merit-list" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">
            🏆 মেরিট লিস্ট
          </Link>
        </nav>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/dashboard" className="text-green-600 hover:underline">
              ← ড্যাশবোর্ডে ফিরুন
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">🏆 মেরিট লিস্ট জেনারেট</h1>

            <div className="flex gap-4 mb-8">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">পরীক্ষা নির্বাচন করুন</option>
                <option value="2024">বৃত্তি পরীক্ষা ২০২৪</option>
                <option value="2023">বৃত্তি পরীক্ষা ২০২৩</option>
              </select>

              <button
                onClick={handleGenerate}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700"
              >
                🔄 জেনারেট করুন
              </button>
            </div>

            {generated && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="font-bold text-yellow-800">📊 মোট পরীক্ষার্থী: ১,২৫০ জন</p>
                  <p className="text-yellow-700 mt-1">স্কলারশিপ: ১৫০ | ট্যালেন্টপুল: ৩০০ | সাধারণ: ৮০০</p>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-left">মেধাক্রম</th>
                        <th className="p-4 text-left">রোল</th>
                        <th className="p-4 text-left">নাম</th>
                        <th className="p-4 text-left">শ্রেণি</th>
                        <th className="p-4 text-left">স্কুল</th>
                        <th className="p-4 text-left">নম্বর</th>
                        <th className="p-4 text-left">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meritData.map((student) => (
                        <tr key={student.rank} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            {student.rank === 1 ? "🥇" : student.rank === 2 ? "🥈" : student.rank === 3 ? "🥉" : student.rank}
                          </td>
                          <td className="p-4 font-semibold">{student.roll}</td>
                          <td className="p-4 font-bold">{student.name}</td>
                          <td className="p-4">{student.class}</td>
                          <td className="p-4 text-gray-600">{student.school}</td>
                          <td className="p-4 font-bold">{student.marks}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              student.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {student.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {publishing ? "⏳ পাবলিশ হচ্ছে..." : "📢 মেরিট লিস্ট পাবলিশ করুন"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}