'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  };

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* মোডাল */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.image_url} alt={selectedPhoto.title_bn} className="max-w-full max-h-[80vh] rounded-xl" />
            {selectedPhoto.title_bn && <p className="text-white text-center mt-4 text-lg">{selectedPhoto.title_bn}</p>}
          </div>
        </div>
      )}

      {/* হেডার */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-pink-200 hover:text-white mb-4 inline-block">← হোম পেজে ফিরুন</Link>
          <h1 className="text-3xl font-bold">📸 গ্যালারি</h1>
          <p className="text-pink-100 mt-2">এসোসিয়েশনের স্মরণীয় মুহূর্তগুলো</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ফিল্টার */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all','event','exam','award','other'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold ${filter === f ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              {f === 'all' ? '📋 সব' : f === 'event' ? '🎉 ইভেন্ট' : f === 'exam' ? '📝 পরীক্ষা' : f === 'award' ? '🏆 পুরস্কার' : '📌 অন্যান্য'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">⏳ লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">কোনো ছবি নেই</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(photo => (
              <div key={photo.id} onClick={() => setSelectedPhoto(photo)}
                className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1">
                <img src={photo.image_url} alt={photo.title_bn} className="w-full h-48 object-cover" />
                {photo.title_bn && (
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{photo.title_bn}</p>
                    <span className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString('bn-BD')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
