import React, { useEffect, useState } from "react";

const UserActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/activity`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">User Activity</h2>
      <ul className="space-y-2">
        {activities.map((act, index) => (
          <li key={index} className="p-2 border rounded-md">
            <span className="font-semibold">{act.userId}</span> visited{" "}
            <span className="text-blue-600">{act.page}</span> at{" "}
            {new Date(act.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivity;
