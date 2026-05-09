# Nexora Health – Deployment & Output

## Docker Configuration
- **Client Dockerfile**: Multi-stage build. Uses `node:18-alpine` for the Vite build step, then shifts to `nginx:alpine` to serve static files statically on port 80. A custom `nginx.conf` ensures correct React Router paths.
- **Server Dockerfile**: Basic Node.js environment via `node:18-alpine`. Installs dependencies, copies source codes, and uses `CMD ["npm", "start"]` on port 5000.

## Docker Compose Breakdown
Provides orchestration defining 3 identical services:
1. `client`: Maps `3000:80`
2. `server`: Maps `5000:5000` via `.env` variables
3. `mongo`: Mounts persistent DB volumes to port `27017`

## GitHub Actions Workflow
File: `.github/workflows/ci.yml`
Continuously tests updates pushed to the `main` branch. Evaluates if the latest Node dependencies install smoothly and run builds securely before allowing PR merges.

## Vercel Deployment Steps (Frontend)
1. Link GitHub repository in Vercel.
2. Select the `client` directory.
3. Framework Preset: Vite.
4. Input env variables (e.g., `VITE_API_URL` if not mapped via domain).
5. Click Deploy.

## Render Deployment Steps (Backend)
1. Link GitHub repository in Render Web Services.
2. Select the `server` directory.
3. Node template. Command: `npm install` and `npm start`.
4. Enter Environmental Variables block.
5. Launch and bind URL to frontend.

## Environment Variables
| Key | Usage | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Connection | mongodb+srv://... |
| `JWT_SECRET` | Token Hashing | my_secure_salt_key |
| `PORT` | API Server Port | 5000 |
| `CLIENT_URL` | CORS Mapping | http://localhost:5173 |

## Expected Output Screenshots
*(Placeholders available in `screenshots` directory)*
