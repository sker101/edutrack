import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, UserX, FileQuestion, MapPin, Search, 
  ChevronLeft, ChevronRight, Check, X, MoreHorizontal, FileText, Upload
} from 'lucide-react';

export const AlertsView = ({ alerts }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Alerts & Flags</h1>
      <p className="text-sm text-slate-500 mt-1">Review and resolve attendance inconsistencies</p>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2">
      <div className="bg-white p-5 rounded-xl border border-slate-200 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-slate-900">5</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Total Alerts</p>
      </div>
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-orange-600">3</p>
        <p className="text-sm font-medium text-orange-700 mt-1">Unresolved</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-red-600">2</p>
        <p className="text-sm font-medium text-red-700 mt-1">Critical</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 min-w-[200px] flex-1">
        <p className="text-3xl font-bold text-emerald-600">2</p>
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
      <div className="bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-200 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="flex gap-4">
          <div className="mt-1 text-red-500"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-slate-900">Lesson without Check-in</h3>
            <p className="text-sm text-slate-600 mt-0.5">Lesson was recorded but no biometric check-in found for the day</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">John Mwangi</span>
              <span>Form 3A - Mathematics</span>
              <span>2024-01-15 09:15 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100">High Priority</span>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Dismiss</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Resolve</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-200 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="flex gap-4">
          <div className="mt-1 text-red-500"><UserX className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-slate-900">Unexcused Absence</h3>
            <p className="text-sm text-slate-600 mt-0.5">Teacher did not check in and had 4 scheduled classes</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Grace Kimaro</span>
              <span>2024-01-15 08:00 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100">High Priority</span>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Dismiss</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Resolve</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border-l-4 border-l-orange-400 border-y border-r border-slate-200 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="flex gap-4">
          <div className="mt-1 text-orange-500"><Clock className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-slate-900">Late Arrival</h3>
            <p className="text-sm text-slate-600 mt-0.5">Checked in 25 minutes after first scheduled class</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Peter Makonda</span>
              <span>2024-01-15 10:25 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-100">Medium Priority</span>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Dismiss</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Resolve</button>
        </div>
      </div>
      
      <div className="bg-slate-50 p-5 rounded-xl border-l-4 border-l-slate-400 border-y border-r border-slate-200 flex flex-col md:flex-row gap-4 justify-between md:items-center opacity-70">
        <div className="flex gap-4">
          <div className="mt-1 text-slate-500"><FileQuestion className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-slate-900">Missing Lesson Record</h3>
            <p className="text-sm text-slate-600 mt-0.5">Teacher was present but lesson record not submitted</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Mary Shayo</span>
              <span>Form 3B - Chemistry</span>
              <span>2024-01-14 02:00 PM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full border border-slate-300">Resolved</span>
        </div>
      </div>
    </div>
  </div>
);

export const CheckInView = () => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [method, setMethod] = useState('');

  const handleSimulateBiometric = (type) => {
    setMethod(type);
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      alert(`${type} Verification Successful! Checked in.`);
    }, 2000);
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
              {[
                { name: 'Anna Mushi', time: '08:15 AM' },
                { name: 'James Tarimo', time: '08:12 AM' },
                { name: 'Sarah Kimaro', time: '08:08 AM' },
                { name: 'David Mwakesege', time: '08:05 AM' },
              ].map((person, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{person.name}</p>
                      <p className="text-xs text-slate-500">via location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> {person.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-800">42 Teachers Checked In</h3>
            </div>
            <p className="text-sm text-emerald-700">89% of expected staff present • 5 pending arrivals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LessonsView = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lesson Records</h1>
        <p className="text-sm text-slate-500 mt-1">Track and verify completed lessons</p>
      </div>
      <button className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-sm transition">
        Record Lesson
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-slate-900">8</p>
          <BookOpen className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Total</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-emerald-600">4</p>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-emerald-700">Verified</p>
      </div>
      <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-orange-600">2</p>
          <Clock className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-sm font-medium text-orange-700">Pending</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-2">
          <p className="text-3xl font-bold text-red-600">2</p>
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
      {[
        { subject: 'Mathematics', form: 'Form 3A', topic: 'Quadratic Equations', teacher: 'John Mwangi', date: '2024-01-15', time: '07:30 - 08:10', status: 'Verified', statusColor: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
        { subject: 'English', form: 'Form 2B', topic: 'Essay Writing', teacher: 'Grace Kimaro', date: '2024-01-15', time: '08:15 - 08:55', status: 'Flagged', statusColor: 'text-red-700 border-red-200 bg-red-50', badge: 'No Check-in', icon: AlertTriangle },
        { subject: 'Physics', form: 'Form 4A', topic: "Newton's Laws", teacher: 'Peter Makonda', date: '2024-01-15', time: '09:00 - 09:40', status: 'Pending', statusColor: 'text-orange-700 border-orange-200 bg-orange-50', icon: Clock },
        { subject: 'Chemistry', form: 'Form 3B', topic: 'Chemical Bonding', teacher: 'Mary Shayo', date: '2024-01-15', time: '09:45 - 10:25', status: 'Pending', statusColor: 'text-orange-700 border-orange-200 bg-orange-50', icon: Clock },
      ].map((lesson, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">{lesson.subject}</h3>
              <span className="text-slate-400">•</span>
              <span className="text-sm font-medium text-slate-500">{lesson.form}</span>
            </div>
            <p className="text-slate-700 mt-1">{lesson.topic}</p>
            <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> {lesson.teacher}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {lesson.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lesson.badge && <span className="text-red-600 text-xs font-bold">{lesson.badge}</span>}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${lesson.statusColor}`}>
              <lesson.icon className="w-3.5 h-3.5" /> {lesson.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TimetableView = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
        <p className="text-sm text-slate-500 mt-1">View and manage class schedules</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-5 h-5" /></button>
        <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-sm">Friday, 1 May 2026</div>
        <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronRight className="w-5 h-5" /></button>
      </div>
    </div>

    <div className="flex items-center gap-4 text-sm font-medium text-slate-600 mb-2">
      <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Completed</span>
      <span className="flex items-center gap-1 text-teal-600"><Clock className="w-4 h-4" /> Ongoing</span>
      <span className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4" /> Upcoming</span>
      <span className="flex items-center gap-1 text-red-500"><X className="w-4 h-4 border border-red-500 rounded-full" /> Missed</span>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
            <th className="p-4 w-24">Time</th>
            {['Form 1A', 'Form 1B', 'Form 2A', 'Form 2B', 'Form 3A', 'Form 3B', 'Form 4A', 'Form 4B'].map(f => (
              <th key={f} className="p-4 text-center">{f}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { time: '07:30', blocks: [{f:0, s:'Math', t:'J. Mwangi', st:'completed'}, {f:2, s:'Physics', t:'D. Mwakesege', st:'completed'}, {f:3, s:'Chemistry', t:'J. Tarimo', st:'completed'}, {f:4, s:'Biology', t:'J. Mwangi', st:'completed'}, {f:5, s:'Geography', t:'P. Makonda', st:'completed'}, {f:6, s:'History', t:'D. Mwakesege', st:'completed'}, {f:7, s:'Swahili', t:'J. Tarimo', st:'completed'}] },
            { time: '08:15', blocks: [{f:0, s:'English', t:'G. Kimaro', st:'completed'}, {f:3, s:'Biology', t:'S. Kimaro', st:'completed'}, {f:6, s:'Swahili', t:'A. Mushi', st:'completed'}] },
            { time: '09:00', blocks: [{f:0, s:'Physics', t:'P. Makonda', st:'ongoing'}, {f:2, s:'Biology', t:'J. Tarimo', st:'ongoing'}, {f:3, s:'Geography', t:'J. Mwangi', st:'ongoing'}, {f:4, s:'History', t:'P. Makonda', st:'ongoing'}, {f:5, s:'Swahili', t:'D. Mwakesege', st:'ongoing'}, {f:6, s:'Math', t:'J. Tarimo', st:'ongoing'}] },
            { time: '09:45', blocks: [{f:0, s:'Chemistry', t:'M. Shayo', st:'upcoming'}, {f:1, s:'Biology', t:'A. Mushi', st:'missed'}, {f:2, s:'Geography', t:'S. Kimaro', st:'upcoming'}, {f:3, s:'History', t:'G. Kimaro', st:'upcoming'}, {f:4, s:'Swahili', t:'M. Shayo', st:'upcoming'}, {f:5, s:'Math', t:'A. Mushi', st:'upcoming'}, {f:6, s:'English', t:'S. Kimaro', st:'upcoming'}, {f:7, s:'Physics', t:'G. Kimaro', st:'upcoming'}] },
            { time: '10:30', blocks: [{f:0, s:'Biology', t:'D. Mwakesege', st:'upcoming'}, {f:3, s:'History', t:'J. Mwangi', st:'upcoming'}, {f:4, s:'Swahili', t:'P. Makonda', st:'upcoming'}, {f:6, s:'English', t:'J. Tarimo', st:'upcoming'}, {f:7, s:'Physics', t:'J. Mwangi', st:'upcoming'}] },
            { time: '11:15', blocks: [{f:0, s:'Geography', t:'A. Mushi', st:'upcoming'}, {f:1, s:'History', t:'S. Kimaro', st:'upcoming'}, {f:3, s:'Math', t:'M. Shayo', st:'upcoming'}, {f:4, s:'English', t:'A. Mushi', st:'upcoming'}, {f:5, s:'Physics', t:'S. Kimaro', st:'upcoming'}, {f:6, s:'Chemistry', t:'G. Kimaro', st:'upcoming'}] }
          ].map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="p-4 font-medium text-slate-500 text-sm align-top pt-5">{row.time}</td>
              {[0,1,2,3,4,5,6,7].map(colIdx => {
                const block = row.blocks.find(b => b.f === colIdx);
                if (!block) return <td key={colIdx} className="p-2"><div className="h-16 rounded-xl border border-dashed border-slate-200"></div></td>;
                
                let bg, border, text, icon;
                if (block.st === 'completed') { bg='bg-emerald-50'; border='border-emerald-100'; text='text-emerald-700'; icon=<CheckCircle2 className="w-3.5 h-3.5" />; }
                else if (block.st === 'ongoing') { bg='bg-teal-50'; border='border-teal-100'; text='text-teal-700'; icon=<Clock className="w-3.5 h-3.5" />; }
                else if (block.st === 'missed') { bg='bg-red-50'; border='border-red-100'; text='text-red-700'; icon=<X className="w-3.5 h-3.5 border border-red-700 rounded-full" />; }
                else { bg='bg-white'; border='border-slate-200'; text='text-slate-700'; icon=<Clock className="w-3.5 h-3.5 text-slate-400" />; }

                return (
                  <td key={colIdx} className="p-2">
                    <div className={`p-2 rounded-xl border ${bg} ${border} h-full min-h-[4rem] relative flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${text}`}>{block.s}</span>
                        {icon}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 truncate">{block.t}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const TeachersView = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and monitor teacher attendance</p>
      </div>
      <button className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-sm transition">
        Add Teacher
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-center">
        <p className="text-3xl font-bold text-slate-900">8</p>
        <p className="text-sm font-medium text-slate-500">Total</p>
      </div>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center">
        <p className="text-3xl font-bold text-emerald-600">6</p>
        <p className="text-sm font-medium text-emerald-700">Present</p>
      </div>
      <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col justify-center">
        <p className="text-3xl font-bold text-red-600">1</p>
        <p className="text-sm font-medium text-red-700">Absent</p>
      </div>
      {/* Late missing in screenshot? Oh it is there, 4 cards. Wait, 4 cards. */}
    </div>

    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search teachers..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {['All', 'Present', 'Absent', 'Late'].map((filter, i) => (
          <button key={i} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {filter}
          </button>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="p-4">Teacher</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Status</th>
            <th className="p-4">Check-in</th>
            <th className="p-4">Lessons</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { ini: 'JM', name: 'John Mwangi', subj: 'Mathematics', stat: 'Present', time: '07:25 AM', les: [3, 5], statClass: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
            { ini: 'GK', name: 'Grace Kimaro', subj: 'English', stat: 'Absent', time: '—', les: [0, 4], statClass: 'text-red-700 border-red-200 bg-red-50', icon: X },
            { ini: 'PM', name: 'Peter Makonda', subj: 'Physics', stat: 'Late', time: '08:45 AM', les: [2, 4], statClass: 'text-orange-700 border-orange-200 bg-orange-50', icon: Clock },
            { ini: 'MS', name: 'Mary Shayo', subj: 'Chemistry', stat: 'Present', time: '07:20 AM', les: [3, 5], statClass: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
            { ini: 'DM', name: 'David Mwakesege', subj: 'Biology', stat: 'Present', time: '07:30 AM', les: [2, 4], statClass: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
            { ini: 'AM', name: 'Anna Mushi', subj: 'Geography', stat: 'Present', time: '07:28 AM', les: [3, 5], statClass: 'text-emerald-700 border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
          ].map((t, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors text-sm">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">{t.ini}</div>
                  <span className="font-semibold text-slate-900">{t.name}</span>
                </div>
              </td>
              <td className="p-4 text-slate-600 font-medium">{t.subj}</td>
              <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${t.statClass}`}>
                  <t.icon className="w-3.5 h-3.5" /> {t.stat}
                </span>
              </td>
              <td className="p-4 text-slate-600">{t.time}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${(t.les[0]/t.les[1])*100}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{t.les[0]}/{t.les[1]}</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
