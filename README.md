# 🚢 Ship Maintenance Dashboard – ENTNT Frontend Developer Assignment

Welcome! This is a **fully frontend React application** built as part of the technical task for ENTNT’s Frontend Developer role. It simulates an internal system for managing ships, their components, and associated maintenance jobs — all without any backend. The app uses `localStorage` to persist data and includes role-based access for different user types.

> 🔗 **Live Demo:** [https://entnt-ship-guardian-dashboard.vercel.app/](https://entnt-ship-guardian-dashboard.vercel.app/)

---

## ⚙️ Tech Stack

- **React** with functional components and hooks  
- **React Router** for navigation  
- **Context API** for global state management  
- **TailwindCSS / Material UI** for styling  
- **localStorage** for simulating backend data persistence  

---

## 👥 User Roles

The app includes three hardcoded user roles, each with different permissions:

| Role       | Email                | Password     |
|------------|----------------------|--------------|
| Admin      | `admin@entnt.in`     | `admin123`   |
| Inspector  | `inspector@entnt.in` | `inspect123` |
| Engineer   | `engineer@entnt.in`  | `engine123`  |

---

## 🌟 Key Features

### 🔐 Simulated Authentication
- Role-based login system
- Sessions persist using `localStorage`

### 🚢 Ship Management
- Add, edit, delete, and view detailed info of ships
- View ship profiles with components and maintenance history

### ⚙️ Component Management
- Add/edit/delete components linked to ships
- Track installation and last maintenance dates

### 🧰 Maintenance Jobs
- Create jobs with type, priority, and assigned engineer
- Filter by ship, status, or priority
- Update job status from open → in progress → completed

### 📅 Calendar View
- Interactive monthly/weekly view of scheduled jobs
- Clicking a date shows jobs for that day

### 🔔 Notification Center
- Real-time in-app notifications for job events
- Dismissible for cleaner UX

### 📊 Dashboard KPIs
- Visual overview of:
  - Total Ships
  - Overdue Maintenance
  - Jobs in Progress
  - Completed Jobs

### 📱 Fully Responsive
- Optimized for desktop, tablet, and mobile screens

---

## 🧩 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Authentication/
│   ├── Dashboard/
│   ├── Ships/
│   ├── Components/
│   ├── Jobs/
│   ├── Notifications/
├── contexts/           # Context Providers for global state
├── pages/              # Page-level views
├── utils/              # Utility functions (localStorage, roles, etc.)
├── styles/             # Global styles
├── App.jsx             # Main app file
└── index.js            # Entry point
```

---

## 🚀 Getting Started

To run this project locally:

```bash
git clone https://github.com/yourusername/ship-maintenance-dashboard.git
cd ship-maintenance-dashboard
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## ⚠️ Known Limitations

- No backend or API – all data is stored in `localStorage`
- If browser storage is cleared, data will be lost
- Roles are hardcoded; no role management UI included

---

## 💡 Why I Built It This Way

- **React + Hooks:** For modern, clean component structure
- **Context API:** Simpler global state sharing
- **TailwindCSS:** For rapid styling and consistent UI
- **LocalStorage:** As a backend replacement (per assignment rules)
- **Form validation:** To ensure clean user input and feedback
- **Modular Structure:** For scalability and easy code maintenance

---

## 🌈 Bonus Features

- [x] Responsive calendar with job scheduling
- [x] In-app notifications for job events
- [x] KPI dashboard with stats
- [ ] Dark mode (planned for future enhancement)

---

## 📬 Contact

**Name:** Yogesh Shrivas  
**Email:** yogeshshrivas7566@gmail.com  
**Live Demo:** [entnt-ship-guardian-dashboard.vercel.app](https://entnt-ship-guardian-dashboard.vercel.app)

---

> 🛠 This project was built as a part of the ENTNT Frontend Developer technical assignment. No external APIs or databases were used — all data handling is done on the frontend using `localStorage`.

