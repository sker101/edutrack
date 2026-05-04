import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AdminDashboard from './components/AdminDashboard'
import TeacherPortal from './components/TeacherPortal'
import { GraduationCap, Mail, User, ArrowRight, Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setAppLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else { setProfile(null); setAppLoading(false) }
    })
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data || null)
    setAppLoading(false)
  }

  if (appLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading EduTrack...</p>
        </div>
      </div>
    )
  }

  if (!session) return <Login />

  // First time login — no full name yet
  if (!profile?.full_name) return <Onboarding session={session} onComplete={fetchProfile} />

  // Role-based routing
  const role = profile.role
  if (role === 'teacher') return <TeacherPortal profile={profile} session={session} />
  return <AdminDashboard profile={profile} session={session} />
}

/* ─── PASSWORD LOGIN PAGE ─── */
function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'forgot' | 'reset_sent'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '?reset=1'
    })
    if (error) setError(error.message)
    else setMode('reset_sent')
    setLoading(false)
  }

  const bg = "min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4"
  const gridBg = "absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none"

  return (
    <div className={bg}>
      <div className={gridBg} />
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-900/50 mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EduTrack</h1>
          <p className="text-teal-300 text-sm mt-1 font-medium">Tanzania Schools Management</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">

          {/* ── RESET SENT ── */}
          {mode === 'reset_sent' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                A password-reset link was sent to<br />
                <span className="text-teal-300 font-medium">{email}</span>
              </p>
              <button onClick={() => { setMode('login'); setError('') }} className="mt-6 text-teal-400 text-sm hover:text-teal-300 underline">
                Back to sign in
              </button>
            </div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Reset Password</h2>
                  <p className="text-slate-400 text-xs">We'll email you a reset link</p>
                </div>
              </div>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@school.ac.tz" required
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError('') }}
                  className="w-full text-slate-400 text-sm hover:text-slate-300 transition">
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

          {/* ── SIGN IN ── */}
          {mode === 'login' && (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-slate-400 text-sm mb-6">Sign in with your school email and password</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@school.ac.tz" required
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <button type="button" onClick={() => { setMode('forgot'); setError('') }}
                      className="text-teal-400 text-xs hover:text-teal-300 transition">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-900/30">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <div className="mt-6 text-center space-y-1">
                <p className="text-slate-500 text-xs">Secure password sign-in · <button type="button" onClick={() => { setMode('forgot'); setError('') }} className="text-teal-500 hover:text-teal-400 underline">Forgot password?</button></p>
                <p className="text-slate-600 text-xs">No account yet? <span className="text-slate-400">Ask your school admin to create one for you.</span></p>
              </div>
            </>
          )}
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">© 2026 EduTrack · Tanzania Schools System</p>
      </div>
    </div>
  )
}

/* ─── ONBOARDING — Set Your Name ─── */
function Onboarding({ session, onComplete }) {
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwError, setPwError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) return
    if (password.length < 8) { setPwError('Password must be at least 8 characters.'); return }
    if (password !== confirmPw) { setPwError('Passwords do not match.'); return }
    setLoading(true)
    setPwError('')
    // Set the password for this account
    const { error: pwErr } = await supabase.auth.updateUser({ password })
    if (pwErr) { setPwError(pwErr.message); setLoading(false); return }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, full_name: fullName.trim(), email: session.user.email })
    if (error) { alert(error.message); setLoading(false); return; }
    onComplete(session.user.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-900/50 mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EduTrack</h1>
          <p className="text-teal-300 text-sm mt-1 font-medium">Welcome! Let's set up your profile</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">What's your name?</h2>
              <p className="text-slate-400 text-sm">This will appear across the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. John Mwangi" required autoFocus
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Set a Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required minLength={8}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Re-enter password" required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
              </div>
            </div>
            {pwError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{pwError}</p>}
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-slate-400">Logged in as: <span className="text-teal-300 font-medium">{session.user.email}</span></p>
            </div>
            <button type="submit" disabled={loading || !fullName.trim()}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:text-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
