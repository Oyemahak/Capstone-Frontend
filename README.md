# Capstone Frontend – MSPixelPulse

This repository contains the **frontend** for the Capstone project **MSPixelPulse**, a full-stack platform for project management and client communication. The frontend is designed as a professional marketing website combined with a secure portal for Admins, Developers, and Clients.

---

## Overview
The frontend was built using **React (with Vite)** and styled with **TailwindCSS**. It serves two main purposes:

1. **Public Website**
   - Home, Projects, Services, Pricing, Contact
   - Pricing page with a “Get Started” button that redirects users to the Register page
   - Contact form for inquiries

2. **Secure Portal**
   - Registration with role selection (Client, Developer, Admin)
   - Login and logout
   - Admin dashboard to approve or reject new users
   - Project management features with CRUD operations

---

## Key Features
- **Responsive design** – works on desktop and mobile
- **Role-based access** – different experiences for clients, developers, and admins
- **Registration workflow** – users register and remain in “pending” status until approved
- **Admin tools** – manage users, approvals, and projects
- **Projects module** – create and assign projects with status (draft, active, completed)

---

## Tech Stack
- **React + Vite**
- **React Router**
- **TailwindCSS**
- **Axios** for API requests
- **Vercel** for deployment

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Oyemahak/Capstone-Frontend.git
cd Capstone-Frontend
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment variables
Create a .env file in the root with:
```bash
# Local development
VITE_API_BASE=http://localhost:4000/api

# Production backend (Render)
VITE_API_BASE=https://capstone-backend-o3o2.onrender.com/api
```
### 4. Run locally
```bash
npm run dev
```
Runs the frontend at http://localhost:5173.

### 5. Build for production
npm run build

---

## Deployment
The frontend is deployed on Vercel:
👉 https://mspixelpulse.vercel.app

---

### Author
Developed & Designed by Mahak Patel (@Oyemahak)