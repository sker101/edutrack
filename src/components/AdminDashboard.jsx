import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  GraduationCap, LayoutDashboard, UserCheck, Users, Calendar,
  ClipboardList, AlertTriangle, FileText, CheckCircle2,
  BookOpen, TrendingUp, Clock, Book, TrendingDown, Minus, UserX, FileQuestion, PlusCircle, Layers, Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertsView, CheckInView, LessonsView, TimetableView, TeachersView } from './AdminViews';

const attendanceData = [
  { name: 'Mon', present: 43, late: 2, absent: 2 },
  { name: 'Tue', present: 45, late: 1, absent: 1 },
  { name: 'Wed', present: 41, late: 3, absent: 3 },
  { name: 'Thu', present: 44, late: 1, absent: 2 },
  { name: 'Fri', present: 43, late: 2, absent: 2 },
];

const topTeachers = [
  { id: 1, name: 'Sarah Mwanga', subject: 'Mathematics', attendance: 98, lessons: 95, trend: 'up' },
  { id: 2, name: 'John Kimaro', subject: 'English', attendance: 96, lessons: 92, trend: 'up' },
  { id: 3, name: 'Grace Lyimo', subject: 'Science', attendance: 94, lessons: 90, trend: 'neutral' },
  { id: 4, name: 'Peter Msangi', subject: 'Kiswahili', attendance: 88, lessons: 85, trend: 'down' },
  { id: 5, name: 'Mary Njau', subject: 'History', attendance: 92, lessons: 88, trend: 'neutral' },
];

const todaysSchedule = [
  { id: 1, time: '07:30 - 08:10', subject: 'Mathematics', details: 'Form 3A • John Mwangi', status: 'Completed' },
  { id: 2, time: '08:15 - 08:55', subject: 'English', details: 'Form 2B • Grace Kimaro', status: 'Completed' },
  { id: 3, time: '09:00 - 09:40', subject: 'Physics', details: 'Form 4A • Peter Makonda', status: 'Ongoing' },
  { id: 4, time: '09:45 - 10:25', subject: 'Chemistry', details: 'Form 3B • Mary Shayo', status: 'Upcoming' },
  { id: 5, time: '10:30 - 11:10', subject: 'Biology', details: 'Form 2A • David Mwakesege', status: 'Upcoming' },
];

const recentAlerts = [
  { id: 1, type: 'critical', title: 'John Mwangi', desc: 'Lesson recorded without biometric check-in', time: 'Today, 09:15', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  { id: 2, type: 'critical', title: 'Grace Kimaro', desc: 'No check-in for scheduled class', time: 'Today, 08:00', icon: UserX, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  { id: 3, type: 'warning', title: 'Peter Makonda', desc: 'Checked in 25 minutes after class start', time: 'Today, 10:25', icon: Clock, color: 'text-amber-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { id: 4, type: 'info', title: 'Mary Shayo', desc: 'Lesson record not submitted', time: 'Yesterday, 14:00', icon: FileQuestion, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
];

const recentActivity = [
  { id: 1, title: 'Anna Mushi', desc: 'Checked in via fingerprint', time: '2 min ago', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 2, title: 'James Tarimo', desc: 'Completed Math - Form 2A', time: '15 min ago', icon: Book, color: 'text-teal-600', bg: 'bg-teal-50' },
  { id: 3, title: 'Sarah Kimaro', desc: 'Substituted for Grace Kimaro - English', time: '45 min ago', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 4, title: 'David Mwakesege', desc: 'Checked in via face recognition', time: '1 hour ago', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 5, title: 'Peter Makonda', desc: 'Checked out for the day', time: '2 hours ago', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.fill }}>
            {entry.name === 'present' ? 'Present' : entry.name === 'late' ? 'Late' : 'Absent'} : {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard({ profile }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  // Data State
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Timetable Form State
  const [formTeacher, setFormTeacher] = useState('');
  const [formClass, setFormClass] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDay, setFormDay] = useState(new Date().getDay().toString());
  const [formStart, setFormStart] = useState('08:00');
  const [formEnd, setFormEnd] = useState('09:00');

  // Setup Form State
  const [newClassName, setNewClassName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: profilesData } = await supabase.from('profiles').select('*').order('full_name');
    if (profilesData) setTeachers(profilesData);

    const { data: cls } = await supabase.from('classes').select('*').order('name');
    const { data: sub } = await supabase.from('subjects').select('*').order('name');
    if (cls) setClasses(cls);
    if (sub) setSubjects(sub);

    const today = new Date().toISOString().split('T')[0];
    const { data: attendanceData } = await supabase
      .from('attendance_logs')
      .select(`*, profiles(full_name)`)
      .eq('date', today)
      .order('check_in_time', { ascending: false });
    if (attendanceData) setAttendance(attendanceData);

    const { data: verifiedData } = await supabase
      .from('lesson_verifications')
      .select(`
        *, 
        profiles(full_name),
        timetables(start_time, end_time, classes(name), subjects(name))
      `)
      .eq('date', today)
      .order('created_at', { ascending: false });
    if (verifiedData) setVerifications(verifiedData);
  }

  const handleAssignTimetable = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('timetables').insert([{
      teacher_id: formTeacher,
      class_id: formClass,
      subject_id: formSubject,
      day_of_week: parseInt(formDay),
      start_time: formStart,
      end_time: formEnd
    }]);

    if (error) alert("Error: " + error.message);
    else {
      alert("Timetable assigned successfully!");
      setFormTeacher(''); setFormClass(''); setFormSubject('');
    }
    setLoading(false);
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName) return;
    setLoading(true);
    const { error } = await supabase.from('classes').insert([{ name: newClassName }]);
    if (error) alert(error.message);
    else { setNewClassName(''); fetchData(); }
    setLoading(false);
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Are you sure? This might break existing timetables.")) return;
    await supabase.from('classes').delete().eq('id', id);
    fetchData();
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName) return;
    setLoading(true);
    const { error } = await supabase.from('subjects').insert([{ name: newSubjectName }]);
    if (error) alert(error.message);
    else { setNewSubjectName(''); fetchData(); }
    setLoading(false);
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure? This might break existing timetables.")) return;
    await supabase.from('subjects').delete().eq('id', id);
    fetchData();
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Administrator</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">School Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back, Principal — here's your school overview</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Total<br/>Teachers</p>
            <div className="p-2 bg-slate-50 rounded-lg"><Users className="w-4 h-4 text-slate-400" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{teachers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Active staff</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Present<br/>Today</p>
            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">{attendance.filter(a => a.status === 'present').length}</p>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+5%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">89% attendance</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50/50 to-transparent rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Absent<br/>Today</p>
            <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-500" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{attendance.filter(a => a.status === 'absent').length}</p>
          <p className="text-xs text-slate-500 mt-1">Requires action</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-50/50 to-transparent rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Lessons<br/>Today</p>
            <div className="p-2 bg-teal-50 rounded-lg"><BookOpen className="w-4 h-4 text-teal-600" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{verifications.length}</p>
          <p className="text-xs text-slate-500 mt-1">Out of 168</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Completion<br/>Rate</p>
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">93%</p>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+3%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">This week</p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50/50 to-transparent rounded-bl-full pointer-events-none"></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Active<br/>Alerts</p>
            <div className="p-2 bg-orange-50 rounded-lg"><Clock className="w-4 h-4 text-orange-500" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">4</p>
          <p className="text-xs text-slate-500 mt-1">Need attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Weekly Attendance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">Weekly Attendance</h2>
            <p className="text-sm text-slate-500 mb-6">Teacher attendance this week</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} barGap={0}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} ticks={[0, 15, 30, 45, 60]} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-xs font-medium text-slate-600">Present</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-xs font-medium text-slate-600">Late</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-xs font-medium text-slate-600">Absent</span></div>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">Teacher Performance Overview</h2>
            <p className="text-sm text-slate-500 mb-6">Top performing teachers this month</p>
            
            <div className="space-y-2">
              {topTeachers.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                      {t.id}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.attendance}%</p>
                      <p className="text-xs text-slate-500">Attendance</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.lessons}%</p>
                      <p className="text-xs text-slate-500">Lessons</p>
                    </div>
                    <div className="w-8 flex justify-end">
                      {t.trend === 'up' && <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>}
                      {t.trend === 'down' && <div className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><TrendingDown className="w-4 h-4" /></div>}
                      {t.trend === 'neutral' && <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><Minus className="w-4 h-4" /></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
            <p className="text-sm text-slate-500 mb-6">Wednesday, 29 April</p>
            
            <div className="space-y-0">
              {todaysSchedule.map((s, idx) => (
                <div key={s.id} className={`flex items-center gap-6 p-4 ${idx !== todaysSchedule.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-24">
                    <p className="text-xs font-medium text-slate-500">{s.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-900">{s.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.details}</p>
                  </div>
                  <div>
                    {s.status === 'Completed' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>}
                    {s.status === 'Ongoing' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium"><Clock className="w-3.5 h-3.5" /> Ongoing</span>}
                    {s.status === 'Upcoming' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium"><Clock className="w-3.5 h-3.5" /> Upcoming</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* School Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">School Overview</h2>
            <p className="text-sm text-slate-500 mb-6">Today's academic summary</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-teal-600">
                  <BookOpen className="w-4 h-4" /> <span className="text-xs font-semibold">Classes</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
                <p className="text-xs text-slate-500 mt-1">Active classes</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <Book className="w-4 h-4" /> <span className="text-xs font-semibold">Completion</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">93%</p>
                <p className="text-xs text-slate-500 mt-1">156/168 lessons</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                  <Clock className="w-4 h-4" /> <span className="text-xs font-semibold">Substitutions</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-xs text-slate-500 mt-1">Pending today</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-600">
                  <GraduationCap className="w-4 h-4" /> <span className="text-xs font-semibold">Subjects</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
                <p className="text-xs text-slate-500 mt-1">Being taught</p>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Alerts</h2>
                <p className="text-sm text-slate-500">Flagged inconsistencies</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">2 Critical</span>
            </div>
            
            <div className="space-y-3">
              {recentAlerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl border ${alert.border} ${alert.bg} flex gap-3 items-start`}>
                  <div className={`mt-0.5 ${alert.color}`}>
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.desc}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-500 mb-6">Latest check-ins and lessons</p>
            
            <div className="space-y-5">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-900 truncate">{activity.title}</p>
                      <p className="text-[11px] text-slate-400 whitespace-nowrap ml-2 mt-0.5">{activity.time}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
        <Calendar className="w-6 h-6 text-teal-600" /> Assign a New Lesson
      </h2>
      <form onSubmit={handleAssignTimetable} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Teacher</label>
          <select required value={formTeacher} onChange={e => setFormTeacher(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:ring-teal-500 focus:border-teal-500">
            <option value="">-- Choose Teacher --</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Class/Group</label>
            <select required value={formClass} onChange={e => setFormClass(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
              <option value="">-- Choose Class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Subject</label>
            <select required value={formSubject} onChange={e => setFormSubject(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
              <option value="">-- Choose Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
            <select required value={formDay} onChange={e => setFormDay(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
              <option value="1">Mon</option><option value="2">Tue</option><option value="3">Wed</option>
              <option value="4">Thu</option><option value="5">Fri</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
            <input required type="time" value={formStart} onChange={e => setFormStart(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
            <input required type="time" value={formEnd} onChange={e => setFormEnd(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" />
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition shadow-sm">
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Assigning...' : 'Assign Timetable'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSetup = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
          <Layers className="w-6 h-6 text-purple-600" /> Manage Classes
        </h2>
        <form onSubmit={handleAddClass} className="flex gap-2 mb-4">
          <input type="text" required placeholder="e.g. Form 1A" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50" />
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700">Add</button>
        </form>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {classes.length === 0 && <p className="text-sm text-slate-500">No classes created yet.</p>}
          {classes.map(c => (
            <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-900">{c.name}</span>
              <button onClick={() => handleDeleteClass(c.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
          <Book className="w-6 h-6 text-blue-600" /> Manage Subjects
        </h2>
        <form onSubmit={handleAddSubject} className="flex gap-2 mb-4">
          <input type="text" required placeholder="e.g. Mathematics" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50" />
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Add</button>
        </form>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {subjects.length === 0 && <p className="text-sm text-slate-500">No subjects created yet.</p>}
          {subjects.map(s => (
            <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-900">{s.name}</span>
              <button onClick={() => handleDeleteSubject(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyLedger = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-slate-900">Verified Lessons (Today)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Teacher</th>
                <th className="p-4 font-medium">Class & Subject</th>
                <th className="p-4 font-medium">GPS Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifications.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500 text-sm">No lessons verified yet today.</td></tr>
              ) : (
                verifications.map(v => (
                  <tr key={v.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{v.profiles?.full_name}</p>
                      <p className="text-xs text-slate-500">{new Date(v.created_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-teal-700">{v.timetables?.subjects?.name}</p>
                      <p className="text-xs text-slate-600">{v.timetables?.classes?.name} ({v.timetables?.start_time.substring(0,5)} - {v.timetables?.end_time.substring(0,5)})</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-mono">
                        {v.location_lat.toFixed(4)}, {v.location_lng.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full z-10">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">EduTrack</h1>
              <p className="text-xs text-slate-500">Tanzania Schools</p>
            </div>
          </div>
          
          <nav className="px-4 py-2 space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Check-In', icon: UserCheck },
              { name: 'Teachers', icon: Users, adminOnly: true },
              { name: 'Timetable', icon: Calendar },
              { name: 'Lessons', icon: ClipboardList },
              { name: 'Alerts', icon: AlertTriangle, adminOnly: true },
              { name: 'Reports', icon: FileText, adminOnly: true },
              { name: 'Setup', icon: Layers, adminOnly: true },
            ]
            .filter(item => !(profile?.role === 'teacher' && item.adminOnly))
            .map(item => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeMenu === item.name
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeMenu === item.name ? 'text-teal-100' : 'text-slate-400'}`} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200 uppercase">
              {profile?.full_name ? profile.full_name.substring(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{profile?.role ? profile.role.replace('_', ' ') : 'Role'}</p>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="text-slate-400 hover:text-red-500 transition-colors">
              <UserX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {activeMenu === 'Dashboard' && renderDashboard()}
          {activeMenu === 'Timetable' && <TimetableView />}
          {activeMenu === 'Setup' && renderSetup()}
          {activeMenu === 'Check-In' && <CheckInView attendance={attendance} />}
          {activeMenu === 'Lessons' && <LessonsView verifications={verifications} />}
          {activeMenu === 'Alerts' && <AlertsView alerts={[]} />}
          {activeMenu === 'Teachers' && <TeachersView teachers={teachers} attendance={attendance} />}
          {activeMenu === 'Reports' && (
            <div className="flex items-center justify-center h-[50vh] text-slate-500">
              <p>Reports section is under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
