import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from '../components/Navbar';
import BottomNavbar from "../components/BottomNavbar";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/learning/courses/");
        setCourses(response.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const profileImage = "https://i.waifu.pics/~t660pc.png";

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <>
    
      <div className="pb-16  bg-gray-50 min-h-screen">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center pt-8 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm">
          Courses
        </h1>

        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700 mt-10">Loading courses...</div>
        ) : error ? (
          <div className="text-red-500 text-center text-lg mt-10">Error: {error}</div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => handleCourseClick(course.id)}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 mt-2 mb-4">{course.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-blue-600">Level: {course.level}</span>
                  <span className="text-sm text-gray-500">Lessons: {course.lessons_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavbar />
    </>
  );
};

export default CoursesPage;