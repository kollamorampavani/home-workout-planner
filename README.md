# 🏋️ FitVibe: Home Workout Planner
A premium, fully responsive fitness management dashboard built using React.js, TypeScript, and Node.js with a Supabase PostgreSQL backend.

This project demonstrates frontend–backend integration, complex state management, data visualization with charts, and a high-end glassmorphism design system.

🚀 **Live Demo**
- **Frontend (Netlify):** [https://effervescent-moonbeam-e557d6.netlify.app/](https://effervescent-moonbeam-e557d6.netlify.app/)

✨ **Features**
- **Personalized Onboarding:** Users set their name, fitness goals (Strength, Fat Loss, Flexibility), and available workout time.
- **Dynamic Dashboard:** Greeting changes based on time of day, showcasing user stats like Community Points, Global Rank, and Mission of the Day.
- **Workout Management:** Browse and enroll in curated workout routines. Track exercises, duration, and calories burned.
- **Progress Tracking:** Interactive charts (using Recharts) visualize weekly calorie burn and muscle group focus distribution.
- **Community & Gamification:** Join community challenges, earn points, and climb the leaderboard with other athletes.
- **Activity Feed:** Real-time feedback for community activities like challenge completions and new personal records.
- **Premium UI/UX:** Stunning Dark Mode interface with Glassmorphism effects, smooth animations (Framer Motion), and responsive layout for all devices.

🛠️ **Tech Stack**
- **Frontend:**
  - React.js (Hooks, Context API)
  - TypeScript
  - Tailwind CSS / Custom Utility-based CSS
  - Lucide React (Icons)
  - Recharts (Data Visualization)
  - Framer Motion (Animations)
  - Vite (Build Tool)

- **Backend:**
  - Node.js
  - Express.js
  - Supabase (PostgreSQL Database)
  - Authentication (JWT-based)

🏗️ **Folder Structure**

**🖥️ Frontend**
```
home-workout-planner/
│
├── src/
│   ├── api/          # Axios configuration and API instances
│   ├── components/   # Reusable UI components
│   ├── data/         # Static workout and exercise data
│   ├── layouts/      # MainLayout with Sidebar and Header
│   ├── pages/        # Dashboard, Workouts, Tracker, Community, etc.
│   ├── store/        # Zustand state management (Auth/Stats)
│   ├── App.tsx       # Main routing and provider setup
│   ├── index.css     # Global styles and design system tokens
│   └── main.tsx      # Application entry point
│
├── public/           # Static assets
└── vite.config.ts    # Vite configuration
```

**⚙️ Backend**
```
backend/
│
├── config/           # Database and env configuration
├── routes/           # API routes (Auth, Workouts, Meals)
├── scripts/          # Migration and diagnosis tools
└── app.js            # Express server entry point
```

🧩 **Component Overview**
- **MainLayout.tsx:** Handles the persistent sidebar navigation and mobile-responsive header.
- **Dashboard.tsx:** The primary user hub displaying progress stats and the daily mission.
- **Workouts.tsx:** Searchable library of routines with enrollment functionality.
- **Tracker.tsx:** Visual representation of user data using Area and Bar charts.
- **Community.tsx:** Manages challenges, leaderboards, and the social activity feed.
- **Onboarding.tsx:** Initial user setup flow for personalizing the workout experience.

💾 **Data Handling**
- **Database:** Powered by **Supabase (PostgreSQL)**, ensuring persistent storage for user profiles, workout history, and enrolled routines.
- **State Management:** Uses **Zustand** with persistence to manage authentication tokens and user session data across browser reloads.
- **Hybrid Support:** The project is backend-ready; it communicates with a live Node.js server but is designed to handle local state gracefully during initial loads.

🧠 **Key Concepts Explored**
- Component-based architecture with TypeScript for type safety.
- Advanced CSS techniques: Glassmorphism, CSS Variables, and Flex/Grid layouts.
- RESTful API integration with Express and Axios.
- Relational database schema design for complex user-workout relationships.
- Client-side data visualization and responsive design.

🧩 **Running Locally**

**Frontend**
```bash
# Clone the repository
git clone https://github.com/kollamorampavani/home-workout-planner.git
cd home-workout-planner

# Install dependencies
npm install

# Start the development server
npm run dev
# Access at http://localhost:5173
```

**Backend**
```bash
cd backend

# Install dependencies
npm install

# Run the server
node app.js
# Backend runs on http://localhost:5000
```

🌍 **Deployment**
- **Frontend:** Hosted on **Netlify** — [https://effervescent-moonbeam-e557d6.netlify.app/](https://effervescent-moonbeam-e557d6.netlify.app/)

- **Database:** Managed by **Supabase**.

📈 **Design Highlights**
- **Role-Based Experience:** Personalized UI based on user fitness goals and levels.
- **Interactive Feedback:** Uses `react-hot-toast` and micro-animations to confirm user actions.
- **Modular Design:** Highly reusable components ensure the codebase remains scalable and clean.

💡 **Future Enhancements**
- Implement real-time notifications with WebSockets (Socket.io).
- Add AI-based workout recommendations based on user fatigue levels.
- Direct Google Calendar integration for scheduling workouts.
- Social features like "Follow Friend" and private messaging.

👩‍💻 **Author**
**Kollamoram Pavani**
📧 Email: [kollamorampavani123@gmail.com](mailto:kollamorampavani123@gmail.com)
🌐 GitHub: [https://github.com/kollamorampavani](https://github.com/kollamorampavani)

⭐ This project was built to showcase full-stack development skills, focusing on high-end UI/UX, robust backend logic, and complex data handling.
