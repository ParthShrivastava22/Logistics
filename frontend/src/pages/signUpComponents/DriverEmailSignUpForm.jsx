import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { DriverDataContext } from "../../context/DriverContext";

function DriverEmailSignUpForm({ onBack }) {
  const [formData, setFormData] = useState({
    fullname: {
      firstname: "",
      lastname: "",
    },
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    vehicle: {
      type: "",
      maxWeight: "",
      maxVolume: "",
      registration: "",
      vehicleModel: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setDriver } = useContext(DriverDataContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("fullname.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        fullname: {
          ...prev.fullname,
          [field]: value,
        },
      }));
    } else if (name.startsWith("vehicle.")) {
      const vehicleField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [vehicleField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Create newDriver object (exclude confirmPassword)
    const newDriver = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      vehicle: {
        type: formData.vehicle.type,
        maxWeight: Number(formData.vehicle.maxWeight),
        maxVolume: Number(formData.vehicle.maxVolume),
        registration: formData.vehicle.registration,
        vehicleModel: formData.vehicle.vehicleModel,
      },
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/drivers/register`,
        newDriver
      );
      if (response.status === 201) {
        const data = response.data;
        setDriver(data.driver);
        localStorage.setItem("driverToken", data.token);
        navigate("/drivers/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 text-gray-500 hover:text-gray-700 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">
        Partner Sign Up
      </h2>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              name="fullname.firstname"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              name="fullname.lastname"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        {/* Vehicle Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            name="vehicle.type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle</option>
            <option value="3_wheeler">3-Wheeler</option>
            <option value="e_rickshaw">E-Rickshaw</option>
            <option value="mini_truck">Mini Truck</option>
            <option value="delivery_van">Delivery Van</option>
            <option value="tempo_truck">Tempo Truck</option>
            <option value="large_truck">Large Truck</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            name="vehicle.registration"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Weight (kg)
            </label>
            <input
              name="vehicle.maxWeight"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Volume (cubic ft)
            </label>
            <input
              name="vehicle.maxVolume"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Model
          </label>
          <input
            name="vehicle.vehicleModel"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Become a Partner"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/driver/login" className="text-blue-600 hover:underline">
          Already have a partner account? Sign in
        </Link>
      </div>
    </div>
  );
}

export default DriverEmailSignUpForm;
