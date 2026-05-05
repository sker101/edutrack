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
    <div className="min-h-screen bg-[#F0F4F8] font-sans">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-5 pt-6 pb-20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex justify-between items-start relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="text-teal-200 text-xs font-medium">{greeting} 👋</p>
              <h1 className="text-xl font-bold leading-tight">{profile.full_name}</h1>
              <p className="text-teal-200 text-xs capitalize">{profile.role || 'Teacher'} · {dayNames[dayOfWeek]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              title="Refresh App"
            >
              <RefreshCcw className="w-5 h-5 text-teal-100" />
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status strip */}
        <div className="flex gap-3 mt-6 relative">
          <div className={`flex-1 rounded-2xl px-4 py-3 ${checkInDone ? 'bg-emerald-500/30 border border-emerald-400/30' : 'bg-white/10 border border-white/10'}`}>
            <p className="text-xs text-white/70 mb-0.5">Check-In</p>
            <p className="font-bold text-sm flex items-center gap-1">
              {checkInDone
                ? <><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Verified</>
                : <><AlertCircle className="w-4 h-4 text-orange-300" /> Pending</>}
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
            <p className="text-xs text-white/70 mb-0.5">Lessons Today</p>
            <p className="font-bold text-sm">{completedCount}/{totalCount} <span className="text-white/60 font-normal text-xs">completed</span></p>
          </div>
          <div className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
            <p className="text-xs text-white/70 mb-0.5">Score</p>
            <p className="font-bold text-sm">{completionPct}%</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-12 px-4 pb-24 space-y-4">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            {/* Quick Check-In Card */}
            {!checkInDone && (
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-bold">You haven't checked in yet!</h3>
                </div>
                <p className="text-orange-100 text-sm mb-4">Tap below to verify your attendance for today.</p>
                <button
                  onClick={() => setActiveTab('checkin')}
                  className="w-full bg-white text-orange-600 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <UserCheck className="w-4 h-4" /> Check In Now
                </button>
              </div>
            )}

            {/* Today's lessons preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-900">Today's Lessons</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{dayNames[dayOfWeek]} schedule</p>
                </div>
                <button onClick={() => setActiveTab('lessons')} className="text-teal-600 text-xs font-semibold flex items-center gap-1">
                  All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {lessons.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-sm">No lessons scheduled for today.</div>
                )}
                {lessons.slice(0, 3).map((lesson, i) => {
                  const status = getLessonStatus(lesson)
                  const statusConfig = {
                    done: { label: 'Done', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
                    ongoing: { label: 'Ongoing', cls: 'bg-teal-50 text-teal-700', dot: 'bg-teal-500' },
                    missed: { label: 'Missed', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
                    upcoming: { label: 'Upcoming', cls: 'bg-slate-50 text-slate-600', dot: 'bg-slate-300' },
                  }[status]
                  return (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <div className="text-center w-12 shrink-0">
                        <p className="text-xs font-bold text-slate-900">{lesson.start_time?.substring(0,5)}</p>
                        <p className="text-[10px] text-slate-400">{lesson.end_time?.substring(0,5)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{lesson.subjects?.name}</p>
                        <p className="text-xs text-slate-500">{lesson.classes?.name}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusConfig.cls}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Performance card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold">Your Performance</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionPct}%</p>
                  <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Attendance Today</p>
                  <p className="text-2xl font-bold">{checkInDone ? '✓' : '–'}</p>
                  <p className="text-xs text-slate-400 mt-2">{checkInDone ? 'Checked in' : 'Not yet'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Today's Lessons</h2>
              <p className="text-xs text-slate-500 mt-0.5">{completedCount} of {totalCount} recorded</p>
            </div>
            {lessons.length === 0 ? (
              <div className="p-10 text-center">
                <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-medium text-sm">No lessons today</p>
                <p className="text-slate-400 text-xs mt-1">Ask your admin to assign your timetable</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lessons.map((lesson, i) => {
                  const status = getLessonStatus(lesson)
                  const isDone = status === 'done'
                  const isMissed = status === 'missed'
                  return (
                    <div key={i} className={`p-4 ${isDone ? 'opacity-70' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{lesson.subjects?.name}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-500">{lesson.classes?.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {lesson.start_time?.substring(0,5)} – {lesson.end_time?.substring(0,5)}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isDone ? (
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 rounded-full px-3 py-1.5 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Recorded
                            </div>
                          ) : isMissed ? (
                            <div className="text-xs text-red-500 bg-red-50 rounded-full px-3 py-1.5 font-bold">
                              Missed
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRecordLesson(lesson.id)}
                              disabled={recordingLesson === lesson.id}
                              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white text-xs font-bold rounded-full flex items-center gap-1 transition"
                            >
                              {recordingLesson === lesson.id ? (
                                <><Clock className="w-3 h-3 animate-spin" /> Recording...</>
                              ) : (
                                <><MapPin className="w-3 h-3" /> Record</>
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

        {/* Check-In Tab */}
        {activeTab === 'checkin' && (
          <div className="space-y-4">
            {checkInDone ? (
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Checked In!</h2>
                <p className="text-slate-500 text-sm">Your attendance has been recorded for today.</p>
                {attendance[0] && (
                  <div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium">Time:</span> {new Date(attendance[0].check_in_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                    <p><span className="font-medium">Location:</span> {attendance[0].location_lat?.toFixed(4)}, {attendance[0].location_lng?.toFixed(4)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Mark Attendance</h2>
                <p className="text-slate-500 text-sm mb-6">Verify your location to confirm you're at school</p>

                {checkingIn ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center mb-4 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                      {biometricMethod === 'Face ID'
                        ? <Scan className="w-8 h-8 text-teal-600" />
                        : <Fingerprint className="w-8 h-8 text-teal-600" />}
                    </div>
                    <p className="text-teal-700 font-semibold">Scanning {biometricMethod}...</p>
                    <p className="text-slate-400 text-sm mt-1">Getting your location</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleCheckIn('Face ID')}
                      className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition shadow-lg shadow-teal-200"
                    >
                      <Scan className="w-6 h-6" />
                      Check In with Face ID
                    </button>
                    <button
                      onClick={() => handleCheckIn('Fingerprint')}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition shadow-lg shadow-slate-200"
                    >
                      <Fingerprint className="w-6 h-6" />
                      Check In with Fingerprint
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Location will be captured automatically
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 pb-safe">
        <div className="flex items-center justify-around py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors ${
                activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] font-semibold ${activeTab === tab.id ? 'text-teal-600' : ''}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
