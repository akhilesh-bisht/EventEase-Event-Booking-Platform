"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/api";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    capacity: "",
  });

  const categories = ["Tech", "Workshop", "Webinar", "Conference", "Sports"];
  const locations = ["Online", "In-Person"];

  useEffect(() => {
    loadEvents();
  }, []);

  // load all events api call

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.message || []);
    } catch {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // handle for create events

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      date: new Date(formData.date).toISOString(),
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, payload);
        toast.success("Event updated");
      } else {
        await createEvent(payload);
        toast.success("Event created");
      }
      await loadEvents();
      resetForm();
    } catch {
      toast.error("Error saving event");
    }
  };

  // event edit

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      date: event.date.split("T")[0],
      capacity: event.capacity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // event delete

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      await loadEvents();
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
      capacity: "",
    });
    setEditingEvent(null);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Panel</h1>

      {/* Always-visible form */}
      <div className="bg-white p-6 rounded-md shadow mb-8 border">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {editingEvent ? "Edit Event" : "Create Event"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="p-2 border rounded col-span-2"
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="col-span-2 p-2 border rounded"
            required
          />
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            {editingEvent && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingEvent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* Events Table */}
      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-left">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Location</th>
                <th className="p-2">Date</th>
                <th className="p-2">Seats</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{event.title}</td>
                  <td className="p-2">{event.category}</td>
                  <td className="p-2">{event.location}</td>
                  <td className="p-2">{formatDate(event.date)}</td>
                  <td className="p-2">
                    {event.totalSeatsBooked || 0} / {event.capacity}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-2 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
