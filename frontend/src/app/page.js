"use client"

import LandingPage from "./components/LandingPage";
import { useRef, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


/**
 * Renders the landing route and one-time logout/session toasts.
 */
export default function Home() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    if (localStorage.getItem("sessionExpired") === "true") {
      toast.warning("You are logged out since the session has expired. Please re-login.");
      localStorage.removeItem("sessionExpired");
    }

    if (localStorage.getItem("manualLogout") === "true") {
      toast.info("You are logged out.");
      localStorage.removeItem("manualLogout");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#101828]">
      <LandingPage />
      <ToastContainer position="top-center" newestOnTop />
    </div>
  );
}
