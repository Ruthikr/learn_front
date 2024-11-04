import React from "react";
import { ACCESS_TOKEN } from "../constants"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function Logout() {
  console.log("Logging out...");
  localStorage.removeItem(ACCESS_TOKEN); // Use the constant here
  localStorage.removeItem(REFRESH_TOKEN); // Also remove refresh token

  // Verify removal
  console.log("Access Token after logout:", localStorage.getItem(ACCESS_TOKEN));
  console.log("Refresh Token after logout:", localStorage.getItem(REFRESH_TOKEN));

  return <Navigate to="/login" />;
}
export default Logout