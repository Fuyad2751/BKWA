import Link from "next/link";

export default function ScholarshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-purple-200 hover:text-white mb-4 inline-block">
            ← হোম পেজে ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">স্কলারশিপ ও বৃত্তি তথ্য</h1>
          <p className="mt-2 text-purple-100">
            বাংলাদেশ কিন্টারগার্ডেন ওয়েলফেয়ার এসোসিয়েশন বৃত্তি প্রোগ্রাম
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* বৃত্তি সম্পর্কে */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              📚 বৃত্তি পরীক্ষা সম্পর্কে
            </h2>
            <div className="prose max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                বাংলাদেশ কিন্টারগার্ডেন ওয়েলফেয়ার এসোসিয়েশন প্রতি বছর প্রথম থেকে পঞ্চম শ্রেণীর 
                শিক্ষার্থীদের জন্য বৃত্তি পরীক্ষার আয়োজন করে থাকে। এই পরীক্ষায় ৩০টিরও বেশি 
                শিক্ষা প্রতিষ্ঠানের শিক্ষার্থীরা অংশগ্রহণ করে।
              </p>
              <p className="text-gray-700 leading-relaxed">
                বৃত্তি পরীক্ষার মাধ্যমে মেধাবী শিক্ষার্থীদের চিহ্নিত করে তাদের আর্থিক সহায়তা 
                প্রদানের পাশাপাশি শিক্ষার মান উন্নয়নে উৎসাহিত করা হয়।
              </p>
            </div>
          </div>

          {/* গ্রেডিং সিস্টেম */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              📊 গ্রেডিং সিস্টেম
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl p-6">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-yellow-800 mb-2">স্কলারশিপ</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-3">৮০-১০০</div>
                <p className="text-yellow-700">মেধাবৃত্তি</p>
                <ul className="mt-4 space-y-2 text-sm text-yellow-800">
                  <li>• সর্বোচ্চ সম্মাননা</li>
                  <li>• আর্থিক সহায়তা</li>
                  <li>• সনদপত্র প্রদান</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-xl p-6">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">ট্যালেন্টপুল</h3>
                <div className="text-3xl font-bold text-blue-600 mb-3">৬০-৭৯</div>
                <p className="text-blue-700">প্রতিভা বৃত্তি</p>
                <ul className="mt-4 space-y-2 text-sm text-blue-800">
                  <li>• বিশেষ স্বীকৃতি</li>
                  <li>• আংশিক সহায়তা</li>
                  <li>• সনদপত্র প্রদান</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-xl p-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">সাধারণ</h3>
                <div className="text-3xl font-bold text-green-600 mb-3">৪০-৫৯</div>
                <p className="text-green-700">উত্তীর্ণ</p>
                <ul className="mt-4 space-y-2 text-sm text-green-800">
                  <li>• পাস সার্টিফিকেট</li>
                  <li>• পরীক্ষায় উত্তীর্ণ</li>
                  <li>• অংশগ্রহণ স্বীকৃতি</li>
                </ul>
              </div>
            </div>
          </div>

          {/* যোগ্যতা */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              ✅ অংশগ্রহণের যোগ্যতা
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-bold text-lg">শ্রেণি</h4>
                  <p className="text-gray-600">প্রথম থেকে পঞ্চম শ্রেণীর শিক্ষার্থী হতে হবে</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-bold text-lg">শিক্ষা প্রতিষ্ঠান</h4>
                  <p className="text-gray-600">এসোসিয়েশনভুক্ত ৩০+ শিক্ষা প্রতিষ্ঠানের শিক্ষার্থী হতে হবে</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-bold text-lg">নিবন্ধন</h4>
                  <p className="text-gray-600">বিদ্যালয়ের মাধ্যমে নির্ধারিত সময়ে নিবন্ধন করতে হবে</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h4 className="font-bold text-lg">পরীক্ষার ফি</h4>
                  <p className="text-gray-600">নির্ধারিত পরীক্ষার ফি জমা দিতে হবে</p>
                </div>
              </div>
            </div>
          </div>

          {/* পরীক্ষার নিয়ম */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              📝 পরীক্ষার নিয়মাবলী
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-3">📋 বিষয়সমূহ</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• বাংলা</li>
                  <li>• ইংরেজি</li>
                  <li>• গণিত</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-3">⏰ সময়সূচী</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• মোট সময়: ২ ঘণ্টা</li>
                  <li>• পূর্ণমান: ১০০</li>
                  <li>• প্রশ্নপত্র: বাংলা ও ইংরেজি</li>
                </ul>
              </div>
            </div>
          </div>

          {/* কল টু অ্যাকশন */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">ফলাফল দেখতে চান?</h2>
            <p className="text-lg mb-6 opacity-90">
              আপনার ফলাফল জানতে রোল নম্বর দিয়ে সার্চ করুন
            </p>
            <Link
              href="/results"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 inline-block"
            >
              ফলাফল দেখুন →
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; ২০২৪ বাংলাদেশ কিন্টারগার্ডেন ওয়েলফেয়ার এসোসিয়েশন</p>
        </div>
      </footer>
    </div>
  );
}