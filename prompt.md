Build a complete, production-ready, academic-submission-ready MERN Stack Full Stack Application titled:

"Nexora Health – AI Powered Health Tracker & Wellness Monitoring System"

DO NOT ask any questions. Auto-generate everything, auto-fix all errors, auto-install all dependencies, and ensure the app runs successfully at the end.

==================================================
BRANDING — USE THROUGHOUT THE ENTIRE APP
==================================================

App Name: Nexora Health
Tagline: "Track. Analyze. Thrive."
Brand Colors:
  Primary Background: #0a0f1e (deep space navy)
  Accent 1: #00d4ff (electric cyan)
  Accent 2: #00ff9d (neon mint/green)
  Card bg: rgba(255,255,255,0.04) with backdrop-blur
  Text: #f0f4ff (near white)
Logo: Text-based — "Nexora" in bold with "Health" in accent cyan color
Favicon: Generate a simple heart-pulse SVG favicon

==================================================
TECH STACK — USE EXACTLY THESE
==================================================

Frontend:
- React.js 18+ with Vite (NOT Create React App)
- Redux Toolkit + RTK Query
- React Router DOM v6
- Tailwind CSS v3
- Recharts for data visualization
- vite-plugin-pwa for PWA support
- react-hot-toast for notifications
- axios for API calls
- react-hook-form for forms

Backend:
- Node.js + Express.js
- MongoDB Atlas + Mongoose ODM
- JWT (jsonwebtoken) + bcryptjs
- helmet, cors, express-rate-limit
- express-validator for input validation
- dotenv for environment variables

DevOps:
- Dockerfile (frontend)
- Dockerfile (backend)
- docker-compose.yml
- GitHub Actions CI/CD (.github/workflows/ci.yml)

==================================================
FOLDER STRUCTURE — GENERATE EXACTLY THIS
==================================================

nexora-health/
├── client/
│   ├── public/
│   │   ├── icons/
│   │   │   ├── icon-192x192.png      (generate solid #00d4ff square PNG)
│   │   │   └── icon-512x512.png      (generate solid #00d4ff square PNG)
│   │   └── favicon.svg               (heart-pulse icon in #00d4ff)
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSkeleton.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── HealthCard.jsx
│   │   │   │   ├── BMIChart.jsx
│   │   │   │   ├── CalorieChart.jsx
│   │   │   │   ├── WaterProgress.jsx
│   │   │   │   └── SleepChart.jsx
│   │   │   └── forms/
│   │   │       ├── LoginForm.jsx
│   │   │       ├── RegisterForm.jsx
│   │   │       ├── HealthEntryForm.jsx
│   │   │       └── GoalForm.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── health/
│   │   │   ├── goals/
│   │   │   └── ai/
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useHealth.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HealthTracker.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── healthController.js
│   │   ├── goalController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HealthRecord.js
│   │   ├── Exercise.js
│   │   ├── Goal.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
│
├── docs/
│   ├── problem-statement.md
│   ├── frontend-implementation.md
│   ├── backend-development.md
│   ├── database-integration.md
│   ├── deployment-output.md
│   ├── conclusion.md
│   └── course-outcomes.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── README.md
└── screenshots/
    └── .gitkeep

==================================================
MONGODB MODELS — FULL IMPLEMENTATION
==================================================

User model fields: name, email, password (hashed), role (user/admin), age, gender, height, weight, profilePicture, createdAt, updatedAt

HealthRecord model fields: userId (ref: User), date, weight, calories, waterIntake (glasses), sleepHours, mood (1-5), notes, createdAt

Exercise model fields: userId (ref: User), date, type (cardio/strength/yoga/other), name, duration (minutes), caloriesBurned, intensity (low/medium/high), notes

Goal model fields: userId (ref: User), type (weight/calories/water/sleep/exercise), targetValue, currentValue, unit, deadline, isAchieved, createdAt

Notification model fields: userId (ref: User), message, type (info/warning/success), isRead, createdAt

All models must use: mongoose.Schema, timestamps: true, proper validation, ref-based population.

==================================================
REST API ENDPOINTS — IMPLEMENT ALL
==================================================

Auth Routes (/api/auth):
POST /register
POST /login
POST /logout
GET  /me

Health Routes (/api/health) [protected]:
GET    /
POST   /
PUT    /:id
DELETE /:id
GET    /stats/weekly
GET    /stats/monthly

Goal Routes (/api/goals) [protected]:
GET    /
POST   /
PUT    /:id
DELETE /:id

User Routes (/api/users) [protected]:
GET    /profile
PUT    /profile

Admin Routes (/api/admin) [admin only]:
GET    /users
DELETE /users/:id
GET    /stats

AI Route (/api/ai) [protected]:
POST   /suggestions

For the AI endpoint: Use OpenAI API if OPENAI_API_KEY is valid. If the key is missing or dummy, return realistic mock AI response with 5 personalized wellness tips based on the user's health data in the request body. NEVER crash — always return valid suggestions.

==================================================
FRONTEND PAGES — FULL DETAIL
==================================================

LANDING PAGE:
- Full-screen hero: "Track. Analyze. Thrive." heading with animated health stats counter
- Nexora Health logo top-left
- Floating animated cards showing: Steps, Calories, Heart Rate, Sleep
- Feature section: 6 feature cards (AI Insights, Goal Tracking, Sleep Monitor, Calorie Counter, BMI Tracker, PWA Support)
- Testimonials section (3 fake testimonials)
- CTA section: "Start Your Wellness Journey" with Register/Login buttons
- Dark theme, animated gradient background using brand colors

LOGIN PAGE:
- Nexora Health logo at top
- "Welcome Back" heading
- Email + password fields with react-hook-form validation
- Show/hide password toggle
- "Remember me" checkbox
- Link to Register page
- Error toast on failure
- Animated fade-in card

REGISTER PAGE:
- "Join Nexora Health" heading
- Fields: Full Name, Email, Password, Confirm Password, Age, Gender (dropdown), Height (cm), Weight (kg)
- Form validation with error messages
- Success redirect to Dashboard
- Link to Login page

DASHBOARD:
- Top greeting: "Good Morning, [Name] 👋" with today's date
- 4 summary stat cards: Calories Today, Water Glasses, Sleep Hours, Current BMI
- BMI badge: color-coded (blue=Underweight, green=Normal, yellow=Overweight, red=Obese)
- Calorie trend line chart (last 7 days) — Recharts, dark themed
- Water intake circular progress bar
- Sleep bar chart (last 7 days) — Recharts
- Recent exercises table (last 5)
- AI Suggestions panel: "Nexora AI Insights" section with 3-5 bullet points
- Goal progress cards with progress bars
- All data fetched from backend APIs

HEALTH TRACKER PAGE:
- Two-column layout: left = forms, right = today's log
- Form 1: Daily Health Log (weight, calories, water glasses, sleep hours, mood slider 1-5)
- Form 2: Exercise Log (type dropdown, exercise name, duration, calories burned, intensity)
- Today's Health Entries table: editable, deletable rows
- Animated success state when entry is added

REPORTS PAGE:
- Date range picker (weekly / monthly toggle)
- Summary stats row: avg calories, avg sleep, avg water, total exercise minutes
- 4 charts: BMI Trend (line), Calorie Trend (area), Sleep Quality (bar), Water Intake (bar)
- All charts Recharts dark-themed with brand colors
- Print/Export button

PROFILE PAGE:
- Avatar circle with user initials in brand color
- Display: name, email, joined date
- Edit form: name, age, gender, height, weight
- Stats row: Total Entries, Day Streak, Goals Achieved
- Change Password section (old password, new password, confirm)

ADMIN PANEL (admin role only):
- Platform overview: Total Users, Total Records, Active Today, Goals Created
- Users data table with columns: Name, Email, Role, Joined, Actions
- Search/filter users
- Delete user with confirmation modal
- Stats charts: User growth bar chart

==================================================
DESIGN REQUIREMENTS — CRITICAL, DO NOT SKIP
==================================================

Color scheme:
  --bg-primary: #0a0f1e
  --bg-card: rgba(255, 255, 255, 0.04)
  --accent-cyan: #00d4ff
  --accent-green: #00ff9d
  --text-primary: #f0f4ff
  --text-muted: #8892b0
  --border: rgba(0, 212, 255, 0.15)
  --danger: #ff4757
  --warning: #ffa502

Typography:
  Headings: 'Syne' from Google Fonts (bold, futuristic)
  Body: 'DM Sans' from Google Fonts (clean, readable)
  Import both in index.html

Cards: rounded-2xl, glass-morphism (bg: rgba(255,255,255,0.04), backdrop-blur-md, border: 1px solid rgba(0,212,255,0.15))

Sidebar (desktop):
  - Fixed left sidebar with Nexora Health logo
  - Nav links: Dashboard, Health Tracker, Reports, Profile, Admin (if admin)
  - Active state: cyan left border + cyan text
  - Collapsed to icons on small screens

Animations:
  - Page transitions: fade + slide up on mount
  - Card hover: translateY(-4px) + glow shadow in cyan
  - Skeleton loaders: pulse animation while data loads
  - Number counters animate on Dashboard load
  - Charts animate in on render

Mobile: fully responsive, hamburger menu, stacked layout

IMPORTANT: The app must look like a premium, modern SaaS health dashboard — not a basic student project. Every spacing, color, and font choice must feel intentional and polished.

==================================================
PWA REQUIREMENTS — MUST WORK WITHOUT ERRORS
==================================================

In vite.config.js configure vite-plugin-pwa:

registerType: 'autoUpdate'
includeAssets: ['favicon.svg', 'icons/*.png']

manifest:
  name: 'Nexora Health'
  short_name: 'Nexora'
  description: 'AI Powered Health Tracker & Wellness Monitoring System'
  theme_color: '#0a0f1e'
  background_color: '#0a0f1e'
  display: 'standalone'
  start_url: '/'
  icons:
    - src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png'
    - src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable'

workbox:
  globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  runtimeCaching:
    - urlPattern: /^https:\/\/.*\/api\/.*/
      handler: NetworkFirst
      options: cacheName: 'api-cache', expiration: maxEntries 50, maxAgeSeconds 300
    - urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/
      handler: CacheFirst
      options: cacheName: 'google-fonts'

Generate actual PNG icon files — solid #00d4ff colored 192x192 and 512x512 PNGs. Do NOT leave icons missing as this will break PWA install. Use node canvas or sharp or write a small script to generate them if needed.

==================================================
SECURITY REQUIREMENTS
==================================================

- helmet() applied to all Express routes
- cors({ origin: process.env.CLIENT_URL, credentials: true })
- express-rate-limit: 100 req/15min on all routes, 10 req/15min on /api/auth
- bcryptjs salt rounds: 12
- JWT expiry: 7d
- express-validator on all POST/PUT routes
- All secrets in .env — never hardcoded
- isAdmin middleware protecting all /api/admin routes
- HTTP-only cookies for JWT storage

==================================================
DOCKER & CI/CD
==================================================

client/Dockerfile:
  Stage 1: node:18-alpine — install deps, build Vite app
  Stage 2: nginx:alpine — serve /dist on port 80
  Include nginx.conf for React Router (try_files fallback)

server/Dockerfile:
  node:18-alpine, WORKDIR /app, copy package.json, npm install, copy source, expose 5000, CMD node server.js

docker-compose.yml:
  Services:
    client: build ./client, port 3000:80, depends_on server
    server: build ./server, port 5000:5000, env_file .env, depends_on mongo
    mongo: image mongo:6, port 27017:27017, volume mongo_data

.github/workflows/ci.yml:
  Trigger: push to main, pull_request to main
  Jobs:
    build-frontend: checkout, node 18, npm ci, npm run build
    build-backend: checkout, node 18, npm ci, node -e "console.log('Backend OK')"
    deploy-note: echo deployment steps for Vercel (frontend) and Render (backend)

==================================================
DOCUMENTATION — GENERATE ALL 7 FILES
==================================================

docs/problem-statement.md:
  Title: Nexora Health – Problem Statement
  Sections: Project Title, Abstract, Problem Being Solved, Proposed Solution, Scope, Expected Outcomes, Target Users

docs/frontend-implementation.md:
  Title: Nexora Health – Frontend Implementation
  Sections: Tech Stack, Component Architecture diagram (text), Page descriptions, Redux state structure, PWA setup, Responsive design approach
  Map to: CO1 (responsive frontend), CO4 (PWA)

docs/backend-development.md:
  Title: Nexora Health – Backend Development
  Sections: Express setup, MVC structure, All API routes table, Middleware list, Error handling, Security implementations
  Map to: CO2

docs/database-integration.md:
  Title: Nexora Health – Database Integration
  Sections: MongoDB Atlas setup, All 5 schema definitions with field tables, Relationships diagram (text), Validation rules, Seed data description
  Map to: CO2

docs/deployment-output.md:
  Title: Nexora Health – Deployment & Output
  Sections: Docker configuration, docker-compose breakdown, GitHub Actions workflow, Vercel deployment steps, Render deployment steps, Environment variables table, Expected output screenshots (placeholder note)
  Map to: CO3

docs/conclusion.md:
  Title: Nexora Health – Conclusion
  Sections: Project Summary, Learning Outcomes, Challenges & Solutions, Future Enhancements (AI meal plans, wearable sync, React Native app)
  All 5 COs addressed individually

docs/course-outcomes.md:
  Title: Nexora Health – Course Outcomes Mapping
  Format: Table with columns: CO Number | Description | How Nexora Health Satisfies It | Files/Features
  All 5 COs mapped in detail

==================================================
README.md
==================================================

Generate a polished README with:
- "# 🏥 Nexora Health" as H1
- Tagline: "Track. Analyze. Thrive."
- Shields.io badges: React, Node.js, MongoDB, Express, TailwindCSS, Docker, Vite, JWT, License MIT
- Features list with emojis
- Screenshots section (placeholder)
- Local setup instructions
- Docker setup instructions
- API endpoints table
- Environment variables table
- Deployment section (Vercel + Render)
- Seeded test credentials
- MIT License footer

==================================================
SEED DATA — server/seed/seedData.js
==================================================

Create 2 users:
  Admin: { name: "Nexora Admin", email: "admin@nexora.com", password: "Admin@123", role: "admin" }
  User:  { name: "Arjun Sharma", email: "arjun@nexora.com", password: "User@123", role: "user" }

For Arjun Sharma, generate:
  - 14 health records (last 14 days): realistic calories 1800-2500, water 6-10 glasses, sleep 5-9 hours, weight around 72kg ± 1
  - 7 exercises: mix of cardio (running, cycling), strength (weights), yoga
  - 4 goals: lose weight to 68kg, drink 8 glasses/day, sleep 8 hours, burn 500 cal/day
  - 3 notifications: welcome message, goal reminder, weekly summary

Add "seed" script to server/package.json: "seed": "node seed/seedData.js"

==================================================
FINAL STEPS — AFTER GENERATING ALL CODE
==================================================

1. cd server && npm install
2. cd client && npm install
3. Auto-fix any dependency or import errors
4. Verify backend starts: node server.js → "Nexora Health Server running on port 5000" + "MongoDB connected"
5. Verify frontend starts: npm run dev → opens on http://localhost:5173 with zero console errors
6. Verify PWA manifest loads in browser DevTools → Application tab → no errors
7. Run: node seed/seedData.js → confirm seed success message
8. Confirm all API routes return valid JSON via built-in API tester
9. git init && git add . && git commit -m "feat: Nexora Health – initial production-ready release"
10. Print success summary:
    ✅ Frontend: http://localhost:5173
    ✅ Backend:  http://localhost:5000
    ✅ Admin login: admin@nexora.com / Admin@123
    ✅ User login:  arjun@nexora.com / User@123
    ✅ All APIs verified
    ✅ PWA working
    ✅ Git committed

The final app must be visually stunning, fully functional, completely error-free, and ready for academic viva and semester submission under the name "Nexora Health".