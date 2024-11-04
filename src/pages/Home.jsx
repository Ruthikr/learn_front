import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DiscussionsPage from "./DiscussionsPage"
import {RANDOM_ID} from "../constants";
import BottomNavbar from "../components/BottomNavbar"
function Home() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userData, setUserData] = useState({ username: 'defaultUser' }); // Replace with actual user data fetching

  const generateAvatarUrl = () => {
    // Using Dicebear for appropriate avatars
    const style = 'pixel-art'; // You can change this to any of the above styles
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${RANDOM_ID}&backgroundColor=b6e3f4`;
  };

  useEffect(() => {
    // Assuming you fetch user data here
    // For demonstration, let's use a placeholder user data object
    setUserData(); // Replace this with actual data fetching logic
    
    // Generate the avatar URL when the username is available
    const avatar = generateAvatarUrl();
    setAvatarUrl(avatar);
  }, []); // Re-run the effect if the username changes

  return (
    <>
      
      <DiscussionsPage></DiscussionsPage>
      
    </>
  );
}

export default Home;