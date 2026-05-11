'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';

export default function UploadResults() {
  const [exams, setExams] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<'manual' | 'excel'>('excel');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelPreview, setExcelPreview] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [examRes, schoolRes] = await Promise.all([
      supabase.from('scholarship_exams').select('*').order('year', { ascending: false }),
      supabase.from('schools').select('id, name_bn').order('name_bn')
    ]);
    if (examRes.data) setExams(examRes.data);
    if (schoolRes.data) setSchools(schoolRes.data);
  };

  // ========== এক্সেল আপলোড ==========
  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setExcelPreview(jsonData as any[]);
    };
    reader.readAsBinaryString(file);
  };

  const saveExcelData = async () => {
    if (!selectedExam) return alert('পরীক্ষা সিলেক্ট করুন');
    if (!selectedSchool) return alert('স্কুল সিলেক্ট করুন');
    if (excelPreview.length === 0) return alert('কোনো ডেটা নেই');

    setLoading(true);
    try {
      const { data: studentsData } = await supabase
        .from('students')
        .select('id, roll, class, school_id')
        .eq('school_id', selectedSchool);

      const studentMap = new Map();
      studentsData?.forEach(s => studentMap.set(String(s.roll), s));

      const resultsToSave = excelPreview.map(row => {
        const roll = String(row['রোল'] || row['roll'] || row['Roll'] || '');
        const student = studentMap.get(roll);
        const studentClass = parseInt(row['শ্রেণি'] || row['শ্রেণী'] || row['class'] || '1');
        const isUpper = studentClass >= 3;

        const bangla = parseFloat(row['বাংলা'] || row['bangla'] || 0);
        const english = parseFloat(row['ইংরেজি'] || row['ইংরেজী'] || row['english'] || 0);
        const math = parseFloat(row['গণিত'] || row['math'] || 0);
        const science = isUpper ? parseFloat(row['সমাজ'] || row['বিজ্ঞান'] || row['সমাজ/বিজ্ঞান'] || row['science'] || 0) : 0;

        // বিষয়ভিত্তিক ৩৩ চেক
        const anyFail = bangla < 33 || english < 33 || math < 33 || (isUpper && science < 33);
        
        let grade = 'Fail';
        let total = 0;

        if (!anyFail) {
          total = isUpper 
            ? parseFloat(((bangla + english + math + science) / 4).toFixed(2))
            : parseFloat(((bangla + english + math) / 3).toFixed(2));
          
          if (total >= 80) grade = 'Scholarship';
          else if (total >= 60) grade = 'Talentpool';
          else if (total >= 40) grade = 'General';
        } else {
          total = isUpper 
            ? parseFloat(((bangla + english + math + science) / 4).toFixed(2))
            : parseFloat(((bangla + english + math) / 3).toFixed(2));
        }

        return {
          exam_id: selectedExam,
          student_id: student?.id,
          school_id: selectedSchool,
          bangla_marks: bangla,
          english_marks: english,
          math_marks: math,
          science_marks: science,
          total_marks: total,
          grade,
          subject_count: isUpper ? 4 : 3
        };
      });

      const { error } = await supabase.from('results').upsert(resultsToSave, { onConflict: 'exam_id,student_id' });
      if (error) throw error;
      setSuccess(`✅ ${resultsToSave.length} জনের ফলাফল সফলভাবে সেভ হয়েছে!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      alert('❌ ' + err.message);
    }
    setLoading(false);
  };

  // ========== ম্যানুয়াল এন্ট্রি ==========
  const handleSchoolChange = async (schoolId: string) => {
    setSelectedSchool(schoolId);
    if (schoolId) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('class')
        .order('roll');
      if (data) {
        setStudents(data);
        const resultData = data.map(s => ({
          student_id: s.id, school_id: s.school_id, student_name: s.name_bn,
          roll: s.roll, class: s.class, bangla: '', english: '', math: '', science: '',
          total: 0, grade: ''
        }));
        setResults(resultData);
      }
    }
  };

  const updateMark = (index: number, subject: string, value: string) => {
    const newResults = [...results];
    const student = newResults[index];
    const isUpper = parseInt(student.class) >= 3;
    
    if (subject === 'bangla') student.bangla = value;
    if (subject === 'english') student.english = value;
    if (subject === 'math') student.math = value;
    if (subject === 'science') student.science = value;

    const b = parseFloat(student.bangla) || 0;
    const e = parseFloat(student.english) || 0;
    const m = parseFloat(student.math) || 0;
    const s = parseFloat(student.science) || 0;

    // বিষয়ভিত্তিক ৩৩ চেক
    const anyFail = b < 33 || e < 33 || m < 33 || (isUpper && s < 33);

    student.total = isUpper 
      ? parseFloat(((b + e + m + s) / 4).toFixed(2))
      : parseFloat(((b + e + m) / 3).toFixed(2));

    if (anyFail) {
      student.grade = 'Fail';
    } else {
      const total = student.total;
      if (total >= 80) student.grade = 'Scholarship';
      else if (total >= 60) student.grade = 'Talentpool';
      else if (total >= 40) student.grade = 'General';
      else student.grade = 'Fail';
    }

    setResults(newResults);
  };

  const saveManualResults = async () => {
    if (!selectedExam || !selectedSchool) return alert('পরীক্ষা ও স্কুল সিলেক্ট করুন');
    setLoading(true);
    const dataToSave = results.map(r => ({
      exam_id: selectedExam, student_id: r.student_id, school_id: r.school_id,
      bangla_marks: parseFloat(r.bangla) || 0, english_marks: parseFloat(r.english) || 0,
      math_marks: parseFloat(r.math) || 0, science_marks: parseFloat(r.science) || 0,
      total_marks: r.total, grade: r.grade, subject_count: parseInt(r.class) >= 3 ? 4 : 3
    }));
    const { error } = await supabase.from('results').upsert(dataToSave, { onConflict: 'exam_id,student_id' });
    if (error) alert('❌ ' + error.message);
    else setSuccess('✅ ফলাফল সেভ হয়েছে!');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/exams/add" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 mt-2">📝 পরীক্ষা যোগ</Link>
        <Link href="/admin/results/upload" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📊 ফলাফল</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">📊 ফলাফল এন্ট্রি</h1>
            {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">{success}</div>}

            <div className="flex gap-4 mb-8">
              <button onClick={() => setActiveTab('excel')} className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'excel' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>📁 এক্সেল আপলোড</button>
              <button onClick={() => setActiveTab('manual')} className={`px-6 py-3 rounded-lg font-bold ${activeTab === 'manual' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>✍️ ম্যানুয়াল এন্ট্রি</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div><label className="block font-semibold mb-2">📅 পরীক্ষা *</label>
                <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">পরীক্ষা সিলেক্ট করুন</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title_bn} ({ex.year})</option>)}
                </select>
              </div>
              <div><label className="block font-semibold mb-2">🏫 স্কুল *</label>
                <select value={selectedSchool} onChange={(e) => handleSchoolChange(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">স্কুল সিলেক্ট করুন</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
                </select>
              </div>
            </div>

            {/* এক্সেল ট্যাব */}
            {activeTab === 'excel' && (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-green-500 transition">
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} className="hidden" id="excel-upload" />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <div className="text-5xl mb-4">📁</div>
                    <p className="text-lg font-bold mb-2">{selectedFile ? selectedFile.name : 'এক্সেল ফাইল সিলেক্ট করুন'}</p>
                    <p className="text-gray-500">.xlsx, .xls, .csv</p>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-blue-800 mb-3">📋 এক্সেল ফাইল ফরম্যাট (বাংলা হেডার)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-white border">
                      <thead className="bg-blue-100"><tr><th className="p-2 border">রোল</th><th className="p-2 border">শ্রেণি</th><th className="p-2 border">বাংলা</th><th className="p-2 border">ইংরেজি</th><th className="p-2 border">গণিত</th><th className="p-2 border">সমাজ/বিজ্ঞান*</th></tr></thead>
                      <tbody>
                        <tr><td className="p-2 border text-center">১০১</td><td className="p-2 border text-center">৩</td><td className="p-2 border text-center">৮৫</td><td className="p-2 border text-center">৯০</td><td className="p-2 border text-center">৮৮</td><td className="p-2 border text-center">৯২</td></tr>
                        <tr><td className="p-2 border text-center">২০১</td><td className="p-2 border text-center">১</td><td className="p-2 border text-center">৮০</td><td className="p-2 border text-center">৭৫</td><td className="p-2 border text-center">৮২</td><td className="p-2 border text-center">-</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-blue-700">
                    <p>✅ <b>১ম-২য় শ্রেণী:</b> রোল, শ্রেণি, বাংলা, ইংরেজি, গণিত (৩ বিষয়)</p>
                    <p>✅ <b>৩য়-৫ম শ্রেণী:</b> রোল, শ্রেণি, বাংলা, ইংরেজি, গণিত, সমাজ/বিজ্ঞান (৪ বিষয়)</p>
                    <p>⚠️ যে কোনো বিষয়ে ৩৩-এর কম = Fail | গড় ৮০+ = Scholarship, ৬০+ = Talentpool, ৪০+ = General</p>
                  </div>
                </div>

                {excelPreview.length > 0 && (
                  <>
                    <h3 className="font-bold mb-4">📋 প্রিভিউ ({excelPreview.length} জন)</h3>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border text-sm">
                        <thead><tr className="bg-green-600 text-white">{Object.keys(excelPreview[0]).map(key => <th key={key} className="p-2 border">{key}</th>)}</tr></thead>
                        <tbody>{excelPreview.slice(0, 5).map((row, i) => <tr key={i} className="border-t">{Object.values(row).map((val: any, j) => <td key={j} className="p-2 border text-center">{val}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                    <button onClick={saveExcelData} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                      {loading ? '⏳ সেভ হচ্ছে...' : `💾 ${excelPreview.length} জনের ফলাফল সেভ করুন`}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ম্যানুয়াল ট্যাব */}
            {activeTab === 'manual' && results.length > 0 && (
              <div>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border text-sm">
                    <thead><tr className="bg-green-600 text-white"><th className="p-2 border">রোল</th><th className="p-2 border">নাম</th><th className="p-2 border">শ্রেণি</th><th className="p-2 border">বাংলা</th><th className="p-2 border">ইংরেজি</th><th className="p-2 border">গণিত</th>{results.some(r => parseInt(r.class) >= 3) && <th className="p-2 border">সাঃ/বিঃ</th>}<th className="p-2 border">গড়</th><th className="p-2 border">গ্রেড</th></tr></thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-2 border text-center font-semibold">{r.roll}</td>
                          <td className="p-2 border">{r.student_name}</td>
                          <td className="p-2 border text-center">{r.class}য়</td>
                          <td className="p-2 border"><input type="number" min="0" max="100" value={r.bangla} onChange={(e) => updateMark(i, 'bangla', e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
                          <td className="p-2 border"><input type="number" min="0" max="100" value={r.english} onChange={(e) => updateMark(i, 'english', e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
                          <td className="p-2 border"><input type="number" min="0" max="100" value={r.math} onChange={(e) => updateMark(i, 'math', e.target.value)} className="w-16 p-1 border rounded text-center" /></td>
                          {parseInt(r.class) >= 3 && <td className="p-2 border"><input type="number" min="0" max="100" value={r.science} onChange={(e) => updateMark(i, 'science', e.target.value)} className="w-16 p-1 border rounded text-center" /></td>}
                          <td className="p-2 border text-center font-bold">{r.total}</td>
                          <td className="p-2 border text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.grade === 'Scholarship' ? 'bg-yellow-100 text-yellow-800' : r.grade === 'Talentpool' ? 'bg-blue-100 text-blue-800' : r.grade === 'General' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{r.grade}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={saveManualResults} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50">
                  {loading ? '⏳ সেভ হচ্ছে...' : '💾 সবার ফলাফল সেভ করুন'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
