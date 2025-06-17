import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const token = location.state?.token;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/resetPass`,
        { token, password },
        { withCredentials: true }
      );
      const { data } = res;
      if (data.success) {
        toast.success("Password Reset successful!");
        setPassword("");
        setConfirmPassword("");
        navigate("/userlogin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/verifyToken`,
          { token },
          { withCredentials: true }
        );
        const { data } = res;
        if (!data.success) {
          navigate("/userlogin");
          toast.error(data.message || "User verification failed.");
        }
      } else {
        navigate("/userlogin");
        toast.error("User Verification Required.");
      }
    };
    console.log("I am in the Reset Password page");
    verifyToken();
  }, [token]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url('login.jpg')` }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 backdrop-blur-xl text-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-center text-2xl text-gray-900 dark:text-white font-extrabold mb-6">
          Welcome to <span className="text-pink-500">Dream Portal</span>
        </h2>
        <h3 className="text-center text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Reset Password
        </h3>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2.5 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full p-2.5 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Update Password"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-300">
          <p className="text-sm">
            Remembered your password?{" "}
            <Link to="/userlogin" className="text-indigo-600 hover:underline">
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
