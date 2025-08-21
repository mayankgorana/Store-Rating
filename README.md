# Store Rating

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
