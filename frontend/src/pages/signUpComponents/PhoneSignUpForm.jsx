// PhoneSignUpForm.jsx
import { useState } from "react";

function PhoneSignUpForm({ onBack, onSignIn }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    // Simulate sending a verification code
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
    }, 1500);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length < 4) {
      setError("Please enter a valid verification code");
      return;
    }

    setIsLoading(true);

    // Simulate verification and sign up
    setTimeout(() => {
      setIsLoading(false);
      console.log("User signed up with phone", phoneNumber);
      if (onSignIn) onSignIn();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
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
        {codeSent ? "Enter verification code" : "Sign up with phone"}
      </h2>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      {!codeSent ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label
              htmlFor="phone-signup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone-signup"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label
              htmlFor="code-signup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Verification Code
            </label>
            <input
              id="code-signup"
              type="text"
              placeholder="Enter verification code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Sign Up"}
          </button>

          <button
            type="button"
            className="w-full text-blue-600 text-sm"
            onClick={() => setCodeSent(false)}
          >
            Use a different phone number
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600 mr-2">
          Already have an account?
        </span>
        <button
          type="button"
          onClick={() => onSignIn && onSignIn()}
          className="text-sm text-blue-600 hover:underline"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default PhoneSignUpForm;
