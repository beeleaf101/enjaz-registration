import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { User, Phone, CreditCard, CheckCircle, Sparkles, Loader2 } from 'lucide-react'
import { addRegistration } from './database'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    phoneNumber: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const headerRef = useRef<HTMLDivElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const infoPanelRef = useRef<HTMLDivElement>(null)
  const cckLogoRef = useRef<HTMLImageElement>(null)
  const injazLogoRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const fieldsRef = useRef<(HTMLDivElement | null)[]>([])

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    
    // Header animations
    tl.fromTo(cckLogoRef.current, 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 }
    )
    .fromTo(injazLogoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    
    // Info panel slide in
    .fromTo(infoPanelRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      '-=0.3'
    )
    
    // Form card slide in
    .fromTo(formCardRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    
    // Form fields stagger
    .fromTo(fieldsRef.current.filter(Boolean),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
      '-=0.4'
    )
  }, [])

  // Floating animation for logos
  useEffect(() => {
    gsap.to([cckLogoRef.current, injazLogoRef.current], {
      y: '+=5',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, [])

  // Mouse tracking for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formCardRef.current) return
    const rect = formCardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x: x * 5, y: y * -5 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.studentId && formData.studentName && formData.phoneNumber) {
      setIsLoading(true)
      
      const result = await addRegistration(formData)
      
      if (result.success) {
        setIsSubmitted(true)
        gsap.fromTo('.success-message',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
        )
      } else {
        setError(result.error || 'حدث خطأ أثناء التسجيل')
      }
      
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <header ref={headerRef} className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          {/* Logos */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="logo-container">
              <img
                ref={cckLogoRef}
                src="/logos/cck-logo.png"
                alt="CCK Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
              />
            </div>
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" />
            <div className="logo-container">
              <img
                ref={injazLogoRef}
                src="/logos/injaz-logo.png"
                alt="INJAZ Kuwait Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-2"
            style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
          >
            تسجيل الطلاب
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-center text-teal-700 font-medium"
          >
            Enjaz - CCK Registration Portal
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Info Panel */}
          <div
            ref={infoPanelRef}
            className="lg:w-2/5 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50"
          >
            <div className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-amber-500" />
                <h2 
                  className="text-2xl font-bold text-blue-900"
                  style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                >
                  نظام تسجيل الطلاب
                </h2>
              </div>
              
              <p 
                className="text-gray-600 text-lg leading-relaxed mb-8"
                style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
              >
                منصة إنجاز للتسجيل الأكاديمي - الكلية الكندية في الكويت
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">تسجيل سهل وسريع</p>
                    <p className="text-sm text-gray-500">Easy and fast registration</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-teal-900">تأكيد فوري</p>
                    <p className="text-sm text-gray-500">Instant confirmation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">دعم فني</p>
                    <p className="text-sm text-gray-500">Technical support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div
            ref={formCardRef}
            className="lg:w-3/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 h-full">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 
                      className="text-2xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                    >
                      نموذج التسجيل
                    </h3>
                    <p className="text-gray-500">Registration Form</p>
                  </div>

                  {/* Student ID Field */}
                  <div
                    ref={el => { fieldsRef.current[0] = el }}
                    className={`relative transition-all duration-300 ${focusedField === 'studentId' ? 'scale-[1.02]' : ''}`}
                  >
                    <label 
                      className="block text-right text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                    >
                      الرقم الأكاديمي <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('studentId')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="أدخل الرقم الأكاديمي"
                        className={`w-full px-4 py-4 pr-12 text-right bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 ${
                          focusedField === 'studentId' 
                            ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                        required
                      />
                      <CreditCard className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'studentId' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

                  {/* Student Name Field */}
                  <div
                    ref={el => { fieldsRef.current[1] = el }}
                    className={`relative transition-all duration-300 ${focusedField === 'studentName' ? 'scale-[1.02]' : ''}`}
                  >
                    <label 
                      className="block text-right text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                    >
                      اسم الطالب <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('studentName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="أدخل اسم الطالب"
                        className={`w-full px-4 py-4 pr-12 text-right bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 ${
                          focusedField === 'studentName' 
                            ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                        required
                      />
                      <User className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'studentName' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div
                    ref={el => { fieldsRef.current[2] = el }}
                    className={`relative transition-all duration-300 ${focusedField === 'phoneNumber' ? 'scale-[1.02]' : ''}`}
                  >
                    <label 
                      className="block text-right text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                    >
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('phoneNumber')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="أدخل رقم الهاتف"
                        className={`w-full px-4 py-4 pr-12 text-right bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 ${
                          focusedField === 'phoneNumber' 
                            ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                        required
                      />
                      <Phone className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'phoneNumber' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center" style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div
                    ref={el => { fieldsRef.current[3] = el }}
                    className="pt-4"
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            جاري التسجيل...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            تسجيل
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="success-message flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 
                    className="text-2xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                  >
                    تم التسجيل بنجاح!
                  </h3>
                  <p className="text-gray-500 mb-2">Registration Successful!</p>
                  <p 
                    className="text-gray-600 mt-4"
                    style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                  >
                    شكراً {formData.studentName}، تم استلام بياناتك وسيتم التواصل معك قريباً.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ studentId: '', studentName: '', phoneNumber: '' })
                    }}
                    className="mt-8 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
                    style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
                  >
                    تسجيل جديد
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-6" />
            <p 
              className="text-center text-gray-500 text-sm"
              style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
            >
              © 2026 Enjaz - CCK. جميع الحقوق محفوظة
            </p>
            <div className="text-center mt-4">
              <a 
                href="/#/admin" 
                className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
              >
                لوحة التحكم (Admin)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
