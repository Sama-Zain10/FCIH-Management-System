# 🎓 Faculty Management Portal

A full-stack web platform designed to provide an integrated digital environment for college students and administrators.

The platform allows students to access academic services and information, while administrators can manage student data and oversee college operations through a centralized dashboard.

## 🚀 Tech Stack

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Tools & Technologies
- RESTful APIs
- JWT Authentication
- Role-Based Access Control
- Postman
- Git & GitHub

## ✨ Key Features

### 👨‍🎓 Student Portal
- Secure student login.
- Access personal profile and academic information.
- View available courses.
- Access grades and academic records.
- Navigate college services through a user-friendly interface.

### 🛠️ Admin Dashboard
- Secure admin authentication.
- Manage student accounts and information.
- Manage courses and academic data.
- Manage and update student grades.
- Oversee college academic operations.

## 🏗️ Project Structure

```text
FCIH-Management-System/
│
├── Backend/
│   ├── config/
│   ├── middleware/
│   ├── model/
│   ├── modules/
│   ├── test/
│   ├── index.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── angular.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sama-Zain10/FCIH-Management-System.git
cd FCIH-Management-System
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
```

Run the Angular application:

```bash
ng serve
```

Visit:

```text
http://localhost:4200
```

## 🎯 Project Goals

- Digitize college academic services.
- Provide students with easy access to their academic information.
- Simplify administrative tasks through a centralized dashboard.
- Build a secure and maintainable full-stack application.
- Apply modern web development practices.

## 👩‍💻 Developer

**Sama Sayed Zain**

Software Engineering Student | Backend & Full-Stack Developer

- GitHub: [Sama-Zain](https://github.com/Sama-Zain)
- LinkedIn: [Sama Sayed](https://linkedin.com/in/sama-sayed-801189386)

---

⭐ If you find this project useful, feel free to star the repository!
