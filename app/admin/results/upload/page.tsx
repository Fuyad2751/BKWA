'use client';

import { useState } from "react";
import Link from "next/link";

export default function UploadResults() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ডেমো ফলাফল প্রিভিউ
  const demoPreview = [
    { roll: "101", name: "মোঃ রহিম", class: "3", school: "আদর্শ কিন্টারগার্ডেন", marks: 92, grade: "Scholarship" },
    { roll: "102", name: "ফাতেমা আক্তার", class: "4", school: "আদর্শ কিন্টারগার্ডেন", marks: 85, grade: "Scholarship" },
    { roll: "201", name: "সাদিয়া ইসলাম", class: "3", school: "মডার্ন একাডেমি", marks: 88, grade: "Scholarship" },
  ];

  const handleUpload = async () => {
    if (!selectedFile || !selectedExam) {
      alert("দয়া করে পরীক্ষা এবং ফাইল নির্বাচন করুন");
      return;
    }

    setUploading(true);
    // ফাইল আপলোড সিমুলেশন
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
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
          <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg bg-green-600">
            📊 ফলাফল আপলোড
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
            <h1 className="text-2xl font-bold mb-6">📊 ফলাফল আপলোড করুন</h1>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                ✅ ফলাফল সফলভাবে আপলোড হয়েছে!
              </div>
            )}

            <div className="space-y-6">
              {/* পরীক্ষা সিলেক্ট */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">📅 পরীক্ষা নির্বাচন</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">পরীক্ষা নির্বাচন করুন</option>
                  <option value="2024">বৃত্তি পরীক্ষা ২০২৪</option>
                  <option value="2023">বৃত্তি পরীক্ষা ২০২৩</option>
                </select>
              </div>

              {/* ফাইল আপলোড */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">📁 এক্সেল ফাইল আপলোড</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-5xl mb-4">📁</div>
                    <p className="text-lg font-bold text-gray-700 mb-2">
                      {selectedFile ? selectedFile.name : "এক্সেল ফাইল সিলেক্ট করুন"}
                    </p>
                    <p className="text-gray-500">.xlsx, .xls, .csv ফাইল সাপোর্ট করে</p>
                  </label>
                </div>
              </div>

              {/* এক্সেল ফরম্যাট গাইড */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-800 mb-3">📋 এক্সেল ফাইলের ফরম্যাট</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="p-2 border">রোল</th>
                        <th className="p-2 border">নাম</th>
                        <th className="p-2 border">শ্রেণি</th>
                        <th className="p-2 border">স্কুল</th>
                        <th className="p-2 border">বাংলা</th>
                        <th className="p-2 border">ইংরেজি</th>
                        <th className="p-2 border">গণিত</th>
                        <th className="p-2 border">মোট</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border">101</td>
                        <td className="p-2 border">মোঃ রহিম</td>
                        <td className="p-2 border">3</td>
                        <td className="p-2 border">আদর্শ স্কুল</td>
                        <td className="p-2 border">90</td>
                        <td className="p-2 border">85</td>
                        <td className="p-2 border">95</td>
                        <td className="p-2 border">90</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {uploading ? "⏳ আপলোড হচ্ছে..." : "🚀 ফলাফল আপলোড করুন"}
              </button>
            </div>

            {/* প্রিভিউ */}
            {selectedFile && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">📋 ফলাফল প্রিভিউ</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">রোল</th>
                        <th className="p-3 text-left">নাম</th>
                        <th className="p-3 text-left">শ্রেণি</th>
                        <th className="p-3 text-left">স্কুল</th>
                        <th className="p-3 text-left">নম্বর</th>
                        <th className="p-3 text-left">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoPreview.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 font-semibold">{item.roll}</td>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.class}</td>
                          <td className="p-3 text-gray-600">{item.school}</td>
                          <td className="p-3 font-bold">{item.marks}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              item.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}