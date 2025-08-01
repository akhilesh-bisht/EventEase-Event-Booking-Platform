import axios from "axios";

const API_BASE_URL = "https://eventease-event-booking-platform.onrender.com/api/v1";

// const API_BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eventease_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("eventease_token");
      localStorage.removeItem("eventease_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

//  AUTH
export async function login(email, password) {
  try {
    const res = await api.post("/users/login", { email, password });
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw new Error(err.response?.data?.message || "Login failed");
  }
}

export async function register(name, email, password , role) {
  try {
    const res = await api.post("/users/signup", { name, email, password , role });
    return res.data;
  } catch (err) {
    console.error("Registration failed:", err);
    throw new Error(err.response?.data?.message || "Registration failed");
  }
}

export async function logout() {
  try {
    const res = await api.post("/users/logout");
    return res.data;
  } catch (err) {
    console.error("Logout failed:", err);
    throw new Error(err.response?.data?.message || "Logout failed");
  }
}

//
// EVENTS
//
export async function getEvents() {
  try {
    const res = await api.get(`/events`);
    return res.data;
  } catch (err) {
    console.error("Get events failed:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch events");
  }
}

export async function getEventById(id) {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("Get event by ID failed:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch event");
  }
}

export async function createEvent(eventData) {
  try {
    const res = await api.post("/events", eventData);
    return res.data;
  } catch (err) {
    console.error("Create event failed:", err);
    throw new Error(err.response?.data?.message || "Failed to create event");
  }
}

export async function updateEvent(id, eventData) {
  try {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  } catch (err) {
    console.error("Update event failed:", err);
    throw new Error(err.response?.data?.message || "Failed to update event");
  }
}

export async function deleteEvent(id) {
  try {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete event failed:", err);
    throw new Error(err.response?.data?.message || "Failed to delete event");
  }
}

//
//  BOOKINGS
//
export async function bookEvent(eventId, seats) {
  try {
    const res = await api.post(`/bookings/${eventId}`, { seats });

    // Check status explicitly if needed
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data?.message || "Booking failed");
    }

    return res.data;
  } catch (err) {
    console.error("Book event failed:", err);
    throw new Error(err.response?.data?.message || "Failed to book event");
  }
}

export async function cancelBooking(bookingId) {
  try {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error("Cancel booking failed:", err);
    throw new Error(err.response?.data?.message || "Failed to cancel booking");
  }
}

export async function getMyBookings() {
  try {
    const res = await api.get("/bookings/me");
    return res.data;
  } catch (err) {
    console.error("Get my bookings failed:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch bookings");
  }
}

export async function getCalendarEvents() {
  try {
    const res = await api.get("/bookings/calendar");
    return res.data;
  } catch (err) {
    console.error("Get calendar events failed:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch calendar events"
    );
  }
}
