import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "./loginComponents/GoogleButton";
import DriverEmailLoginForm from "./loginComponents/DriverEmailLoginForm";
import PhoneLoginForm from "./loginComponents/PhoneLoginForm";

function DriverLogin() {
  const [activeForm, setActiveForm] = useState(null);

  const handleBackToOptions = () => {
    setActiveForm(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 p-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-4xl relative">
        <div className="lg:flex lg:items-stretch lg:shadow-lg lg:rounded-xl lg:overflow-hidden">
          {/* Left decorative panel for large screens */}
          <div className="hidden lg:block lg:w-1/2 lg:bg-green-600 lg:relative lg:p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1601758123927-1c8b8e7b9dfb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt=""
                className="absolute top-10 right-10 w-32 h-32 transform rotate-12"
              />
              <img
                src="https://images.unsplash.com/photo-1581091870621-6eb2b5ecf98c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt=""
                className="absolute bottom-16 left-10 w-40 h-40"
              />
              <img
                src="https://images.unsplash.com/photo-1581093448794-39e3c64bca7b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt=""
                className="absolute top-1/4 left-24 w-28 h-28"
              />
              <img
                src="https://images.unsplash.com/photo-1573497168470-70006f15816e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt=""
                className="absolute bottom-1/3 right-20 w-28 h-28"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center items-center">
              <div className="flex items-center mb-6">
                <div className="text-white mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="8" x2="8" y2="8" />
                    <line x1="16" y1="12" x2="8" y2="12" />
                    <line x1="16" y1="16" x2="8" y2="16" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold text-white mb-0">
                  Driver Portal
                </h1>
              </div>
              <p className="text-2xl text-white font-medium text-center opacity-90">
                Ready to hit the road?
              </p>
              <div className="mt-12 bg-green-400 bg-opacity-20 p-6 rounded-lg text-white">
                <h3 className="font-semibold text-lg mb-2">
                  Drive with Confidence
                </h3>
                <p className="text-sm opacity-90">
                  Join our network and get on-demand delivery requests.
                </p>
              </div>
            </div>
          </div>
          {/* Main content panel */}
          <div className="bg-white lg:w-1/2 px-6 py-8 md:p-10 rounded-lg shadow-sm lg:shadow-none">
            {/* Small screen decorative elements */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="/api/placeholder/120/120"
                alt=""
                className="absolute -top-4 -right-4 w-28 h-28 transform rotate-12"
              />
              <img
                src="/api/placeholder/150/150"
                alt=""
                className="absolute -bottom-10 -left-10 w-32 h-32"
              />
              <img
                src="/api/placeholder/100/100"
                alt=""
                className="absolute top-1/4 -left-12 w-24 h-24"
              />
              <img
                src="/api/placeholder/100/100"
                alt=""
                className="absolute bottom-1/4 -right-12 w-24 h-24"
              />
            </div>
            <div className="lg:hidden relative z-10 text-center mb-10">
              <div className="flex items-center justify-center mb-2">
                <div className="text-green-600 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="8" x2="8" y2="8" />
                    <line x1="16" y1="12" x2="8" y2="12" />
                    <line x1="16" y1="16" x2="8" y2="16" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-green-600">
                  Driver Portal
                </h1>
              </div>
              <p className="text-xl text-gray-700 font-medium">
                Ready to hit the road?
              </p>
            </div>
            <div className="relative z-10 space-y-4">
              {activeForm === "phone" ? (
                <PhoneLoginForm onBack={handleBackToOptions} />
              ) : activeForm === "email" ? (
                <DriverEmailLoginForm onBack={handleBackToOptions} />
              ) : (
                <>
                  <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Driver Sign In
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Choose your preferred login method
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveForm("phone")}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Sign in with phone number
                  </button>
                  <GoogleButton />
                  <button
                    onClick={() => setActiveForm("email")}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
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
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Sign in with email
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/driversignup"
                        className="text-blue-600 hover:underline"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-600 mb-2">Not a driver?</p>
                    <Link
                      to="/login"
                      className="inline-block bg-blue-600 text-white font-bold text-lg py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      User Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="relative z-10 text-center text-xs text-gray-400 mt-12">
              <p>
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Terms of Use
                </a>
                ,{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Privacy Policy
                </a>
                , and{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Cookie Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverLogin;
