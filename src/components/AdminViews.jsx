import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { 
  CheckCircle2, Clock, AlertTriangle, UserX, FileQuestion, MapPin, Search, 
  ChevronLeft, ChevronRight, Check, X, MoreHorizontal, FileText, Upload, Calendar, BookOpen, UserCheck, PlusCircle, Trash2
} from 'lucide-react';

export const AlertsView = ({ alerts }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Alerts & Flags</h1>
      <p className="text-sm text-slate-500 mt-1">Review and resolve attendance inconsistencies</p>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2">
      <div className="bg-white p-5 rounded-xl border border-slate-200 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-slate-900">{alerts ? alerts.length : 0}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Total Alerts</p>
      </div>
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-orange-600">0</p>
        <p className="text-sm font-medium text-orange-700 mt-1">Unresolved</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-red-600">0</p>
        <p className="text-sm font-medium text-red-700 mt-1">Critical</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-emerald-600">0</p>
        <p className="text-sm font-medium text-emerald-700 mt-1">Resolved</p>
      </div>
    </div>

    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      {['All', 'Unresolved', 'Resolved', 'All Types', 'Absence', 'Late Arrival', 'Mismatch', 'Missing Record'].map((filter, i) => (
        <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
          {filter}
        </button>
      ))}
    </div>

    <div className="space-y-4">
      {alerts && alerts.length > 0 ? (
        alerts.map((alert, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-200 flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <div className="flex gap-4">
              <div className="mt-1 text-red-500"><AlertTriangle className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-slate-900">{alert.title}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{alert.description}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl">No active alerts or flags at this time.</div>
      )}
    </div>
  </div>
);

export const CheckInView = ({ attendance, profile, refreshData }) => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [method, setMethod] = useState('');

  const handleSimulateBiometric = async (type) => {
    setMethod(type);
    setCheckingIn(true);
    
    // Simulate biometric delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setCheckingIn(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase.from('attendance_logs').insert([{
        teacher_id: profile?.id,
        date: today,
        location_lat: latitude,
        location_lng: longitude
      }]);
      
      setCheckingIn(false);
      if (error) {
        alert("Error checking in: " + error.message);
      } else {
        alert(`${type} Verification Successful! Checked in securely.`);
        if (refreshData) refreshData();
      }
    }, (err) => {
      alert("Error getting location. Ensure location permissions are enabled.");
      setCheckingIn(false);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Location Check-In</h1>
        <p className="text-sm text-slate-500 mt-1">Verify your attendance by confirming your location at school</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 font-bold text-lg text-slate-800">Attendance Verification</div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center mb-8 relative overflow-hidden">
              {checkingIn ? (
                <div className="absolute inset-0 bg-teal-600/10 flex flex-col items-center justify-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-teal-700 font-medium">Scanning {method}...</p>
                </div>
              ) : (
                <>
                  <MapPin className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Tap the button below to verify your presence at school</p>
                </>
              )}
            </div>
            
            <div className="w-full max-w-sm space-y-3">
              <button 
                onClick={() => handleSimulateBiometric('Face ID')}
                className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-sm"
              >
                <MapPin className="w-5 h-5" /> I'm at School - Face ID
              </button>
              <button 
                onClick={() => handleSimulateBiometric('Fingerprint')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-sm"
              >
                <UserCheck className="w-5 h-5" /> I'm at School - Fingerprint
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Your location will be used to verify you are within school premises</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Recent Check-ins</h3>
                <p className="text-xs text-slate-500">Today's arrivals</p>
              </div>
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>
            <div className="p-2 space-y-1">
              {attendance && attendance.length > 0 ? (
                attendance.slice(0, 5).map((person, i) => (
                  <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                        {person.profiles?.full_name ? person.profiles.full_name.substring(0,2).toUpperCase() : <UserCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{person.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">via location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> {new Date(person.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">No check-ins today.</div>
              )}
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-800">{attendance ? attendance.length : 0} Teachers Checked In</h3>
            </div>
            <p className="text-sm text-emerald-700">Today's verified arrivals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LessonsView = ({ verifications, profile, refreshData }) => {
  const [recording, setRecording] = useState(false);

  const handleRecordLesson = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setRecording(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase.from('lesson_verifications').insert([{
        teacher_id: profile?.id,
        date: today,
        location_lat: latitude,
        location_lng: longitude
        // Note: timetable_id would normally be selected by the user here
      }]);
      
      setRecording(false);
      if (error) {
        alert("Error recording lesson: " + error.message);
      } else {
        alert("Lesson recorded and verified successfully!");
        if (refreshData) refreshData();
      }
    }, (err) => {
      alert("Error getting location. Ensure location permissions are enabled.");
      setRecording(false);
    });
  };

  return (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lesson Records</h1>
        <p className="text-sm text-slate-500 mt-1">Track and verify completed lessons</p>
      </div>
      <button 
        onClick={handleRecordLesson}
        disabled={recording}
        className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white rounded-xl text-sm font-bold shadow-sm transition"
      >
        {recording ? 'Recording...' : 'Record Lesson'}
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-slate-900">{verifications ? verifications.length : 0}</p>
          <BookOpen className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Total</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-emerald-600">{verifications ? verifications.length : 0}</p>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-emerald-700">Verified</p>
      </div>
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-orange-600">0</p>
          <Clock className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-sm font-medium text-orange-700">Pending</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-red-600">0</p>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-sm font-medium text-red-700">Flagged</p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search lessons..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {['All', 'Verified', 'Pending', 'Flagged'].map((filter, i) => (
          <button key={i} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {filter}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      {verifications && verifications.length > 0 ? (
        verifications.map((lesson, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{lesson.timetables?.subjects?.name || 'Unknown'}</h3>
                <span className="text-slate-400">•</span>
                <span className="text-sm font-medium text-slate-500">{lesson.timetables?.classes?.name || 'Unknown'}</span>
              </div>
              <p className="text-slate-700 mt-1">Lesson Verification</p>
              <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> {lesson.profiles?.full_name || 'Unknown'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {lesson.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(lesson.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold text-emerald-700 border-emerald-200 bg-emerald-50`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl">No lessons have been recorded or verified today.</div>
      )}
    </div>
  </div>
  );
};

export const TimetableView = () => {
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [timeSlots, setTimeSlots] = useState(['07:30','08:15','09:00','09:45','10:30','11:15','12:00','13:00','13:45','14:30']);
  const [loading, setLoading] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayNum = new Date().getDay();
  const [currentDay, setCurrentDay] = useState(todayNum === 0 || todayNum === 6 ? 1 : todayNum);

  const fetchAll = useCallback(async () => {
    const [{ data: tt }, { data: cls }, { data: sub }, { data: prof }, { data: ts }] = await Promise.all([
      supabase.from('timetables').select(`*, classes(id, name), subjects(id, name), profiles(id, full_name)`).eq('day_of_week', currentDay),
      supabase.from('classes').select('*').order('name'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('profiles').select('id, full_name').order('full_name'),
      supabase.from('time_slots').select('*').order('start_time'),
    ]);
    if (tt) setTimetables(tt);
    if (cls) setClasses(cls);
    if (sub) setSubjects(sub);
    if (prof) setTeachers(prof);
    if (ts && ts.length > 0) {
      setTimeSlots(ts.map(s => s.start_time.substring(0, 5)));
    }
  }, [currentDay]);

  useEffect(() => { fetchAll(); }, [fetchAll]);


  const getSlot = (classId, time) =>
    timetables.find(t => t.class_id === classId && t.start_time?.substring(0,5) === time);

  const openEdit = (slot) => {
    setSelectedSlot(slot);
    setEditTeacher(slot.teacher_id || '');
    setEditSubject(slot.subject_id || '');
    setEditStart(slot.start_time?.substring(0,5) || '');
    setEditEnd(slot.end_time?.substring(0,5) || '');
    setShowEditModal(true);
  };

  const openAdd = (classId, time) => {
    setSelectedSlot({ class_id: classId, isNew: true });
    setEditTeacher('');
    setEditSubject('');
    setEditStart(time);
    
    // Default end time is 45 mins later
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + 45);
    setEditEnd(date.toTimeString().substring(0, 5));
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      teacher_id: editTeacher,
      subject_id: editSubject,
      start_time: editStart,
      end_time: editEnd,
      day_of_week: currentDay,
      class_id: selectedSlot.class_id
    };

    let result;
    if (selectedSlot.isNew) {
      result = await supabase.from('timetables').insert([payload]);
    } else {
      result = await supabase.from('timetables').update(payload).eq('id', selectedSlot.id);
    }

    setLoading(false);
    if (result.error) { alert('Error: ' + result.error.message); return; }
    setShowEditModal(false);
    fetchAll();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this slot?')) return;
    setLoading(true);
    await supabase.from('timetables').delete().eq('id', selectedSlot.id);
    setLoading(false);
    setShowEditModal(false);
    fetchAll();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
          <p className="text-sm text-slate-500 mt-1">Click any slot to edit or remove it</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddSlotModal(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-800 transition mr-2">
            Add Period
          </button>
          <button onClick={() => setCurrentDay(d => d === 1 ? 5 : d - 1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-5 h-5" /></button>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-sm min-w-[120px] text-center">{dayNames[currentDay]}</div>
          <button onClick={() => setCurrentDay(d => d === 5 ? 1 : d + 1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {showAddSlotModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Add Time Slot</h3>
              <button onClick={() => setShowAddSlotModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">Add a new period row to the timetable (e.g. 10:45)</p>
              <input type="time" value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900" />
              <button 
                onClick={async () => {
                  if (!newSlotTime) return;
                  const { error } = await supabase.from('time_slots').insert([{ start_time: newSlotTime }]);
                  if (error) {
                    if (error.code === '42P01') {
                      alert("Database table 'time_slots' missing. Please ask Admin to create it.");
                    } else {
                      alert(error.message);
                    }
                  } else {
                    setNewSlotTime('');
                    setShowAddSlotModal(false);
                    fetchAll();
                  }
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-sm"
              >
                Add Row
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">{selectedSlot.isNew ? 'Assign New Lesson' : 'Edit Timetable Slot'}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teacher</label>
                <select value={editTeacher} onChange={e => setEditTeacher(e.target.value)} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select value={editSubject} onChange={e => setEditSubject(e.target.value)} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                {!selectedSlot.isNew && (
                  <button type="button" onClick={handleDelete} disabled={loading} className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Slot
                  </button>
                )}
                <button type="submit" disabled={loading} className={`${selectedSlot.isNew ? 'w-full' : 'flex-1'} py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-sm transition shadow-sm`}>
                  {loading ? 'Saving...' : selectedSlot.isNew ? 'Create Assignment' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          No classes set up yet. Go to <strong>Setup</strong> to add classes and subjects first.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{minWidth: `${classes.length * 140 + 80}px`}}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4 w-20 sticky left-0 bg-slate-50 z-10">Time</th>
                {classes.map(c => <th key={c.id} className="p-4 text-center whitespace-nowrap">{c.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((time, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-500 text-xs align-top pt-4 sticky left-0 bg-white">{time}</td>
                  {classes.map(cls => {
                    const slot = getSlot(cls.id, time);
                    if (!slot) return (
                      <td key={cls.id} className="p-1.5">
                        <div 
                          onClick={() => openAdd(cls.id, time)}
                          className="h-14 rounded-xl border border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <PlusCircle className="w-4 h-4 text-slate-300" />
                        </div>
                      </td>
                    );
                    return (
                      <td key={cls.id} className="p-1.5">
                        <div
                          onClick={() => openEdit(slot)}
                          className="p-2 rounded-xl border border-teal-100 bg-teal-50 min-h-[3.5rem] flex flex-col justify-center cursor-pointer hover:shadow-md hover:border-teal-300 transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-teal-700 leading-tight">{slot.subjects?.name || '—'}</span>
                            <MoreHorizontal className="w-3 h-3 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                          <span className="text-xs text-slate-500 mt-0.5 truncate">{slot.profiles?.full_name?.split(' ')[0] || '—'}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const TeachersView = ({ teachers, attendance, refreshData }) => {
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    alert("In this environment, new users must sign up via the Login screen first to create secure authentication credentials. Once they sign up, they will appear in the 'Pending Approval' list above.");
    setShowAddModal(false);
  };

  const handleApproveTeacher = async (id) => {
    const { error } = await supabase.from('profiles').update({ role: 'teacher' }).eq('id', id);
    if (error) alert(error.message);
    else if (refreshData) refreshData();
  };

  const handleRejectTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending request?")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) alert(error.message);
    else if (refreshData) refreshData();
  };

  const pendingTeachers = teachers?.filter(t => t.role === 'pending') || [];
  const activeTeachers = teachers?.filter(t => t.role !== 'pending') || [];

  const filteredTeachers = activeTeachers?.filter(t => {
    if (filter === 'All') return true;
    const att = attendance?.find(a => a.teacher_id === t.id);
    if (filter === 'Present') return !!att;
    if (filter === 'Absent') return !att;
    return true;
  });

  return (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage teacher accounts and monitor attendance</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition">
          Invite Guide
        </button>
      </div>
    </div>

    {pendingTeachers.length > 0 && (
      <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
        <div className="p-4 bg-amber-100/50 border-b border-amber-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-amber-900">Pending Approvals ({pendingTeachers.length})</h2>
        </div>
        <div className="divide-y divide-amber-200/50">
          {pendingTeachers.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center font-bold text-amber-700">
                  {t.full_name?.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-amber-900">{t.full_name}</p>
                  <p className="text-xs text-amber-700">{t.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRejectTeacher(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <button onClick={() => handleApproveTeacher(t.id)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors">
                  <Check className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {showAddModal && (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900">Invite New Teacher</h3>
            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" placeholder="jane@school.edu" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm">Send Invite Link</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-center">
        <p className="text-3xl font-bold text-slate-900">{teachers ? teachers.length : 0}</p>
        <p className="text-sm font-medium text-slate-500">Total</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center">
        <p className="text-3xl font-bold text-emerald-600">{attendance ? attendance.length : 0}</p>
        <p className="text-sm font-medium text-emerald-700">Present</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col justify-center">
        <p className="text-3xl font-bold text-red-600">{teachers && attendance ? Math.max(0, teachers.length - attendance.length) : 0}</p>
        <p className="text-sm font-medium text-red-700">Absent</p>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search teachers..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
        {['All', 'Present', 'Absent', 'Late'].map(t => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === t ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="p-4">Teacher</th>
            <th className="p-4">Account Type</th>
            <th className="p-4">Status</th>
            <th className="p-4">Check-in</th>
            <th className="p-4">Lessons</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredTeachers && filteredTeachers.length > 0 ? (
            filteredTeachers.map((t, i) => {
              const att = attendance?.find(a => a.teacher_id === t.id);
              const isPresent = !!att;
              const statClass = isPresent ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-slate-500 border-slate-200 bg-slate-50';
              const time = att ? new Date(att.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—';
              
              return (
              <tr key={i} className="hover:bg-slate-50 transition-colors text-sm">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                      {t.full_name ? t.full_name.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-slate-900">{t.full_name || t.email}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-medium capitalize">{t.role ? t.role.replace('_', ' ') : 'Teacher'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statClass}`}>
                    {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />} {isPresent ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{time}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">0/0</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
                </td>
              </tr>
            )})
          ) : (
            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No teachers found in the system.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};
