# Super Admin Backend Project

This repository contains the backend implementation for a Super Admin dashboard, designed to manage users, roles, audit logs, and basic analytics. It features a secure, production-quality REST API built with Node.js, Express, and Prisma, connected to a PostgreSQL database.

**Project Status:** In Progress (as of 1 Sep 2025)


**Note:** Hi, this is the take home project that I got while applying for oneclarity.ai. Okay so the core backend features, architecture and testing are substantially complete. My immediate next steps would be to write the final API tests and build the minimal react ui.
Im sorry this project isnt completed yet because I was out of station while I recieved this assignment, Im submitting it rn to meet the deadline.

This was a really fun project and Ill keep pushing updates to it :)

(ps: ill be happier if i could get an extension of a day or two please)


---

### Features Implemented

*   **Authentication:** Secure JWT-based login (`/auth/login`).
*   **User Management (CRUD):** Full create, read (with pagination/filtering), update, and delete functionality for users.
*   **Role Management (CRUD):** Full create, read, and update functionality for roles.
*   **Role Assignment:** Endpoint to assign roles to users.
*   **Audit Logging:** Automatic, robust logging for all major create, update, and delete events.
*   **Analytics:** A summary endpoint for key metrics (total users, roles, active users).
*   **Security:** Role-based access control (RBAC) middleware to protect all superadmin routes.
*   **Architecture:** Professional-grade setup with a controller pattern, centralized services, a global error handler, and a fully isolated testing environment.

---

### Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (running in Docker)
*   **ORM:** Prisma
*   **Authentication:** JSON Web Tokens (JWT)
*   **Testing:** Jest, Supertest

---

### Local Setup & How to Run

**Prerequisites:**
*   Node.js (v16+ or v18+)
*   Docker Desktop

**1. Clone the repository:**
```bash
git clone [Your GitHub Repo URL]
cd SuperAdmin
```

**2. Set up environment variables:**
Navigate to the `backend` folder and create a `.env` file. Copy the contents of `.env.example` into it.
```bash
cd backend
cp .env.example .env
```

**3. Start the databases:**
From the root `SuperAdmin` directory, start the development and test databases using Docker.
```bash
# Make sure you are in the root 'SuperAdmin' folder
docker-compose up -d
```

**4. Install backend dependencies:**
```bash
# In the 'backend' folder
npm install
```

**5. Run database migrations and seed:**
This will set up your database schema and create the initial `superadmin@example.com` user.
```bash
npx prisma migrate dev
npx prisma db seed
```

**6. Start the development server:**
```bash
npm start
```
The server will be running at `http://localhost:3001`.

**7. Run the automated tests:**
To run the full test suite against the isolated test database:
```bash
npm test
```
---
### Super Admin Credentials

You can log in and test the API using the seeded user:
*   **Email:** `superadmin@example.com`
*   **Password:** `Test1234`