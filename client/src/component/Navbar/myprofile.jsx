import React from "react";

const Profile = () => {
  // Here you can fetch user details using the token if necessary
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Or fetch user data from your API

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">My Profile</h1>
      <div className="mt-4">
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
