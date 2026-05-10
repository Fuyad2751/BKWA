import Link from "next/link";

// ডেমো ডেটা
const schoolData = {
  id: 1,
  name_bn: "আদর্শ কিন্টারগার্ডেন স্কুল",
  name_en: "Adarsha Kindergarten School",
  eiin: "123456",
  address: "মিরপুর-১০, ঢাকা-১২১৬",
  phone: "+৮৮০ ১৭১২-৩৪৫৬৭৮",
  email: "adarsha@school.com",
  principal: "মোঃ আব্দুর রহিম",
  students: [
    { id: 1, name_bn: "মোঃ রহিম", class: "৩য়", roll: "১০১", gender: "ছেলে" },
    { id: 2, name_bn: "ফাতেমা আক্তার", class: "৪র্থ", roll: "১০২", gender: "মেয়ে" },
    { id: 3, name_bn: "আব্দুল্লাহ আল মামুন", class: "৫ম", roll: "১০৩", gender: "ছেলে" },
  ]
};

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* স্কুল হেডার */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/schools" className="text-green-200 hover:text-white mb-4 inline-block">
            ← স্কুল তালিকায় ফিরুন
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{schoolData.name_bn}</h1>
          <p className="mt-2 text-green-100">{schoolData.name_en}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* স্কুল তথ্য */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">প্রতিষ্ঠানের তথ্য</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">EIIN নম্বর</p>
                  <p className="font-bold">{schoolData.eiin}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">ঠিকানা</p>
                  <p className="font-semibold">{schoolData.address}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">ফোন</p>
                  <p className="font-semibold">{schoolData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">ইমেইল</p>
                  <p className="font-semibold">{schoolData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">প্রধান শিক্ষক</p>
                  <p className="font-semibold">{schoolData.principal}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-gray-500 text-sm">মোট শিক্ষার্থী</p>
                  <p className="text-2xl font-bold text-green-600">{schoolData.students.length} জন</p>
                </div>
              </div>
            </div>
          </div>

          {/* শিক্ষার্থী তালিকা */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">পরীক্ষার্থী তালিকা</h2>
                <p className="text-gray-600 text-sm mt-1">
                  বৃত্তি পরীক্ষায় অংশগ্রহণকারী শিক্ষার্থীরা
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left">ক্রমিক</th>
                      <th className="p-4 text-left">নাম</th>
                      <th className="p-4 text-left">শ্রেণি</th>
                      <th className="p-4 text-left">রোল নম্বর</th>
                      <th className="p-4 text-left">লিঙ্গ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolData.students.map((student, index) => (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-semibold">{student.name_bn}</td>
                        <td className="p-4">{student.class}</td>
                        <td className="p-4">{student.roll}</td>
                        <td className="p-4">{student.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t text-center text-gray-600">
                মোট {schoolData.students.length} জন শিক্ষার্থী
              </div>
            </div>

            {/* স্কুলের ফলাফল */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">বিদ্যালয়ের ফলাফল</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">
                  ফলাফল আসন্ন। বিস্তারিত জানতে{" "}
                  <Link href="/results" className="text-green-600 font-semibold hover:underline">
                    ফলাফল পেজ
                  </Link>{" "}
                  ভিজিট করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; ২০২৪ BKWA. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}