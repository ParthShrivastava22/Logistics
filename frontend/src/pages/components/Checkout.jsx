import React from "react";
import { Link } from "react-router-dom";

const vehicleDetails = {
  "3_wheeler": { name: "3 Wheeler Loader", maxWeight: 500 },
  e_rickshaw: { name: "E-Rickshaw Loader", maxWeight: 300 },
  mini_truck: { name: "Mini Truck", maxWeight: 1500 },
  delivery_van: { name: "Delivery Van", maxWeight: 1000 },
  tempo_truck: { name: "Tempo Truck", maxWeight: 4000 },
  large_truck: { name: "Large Cargo Truck", maxWeight: 10000 },
};

const Checkout = ({
  luggage,
  setLuggage,
  paymentMethod,
  setPaymentMethod,
  fareEstimate,
  isCalculatingFare,
  bookingStatus,
  onCancel,
  onConfirm,
  pickupLocation,
  dropoffLocation,
  selectedVehicle,
  scheduleTime,
  setScheduleTime,
}) => {
  const { name: vehicleName, maxWeight } =
    vehicleDetails[selectedVehicle] || {};

  // Add date formatting function
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Checkout Details</h3>

      <div className="space-y-4">
        {/* Location and Vehicle Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          {pickupLocation && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium">Pickup Location</p>
              <p className="text-sm mt-1">{pickupLocation.address}</p>
            </div>
          )}

          {dropoffLocation && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="font-medium">Dropoff Location</p>
              <p className="text-sm mt-1">{dropoffLocation.address}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Selected Vehicle</p>
              <p className="text-sm mt-1">{vehicleName}</p>
            </div>
            <div>
              <p className="font-medium">Max Capacity</p>
              <p className="text-sm mt-1">{maxWeight} kg</p>
            </div>
          </div>
        </div>

        {/* Luggage Details Form */}
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            value={luggage.weight}
            onChange={(e) => setLuggage({ ...luggage, weight: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Length"
              value={luggage.dimensions.length}
              onChange={(e) =>
                setLuggage({
                  ...luggage,
                  dimensions: { ...luggage.dimensions, length: e.target.value },
                })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Width"
              value={luggage.dimensions.width}
              onChange={(e) =>
                setLuggage({
                  ...luggage,
                  dimensions: { ...luggage.dimensions, width: e.target.value },
                })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Height"
              value={luggage.dimensions.height}
              onChange={(e) =>
                setLuggage({
                  ...luggage,
                  dimensions: { ...luggage.dimensions, height: e.target.value },
                })
              }
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Luggage Type</label>
          <select
            value={luggage.type}
            onChange={(e) => setLuggage({ ...luggage, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="boxes">Boxes</option>
            <option value="furniture">Furniture</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Corrected Delivery Scheduling Section */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Preferred Delivery Time
          </label>
          <input
            type="datetime-local"
            min={new Date(Date.now() + 2 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)}
            value={formatDateTimeLocal(scheduleTime)}
            onChange={(e) => {
              const selected = new Date(e.target.value);
              setScheduleTime(isNaN(selected) ? null : selected);
            }}
            className="w-full p-2 border rounded-lg"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Please select a time at least 2 hours in advance
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="online">Online Payment</option>
            <option value="cash">Cash</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>

        {/* Fare Estimate */}
        {isCalculatingFare ? (
          <div className="text-sm text-gray-500">Calculating...</div>
        ) : (
          fareEstimate && (
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-semibold">Estimated Fare: ₹{fareEstimate}</p>
            </div>
          )
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>

        {/* Booking Status Message */}
        {bookingStatus && (
          <div
            className={`mt-4 p-3 rounded ${
              bookingStatus.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {bookingStatus.message}
            {bookingStatus.success && (
              <div className="mt-2">
                <p>OTP: {bookingStatus.data.otp}</p>
                <Link
                  to={`/tracking/${bookingStatus.data._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Track Delivery
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
