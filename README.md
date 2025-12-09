# 🩺 MedConnect Lite  

**MedConnect Lite** is a lightweight healthcare appointment and doctor directory platform designed using modern full-stack web technologies. It allows patients to search doctors, filter by specialization or city, book appointments and manage profiles — all inside a minimal and scalable architecture.

---

## 🔗 Live Demo Links  

### 🖥️ Frontend (Next.js)  
https://medconnect-tsae.onrender.com/

### 🛠 Backend API (Node + Express)
https://med-connect-d9mb.vercel.app/

---

## 🚀 Tech Stack
- **Next.js (React)**
- **TailwindCSS**
- **Node.js + Express.js**
- **Prisma ORM**
- **MongoDB Atlas**
- **JWT Authentication**
- **bcrypt**
- **Deployment: Vercel + Render/Railway**

---

## 📌 Problem Statement  

Finding the right doctor for consultation is still difficult due to lack of availability and information. Large platforms like Apollo 24×7 have enterprise solutions, but there is no simplified open-source system for education and practical learning.

**MedConnect Lite** solves that by offering a clean, modern, and practical implementation suitable for students, learners, and small institutions.

---

## 🎯 Features  

### 🔐 Authentication
- Patient signup
- Login
- Logout
- Secured JWT auth

### 👨‍⚕️ Doctor Directory
- Search
- Filter (specialization, city, availability)
- Sort (fee, rating, experience)
- Pagination

### 📆 Appointments
- Book appointment
- View booking history

### 🛠 Admin Features
- Add doctor
- Edit doctor
- Delete doctor

---

## 🧱 Architecture  


---

## 📡 API Endpoints  

| Endpoint | Method | Description |
|---|---|---|
| /api/auth/signup | POST | Register patient |
| /api/auth/login | POST | Authenticate user |
| /api/doctors | GET | Filters + sorting + pagination |
| /api/doctors/:id | PUT | Update doctor (admin) |
| /api/doctors/:id | DELETE | Delete doctor (admin) |
| /api/appointments | POST | Book appointment |
| /api/appointments | GET | Get user appointments |

---

## 🖥 Installation  

### Clone repository
```bash
git clone https://github.com/vaidehisahu1/medConnect.git
cd medConnect


