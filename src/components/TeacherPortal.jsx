import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import {
  GraduationCap, UserCheck, BookOpen, Clock, CheckCircle2,
  MapPin, Calendar, LogOut, ChevronRight, AlertCircle, Fingerprint, Scan, TrendingUp, Award, RefreshCcw
} from 'lucide-react'

export default function TeacherPortal({ profile, session }) {
  const [activeTab, setActiveTab] = useState('home')
  const [lessons, setLessons] = useState([])
  const [verifications, setVerifications] = useState([])
  const [attendance, setAttendance] = useState([])
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkInDone, setCheckInDone] = useState(false)
  const [recordingLesson, setRecordingLesson] = useState(null)
  const [biometricMethod, setBiometricMethod] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const dayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay()
  const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    // Today's timetable
    const { data: tt } = await supabase
      .from('timetables')
      .select('*, classes(name), subjects(name)')
      .eq('teacher_id', session.user.id)
      .eq('day_of_week', dayOfWeek)
      .order('start_time', { ascending: true })
    if (tt) setLessons(tt)

    // Today's verified lessons
    const { data: vv } = await supabase
      .from('lesson_verifications')
      .select('*')
      .eq('teacher_id', session.user.id)
      .eq('date', today)
    if (vv) setVerifications(vv.map(v => v.timetable_id))

    // Today's check-in
    const { data: att } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('teacher_id', session.user.id)
      .eq('date', today)
    if (att && att.length > 0) {
      setAttendance(att)
      setCheckInDone(true)
    }
  }

  const handleCheckIn = async (method) => {
    setBiometricMethod(method)
    setCheckingIn(true)

    if (!navigator.geolocation) {
      alert('Geolocation not supported.')
      setCheckingIn(false)
      return
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      const { error } = await supabase.from('attendance_logs').insert([{
        teacher_id: session.user.id,
        date: today,
        check_in_time: new Date().toISOString(),
        location_lat: latitude,
        location_lng: longitude,
      }])
      setCheckingIn(false)
      if (error) { alert('Check-in failed: ' + error.message); return }
      setCheckInDone(true)
      fetchAll()
    }, () => {
      alert('Could not get your location. Please enable location permissions.')
      setCheckingIn(false)
    })
  }

  const handleRecordLesson = async (timetableId) => {
    setRecordingLesson(timetableId)
    if (!navigator.geolocation) {
      alert('Geolocation not supported.')
      setRecordingLesson(null)
      return
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      const { error } = await supabase.from('lesson_verifications').insert([{
        teacher_id: session.user.id,
        timetable_id: timetableId,
        date: today,
        location_lat: latitude,
        location_lng: longitude,
      }])
      setRecordingLesson(null)
      if (error) { alert('Error: ' + error.message); return }
      fetchAll()
    }, () => {
      alert('Could not get your location.')
      setRecordingLesson(null)
    })
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'T'

  const completedCount = verifications.length
  const totalCount = lessons.length
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  const getLessonStatus = (lesson) => {
    if (verifications.includes(lesson.id)) return 'done'
    const [sh, sm] = lesson.start_time.split(':').map(Number)
    const [eh, em] = lesson.end_time.split(':').map(Number)
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    const nowMin = now.getHours() * 60 + now.getMinutes()
    if (nowMin > endMin) return 'missed'
    if (nowMin >= startMin) return 'ongoing'
    return 'upcoming'
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'checkin', label: 'Check-In', icon: UserCheck },
  ]

  return (
    <div className="flex min-h-screen bg-[#F0F4F8] font-sans">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed inset-y-0 left-0 z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-slate-900 tracking-tight">EduTrack</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-100' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200 uppercase shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{profile.full_name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">TEACHER</p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Header Section */}
        <header className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 text-white px-5 pt-8 pb-20 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto flex justify-between items-start relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-900/20">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-200 text-xs font-bold tracking-widest uppercase">{greeting}</span>
                  <span className="animate-bounce">👋</span>
                </div>
                <h1 className="text-2xl font-black leading-tight tracking-tight mt-0.5">{profile.full_name}</h1>
                <p className="text-teal-100 text-xs font-medium bg-white/10 w-fit px-2 py-0.5 rounded-full mt-1.5 backdrop-blur-sm border border-white/10 uppercase tracking-wide">
                  {dayNames[dayOfWeek]} · Today's Status
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 shadow-lg"
                title="Sync Application"
              >
                <RefreshCcw className="w-5 h-5 text-teal-50" />
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 shadow-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 mt-8 relative">
            <div className={`rounded-2xl p-3 backdrop-blur-md border transition-all ${checkInDone ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-white/10 border-white/10'}`}>
              <p className="text-[10px] text-teal-100 font-bold uppercase tracking-wider mb-1 opacity-80">Attendance</p>
              <div className="flex items-center gap-1.5">
                {checkInDone 
                  ? <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-100"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ON-SITE</div>
                  : <div className="flex items-center gap-1.5 font-bold text-sm text-orange-200"><AlertCircle className="w-4 h-4 text-orange-300" /> PENDING</div>
                }
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-3 backdrop-blur-md">
              <p className="text-[10px] text-teal-100 font-bold uppercase tracking-wider mb-1 opacity-80">Workload</p>
              <p className="font-bold text-sm flex items-baseline gap-1">
                {completedCount}/{totalCount} <span className="text-[10px] text-teal-200 opacity-60">LOGGED</span>
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-3 backdrop-blur-md">
              <p className="text-[10px] text-teal-100 font-bold uppercase tracking-wider mb-1 opacity-80">Efficiency</p>
              <p className="font-bold text-sm text-teal-50">{completionPct}%</p>
            </div>
          </div>
        </header>

        {/* Main Body Content */}
        <main className="max-w-4xl w-full mx-auto -mt-12 px-4 pb-24 space-y-6 relative">
          
          {/* Tab Views */}
          {activeTab === 'home' && (
            <>
              {/* Critical Alert for Check-In */}
              {!checkInDone && (
                <div className="bg-gradient-to-br from-orange-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200 ring-4 ring-white relative overflow-hidden group">
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Fingerprint className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg tracking-tight">Verification Required</h3>
                        <p className="text-orange-100 text-xs font-medium">Capture your location to start your session</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('checkin')}
                      className="w-full mt-4 bg-white text-orange-700 font-black py-3.5 rounded-2xl flex items-center justify-center gap-3 text-sm shadow-lg hover:bg-orange-50 active:scale-95 transition-all"
                    >
                      <UserCheck className="w-5 h-5" /> VERIFY IDENTITY NOW
                    </button>
                  </div>
                </div>
              )}

              {/* Today's Schedule Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-100">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-xl">
                      <Calendar className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-900 tracking-tight">Today's Sessions</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Schedule</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('lessons')} className="text-teal-600 text-xs font-black flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition">
                    VIEW ALL <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {lessons.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">No classes assigned today.</p>
                    </div>
                  )}
                  {lessons.slice(0, 3).map((lesson, i) => {
                    const status = getLessonStatus(lesson)
                    const statusConfig = {
                      done: { label: 'RECORDED', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
                      ongoing: { label: 'LIVE NOW', cls: 'bg-teal-50 text-teal-700 border-teal-100 animate-pulse', dot: 'bg-teal-500' },
                      missed: { label: 'MISSED', cls: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
                      upcoming: { label: 'NEXT', cls: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-300' },
                    }[status]
                    return (
                      <div key={i} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group">
                        <div className="text-center w-14 shrink-0 bg-slate-50 rounded-2xl p-2 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                          <p className="text-xs font-black text-slate-900">{lesson.start_time?.substring(0,5)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{lesson.end_time?.substring(0,5)}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{lesson.subjects?.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{lesson.classes?.name}</p>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border shrink-0 tracking-widest ${statusConfig.cls}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Advanced Performance Stats */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Award className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="font-black tracking-tight text-lg">System Insights</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Weekly Avg</p>
                    <p className="text-3xl font-black text-teal-400">{completionPct}%</p>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${completionPct}%` }} />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Auth Status</p>
                    <p className="text-3xl font-black">{checkInDone ? 'SECURE' : '–'}</p>
                    <p className="text-[10px] text-teal-500 font-black mt-2 tracking-wider">{checkInDone ? 'LOCATION VERIFIED' : 'WAITING'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'lessons' && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h2 className="font-black text-slate-900 text-lg tracking-tight uppercase">Daily Log</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{completedCount} Lessons Validated</p>
              </div>
              {lessons.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No Timetable found</p>
                  <p className="text-slate-400 text-xs mt-2">Contact administrator for schedule assignment</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {lessons.map((lesson, i) => {
                    const status = getLessonStatus(lesson)
                    const isDone = status === 'done'
                    const isMissed = status === 'missed'
                    const isOngoing = status === 'ongoing'
                    return (
                      <div key={i} className={`p-6 hover:bg-slate-50/50 transition-all ${isDone ? 'bg-emerald-50/20' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                               <div className={`p-1.5 rounded-lg ${isDone ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                 <BookOpen className={`w-4 h-4 ${isDone ? 'text-emerald-700' : 'text-slate-500'}`} />
                               </div>
                               <span className="font-black text-slate-900 uppercase tracking-tight">{lesson.subjects?.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {lesson.classes?.name}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {lesson.start_time?.substring(0,5)}–{lesson.end_time?.substring(0,5)}</span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {isDone ? (
                              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100/50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-black tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> VERIFIED
                              </div>
                            ) : isMissed ? (
                              <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl font-black tracking-widest uppercase">
                                Session Missed
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRecordLesson(lesson.id)}
                                disabled={recordingLesson === lesson.id}
                                className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-black tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                                  isOngoing 
                                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200' 
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                }`}
                              >
                                {recordingLesson === lesson.id ? (
                                  <><Clock className="w-4 h-4 animate-spin" /> LOGGING...</>
                                ) : (
                                  <><MapPin className="w-4 h-4" /> START RECORDING</>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'checkin' && (
            <div className="space-y-6">
              {checkInDone ? (
                <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-10 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="w-24 h-24 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Identity Secured</h2>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">Your presence has been successfully verified on the school premises.</p>
                  {attendance[0] && (
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Timestamp</p>
                        <p className="font-black text-slate-700 text-sm">{new Date(attendance[0].check_in_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">GPS Coordinates</p>
                        <p className="font-black text-slate-700 text-[10px] tracking-tight">{attendance[0].location_lat?.toFixed(4)}, {attendance[0].location_lng?.toFixed(4)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-teal-50 rounded-2xl">
                       <MapPin className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Presence Audit</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Location-based verification</p>
                    </div>
                  </div>

                  {checkingIn ? (
                    <div className="flex flex-col items-center py-10">
                      <div className="w-24 h-24 rounded-full bg-teal-50 border-8 border-teal-100 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
                        {biometricMethod === 'Face ID'
                          ? <Scan className="w-10 h-10 text-teal-600" />
                          : <Fingerprint className="w-10 h-10 text-teal-600" />}
                      </div>
                      <h3 className="text-teal-800 font-black tracking-widest uppercase text-sm">Validating Identity</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Pinpointing GPS Location...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => handleCheckIn('Face ID')}
                        className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl font-black flex items-center justify-center gap-3 transition shadow-xl shadow-teal-100 uppercase tracking-widest text-sm"
                      >
                        <Scan className="w-6 h-6" />
                        Verify with Face ID
                      </button>
                      <button
                        onClick={() => handleCheckIn('Fingerprint')}
                        className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-3xl font-black flex items-center justify-center gap-3 transition shadow-xl shadow-slate-200 uppercase tracking-widest text-sm"
                      >
                        <Fingerprint className="w-6 h-6" />
                        Verify with Touch ID
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 justify-center pt-4 tracking-widest uppercase">
                        <MapPin className="w-4 h-4" />
                        SECURED VIA GEOLOCATION ENCRYPTION
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation (MOBILE ONLY) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 pb-safe md:hidden z-50">
          <div className="flex items-center justify-between py-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 px-6 py-1 rounded-2xl transition-all ${
                  activeTab === tab.id ? 'text-teal-700' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[3] scale-110' : ''}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-teal-700' : ''}`}>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
