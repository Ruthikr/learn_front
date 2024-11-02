import React, { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: 'Loading...',
    email: 'Loading...',
    bio: 'Loading...',
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate a consistent avatar URL based on username
  const generateAvatarUrl = (username) => {
    // Using Dicebear for appropriate avatars
    // Options: adventurer, avataaars, bottts, pixel-art, identicon
    const style = 'pixel-art'; // You can change this to any of the above styles
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}&backgroundColor=b6e3f4`;
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
            bio: userData.bio || 'This user has no bio.',
          });
          
          // Generate avatar URL based on username
          const avatar = generateAvatarUrl(userData.username);
          setAvatarUrl(avatar);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar profileImage={avatarUrl} />
      <div className="flex flex-col items-center justify-start flex-1 p-4">
        <div className="relative w-32 h-32">
          {isLoading ? (
            <div className="w-full h-full rounded-full border-4 border-gray-300 shadow-lg bg-gray-200 flex items-center justify-center animate-pulse">
              <UserCircle className="w-20 h-20 text-gray-400" />
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt={`${profileData.username}'s avatar`}
              className="w-full h-full rounded-full border-4 border-gray-300 shadow-lg object-cover"
            />
          )}
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{profileData.username}</h2>
          <p className="text-gray-600 mt-2">{profileData.email}</p>
          <div className="mt-4 max-w-md mx-auto">
            <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;