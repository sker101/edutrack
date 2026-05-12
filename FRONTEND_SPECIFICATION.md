# EduTrack Frontend Specification

## 📱 Page 1: Login Page

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│         📚 EduTrack                 │
│    Teacher Attendance System        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  │ [teacher@school.tz        ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │
│  │ [••••••••••••             ] │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ ] Remember me                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        LOGIN                │   │
│  └─────────────────────────────┘   │
│                                     │
│     Forgot password?                │
│                                     │
└─────────────────────────────────────┘
```

### API Integration

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "teacher@school.tz",
  "password": "Teacher@2025"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 3,
      "name": "Juma Mwinyimkuu",
      "email": "juma.mwinyimkuu@azania.tz",
      "role": "TEACHER",
      "schoolId": 1,
      "phone": "+255713100001",
      "isActive": true,
      "createdAt": "2026-05-11T09:16:41.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Frontend Logic

1. **Form Validation:**
   - Email: Required, valid email format
   - Password: Required, minimum 8 characters

2. **On Submit:**
   - Show loading spinner
   - Call API with credentials
   - If success:
     * Store token in localStorage: `localStorage.setItem('token', data.token)`
     * Store user in localStorage: `localStorage.setItem('user', JSON.stringify(data.user))`
     * Update Auth Context
     * Redirect based on role:
       - TEACHER → `/dashboard`
       - PRINCIPAL → `/dashboard`
       - ADMIN → `/admin/dashboard`
   - If error:
     * Show error message
     * Clear password field

3. **Remember Me:**
   - If checked, store credentials in localStorage
   - If unchecked, use sessionStorage

### Fields to Store
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'TEACHER' | 'PRINCIPAL' | 'ADMIN';
  schoolId: number;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

---

## 📊 Page 2: Teacher Dashboard

### Visual Design
```
┌─────────────────────────────────────────────────┐
│ ☰  EduTrack          👤 Juma Mwinyimkuu    🔔 3 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Good Morning, Juma! 👋                         │
│  Monday, May 11, 2026                           │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ ✅ CHECKED IN   │  │ 📚 3 LESSONS    │     │
│  │ 7:45 AM         │  │ Today           │     │
│  │ Status: Present │  │                 │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 📅 95%          │  │ 🔔 3 NEW        │     │
│  │ Attendance      │  │ Notifications   │     │
│  │ This Month      │  │                 │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │ 📅 TODAY'S SCHEDULE                   │     │
│  ├───────────────────────────────────────┤     │
│  │ 08:00-09:00  Mathematics  Form 4A     │     │
│  │ Room 101                    [✓ Done]  │     │
│  ├───────────────────────────────────────┤     │
│  │ 10:00-11:00  Mathematics  Form 4B     │     │
│  │ Room 101              [Mark as Done]  │     │
│  ├───────────────────────────────────────┤     │
│  │ 14:00-15:00  Mathematics  Form 3A     │     │
│  │ Room 102              [Mark as Done]  │     │
│  └───────────────────────────────────────┘     │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │        [CHECK IN NOW]                 │     │
│  └───────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Integrations

#### 1. Get Current User
**Endpoint:** `GET /api/auth/me`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Juma Mwinyimkuu",
    "email": "juma.mwinyimkuu@azania.tz",
    "role": "TEACHER",
    "schoolId": 1,
    "phone": "+255713100001"
  }
}
```

#### 2. Get Today's Attendance Status
**Endpoint:** `GET /api/attendance/today`
**Headers:** `Authorization: Bearer <token>`

**Response (Checked In):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "teacherId": 3,
    "date": "2026-05-11",
    "timeIn": "2026-05-11T07:45:00.000Z",
    "status": "PRESENT",
    "latitude": -6.7924,
    "longitude": 39.2083
  }
}
```

**Response (Not Checked In):**
```json
{
  "success": true,
  "data": null
}
```

#### 3. Get Today's Timetable
**Endpoint:** `GET /api/timetable/my`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "subject": "Mathematics",
      "class": "Form 4A",
      "day": "MONDAY",
      "timeSlot": "08:00-09:00",
      "room": "Room 101",
      "teacher": {
        "id": 3,
        "name": "Juma Mwinyimkuu"
      }
    },
    {
      "id": 2,
      "subject": "Mathematics",
      "class": "Form 4B",
      "day": "MONDAY",
      "timeSlot": "10:00-11:00",
      "room": "Room 101"
    }
  ]
}
```

#### 4. Get Today's Lessons (to check which are conducted)
**Endpoint:** `GET /api/lessons/today`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "timetableId": 1,
      "date": "2026-05-11",
      "status": "CONDUCTED",
      "notes": "Covered Chapter 5"
    }
  ]
}
```

#### 5. Get Notifications Count
**Endpoint:** `GET /api/notifications/summary`
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "unread": 3
  }
}
```

### Frontend Logic

1. **On Page Load:**
   - Check if user is authenticated (token exists)
   - Fetch user data
   - Fetch today's attendance status
   - Fetch today's timetable
   - Fetch today's lessons
   - Fetch notification count

2. **Display Logic:**
   - If checked in: Show check-in time and status
   - If not checked in: Show "CHECK IN NOW" button prominently
   - For each timetable slot:
     * Check if lesson is conducted
     * If conducted: Show ✓ Done (green)
     * If not conducted: Show "Mark as Done" button

3. **Quick Actions:**
   - Check In button → Navigate to `/check-in`
   - Mark as Done → Call lesson API
   - View Notifications → Navigate to `/notifications`

---

## 📍 Page 3: Check-in Page

### Visual Design
```
┌─────────────────────────────────────┐
│ ← Back          Check In            │
├─────────────────────────────────────┤
│                                     │
│         📍 Location Required        │
│                                     │
│  We need your location to verify    │
│  you are at school.                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [MAP SHOWING           │   │
│  │       YOUR LOCATION]        │   │
│  │                             │   │
│  │      📍 You are here        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Your Location:                     │
│  Lat: -6.7924, Lon: 39.2083        │
│                                     │
│  School: Azania Secondary School    │
│  Distance: 75 meters ✅             │
│                                     │
│  Current Time: 7:45 AM              │
│  Status: On Time ✅                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     CHECK IN NOW            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠️ Make sure you are within       │
│     150 meters of school            │
│                                     │
└─────────────────────────────────────┘
```

### API Integration

**Endpoint:** `POST /api/attendance/checkin`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "latitude": -6.7924,
  "longitude": 39.2083
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": 1,
    "teacherId": 3,
    "date": "2026-05-11",
    "timeIn": "2026-05-11T07:45:00.000Z",
    "latitude": -6.7924,
    "longitude": 39.2083,
    "status": "PRESENT",
    "createdAt": "2026-05-11T07:45:00.000Z"
  }
}
```

**Error Responses:**

**Already Checked In (409):**
```json
{
  "success": false,
  "message": "You have already checked in today at 07:45 AM"
}
```

**Outside School Radius (400):**
```json
{
  "success": false,
  "message": "You are not within school premises. Distance: 250 meters (max: 150 meters)"
}
```

**Holiday (400):**
```json
{
  "success": false,
  "message": "Today is a holiday: Independence Day"
}
```

### Frontend Logic

1. **On Page Load:**
   - Request GPS permission
   - Get current location using `navigator.geolocation.getCurrentPosition()`
   - Display location on map (optional)
   - Show coordinates
   - Calculate distance to school (optional, backend does this)
   - Show current time

2. **GPS Permission:**
   ```javascript
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         const lat = position.coords.latitude;
         const lon = position.coords.longitude;
         setLocation({ lat, lon });
       },
       (error) => {
         showError("Please enable location services");
       }
     );
   }
   ```

3. **On Check In Button Click:**
   - Show loading spinner
   - Call API with coordinates
   - If success:
     * Show success message with confetti animation
     * Display check-in details (time, status)
     * Redirect to dashboard after 2 seconds
   - If error:
     * Show error message
     * If outside radius: Show distance and direction to school
     * If already checked in: Show previous check-in time

4. **Status Indicators:**
   - Within radius: Green ✅
   - Outside radius: Red ❌
   - On time: Green ✅
   - Late: Yellow ⚠️

---

## 🗂️ Project Structure

```
fyp_frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   ├── auth.api.ts           # Auth API calls
│   │   ├── attendance.api.ts     # Attendance API calls
│   │   ├── timetable.api.ts      # Timetable API calls
│   │   └── lessons.api.ts        # Lessons API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── dashboard/
│   │       ├── StatsCard.tsx
│   │       ├── TimetableCard.tsx
│   │       └── AttendanceStatus.tsx
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── hooks/
│   │   ├── useAuth.ts            # Auth hook
│   │   └── useApi.ts             # API hook
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   └── TeacherDashboard.tsx
│   │   └── attendance/
│   │       └── CheckInPage.tsx
│   ├── routes/
│   │   ├── index.tsx             # Route definitions
│   │   └── ProtectedRoute.tsx    # Protected route wrapper
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── attendance.types.ts
│   │   └── timetable.types.ts
│   ├── utils/
│   │   ├── storage.ts            # localStorage helpers
│   │   └── formatters.ts         # Date/time formatters
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🎨 Design System

### Colors
```css
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Yellow)
Error: #EF4444 (Red)
Background: #F9FAFB (Light Gray)
Text: #111827 (Dark Gray)
```

### Typography
```css
Heading: font-bold text-2xl
Subheading: font-semibold text-lg
Body: font-normal text-base
Small: font-normal text-sm
```

### Spacing
```css
Card padding: p-6
Button padding: px-6 py-3
Input padding: px-4 py-2
Gap between elements: gap-4
```

---

## 🔐 Authentication Flow

```
1. User opens app
   ↓
2. Check if token exists in localStorage
   ↓
3. If token exists:
   - Verify token by calling /api/auth/me
   - If valid: Redirect to dashboard
   - If invalid: Clear storage, show login
   ↓
4. If no token:
   - Show login page
   ↓
5. User logs in:
   - Store token and user
   - Update AuthContext
   - Redirect to dashboard
   ↓
6. On every API call:
   - Include token in Authorization header
   - If 401 error: Logout and redirect to login
```

---

## 📦 Required npm Packages

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## ✅ Acceptance Criteria

### Login Page
- ✅ Email and password fields with validation
- ✅ Show loading state during login
- ✅ Show error messages for invalid credentials
- ✅ Store token and user on success
- ✅ Redirect to dashboard after login
- ✅ Mobile responsive

### Teacher Dashboard
- ✅ Display user name and greeting
- ✅ Show today's attendance status
- ✅ Show today's timetable
- ✅ Show lesson completion status
- ✅ Show notification count
- ✅ Quick check-in button if not checked in
- ✅ Mobile responsive

### Check-in Page
- ✅ Request GPS permission
- ✅ Display current location
- ✅ Show distance to school
- ✅ Show current time and expected status
- ✅ Check-in button calls API
- ✅ Show success/error messages
- ✅ Redirect to dashboard after success
- ✅ Handle all error cases
- ✅ Mobile responsive

---

## 🧪 Test Credentials

Use the seeded Tanzania data:

```
Teacher:
Email: juma.mwinyimkuu@azania.tz
Password: Teacher@2025

Principal:
Email: principal@azania.tz
Password: Principal@2025

Admin:
Email: admin@edutrack.tz
Password: Admin@2025
```

---

## 🚀 API Base URL

```
Development: http://localhost:3000/api
Production: https://api.edutrack.tz/api
```
