import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SocialLogin = () => {
  const { googleLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogle = (media) => {
    media()
      .then((res) => {
        toast.success("Successfully Loggedin!");

        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        toast.error("Invalid email or password");
      });
  };
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="">
        <h2>Continue with</h2>

        <button
          onClick={() => handleGoogle(googleLogin)}
          className="btn btn-primary"
        >
          Google
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
