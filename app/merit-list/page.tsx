import Link from "next/link";

const meritList = [
  { rank: 1, name: "মোঃ রহিম", roll: "101", class: "৩য়", school: "আদর্শ কিন্টারগার্ডেন স্কুল", marks: 92, grade: "Scholarship" },
  { rank: 2, name: "সাদিয়া ইসলাম", roll: "201", class: "৩য়", school: "মডার্ন কিন্টারগার্ডেন একাডেমি", marks: 88, grade: "Scholarship" },
  { rank: 3, name: "ফাতেমা আক্তার", roll: "102", class: "৪র্থ", school: "আদর্শ কিন্টারগার্ডেন স্কুল", marks: 85, grade: "Scholarship" },
  { rank: 4, name: "মোঃ আরিফ", roll: "301", class: "৫ম", school: "ব্রাইট ফিউচার কিন্টারগার্ডেন", marks: 83, grade: "Scholarship" },
  { rank: 5, name: "নাজমুল হাসান", roll: "401", class: "৪র্থ", school: "স্টার কিন্টারগার্ডেন স্কুল", marks: 80, grade: "Scholarship" },
  { rank: 6, name: "রাবেয়া সুলতানা", roll: "501", class: "৫ম", school: "লিটল এঞ্জেলস কিন্টারগার্ডেন", marks: 78, grade: "Talentpool" },
  { rank: 7, name: "আব্দুল্লাহ আল মামুন", roll: "103", class: "৫ম", school: "আদর্শ কিন্টারগার্ডেন স্কুল", marks: 75, grade: "Talentpool" },
  { rank: 8, name: "সুমাইয়া আক্তার", roll: "202", class: "৪র্থ", school: "মডার্ন কিন্টারগার্ডেন একাডেমি", marks: 73, grade: "Talentpool" },
  { rank: 9, name: "মোঃ সোহেল", roll: "302", class: "৪র্থ", school: "ব্রাইট ফিউচার কিন্টারগার্ডেন", marks: 70, grade: "Talentpool" },
  { rank: 10, name: "তানজিলা হক", roll: "402", class: "৩য়", school: "স্টার কিন্টারগার্ডেন স্কুল", marks: 68, grade: "Talentpool" },
];

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const getGradeColor = (grade: string) => {
  switch(grade) {
    case 'Scholarship': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Talentpool': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'General': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getGradeName = (grade: string) => {
  switch(grade) {
    case 'Scholarship': return 'স্কলারশিপ';
    case 'Talentpool': return 'ট্যালেন্টপুল';
    case 'General': return 'সাধারণ';
    default: return grade;
  }
};

export default function MeritListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-yellow-200 hover:text-white mb-4 inline-block">
            ← হোম পেজে ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">🏆 মেরিট লিস্ট ২০২৪</h1>
          <p className="mt-2 text-yellow-100">বর্ষসেরা মেধাবী শিক্ষার্থীদের তালিকা</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* টপ ৩ স্টুডেন্ট */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {meritList.slice(0, 3).map((student, index) => (
            <div key={student.rank} className={`bg-white rounded-xl shadow-lg p-8 text-center ${
              index === 0 ? 'border-4 border-yellow-400 transform md:scale-110' :
              index === 1 ? 'border-4 border-gray-300' :
              'border-4 border-orange-400'
            }`}>
              <div className="text-6xl mb-4">
                {getMedalEmoji(student.rank)}
              </div>
              <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
              <p className="text-gray-600 mb-2">{student.school}</p>
              <p className="text-lg">শ্রেণি: {student.class}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-green-600">{student.marks}</span>
                <span className="text-gray-500">/১০০</span>
              </div>
              <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                {getGradeName(student.grade)}
              </span>
            </div>
          ))}
        </div>

        {/* সম্পূর্ণ মেরিট লিস্ট */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <h2 className="text-2xl font-bold">সেরা ১০ মেধাবী</h2>
            <p className="text-green-100 mt-1">বৃত্তি পরীক্ষা ২০২৪</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-left">মেধাক্রম</th>
                  <th className="p-4 text-left">রোল</th>
                  <th className="p-4 text-left">নাম</th>
                  <th className="p-4 text-left">শ্রেণি</th>
                  <th className="p-4 text-left">শিক্ষা প্রতিষ্ঠান</th>
                  <th className="p-4 text-left">নাম্বার</th>
                  <th className="p-4 text-left">গ্রেড</th>
                </tr>
              </thead>
              <tbody>
                {meritList.map((student) => (
                  <tr key={student.rank} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      {student.rank <= 3 ? (
                        <span className="text-2xl">{getMedalEmoji(student.rank)}</span>
                      ) : (
                        <span className="font-bold text-lg text-gray-600">{student.rank}</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-green-700">{student.roll}</td>
                    <td className="p-4 font-bold">{student.name}</td>
                    <td className="p-4">{student.class}</td>
                    <td className="p-4 text-gray-600">{student.school}</td>
                    <td className="p-4">
                      <span className="font-bold text-lg">{student.marks}</span>
                      <span className="text-gray-500">/১০০</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                        {getGradeName(student.grade)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* গ্রেড ব্যাখ্যা */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">স্কলারশিপ</h3>
            <p className="text-yellow-700">৮০-১০০ নম্বর</p>
            <p className="text-yellow-600 text-sm mt-2">সর্বোচ্চ মেধাবৃত্তি প্রাপ্ত শিক্ষার্থীরা</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">ট্যালেন্টপুল</h3>
            <p className="text-blue-700">৬০-৭৯ নম্বর</p>
            <p className="text-blue-600 text-sm mt-2">প্রতিভা বৃত্তি প্রাপ্ত শিক্ষার্থীরা</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">সাধারণ</h3>
            <p className="text-green-700">৪০-৫৯ নম্বর</p>
            <p className="text-green-600 text-sm mt-2">উত্তীর্ণ শিক্ষার্থীরা</p>
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