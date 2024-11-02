import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Home() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userData, setUserData] = useState({ username: 'defaultUser' }); // Replace with actual user data fetching

  const generateAvatarUrl = (username) => {
    // Using Dicebear for appropriate avatars
    const style = 'pixel-art'; // You can change this to any of the above styles
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}&backgroundColor=b6e3f4`;
  };

  useEffect(() => {
    // Assuming you fetch user data here
    // For demonstration, let's use a placeholder user data object
    setUserData({ username: 'exampleUsername' }); // Replace this with actual data fetching logic
    
    // Generate the avatar URL when the username is available
    const avatar = generateAvatarUrl(userData.username);
    setAvatarUrl(avatar);
  }, [userData.username]); // Re-run the effect if the username changes

  return (
    <>
      <Navbar profileImage={avatarUrl} />
      <h1>Home Page</h1>
    </>
  );
}

export default Home;