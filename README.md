# Event Management Application

A full-stack web application for managing events and user registrations.

## Features

- User registration and authentication
- Create and manage events
- Register for events
- View upcoming events
- Manage event registrations
- Cancel event registrations

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Events
- POST /api/events - Create a new event (authenticated)
- GET /api/events - Get all upcoming events
- POST /api/events/:eventId/register - Register for an event
- DELETE /api/events/:eventId/cancel/:userId - Cancel event registration

### Users
- GET /api/users/:userId/events - Get user's registered events

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-secret-key
```

3. Start MongoDB:
```bash
mongod
```

4. Start the server:
```bash
npm run dev
```

## API Usage

### Register a new user
```bash
POST /api/auth/register
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

### Login
```bash
POST /api/auth/login
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Create an event
```bash
POST /api/events
{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-12-31T00:00:00.000Z"
}
```

### Register for an event
```bash
POST /api/events/:eventId/register
```

### Get user's events
```bash
GET /api/users/:userId/events
```

### Cancel registration
```bash
DELETE /api/events/:eventId/cancel/:userId
``` 