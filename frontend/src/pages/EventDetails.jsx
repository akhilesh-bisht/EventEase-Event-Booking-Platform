"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, bookEvent } from "../services/api";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import { formatDate } from "../utils/dateUtils";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [seats, setSeats] = useState(1);

  // for get events full details

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const res = await getEventById(id);
          console.log("Fetched:", res);
          setEvent(res.message); // <- Use 'message' from API
        }
      } catch (err) {
        console.error("Failed to load event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!event || !id) return;

    setBooking(true);
    try {
      const success = await bookEvent(id, seats);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setBooking(false);
    }
  };

  const getEventStatus = (eventDateStr) => {
    const now = new Date();
    const eventDate = new Date(eventDateStr);
    return eventDate > now ? "Upcoming" : "Completed";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-800";
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h2>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const availableSeats =
    event.remainingSeats ?? event.capacity - event.totalSeatsBooked;
  const isFullyBooked = availableSeats <= 0;
  const status = getEventStatus(event.date);
  const canBook = status === "Upcoming" && !isFullyBooked;
  const maxSeats = Math.min(2, availableSeats);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            </div>

            <p className="text-lg text-gray-600 mb-6">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Event Date</p>
                    <p className="text-sm">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm">
                      {availableSeats} of {event.capacity} seats available
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-sm">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">
                    ${event.price ?? 0}
                  </span>
                  <span className="text-gray-600 ml-2">per seat</span>
                </div>

                {isFullyBooked && (
                  <p className="text-red-600 font-medium">
                    This event is fully booked
                  </p>
                )}
                {status === "Completed" && (
                  <p className="text-gray-600 font-medium">
                    This event has ended
                  </p>
                )}
              </div>

              {canBook && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">
                      Seats:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setSeats(Math.max(1, seats - 1))}
                        disabled={seats <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">
                        {seats}
                      </span>
                      <button
                        onClick={() => setSeats(Math.min(maxSeats, seats + 1))}
                        disabled={seats >= maxSeats}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      (max 2 per user)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${((event.price ?? 0) * seats).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={booking}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {booking ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        `Book ${seats} Seat${seats > 1 ? "s" : ""}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {canBook && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">
                  Booking Information:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You can book up to 2 seats per event</li>
                  <li>• Bookings can be cancelled before the event starts</li>
                  <li>• You will receive a confirmation email after booking</li>
                  <li>• Please arrive 15 minutes before the event starts</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
