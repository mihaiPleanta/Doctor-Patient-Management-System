import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  const quotes = [
    {
      text: "Medicine is a science of uncertainty and an art of probability.",
      author: "William Osler",
    },
    {
      text: "Wherever the art of medicine is loved, there is also a love of humanity.",
      author: "Hippocrates",
    },
    {
      text: "The good physician treats the disease; the great physician treats the patient who has the disease.",
      author: "William Osler",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [quotes.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
        const response = await axios.post("http://localhost:5000/login", {
            username,
            password,
        });

        setMessage(response.data.message);

        // Redirect based on admin flag
        if (response.data.admin) {
            navigate("/admin"); // Redirect to Admin Panel if user is admin
        } else {
            navigate("/home"); // Redirect to Home Page if user is not admin
        }
    } catch (err) {
        setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-wrap bg-white w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Section (Login Form) */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {message && <div className="text-green-500 text-sm mb-4">{message}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-gray-600 text-sm text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </div>
        </div>

        {/* Right Section (Gray Box with Slideshow) */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full h-full flex flex-col justify-between">
            {/* Text Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
              <p className="text-gray-600">
                Login to manage your hospital appointments, access health records, and connect with healthcare providers.
              </p>
            </div>

            {/* Quotes Slideshow */}
            <div className="bg-gray-200 p-4 rounded-lg mt-6 flex-grow">
              <p className="italic text-gray-700 mb-2">"{quotes[currentQuote].text}"</p>
              <p className="text-sm text-gray-600 font-semibold">- {quotes[currentQuote].author}</p>
            </div>

            {/* Bullets for Quote Navigation */}
            <div className="flex justify-center mt-4">
              {quotes.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
                    index === currentQuote ? "bg-gray-700" : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentQuote(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
