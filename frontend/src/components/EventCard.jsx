import { Calendar, MapPin, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { bookEvent } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const EventCard = ({ event, showBookButton }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [seatCount, setSeatCount] = useState(1);

  const {
    _id,
    title,
    description,
    location,
    date,
    capacity,
    totalSeatsBooked = 0,
    remainingSeats = capacity - totalSeatsBooked,
    category,
  } = event;
   
  // handle booking event 

  const handleBookClick = async () => {
    if (!user) {
      toast.error("You must be logged in to book this event.");
      navigate("/login");
      return;
    }

    if (seatCount < 1 || seatCount > 2) {
      toast.error("You can only book 1 or 2 seats.");
      return;
    }

    if (seatCount > remainingSeats) {
      toast.error("Not enough seats left for your request.");
      return;
    }

    setIsBooking(true);
    try {
      await bookEvent(_id, seatCount);
      toast.success(`Successfully booked ${seatCount} seat(s)!`);
      navigate(`/events/${_id}`);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Booking failed.";
      toast.error(message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
      <h3 className="text-xl font-semibold text-gray-800">
        <Link to={`/events/${_id}`} className="hover:underline">
          {title}
        </Link>
      </h3>

      <p className="text-gray-600">{description}</p>

      <div className="flex flex-wrap text-sm text-gray-500 gap-2">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(date).toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {totalSeatsBooked} / {capacity} attending
        </div>
        {category && (
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {category}
          </div>
        )}
      </div>

      {showBookButton && (
        <>
          <div className="mt-2">
            <label className="text-sm text-gray-700 mr-2">Seats:</label>
            <select
              value={seatCount}
              onChange={(e) => setSeatCount(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[1, 2].map((n) => (
                <option key={n} value={n} disabled={n > remainingSeats}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleBookClick}
            disabled={isBooking || remainingSeats === 0}
            className={`mt-2 w-full py-2 rounded text-white transition ${
              isBooking || remainingSeats === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isBooking ? "Booking..." : "Book Now"}
          </button>
        </>
      )}
    </div>
  );
};

export default EventCard;
