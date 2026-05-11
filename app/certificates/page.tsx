'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CertificatesPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [printing, setPrinting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [e, s] = await Promise.all([
      supabase.from('scholarship_exams').select('*').order('year', { ascending: false }),
      supabase.from('schools').select('id, name_bn').order('name_bn')
    ]);
    if (e.data) setExams(e.data);
    if (s.data) setSchools(s.data);
  };

  const loadStudents = async () => {
    if (!selectedExam) return alert('পরীক্ষা সিলেক্ট করুন');
    setLoading(true);

    let query = supabase
      .from('results')
      .select(`*, students!inner(name_bn, father_name, class, roll, school_id), schools!inner(name_bn, eiin), scholarship_exams!inner(year, title_bn)`)
      .eq('exam_id', selectedExam)
      .in('grade', ['Scholarship', 'Talentpool'])
      .order('total_marks', { ascending: false });

    if (selectedSchool) query = query.eq('school_id', selectedSchool);

    const { data } = await query;
    setStudents(data || []);
    setLoading(false);
  };

  const printCertificate = (student: any) => {
    setSelectedCert(student);
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
      setSelectedCert(null);
    }, 500);
  };

  const getGradeName = (g: string) => {
    if (g === 'Scholarship') return 'স্কলারশিপ (মেধাবৃত্তি)';
    if (g === 'Talentpool') return 'ট্যালেন্টপুল (প্রতিভা বৃত্তি)';
    return g;
  };

  const getGradeIcon = (g: string) => {
    if (g === 'Scholarship') return '🏆';
    if (g === 'Talentpool') return '⭐';
    return '✅';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* সার্টিফিকেট প্রিন্ট মোড */}
      {selectedCert && (
        <div id="certificate-print" className="p-8 bg-white" style={{ width: '297mm', height: '210mm', margin: 'auto' }}>
          <div style={{
            border: '8px double #1a7a2e',
            borderRadius: '20px',
            padding: '40px',
            height: '100%',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f0fff0 0%, #e8ffe8 50%, #f0fff0 100%)',
            position: 'relative'
          }}>
            {/* ওয়াটারমার্ক */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '150px',
              opacity: '0.03',
              color: '#1a7a2e'
            }}>
              {getGradeIcon(selectedCert.grade)}
            </div>

            {/* হেডার */}
            <div style={{ marginBottom: '30px', position: 'relative' }}>
              <h1 style={{ fontSize: '28px', color: '#1a7a2e', fontWeight: 'bold', marginBottom: '5px' }}>
                বাংলাদেশ কিন্ডার গার্টেন ওয়েলফেয়ার এসোসিয়েশন
              </h1>
              <h2 style={{ fontSize: '22px', color: '#d4a017', fontWeight: 'bold', marginBottom: '10px' }}>
                {getGradeName(selectedCert.grade)}
              </h2>
              <p style={{ fontSize: '16px', color: '#555' }}>
                {selectedCert.scholarship_exams?.title_bn} - {selectedCert.scholarship_exams?.year}
              </p>
              <div style={{ width: '100px', height: '3px', background: '#d4a017', margin: '15px auto' }}></div>
            </div>

            {/* সার্টিফিকেট বডি */}
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <p style={{ fontSize: '18px', color: '#333', marginBottom: '25px' }}>
                এই সার্টিফিকেট দ্বারা প্রত্যয়ন করা যাচ্ছে যে
              </p>
              <h2 style={{ fontSize: '36px', color: '#1a7a2e', fontWeight: 'bold', marginBottom: '10px', fontFamily: 'serif' }}>
                {selectedCert.students?.name_bn}
              </h2>
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '5px' }}>
                পিতা: {selectedCert.students?.father_name || '...'} | মাতা: {selectedCert.students?.mother_name || '...'}
              </p>
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '5px' }}>
                {selectedCert.schools?.name_bn} | EIIN: {selectedCert.schools?.eiin}
              </p>
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '25px' }}>
                রোল: {selectedCert.students?.roll} | শ্রেণি: {selectedCert.students?.class}য়
              </p>
              <p style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>
                বৃত্তি পরীক্ষায় <span style={{ fontWeight: 'bold', color: '#1a7a2e' }}>{selectedCert.total_marks}</span> নম্বর অর্জন করে
                <span style={{ fontWeight: 'bold', color: '#d4a017' }}> {getGradeName(selectedCert.grade)}</span> বৃত্তির জন্য মনোনীত হয়েছে।
              </p>
              {selectedCert.rank && (
                <p style={{ fontSize: '18px', color: '#333' }}>
                  মেধাক্রম: <span style={{ fontWeight: 'bold', color: '#d4a017' }}>{selectedCert.rank}তম</span>
                </p>
              )}
            </div>

            {/* ফুটার */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', position: 'relative' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ width: '120px', height: '1px', background: '#333', marginBottom: '5px' }}></div>
                <p style={{ fontSize: '12px', color: '#555' }}>তারিখ</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '1px', background: '#333', margin: '0 auto 5px' }}></div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>সভাপতি</p>
                <p style={{ fontSize: '12px', color: '#555' }}>বাংলাদেশ কিন্ডার গার্টেন</p>
                <p style={{ fontSize: '12px', color: '#555' }}>ওয়েলফেয়ার এসোসিয়েশন</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: '120px', height: '1px', background: '#333', marginLeft: 'auto', marginBottom: '5px' }}></div>
                <p style={{ fontSize: '12px', color: '#555' }}>সীল</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* মেইন পেজ */}
      {!selectedCert && (
        <>
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-12">
            <div className="container mx-auto px-4">
              <Link href="/" className="text-yellow-200 hover:text-white mb-4 inline-block">← হোম পেজে ফিরুন</Link>
              <h1 className="text-3xl font-bold">📜 সার্টিফিকেট জেনারেটর</h1>
              <p className="text-yellow-100 mt-2">স্কলারশিপ ও ট্যালেন্টপুল প্রাপ্তদের সার্টিফিকেট</p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block font-semibold mb-2">📅 পরীক্ষা *</label>
                    <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                      className="w-full p-3 border rounded-lg">
                      <option value="">পরীক্ষা সিলেক্ট করুন</option>
                      {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">🏫 স্কুল (সব দেখতে খালি রাখুন)</label>
                    <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full p-3 border rounded-lg">
                      <option value="">সকল স্কুল</option>
                      {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={loadStudents} disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                  {loading ? '⏳ লোড হচ্ছে...' : '🔍 খুঁজুন'}
                </button>
              </div>

              {students.length > 0 && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <h2 className="text-xl font-bold">মনোনীত শিক্ষার্থী ({students.length} জন)</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="bg-gray-50"><th className="p-4 text-left">নাম</th><th className="p-4 text-left">রোল</th><th className="p-4 text-left">শ্রেণি</th><th className="p-4 text-left">স্কুল</th><th className="p-4 text-left">নম্বর</th><th className="p-4 text-left">গ্রেড</th><th className="p-4 text-left">সার্টিফিকেট</th></tr></thead>
                      <tbody>
                        {students.map((s: any, i: number) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-4 font-semibold">{s.students?.name_bn}</td>
                            <td className="p-4">{s.students?.roll}</td>
                            <td className="p-4">{s.students?.class}য়</td>
                            <td className="p-4 text-gray-600">{s.schools?.name_bn}</td>
                            <td className="p-4 font-bold">{s.total_marks}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {getGradeName(s.grade)}
                              </span>
                            </td>
                            <td className="p-4">
                              <button onClick={() => printCertificate(s)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700">
                                🖨️ প্রিন্ট
                              </button>
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
          
          <style jsx>{`
            @media print {
              body * { visibility: hidden; }
              #certificate-print, #certificate-print * { visibility: visible; }
              #certificate-print { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
