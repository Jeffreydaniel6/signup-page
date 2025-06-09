

 User Authentication and Profile Management System

This project is a full-stack web application designed for user authentication and profile management. It provides secure user registration, login, session management, and the ability for users to view and update their personal profiles. The application is built using a combination of modern web technologies, showcasing a robust and scalable architecture.

 Key Features

* User Registration: Allows new users to securely sign up with a unique username and password.
* User Login: Authenticates existing users with their credentials, generating a JSON Web Token (JWT) for secure session management.
* Token-Based Authentication: Utilizes JWTs to secure API endpoints, ensuring only authenticated users can access protected resources.
* Profile Viewing: Authenticated users can view their stored profile information (username, age, date of birth, contact information).
* Profile Editing: Users can update their profile details (age, date of birth, contact information).
* Session Management: Securely handles user sessions with automatic redirection on authentication status changes or token expiration.
* Logout Functionality: Allows users to securely end their session.

 Technologies Used

This project leverages a hybrid database approach, combining a relational database (MySQL) for core user authentication and a NoSQL database (MongoDB) for flexible user profile data.

 Frontend (Client)

* React.js: A JavaScript library for building user interfaces.
* React Router DOM: For declarative routing within the React application.
* Axios: A promise-based HTTP client for making API requests to the backend.
* Bootstrap: A popular CSS framework for responsive and modern UI components.

 Backend (Server)

* Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
* Express.js: A fast, unopinionated, minimalist web framework for Node.js, used for building RESTful APIs.
* MySQL: A relational database management system, used for storing sensitive user authentication data (usernames, hashed passwords).
    * `mysql2` package: MySQL client for Node.js with Promise support.
* MongoDB: A NoSQL document database, used for storing flexible user profile information.
    * Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution to model application data.
* `bcrypt.js`: Library for hashing passwords to ensure security.
* `jsonwebtoken`: For implementing JWT-based authentication.
* `cors`: Middleware to enable Cross-Origin Resource Sharing, allowing communication between the frontend and backend.
* `dotenv`: To manage environment variables securely.

 Project Structure

The project is divided into two main parts: `client` (React frontend) and `server` (Node.js/Express backend).

```
project-root/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/          # Login, SignUp, Profile Pages
│   │   │   ├── LoginPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── SignUpPage.js
│   │   ├── services/       # API interaction logic (authService, profileService)
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── .env.development    # Frontend environment variables
│   ├── package.json
│   └── ...
└── server/                 # Node.js/Express Backend
    ├── config/             # Database connection (db.js)
    │   └── db.js
    ├── controllers/        # Business logic for routes (authController, profileController)
    │   ├── authController.js
    │   └── profileController.js
    ├── middleware/         # Authentication middleware (authMiddleware.js)
    │   └── authMiddleware.js
    ├── models/             # Mongoose schemas (Profile.js)
    │   └── Profile.js
    ├── routes/             # API routes (authRoutes, profileRoutes)
    │   ├── authRoutes.js
    │   └── profileRoutes.js
    ├── .env                # Backend environment variables
    ├── app.js              # Express app configuration
    ├── server.js           # Main server entry point
    ├── package.json
    └── ...
```

 Setup and Installation

To get this project up and running on your local machine, follow these steps:

 Prerequisites

* Node.js and npm: Ensure you have Node.js (v14 or higher recommended) and npm (Node Package Manager) installed.
* XAMPP: For Apache and MySQL. Make sure Apache and MySQL services are running.
* MongoDB: You'll need a MongoDB instance (either local using MongoDB Community Server or a cloud instance like MongoDB Atlas).

 1. Clone the Repository

```bash
git clone <your-repository-url>
cd project-root
```

 2. Backend Setup (`server` directory)

Navigate to the `server` directory:

```bash
cd server
```

# a. Environment Variables

Create a `.env` file in the `server` directory and add the following:

```
# Server Port
PORT=5000

# MySQL Database Configuration (from XAMPP)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=user_auth_db # Or your chosen database name

# MongoDB Database Configuration
MONGO_URI=mongodb://localhost:27017/user_profiles_db # Or your MongoDB Atlas connection string

# JWT Secret (IMPORTANT: Change this to a long, random, AND secure string in production)
JWT_SECRET=aVeryStrongAndComplexSecretKeyForJwtThatYouMustNeverShare
```

* `DB_PASSWORD`**: Leave empty if your MySQL `root` user has no password (default XAMPP setup).
* `MONGO_URI`**: If using MongoDB Atlas, replace with your connection string.

# b. Install Dependencies

```bash
npm install
```

# c. Database Setup (MySQL)

* Open phpMyAdmin: Go to `http://localhost/phpmyadmin/` in your browser (via XAMPP Control Panel).
* **Create Database: Create a new database named `user_auth_db` (or whatever you set for `DB_DATABASE` in `.env`).
* Table Creation: The `server/config/db.js` file is configured to automatically create the `users` table if it doesn't exist when the backend server starts.

# d. Start the Backend Server

```bash
node server.js
```

You should see console messages indicating successful connections to MySQL and MongoDB, and that the server is running on port 5000.

```
MySQL pool connected successfully!
MySQL users table checked/created successfully!
MongoDB connected successfully!
Server running on port 5000
Access backend at http://localhost:5000
```

 3. Frontend Setup (`client` directory)

Open a **new** terminal window and navigate to the `client` directory:

```bash
cd ../client
```

# a. Environment Variables

Create a `.env.development` file in the `client` directory and add the following:

```
REACT_APP_API_URL=http://localhost:5000/api
```

# b. Install Dependencies

```bash
npm install
```

# c. Start the Frontend Development Server

```bash
npm start
```

This will open the React application in your default web browser at `http://localhost:3000`.

 Usage

1.  Register: Go to `http://localhost:3000` and click "Sign Up" to create a new account.
2.  Login: Use your newly created credentials to log in.
3.  Profile: After successful login, you'll be redirected to the Profile page where you can view and update your details.
4.  Logout: Click the "Log Out" button to end your session.

 Contributing

Feel free to fork this repository, submit pull requests, or report issues.
