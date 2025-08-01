import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (form.name.length < 2) {
      toast.error("Name must be at least 2 characters long.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use AuthContext register function with role
      const result = await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      if (result.success) {
        toast.success("Account created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/");
      } else {
        toast.error(result.error || "Signup failed. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please check your input and try again.", {
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
        {/* Top Sign Up Label */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-400 px-6 py-2 rounded-md text-black font-semibold text-sm">
          SIGN UP
        </div>

        {/* User Avatar */}
        <div className="flex justify-center">
          <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#1b1f38]">
            <svg
              className="w-10 h-10 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-[#2c3053] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            required
            minLength={2}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-[#2c3053] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-[#2c3053] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            required
            minLength={6}
          />

          {/* Role Selection (Radio Buttons) */}
          <div className="mt-4 text-white">
            <label className="text-white block mb-2">Select Role:</label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mr-2"
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mr-2"
                />
                Admin
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 mt-4 py-2 text-black rounded-md font-semibold hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
