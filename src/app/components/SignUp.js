"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";


const Signup = ({ onSwitch }) => {

  // State variables for email and password and routing pages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // API URL
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to handle signup
  const handleSignup = async () => {
    try {
      const response = await axios.post(API_URL + "/signup", {
        email: email, // Ensure this matches the backend's expected field name
        password: password, // Ensure this matches the backend's expected field name
      });

      // Show success toast
      toast.success("Signup successful! Logging in automatically...");

      // Navigate to the login page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Signup</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Signup
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;