import React, { useEffect, useState } from 'react';
import { UserCircle, Calendar, MessageCircle, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';
import BottomNavbar from "../components/BottomNavbar";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';



const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: 'Loading...',
    email: 'Loading...',
    bio: 'Loading...',
    progress_level: 'Loading...',
    id: null,
  });
  const [discussions, setDiscussions] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');

  const generateAvatarUrl = (username) => {
    const style = 'adventurer';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}&backgroundColor=b6e3f4&backgroundType=gradientLinear,solid&scale=80`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/profile/');
        if (response.status === 200) {
          const userData = response.data;
          setProfileData({
            username: userData.username,
            email: userData.email,
            bio: userData.bio || 'You have no bio.',
            progress_level: userData.progress_level,
            id: userData.id,
          });
          setNewBio(userData.bio || '');
          setAvatarUrl(generateAvatarUrl(userData.username));

          // Fetch discussions
          const discussionsResponse = await api.get('/api/community/discussions/');
          // Filter discussions for current user and get top 5 recent posts
          const userDiscussions = discussionsResponse.data
            .filter(discussion => discussion.author.id === userData.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          
          setDiscussions(userDiscussions);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBioSubmit = async () => {
    try {
      const response = await api.put('/api/users/profile/update/', { bio: newBio });
      if (response.status === 200) {
        setProfileData((prevData) => ({ ...prevData, bio: newBio }));
        setEditingBio(false);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative w-32 h-32">
              {isLoading ? (
                <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center animate-pulse">
                  <UserCircle className="w-20 h-20 text-blue-400" />
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt={`${profileData.username}'s avatar`}
                  className="w-full h-full rounded-full shadow-lg object-cover border-4 border-black"
                />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{profileData.username}</h2>
              <p className="text-gray-600 mt-2">{profileData.email}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <Award className="w-5 h-5 text-blue-500 mr-2" />
                <p className="text-gray-700">Level {profileData.progress_level}</p>
              </div>
              
            </div>
          </div>

          {/* Enhanced Bio Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-bl-full opacity-50" />
            
            {editingBio ? (
              <div className="space-y-4 relative">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Your Bio</h3>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                <div className="flex gap-4">
                  <button 
                    onClick={handleBioSubmit}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                  >
                    Save Bio
                  </button>
                  <button 
                    onClick={() => setEditingBio(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">About Me</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{profileData.bio}</p>
                <button 
                  onClick={() => setEditingBio(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md inline-flex items-center"
                >
                  Edit Bio
                </button>
              </div>
            )}
          </div>
           
          {/* Recent Discussions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-800">Recent Discussions</h3>
              <span className="text-sm text-gray-600">Showing top 5 recent posts</span>
            </div>
            
            {discussions.length > 0 ? (
              <div className="grid gap-6">
                {discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:translate-y-px"
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      {discussion.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{discussion.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(discussion.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {discussion.comments_count || 0} comments
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No discussions yet. Start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;