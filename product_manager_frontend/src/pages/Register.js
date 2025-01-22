import React, {useState} from "react";
import {register as registerUser} from "../api/auth";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [credentials, setCredentials] = useState({username: "", email: "", password: ""});
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            await registerUser(credentials);
            setMessage("User registered successfully. Please login.");
        } catch (err) {
            setError("Error registering user. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}
                  className="bg-white border border-gray-100 p-6 rounded shadow-md drop-shadow-md w-full max-w-sm">
                <h2 className="text-blue-950 text-2xl font-bold mb-4">Register</h2>
                {message && <p className="text-blue-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit"
                        className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4 py-1 rounded-sm w-full">Register
                </button>
                <span
                    className="flex justify-center items-center pt-4 texr-sm text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                    onClick={() => navigate("/login")}>Login</span>
            </form>
        </div>
    );
};

export default Register;
