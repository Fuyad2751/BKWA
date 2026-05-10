'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ডেমো লগইন (পরবর্তীতে Supabase Auth হবে)
    if (email === "admin@bkwa.org" && password === "admin123") {
      localStorage.setItem("admin_token", "demo_token_2024");
      router.push("/admin/dashboard");
    } else {
      setError("ইমেইল বা পাসওয়ার্ড ভুল!");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">BKWA</h1>
          <p className="text-gray-600 mt-2">অ্যাডমিন প্যানেল</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">🔐 অ্যাডমিন লগইন</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">📧 ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bkwa.org"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🔒 পাসওয়ার্ড</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">🔑 ডেমো লগইন তথ্য:</p>
            <p className="text-sm text-blue-700">ইমেইল: admin@bkwa.org</p>
            <p className="text-sm text-blue-700">পাসওয়ার্ড: admin123</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-green-600 hover:underline">
            ← হোম পেজে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}