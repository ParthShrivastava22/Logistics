import React, { useState } from "react";
import { Link } from "react-router-dom";

const DeliverySchedule = ({ bookingStatus, onReschedule }) => {
  const [newTime, setNewTime] = useState(null);

  const handleRescheduleClick = () => {
    if (!newTime) {
      alert("Please select a new time");
      return;
    }
    onReschedule(newTime);
  };

  // Format the datetime-local input value correctly
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Delivery Scheduled</h3>

      <div className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="font-medium">Scheduled Time</p>
          <p className="text-sm mt-1">
            {new Date(bookingStatus.data.scheduledTime).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium">Estimated Arrival</p>
            <p className="text-sm mt-1">
              {new Date(
                bookingStatus.data.estimatedArrival
              ).toLocaleTimeString()}
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="font-medium">Driver Details</p>
            <p className="text-sm mt-1">
              {bookingStatus.data.driver?.name || "Awaiting driver assignment"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            New Preferred Time
          </label>
          <input
            type="datetime-local"
            min={new Date(Date.now() + 2 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)}
            value={formatDateTimeLocal(newTime)}
            onChange={(e) => {
              const selected = new Date(e.target.value);
              setNewTime(isNaN(selected) ? null : selected);
            }}
            className="w-full p-2 border rounded-lg mb-3"
          />
          <button
            onClick={handleRescheduleClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Schedule
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onReschedule}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Reschedule
          </button>
          <Link
            to={`/tracking/${bookingStatus.data._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Track Delivery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliverySchedule;
