<<<<<<< HEAD
# 🧩 Multi-Step User Profile Form – MERN Stack

This is a full-stack MERN project built as part of an interview task for the Junior Developer role at Frequent Research. The application is a **multi-step user profile update form** featuring dynamic fields, validations, file uploads, and database integration.

---

## 📁 Project Structure

form-project/
│
├── client/ # React frontend
│ ├── public/ # Static files
│ ├── src/ # Source code
│ │ ├── App.js # Root component
│ │ ├── App.css # Styles
│ │ └── ... # Other standard React files
│ ├── package.json # React dependencies
│ └── README.md # Frontend readme
│
├── server/ # Express backend
│ ├── models/ # Mongoose models for Country, State, City, User
│ ├── .env # Environment variables
│ ├── index.js # API and server configuration
│ └── package.json # Backend dependencies


---

## ✨ Features

- Multi-Step Form (Step 1: Personal Info, Step 2: Professional, Step 3: Preferences)
- Frontend & Backend Validation (No 3rd-party libraries)
- Dynamic rendering based on user input
- File upload (Profile picture - JPG/PNG, <2MB) with live preview
- Password strength meter and verification
- Username availability check
- Cascading dropdowns: Country → State → City
- Summary page before submission
- Data persisted to MongoDB
- Deployed on free-tier platforms

---

## 🚀 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/TheGreatVasu/form-project.git
cd form-project

2. For Backend
   cd server
npm install
# Setup .env file with MongoDB connection string
npm start

3. For frontend
   cd client
   npm install
   npm start

and live demo link is form-project-ochre-gamma.vercel.app
=======
# form-project
A MERN stack multi-step profile form with user input validation, step navigation, and MongoDB integration.
>>>>>>> 3e0c60d986c75c9126dcaf10d124110dbdc3c50d
