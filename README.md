# Task Management API

## Overview

The Task Management API is a robust backend service for managing tasks within teams and users. It provides functionalities for user authentication, team management, task creation, and real-time task updates using WebSockets (Socket.IO). This API is designed to support both individual and team-based task management with real-time notifications and updates.

## Features

- **User Authentication**: Secure user registration, login, and JWT-based authentication.
- **Team Management**: Create, update, and delete teams. Assign users to teams.
- **Task Management**: Create, update, and delete tasks. Assign tasks to users or teams.
- **Real-Time Updates**: Receive real-time events on task creation, updates, and deletions using Socket.IO.
- **Role-Based Access**: Different functionalities based on user roles (e.g., admin, user).

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- MongoDB
- `dotenv` for environment variable management

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ShabinMuhammedKK/Task-Management-API.git
   cd task-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```env
   PORT=3000
   DB_CONNECTION_STRING=mongodb://localhost:27017/task-management
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

4. Run the server:

   ```bash
   npm start
   ```

## API Endpoints

### User Endpoints

- **POST /api/user/register**: Register a new user.
- **POST /api/user/login**: Login and obtain a JWT token.
- **POST /api/teams/all-users**: Login and obtain a JWT token.

### Team Endpoints

- **POST /api/teams/create**: Create a new team.
- **GET /api/teams/:id**: Fetch a specific team by ID.

### Task Endpoints

- **POST /api/tasks/create**: Create a new task.
- **GET /api/tasks/**: Fetch all tasks.
- **GET /api/tasks/:id**: Fetch a specific task by ID.
- **PUT /api/tasks/update-status/:id**: Update a task by ID.
- **DELETE /api/tasks/delete/:id**: Delete a task by ID.

### WebSocket Endpoints

- **`/socket.io/`**: WebSocket configured.
