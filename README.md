        # EventEase-Event-Booking-Platform

        # 🟢 EventEase

        **EventEase** is a full-stack event booking platform enabling users to explore, register, and cancel event bookings with real-time seat updates and email confirmations. Admins can create, edit, and manage events through a secure admin panel.

        ---

        ## 🚀 Tech Stack

        ### 🧠 Backend (Node.js + Express)
        - **Node.js**, **Express.js**
        - **MongoDB** with **Mongoose**
        - **JWT Authentication**
        - **Nodemailer** (for sending booking emails)
        - **Custom Middleware** (auth, logging)
        - **Multer** (optional file upload support)
        - **Date Formatting** using `toLocaleDateString("en-GB")`

        ### 🎨 Frontend ( React)
        - **React**
        - **Tailwind CSS**
        - **React Toastify** (notifications)
        - **Client-side form validation**
        - **Dynamic filtering & modals**

        ---

        Render - https://eventease-event-booking-platform.onrender.com

        ## 📁 Folder Structure

        ### 📦 Backend

        eventease-backend/
        │
        ├── controllers/ # Business logic
        ├── models/ # Mongoose schemas
        ├── routes/ # API routes
        ├── middleware/ # Auth, logger, validation
        ├── utils/ # Email, helpers
        ├── config/ # DB & env config
        ├── app.js # Express setup
        └── server.js # Server entry point

        shell
        Copy
        Edit

        ### 💻 Frontend

        eventease-frontend/
        │
        ├── components/ # UI components
        ├── pages/ # Next.js pages
        ├── services/ # API calls
        ├── styles/ # Tailwind config, globals
        ├── public/ # Assets
        └── app/ # App layout and routing

        yaml
        Copy
        Edit

        ---

        ## ⚙️ Setup Instructions

        ### 🔧 Backend

        1. **Clone the backend repo**
        ```bash
        git clone https://github.com/your-username/eventease-backend.git
        cd eventease-backend
        Install dependencies

        bash
        Copy
        Edit
        npm install
        Create .env file

        env
        Copy
        Edit
        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/eventease
        JWT_SECRET=your_jwt_secret_key
        EMAIL_USER=youremail@example.com
        EMAIL_PASS=yourpassword
        CLIENT_URL=http://localhost:3000
        Run the backend server

        bash
        Copy
        Edit
        npm run dev
        🖼️ Frontend
        Clone the frontend repo

        bash
        Copy
        Edit
        git clone https://github.com/your-username/eventease-frontend.git
        cd eventease-frontend
        Install dependencies

        bash
        Copy
        Edit
        npm install
        Run the development server

        bash
        Copy
        Edit
        npm run dev
        Frontend is available at: http://localhost:3000

        ✨ Features
        ✅ User Features
        Register/Login (JWT Auth)

        Book seats for events (max 2 seats)

        Cancel bookings before event start

        Email confirmations

        View upcoming/past bookings

        ✅ Admin Features
        Create, edit, delete events

        View booking capacity

        Role-based access (admin/user)

        Real-time form UI with validation

        Modal form (no separate page)

       
        📏 Booking Logic
        ✅ Max 2 seats per user per event

        ✅ Seat count cannot exceed event capacity

        ✅ Cannot cancel after event has started

        ✅ Tracks attendees using user IDs

        ✅ Email confirmation sent after booking

        📧 Email Setup
        Email sent using Nodemailer

        Uses .env credentials for authentication

        Supports Gmail (with "less secure apps" enabled or App Passwords)

        Sends booking confirmation to the user's email

        📅 Date Format
        All dates are shown in:

        css
        Copy
        Edit
        DD-MMM-YYYY
        (e.g., 10-Aug-2025)
        📘 Postman API Collection
        A complete Postman collection is available in the /docs folder.

        Import it into Postman for testing all endpoints.

        ✅ Completed Backend Tasks
        Feature	Status
        User Registration/Login (JWT)	✅ Done
        Role-based Access (Admin/User)	✅ Done
        Event CRUD (Admin)	✅ Done
        Event Booking (2 seats/user)	✅ Done
        Email Confirmations	✅ Done
        Booking Cancellation	✅ Done
        Event Status (upcoming/ended)	✅ Done
        Booking Middleware Logging	✅ Done
        Calendar View Endpoint
        🔜 To Do (Backend)
        Feature	Status
        
      
        📸 Frontend Highlights
        📅 Admin panel with event table

        🧾 Inline modal form for create/update (no page redirect)

        🧠 Dynamic form fields (category, location)

        ✅ Toast notifications (React Toastify)

        🔄 Real-time table updates after CRUD

        🔒 Authentication-aware routes

        🤝 Author
        Built by [Your Name]
        🔗 Part of the Koders Full Stack Assignment
        📧 Submit your solution at: info@koders.in

        📄 License
        This project is licensed under the MIT License. See the LICENSE file for more info.

        yaml
        Copy
        Edit

        ---

        Let me know if you'd like:
        - 🎥 Screenshots or screen recordings included
        - 🌐 Live demo links
        - 🧪 Test cases or API testing walkthrough
        - ✏️ Frontend component documentation

        Would you like me to generate the `README.md` as a downloadable file too?