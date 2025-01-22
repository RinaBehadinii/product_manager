import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {login as loginUser} from "../api/auth";

const Login = () => {
    const {login} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await loginUser(credentials);

            login(data.access, data.user.groups[0]);
            navigate("/products");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}
                  className="bg-white border border-gray-100 p-6 rounded shadow-md drop-shadow-md w-full max-w-sm">
                <h2 className="text-blue-950 text-2xl font-bold mb-4">Login</h2>
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
                        className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4 py-1 rounded-sm w-full">Login
                </button>
                <span
                    className="flex justify-center items-center pt-4 texr-sm text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                    onClick={() => navigate("/register")}>Register</span></form>
        </div>
    );
};

export default Login;
