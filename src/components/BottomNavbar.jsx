import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  HomeIcon, 
  BookOpen, 
  BookOpenCheck, 
  MessageCircle, 
  MessageCircleDashed, 
  User, 
  UserCircle 
} from "lucide-react";

const BottomNavbar = () => {
  const location = useLocation();

  // Updated function to keep the Courses icon active for /courses, /courses/{anything}, /lessons, and /lessons/{anything}
  const getActiveClass = (path) => {
    if (path === "/courses") {
      return location.pathname.startsWith("/courses") || location.pathname.startsWith("/lessons")
        ? "text-yellow-300"
        : "text-white";
    }
    return location.pathname === path ? "text-yellow-300" : "text-white";
  };

  const getIcon = (path, FilledIcon, OutlineIcon) => {
    if (path === "/courses") {
      return location.pathname.startsWith("/courses") || location.pathname.startsWith("/lessons") ? (
        <FilledIcon size={24} fill="currentColor" />
      ) : (
        <OutlineIcon size={24} />
      );
    }
    return location.pathname === path ? (
      <FilledIcon size={24} fill="currentColor" />
    ) : (
      <OutlineIcon size={24} />
    );
  };

  return (
    <div className="sticky z-60 bottom-0 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
      <nav className="flex justify-around items-center py-3 max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center hover:text-gray-200 transition-colors ${getActiveClass(
            "/"
          )}`}
        >
          {getIcon("/", HomeIcon, Home)}
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/courses"
          className={`flex flex-col items-center hover:text-gray-200 transition-colors ${getActiveClass(
            "/courses"
          )}`}
        >
          {getIcon("/courses", BookOpenCheck, BookOpen)}
          <span className="text-xs">Courses</span>
        </Link>
        <Link
          to="/llm"
          className={`flex flex-col items-center hover:text-gray-200 transition-colors ${getActiveClass(
            "/llm"
          )}`}
        >
          {getIcon("/llm", MessageCircleDashed, MessageCircle)}
          <span className="text-xs">LLM Chat</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center hover:text-gray-200 transition-colors ${getActiveClass(
            "/profile"
          )}`}
        >
          {getIcon("/profile", UserCircle, User)}
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default BottomNavbar;
