'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminGallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ title_bn: "", image_url: "", category: "event", is_published: true });

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setPhotos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('gallery').insert([formData]);
    if (error) setMessage('❌ ' + error.message);
    else { setMessage('✅ ছবি যোগ হয়েছে!'); setFormData({ title_bn: "", image_url: "", category: "event", is_published: true }); fetchPhotos(); }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('ডিলিট করতে চান?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchPhotos();
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
        <div className="text-xl font-bold mb-8 p-4 border-b border-gray-700">BKWA Admin</div>
        <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800">📊 ড্যাশবোর্ড</Link>
        <Link href="/admin/gallery" className="flex items-center gap-3 p-3 rounded-lg bg-green-600 mt-2">📸 গ্যালারি</Link>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/dashboard" className="text-green-600 hover:underline mb-4 inline-block">← ড্যাশবোর্ডে ফিরুন</Link>

          {message && <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

          {/* ফর্ম */}
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">📸 নতুন ছবি যোগ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="ছবির URL *" required value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-3 border rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="শিরোনাম (ঐচ্ছিক)" value={formData.title_bn}
                  onChange={(e) => setFormData({...formData, title_bn: e.target.value})}
                  className="p-3 border rounded-lg" />
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="p-3 border rounded-lg">
                  <option value="event">🎉 ইভেন্ট</option>
                  <option value="exam">📝 পরীক্ষা</option>
                  <option value="award">🏆 পুরস্কার</option>
                  <option value="other">📌 অন্যান্য</option>
                </select>
              </div>
              <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700">
                ✅ যোগ করুন
              </button>
            </form>
          </div>

          {/* তালিকা */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b"><h2 className="text-xl font-bold">সকল ছবি ({photos.length})</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden">
                  <img src={photo.image_url} alt={photo.title_bn} className="w-full h-32 object-cover" />
                  <button onClick={() => deletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition">
                    ✕
                  </button>
                  {photo.title_bn && <p className="text-xs p-2 truncate">{photo.title_bn}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
