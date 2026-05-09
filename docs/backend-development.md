# Nexora Health – Backend Development

## Express Setup
The backend runs on Node.js using Express.js. Bootstrapped with `server.js`, it mounts standard RESTful paths and configures security middleware for robust protection.

## MVC Structure
- **Models**: Defines database schemas (Mongoose).
- **Controllers**: Contains business logic to handle incoming requests and database queries.
- **Routes**: Maps HTTP verb requests to corresponding controller functions.

## API Routes

| Method | Route | Access | Controller Logic |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create user, hash password, return token |
| POST | `/api/auth/login` | Public | Verify credentials, return token |
| GET | `/api/auth/me` | Private | Return current user details |
| GET | `/api/health` | Private | Get user health records |
| POST | `/api/health` | Private | Create new health record |
| PUT | `/api/health/:id` | Private | Update specific record |
| DELETE| `/api/health/:id` | Private | Delete specific record |
| GET | `/api/goals` | Private | Fetch goals |
| GET | `/api/users/profile`| Private | Get user profile stats |
| POST | `/api/ai/suggestions`| Private | Return AI insights |
| GET | `/api/admin/users` | Admin | Fetch system users |

## Middleware List
- `helmet()`: Sets secure HTTP headers.
- `cors()`: Cross-Origin Resource Sharing based on `CLIENT_URL`.
- `express-rate-limit`: Throttles brute force requests (separate stringent limiter for `/auth`).
- `express.json()`: Body parser.
- `authMiddleware.js`: Verifies JWT to protect routes. 
- `validationMiddleware.js`: express-validator implementations.
- `errorMiddleware.js`: Formats stack traces for error responses.

## Error Handling
Global error handler intercepts any unhandled issues and normalizes them into JSON responses with an appropriate HTTP status code. Detailed stack traces are disabled in production.

## Security Implementations
All secrets live in `.env`. MongoDB strings, JWT secrets, and salt rounds (12) are secure. Admin middleware prevents standard users from reaching `/api/admin` routes.
