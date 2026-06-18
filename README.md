# BookOrbit — Online Book Delivery Platform

![BookOrbit Banner](https://i.ibb.co.com/tnsPnW0/Screenshot-2026-06-18-035553.png)

**BookOrbit** is a full-featured, role-based e-commerce platform for online book ordering and delivery. Built with the MERN stack, it serves as a complete marketplace where users can browse, purchase, and track books, while admins and librarians manage inventory, orders, and users through dedicated dashboards.

**Live Demo:** [bookorbit-388cb.web.app](https://bookorbit-388cb.web.app/)  
**Client Repo:** [github.com/shakhawat71/bookorbit-client](https://github.com/shakhawat71/bookorbit-client)  
**Server Repo:** [github.com/shakhawat71/bookorbit-server](https://github.com/shakhawat71/bookorbit-server)

---

## Project Overview

The goal of BookOrbit is to create a seamless digital book marketplace. It simplifies the process of discovering, buying, and receiving books, with a focus on user experience and efficient management.

### Key Functionalities

*   **Comprehensive Book Discovery:** Browse a catalog of books with detailed pages, ratings, and reviews.
*   **Secure Ordering System:** Purchase books online with a smooth checkout process and real-time order tracking (Pending → Shipped → Delivered).
*   **Role-Based Access:** Separate dashboards and permissions for **Admins**, **Librarians**, and **Users** to ensure streamlined operations.
*   **Community Engagement:** Authenticated users can leave reviews and ratings for books they've purchased.
*   **Polished User Interface:** A responsive, animated, and intuitive UI built with a modern SaaS-style design.

---

## Key Features

### Authentication & Security
*   Email and Password login.
*   Google Authentication via Firebase.
*   **Password Reset Functionality** — Users can securely reset their password via email.
*   Protected routes for secure access.

### Book Management
*   View all books with search and filtering.
*   Dedicated pages for each book with detailed info.
*   Authenticated users can add books to their wishlist.
*   Verified purchasers can submit star ratings and reviews.

### Order & Delivery System
*   Seamless online purchase experience.
*   Centralized dashboard for order management.
*   Automated status tracking for users and administrators.

### Role-Based Dashboards

| Role | Key Permissions |
| :--- | :--- |
| **Admin** | Manage users, change user roles, and oversee the entire platform. |
| **Librarian** | Manage book inventory (add, update, delete) and handle orders. |
| **User** | Order books, view personal order history, and leave reviews. |

### UI/UX Highlights
*   Fully responsive for mobile, tablet, and desktop.
*   Smooth animations using Framer Motion.
*   Clear and responsive user feedback via custom toasts (react-hot-toast).
*   A modern, clean, and accessible dashboard interface.

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## NPM Dependencies

### Core Libraries
| Package | Purpose |
| :--- | :--- |
| `react`, `react-dom` | Frontend library and rendering. |
| `react-router-dom` | Client-side routing. |
| `axios` | HTTP client for API requests. |

### UI & Styling
| Package | Purpose |
| :--- | :--- |
| `framer-motion` | High-performance animations. |
| `lucide-react` | Modern, customizable icon set. |
| `react-hot-toast` | Lightweight, elegant notifications. |
| `sweetalert2` | Accessible and customizable modals. |
| `daisyui` | Tailwind CSS component library. |
| `tailwindcss` | Utility-first CSS framework. |

### Authentication & API
| Package | Purpose |
| :--- | :--- |
| `firebase` | Google Authentication and hosting. |

---

## Local Development Guide

Follow these steps to run BookOrbit on your local machine.

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn
*   A MongoDB database (local or MongoDB Atlas)
*   A configured Firebase project for authentication

### Step 1: Clone the Repositories
```bash
# Client-side application
git clone https://github.com/shakhawat71/bookorbit-client.git
cd bookorbit-client

# Server-side application
git clone https://github.com/shakhawat71/bookorbit-server.git
cd bookorbit-server
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root of both the **client** and **server** directories.

#### Client (`bookorbit-client/.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

#### Server (`bookorbit-server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Step 3: Install Dependencies

```bash
# In the client directory
npm install

# In the server directory
npm install
```

### Step 4: Start the Development Servers

```bash
# In the client directory
npm run dev

# In the server directory
npm run dev
```

### Step 5: Access the Application
*   **Client Application:** `http://localhost:5173`
*   **Server API:** `http://localhost:5000`

---

## Important Links

| Resource | Link |
| :--- | :--- |
| **Live Application** | [bookorbit-388cb.web.app](https://bookorbit-388cb.web.app/) |
| **Client Repository** | [github.com/shakhawat71/bookorbit-client](https://github.com/shakhawat71/bookorbit-client) |
| **Server Repository** | [github.com/shakhawat71/bookorbit-server](https://github.com/shakhawat71/bookorbit-server) |
| **Developer Portfolio** | [shakhawatdev.xyz](https://shakhawatdev.xyz) |

---

## Developer

**Shakhawat Hossin**  
Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/shakhawat-hossin-4b0712309)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/shakhawat71)
[![Portfolio](https://img.shields.io/badge/Portfolio-255E63?style=flat-square&logo=About.me&logoColor=white)](https://shakhawatdev.xyz)

---
