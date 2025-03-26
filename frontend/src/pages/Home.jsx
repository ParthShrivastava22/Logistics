import React, { useState, useEffect, useCallback } from "react";
import DeliveryMap from "./components/DeliveryMap";
import axios from "axios";
import BookingDetails from "./components/BookingDetails";
import Vehicles from "./components/Vehicles";
import Checkout from "./components/Checkout";
import DeliverySchedule from "./components/DeliverySchedule";
import { Link } from "react-router-dom";

export default function Home() {
  const [scheduleTime, setScheduleTime] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [luggage, setLuggage] = useState({
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    type: "boxes",
  });
  const [fareEstimate, setFareEstimate] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [isCalculatingFare, setIsCalculatingFare] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);

  const token = localStorage.getItem("token");

  const calculateFare = useCallback(async () => {
    setIsCalculatingFare(true);
    try {
      // Validate required parameters
      if (!pickupLocation?.coordinates || !dropoffLocation?.coordinates) {
        throw new Error("Please select both pickup and dropoff locations");
      }

      // Prepare parameters
      const params = {
        pickup: JSON.stringify({
          lng: pickupLocation.coordinates[0],
          lat: pickupLocation.coordinates[1],
        }),
        dropoff: JSON.stringify({
          lng: dropoffLocation.coordinates[0],
          lat: dropoffLocation.coordinates[1],
        }),
        weight: Number(luggage.weight),
        dimensions: JSON.stringify({
          length: Number(luggage.dimensions.length),
          width: Number(luggage.dimensions.width),
          height: Number(luggage.dimensions.height),
        }),
        vehicleType: selectedVehicle,
      };
      console.log(params);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/deliveries/get-fare-estimate`,
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFareEstimate(response.data.fare);
    } catch (error) {
      console.error("Fare calculation failed:", {
        error: error.response?.data || error.message,
        config: error.config,
      });
      setFareEstimate(null);
    } finally {
      setIsCalculatingFare(false);
    }
  }, [selectedVehicle, pickupLocation, dropoffLocation, luggage]);

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleType) => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select both pickup and dropoff locations first");
      return;
    }
    setSelectedVehicle(vehicleType);
    setShowBookingForm(true);
  };

  // Handle form submission
  const handleBooking = async () => {
    try {
      // Validate schedule time (at least 2 hours from now)
      const minScheduleTime = new Date();
      minScheduleTime.setHours(minScheduleTime.getHours() + 2);

      if (!scheduleTime || scheduleTime < minScheduleTime) {
        alert("Please select a time at least 2 hours in advance");
        return;
      }

      const bookingData = {
        pickup: {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates,
        },
        dropoff: {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates,
        },
        luggage: {
          weight: Number(luggage.weight),
          dimensions: {
            length: Number(luggage.dimensions.length),
            width: Number(luggage.dimensions.width),
            height: Number(luggage.dimensions.height),
          },
          type: luggage.type,
        },
        paymentMethod,
        vehicleType: selectedVehicle,
        scheduleTime: scheduleTime.toISOString(), // Add schedule time to request
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/deliveries/create`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingStatus({
        success: true,
        data: response.data,
        message: "Delivery scheduled successfully!",
      });
      setShowSchedule(true);
    } catch (error) {
      setBookingStatus({
        success: false,
        message: error.response?.data?.message || "Scheduling failed",
      });
    }
  };

  // Add reschedule handler
  const handleReschedule = async (newTime) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/deliveries/update-status`,
        {
          deliveryId: bookingStatus.data._id,
          status: "rescheduled",
          newScheduleTime: newTime.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingStatus((prev) => ({
        ...prev,
        data: { ...prev.data, scheduledTime: newTime },
      }));
    } catch (error) {
      console.error("Reschedule failed:", error);
    }
  };

  // Recalculate fare when necessary inputs change
  useEffect(() => {
    if (selectedVehicle && pickupLocation && dropoffLocation) {
      calculateFare();
    }
  }, [selectedVehicle, pickupLocation, dropoffLocation, calculateFare]);

  // Reset vehicle selection when booking form is closed
  useEffect(() => {
    if (!showBookingForm) {
      setSelectedVehicle(null);
    }
  }, [showBookingForm]);

  // Fetch user's delivery history
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/deliveries`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDeliveries(response.data);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      } finally {
        setLoadingDeliveries(false);
      }
    };

    fetchDeliveries();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">LogiMove</h1>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            <a href="#" className="hover:text-blue-600">
              Services
            </a>
            <a href="#" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b p-4">
          <div className="space-y-3">
            <a href="#" className="block hover:text-blue-600">
              Services
            </a>
            <a href="#" className="block hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="block hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            {!loadingDeliveries && deliveries.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Recent Deliveries
                </h2>
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div
                      key={delivery._id}
                      className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {delivery.pickup.address} →{" "}
                            {delivery.dropoff.address}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Status:{" "}
                            <span className="capitalize">
                              {delivery.status.replace("_", " ")}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(delivery.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          to={`/deliveries/${delivery._id}`}
                          className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Track Delivery
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showSchedule && bookingStatus?.success ? (
              <DeliverySchedule
                bookingStatus={bookingStatus}
                onReschedule={handleReschedule}
              />
            ) : selectedVehicle ? (
              <Checkout
                luggage={luggage}
                setLuggage={setLuggage}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                fareEstimate={fareEstimate}
                isCalculatingFare={isCalculatingFare}
                bookingStatus={bookingStatus}
                onCancel={() => setSelectedVehicle(null)}
                onConfirm={handleBooking}
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                selectedVehicle={selectedVehicle}
                scheduleTime={scheduleTime}
                setScheduleTime={setScheduleTime}
              />
            ) : (
              <>
                <BookingDetails
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                />
                <Vehicles
                  handleVehicleSelect={handleVehicleSelect}
                  selectedVehicle={selectedVehicle}
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                />
              </>
            )}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3">
            <DeliveryMap
              enableAddressInput={true}
              from={pickupLocation}
              to={dropoffLocation}
              onPickupSelect={(address, coordinates) =>
                setPickupLocation({ address, coordinates })
              }
              onDropoffSelect={(address, coordinates) =>
                setDropoffLocation({ address, coordinates })
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
