# SkillBridge 🎓

**"Connect with Expert Tutors, Learn Anything"**

SkillBridge is a comprehensive full-stack web application designed to bridge the gap between learners and expert tutors. It facilitates seamless browsing of tutor profiles, instant session booking, and effective management of teaching schedules.

---

## 🔗 Important Links

- **🌐 Live Frontend Site URL:** [https://assign-4-l2b6-sb-frontend.vercel.app/](https://assign-4-l2b6-sb-frontend.vercel.app/)
- **🌐 Live Backend Site URL:** [http://assign-4-l2-b6-skill-bridge-backend.vercel.app/](http://assign-4-l2-b6-skill-bridge-backend.vercel.app/)
- **📄 API Documentation:** [View API Endpoints](./api-endpoints.md)
- **📄 Video Demo:** [View Video Demo](https://drive.google.com/file/d/1VxtOKcx3KtuAcC-LaC-ewpPY-6I7DF6G/view?usp=drive_link)

---

## 🔐 Admin Credentials

To access the Admin Dashboard features:

- **Email:** `admin@skillbridge.com`
- **Password:** `admin123`


---

## ✨ Key Features

### 🌍 Public
- **Tutor Discovery:** Browse and search tutors by subject, rating, and price.
- **Detailed Profiles:** View comprehensive tutor profiles including experience and reviews.
- **Landing Page:** Engaging homepage showcasing featured tutors.

### 👨‍🎓 Student
- **Session Management:** Book, view, and manage tutoring sessions.
- **Feedback:** Leave reviews and ratings for tutors.
- **Personalized Dashboard:** Track bookings and history.

### 👨‍🏫 Tutor
- **Profile Management:** Create and update professional profiles.
- **Availability Control:** Set and manage specific time slots for teaching.
- **Session Tracking:** Monitor upcoming and completed sessions.

### 🛡️ Admin
- **User Management:** Oversee all student and tutor accounts (ban/unban).
- **Content Moderation:** Manage categories and oversee booking activities.
- **Analytics:** View platform statistics and booking overviews.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Better-Auth
- **Deployment:** Vercel

---

## 🚀 Getting Started


1. **Clone the repository:**
   ```bash
   git clone https://github.com/Murad07/assign_4_L2B6_skillBridge_backend.git
   cd assign_4_L2B6_skillBridge_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
   BETTER_AUTH_SECRET="your-secret"
   BETTER_AUTH_URL="http://localhost:5000"
   FRONTEND_URL="http://localhost:3000"
   ADMIN_EMAIL="admin@skillbridge.com"
   ADMIN_PASSWORD="admin123"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed Admin User:**
   ```bash
   npm run seed:admin
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Build for production:**
   ```bash
   npm run build
   ```
Test changes