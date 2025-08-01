import React, { createContext, useContext, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("eventease_user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("eventease_user");
      return null;
    }
  });

  // login fun

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);

      const user = data?.message?.user;
      const token = data?.message?.token;

      if (user && token) {
        localStorage.setItem("eventease_token", token);
        localStorage.setItem("eventease_user", JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      console.error("Login failed:", err);
      const backendMessage = err?.response?.data?.message;
      return {
        success: false,
        error:
          typeof backendMessage === "string"
            ? backendMessage
            : err.message || "Login failed",
      };
    }
  };

  // register fun
  const register = async (name, email, password , role) => {
    try {
      const data = await registerApi(name, email, password , role);

      console.log(data);
      

      const user = data?.message?.user;
      const token = data?.message?.token;

      if (user && token) {
        localStorage.setItem("eventease_token", token);
        localStorage.setItem("eventease_user", JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      console.error("Registration failed:", err);
      const backendMessage = err?.response?.data?.message;
      return {
        success: false,
        error:
          typeof backendMessage === "string"
            ? backendMessage
            : err.message || "Registration failed",
      };
    }
  };

  // logout

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("eventease_token");
      localStorage.removeItem("eventease_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
