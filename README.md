# 🏥 Nexora Health
> "Track. Analyze. Thrive."

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

## Features
- 🚀 Modern React PWA with Redux Toolkit
- 🤖 AI Insights & Suggestions powered by OpenAI
- 📊 Interactive Health Charts (Recharts)
- 💧 Advanced Metrics (Sleep, Water, BMI)
- 🔒 Secure JWT Auth, Helmet, Rate Limiting
- 🐳 Full Dockerization
- 🎨 Stunning Glassmorphism UI (Tailwind CSS)

## Screenshots
[Placeholder for screenshots - check `/screenshots` folder]

## Local Setup
1. Clone the repo and `cd nexora-health`
2. Create `.env` files in `server/` (use `.env.example`)
3. Install modules:
   - `cd server && npm install`
   - `cd ../client && npm install`
4. Seed data:
   - `cd server && npm run seed`
5. Start servers:
   - `cd server && npm run dev`
   - `cd client && npm run dev`

## Docker Setup
Ensure Docker Desktop is running.
Run `docker-compose up --build`
App available at `http://localhost:3000`

## API Endpoints
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register |
| `/api/auth/login` | POST | Public | Login |
| `/api/health` | GET/POST | Protected | Manage health logs |
| `/api/goals` | GET/POST | Protected | Manage goals |
| `/api/ai/suggestions` | POST | Protected | Get AI tips |
| `/api/admin/users` | GET | Admin | View all users |

## Environment Variables
See `.env.example` for details. Need `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.

## Deployment
- **Frontend**: Deploy on Vercel using Vite template preset
- **Backend**: Deploy on Render connected to MongoDB Atlas

## Seeded Test Credentials
- Admin: `admin@nexora.com` / `Admin@123`
- User: `arjun@nexora.com` / `User@123`

---
Released under the [MIT License](LICENSE).
