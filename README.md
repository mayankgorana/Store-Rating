# Store Rating App

This project is a full-stack store rating system built using React, Node.js, Express, and PostgreSQL. It features secure user authentication, role-based access control, and allows users to rate stores while admins manage users and stores.

🚀 **Tech Stack**

- Frontend: React, Axios, React Router DOM  
- Backend: Node.js, Express.js, PostgreSQL, bcrypt, JWT, express-validator  

✅ **Features**

- 🔐 User Registration with hashed passwords using bcrypt  
- 🔑 User Login with JWT-based authentication  
- 🛡️ Protected Routes with role-based authorization  
- 🏬 Store listing with average ratings  
- ⭐ User ratings with ability to update  
- 👨‍💼 Admin dashboard for managing users and stores  
- 🌐 CORS configured for cross-origin frontend requests  
- ✨ Clean and user-friendly UI components for authentication and ratings  

📂 **Project Structure**
store-rating/
├── client/ # React frontend
│ ├── components/
│ │ ├── Login.js
│ │ ├── Register.js
│ │ └── StoreList.js
│ ├── styles/
│ ├── App.js
│ └── index.js
├── server/ # Node.js backend
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── db.js
│ └── app.js
├── .env
├── package.json

## User Roles & Functionalities

### 1. System Administrator
- Add new stores, normal users, and admin users.
- Access a dashboard displaying:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- Add new users with details: Name, Email, Password, Address
- View lists of stores with details: Name, Email, Address, Rating
- View lists of normal and admin users with details: Name, Email, Address, Role
- Apply filters on listings based on Name, Email, Address, and Role
- View details of all users, including Ratings for Store Owners
- Logout functionality

### 2. Normal User
- Sign up and log in to the platform
- Signup form fields: Name, Email, Address, Password
- Update password after logging in
- View a list of all registered stores
- Search for stores by Name and Address
- Store listings display:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
  - Option to submit a rating
  - Option to modify their submitted rating
- Submit ratings between 1 and 5
- Logout functionality

### 3. Store Owner
- Log in to the platform
- Update password after logging in
- Dashboard functionalities:
  - View a list of users who submitted ratings for their store
  - See the average rating of their store
- Logout functionality

---

## Form Validations
- **Name:** Minimum 20 characters, maximum 60 characters
- **Address:** Maximum 400 characters
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character
- **Email:** Standard email validation rules

---

## Features
- User authentication and role-based authorization
- Dashboard views for Admin and Store Owner
- Rating system for stores (1–5)
- Search and filter functionality for stores and users
- Update and modify ratings
- Sorting for tables (ascending/descending) on key fields like Name, Email, etc.
- Responsive frontend using ReactJS
- Database schema following best practices
- Proper form validations and error handling


⚙️ **Installation Steps**

1. Clone the repository  
   `git clone https://github.com/your-username/store-rating.git`  
   `cd store-rating`

2. Install Backend Dependencies  
   `cd server`  
   `npm install`

3. Configure environment variables  
   Create a `.env` file inside `server` folder with your DB credentials and JWT secret, e.g.:  


PG_USER=your_db_user
PG_PASSWORD=your_db_password
PG_DATABASE=your_db_name
PG_HOST=localhost
PG_PORT=5432
FOO_COOKIE_SECRET=your_jwt_secret


4. Start Backend Server  
`npm start`

5. Install Frontend Dependencies  
Open a new terminal window/tab  
`cd ../client`  
`npm install`

6. Start Frontend  
`npm start`

Your backend runs on `http://localhost:5000` and frontend on `http://localhost:3000` (adjust if needed).
