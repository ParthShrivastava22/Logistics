import React from "react";

const BookingDetails = ({ pickupLocation, dropoffLocation }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-4">Booking Details</h2>
      <div className="space-y-4">
        {pickupLocation && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium">Pickup:</p>
            <p className="text-sm">{pickupLocation.address}</p>
          </div>
        )}
        {dropoffLocation && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-medium">Dropoff:</p>
            <p className="text-sm">{dropoffLocation.address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
