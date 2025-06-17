import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

  const isEmailValid = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move cursor to the rightmost position
      setTimeout(() => {
        e.target.setSelectionRange(1, 1);
      }, 0);

      // Move to next input if not empty
      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    // Validation before OTP request
    if (!isEmailValid(email)) {
      setEmailError("Enter a valid email address.");
      toast.error("Enter a valid email address.");
      return;
    }

    setResendDisabled(true); // Disable resend temporarily
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forgotPass`,
        { email },
        { withCredentials: true }
      );

      const { data } = response;
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
        setTimer(30); // Reset timer only on success

        // Start countdown
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendDisabled(false); // Enable resend if failed
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setResendDisabled(false);
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError(null);

    try {
      if (!otpSent) {
        return;
      }

      if (!isEmailValid(email)) {
        setEmailError("Enter a valid email address.");
        toast.error("Enter a valid email address.");
        return;
      }

      let response;
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      if (otpSent) {
        const otpCode = otp.join("");
        response = await axios.post(
          `${baseURL}/user/verifyOtp`,
          { otp: otpCode },
          { withCredentials: true }
        );
      }

      const { data } = response;
      if (data.success) {
        const token = data.token;
        toast.success("User Verified!");
        navigate("/resetPassword", { state: { token } });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('login.jpg')`,
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 backdrop-blur-xl text-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-center text-2xl text-gray-900 dark:text-white font-extrabold mb-6">
          Welcome to <span className="text-pink-500">Dream Portal</span>
        </h2>
        <h3 className="text-center text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Forgot Password
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full p-2.5 rounded-md border transition-all duration-300 ${
                emailError ? "border-red-500" : "border-gray-300"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter Registered Email"
              required
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          {!otpSent && (
            <button
              onClick={handleSendOtp}
              className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Send OTP"}
            </button>
          )}

          {otpSent && (
            <>
              <div className="text-white text-sm md:text-xl mb-2">
                Enter OTP
              </div>
              <div className="grid grid-cols-4 gap-1 justify-center mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="dark:bg-gray-700 dark:border-gray-600 w-14 h-14 mx-auto text-center text-2xl border border-gray-300 rounded-md outline-none focus:border-blue-600 shadow-md"
                  />
                ))}
              </div>
            </>
          )}

          {otpSent && (
            <button
              onClick={handleSendOtp}
              className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          )}

          {otpSent && (
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </button>
          )}
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
}

export default ForgotPassword;
