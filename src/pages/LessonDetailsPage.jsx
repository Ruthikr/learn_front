import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const response = await api.get(`/api/learning/lessons/${lessonId}/`);
        setLesson(response.data);
      } catch (err) {
        setError(err.message || "Error fetching lesson details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lessonId]);

  const handleAnswerChange = (exerciseId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [exerciseId]: value,
    }));
  };

  const handleSubmit = (exerciseId) => {
    console.log(`Answer for Exercise ${exerciseId}:`, answers[exerciseId]);
  };

  const renderContent = (content) => {
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map((paragraph, index) => {
      const isCodeBlock = /^\s{2,}|\b(function|const|let|var|return|if|else|class|import|export|def|print|console\.log)\b|[{;}=]/.test(paragraph) ||
                          paragraph.includes("{") || paragraph.includes("}") ||
                          /\b(async|await|try|catch|finally)\b/.test(paragraph);

      const isHeader = /^[A-Z\s]+$/.test(paragraph) || 
                       /:$/.test(paragraph.trim()) || 
                       /^(Chapter|Section|Lesson|Overview|Introduction|Conclusion|Summary|Example|Exercise)\b/i.test(paragraph.trim()) || 
                       (paragraph.length < 50 && paragraph === paragraph.toUpperCase());

      if (isCodeBlock) {
        return (
          <motion.pre 
            key={index} 
            className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto mt-4" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <code className="font-mono text-sm">{paragraph.trim()}</code>
          </motion.pre>
        );
      }

      return isHeader ? (
        <motion.h2 
          key={index} 
          className="text-2xl font-bold mt-6 text-gradient-to-r from-gray-600 to-gray-800" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          {paragraph.trim()}
        </motion.h2>
      ) : (
        <motion.p 
          key={index} 
          className="text-lg text-gray-700 my-4 leading-relaxed" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {paragraph.trim()}
        </motion.p>
      );
    });
  };

  return (
    <>
      
      <div className="max-w-4xl min-h-screen
      mx-auto px-9 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <AiOutlineLoading3Quarters className="text-gray-600 animate-spin text-4xl" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-10">Error: {error}</div>
        ) : lesson && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <h1 className="mt-3 mb-5 text-4xl font-extrabold text-center text-gradient-to-r from-gray-600 to-gray-800">
              {lesson.title}
            </h1>
            <div className="mt-4 text-sm">{renderContent(lesson.content)}</div>
            <p className="text-gray-600 mt-4">Order: {lesson.order}</p> 
            <h2 className="text-2xl font-semibold mt-10 mb-4">Exercises</h2>
            <div className="mb-5 grid grid-cols-1 gap-6">
              {lesson.exercises.map((exercise) => (
                <motion.div 
                  key={exercise.id} 
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3, delay: exercise.id * 0.1 }}
                >
                  <div className="mb-2 text-lg font-semibold text-gray-800">
                    <strong>Q:</strong> {exercise.question}
                  </div>
                  <div className="mb-3 text-gray-600 italic">
                    <em>Hint:</em> {exercise.hint}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    value={answers[exercise.id] || ""}
                    onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                  />
                  <button
                    onClick={() => handleSubmit(exercise.id)}
                    className="mt-1 w-full py-3 font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow-lg 
                        hover:from-gray-700 hover:to-gray-900 transition-colors duration-300"
                  >
                    Submit
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
       
      </div>
       <BottomNavbar />
    </>
  );
};

export default LessonDetailPage;
