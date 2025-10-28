# ImpactFlow - Volunteer Matching Platform 

A secure, privacy-first platform that connects volunteers with beneficiaries while maintaining complete anonymity and admin oversight.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-blueviolet.svg)](https://tailwindcss.com/)

![ImpactFlow Banner](https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop)

---

## Overview

ImpactFlow is a modern volunteer matching platform designed to connect people who need help with those willing to provide it, while prioritizing privacy, security, and dignity for all users. The platform features AI-powered matching, admin oversight, and a beautiful, responsive interface.

---

## Current Features

### Landing Page
- **Dynamic Hero Carousel** - Auto-rotating image slider showcasing community impact (6 images, smooth transitions)
- **Animated Statistics** - Impact numbers with smooth slide-in animations when scrolled into view
- **Role Selection Cards** - Beautiful purple-themed cards for Beneficiaries and Volunteers
- **How It Works Section** - Animated numbered steps that slide in from alternating sides
- **Areas of Support** - 9 categories with background imagery showing different types of assistance
- **Privacy-First Section** - Highlighting security features for both beneficiaries and volunteers
- **Testimonials Gallery** - User stories with image lightbox and impact statistics
- **Dark/Light Mode** - Seamless theme switching with localStorage persistence
- **Responsive Design** - Mobile-first approach that works beautifully on all devices

### User Roles & Authentication
- **Beneficiaries** - Request assistance while maintaining privacy
- **Volunteers** - Offer help and skills to those in need
- **Administrators** - Verify users, manage matches, and moderate content
- **Login Modal** - Centralized role selection with informational popup for admin access
- **Protected Routes** - Role-based access control

### Admin Dashboard
- **Animated Statistics Cards** - Real-time stats with smooth animations
  - Matched pairs with pulse effect
  - Vacant beneficiaries tracking
  - System status (Total Users, Beneficiaries, Volunteers)
- **User Verification** - Review and approve pending volunteers and beneficiaries
- **Match Management** - View and manage matched pairs
- **Message Moderation** - Review flagged messages for policy violations
- **Platform Tools** - Report generation, bulk messaging, analytics, and admin management
- **Quick Access Links** - Fast navigation to key admin functions

### User Dashboards
- **Beneficiary Dashboard** - Request help, view matches, communicate anonymously
- **Volunteer Dashboard** - Browse opportunities, view assignments, track impact
- **Chat Interface** - Secure messaging with admin oversight
- **Profile Management** - Update information and preferences

### Design & UX
- **Modern Gradient Design** - Purple and indigo color scheme throughout
- **Smooth Animations** - Intersection Observer-based animations on scroll
- **Hover Effects** - Interactive elements with scale and shadow transitions
- **Loading States** - Skeleton screens and loading indicators
- **Accessibility** - Keyboard navigation and ARIA labels

---

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router 6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **FastAPI** - High-performance Python web framework
- **Python 3.x** - Backend language
- **JSON Storage** - Lightweight data persistence (development)

### Key Libraries & Tools
- **Intersection Observer API** - Scroll-based animations
- **localStorage** - Theme and authentication persistence
- **Unsplash API** - High-quality imagery

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Delight-bot/ImpactFlow.git
   cd ImpactFlow
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python main.py
   # Backend runs on http://localhost:8000
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

---

## Project Structure

```
ImpactFlow/
├── backend/
│   ├── main.py              # FastAPI backend
│   ├── main_local.py        # Local development backend
│   ├── requirements.txt     # Python dependencies
│   └── local_db.json        # Development database
├── src/
│   ├── admin/               # Admin components
│   │   ├── Matched.jsx
│   │   ├── VacantVolunteers.jsx
│   │   ├── VacantBeneficiaries.jsx
│   │   ├── VerifyVolunteers.jsx
│   │   ├── VerifyBeneficiaries.jsx
│   │   └── FlaggedMessages.jsx
│   ├── AdminDashboard.jsx   # Main admin dashboard
│   ├── AdminLogin.jsx       # Admin authentication
│   ├── App.jsx              # Main app component
│   ├── AuthContext.jsx      # Authentication context
│   ├── BeneficiarySignup.jsx
│   ├── BeneficiaryLogin.jsx
│   ├── VolunteerSignup.jsx
│   ├── VolunteerLogin.jsx
│   ├── UserDashboard.jsx    # User dashboard
│   ├── ChatView.jsx         # Messaging interface
│   ├── Landing.jsx          # Landing page with carousel
│   ├── Layout.jsx           # Main layout with navbar
│   ├── LoginModal.jsx       # Role selection modal
│   ├── RoleButtons.jsx      # Join Us buttons
│   ├── Testimonials.jsx     # Impact stories and stats
│   ├── Footer.jsx           # Footer component
│   └── ProtectedRoute.jsx   # Route protection
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

---

## Key Features Breakdown

### Landing Page Animations
- **Hero Carousel**: 6-image auto-rotating slideshow with 2-second fade transitions and subtle zoom effect
- **How It Works**: Numbered steps animate from alternating sides with 200ms stagger
- **Statistics**: Impact numbers slide in from different directions when scrolled into view
- **Smooth Scrolling**: Navigation links smoothly scroll to page sections

### Admin Dashboard Animations
- **Stats Grid**: Slides in from left with continuous pulse animation
- **System Status**: Cards slide up from bottom with sequential 200ms delays
- **Hover Effects**: All cards scale up on hover

### Privacy & Security
- **Admin Access Control**: Informational popup explains admin accounts are created behind the scenes
- **Role-Based Routes**: Protected routes for admin functionality
- **Anonymous Communication**: Beneficiary identity protected by default
- **Admin Oversight**: All messages can be flagged and reviewed

---

## Areas of Support

The platform facilitates help across 9 key categories:

1. Education & Tutoring
2. Housing Assistance
3. Scholarship Support
4. Food & Nutrition
5. Career Development
6. Healthcare Access
7. Guidance & Counseling
8. Legal Assistance
9. School Fees Support
