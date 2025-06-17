import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser, setLoggedInUser } from "./authSlice";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const userSignedIn = useSelector(selectLoggedInUser);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

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

    if (!isPhoneValid(phone)) {
      setPhoneError("Enter a valid 10-digit phone number.");
      toast.error("Enter a valid phone number.");
      return;
    }

    setResendDisabled(true); // Disable resend temporarily
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/send-otp`,
        { email, phoneNumber: phone, password },
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
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const isPhoneValid = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isEmailValid = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setEmailError(null);
    setPhoneError(null);
    setPasswordError(null);

    try {
      if (!isLogin && !isPhoneValid(phone)) {
        setPhoneError("Enter a valid 10-digit phone number.");
        toast.error("Enter a valid phone number.");
        return;
      }

      if (!isEmailValid(email)) {
        setEmailError("Enter a valid email address.");
        toast.error("Enter a valid email address.");
        return;
      }
      
      let response;
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      if (isLogin) {
        response = await axios.post(`${baseURL}/user/login`, {
          identifier: email,
          password,
        }, { withCredentials: true });
      }

      if (!isLogin && otpSent) {
        const otpCode = otp.join("");
        response = await axios.post(
          `${baseURL}/user/signup`,
          { otp: otpCode },
          { withCredentials: true }
        );
      }

      if (!isLogin && !otpSent) {
        return;
      }

      const { data } = response;
      if (data.success) {
        dispatch(setLoggedInUser(data.user));
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("email", data.user.email);
        toast.success(
          isLogin ? "Logged in successfully!" : "Registered successfully!"
        );
        const isAdmin = data.user.email.endsWith('@admin.com');
        // Redirect accordingly
        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
        if (!isLogin) {
          setIsLogin(true);
          setEmail("");
          setPhone("");
          setPassword("");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleResponse = async (authResult) => {
  //   setIsLoading(true);
  //   try {
  //     const { credential } = authResult;
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/user/googleAuth`,
  //       { credential },
  //       { withCredentials: true }
  //     );
  //     const { data } = response;
  //     if (data.success) {
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("email", data.user.email);
  //       toast.success("Google login successful!");
  //       navigate("/");
  //       if (!isLogin) {
  //         setIsLogin(true);
  //         setEmail("");
  //         setPhone("");
  //         setPassword("");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Google login error:", error);
  //     toast.error("Google login failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: tokenResponse => {
  //     dispatch(googleAuthAsync(tokenResponse.code));
  //   },
  //   onError: () => {
  //     alert('Google login failed');
  //   },
  //   flow: 'auth-code', 
  // });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/googleAuth?code=${tokenResponse.code}`, {}, {withCredentials: true}
        );
        const { data } = response;
        if (data.success) {
          dispatch(setLoggedInUser(data.user));
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("email", data.user.email);
          toast.success("Google login successful!");
          navigate("/");
          if (!isLogin) {
            setIsLogin(true);
            setEmail("");
            setPhone("");
            setPassword("");
          }
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      alert('Google login failed');
      toast.error("Google login failed. Please try again.");
    },
    flow: 'auth-code',
  })

  return (
    <>
    {/* {userSignedIn && <Navigate to="/" replace={true} />} */}
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100"
      style={{
        backgroundImage: `url('login.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 relative">
        {/* Welcome Message */}
        <h1 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white">
          Welcome to <span className="text-pink-500">Dream Portal</span>
        </h1>

        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handleInputChange(setPhone)}
                className={`mt-1 w-full p-2.5 rounded-md border transition-all duration-300 ${
                  phoneError ? "border-red-500" : "border-gray-300"
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter 10-digit phone number"
                required={!isLogin}
              />
              {phoneError && (
                <p className="text-sm text-red-500 mt-1">{phoneError}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className={`mt-1 w-full p-2.5 rounded-md border transition-all duration-300 ${
                emailError ? "border-red-500" : "border-gray-300"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter your email"
              required
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              className={`mt-1 w-full p-2.5 rounded-md border transition-all duration-300 ${
                passwordError ? "border-red-500" : "border-gray-300"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Set a password"
              required
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {!isLogin && !otpSent && (
            <button
              onClick={handleSendOtp}
              className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          )}

          {!isLogin && otpSent && (
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

          {!isLogin && otpSent && (
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

          {(isLogin || otpSent) && (
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          )}

          <button
            onClick={() => handleGoogleLogin()}
            className="flex items-center gap-3 bg-white text-black mx-auto px-6 py-3 rounded-xl shadow hover:shadow-md border border-gray-300 transition-all duration-300"
          >
            <FcGoogle size={24} />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </form>

        {isLogin && (
          <p className="text-sm mt-2 text-center">
            <Link
              to="/forgotpassword"
              className="text-indigo-600 hover:underline"
            >
              Forgot Password ?
            </Link>
          </p>
        )}

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPhone("");
              setPassword("");
            }}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Are you a vendor?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            List your business here
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default UserAuth;
