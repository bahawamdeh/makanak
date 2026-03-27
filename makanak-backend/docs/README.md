# 🏠 Makanak – Smart Housing & Roommate System (Backend)

Makanak is a backend system designed to help students find housing and roommates in a safe and controlled way.  
The system connects **Students**, **Landlords**, and **Admins** using a role-based architecture with secure authentication.

This project is developed as a **Graduation Project** using **Node.js, Express, and MongoDB**.

---

## 🎯 Project Goals
- Allow landlords to publish housing listings.
- Allow students to search for housing and request roommates.
- Prevent misuse by enforcing payment and authorization rules.
- Provide admin-level control over the system.
- Prepare the backend for future AI and frontend integration.

---

## 🧑‍💻 User Roles & Permissions

### 👨‍🎓 Student
- Register & login
- View active housing listings
- Send roommate requests
- Receive notifications

### 🏠 Landlord
- Register & login
- Create housing listings
- Pay to activate listings
- View & manage roommate requests
- Accept or reject requests
- Receive notifications

### 🧑‍💼 Admin
- View system statistics
- View all users
- Delete users
- Monitor listings and system activity

---

## 🧱 System Architecture
- **Backend Framework:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Authorization:** Role-based middleware
- **Architecture Style:** REST API
- **Database Type:** NoSQL (MongoDB)

---

## 🗄️ Database Models
- User
- Listing
- RoommateRequest
- Notification

All models are implemented using **Mongoose** with proper relationships.

---

## 🔐 Security Features
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Protected routes
- Centralized error handling

---

## 💳 Payment Logic
- Payment is simulated (Mock Payment)
- Listings are activated only after payment
- Listing lifecycle:
