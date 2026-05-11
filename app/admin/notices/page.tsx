'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ title_bn: "", content: "", type: "general", is_published: true });

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (data) setNotices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('notices').insert([formData]);
    if (error) setMessage('❌ ' + error.message);
    else { setMessage('✅ নোটিশ যোগ হয়েছে!'); setFormData({ title_bn: "", content: "", type: "general", is_published: true }); fetchNotices(); }
    setLoading(false);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from('notices').update({ is_published: !current }).eq('id', id);
    fetchNotices();
  };

  const deleteNotice = async (id: string) => {
    if (!confirm('ডিলিট করতে চান?')) return;
    await supabase.from('notices').delete().eq('id', id);
    fetchNotices();
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/notices" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📢 নোটিশ</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          {message && <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

          {/* ফর্ম */}
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">📢 নতুন নোটিশ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="শিরোনাম" value={formData.title_bn}
                onChange={(e) => setFormData({...formData, title_bn: e.target.value})}
                className="w-full p-3 border rounded-lg" />
              <textarea rows={3} placeholder="বিস্তারিত (ঐচ্ছিক)" value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 border rounded-lg" />
              <div className="flex gap-4">
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="p-3 border rounded-lg">
                  <option value="general">📢 সাধারণ</option>
                  <option value="exam">📝 পরীক্ষা</option>
                  <option value="result">📊 ফলাফল</option>
                  <option value="event">🎉 ইভেন্ট</option>
                  <option value="urgent">🚨 জরুরি</option>
                </select>
                <button type="submit" disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                  {loading ? '⏳' : '✅ প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>

          {/* তালিকা */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b"><h2 className="text-xl font-bold">সকল নোটিশ</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50"><th className="p-3 text-left">শিরোনাম</th><th className="p-3 text-left">ধরন</th><th className="p-3 text-left">স্ট্যাটাস</th><th className="p-3 text-left">তারিখ</th><th className="p-3 text-left">অ্যাকশন</th></tr></thead>
                <tbody>
                  {notices.map(n => (
                    <tr key={n.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-semibold">{n.title_bn}</td>
                      <td className="p-3">{n.type}</td>
                      <td className="p-3">
                        <button onClick={() => togglePublish(n.id, n.is_published)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${n.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {n.is_published ? '✅ প্রকাশিত' : '⬜ ড্রাফট'}
                        </button>
                      </td>
                      <td className="p-3 text-xs">{new Date(n.created_at).toLocaleDateString('bn-BD')}</td>
                      <td className="p-3">
                        <button onClick={() => deleteNotice(n.id)} className="text-red-600 hover:underline">🗑️ ডিলিট</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
