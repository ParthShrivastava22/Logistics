import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "./loginComponents/GoogleButton";
import DriverEmailSignUpForm from "./signUpComponents/DriverEmailSignUpForm";
import PhoneSignUpForm from "./signUpComponents/PhoneSignUpForm";

function DriverSignUp() {
  const [activeForm, setActiveForm] = useState(null);

  const handleBackToOptions = () => {
    setActiveForm(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-4xl relative">
        <div className="lg:flex lg:items-stretch lg:shadow-lg lg:rounded-xl lg:overflow-hidden">
          {/* Left panel - Updated imagery for drivers */}
          <div className="hidden lg:block lg:w-1/2 lg:bg-blue-600 lg:relative lg:p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Truck"
                className="absolute top-10 right-10 w-32 h-32 transform rotate-12"
              />
              <img
                src="https://images.unsplash.com/photo-1606756790138-261d2b7cd3d1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Loading"
                className="absolute bottom-16 left-10 w-40 h-40"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center items-center">
              <div className="flex items-center mb-6">
                <div className="text-white mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold text-white mb-0">ShipEasy</h1>
              </div>
              <p className="text-2xl text-white font-medium text-center opacity-90">
                Join our network of professional carriers
              </p>
              <div className="mt-12 bg-blue-400 bg-opacity-20 p-6 rounded-lg text-white">
                <h3 className="font-semibold text-lg mb-2">
                  Earn More with Your Vehicle
                </h3>
                <p className="text-sm opacity-90">
                  Connect with shippers nationwide and maximize your vehicle's
                  earning potential
                </p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="bg-white lg:w-1/2 px-6 py-8 md:p-10 rounded-lg shadow-sm lg:shadow-none">
            <div className="lg:hidden relative z-10 text-center mb-10">
              <div className="flex items-center justify-center mb-2">
                <div className="text-blue-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-blue-600">ShipEasy</h1>
              </div>
              <p className="text-xl text-gray-700 font-medium">
                Become a Porter Partner
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {activeForm === "phone" ? (
                <PhoneSignUpForm onBack={handleBackToOptions} />
              ) : activeForm === "email" ? (
                <DriverEmailSignUpForm onBack={handleBackToOptions} />
              ) : (
                <>
                  <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Partner Sign Up
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Choose your preferred sign up method
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveForm("phone")}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {/* Phone icon remains same */}
                    Sign up with phone number
                  </button>

                  <GoogleButton text="Sign up with Google" />

                  <button
                    onClick={() => setActiveForm("email")}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {/* Email icon remains same */}
                    Sign up with email
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Already a partner?{" "}
                      <Link
                        to="/driverlogin"
                        className="text-blue-600 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-600 mb-2">Not a driver?</p>
                    <Link
                      to="/signup"
                      className="inline-block bg-blue-600 text-white font-bold text-lg py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      User Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverSignUp;
