"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getMyBookings,
  getCalendarEvents,
  cancelBooking,
} from "../services/api.js";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [user, setUser] = useState(null);

  // get my booking and calender view for events

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsData, calendarData] = await Promise.all([
          getMyBookings(),
          getCalendarEvents(),
        ]);
        setBookings(bookingsData.message);
        setCalendarEvents(calendarData.message);
      } catch {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("eventease_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchData();
  }, []);

  // cancle the bokking

  const handleCancelBooking = async (bookingId, eventDate) => {
    const eventDateTime = new Date(eventDate);
    const now = new Date();

    if (eventDateTime <= now) {
      toast.error("Cannot cancel past or ongoing events.");
      return;
    }

    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const toastId = toast.loading("Cancelling booking...");
      try {
        await cancelBooking(bookingId);

        const updatedBookings = await getMyBookings();
        const updatedEvents = await getCalendarEvents();

        setBookings(updatedBookings.message);
        setCalendarEvents(updatedEvents.message);

        toast.success("Booking canceled successfully.", { id: toastId });
      } catch {
        toast.error("Failed to cancel the booking.", { id: toastId });
      }
    }
  };

  const canCancelBooking = (eventDate) => new Date(eventDate) > new Date();

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const calendarDays = Array(firstDayOfMonth)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((i) => i + 1));

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((event) => event.date.startsWith(dateStr));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user?.name || "User"}!
      </h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded ${
            activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 rounded ${
            activeTab === "calendar" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* List View */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 border rounded shadow flex justify-between items-center bg-white"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {booking.event.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong>{" "}
                    {new Date(booking.event.date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {booking.event.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Seats:</strong> {booking.seats}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded inline-block mt-1 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                {booking.status !== "cancelled" &&
                  canCancelBooking(booking.event.date) && (
                    <button
                      onClick={() =>
                        handleCancelBooking(booking._id, booking.event.date)
                      }
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {activeTab === "calendar" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="grid grid-cols-7 gap-3 text-center font-semibold text-gray-700 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={idx}></div>;
              const events = getEventsForDate(day);
              return (
                <div
                  key={idx}
                  className={`border p-2 h-32 bg-white rounded shadow-sm overflow-y-auto relative ${
                    isToday(day) ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className="mt-1 bg-blue-100 p-1 rounded text-xs text-left"
                    >
                      <p className="font-semibold">{event.title}</p>
                      <p>{event.location}</p>
                      <p>
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
