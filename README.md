# User Management System

A full-stack MERN application that manages user accounts with robust Role-Based Access Control (RBAC). It features secure user authentication, distinct roles (Admin, Manager, User), audit tracking, and a gorgeous, responsive React glassmorphism UI.

## Tech Stack

- **Frontend**: React (Vite), React Router DOM, Axios, Custom CSS (Glassmorphism & CSS Variables)
- **Backend**: Node.js, Express.js
- **Auth & Security**: JSON Web Tokens (JWT), bcrypt (password hashing)
- **Database**: MongoDB, Mongoose ODM

---

## System Architecture

```mermaid
graph TD
    Client[React Frontend <br/> Vite, Context API] -->|REST API Requests <br/> Axios | Router
    
    subgraph Express Backend
        Router[API Router] --> AuthRoute[/api/auth]
        Router --> UserRoute[/api/users]
        
        AuthRoute --> AuthCtrl[Auth Controller]
        UserRoute --> JwtMid[JWT Middleware]
        JwtMid --> RoleMid[RBAC Middleware]
        RoleMid --> UserCtrl[User Controller]
    end
    
    AuthCtrl --> Mongoose[Mongoose ODM]
    UserCtrl --> Mongoose
    
    Mongoose <--> MongoDB[(MongoDB <br/> Users Collection)]
```

---

## Environment Setup Instructions

### 1. Prerequisites
Ensure you have the following installed to run this project:
- **Node.js** (v20+ recommended)
- **MongoDB** (You can either run standard local MongoDB or use the included `docker-compose.yml` to spin it up in isolated container).

### 2. Setting up the Database via Docker (Optional)
If you do not have MongoDB installed on your local machine, you can run the included docker-compose file from the root directory:
```bash
docker-compose up -d
```
*This will pull the official MongoDB image and run it on your machine on port 27017 natively.*

### 3. Backend Setup

Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Since the application utilizes `dotenv`, you can define custom variables. By default, the application runs perfectly without a `.env` file since fallbacks are provided. However, for a production environment, create a `.env` file inside `/backend` with the following:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/user-management
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 4. Database Schema & Migration (Seeding)

The schema definitions are securely stored via Mongoose ODM in `backend/models/User.js`. 
To migrate/seed the database with the required default roles and users, run the seeder script. **Ensure your MongoDB instance is running before executing this:**

```bash
node seed.js
```

This will clear existing User schemas and populate the database with these default accounts:
- **Admin**: `admin@system.com`
- **Manager**: `manager@system.com`
- **User**: `user@system.com`
*(All passwords are set to `Password123!`)*

### 5. Frontend Setup

Open a separate terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

---

## Running the Application Locally

You will need to leave two terminal instances running simultaneously.

**Start the Backend Server:**
```bash
cd backend
npm run dev 
# or if nodemon isn't configured: node server.js
```
*Runs on `http://localhost:5000`*

**Start the React Client:**
```bash
cd frontend
npm run dev
```
*Runs on `http://localhost:5173`*

Navigating to your React Client URL will show the secure login screen. Use any of the pre-seeded credentials to gain access!

---

## Roles and Responsibilities

- **Admin**: Highest level of visibility. Has total control to view the full user list, create users, delete users, and demote/promote roles.
- **Manager**: Intermediate operations. Can view the user list, and can edit standard `User` accounts. They are hard-blocked from creating new roles, editing an `Admin`, or demoting an `Admin`.
- **User**: Read-only platform usage. Can only manage and modify their personal account Profile details (Name, Password).
