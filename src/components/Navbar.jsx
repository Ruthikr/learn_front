import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, Home, GraduationCap, MessageCircle } from 'lucide-react';

const Navbar = ({ profileImage }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen className="w-6 h-6" />
                        <h1 className="text-xl font-bold">Learn Python</h1>
                    </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-1 hover:text-gray-300">
                            <Home className="w-5 h-5" />
                            <span>Home</span>
                        </Link>
                        <Link to="/courses" className="flex items-center space-x-1 hover:text-gray-300">
                            <GraduationCap className="w-5 h-5" />
                            <span>Courses</span>
                        </Link>
                        <Link to="/discussions" className="flex items-center space-x-1 hover:text-gray-300">
                            <MessageCircle className="w-5 h-5" />
                            <span>Discussions</span>
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center space-x-1 hover:text-gray-300"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                    
                    {/* Profile Image */}
                    <Link to="/profile" className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                            <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>

                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden focus:outline-none" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden mt-2 bg-gray-700 rounded-lg p-4">
                    <div className="flex flex-col space-y-3">
                        <Link to="/" className="flex items-center space-x-2 py-2 hover:text-gray-300">
                            <Home className="w-5 h-5" />
                            <span>Home</span>
                        </Link>
                        <Link to="/courses" className="flex items-center space-x-2 py-2 hover:text-gray-300">
                            <GraduationCap className="w-5 h-5" />
                            <span>Courses</span>
                        </Link>
                        <Link to="/discussions" className="flex items-center space-x-2 py-2 hover:text-gray-300">
                            <MessageCircle className="w-5 h-5" />
                            <span>Discussions</span>
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center space-x-2 py-2 hover:text-gray-300"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;