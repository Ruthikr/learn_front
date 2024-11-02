import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

// SuccessModal Component
function SuccessModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white">Registration Successful</h2>
                <p className="text-gray-200 mt-2">You have registered successfully. Please log in to continue.</p>
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={onClose}
                        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

// Form Component
function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showStrengthIndicator, setShowStrengthIndicator] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const evaluatePasswordStrength = (password) => {
        let strength = "Weak";
        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                strength = "Strong";
            } else if (/[A-Z]/.test(password) || /\d/.test(password) || /[^A-Za-z0-9]/.test(password)) {
                strength = "Medium";
            }
        }
        setPasswordStrength(strength);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (method === "register") {
            setShowStrengthIndicator(newPassword.length > 0);
            evaluatePasswordStrength(newPassword);
        }
    };

    const handleRetypePasswordChange = (e) => {
        setRetypePassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (method === "register") {
            if (passwordStrength === "Weak") {
                setError("Please use a stronger password (minimum strength: Medium).");
                return;
            }
            if (password !== retypePassword) {
                setError("Passwords do not match.");
                return;
            }
        }
        setLoading(true);

        try {
            const payload = method === "register" ? { email, username, password } : { username, password };
            const res = await api.post(route, payload);
            
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                setSuccessModalOpen(true);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            const message = error.response?.data?.detail || error.message || "An error occurred. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black p-6">
            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105">
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    {name}
                </h1>
                
                <input
                    className="w-full p-3 mb-4 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                
                {method === "register" && (
                    <input
                        className="w-full p-3 mb-4 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                )}
                
                <input
                    className="w-full p-3 mb-1 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    required
                />
                
                {method === "register" && showStrengthIndicator && (
                    <p className={`text-sm font-semibold mt-2 ${
                        passwordStrength === "Strong" ? "text-green-400" :
                        passwordStrength === "Medium" ? "text-yellow-400" :
                        "text-red-400"
                    }`}>
                        {passwordStrength === "Strong" ? "Strong Password" : 
                         passwordStrength === "Medium" ? "Medium Password" : 
                         "Weak password"}
                    </p>
                )}

                {method === "register" && (
                    <input
                        className="w-full p-3 mb-4 mt-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all"
                        type="password"
                        value={retypePassword}
                        onChange={handleRetypePasswordChange}
                        placeholder="Retype Password"
                        required
                    />
                )}

                {method === "register" && password && retypePassword && password !== retypePassword && (
                    <p className="text-red-400 text-sm mt-2">Passwords do not match.</p>
                )}

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

                {loading && (
                    <div className="flex justify-center mb-4">
                        <LoadingIndicator />
                    </div>
                )}

                <button 
                    type="submit" 
                    className={`mt-5 w-full py-3 font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow-lg 
                        hover:from-gray-700 hover:to-gray-900 transition-colors duration-300 
                        ${method === "register" && passwordStrength === "Weak" ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={method === "register" && passwordStrength === "Weak"}
                >
                    {name}
                </button>

                <div className="text-center mt-4">
                    {method === "register" ? (
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-teal-300 hover:underline">
                                Login
                            </Link>
                        </p>
                    ) : (
                        <p className="text-gray-400">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-teal-300 hover:underline">
                                Register
                            </Link>
                        </p>
                    )}
                </div>
            </form>

            {/* Success Modal */}
            <SuccessModal 
                isOpen={successModalOpen} 
                onClose={() => {
                    setSuccessModalOpen(false);
                    navigate("/login");
                }} 
            />
        </div>
    );
}

export default Form;