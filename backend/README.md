# Users YouTube Backend

This is the backend for the Users YouTube application. It provides authentication, user profile management, and YouTube video features using Node.js, Express, PostgreSQL, and JWT authentication.

## Features
- User registration and login
- JWT-based authentication
- User profile (view and update)
- Save and manage favorite YouTube videos
- Search YouTube, view trending videos, and get video/channel details (YouTube Data API v3)

## Setup Instructions

### 1. Clone the repository
```
git clone <repo-url>
cd usersYoutube/backend
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Create a `config.env` file in the backend directory (already present in this repo):
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/usersyoutube
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
YOUTUBE_API_KEY=your_youtube_api_key
```

### 4. Set up the PostgreSQL database
Create the required tables:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE saved_videos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  channel_title VARCHAR(255),
  thumbnail TEXT
);
```

### 5. Start the server
```
npm run dev
```
The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get current user's profile (auth required)

### Users
- `PUT /api/users/profile` — Update user profile (auth required)
- `GET /api/users/saved-videos` — Get saved videos (auth required)
- `POST /api/users/saved-videos` — Save a video (auth required)
- `DELETE /api/users/saved-videos/:videoId` — Delete a saved video (auth required)

### YouTube
- `GET /api/youtube/search?q=...` — Search YouTube videos (auth required)
- `GET /api/youtube/video/:videoId` — Get video details (auth required)
- `GET /api/youtube/channel/:channelId` — Get channel details (auth required)
- `GET /api/youtube/trending` — Get trending videos (auth required)
- `GET /api/youtube/channel/:channelId/videos` — Get videos from a channel (auth required)

## License
MIT 