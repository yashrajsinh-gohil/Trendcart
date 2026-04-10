import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

const readStoredUser = () => {
  const storedUser = localStorage.getItem("trendcart_user");

  if (!storedUser || storedUser === "undefined" || storedUser === "null") {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("trendcart_user");
    localStorage.removeItem("trendcart_token");
    return null;
  }
};

const getResponseUser = (response) => response?.user || response?.data || null;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hydrateAuth = async () => {
      const storedUser = readStoredUser();
      const token = localStorage.getItem("trendcart_token");

      if (!(storedUser && token)) {
        return;
      }

      setUser(storedUser);
      setIsAuthenticated(true);

      try {
        const profileResponse = await api.auth.profile();
        const profileUser = getResponseUser(profileResponse);

        if (!profileUser) {
          throw new Error("Profile response did not include user data");
        }

        setUser(profileUser);
        localStorage.setItem("trendcart_user", JSON.stringify(profileUser));
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("trendcart_user");
        localStorage.removeItem("trendcart_token");
      }
    };

    hydrateAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const normalizedEmail = (email || "").trim().toLowerCase();
      const response = await api.auth.login({ email: normalizedEmail, password });
      const loggedInUser = getResponseUser(response);

      if (!loggedInUser) {
        throw new Error("Login response did not include user data");
      }

      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("trendcart_user", JSON.stringify(loggedInUser));
      localStorage.setItem("trendcart_token", response.token);
      setError("");
      return loggedInUser.role === "admin" ? "/admin/dashboard" : "/";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }
  };

  const register = async (newUser) => {
    try {
      const response = await api.auth.register({
        ...newUser,
        email: (newUser.email || "").trim().toLowerCase(),
      });
      const registeredUser = getResponseUser(response);

      if (!registeredUser) {
        throw new Error("Registration response did not include user data");
      }

      setUser(registeredUser);
      setIsAuthenticated(true);
      localStorage.setItem("trendcart_user", JSON.stringify(registeredUser));
      localStorage.setItem("trendcart_token", response.token);
      setError("");
      return true;
    } catch (err) {
      setError(err.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("trendcart_user");
    localStorage.removeItem("trendcart_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
