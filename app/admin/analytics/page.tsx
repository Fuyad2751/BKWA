'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [stats, setStats] = useState<any>({});
  const [schoolStats, setSchoolStats] = useState<any[]>([]);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const { data } = await supabase
      .from('scholarship_exams')
      .select('*')
      .order('year', { ascending: false });
    if (data) setExams(data);
  };

  const loadAnalytics = async () => {
    if (!selectedExam) return;
    setLoading(true);

    // সামগ্রিক পরিসংখ্যান
    const { data: results } = await supabase
      .from('results')
      .select('*, schools(name_bn), students(class)')
      .eq('exam_id', selectedExam);

    if (results) {
      const total = results.length;
      const scholarship = results.filter(r => r.grade === 'Scholarship').length;
      const talentpool = results.filter(r => r.grade === 'Talentpool').length;
      const general = results.filter(r => r.grade === 'General').length;
      const fail = results.filter(r => r.grade === 'Fail').length;
      const passTotal = total - fail;
      const passRate = total > 0 ? ((passTotal / total) * 100).toFixed(1) : '0';
      const avgMarks = total > 0 ? (results.reduce((sum, r) => sum + (r.total_marks || 0), 0) / total).toFixed(2) : '0';

      setStats({ total, scholarship, talentpool, general, fail, passTotal, passRate, avgMarks });

      // স্কুলভিত্তিক পরিসংখ্যান
      const schoolMap: any = {};
      results.forEach(r => {
        const name = r.schools?.name_bn || 'অজানা';
        if (!schoolMap[name]) schoolMap[name] = { name, total: 0, scholarship: 0, talentpool: 0, pass: 0 };
        schoolMap[name].total++;
        if (r.grade === 'Scholarship') schoolMap[name].scholarship++;
        if (r.grade === 'Talentpool') schoolMap[name].talentpool++;
        if (r.grade !== 'Fail') schoolMap[name].pass++;
      });
      setSchoolStats(Object.values(schoolMap).sort((a: any, b: any) => b.total - a.total));

      // শ্রেণীভিত্তিক পরিসংখ্যান
      const classMap: any = {};
      results.forEach(r => {
        const cls = r.students?.class || '?';
        if (!classMap[cls]) classMap[cls] = { class: `${cls}য়`, total: 0, scholarship: 0, talentpool: 0, pass: 0 };
        classMap[cls].total++;
        if (r.grade === 'Scholarship') classMap[cls].scholarship++;
        if (r.grade === 'Talentpool') classMap[cls].talentpool++;
        if (r.grade !== 'Fail') classMap[cls].pass++;
      });
      setClassStats(Object.values(classMap).sort((a: any, b: any) => parseInt(a.class) - parseInt(b.class)));
    }

    setLoading(false);
  };

  // বার চার্ট কম্পোনেন্ট
  const BarChart = ({ value, max, color, label }: any) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div className={`h-6 rounded-full ${color} flex items-center justify-end pr-2 text-xs text-white font-bold`}
          style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, minWidth: value > 0 ? '30px' : '0' }}>
          {value > 0 && value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📈 অ্যানালিটিক্স</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <h1 className="text-2xl font-bold mb-6">📈 অ্যানালিটিক্স ড্যাশবোর্ড</h1>

            <div className="flex gap-4 mb-8">
              <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                className="flex-1 p-3 border rounded-lg">
                <option value="">পরীক্ষা সিলেক্ট করুন</option>
                {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
              </select>
              <button onClick={loadAnalytics} disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                {loading ? '⏳' : '🔍 বিশ্লেষণ করুন'}
              </button>
            </div>

            {stats.total > 0 && (
              <>
                {/* টপ কার্ড */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6 text-center"><div className="text-3xl font-bold text-blue-700">{stats.total}</div><div className="text-sm text-gray-600">মোট পরীক্ষার্থী</div></div>
                  <div className="bg-green-50 rounded-xl p-6 text-center"><div className="text-3xl font-bold text-green-700">{stats.passRate}%</div><div className="text-sm text-gray-600">পাসের হার</div></div>
                  <div className="bg-yellow-50 rounded-xl p-6 text-center"><div className="text-3xl font-bold text-yellow-700">{stats.scholarship}</div><div className="text-sm text-gray-600">স্কলারশিপ</div></div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center"><div className="text-3xl font-bold text-purple-700">{stats.avgMarks}</div><div className="text-sm text-gray-600">গড় নম্বর</div></div>
                </div>

                {/* গ্রেড বার চার্ট */}
                <div className="bg-white rounded-xl border p-6 mb-8">
                  <h2 className="text-lg font-bold mb-4">📊 গ্রেডভিত্তিক বিতরণ</h2>
                  <BarChart value={stats.scholarship} max={stats.total} color="bg-yellow-500" label="🏆 স্কলারশিপ" />
                  <BarChart value={stats.talentpool} max={stats.total} color="bg-blue-500" label="⭐ ট্যালেন্টপুল" />
                  <BarChart value={stats.general} max={stats.total} color="bg-green-500" label="✅ সাধারণ" />
                  <BarChart value={stats.fail} max={stats.total} color="bg-red-400" label="❌ অনুত্তীর্ণ" />
                </div>

                {/* স্কুলভিত্তিক টেবিল */}
                <div className="bg-white rounded-xl border overflow-hidden mb-8">
                  <div className="p-6 border-b bg-gray-50"><h2 className="text-lg font-bold">🏫 স্কুলভিত্তিক ফলাফল</h2></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50"><th className="p-3 text-left">স্কুল</th><th className="p-3 text-center">মোট</th><th className="p-3 text-center">পাস</th><th className="p-3 text-center">স্কলারশিপ</th><th className="p-3 text-center">ট্যালেন্টপুল</th><th className="p-3 text-center">পাস%</th></tr></thead>
                      <tbody>
                        {schoolStats.map((s: any, i: number) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-semibold">{s.name}</td>
                            <td className="p-3 text-center">{s.total}</td>
                            <td className="p-3 text-center text-green-600 font-bold">{s.pass}</td>
                            <td className="p-3 text-center text-yellow-600 font-bold">{s.scholarship}</td>
                            <td className="p-3 text-center text-blue-600 font-bold">{s.talentpool}</td>
                            <td className="p-3 text-center font-bold">{s.total > 0 ? ((s.pass / s.total) * 100).toFixed(1) : '0'}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* শ্রেণীভিত্তিক টেবিল */}
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-6 border-b bg-gray-50"><h2 className="text-lg font-bold">📚 শ্রেণীভিত্তিক ফলাফল</h2></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50"><th className="p-3 text-left">শ্রেণি</th><th className="p-3 text-center">মোট</th><th className="p-3 text-center">পাস</th><th className="p-3 text-center">স্কলারশিপ</th><th className="p-3 text-center">ট্যালেন্টপুল</th><th className="p-3 text-center">পাস%</th></tr></thead>
                      <tbody>
                        {classStats.map((c: any, i: number) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-semibold">{c.class}</td>
                            <td className="p-3 text-center">{c.total}</td>
                            <td className="p-3 text-center text-green-600 font-bold">{c.pass}</td>
                            <td className="p-3 text-center text-yellow-600 font-bold">{c.scholarship}</td>
                            <td className="p-3 text-center text-blue-600 font-bold">{c.talentpool}</td>
                            <td className="p-3 text-center font-bold">{c.total > 0 ? ((c.pass / c.total) * 100).toFixed(1) : '0'}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {stats.total === 0 && selectedExam && !loading && (
              <div className="text-center py-12 text-gray-500">এখনো কোনো ফলাফল নেই</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
