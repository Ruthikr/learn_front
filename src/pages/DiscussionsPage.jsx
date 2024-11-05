import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, X, Send, Heart, Share2, Bookmark, Loader } from 'lucide-react';
import api from '../api';
import BottomNavbar from "../components/BottomNavbar";

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFullContent, setShowFullContent] = useState({});
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });
  const [likes, setLikes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Generate random image for each discussion
  const getRandomImage = (id) => `https://picsum.photos/seed/${id}/900/900`;

  // Generate random author avatar
  const getRandomAvatar = (name) => `https://api.multiavatar.com/${name}.svg`;

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/community/discussions/');
        setDiscussions(response.data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscussions();
  }, []);

  useEffect(() => {
    // Load likes from local storage
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
    setLikes(storedLikes);
  }, []);

  const toggleFullContent = (discussionId) => {
    setShowFullContent((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const toggleComments = (discussionId) => {
    setShowComments((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const handleCommentChange = (discussionId, content) => {
    setNewComments((prev) => ({ ...prev, [discussionId]: content }));
  };

  const handleAddComment = async (e, discussionId) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/community/comments/', {
        content: newComments[discussionId] || "",
        discussion: discussionId,
      });
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((discussion) =>
          discussion.id === discussionId
            ? { ...discussion, comments: [...discussion.comments, response.data] }
            : discussion
        )
      );
      setNewComments((prev) => ({ ...prev, [discussionId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleLike = (discussionId) => {
    const newLikes = {
      ...likes,
      [discussionId]: !likes[discussionId],
    };
    setLikes(newLikes);
    localStorage.setItem('likes', JSON.stringify(newLikes)); // Persist likes
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/community/discussions/', newDiscussion);
      setDiscussions([response.data, ...discussions]);
      setShowCreateForm(false);
      setNewDiscussion({ title: "", content: "" });
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br bg-slate-50 pt-4 sm:p-6 lg:p-8">
        <div className="mb-12 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm">
            Discussions
          </h1>

          {/* Create Discussion Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="ml-4 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-5 rounded-xl mb-8 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg font-semibold"
          >
            {showCreateForm ? <X size={20} /> : <Plus size={20} />}
            {showCreateForm ? "Cancel" : "Start a New Discussion"}
          </motion.button>

          {/* Create Discussion Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/40 backdrop-blur-md p-8 rounded-2xl mb-8 shadow-xl border border-white/50"
              >
                <form onSubmit={handleCreateDiscussion} className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-500 mb-6">Create New Discussion</h2>
                  <div className="space-y-2">
                    <label className="text-blue-500 font-medium block">Title</label>
                    <input
                      type="text"
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                      placeholder="Write an engaging title..."
                      className="w-full p-4 rounded-xl bg-white/80 border border-blue-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-blue-500 font-medium block">Content</label>
                    <textarea
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                      placeholder="Share your thoughts in detail..."
                      className="w-full p-4 rounded-xl bg-white/80 border border-blue-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg"
                      rows="6"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-5 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg font-semibold text-lg"
                  >
                    Publish Discussion
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Spinner */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mt-12"
            >
              <Loader size={48} className="text-blue-500" />
            </motion.div>
          )}

          {/* Discussion Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {discussions.map((discussion) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className=" group relative overflow-hidden text-white rounded-sm bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50 backdrop-blur-lg"
              >
                {/* Author Section */}
                <div className="relative p-4 pb-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={getRandomAvatar(discussion.author.id)}
                        alt={discussion.author.name}
                        className=" h-12 rounded-full ring-4 ring-white/50 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm font-semibold">{discussion.author.username}</span>
                      <div className="text-slate-500 text-sm">
                        {new Date(discussion.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour:'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Discussion Title */}
                  <h2 className="font-bold text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm mb-2 line-clamp-2">{discussion.title}</h2>
                </div>

                {/* Cover Image */}
                <div className="px-">
                  <img
                    src={getRandomImage(discussion.id)}
                    alt="Discussion cover"
                    className="w-full max-h-[350px] min-h-[300px] object-cover shadow-lg"
                  />
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <div className="mb-5">
                    {discussion.content.length > 150 ? (
                      <>
                        <p className="text-slate-700 leading-relaxed break-words overflow-hidden">
                          {showFullContent[discussion.id]
                            ? discussion.content
                            : `${discussion.content.slice(0, 150)}...`}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFullContent(discussion.id)}
                          className="mt-2 text-blue-600 hover:text-blue-900 font-bold transition-colors duration-300"
                        >
                          {showFullContent[discussion.id] ? "Show Less" : "Read More"}
                        </motion.button>
                      </>
                    ) : (
                      <p className="text-slate-700 leading-relaxed break-words overflow-hidden">
                        {discussion.content}
                      </p>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center justify-between border-t pt-3 ">
                    <div className="flex items-center gap-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(discussion.id)}
                        className={`flex items-center gap-2 ${
                          likes[discussion.id] ? 'text-rose-500' : 'text-rose-600'
                        } hover:text-rose-600 transition-colors duration-300 font-medium`}
                      >
                        <Heart
                          size={20}
                          fill={likes[discussion.id] ? "currentColor" : "none"}
                        />
                        {likes[discussion.id] ? 'Liked' : 'Like'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleComments(discussion.id)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors duration-300 font-medium"
                      >
                        <MessageSquare size={20} />
                        {discussion.comments.length} Comments
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-slate-500 hover:text-blue-600 transition-colors duration-300"
                      >
                        <Share2 size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-slate-500 hover:text-blue-600 transition-colors duration-300"
                      >
                        <Bookmark size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments[discussion.id] && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">Comments</h3>
                      {discussion.comments.length > 0 ? (
                        discussion.comments.map((comment) => (
                          <div key={comment.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/60">
                            <p className="text-slate-700 "> {comment.content}</p>
                            <div className="text-slate-500 text-xs mt-2">
                              By <span className="font-semibold "><u>{comment.author.username}</u></span> on{' '}
                              {new Date(comment.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No comments yet. Be the first to add one!</p>
                      )}
                      
                      <form onSubmit={(e) => handleAddComment(e, discussion.id)} className="flex gap-4 mt-4">
                        <input
                          type="text"
                          value={newComments[discussion.id] || ""}
                          onChange={(e) => handleCommentChange(discussion.id, e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 p-3 rounded-xl border border-white/60 bg-white/70 backdrop-blur-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                          required
                        />
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                        >
                          <Send size={22} />
                        </motion.button>
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="mb-5 text-center text-slate-400 text-sm md:text-xl "> @You reached the end</p>
      </div>
      <BottomNavbar></BottomNavbar>
    </>
  );
};

export default DiscussionsPage;
