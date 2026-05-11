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
    if (params?.id) fetchSchoolData(params.id as string);
  }, [params?.id]);

  const fetchSchoolData = async (id: string) => {
    const { data: s } = await supabase.from('schools').select('*').eq('id', id).single();
    if (s) setSchool(s);
    const { data: st } = await supabase.from('students').select('*').eq('school_id', id).order('class').order('roll');
    if (st) setStudents(st);
    const { data: r } = await supabase.from('results').select(`*, students!inner(name_bn, class, roll), scholarship_exams(year, title_bn)`).eq('school_id', id).order('total_marks', { ascending: false }).limit(20);
    if (r) setResults(r);
    setLoading(false);
  };

  const getGradeName = (g: string) => {
    if (g === 'Scholarship') return 'স্কলারশিপ';
    if (g === 'Talentpool') return 'ট্যালেন্টপুল';
    if (g === 'General') return 'সাধারণ';
    return g;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">⏳ লোড হচ্ছে...</div>;
  if (!school) return <div className="min-h-screen flex items-center justify-center text-xl">স্কুল পাওয়া যায়নি</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/schools" className="text-green-200 hover:text-white mb-4 inline-block">← স্কুল তালিকায় ফিরুন</Link>
          <h1 className="text-3xl font-bold">{school.name_bn}</h1>
          {school.name_en && <p className="text-green-100">{school.name_en}</p>}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">🖨️ PDF ডাউনলোড / প্রিন্ট</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">প্রতিষ্ঠানের তথ্য</h2>
            <div className="space-y-3">
              {school.eiin && <div><p className="text-gray-500 text-sm">EIIN</p><p className="font-bold">{school.eiin}</p></div>}
              {school.address && <div><p className="text-gray-500 text-sm">ঠিকানা</p><p className="font-semibold">{school.address}</p></div>}
              {school.phone && <div><p className="text-gray-500 text-sm">ফোন</p><p className="font-semibold">{school.phone}</p></div>}
              {school.email && <div><p className="text-gray-500 text-sm">ইমেইল</p><p className="font-semibold">{school.email}</p></div>}
              {school.principal && <div><p className="text-gray-500 text-sm">প্রধান শিক্ষক</p><p className="font-semibold">{school.principal}</p></div>}
              <div className="pt-4 border-t"><p className="text-gray-500 text-sm">মোট শিক্ষার্থী</p><p className="text-2xl font-bold text-green-600">{students.length} জন</p></div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow"><div className="p-6 border-b"><h2 className="text-xl font-bold">পরীক্ষার্থী তালিকা</h2></div>
              <table className="w-full"><thead><tr className="bg-gray-50"><th className="p-4 text-left">ক্রমিক</th><th className="p-4 text-left">নাম</th><th className="p-4 text-left">শ্রেণি</th><th className="p-4 text-left">রোল</th><th className="p-4 text-left">লিঙ্গ</th></tr></thead>
                <tbody>{students.map((s, i) => (<tr key={s.id} className="border-t"><td className="p-4">{i+1}</td><td className="p-4 font-semibold">{s.name_bn}</td><td className="p-4">{s.class}য়</td><td className="p-4">{s.roll}</td><td className="p-4">{s.gender==='male'?'ছেলে':'মেয়ে'}</td></tr>))}</tbody></table>
              <div className="p-4 bg-gray-50 text-center">মোট {students.length} জন</div>
            </div>
            <div className="bg-white rounded-xl shadow"><div className="p-6 border-b"><h2 className="text-xl font-bold">বিদ্যালয়ের ফলাফল</h2></div>
              {results.length>0 ? <table className="w-full"><thead><tr className="bg-gray-50"><th className="p-4 text-left">রোল</th><th className="p-4 text-left">নাম</th><th className="p-4 text-left">শ্রেণি</th><th className="p-4 text-left">বছর</th><th className="p-4 text-left">নম্বর</th><th className="p-4 text-left">গ্রেড</th></tr></thead><tbody>{results.map(r=>(<tr key={r.id} className="border-t"><td className="p-4">{r.students?.roll}</td><td className="p-4">{r.students?.name_bn}</td><td className="p-4">{r.students?.class}য়</td><td className="p-4">{r.scholarship_exams?.year}</td><td className="p-4 font-bold">{r.total_marks}</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${r.grade==='Scholarship'?'bg-yellow-100 text-yellow-800':r.grade==='Talentpool'?'bg-blue-100 text-blue-800':'bg-green-100 text-green-800'}`}>{getGradeName(r.grade)}</span></td></tr>))}</tbody></table> : <div className="p-6 text-center text-gray-600">ফলাফল আসন্ন। <Link href="/results" className="text-green-600 font-semibold hover:underline">ফলাফল পেজ</Link> ভিজিট করুন।</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}