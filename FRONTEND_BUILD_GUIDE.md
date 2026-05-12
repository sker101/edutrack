# 🎨 EduTrack Frontend Build Guide

## 📋 Overview
This guide provides complete specifications for building the EduTrack frontend that connects to your Express/Node.js backend API running at: `https://365e-41-59-224-62.ngrok-free.app`

---

## 🔧 Technical Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API or Axios
- **State Management**: React useState/useEffect
- **Routing**: React Router DOM

---

## 🌐 Backend API Base URL
```javascript
const API_BASE_URL = 'https://365e-41-59-224-62.ngrok-free.app/api';
```

---

## 📄 Pages to Build (In Order)

### **PAGE 1: Login Page** 
**Route**: `/login`  
**File**: `src/pages/LoginPage.jsx`

#### UI Layout:
- Centered card on gradient background
- EduTrack logo at top
- 2 input fields:
  1. **Email** (type: email, required)
  2. **Password** (type: password, required, min 8 chars)
- "Login" button (full width, primary color)
- Link to Register page at bottom

#### Backend API:
```javascript
POST /api/auth/login
Headers: { 'Content-Type': 'application/json' }
Body: {
  "email": "teacher@azania.tz",
  "password": "Teacher@2025"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juma Mwangi",
    "email": "teacher@azania.tz",
    "role": "TEACHER",
    "schoolId": 1
  }
}
```

#### What to Do After Login:
1. Store `token` in `localStorage.setItem('token', response.token)`
2. Store `user` in `localStorage.setItem('user', JSON.stringify(response.user))`
3. Redirect to Dashboard based on role:
   - If role === 'ADMIN' → `/admin/dashboard`
   - If role === 'PRINCIPAL' → `/admin/dashboard`
   - If role === 'TEACHER' → `/teacher/dashboard`

---

### **PAGE 2: Register Page**
**Route**: `/register`  
**File**: `src/pages/RegisterPage.jsx`

#### UI Layout:
- Centered card on gradient background
- EduTrack logo at top
- 5 input fields:
  1. **Name** (type: text, required)
  2. **Email** (type: email, required)
  3. **Password** (type: password, required, min 8 chars)
  4. **Role** (select dropdown: TEACHER, PRINCIPAL, ADMIN)
  5. **School ID** (type: number, required if role is TEACHER or PRINCIPAL)
  6. **Phone** (type: text, optional)
- "Register" button (full width, primary color)
- Link to Login page at bottom

#### Backend API:
```javascript
POST /api/auth/register
Headers: { 'Content-Type': 'application/json' }
Body: {
  "name": "John Doe",
  "email": "john@school.tz",
  "password": "Password@123",
  "role": "TEACHER",
  "schoolId": 1,
  "phone": "+255712345678"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 11,
    "name": "John Doe",
    "email": "john@school.tz",
    "role": "TEACHER"
  }
}
```

#### What to Do After Registration:
1. Show success message
2. Redirect to Login page after 2 seconds

---

### **PAGE 3: Teacher Dashboard**
**Route**: `/teacher/dashboard`  
**File**: `src/pages/TeacherDashboard.jsx`

#### UI Layout:
**Header Section:**
- Welcome message: "Welcome, {user.name}"
- Current date and time
- Logout button

**Stats Cards (4 cards in a row):**
1. **Today's Status**
   - Icon: CheckCircle
   - Value: "Checked In" or "Not Checked In"
   - Color: Green if checked in, Red if not

2. **Today's Lessons**
   - Icon: BookOpen
   - Value: Number of lessons today
   - Example: "5 Lessons"

3. **Completed Lessons**
   - Icon: CheckCircle2
   - Value: Number of verified lessons today
   - Example: "3 / 5"

4. **Attendance Rate**
   - Icon: TrendingUp
   - Value: Percentage
   - Example: "95%"

**Today's Schedule Section:**
- Title: "Today's Timetable"
- List of lessons for today (cards)
- Each lesson card shows:
  - Subject name
  - Class name
  - Time (start - end)
  - Status badge: "Upcoming" | "Completed" | "Missed"
  - "Mark as Taught" button (if not completed)

**Quick Actions Section:**
- Big "Check In" button (if not checked in today)
- "View Full Timetable" button
- "Request Leave" button

#### Backend APIs:

**1. Get Today's Timetable:**
```javascript
GET /api/timetables/my-schedule
Headers: { 'Authorization': 'Bearer {token}' }

Response (200):
[
  {
    "id": 1,
    "dayOfWeek": 1,
    "startTime": "08:00:00",
    "endTime": "09:00:00",
    "subject": { "id": 1, "name": "Mathematics" },
    "class": { "id": 1, "name": "Form 1A" }
  }
]
```

**2. Check Attendance Status:**
```javascript
GET /api/attendance/my-status
Headers: { 'Authorization': 'Bearer {token}' }

Response (200):
{
  "checkedIn": true,
  "checkInTime": "2025-05-12T07:30:00Z",
  "location": { "lat": -6.7924, "lng": 39.2083 }
}
```

**3. Get Verified Lessons:**
```javascript
GET /api/lessons/my-verifications
Headers: { 'Authorization': 'Bearer {token}' }

Response (200):
[
  {
    "id": 1,
    "timetableId": 1,
    "date": "2025-05-12",
    "status": "TAUGHT",
    "verifiedAt": "2025-05-12T08:45:00Z"
  }
]
```

---

### **PAGE 4: Check-In Page**
**Route**: `/teacher/checkin`  
**File**: `src/pages/CheckInPage.jsx`

#### UI Layout:
- Large centered card
- Title: "Morning Check-In"
- Current location display (lat, lng)
- Big "Check In Now" button
- Status message area
- GPS accuracy indicator

#### Geolocation Implementation:
```javascript
const handleCheckIn = async () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/attendance/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          latitude,
          longitude
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Check-in successful!');
        // Redirect to dashboard
      } else {
        alert(`Error: ${data.message}`);
      }
    },
    (error) => {
      alert('Unable to get your location. Please enable GPS.');
    },
    { enableHighAccuracy: true }
  );
};
```

#### Backend API:
```javascript
POST /api/attendance/checkin
Headers: { 
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
Body: {
  "latitude": -6.7924,
  "longitude": 39.2083
}

Response (201):
{
  "message": "Check-in successful",
  "attendance": {
    "id": 1,
    "teacherId": 1,
    "date": "2025-05-12",
    "checkInTime": "2025-05-12T07:30:00Z",
    "status": "PRESENT"
  }
}

Error Response (400):
{
  "message": "You are outside the school geofence area"
}
```

---

### **PAGE 5: Timetable Page**
**Route**: `/teacher/timetable`  
**File**: `src/pages/TimetablePage.jsx`

#### UI Layout:
- Weekly calendar view
- Days of week as columns (Monday - Friday)
- Time slots as rows
- Each cell shows:
  - Subject name
  - Class name
  - Time range
- Color-coded by subject
- Filter by week

#### Backend API:
```javascript
GET /api/timetables/my-schedule
Headers: { 'Authorization': 'Bearer {token}' }

Response (200):
[
  {
    "id": 1,
    "dayOfWeek": 1,
    "startTime": "08:00:00",
    "endTime": "09:00:00",
    "subject": { "id": 1, "name": "Mathematics" },
    "class": { "id": 1, "name": "Form 1A" }
  }
]
```

---

### **PAGE 6: Leave Request Page**
**Route**: `/teacher/leave`  
**File**: `src/pages/LeaveRequestPage.jsx`

#### UI Layout:
**Request Leave Form:**
- Start Date (date picker)
- End Date (date picker)
- Leave Type (select: SICK, ANNUAL, EMERGENCY, MATERNITY, PATERNITY, UNPAID)
- Reason (textarea)
- "Submit Request" button

**My Leave Requests:**
- List of all leave requests
- Each request shows:
  - Date range
  - Type
  - Status badge (PENDING, APPROVED, REJECTED)
  - Reason
  - Approved by (if approved)

#### Backend APIs:

**1. Create Leave Request:**
```javascript
POST /api/leave/request
Headers: { 
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
Body: {
  "startDate": "2025-05-15",
  "endDate": "2025-05-17",
  "leaveType": "SICK",
  "reason": "Medical appointment"
}

Response (201):
{
  "message": "Leave request submitted successfully",
  "leave": {
    "id": 1,
    "teacherId": 1,
    "startDate": "2025-05-15",
    "endDate": "2025-05-17",
    "leaveType": "SICK",
    "status": "PENDING"
  }
}
```

**2. Get My Leave Requests:**
```javascript
GET /api/leave/my-requests
Headers: { 'Authorization': 'Bearer {token}' }

Response (200):
[
  {
    "id": 1,
    "startDate": "2025-05-15",
    "endDate": "2025-05-17",
    "leaveType": "SICK",
    "status": "PENDING",
    "reason": "Medical appointment",
    "createdAt": "2025-05-12T10:00:00Z"
  }
]
```

---

## 🔐 Authentication & Protected Routes

### Auth Context Setup
Create `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Protected Route Component
Create `src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

---

## 📁 Recommended File Structure

```
src/
├── components/
│   ├── ProtectedRoute.jsx
│   ├── Navbar.jsx
│   ├── StatsCard.jsx
│   ├── LessonCard.jsx
│   └── LoadingSpinner.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── TeacherDashboard.jsx
│   ├── CheckInPage.jsx
│   ├── TimetablePage.jsx
│   └── LeaveRequestPage.jsx
├── utils/
│   ├── api.js (API helper functions)
│   └── constants.js (API_BASE_URL, etc.)
├── App.jsx
└── main.jsx
```

---

## 🚀 App.jsx Router Setup

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard';
import CheckInPage from './pages/CheckInPage';
import TimetablePage from './pages/TimetablePage';
import LeaveRequestPage from './pages/LeaveRequestPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/checkin" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <CheckInPage />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/timetable" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TimetablePage />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/leave" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <LeaveRequestPage />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 🎨 Tailwind CSS Color Scheme

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      }
    }
  }
}
```

---

## ✅ Testing Credentials

Use these credentials from your seeded database:

**Admin:**
- Email: `admin@edutrack.tz`
- Password: `Admin@2025`

**Principal:**
- Email: `principal@azania.tz`
- Password: `Principal@2025`

**Teacher:**
- Email: `teacher1@azania.tz` (or teacher2, teacher3, etc.)
- Password: `Teacher@2025`

---

## 🔍 Important Notes

1. **CORS**: Your backend already has CORS configured for `http://localhost:5173`
2. **Token**: Always include `Authorization: Bearer {token}` header for protected routes
3. **GPS**: Check-in requires GPS permission from the browser
4. **Geofence**: Default school location is Dar es Salaam (-6.7924, 39.2083) with 500m radius
5. **Error Handling**: Always handle API errors and show user-friendly messages

---

## 📝 Next Steps

Build the pages in this order:
1. ✅ Login Page
2. ✅ Register Page  
3. ✅ Teacher Dashboard
4. ✅ Check-In Page
5. ✅ Timetable Page
6. ✅ Leave Request Page

After completing these, you can build:
- Admin Dashboard
- Principal Dashboard
- Reports Page
- Notifications Page

---

**Good luck building! 🚀**
