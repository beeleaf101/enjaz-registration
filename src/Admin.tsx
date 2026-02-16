import { useState, useEffect } from 'react';
import { Users, Trash2, RefreshCw, Search, ArrowLeft, GraduationCap, Phone, CreditCard, Calendar } from 'lucide-react';
import { getAllRegistrations, deleteRegistration } from './database';

interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  phoneNumber: string;
  registeredAt: string;
}

function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await getAllRegistrations();
    
    if (result.success) {
      setRegistrations(result.data || []);
    } else {
      setError('لا يمكن تحميل البيانات. حاول مرة أخرى.');
    }
    
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التسجيل؟')) return;
    
    const result = await deleteRegistration(id);
    
    if (result.success) {
      setRegistrations(registrations.filter(r => r.id !== id));
    } else {
      alert('فشل حذف التسجيل');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(reg =>
    reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.studentId.includes(searchTerm) ||
    reg.phoneNumber.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-KW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold text-blue-900"
                  style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                >
                  لوحة التحكم
                </h1>
                <p className="text-gray-500 text-sm">Admin Dashboard</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للنموذج
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                  إجمالي التسجيلات
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{registrations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                  آخر تسجيل
                </p>
                <p className="text-lg font-bold text-teal-900 mt-1">
                  {registrations.length > 0 
                    ? formatDate(registrations[registrations.length - 1].registeredAt).split(',')[0]
                    : '-'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                  الحالة
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">نشط</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث بالاسم أو الرقم الأكاديمي أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 text-right bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
              />
            </div>
            <button
              onClick={fetchRegistrations}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center mb-6" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
            {error}
          </div>
        )}

        {/* Registrations Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-semibold" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      الرقم الأكاديمي
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right font-semibold" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      اسم الطالب
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right font-semibold" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right font-semibold" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      تاريخ التسجيل
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-gray-500" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                          جاري تحميل البيانات...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                          {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد تسجيلات حتى الآن'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg.id}
                      className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-gray-700">{reg.studentId}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                        {reg.studentName}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600" dir="ltr">
                        {reg.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(reg.registeredAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
            © 2026 Enjaz - CCK. جميع الحقوق محفوظة
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Admin;
