import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { MapPin, Clock, CheckCircle, BookOpen } from 'lucide-react'

export default function TeacherDashboard({ profile, session }) {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [lessons, setLessons] = useState([])
  const [verifications, setVerifications] = useState([])
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    fetchLogs()
    fetchLessons()
  }, [])

  async function fetchLogs() {
    const { data } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('teacher_id', session.user.id)
      .order('created_at', { ascending: false })
    if (data) setLogs(data)
  }

  async function fetchLessons() {
    // 1. Get today's day of the week (1 = Monday, 7 = Sunday)
    let dayOfWeek = new Date().getDay()
    if (dayOfWeek === 0) dayOfWeek = 7 // Adjust JS Sunday(0) to Postgres Sunday(7)

    // 2. Fetch the timetable for today
    const { data: timetableData } = await supabase
      .from('timetables')
      .select(`
        *,
        classes (name),
        subjects (name)
      `)
      .eq('teacher_id', session.user.id)
      .eq('day_of_week', dayOfWeek)
      .order('start_time', { ascending: true })

    if (timetableData) setLessons(timetableData)

    // 3. Fetch already verified lessons for today
    const todayStr = new Date().toISOString().split('T')[0]
    const { data: verifiedData } = await supabase
      .from('lesson_verifications')
      .select('*')
      .eq('teacher_id', session.user.id)
      .eq('date', todayStr)
    
    if (verifiedData) setVerifications(verifiedData.map(v => v.timetable_id))
  }

  const handleAction = async (actionType, timetableId = null) => {
    setLoading(true)
    setLocationError('')
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      
      if (actionType === 'attendance') {
        const { error } = await supabase
          .from('attendance_logs')
          .insert([
            { teacher_id: session.user.id, location_lat: latitude, location_lng: longitude, status: 'present' }
          ])
        if (error) setLocationError(error.message)
        else {
          alert('Morning Check-in successful!')
          fetchLogs()
        }
      } else if (actionType === 'lesson') {
        const { error } = await supabase
          .from('lesson_verifications')
          .insert([
            { 
              timetable_id: timetableId, 
              teacher_id: session.user.id, 
              location_lat: latitude, 
              location_lng: longitude, 
              status: 'taught' 
            }
          ])
        if (error) setLocationError(error.message)
        else {
          alert('Lesson verified successfully!')
          fetchLessons()
        }
      }
      setLoading(false)
    }, (error) => {
      setLocationError('Unable to retrieve your location. Ensure GPS is enabled.')
      setLoading(false)
    }, { enableHighAccuracy: true })
  }

  return (
    <div className="space-y-6">
      
      {locationError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm">
          {locationError}
        </div>
      )}

      {/* 1. Morning Check-In Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Clock className="w-5 h-5 text-blue-600" />
          Morning Arrival
        </h2>
        
        <button 
          onClick={() => handleAction('attendance')}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
        >
          {loading ? 'Acquiring GPS...' : 'Check In to School'}
        </button>

        {logs.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Checked In Today</span>
            </div>
            <span className="text-xs font-bold text-green-700">
              {new Date(logs[0].check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        )}
      </div>

      {/* 2. Today's Lesson Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Today's Lessons
        </h2>

        {lessons.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
            <p className="text-gray-500 font-medium">No classes scheduled for today.</p>
            <p className="text-xs text-gray-400 mt-1">The Admin must assign you a timetable.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map(lesson => {
              const isVerified = verifications.includes(lesson.id)
              return (
                <div key={lesson.id} className={`p-4 rounded-xl border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{lesson.subjects?.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{lesson.classes?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 shadow-sm">
                        {lesson.start_time.substring(0, 5)} - {lesson.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                  
                  {isVerified ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 p-2 rounded-lg justify-center font-bold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Verified as Taught
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAction('lesson', lesson.id)}
                      disabled={loading}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg font-semibold text-sm shadow-sm transition-all"
                    >
                      Mark as Taught (Requires GPS)
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
