import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, UserCircle } from 'lucide-react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import './Navbar.css';
import { BrainCircuit } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-2">
                    <BrainCircuit className="w-6 h-6" />
                    <h1 className="text-xl font-bold">Learn Python</h1>
                </Link>

                {/* Profile and Logout Section */}
                <div className="flex items-center space-x-6">
                    {/* Profile Icon Only */}
                  

                    {/* Logout Button with Text Below Icon */}
                    <button 
                        onClick={handleLogout} 
                        className="flex flex-col items-center  hover:text-gray-300"
                    >
                        <LogOut className=" w-5 h-5" />
                        <span className="text-xs">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;