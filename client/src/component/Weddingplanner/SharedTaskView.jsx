import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharedTaskView = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`
        );
        setTask(response.data);
      } catch (err) {
        setError("Failed to load task");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Task not found</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {task.title}
          </h1>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Assigned to:</p>
              <p className="text-lg font-medium">{task.assignedTo}</p>
            </div>
            <div>
              <p className="text-gray-600">Description:</p>
              <p className="text-lg">{task.description}</p>
            </div>
            <div>
              <p className="text-gray-600">Status:</p>
              <p
                className={`text-lg font-medium ${
                  task.completed ? "text-green-600" : "text-blue-600"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTaskView;
