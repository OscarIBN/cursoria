# Users YouTube Application

A full-stack web application that allows users to search YouTube videos, save their favorites, and manage their video collection. Built with React frontend and Node.js backend.

## 🚀 Features

- **User Authentication**: Register, login, and profile management with JWT
- **YouTube Search**: Search for videos using YouTube Data API v3
- **Save Videos**: Bookmark and save favorite videos to your collection
- **Video Management**: View, organize, and delete saved videos
- **Modern UI**: Responsive design with Material-UI components
- **Real-time Search**: Instant search results with loading states

## 🏗️ Architecture

```
usersYoutube/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   └── package.json
├── backend/           # Node.js/Express API
│   ├── routes/        # API endpoints
│   ├── middleware/    # Authentication middleware
│   ├── config/        # Database configuration
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **YouTube Data API v3** - Video search

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- YouTube Data API v3 key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd usersYoutube
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from config.env)
cp config.env .env

# Edit .env with your credentials
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET: Your secret key
# - YOUTUBE_API_KEY: Your YouTube Data API key

# Set up database tables
# Run the SQL commands from backend/README.md

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

**Backend (`backend/.env`):**
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/usersyoutube
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
YOUTUBE_API_KEY=your_youtube_api_key
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Saved videos table
CREATE TABLE user_saved_videos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR(50) NOT NULL,
  video_title VARCHAR(255),
  channel_title VARCHAR(255),
  thumbnail_url TEXT
);
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Users
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/saved-videos` - Get saved videos
- `POST /api/users/saved-videos` - Save a video
- `DELETE /api/users/saved-videos/:videoId` - Delete saved video

### YouTube
- `GET /api/youtube/search` - Search YouTube videos
- `GET /api/youtube/video/:videoId` - Get video details
- `GET /api/youtube/channel/:channelId` - Get channel details
- `GET /api/youtube/trending` - Get trending videos

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Search Videos**: Use the search bar to find YouTube videos
3. **Save Videos**: Click the bookmark icon to save videos
4. **View Saved**: Navigate to "Saved Videos" to see your collection
5. **Manage Profile**: Update your username and email

## 🧪 Testing

### Backend API Testing
```bash
# Test without authentication
curl http://localhost:5000/api/youtube/search-test?q=test&maxResults=5

# Test with authentication
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/youtube/search?q=test
```

### Frontend Testing
- Open http://localhost:3000
- Use the search functionality
- Test save/delete video features

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for `http://localhost:3000`
2. **Database Connection**: Check PostgreSQL is running and credentials are correct
3. **YouTube API**: Verify your API key is valid and has YouTube Data API v3 enabled
4. **JWT Errors**: Check token expiration and secret key configuration

### Debug Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## 📝 Development

### Project Structure
- `frontend/src/components/` - React components
- `frontend/src/services/` - API service functions
- `backend/routes/` - Express route handlers
- `backend/middleware/` - Custom middleware

### Adding Features
1. Create backend endpoint in appropriate route file
2. Add frontend service function
3. Create React component if needed
4. Update navigation/routing

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

## 👨‍💻 Author

**Autor: Oscar Bolaños**

---

**Happy coding! 🎉** 