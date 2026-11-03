# 🎓 Smart Campus Platform

> A modern, full-stack web application that digitizes and centralizes campus life — from event ticketing and club management to auditorium booking and AI-powered promotions.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 📌 Overview

**Smart Campus Platform** replaces traditional notice boards, paperwork, and manual event management with a smart digital ecosystem built for NIE (The National Institute of Engineering).

Students, club admins, and faculty get a unified platform that improves engagement, transparency, and administrative efficiency — all in one place.

---

## ✨ Features

### 🎟️ Event Ticketing System
- Browse and register for campus events with a single click
- Instantly receive a **digital QR code ticket** for fast, secure event check-in
- Real-time registration status and capacity tracking

### 🏛️ Auditorium Booking Management
- Clubs can submit digital auditorium booking requests (no paperwork!)
- Faculty/Admins can **approve or reject** requests from their dashboard
- View availability by date and time slot

### 🏅 Gamification & Leaderboard
- Students earn **points** for joining clubs and attending events
- Live **campus leaderboard** showcasing top participants
- Encourages active participation and healthy competition

### 🤖 AI-Powered Promotion Tool
- Club admins can auto-generate promotional content for **WhatsApp and Instagram**
- AI crafts event descriptions, captions, and announcements instantly
- Increases event reach and student engagement

### 👥 Club Management
- Browse all campus clubs with details, members, and upcoming events
- Apply to join clubs; admins approve/reject applications
- Club-specific dashboards with open positions and member roles

### 🔐 Role-Based Access Control
- **Student** — Browse events, register, join clubs, earn points
- **Club Admin** — Manage club events, members, bookings, AI promotions
- **Faculty/Admin** — Approve bookings, manage platform-wide settings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js v5 |
| **Database** | SQLite (via Prisma ORM) |
| **Auth** | JWT (JSON Web Tokens) |
| **QR Codes** | `react-qr-code` |
| **File Upload** | Multer |
| **Email** | Nodemailer |
| **PDF Parsing** | pdf-parse |

---

## 📁 Project Structure

```
smartcampus-main/
├── backend/
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # Auth & validation middleware
│   ├── routes/            # Express API routes
│   ├── services/          # Business logic & AI service
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── index.js           # Express app entry point
│   ├── seed.js            # Database seed script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── components/    # Reusable UI components
│   │   └── ...
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/AmruthaSuresh12/smartcampus.git
cd smartcampus
```

### 2. Setup Backend
```bash
cd backend
npm install

# Copy the example env file and fill in your values
cp .env.example .env

# Run Prisma migrations and seed the database
npx prisma migrate dev
node seed.js
node seed_nie_real.js

# Start the backend server
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Copy the example env file and update API URL if needed
cp .env.example .env

# Start the frontend dev server
npm run dev
```

The app will be available at **http://localhost:5173** (frontend) and **http://localhost:5005** (backend API).

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5005
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5005
```

---

## 🗃️ Database Schema (Key Models)

| Model | Description |
|-------|------------|
| `User` | Students, club admins, faculty with roles and points |
| `Club` | Campus clubs with members, events, and open positions |
| `ClubMember` | User-club membership with approval status |
| `Event` | Club events with capacity, posters, and registrations |
| `EventRegistration` | Ticket registrations with QR data and attendance tracking |
| `Auditorium` | Bookable campus venues |
| `Booking` | Auditorium booking requests with approval status |
| `OpenPosition` | Open roles within clubs for recruitment |
| `Resume` | Parsed tech tags from uploaded student resumes |

---

## 🎨 Design Highlights

- **Glassmorphism UI** — modern frosted glass aesthetic built with Tailwind CSS
- **Framer Motion animations** — smooth, professional transitions throughout
- **Fully responsive** — works on desktop and mobile
- **Premium UX** — role-specific dashboards tailored for each user type

---

## 🔮 Future Improvements

- [ ] ☁️ Cloud deployment (Vercel + Railway)
- [ ] 🔔 Real-time notifications (WebSockets)
- [ ] 📱 Mobile app (React Native)
- [ ] 📊 Attendance analytics dashboard
- [ ] 💳 Payment gateway for paid events
- [ ] 🧠 Advanced AI features (personalized recommendations)
- [ ] 🌐 Multi-campus support

---

## 👩‍💻 Team

Built as a **5th Semester Minor Project** at **The National Institute of Engineering (NIE), Mysore**.

---

## 📄 License

This project is for academic purposes. All rights reserved.
