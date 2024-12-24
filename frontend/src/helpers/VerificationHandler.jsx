import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function EmailVerificationHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (!token) {
        navigate("/dashboard", {
          state: {
            verificationStatus: "error",
            message: "Invalid or missing token.",
          },
        });
        return;
      }

      try {
        const response = await axios.get(
          `/api/auth/verify-email?token=${token}`
        );
        if (response.status === 200) {
          navigate("/dashboard", {
            state: {
              verificationStatus: "success",
              message: "Email verified successfully.",
            },
          });
        } else {
          navigate("/dashboard", {
            state: {
              verificationStatus: "error",
              message: response.data.message,
            },
          });
        }
      } catch (error) {
        navigate("/dashboard", {
          state: {
            verificationStatus: "error",
            message:
              error.response?.data?.message ||
              "An error occurred during verification.",
          },
        });
      }
    };

    verifyEmail();
  }, [navigate, location.search]);

  // add loader?
  return <div>Verifying...</div>;
}

export default EmailVerificationHandler;
