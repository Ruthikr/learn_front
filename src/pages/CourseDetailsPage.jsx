import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar"

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/api/learning/courses/${id}/`);
        setCourse(response.data);
      } catch (err) {
        setError(err.message || "Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  return (
    <>
      
      <div className="max-w-4xl h-screen mx-auto p-4">
        {course && (
          <div>
            <h1 className="text-center text-3xl font-bold text-black">{course.title}</h1>
            <p className="text-black text-xl font-semi-bold mt-5">Description: <span className="font-bold">{course.description}</span></p>
            <p className="text-black mt-3 font-bold text-xl">Level: {course.level}</p>
            <p className="text-xl text-black font-bold mt-3">Order: {course.order}</p>
            <h2 className="text-2xl font-semibold mt-6 text-black">Lessons</h2>
            <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 gap-6 mt-1 space-y-4">
              {course.lessons.map((lesson,idx) => (
                <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                    <p className="text-center text-gray-400">Lesson  {idx + 1}</p>
                    <hr className="mt-1 font-light"></hr>
                    <h3 className="mt-3 text-xl font-semibold text-white">{lesson.title}</h3>
                    <p className="text-gray-300 mt-1">{lesson.content.slice(0,100)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNavbar></BottomNavbar>
    </>
  );
};

export default CourseDetailPage;