import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { DriverDataContext } from "../context/DriverContext";
import DeliveryMap from "./components/DeliveryMap";
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const DeliveryDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const { driver } = useContext(DriverDataContext);
  const { socket } = useContext(SocketContext);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDelivery = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deliveries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDelivery(response.data);
    } catch (err) {
      setError("Failed to load delivery details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();

    // Socket setup
    if (socket) {
      socket.emit("join_delivery_room", id);
      socket.on("delivery_updated", setDelivery);
    }

    return () => {
      if (socket) {
        socket.off("delivery_updated");
        socket.emit("leave_delivery_room", id);
      }
    };
  }, [id, socket]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(
        `/api/deliveries/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Delivery #{delivery._id.slice(-6).toUpperCase()}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="h-96">
          <DeliveryMap
            pickup={delivery.pickup.coordinates}
            dropoff={delivery.dropoff.coordinates}
            showRoute
          />
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <StatusBadge status={delivery.status} />

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Route Details</h2>
            <p>From: {delivery.pickup.address}</p>
            <p>To: {delivery.dropoff.address}</p>
            <p>Distance: {(delivery.distance / 1000).toFixed(1)} km</p>
            <p>Estimated Fare: ₹{delivery.fare}</p>
          </div>

          {/* Driver Actions */}
          {driver && (
            <div className="bg-white p-4 rounded-lg shadow space-y-2">
              <h3 className="font-semibold">Delivery Actions</h3>
              <StatusButtons
                currentStatus={delivery.status}
                onUpdate={handleStatusUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    driver_assigned: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
    in_transit: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${statusColors[status]} px-3 py-1 rounded-full text-sm`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
};

const StatusButtons = ({ currentStatus, onUpdate }) => {
  const statusTransitions = {
    pending: [],
    driver_assigned: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const buttonLabels = {
    picked_up: "Mark as Picked Up",
    in_transit: "Start Transit",
    delivered: "Mark as Delivered",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusTransitions[currentStatus].map((status) => (
        <button
          key={status}
          onClick={() => onUpdate(status)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {buttonLabels[status]}
        </button>
      ))}
    </div>
  );
};

export default DeliveryDetails;
