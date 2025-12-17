# BloggerGo Backend

## Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── blogController.js    # Blog CRUD operations
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User schema
│   └── Blog.js             # Blog schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── blogRoutes.js       # Blog routes
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json
```

## Setup Instructions

1. **Install MongoDB**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install mongodb
   
   # On macOS
   brew install mongodb-community
   
   # Start MongoDB service
   sudo systemctl start mongodb  # Linux
   brew services start mongodb-community  # macOS
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   Update `.env` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/bloggergo
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/blogs/my` - Get user's blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/stats` - Get blog statistics

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/bloggergo
JWT_SECRET=your-secret-key-here
PORT=5000
```

## Database Schema

### User
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- mobile (String)
- dob (String)

### Blog
- title (String, required)
- content (String, required)
- author (ObjectId, ref: User)
- createdAt (Date, default: now)
- lastUpdated (Date, default: now)