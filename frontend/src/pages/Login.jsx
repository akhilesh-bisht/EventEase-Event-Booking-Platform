import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // some validate emails
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // login func

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/");
      } else {
        toast.error(result.error || "Invalid credentials. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-800 to-cyan-600">
      <div className="bg-[#1b1f38] rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 mt-4 bg-cyan-400 px-6 py-2 rounded-md text-black font-semibold text-sm">
          SIGN IN
        </div>

        <form onSubmit={handleLogin} className="mt-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-[#2c3053] text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-[#2c3053] text-white placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 mt-6 py-2 text-black rounded-md font-semibold hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
