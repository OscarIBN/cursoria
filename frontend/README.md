# Users YouTube Frontend

This is the frontend for the Users YouTube application. It is built with React and communicates with the backend API for authentication, user management, and YouTube video features.

## Features
- User registration and login
- JWT-based authentication (with context)
- View and update user profile
- Search YouTube videos, view trending, and save favorites
- Responsive dashboard and protected routes

## Setup Instructions

### 1. Navigate to the frontend directory
```
cd frontend
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables (optional)
If you want to use a custom backend URL, create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```
By default, the frontend expects the backend to run at `http://localhost:5000/api`.

### 4. Start the development server
```
npm start
```
The app will run at `http://localhost:3000` by default.

## Project Structure
- `src/components/` — React components (auth, dashboard, profile, YouTube features)
- `src/contexts/` — React context for authentication
- `src/services/` — API service modules for auth and YouTube

## Usage
- Register or log in to access the dashboard
- Search for YouTube videos and save your favorites
- View and update your profile

## License
MIT 