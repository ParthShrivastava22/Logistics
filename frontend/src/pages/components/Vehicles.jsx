// Vehicles.jsx
import React from "react";

const vehicleData = [
  {
    type: "3_wheeler",
    name: "3 Wheeler Loader",
    maxWeight: 500,
    price: "₹499",
  },
  {
    type: "e_rickshaw",
    name: "E-Rickshaw Loader",
    maxWeight: 300,
    price: "₹399",
  },
  {
    type: "mini_truck",
    name: "Mini Truck (Tata Ace)",
    maxWeight: 1500,
    price: "₹899",
  },
  {
    type: "delivery_van",
    name: "Delivery Van",
    maxWeight: 1000,
    price: "₹799",
  },
  {
    type: "tempo_truck",
    name: "Tempo Truck",
    maxWeight: 4000,
    price: "₹1499",
  },
  {
    type: "large_truck",
    name: "Large Cargo Truck",
    maxWeight: 10000,
    price: "₹2999",
  },
];

const Vehicles = ({
  handleVehicleSelect,
  selectedVehicle,
  pickupLocation,
  dropoffLocation,
}) => {
  const canSelectVehicle = pickupLocation && dropoffLocation;

  const handleClick = (vehicleType) => {
    if (!canSelectVehicle) return;
    handleVehicleSelect(vehicleType);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Available Vehicles</h2>

      {!canSelectVehicle && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
          Please select both pickup and dropoff locations first
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {vehicleData.map((vehicle) => (
          <div
            key={vehicle.type}
            className={`p-4 border rounded-lg transition-colors
                ${
                  selectedVehicle === vehicle.type
                    ? "border-blue-500 bg-blue-50"
                    : canSelectVehicle
                    ? "cursor-pointer hover:border-blue-200"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
            onClick={() =>
              canSelectVehicle && handleVehicleSelect(vehicle.type)
            }
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                <p className="text-sm text-gray-500">
                  Capacity: {vehicle.maxWeight}kg
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{vehicle.price}</p>
                <p className="text-sm text-gray-500">Base fare</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
