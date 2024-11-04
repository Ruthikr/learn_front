import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailsPage";
import LessonDetailsPage from "./pages/LessonDetailsPage"; // Import the new LessonDetailsPage
import DiscussionsPage from "./pages/DiscussionsPage"; // Import DiscussionsPage
import LLMPage from "./pages/LLMPage"; // Import the new LLMPage
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ACCESS_TOKEN, REFRESH_TOKEN, RANDOM_ID } from "./constants";
import BottomNavbar from './components/BottomNavbar'
import ScrollToTop from './ScrollToTop'
function RegisterAndLogout() {
  console.log("Logging out...");
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  console.log("Access Token after logout:", localStorage.getItem(ACCESS_TOKEN));
  console.log("Refresh Token after logout:", localStorage.getItem(REFRESH_TOKEN));
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions" // New route for Discussions Page
          element={
            <ProtectedRoute>
              <DiscussionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/llm" // New route for LLM Page
          element={
            <ProtectedRoute>
              <LLMPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;