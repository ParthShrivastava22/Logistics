import React, { useState, useEffect } from "react";
import axios from "axios";
import DeliveryMap from "./components/DeliveryMap";
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
import { Link } from "react-router-dom";

const DriverHome = () => {
  // Add driver state
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const initializeDriver = async () => {
      try {
        // Check authentication first
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/driverlogin";
          return;
        }

        // Get driver's current location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });

        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update driver location
        await axios.patch(
          `${API_BASE_URL}/drivers/location`, // Add full URL
          coordinates,
          getAuthHeader()
        );

        // Fetch driver profile
        const profileRes = await axios.get(
          `${API_BASE_URL}/drivers/profile`,
          getAuthHeader()
        );
        setVehicleType(profileRes.data.driver.vehicle.type);
        setCurrentDriver(profileRes.data.driver); // Store driver data

        // Fetch nearby deliveries
        const deliveriesRes = await axios.get(
          `${API_BASE_URL}/deliveries/nearby`,
          {
            ...getAuthHeader(), // Merge headers
            params: {
              lat: coordinates.lat,
              lng: coordinates.lng,
              maxDistance: 5000, // Changed from 70000 to 5000 meters (5km)
              vehicleType: profileRes.data.driver.vehicle.type,
            },
          }
        );

        const assignedRes = await axios.get(
          `${API_BASE_URL}/deliveries/assigned`,
          getAuthHeader()
        );
        setAssignedDeliveries(assignedRes.data);

        setDriverLocation([coordinates.lat, coordinates.lng]);
        setDeliveries(deliveriesRes.data);
      } catch (error) {
        console.error("Initialization error:", error);
        setError(error.response?.data?.message || "Failed to load driver data");
        if (error.response?.status === 401) {
          console.log(error);
          localStorage.removeItem("token");
          window.location.href = "/driverlogin";
        }
      } finally {
        setLoading(false);
      }
    };

    initializeDriver();
  }, []);

  // Update handleApply function
  const handleApply = async (deliveryId) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/deliveries/assign-driver`,
        { deliveryId },
        getAuthHeader()
      );

      if (data.success) {
        // Refresh both lists
        const [nearbyRes, assignedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/deliveries/nearby`, {
            ...getAuthHeader(),
            params: {
              lat: driverLocation[0],
              lng: driverLocation[1],
              maxDistance: 5000,
              vehicleType,
            },
          }),
          axios.get(`${API_BASE_URL}/deliveries/assigned`, getAuthHeader()),
        ]);

        setDeliveries(nearbyRes.data);
        setAssignedDeliveries(assignedRes.data);
      }
    } catch (error) {
      console.error("Application error:", error);
      alert(error.response?.data?.message || "Application failed");
    }
  };

  // Update the DeliveryCard rendering
  {
    deliveries.map((delivery) => (
      <DeliveryCard
        key={delivery._id}
        delivery={delivery}
        onApply={handleApply}
        currentDriverId={currentDriver?._id} // Add this prop
      />
    ));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Responsive Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Delivery App Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              Delivery Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden md:block">
              {currentDriver?.name}
            </span>
            <div className="dropdown relative">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Grid */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="spinner animate-spin text-4xl">🚚</div>
              <p className="mt-4 text-gray-600">Loading deliveries...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Deliveries Column - Stacked on Large Screens */}
            <div className="xl:col-span-1 space-y-6">
              {/* Available Deliveries */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Available Deliveries
                  </h2>
                  <span className="text-sm text-gray-500">(5km radius)</span>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                  {Array.isArray(deliveries) && deliveries.length > 0 ? (
                    deliveries.map((delivery) => (
                      <DeliveryCard
                        key={delivery._id}
                        delivery={delivery}
                        onApply={handleApply}
                        currentDriverId={currentDriver?._id}
                      />
                    ))
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                      No deliveries available
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Deliveries */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Assigned Deliveries
                </h2>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                  {assignedDeliveries.length > 0 ? (
                    assignedDeliveries.map((delivery) => (
                      <DeliveryCard
                        key={delivery._id}
                        delivery={delivery}
                        onApply={handleApply}
                        currentDriverId={currentDriver?._id}
                      />
                    ))
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                      No assigned deliveries
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map - Expanded on Large Screens */}
            <div className="xl:col-span-2 h-[500px] xl:h-[80vh]">
              {driverLocation ? (
                <div className="h-full w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <DeliveryMap
                    driverLocation={driverLocation}
                    deliveries={Array.isArray(deliveries) ? deliveries : []}
                    onPickupSelect={() => {}}
                    onDropoffSelect={() => {}}
                    onApplyDelivery={handleApply}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-lg shadow">
                  <p className="text-gray-500 text-center">
                    Enable location access to view map
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Delivery Card component remains the same as in the previous version
const DeliveryCard = ({ delivery, onApply, currentDriverId }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-gray-800">
          Delivery #{delivery._id.slice(-6)}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{delivery.pickup.address}</p>
        <p className="text-sm text-gray-600">→ {delivery.dropoff.address}</p>
      </div>
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
        {(delivery.distance / 1000).toFixed(1)} km
      </span>
    </div>

    <div className="border-t border-gray-200 pt-3 mt-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-600">Delivery Fare</span>
        <span className="font-bold text-green-600">₹{delivery.fare}</span>
      </div>

      {delivery.driver && delivery.driver._id === currentDriverId ? (
        <Link
          to={`/driver/deliveries/${delivery._id}`}
          className="w-full block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Track Delivery
        </Link>
      ) : (
        <button
          onClick={() => onApply(delivery._id)}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Accept Delivery
        </button>
      )}
    </div>
  </div>
);

export default DriverHome;
