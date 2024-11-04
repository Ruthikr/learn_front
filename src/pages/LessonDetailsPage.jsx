import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar"
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

  /*if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;*/

  const renderContent = (content) => {
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map((paragraph, index) => {
      // Enhanced Code Block Detection
      const isCodeBlock = /^\s{2,}|\b(function|const|let|var|return|if|else|class|import|export|def|print|console\.log)\b|[{;}=]/.test(paragraph) ||
                          paragraph.includes("{") || paragraph.includes("}") ||
                          /\b(async|await|try|catch|finally)\b/.test(paragraph);

      // Enhanced Header Detection
      const isHeader = /^[A-Z\s]+$/.test(paragraph) ||                      // All uppercase text
                       /:$/.test(paragraph.trim()) ||                       // Ends with a colon
                       /^(Chapter|Section|Lesson|Overview|Introduction|Conclusion|Summary|Example|Exercise)\b/i.test(paragraph.trim()) || // Common header keywords
                       (paragraph.length < 50 && paragraph === paragraph.toUpperCase()); // Short uppercase lines

      if (isCodeBlock) {
        return (
          <pre key={index} className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto mt-4">
            <code className="font-mono text-sm">{paragraph.trim()}</code>
          </pre>
        );
      }

      return isHeader ? (
        <h2 key={index} className="text-2xl font-bold mt-6  text-gradient-to-r  from-gray-600 to-gray-800 ">
          {paragraph.trim()}
        </h2>
      ) : (
        <p key={index} className="text-lg text-gray-700 my-4 leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    });
  };

  return (
    <>
      
      <div className="max-w-4xl h-full mx-auto p-4">
        {lesson && (
          <div>
            <h1 className="mt-3 mb-5 text-3xl font-extrabold text-center text-gradient-to-r from-gray-600 to-gray-800 ">
              {lesson.title}
            </h1>
            <div className="mt-4">{renderContent(lesson.content)}</div>
           <p className="text-gray-600 mt-4">Order: {lesson.order}</p> 
            <h2 className="text-2xl font-semibold mt-10 mb-4">Exercises</h2>
            <div className="mb-5 grid grid-cols-1 gap-6">
              {lesson.exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="mb-2 text-lg font-semibold text-gray-800">
                    <strong>Q:</strong> {exercise.question}
                  </div>
                  <div className="mb-3 text-gray-600 italic">
                    <em>Hint:</em>  ''' {exercise.hint}  '''
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
                        hover:from-gray-700 hover:to-gray-900 transition-colors duration-300 "
                  >
                    Submit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNavbar></BottomNavbar>
    </>
  );
};

export default LessonDetailPage;