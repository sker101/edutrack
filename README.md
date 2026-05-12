# EduTrack - Teacher Attendance & Lesson Management System

A comprehensive school management system for tracking teacher attendance, managing timetables, handling leave requests, and monitoring lesson delivery.

## 🚀 How to Clone and Run

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine
- **Git** for cloning the repository

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd edutrack
```

### Step 2: Navigate to Backend

```bash
cd backend
```

### Step 3: Start the Application with Docker

```bash
docker-compose up -d --build
```

This command will:
- Build the backend Docker image
- Start PostgreSQL database
- Start pgAdmin (database management tool)
- Start the backend API server

**Wait about 15-20 seconds** for all services to start properly.

### Step 4: Seed the Database (Optional)

To populate the database with sample data (2 schools, 1 admin, 1 principal, 10 teachers, and holidays):

```bash
docker-compose exec backend pnpm exec tsx seed-tanzania.ts
```

### Step 5: Access the Application

- **API Server**: http://localhost:3000
- **API Health Check**: http://localhost:3000
- **pgAdmin** (Database UI): http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

## 🔐 Default Login Credentials (After Seeding)

| Role      | Email                     | Password       |
|-----------|---------------------------|----------------|
| Admin     | admin@edutrack.tz         | Admin@2025     |
| Principal | principal@azania.tz       | Principal@2025 |
| Teacher   | juma.mwinyimkuu@azania.tz | Teacher@2025   |

## 📚 API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user info

### Schools
- `GET /schools` - List all schools
- `POST /schools` - Create school
- `GET /schools/my` - Get my school

### Timetables
- `GET /timetable` - List timetables
- `POST /timetable` - Create timetable
- `GET /timetable/my` - Get my timetable

### Attendance
- `POST /attendance/checkin` - Check in with GPS
- `GET /attendance` - List attendance records
- `GET /attendance/my` - Get my attendance

### Leave Requests
- `POST /leave` - Apply for leave
- `GET /leave` - List leave requests
- `GET /leave/my` - Get my leave requests
- `PUT /leave/:id/approve` - Approve leave
- `PUT /leave/:id/reject` - Reject leave

### Lessons
- `POST /lessons` - Mark lesson as conducted
- `GET /lessons` - List lessons

### Substitutes
- `POST /substitutes` - Assign substitute teacher
- `GET /substitutes` - List substitutes

### Holidays
- `POST /holidays` - Create holiday
- `GET /holidays` - List holidays

### Notifications
- `GET /notifications` - Get my notifications
- `PUT /notifications/:id/read` - Mark as read

### Reports
- `GET /reports/attendance` - Attendance report
- `GET /reports/lessons` - Lesson report

## 🛠️ Technology Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcrypt
- **Containerization**: Docker & Docker Compose

## 🔧 Useful Commands

### Stop the Application
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
```

### Restart Backend
```bash
docker-compose restart backend
```

### View Database with Prisma Studio
```bash
docker-compose exec backend pnpm exec prisma studio
```

### Reset Database
```bash
docker-compose exec backend pnpm exec prisma migrate reset --force
```

## 📝 Environment Variables

The application uses default environment variables defined in `docker-compose.yml`. For production, create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/edutrack"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

## 🆘 Troubleshooting

### Port Already in Use
If port 3000, 5432, or 5050 is already in use, stop the conflicting service or modify the ports in `docker-compose.yml`.

### Database Connection Issues
Make sure PostgreSQL container is healthy:
```bash
docker-compose ps
```

### Backend Not Starting
Check backend logs:
```bash
docker-compose logs backend
```

## 📄 License

ISC License
