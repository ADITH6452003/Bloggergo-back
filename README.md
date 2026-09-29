# BloggerGo Backend

A RESTful API backend for the BloggerGo blogging platform, built with Node.js, Express, and MongoDB. Deployed on AWS EC2 via GitHub Actions CI/CD.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Deployment:** AWS EC2 + PM2, automated via GitHub Actions

## Project Structure

```
Bloggergo-back/
├── .github/workflows/
│   └── main.yml            # CI/CD pipeline (deploy to EC2 on push to main)
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, login, profile
│   └── blogController.js   # Blog CRUD, search, stats, authors
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User schema
│   └── Blog.js             # Blog schema
├── routes/
│   ├── authRoutes.js       # Auth routes
│   └── blogRoutes.js       # Blog routes
├── .env                    # Environment variables (not committed)
├── server.js               # App entry point
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI=mongodb://localhost:27017/bloggergo
JWT_SECRET=your-secret-key-here
PORT=5000
BACKEND_URL=http://localhost:5000
```

### 3. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

All protected routes require the header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register a new user |
| POST | `/api/login` | No | Login and receive JWT |
| GET | `/api/profile` | Yes | Get current user profile |
| PUT | `/api/profile` | Yes | Update username, mobile, dob |

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs/my` | Yes | Get blogs of logged-in user |
| GET | `/api/blogs/:id` | No | Get a single blog by ID |
| GET | `/api/blogs/search?query=` | No | Search blogs by title, content, or author |
| GET | `/api/blogs/authors` | No | Get top 5 most active authors |
| POST | `/api/blogs` | Yes | Create a new blog |
| PUT | `/api/blogs/:id` | Yes | Update a blog (owner only) |
| DELETE | `/api/blogs/:id` | Yes | Delete a blog (owner only) |

### Misc

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stats` | Yes | Get total blogs and user's blog count |
| GET | `/health` | No | Health check (returns `{ status: "ok" }`) |

## Database Schema

### User

| Field | Type | Notes |
|-------|------|-------|
| username | String | Required, unique |
| email | String | Required, unique |
| password | String | Required, bcrypt hashed |
| mobile | String | Optional |
| dob | String | Optional |

### Blog

| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| content | String | Required |
| author | ObjectId | Ref: User |
| createdAt | Date | Default: now |
| lastUpdated | Date | Default: now |

## CI/CD — GitHub Actions → AWS EC2

On every push to `main`, the workflow in `.github/workflows/main.yml`:

1. SSHs into the EC2 instance using `EC2_SSH_KEY` and `EC2_HOST` secrets
2. Pulls the latest code
3. Writes `.env` from `MONGO_URI` secret
4. Runs `npm install`
5. Restarts the app with PM2

Required GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Public IP or DNS of the EC2 instance |
| `EC2_SSH_KEY` | Private SSH key for the EC2 instance |
| `MONGO_URI` | MongoDB connection string |

## CORS

The server allows requests from:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5175`
- `https://bloggergo-front.vercel.app`

## Keep-Alive

A self-ping to `/health` runs every 14 minutes to prevent the Render free tier from sleeping.
