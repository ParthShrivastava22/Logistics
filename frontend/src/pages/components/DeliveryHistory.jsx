import { Link } from "react-router-dom";

// Add this new component above the Map component
export default function DeliveryHistory({ deliveries }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-4">Your Deliveries</h2>
      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <div
            key={delivery._id}
            className="border rounded-lg p-3 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {new Date(delivery.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {delivery.pickup.address} → {delivery.dropoff.address}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    delivery.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : delivery.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {delivery.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p>
                Scheduled: {new Date(delivery.scheduledTime).toLocaleString()}
              </p>
              <Link
                to={`/tracking/${delivery._id}`}
                className="text-blue-600 hover:underline mt-1 inline-block"
              >
                Track Delivery →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
