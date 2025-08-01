    🟢 EventEase Backend

    A Node.js + Express backend API for the **EventEase** event booking platform. It enables admins to manage events and users to book seats, with robust authentication and role-based access control.

    ---

    ## 📦 Tech Stack

    - **Node.js**
    - **Express.js**
    - **MongoDB** (with Mongoose)
    - **JWT** (Authentication)
    - **Nodemailer** (Email confirmations)
    - **Multer** (Optional file uploads)
    - **Custom Middleware** for logging and auth
    - **Date Formatting**: `toLocaleDateString("en-GB")`

    ---

    ## 📁 Project Structure

    eventease-backend/
    │
    ├── controllers/ # Core business logic
    ├── models/ # Mongoose schemas
    ├── routes/ # API route definitions
    ├── middleware/ # Auth, logger, etc.
    ├── utils/ # Helpers like email sending
    ├── config/ # DB and environment setup
    ├── app.js # Express app setup
    └── server.js # Entry point

    yaml
    Copy
    Edit

    ---

    ## 🚀 Setup Instructions

    ### 1. Clone the repository

    ```bash
    git clone https://github.com/your-username/eventease-backend.git
    cd eventease-backend
    2. Install dependencies
    bash
    Copy
    Edit
    npm install
    3. Set up environment variables
    Create a .env file with the following:

    ini
    Copy
    Edit
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/eventease
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=youremail@example.com
    EMAIL_PASS=yourpassword
    CLIENT_URL=http://localhost:3000
    4. Run the server
    bash
    Copy
    Edit
    npm run dev
    🛠 Features Implemented
    ✅ Core Functionalities
    Feature	Status
    User Registration/Login (JWT)	✅ Done
    Role-based Access (Admin/User)	✅ Done
    Event CRUD (Admin)	✅ Done
    Event Booking (2 seats/user)	✅ Done
    Email Confirmations	✅ Done
    Booking Cancellation	✅ Done
    Event Status Logic (Upcoming, etc)	✅ Done
    Booking Middleware Logging	✅ Done

    📬 API Endpoints
    Auth
    POST /api/auth/register – Register a user

    POST /api/auth/login – User login

    Events
    GET /api/events – Get all events (with filters + pagination)

    POST /api/events – (Admin) Create event

    PUT /api/events/:id – (Admin) Update event

    DELETE /api/events/:id – (Admin) Delete event

    Bookings
    POST /api/bookings/:eventId – Book seats for an event

    GET /api/bookings/my – Get current user’s bookings

    DELETE /api/bookings/:bookingId – Cancel a booking

    📂 Booking Logic
    ✅ Max 2 seats per user per event

    ✅ Capacity enforcement

    ✅ Cannot cancel if event already started

    ✅ Event attendees tracked via user IDs

    📧 Email Setup
    Email is sent using Nodemailer.

    Make sure EMAIL_USER and EMAIL_PASS are configured in .env.

    SMTP service like Gmail or Outlook can be used (enable "less secure apps").

    📅 Date Format Used
    All dates are shown in:

    text
    Copy
    Edit
    DD-MMM-YYYY
    (e.g., 10-Aug-2025)
    📘 API Documentation
    A Postman collection is included in the /docs folder:
    🔗 Download Collection

    ✅ To Do (Backend)
    Feature	Status
    Calendar View Endpoint	❌ Not Done
    Seat Tracker/Waitlist	❌ Not Done
    PDF Ticket Generator	❌ Not Done
    Unit Testing	❌ Not Done

    🤝 Author
    Built by [Your Name] as part of Koders Full Stack Assignment
    📧 Send submission to: info@koders.in

    yaml
    Copy
    Edit

    ---

    Let me know if you'd like the **frontend README** or to include **screenshots, links, or Post