import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const socket = io(new URL(import.meta.env.VITE_BACKEND_URL).origin);
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"], // Force WebSocket for stability
  secure: true, // Ensure secure connection (HTTPS)
  withCredentials: true, // Send cookies if needed
});

const LiveVisitors = () => {
  const [liveUsers, setLiveUsers] = useState(0);

  useEffect(() => {
    socket.on("updateLiveUsers", (count) => {
      setLiveUsers(count);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const trackActivity = (page) => {
    const userId =
      localStorage.getItem("userId") ||
      `guest_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
    socket.emit("trackActivity", { userId, page });
  };

  useEffect(() => {
    trackActivity(window.location.pathname);
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold">Live Visitors</h2>
      <p className="text-5xl font-extrabold text-pink-600">{liveUsers}</p>
      <p className="text-gray-500">Currently Active Users</p>
    </div>
  );
};

export default LiveVisitors;
