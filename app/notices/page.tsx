'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (data) setNotices(data);
    setLoading(false);
  };

  const filtered = filter === 'all' ? notices : notices.filter(n => n.type === filter);

  const getTypeInfo = (type: string) => {
    switch(type) {
      case 'exam': return { icon: '📝', label: 'পরীক্ষা', color: 'bg-blue-100 text-blue-800' };
      case 'result': return { icon: '📊', label: 'ফলাফল', color: 'bg-green-100 text-green-800' };
      case 'event': return { icon: '🎉', label: 'ইভেন্ট', color: 'bg-purple-100 text-purple-800' };
      case 'urgent': return { icon: '🚨', label: 'জরুরি', color: 'bg-red-100 text-red-800' };
      default: return { icon: '📢', label: 'সাধারণ', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white mb-4 inline-block">← হোম পেজে ফিরুন</Link>
          <h1 className="text-3xl font-bold">📢 নোটিশ বোর্ড</h1>
          <p className="text-blue-100 mt-2">এসোসিয়েশনের সকল নোটিশ ও ঘোষণা</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ফিল্টার */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all','general','exam','result','event','urgent'].map(f => {
            const info = f === 'all' ? { icon: '📋', label: 'সব' } : getTypeInfo(f);
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
                {info.icon} {info.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">⏳ লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">কোনো নোটিশ নেই</div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filtered.map(notice => {
              const info = getTypeInfo(notice.type);
              return (
                <div key={notice.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{info.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{notice.title_bn}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.color}`}>{info.label}</span>
                      </div>
                      {notice.content && <p className="text-gray-600 mb-3">{notice.content}</p>}
                      <p className="text-xs text-gray-400">{new Date(notice.created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
