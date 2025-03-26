import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignup";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import DriverSignUp from "./pages/DriverSignUp";
import DriverLogin from "./pages/DriverLogin";
import Home from "./pages/Home";
import DriverHome from "./pages/DriverHome";
import DriverProtectWrapper from "./pages/DriverProtectWrapper";
import DeliveryDetails from "./pages/DeliveryDetails";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/driversignup" element={<DriverSignUp />} />
        <Route path="/driverlogin" element={<DriverLogin />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route
          path="/driverhome"
          element={
            <DriverProtectWrapper>
              <DriverHome />
            </DriverProtectWrapper>
          }
        />
        // Add these routes
        <Route
          path="/deliveries/:id"
          element={
            <UserProtectWrapper>
              <DeliveryDetails />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/driver/deliveries/:id"
          element={
            <DriverProtectWrapper>
              <DeliveryDetails />
            </DriverProtectWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
