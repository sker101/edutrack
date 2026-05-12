# 🚀 EduTrack Backend - Testing Credentials

## 🔗 Backend URL (ngrok)
```
https://6ae3-41-59-224-62.ngrok-free.app
```

## 📍 API Base URL
```
https://6ae3-41-59-224-62.ngrok-free.app/api
```

---

## 🏫 MLIMANI SECONDARY SCHOOL (Complete Test Data)

### 🔐 Login Credentials

#### **Super Admin**
```json
{
  "email": "admin@mlimani.tz",
  "password": "Admin@2025",
  "role": "ADMIN",
  "status": "ACTIVE"
}
```

#### **Principal**
```json
{
  "email": "principal@mlimani.tz",
  "password": "Principal@2025",
  "role": "PRINCIPAL",
  "status": "ACTIVE"
}
```

#### **Teachers (All ACTIVE & APPROVED)**
All teachers use password: `Teacher@2025`

1. **John Kamara** - Mathematics
   - Email: `john.kamara@mlimani.tz`
   - Subject: Mathematics

2. **Grace Mushi** - English
   - Email: `grace.mushi@mlimani.tz`
   - Subject: English

3. **Peter Ndege** - Physics
   - Email: `peter.ndege@mlimani.tz`
   - Subject: Physics

4. **Sarah Komba** - Chemistry
   - Email: `sarah.komba@mlimani.tz`
   - Subject: Chemistry

5. **David Mwita** - Biology
   - Email: `david.mwita@mlimani.tz`
   - Subject: Biology

6. **Mary Njau** - History
   - Email: `mary.njau@mlimani.tz`
   - Subject: History

7. **James Kondo** - Geography
   - Email: `james.kondo@mlimani.tz`
   - Subject: Geography

8. **Elizabeth Mlay** - Kiswahili
   - Email: `elizabeth.mlay@mlimani.tz`
   - Subject: Kiswahili

9. **Robert Msigwa** - Computer Science
   - Email: `robert.msigwa@mlimani.tz`
   - Subject: Computer Science

10. **Anna Mbwana** - Civics
    - Email: `anna.mbwana@mlimani.tz`
    - Subject: Civics

---

## 📊 Test Data Summary

### Mlimani Secondary School
- **Location**: Mlimani City, Dar es Salaam
- **Coordinates**: -6.7924, 39.2083
- **Geofence Radius**: 150 meters
- **Late Cutoff**: 8:00 AM

### Available Test Data
- ✅ **50 Timetable Entries** - Classes scheduled for all teachers
- ✅ **50 Attendance Records** - Last 7 days of attendance
- ✅ **5 Leave Requests** - 3 approved, 2 pending
- ✅ **15 Lessons** - With notes and status
- ✅ **3 Substitutions** - Teachers covering for absent colleagues
- ✅ **14 Public Holidays** - Tanzania 2025 calendar
- ✅ **5 Notifications** - Sample notifications for teachers

---

## 🧪 API Testing Examples

### 1. Login (Teacher)
```bash
POST https://6ae3-41-59-224-62.ngrok-free.app/api/auth/login
Content-Type: application/json

{
  "email": "john.kamara@mlimani.tz",
  "password": "Teacher@2025"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 13,
    "name": "John Kamara",
    "email": "john.kamara@mlimani.tz",
    "role": "TEACHER",
    "schoolId": 3,
    "status": "ACTIVE"
  }
}
```

### 2. Login (Principal)
```bash
POST https://6ae3-41-59-224-62.ngrok-free.app/api/auth/login
Content-Type: application/json

{
  "email": "principal@mlimani.tz",
  "password": "Principal@2025"
}
```

### 3. Login (Admin)
```bash
POST https://6ae3-41-59-224-62.ngrok-free.app/api/auth/login
Content-Type: application/json

{
  "email": "admin@mlimani.tz",
  "password": "Admin@2025"
}
```

### 4. Get My Profile (Authenticated)
```bash
GET https://6ae3-41-59-224-62.ngrok-free.app/api/auth/me
Authorization: Bearer <your_token>
```

### 5. Get Schools List (Public - No Auth)
```bash
GET https://6ae3-41-59-224-62.ngrok-free.app/api/public/schools
```

---

## 🏫 Other Schools (From Previous Seed)

### Azania Secondary School
- **Principal**: `principal@azania.tz` / `Principal@2025`
- **Teachers**: 
  - `juma.mwinyimkuu@azania.tz` / `Teacher@2025`
  - `fatuma.hassan@azania.tz` / `Teacher@2025`
  - `baraka.mtoro@azania.tz` / `Teacher@2025`
  - `neema.kimaro@azania.tz` / `Teacher@2025`
  - `hamisi.juma@azania.tz` / `Teacher@2025`

### Jangwani Secondary School
- **Teachers**:
  - `amina.salum@jangwani.tz` / `Teacher@2025`
  - `rashid.omari@jangwani.tz` / `Teacher@2025`
  - `halima.mwita@jangwani.tz` / `Teacher@2025`
  - `selemani.ally@jangwani.tz` / `Teacher@2025`
  - `zuhura.bakari@jangwani.tz` / `Teacher@2025`

### Super Admin (Cross-School)
- **Email**: `admin@edutrack.tz`
- **Password**: `Admin@2025`

---

## 🎯 Quick Test Scenarios

### Scenario 1: Teacher Login & Dashboard
1. Login with `john.kamara@mlimani.tz`
2. View timetable
3. Check attendance history
4. View notifications

### Scenario 2: Principal Approves Leave
1. Login with `principal@mlimani.tz`
2. View pending leave requests
3. Approve/reject leave requests
4. View school attendance reports

### Scenario 3: Admin Manages System
1. Login with `admin@mlimani.tz`
2. View all schools
3. Manage users
4. View system-wide reports

### Scenario 4: Teacher Requests Leave
1. Login as any teacher
2. Submit leave request
3. Check leave status
4. View leave history

### Scenario 5: Substitute Assignment
1. Login as principal
2. View lessons with substitutions
3. Assign substitute teacher
4. Notify substitute teacher

---

## 📱 Frontend Integration

### Store Token
```javascript
const response = await fetch('https://6ae3-41-59-224-62.ngrok-free.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.kamara@mlimani.tz',
    password: 'Teacher@2025'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  // Redirect to dashboard
}
```

### Make Authenticated Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('https://6ae3-41-59-224-62.ngrok-free.app/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔧 Backend Status

- ✅ **Docker**: Running
- ✅ **Database**: PostgreSQL (seeded)
- ✅ **ngrok**: Exposing port 3000
- ✅ **API**: Ready for testing

### Check Backend Health
```bash
curl https://6ae3-41-59-224-62.ngrok-free.app/api/auth/me
# Should return 401 (Unauthorized) - means API is working
```

---

## 📝 Notes

1. **All Mlimani teachers are ACTIVE** - No approval needed
2. **Password for all users**: Role@2025 (e.g., Teacher@2025, Admin@2025)
3. **Token expires**: Check JWT_SECRET in .env for token validation
4. **Geolocation**: Mlimani School coordinates are set for testing
5. **Holidays**: Tanzania 2025 public holidays are pre-loaded

---

## 🚨 Troubleshooting

### If login fails:
1. Check ngrok URL is still active
2. Verify email/password combination
3. Check user status is ACTIVE
4. Review backend logs: `docker compose logs backend`

### If token is invalid:
1. Token might have expired
2. JWT_SECRET mismatch
3. Re-login to get fresh token

---

## 🎉 Ready to Test!

Your backend is fully configured with:
- 3 Schools
- 1 Super Admin
- 3 Principals (1 per school)
- 20 Teachers (all ACTIVE)
- Complete test data (timetables, attendance, leaves, substitutions)

**Start testing your frontend now!** 🚀
