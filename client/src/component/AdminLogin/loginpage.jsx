import React, { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import SocialLogin from "../socialLogin/SocialLogin";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const password = e.target.password.value;

    loginUser(phone, password)
      .then((res) => {
        toast.success("Successfully Logged in!");
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        toast.error("Invalid phone number or password");
      });
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Vendor Login</h1>
          </div>
          <div className="card flex-shrink-0 w-[250px] md:w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleLogin} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  name="phone"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
              <p>
                Don’t have an account?{" "}
                <span>
                  <Link to="/signup" className="text-blue-700">
                    Register
                  </Link>
                </span>
              </p>
            </form>
            <div className="p-4">
              <SocialLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
