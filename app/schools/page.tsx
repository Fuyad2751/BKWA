'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .order('name_bn');
        
        if (error) {
          setError(error.message);
        } else {
          setSchools(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-xl text-red-600">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-green-200 hover:text-white mb-4 inline-block">
            ← হোম পেজে ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">অংশগ্রহণকারী শিক্ষা প্রতিষ্ঠান</h1>
          <p className="mt-2 text-green-100">
            মোট {schools.length} টি শিক্ষা প্রতিষ্ঠান
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Link key={school.id} href={`/schools/${school.id}`}>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-green-700 mb-2">{school.name_bn}</h3>
                {school.eiin && <p className="text-gray-600">🏛️ EIIN: {school.eiin}</p>}
                {school.address && <p className="text-gray-500 mt-2">📍 {school.address}</p>}
                {school.phone && <p className="text-gray-500">📞 {school.phone}</p>}
                <div className="mt-4 text-green-600 font-semibold">বিস্তারিত দেখুন →</div>
              </div>
            </Link>
          ))}
        </div>

        {schools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-xl text-gray-600">কোনো স্কুল পাওয়া যায়নি</p>
            <p className="text-gray-500 mt-2">Supabase-এ ডেটা এন্ট্রি করতে হবে</p>
          </div>
        )}
      </div>
    </div>
  );
}