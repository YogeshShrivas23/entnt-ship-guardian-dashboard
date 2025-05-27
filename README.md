# 🚢 Ship Maintenance Dashboard – ENTNT Technical Assignment

This is a **frontend-only Ship Maintenance Dashboard** developed as part of ENTNT's Frontend Developer assignment. The application enables Admins, Inspectors, and Engineers to manage ships, their components, and associated maintenance jobs, using only React and `localStorage`—no backend or external APIs.

> ✅ **Live Application:** [https://entnt-ship-guardian-dashboard.vercel.app/](https://entnt-ship-guardian-dashboard.vercel.app/)

---

## 📦 Tech Stack

- **Framework:** React (Functional Components)
- **Routing:** React Router
- **State Management:** Context API
- **Styling:** TailwindCSS / Material UI / Custom CSS (as used)
- **Persistence:** `localStorage`

---

## 🔐 User Roles

| Role       | Email                | Password     |
|------------|----------------------|--------------|
| Admin      | `admin@entnt.in`     | `admin123`   |
| Inspector  | `inspector@entnt.in` | `inspect123` |
| Engineer   | `engineer@entnt.in`  | `engine123`  |

---

## 🧩 Features Overview

### ✅ Authentication
- Simulated login system with role-based access
- Session persistence using `localStorage`

### 🚢 Ships Management
- Add, edit, view, and delete ships
- Detailed ship profile with general info, maintenance history, and components list

### 🧱 Components Management
- Link components to ships
- Edit, delete, and view component details

### 🔧 Maintenance Jobs
- Create jobs with type, priority, and assigned engineer
- Filter jobs by ship, status, and priority
- Track job progress (status updates)

### 📅 Maintenance Calendar
- Monthly and weekly calendar view of scheduled jobs
- Click a date to view jobs scheduled on that day

### 🔔 Notification Center
- In-app notifications for job creation, updates, and completion
- Dismissible notifications

### 📊 KPIs Dashboard
- Overview cards with key metrics:
  - Total Ships
  - Overdue Maintenance
  - Jobs In Progress
  - Completed Jobs

### 📱 Responsive Design
- Fully responsive on mobile, tablet, and desktop devices

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Authentication/
│   ├── Dashboard/
│   ├── Ships/
│   ├── Components/
│   ├── Jobs/
│   ├── Notifications/
├── contexts/
├── pages/
├── utils/
├── styles/
├── App.jsx
└── index.js
```

---

## ⚙️ Setup & Installation

To run this project locally:

```bash
git clone https://github.com/yourusername/ship-maintenance-dashboard.git
cd ship-maintenance-dashboard
npm install
npm start
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Known Limitations

- No backend integration (as per assignment guidelines)
- All data is stored in `localStorage`; clearing it will reset the app
- Roles are hardcoded, with no dynamic role creation or editing

---

## 💡 Technical Decisions

- Used **React Functional Components** and **Hooks** for clean structure
- Employed **Context API** for global state management
- Designed UI with **TailwindCSS/Material UI** for fast development and responsiveness
- Implemented **React Router** for intuitive multi-page navigation
- Added **form validation** for improved UX
- Used **modular folder structure** for scalability and clarity

---

## 🎯 Bonus Enhancements

- [x] Fully responsive layout
- [x] Notification center
- [x] Calendar integration
- [ ] Dark mode (can be added as future enhancement)

---

## 📧 Contact

**Name:** Yogesh Shrivas  
**Email:** yogeshshrivas7566@gmail.com  
**Live Link:** [entnt-ship-guardian-dashboard.vercel.app](https://entnt-ship-guardian-dashboard.vercel.app)

---

> 🛠️ This project was developed as part of the ENTNT Frontend Developer Task. No external APIs or backend logic were used. All data interactions are handled entirely on the frontend using `localStorage`.
