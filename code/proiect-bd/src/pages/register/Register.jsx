import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      
      // Redirect to home page after successful registration
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-wrap bg-white w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Section (Gray Box Inside White Box) */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full h-full flex flex-col justify-between">
            {/* Text Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Community</h2>
              <p className="text-gray-600">
                Register to access hospital services, book appointments, and stay updated with your
                health records.
              </p>
            </div>

            {/* Quotes Section */}
            <div className="bg-gray-200 p-4 rounded-lg mt-4">
              <p className="italic text-gray-700 mb-2">"{quotes[currentQuote].text}"</p>
              <p className="text-sm text-gray-600 font-semibold">- {quotes[currentQuote].author}</p>
            </div>

            {/* Bullets for Quote Navigation */}
            <div className="flex justify-center mt-2">
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

        {/* Right Section (Register Form) */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {message && <div className="text-green-500 text-sm mb-4">{message}</div>}

          <form onSubmit={handleRegister}>
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
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
              Register
            </button>
          </form>

          <div className="text-gray-600 text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
