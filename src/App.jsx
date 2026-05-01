import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading EduTrack...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          session ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/dashboard" element={
          session ? <Dashboard session={session} /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">EduTrack Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ session }) {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) {
        console.error(error)
        setError(error.message)
      } else if (data) {
        setProfile(data)
      }
    }
    getProfile()
  }, [session])

  return (
    <>
      {/* Main Content Area */}
      {error ? (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">EduTrack</h1>
              <button onClick={() => supabase.auth.signOut()} className="text-red-600">Sign Out</button>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="font-bold mb-1">Error loading profile:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : profile ? (
        <AdminDashboard profile={profile} session={session} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      )}
    </>
  )
}

export default App
