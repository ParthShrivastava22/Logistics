import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SocketContext } from "../../context/SocketContext";
import { UserDataContext } from "../../context/UserContext";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DeliveryMap = ({
  driverLocation = null,
  deliveries = [],
  onApplyDelivery,
  isDriverView = false,
  onPickupSelect,
  onDropoffSelect,
}) => {
  const mapRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const [error, setError] = useState(null);

  // Search functionality for user view
  const [pickupSearch, setPickupSearch] = useState("");
  const [dropoffSearch, setDropoffSearch] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const pickupSearchRef = useRef(null);
  const dropoffSearchRef = useRef(null);

  // Geocoding function for address suggestions
  const getAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      return data.map((result) => ({
        display: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  };

  // Handle address input changes with debounce
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (pickupSearch.length > 2) {
        const results = await getAddressSuggestions(pickupSearch);
        setPickupSuggestions(results);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [pickupSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (dropoffSearch.length > 2) {
        const results = await getAddressSuggestions(dropoffSearch);
        setDropoffSuggestions(results);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [dropoffSearch]);

  // Handle address selection
  const handleAddressSelect = (type, suggestion) => {
    if (type === "pickup") {
      setPickupSearch(suggestion.display);
      setPickupSuggestions([]);
      if (onPickupSelect)
        onPickupSelect(suggestion.display, [suggestion.lng, suggestion.lat]);
    } else {
      setDropoffSearch(suggestion.display);
      setDropoffSuggestions([]);
      if (onDropoffSelect)
        onDropoffSelect(suggestion.display, [suggestion.lng, suggestion.lat]);
    }
  };

  const isValidCoordinate = (lat, lng) => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Filter valid deliveries
  const validDeliveries = deliveries.filter(
    (d) =>
      d.pickup?.coordinates?.lat &&
      d.pickup?.coordinates?.lng &&
      isValidCoordinate(d.pickup.coordinates.lat, d.pickup.coordinates.lng)
  );

  // Real-time location updates for driver
  useEffect(() => {
    if (!isDriverView || !socket || !driverLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = [position.coords.latitude, position.coords.longitude];
        socket.emit("driver-position-update", {
          driverId: user?._id,
          position: newPos,
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isDriverView, socket, driverLocation, user]);

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={driverLocation || [28.6139, 77.209]}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${
            import.meta.env.VITE_MAPTILER_KEY
          }`}
          attribution='© <a href="https://www.maptiler.com/">MapTiler</a>'
        />

        {/* Driver Location */}
        {isDriverView && driverLocation && (
          <Marker position={driverLocation}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {/* Delivery Markers */}
        {validDeliveries.map((delivery) => {
          const lat = delivery.pickup.coordinates.lat;
          const lng = delivery.pickup.coordinates.lng;

          return (
            <Marker key={delivery._id} position={[lat, lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{delivery.pickup.address}</p>
                  <p>Fare: ₹{delivery.fare}</p>
                  {isDriverView && (
                    <button
                      onClick={() => onApplyDelivery(delivery._id)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Accept Delivery
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Search Inputs for User View */}
      {/* Search Inputs for User View */}
      {!isDriverView && (
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-[1000]">
          <div className="flex-1 bg-white p-2 rounded-lg shadow-lg relative">
            <input
              type="text"
              className="w-full p-2 border-b"
              placeholder="Enter pickup address"
              value={pickupSearch}
              onChange={(e) => setPickupSearch(e.target.value)}
            />
            {pickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddressSelect("pickup", suggestion)}
                  >
                    {suggestion.display}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 bg-white p-2 rounded-lg shadow-lg relative">
            <input
              type="text"
              className="w-full p-2 border-b"
              placeholder="Enter dropoff address"
              value={dropoffSearch}
              onChange={(e) => setDropoffSearch(e.target.value)}
            />
            {dropoffSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                {dropoffSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddressSelect("dropoff", suggestion)}
                  >
                    {suggestion.display}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-4 left-4 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg z-[1000]">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
