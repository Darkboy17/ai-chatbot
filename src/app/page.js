"use client"

import LandingPage from "./components/LandingPage";
import { useRef, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Home() {
  const isMounted = useRef(false); // Track initial mount

  useEffect(() => {
    if (isMounted.current) return; // Skip if already mounted
    isMounted.current = true; // Mark as mounted

    const token = localStorage.getItem("token");
    const hasLoggedInOnce = localStorage.getItem("hasLoggedInOnce");
    if (!token && hasLoggedInOnce) {
      toast("You are logged out since the session has expired. Please re-login.");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <LandingPage />
      <ToastContainer />
    </div>
  );
}
